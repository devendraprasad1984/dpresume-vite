# LiveLogs Enhancements — Design

**Date:** 2026-09-01
**Status:** Approved (pending spec review)
**Builds on:** `2026-09-01-livelogs-tab-design.md` (the existing LiveLogs tab)

## Goal

Add six quality-of-life features to the existing LiveLogs tab:

1. Cluster picker (list clusters from the account, pick one).
2. Service picker (list services for the chosen cluster, pick one).
3. Contains-filter on both pickers.
4. Auto-persist of non-secret form fields to browser `localStorage`.
5. A global **Clear** button that resets the whole tab.
6. Console features: a **multi-term filter** (add/remove terms) and a **Record**
   toggle that appends the (optionally filtered) live output to `~/logs.txt`.

## Decisions (locked with the user)

- **Persistence storage:** browser `localStorage` (no new server file/route).
- **Persist creds:** NO. Only `devkey`, `region`, `cluster`, `service` are
  persisted. The AWS `export` creds textarea is never written to `localStorage`.
- **Save behavior:** auto-save on every change; a global **Clear** button wipes
  everything.
- **Manual ARN entry:** kept as an editable fallback alongside the pickers.
- **Record file mode:** append to `~/logs.txt`.
- **Record scope:** follows the on-screen filter — no filter records everything;
  an active filter records only the lines that pass the filter.
- **Filter combination semantics:** OR / union. A line is visible if the filter
  list is empty OR the line contains ANY active term (case-insensitive substring).

## Global Constraints (inherited)

- Node ESM, Node v24, no build step (HTML/JS served as-is).
- Server binds `127.0.0.1` only. AWS creds are in-memory only (never disk/logs).
- Backend user errors are `Error` with `err.status = 400` (via `throwBad`),
  mapped to JSON by `server.js`'s `handleApi`.
- GET handlers receive `(body, searchParams)` and read via `q.get(...)`.
- All values interpolated into DOM/URLs in `livelogs.html` must be HTML-escaped
  / `encodeURIComponent`'d.
- The only file the Record feature may write is `~/logs.txt` — a fixed path from
  `os.homedir()`, never a user-supplied path.

## Architecture

Unchanged transport model: `livelogs.html` (iframe) → fetch JSON routes +
`EventSource` SSE → `server.js` → `lib/livelogs.js`. The new work adds two
list endpoints, one record-control endpoint, a per-stream registry so the SSE
handler can write to `~/logs.txt`, and client-side persistence/filter/record UI.

---

## 1 & 2. Cluster and service pickers (backend)

Add to `lib/livelogs.js`, mirroring `lib/aws.js` (`ecsListClusters` /
`ecsListServices`) but using the LiveLogs creds store and the existing
`ecsClient()`, `chunk()`, `shortName()`, `requireCreds()`, `throwBad()` helpers.

New imports from `@aws-sdk/client-ecs`:
`ListClustersCommand`, `DescribeClustersCommand`, `ListServicesCommand`,
`DescribeServicesCommand`.

```js
export async function listClusters(deps = {}) {
  const client = deps.ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(new ListClustersCommand({ nextToken: token }));
    arns.push(...(res.clusterArns || []));
    token = res.nextToken;
  } while (token);
  const clusters = [];
  for (const batch of chunk(arns, 100)) {
    const res = await client.send(new DescribeClustersCommand({ clusters: batch }));
    for (const c of res.clusters || []) {
      clusters.push({
        name: c.clusterName, arn: c.clusterArn, status: c.status,
        runningTasks: c.runningTasksCount, activeServices: c.activeServicesCount,
      });
    }
  }
  return { clusters };
}

export async function listServices({ cluster } = {}, deps = {}) {
  if (!cluster || !String(cluster).trim()) throwBad("cluster is required.");
  const client = deps.ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(
      new ListServicesCommand({ cluster, nextToken: token, maxResults: 100 }));
    arns.push(...(res.serviceArns || []));
    token = res.nextToken;
  } while (token);
  const services = [];
  for (const batch of chunk(arns, 10)) {
    const res = await client.send(
      new DescribeServicesCommand({ cluster, services: batch }));
    for (const s of res.services || []) {
      services.push({
        name: s.serviceName, arn: s.serviceArn, status: s.status,
        desired: s.desiredCount, running: s.runningCount, launchType: s.launchType,
      });
    }
  }
  return { services };
}
```

Both call `requireCreds()` implicitly via `ecsClient()`. `deps` is the same test
seam pattern used by `listTasks`/`prepare` (inject a fake client in unit tests).

### Routes (server.js)

```js
"GET /api/livelogs/clusters": () => livelogs.listClusters(),
"GET /api/livelogs/services": (b, q) => livelogs.listServices({ cluster: q.get("cluster") }),
```

---

## 3. Contains-filter on the pickers (UI)

Reuse the AWS Tunnel pattern: a `<input type="search">` above each list whose
`input` event hides non-matching `<tbody>` rows (case-insensitive substring on
the row's text). Helpers `filterRows(tableId, query)` + `wireFilter(inputId,
tableId)` ported into `livelogs.html`.

---

## 1 & 2 (UI). Picker layout

The target `<fieldset>` becomes:

- **List clusters** button → renders `#clustersTable` (filterable). Each row has
  the cluster name/status/counts and is clickable; clicking sets the cluster ARN
  input to `row.arn` and visually marks the row selected.
- **Cluster ARN** text input — editable fallback (also set by clicking a row).
- **List services** button (uses the current cluster ARN) → renders
  `#servicesTable` (filterable). Clicking a row sets the service ARN input.
- **Service ARN** text input — editable fallback.
- **List tasks** button + task table (unchanged behavior).

All list values (`arn`, `name`, etc.) are HTML-escaped / attribute-escaped when
interpolated, exactly as the existing task table does.

---

## 4. Auto-persist non-secret fields (localStorage)

- Storage key: `livelogs.form`. Value: JSON `{ devkey, region, cluster, service }`.
- On `input` of any of those four fields, write the object to `localStorage`.
- On page load, read the object and populate the four fields (missing keys left
  at their defaults).
- The creds textarea (`#exports`) is intentionally excluded — never persisted.

```js
const LS_KEY = "livelogs.form";
const PERSIST = ["devkey", "region", "cluster", "service"];
function saveForm(){
  const o = {}; for (const id of PERSIST) o[id] = $(id).value;
  try { localStorage.setItem(LS_KEY, JSON.stringify(o)); } catch {}
}
function loadForm(){
  try {
    const o = JSON.parse(localStorage.getItem(LS_KEY) || "{}");
    for (const id of PERSIST) if (typeof o[id] === "string") $(id).value = o[id];
  } catch {}
}
PERSIST.forEach(id => $(id).addEventListener("input", saveForm));
loadForm();
```

---

## 5. Global Clear button

A **Clear** button in the connect panel that:

- Stops any active stream (`stopStream()`).
- Empties every input including `#exports`, plus the console buffer/filters.
- Clears the cluster/service/task tables.
- Removes `livelogs.form` from `localStorage`.

```js
$("clearAll").onclick = () => {
  stopStream();
  ["devkey","exports","region","cluster","service"].forEach(id => { $(id).value = ""; });
  $("region").value = "us-west-2";           // restore default
  clearTable("clustersTable"); clearTable("servicesTable"); clearTable("tasksTable");
  logBuffer = []; renderConsole();
  filterTerms = []; renderFilterChips();
  try { localStorage.removeItem(LS_KEY); } catch {}
  setMsg($("msg"), "Cleared.");
};
```

---

## 6a. Console multi-term filter (client-side)

- All received lines are pushed into a capped buffer `logBuffer` (keep the last
  **5000** lines; drop from the front beyond that).
- `filterTerms` is an array of strings, rendered as removable chips. An input +
  **Add** button appends a non-empty, non-duplicate term; each chip has a `×` to
  delete it. Pressing Enter in the input also adds.
- `lineMatches(line)` = `filterTerms.length === 0 || filterTerms.some(t =>
  line.toLowerCase().includes(t.toLowerCase()))`.
- `renderConsole()` rebuilds `#console` textContent from `logBuffer.filter(
  lineMatches)`. Called on every filter add/remove.
- On a live line: push to `logBuffer` (trim to cap); if `lineMatches(line)`,
  append it to the visible console (incremental, preserving auto-scroll).
- While recording, adding/removing a term re-POSTs the term list to the server
  (see 6b) so the file mirrors the on-screen view.

## 6b. Record toggle (server-side append to ~/logs.txt)

**Per-stream id.** `handleLiveLogsStream` generates a random `streamId`
(`randomUUID()`), registers it in a module-level `Map` `recorders`
(`streamId -> { on:false, terms:[] }`), sends it to the client as the first SSE
event (`event: streamid\ndata: <id>\n\n`), and deletes it from the map in
`finish()` (closing the append handle if open).

**Forward hook.** When the SSH child emits a line, after writing it to the SSE
response the handler checks the recorder entry; if `on` and (`terms` empty OR the
line matches any term, case-insensitive), it appends `line + "\n"` to
`~/logs.txt` via an append `WriteStream` opened lazily on first write.

**Control endpoint.**

```js
"POST /api/livelogs/record": (b) => livelogs.setRecording(b),
```

`setRecording({ streamId, on, terms })` validates `streamId` (must exist in
`recorders`), coerces `on` to boolean and `terms` to an array of strings, updates
the registry entry, and returns `{ ok:true, path:"~/logs.txt", on }`. Turning
`on:false` flushes/closes the append stream for that id. Unknown `streamId` →
`throwBad("Unknown stream.")`.

**File path.** `join(os.homedir(), "logs.txt")` — fixed, never user-controlled.
Opened with `flags:"a"` (append). No truncation.

**Client.** A **● Record** toggle button in the console controls. Its state is
tracked in `recording`. On toggle (only meaningful while a stream is active and
`streamId` is known), POST `/api/livelogs/record { streamId, on:recording,
terms:filterTerms }`. When filters change while `recording`, re-POST with the new
`terms`. The button label reflects state (`● Record` / `■ Recording…`).

### Why the registry lives in server.js vs lib/livelogs.js

The append-stream lifecycle is tied to the SSE response lifecycle, which lives in
`server.js`'s `handleLiveLogsStream`. `lib/livelogs.js` owns the registry Map and
the pure `setRecording` mutation (unit-testable); `server.js` owns the actual
`WriteStream` and the forward hook that consults the registry. `lib/livelogs.js`
exposes `getRecorder(streamId)`, `registerRecorder(streamId)`,
`removeRecorder(streamId)`, and `setRecording(body)` plus a `__recordersForTest`
seam.

---

## Error handling

- `listServices` with no cluster → 400 (`throwBad`).
- `setRecording` with unknown/missing `streamId` → 400.
- Append-stream write errors are swallowed (`stream.on("error", ()=>{})`) so a
  transient FS error never crashes the SSE connection; recording best-effort.
- All list/record fetches surface errors through the existing `setMsg(..., true)`
  path in the UI.

## Testing

**Backend unit tests (`test/livelogs.test.js`, hermetic via injected fake client):**
- `listClusters` maps ARNs → `{name,arn,status,runningTasks,activeServices}` and
  follows `nextToken` pagination.
- `listServices` requires a cluster (400) and maps services.
- `setRecording`: unknown streamId → 400; toggling on/off updates a registered
  entry; `terms` coerced to array; returns `{ok:true, on}`.
- `registerRecorder`/`getRecorder`/`removeRecorder` round-trip.

**Manual UI verification** (consistent with the existing tab, which has no browser
tests): `node --check`-equivalent inline-script parse, serve-200, and a live
walk-through (list clusters → pick → list services → pick → list tasks → Logs →
add filter terms → Record → confirm `~/logs.txt` grows with filtered lines →
Clear resets everything and empties `localStorage`).

## Out of scope (YAGNI)

- No download-to-browser of the console (recording to `~/logs.txt` covers it).
- No regex filters — substring/contains only.
- No per-line timestamps or log-level parsing beyond substring matching.
- No configurable record path — fixed `~/logs.txt`.
