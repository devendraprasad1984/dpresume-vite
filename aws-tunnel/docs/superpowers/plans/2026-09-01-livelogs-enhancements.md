# LiveLogs Enhancements Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add cluster/service pickers, field persistence, a global Clear button, a console multi-term filter, and a Record-to-`~/logs.txt` toggle to the existing LiveLogs tab.

**Architecture:** Same transport as the existing tab — `livelogs.html` (iframe) → JSON fetch routes + `EventSource` SSE → `server.js` → `lib/livelogs.js`. Adds two ECS list endpoints, a per-stream recorder registry (flags in `lib/livelogs.js`, append `WriteStream` owned by `server.js`'s SSE handler), and client-side persistence/filter/record UI.

**Tech Stack:** Node ESM (v24), `@aws-sdk/client-ecs`, `node:fs`, `node:os`, `node --test`, plain HTML/JS (no build step).

## Global Constraints

- Node ESM, Node v24, no build step (HTML/JS served as-is).
- Server binds `127.0.0.1` only. AWS creds are in-memory only (never disk/logs).
- Backend user errors are `Error` with `err.status = 400` (via `throwBad`), mapped to JSON by `server.js`'s `handleApi`.
- GET route handlers receive `(body, searchParams)` and read via `q.get(...)`.
- All values interpolated into DOM/URLs in `livelogs.html` must be HTML-escaped (`escapeHtml`/`escapeAttr`) / `encodeURIComponent`'d.
- The only file the Record feature may write is `~/logs.txt` — fixed path from `os.homedir()`, never user-supplied. Append mode (`flags:"a"`).
- Filter semantics: OR/union, case-insensitive substring. A line shows if the filter list is empty OR the line contains ANY active term.
- Test commands: `node --test test/livelogs.test.js` and `node --check server.js lib/livelogs.js`.
- Subagents: `git add` ONLY the named files. Never `git add -A`/`.`.

---

### Task 1: Backend ECS list functions + routes

**Files:**
- Modify: `lib/livelogs.js` (add imports + `listClusters`, `listServices`)
- Modify: `server.js` (add two GET routes)
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: existing `ecsClient()`, `chunk()`, `throwBad()`, `requireCreds()` in `lib/livelogs.js`; the `fakeClient(handlers)` helper in the test file.
- Produces: `listClusters(deps?) -> Promise<{clusters:[{name,arn,status,runningTasks,activeServices}]}>` and `listServices({cluster}, deps?) -> Promise<{services:[{name,arn,status,desired,running,launchType}]}>`. `deps.ecs` overrides the client (test seam), matching `listTasks`/`prepare`.

- [ ] **Step 1: Write the failing tests**

Append to `test/livelogs.test.js`:
```js
test("listClusters maps clusters and follows pagination", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  let call = 0;
  const ecs = fakeClient({
    ListClustersCommand: () => {
      call++;
      return call === 1
        ? { clusterArns: ["arn:aws:ecs:::cluster/a"], nextToken: "t2" }
        : { clusterArns: ["arn:aws:ecs:::cluster/b"] };
    },
    DescribeClustersCommand: (input) => ({
      clusters: input.clusters.map((arn) => ({
        clusterName: arn.split("/").pop(), clusterArn: arn, status: "ACTIVE",
        runningTasksCount: 2, activeServicesCount: 1,
      })),
    }),
  });
  const r = await livelogs.listClusters({ ecs });
  assert.equal(r.clusters.length, 2);
  assert.equal(r.clusters[0].name, "a");
  assert.equal(r.clusters[0].arn, "arn:aws:ecs:::cluster/a");
  assert.equal(r.clusters[0].runningTasks, 2);
  assert.equal(r.clusters[0].activeServices, 1);
});

test("listServices requires a cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(() => livelogs.listServices({}, { ecs: fakeClient({}) }),
    (e) => e.status === 400);
});

test("listServices maps services for a cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    ListServicesCommand: () => ({ serviceArns: ["arn:aws:ecs:::service/cl/web"] }),
    DescribeServicesCommand: () => ({ services: [{
      serviceName: "web", serviceArn: "arn:aws:ecs:::service/cl/web",
      status: "ACTIVE", desiredCount: 3, runningCount: 3, launchType: "EC2",
    }] }),
  });
  const r = await livelogs.listServices({ cluster: "cl" }, { ecs });
  assert.equal(r.services.length, 1);
  assert.equal(r.services[0].name, "web");
  assert.equal(r.services[0].desired, 3);
  assert.equal(r.services[0].launchType, "EC2");
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test test/livelogs.test.js`
Expected: FAIL — `livelogs.listClusters is not a function`.

- [ ] **Step 3: Add SDK imports**

In `lib/livelogs.js`, extend the `@aws-sdk/client-ecs` import to add the four commands:
```js
import {
  ECSClient,
  ListTasksCommand,
  DescribeTasksCommand,
  DescribeContainerInstancesCommand,
  ListClustersCommand,
  DescribeClustersCommand,
  ListServicesCommand,
  DescribeServicesCommand,
} from "@aws-sdk/client-ecs";
```

- [ ] **Step 4: Implement the two functions**

Add to `lib/livelogs.js` (after `listTasks`, before `prepare`):
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

- [ ] **Step 5: Wire the routes**

In `server.js`, in the `routes` object, after `"POST /api/livelogs/prepare"`:
```js
  "GET /api/livelogs/clusters": () => livelogs.listClusters(),
  "GET /api/livelogs/services": (b, q) => livelogs.listServices({ cluster: q.get("cluster") }),
```

- [ ] **Step 6: Run tests + checks**

Run: `node --test test/livelogs.test.js` → all PASS.
Run: `node --check server.js lib/livelogs.js` → clean.

- [ ] **Step 7: Commit**

```bash
git add lib/livelogs.js server.js test/livelogs.test.js
git commit -m "feat(livelogs): list ECS clusters and services

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Recorder registry + setRecording (backend logic)

**Files:**
- Modify: `lib/livelogs.js` (recorder Map + functions + test seam)
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: `throwBad()`, `randomBytes` (already imported).
- Produces:
  - `registerRecorder(streamId) -> void` (creates `{ on:false, terms:[] }`).
  - `getRecorder(streamId) -> {on,terms} | undefined`.
  - `removeRecorder(streamId) -> void`.
  - `setRecording({streamId,on,terms}) -> {ok:true, path:"~/logs.txt", on:boolean}`; unknown/missing `streamId` → 400.
  - `__recordersForTest() -> Map` (test seam).
  - Later tasks rely on these exact names; `getRecorder` is read every forwarded SSE line.

- [ ] **Step 1: Write the failing tests**

Append to `test/livelogs.test.js`:
```js
test("registerRecorder / getRecorder / removeRecorder round-trip", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s1");
  const rec = livelogs.getRecorder("s1");
  assert.deepEqual(rec, { on: false, terms: [] });
  livelogs.removeRecorder("s1");
  assert.equal(livelogs.getRecorder("s1"), undefined);
});

test("setRecording rejects unknown streamId", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.setRecording({ streamId: "nope", on: true }),
    (e) => e.status === 400);
});

test("setRecording toggles on and coerces terms to an array", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s2");
  const r = livelogs.setRecording({ streamId: "s2", on: 1, terms: ["debug", 5, null] });
  assert.equal(r.ok, true);
  assert.equal(r.on, true);
  const rec = livelogs.getRecorder("s2");
  assert.equal(rec.on, true);
  assert.deepEqual(rec.terms, ["debug", "5"]);
});

test("setRecording off clears the flag", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s3");
  livelogs.setRecording({ streamId: "s3", on: true, terms: ["x"] });
  const r = livelogs.setRecording({ streamId: "s3", on: false });
  assert.equal(r.on, false);
  assert.equal(livelogs.getRecorder("s3").on, false);
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node --test test/livelogs.test.js`
Expected: FAIL — `livelogs.registerRecorder is not a function`.

- [ ] **Step 3: Implement the registry**

In `lib/livelogs.js`, add near the `tickets` Map declaration:
```js
const recorders = new Map(); // streamId -> { on, terms }
```

Add these exported functions (near `openStream`):
```js
export function registerRecorder(streamId) {
  recorders.set(streamId, { on: false, terms: [] });
}
export function getRecorder(streamId) {
  return recorders.get(streamId);
}
export function removeRecorder(streamId) {
  recorders.delete(streamId);
}
export function setRecording({ streamId, on, terms } = {}) {
  const rec = recorders.get(streamId);
  if (!rec) throwBad("Unknown stream.");
  rec.on = !!on;
  rec.terms = Array.isArray(terms)
    ? terms.filter((t) => t !== null && t !== undefined && t !== "").map((t) => String(t))
    : [];
  return { ok: true, path: "~/logs.txt", on: rec.on };
}
```

- [ ] **Step 4: Extend the reset + add the test seam**

In `__resetForTest`, add `recorders.clear();` alongside `tickets.clear();`.
After `__ticketsForTest`, add:
```js
// Test seam: inspect the internal recorder map.
export function __recordersForTest() { return recorders; }
```

- [ ] **Step 5: Run tests + check**

Run: `node --test test/livelogs.test.js` → all PASS.
Run: `node --check lib/livelogs.js` → clean.

- [ ] **Step 6: Commit**

```bash
git add lib/livelogs.js test/livelogs.test.js
git commit -m "feat(livelogs): per-stream recorder registry and setRecording

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Wire recording into the SSE handler + record route

**Files:**
- Modify: `server.js` (`handleLiveLogsStream` + `POST /api/livelogs/record` route + imports)

**Interfaces:**
- Consumes: `livelogs.registerRecorder`, `livelogs.getRecorder`, `livelogs.removeRecorder`, `livelogs.setRecording` from Task 2.
- Produces: SSE stream now emits an initial `event: streamid` frame; the record route flips per-stream flags; matching lines are appended to `~/logs.txt`.

- [ ] **Step 1: Add imports**

In `server.js`, add to the imports at the top:
```js
import { createWriteStream } from "node:fs";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
```

- [ ] **Step 2: Emit a streamId and register a recorder**

In `handleLiveLogsStream`, immediately after `res.write(": connected\n\n");`, add:
```js
  const streamId = randomUUID();
  livelogs.registerRecorder(streamId);
  res.write(`event: streamid\ndata: ${streamId}\n\n`);

  const logPath = join(homedir(), "logs.txt");
  let recStream = null;
  const recordLine = (line) => {
    const rec = livelogs.getRecorder(streamId);
    if (!rec || !rec.on) return;
    if (rec.terms.length &&
        !rec.terms.some((t) => line.toLowerCase().includes(t.toLowerCase()))) return;
    if (!recStream) {
      recStream = createWriteStream(logPath, { flags: "a" });
      recStream.on("error", () => {});
    }
    recStream.write(line + "\n");
  };
```

- [ ] **Step 3: Call recordLine for every forwarded line**

In the `forward` function, after `res.write(`data: ${line}\n\n`);`, add `recordLine(line);`:
```js
  const forward = (data) => {
    buf += data.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      res.write(`data: ${line}\n\n`);
      recordLine(line);
    }
  };
```

- [ ] **Step 4: Clean up the recorder in finish()**

In the `finish` function, before `res.end();`, add recorder teardown:
```js
  const finish = (extra) => {
    if (ended) return;
    ended = true;
    clearInterval(heartbeat);
    livelogs.removeRecorder(streamId);
    if (recStream) { try { recStream.end(); } catch {} recStream = null; }
    if (extra) res.write(extra);
    res.end();
  };
```

- [ ] **Step 5: Add the record route**

In the `routes` object, after the two list routes from Task 1:
```js
  "POST /api/livelogs/record": (b) => livelogs.setRecording(b),
```

- [ ] **Step 6: Verify parse + a smoke check**

Run: `node --check server.js` → clean.
Run a manual smoke test that the stream now emits a streamid frame:
```bash
node server.js >/tmp/ll.log 2>&1 & echo $! > /tmp/ll.pid; sleep 1
# no creds -> stream should 400 (creds gate), record route unknown-stream -> 400:
curl -s -m 5 -o /dev/null -w 'stream=%{http_code}\n' \
  "http://127.0.0.1:8777/api/livelogs/stream?ip=1.2.3.4&devkey=/k&taskArn=a&container=c"
curl -s -m 5 -w '\nrecord=%{http_code}\n' -H 'content-type: application/json' \
  -d '{"streamId":"nope","on":true}' http://127.0.0.1:8777/api/livelogs/record
kill "$(cat /tmp/ll.pid)"
```
Expected: `stream=400` (no active creds) and `record=400` with `{"error":"Unknown stream."}`.

- [ ] **Step 7: Commit**

```bash
git add server.js
git commit -m "feat(livelogs): record matching stream lines to ~/logs.txt

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: Cluster & service pickers (UI)

**Files:**
- Modify: `livelogs.html` (Target fieldset markup + picker/ filter JS)

**Interfaces:**
- Consumes: `GET /api/livelogs/clusters`, `GET /api/livelogs/services?cluster=`; existing `$`, `api`, `setMsg`, `escapeHtml`, `escapeAttr`.
- Produces: DOM ids `listClusters`, `clustersTable`, `clusterFilter`, `listServices`, `servicesTable`, `serviceFilter`; helpers `filterRows`, `wireFilter`, `clearTable` used by later tasks.

- [ ] **Step 1: Replace the Target fieldset markup**

Replace the entire `<fieldset>` whose legend is `2 · Target` with:
```html
  <fieldset>
    <legend>2 · Target</legend>
    <div class="row">
      <button id="listClusters" class="accent">List Clusters</button>
      <input id="clusterFilter" type="search" placeholder="Filter clusters…" class="hide">
    </div>
    <table id="clustersTable" class="hide">
      <thead><tr><th>Cluster</th><th>Status</th><th>Running</th><th>Services</th></tr></thead>
      <tbody></tbody>
    </table>
    <div class="row">
      <label>Cluster ARN (ECS ARN)<input id="cluster" class="wide" placeholder="arn:aws:ecs:...:cluster/..."></label>
      <button id="listServices">List Services</button>
    </div>
    <input id="serviceFilter" type="search" placeholder="Filter services…" class="hide">
    <table id="servicesTable" class="hide">
      <thead><tr><th>Service</th><th>Status</th><th>Desired</th><th>Running</th><th>Launch</th></tr></thead>
      <tbody></tbody>
    </table>
    <div class="row">
      <label>Service ARN<input id="service" class="wide" placeholder="arn:aws:ecs:...:service/..."></label>
      <button id="listTasks" class="accent">List Tasks</button>
    </div>
    <div id="tasksMsg" class="msg"></div>
    <table id="tasksTable" class="hide">
      <thead><tr><th>Task</th><th>Status</th><th>Task Def</th><th>Started</th><th></th></tr></thead>
      <tbody></tbody>
    </table>
  </fieldset>
```

- [ ] **Step 2: Add filter + table helpers**

In the `<script>`, after the `setMsg` helper, add:
```js
function clearTable(id){$(id).querySelector("tbody").innerHTML="";$(id).classList.add("hide");}
function filterRows(tableId, q){
  const query=q.toLowerCase();
  $(tableId).querySelectorAll("tbody tr").forEach(tr=>{
    tr.style.display=tr.textContent.toLowerCase().includes(query)?"":"none";
  });
}
function wireFilter(inputId, tableId){
  $(inputId).addEventListener("input",e=>filterRows(tableId,e.target.value));
}
```

- [ ] **Step 3: Add the picker logic**

After the `$("activate")` handler block, add:
```js
$("listClusters").onclick=async()=>{
  setMsg($("connectMsg"),"Loading clusters…");
  try{
    const r=await api("GET","/api/livelogs/clusters");
    const tb=$("clustersTable").querySelector("tbody");
    tb.innerHTML=r.clusters.map(c=>
      `<tr data-arn="${escapeAttr(c.arn)}"><td>${escapeHtml(c.name)}</td>`+
      `<td>${escapeHtml(c.status||"")}</td><td>${escapeHtml(String(c.runningTasks??""))}</td>`+
      `<td>${escapeHtml(String(c.activeServices??""))}</td></tr>`).join("");
    $("clustersTable").classList.toggle("hide", !r.clusters.length);
    $("clusterFilter").classList.toggle("hide", !r.clusters.length);
    $("clusterFilter").value=""; filterRows("clustersTable","");
    setMsg($("connectMsg"),r.clusters.length+" cluster(s).");
  }catch(e){setMsg($("connectMsg"),e.message,true);}
};
$("clustersTable").addEventListener("click",e=>{
  const tr=e.target.closest("tr[data-arn]"); if(!tr) return;
  $("cluster").value=tr.dataset.arn; saveForm();
});

$("listServices").onclick=async()=>{
  const cluster=$("cluster").value.trim();
  if(!cluster){setMsg($("connectMsg"),"Enter or pick a cluster first.",true);return;}
  setMsg($("connectMsg"),"Loading services…");
  try{
    const r=await api("GET",`/api/livelogs/services?cluster=${encodeURIComponent(cluster)}`);
    const tb=$("servicesTable").querySelector("tbody");
    tb.innerHTML=r.services.map(s=>
      `<tr data-arn="${escapeAttr(s.arn)}"><td>${escapeHtml(s.name)}</td>`+
      `<td>${escapeHtml(s.status||"")}</td><td>${escapeHtml(String(s.desired??""))}</td>`+
      `<td>${escapeHtml(String(s.running??""))}</td><td>${escapeHtml(s.launchType||"")}</td></tr>`).join("");
    $("servicesTable").classList.toggle("hide", !r.services.length);
    $("serviceFilter").classList.toggle("hide", !r.services.length);
    $("serviceFilter").value=""; filterRows("servicesTable","");
    setMsg($("connectMsg"),r.services.length+" service(s).");
  }catch(e){setMsg($("connectMsg"),e.message,true);}
};
$("servicesTable").addEventListener("click",e=>{
  const tr=e.target.closest("tr[data-arn]"); if(!tr) return;
  $("service").value=tr.dataset.arn; saveForm();
});
wireFilter("clusterFilter","clustersTable");
wireFilter("serviceFilter","servicesTable");
```

> Note: `saveForm()` is defined in Task 5. Task 5 must be implemented for the
> `saveForm()` calls here to resolve; if reviewing Task 4 in isolation, treat
> `saveForm` as a forward reference provided by Task 5.

- [ ] **Step 4: Verify parse + serve**

Run:
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('livelogs.html','utf8');const m=h.match(/<script>([\s\S]*)<\/script>/);require('vm').compileFunction(m[1]);console.log('script parses (pending saveForm from Task 5)')"
```
Note: this will reference `saveForm`; parsing (compileFunction) does not execute,
so an undefined `saveForm` does not fail the parse. Expected: prints the message.

- [ ] **Step 5: Commit**

```bash
git add livelogs.html
git commit -m "feat(livelogs): cluster and service pickers with filters

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Field persistence + global Clear

**Files:**
- Modify: `livelogs.html` (persistence JS + Clear button in Connect panel)

**Interfaces:**
- Consumes: `$`, `stopStream` (defined later in the file — hoisted function declaration), `clearTable`, `setMsg`.
- Produces: `saveForm()`, `loadForm()` (used by Task 4 pickers); `clearAll` button behavior.

- [ ] **Step 1: Add the Clear button to the Connect panel**

In the `1 · Connect` fieldset, change the Activate row to include a Clear button:
```html
    <div class="row">
      <label>AWS exports<textarea id="exports" placeholder="export AWS_ACCESS_KEY_ID=...&#10;export AWS_SECRET_ACCESS_KEY=...&#10;export AWS_SESSION_TOKEN=..."></textarea></label>
      <button id="activate" class="accent">Activate</button>
      <button id="clearAll">Clear All</button>
    </div>
```

- [ ] **Step 2: Add persistence + Clear logic**

In the `<script>`, right after the filter/table helpers from Task 4, add:
```js
const LS_KEY="livelogs.form";
const PERSIST=["devkey","region","cluster","service"];
function saveForm(){
  const o={}; for(const id of PERSIST) o[id]=$(id).value;
  try{localStorage.setItem(LS_KEY,JSON.stringify(o));}catch{}
}
function loadForm(){
  try{
    const o=JSON.parse(localStorage.getItem(LS_KEY)||"{}");
    for(const id of PERSIST) if(typeof o[id]==="string") $(id).value=o[id];
  }catch{}
}
PERSIST.forEach(id=>$(id).addEventListener("input",saveForm));
loadForm();

$("clearAll").onclick=()=>{
  stopStream();
  ["devkey","exports","region","cluster","service"].forEach(id=>{$(id).value="";});
  $("region").value="us-west-2";
  clearTable("clustersTable"); clearTable("servicesTable"); clearTable("tasksTable");
  $("clusterFilter").classList.add("hide"); $("serviceFilter").classList.add("hide");
  logBuffer=[]; renderConsole();
  filterTerms=[]; renderFilterChips();
  try{localStorage.removeItem(LS_KEY);}catch{}
  setMsg($("connectMsg"),"Cleared.");
};
```

> Note: `logBuffer`, `renderConsole`, `filterTerms`, `renderFilterChips` are
> defined in Task 6. `stopStream` is a hoisted `function` declaration later in
> the file. These are forward references resolved once Task 6 lands.

- [ ] **Step 3: Verify parse**

Run:
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('livelogs.html','utf8');const m=h.match(/<script>([\s\S]*)<\/script>/);require('vm').compileFunction(m[1]);console.log('script parses (pending Task 6 symbols)')"
```
Expected: prints the message (parse only; forward refs don't break parsing).

- [ ] **Step 4: Commit**

```bash
git add livelogs.html
git commit -m "feat(livelogs): persist non-secret fields to localStorage + Clear All

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Console multi-term filter + Record toggle

**Files:**
- Modify: `livelogs.html` (Logs fieldset markup + console buffer/filter/record JS)

**Interfaces:**
- Consumes: `$`, `api`, `setMsg`; the `streamId` delivered via the SSE `streamid` event (Task 3); `POST /api/livelogs/record`.
- Produces: `logBuffer`, `renderConsole`, `filterTerms`, `renderFilterChips` (referenced by Task 5's Clear); replaces `appendLine`.

- [ ] **Step 1: Replace the Logs fieldset markup**

Replace the entire `<fieldset>` whose legend is `3 · Logs` with:
```html
  <fieldset>
    <legend>3 · Logs</legend>
    <div class="row">
      <span id="streamLabel" class="msg"></span>
      <div style="flex:1"></div>
      <button id="record" class="hide">&#9679; Record</button>
      <button id="stop" class="hide">Stop</button>
      <button id="clear">Clear Console</button>
    </div>
    <div class="row">
      <input id="filterInput" type="search" placeholder="Add filter term (e.g. debug)…">
      <button id="addFilter">Add Filter</button>
      <div id="filterChips" class="chips"></div>
    </div>
    <div id="console"></div>
  </fieldset>
```

- [ ] **Step 2: Add chip styling**

In the `<style>` block, after the `#console` rule, add:
```css
  .chips{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
  .chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--accent);
    color:var(--accent);border-radius:12px;padding:2px 8px;font-size:11px;text-shadow:var(--glow);}
  .chip button{border:0;background:none;color:var(--accent);padding:0 2px;cursor:pointer;
    text-transform:none;letter-spacing:0;box-shadow:none;}
  #record.on{border-color:#ff6b6b;color:#ff6b6b;text-shadow:none;}
```

- [ ] **Step 3: Replace appendLine with a buffered, filtered console**

Replace the existing `appendLine` function with:
```js
let logBuffer=[];
let filterTerms=[];
const LOG_CAP=5000;
function lineMatches(line){
  if(!filterTerms.length) return true;
  const l=line.toLowerCase();
  return filterTerms.some(t=>l.includes(t.toLowerCase()));
}
function renderConsole(){
  const c=$("console");
  c.textContent=logBuffer.filter(lineMatches).join("\n")+(logBuffer.some(lineMatches)?"\n":"");
  c.scrollTop=c.scrollHeight;
}
function appendLine(text){
  logBuffer.push(text);
  if(logBuffer.length>LOG_CAP) logBuffer.splice(0,logBuffer.length-LOG_CAP);
  if(!lineMatches(text)) return;
  const c=$("console");
  const atBottom=c.scrollHeight-c.scrollTop-c.clientHeight<40;
  c.textContent+=text+"\n";
  if(atBottom) c.scrollTop=c.scrollHeight;
}
function renderFilterChips(){
  $("filterChips").innerHTML=filterTerms.map((t,i)=>
    `<span class="chip">${escapeHtml(t)}<button data-i="${i}" title="Remove">&times;</button></span>`).join("");
}
function pushRecordTerms(){
  if(!recording||!streamId) return;
  api("POST","/api/livelogs/record",{streamId,on:true,terms:filterTerms}).catch(()=>{});
}
function addFilter(){
  const v=$("filterInput").value.trim();
  if(!v||filterTerms.includes(v)) return;
  filterTerms.push(v); $("filterInput").value="";
  renderFilterChips(); renderConsole(); pushRecordTerms();
}
$("addFilter").onclick=addFilter;
$("filterInput").addEventListener("keydown",e=>{if(e.key==="Enter"){e.preventDefault();addFilter();}});
$("filterChips").addEventListener("click",e=>{
  const b=e.target.closest("button[data-i]"); if(!b) return;
  filterTerms.splice(Number(b.dataset.i),1);
  renderFilterChips(); renderConsole(); pushRecordTerms();
});
$("clear").onclick=()=>{logBuffer=[]; renderConsole();};
```

- [ ] **Step 4: Add Record state + capture streamId**

Replace `let es=null, streamGen=0;` with:
```js
let es=null, streamGen=0, streamId=null, recording=false;
function setRecordBtn(){
  const b=$("record");
  b.classList.toggle("on",recording);
  b.innerHTML=recording?"&#9632; Recording…":"&#9679; Record";
}
$("record").onclick=async()=>{
  if(!streamId) return;
  recording=!recording; setRecordBtn();
  try{ await api("POST","/api/livelogs/record",{streamId,on:recording,terms:filterTerms}); }
  catch(e){ recording=!recording; setRecordBtn(); setMsg($("streamLabel"),e.message,true); }
};
```

- [ ] **Step 5: Reset record state in stopStream and capture streamId on open**

Update `stopStream` to also reset record UI:
```js
function stopStream(){
  if(es){es.close();es=null;}
  streamId=null; recording=false; setRecordBtn();
  $("stop").classList.add("hide");
  $("record").classList.add("hide");
}
```
In the task-click handler, after `es=new EventSource(...)` and `$("stop").classList.remove("hide");`, add the streamid listener and reveal the Record button:
```js
    $("record").classList.remove("hide");
    es.addEventListener("streamid",(ev)=>{streamId=ev.data;});
```

- [ ] **Step 6: Verify parse + serve 200**

Run:
```bash
node -e "const fs=require('fs');const h=fs.readFileSync('livelogs.html','utf8');const m=h.match(/<script>([\s\S]*)<\/script>/);require('vm').compileFunction(m[1]);console.log('script OK')"
node server.js >/tmp/ll.log 2>&1 & echo $! > /tmp/ll.pid; sleep 1
curl -s -m 5 -o /dev/null -w 'livelogs.html=%{http_code}\n' http://127.0.0.1:8777/livelogs.html
kill "$(cat /tmp/ll.pid)"
```
Expected: `script OK` and `livelogs.html=200`.

- [ ] **Step 7: Commit**

```bash
git add livelogs.html
git commit -m "feat(livelogs): console multi-term filter and Record toggle

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: Document in AGENT.md

**Files:**
- Modify: `AGENT.md`

- [ ] **Step 1: Extend the LiveLogs tab entry**

In `AGENT.md`, append to the end of the LiveLogs (#5) tab paragraph:
```markdown
   Cluster/service pickers (`GET /api/livelogs/clusters` + `/services`) let you
   list-and-click instead of pasting ARNs; non-secret fields (devkey, region,
   cluster, service) auto-persist to browser `localStorage` and a **Clear All**
   button resets everything. The console supports add/remove substring filters
   (OR) and a **Record** toggle that appends matching lines to `~/logs.txt`
   (`POST /api/livelogs/record`, per-stream registry in `lib/livelogs.js`).
```

- [ ] **Step 2: Commit**

```bash
git add AGENT.md
git commit -m "docs(livelogs): document pickers, persistence, filter, record

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Final verification

- [ ] `node --test test/livelogs.test.js` → all passing (existing + new list/recorder tests).
- [ ] `node --check server.js lib/livelogs.js` → clean.
- [ ] `node -e "…compileFunction(livelogs.html inline script)"` → `script OK` (all forward references resolved after Task 6).
- [ ] Serve check: `curl -s http://127.0.0.1:8777/livelogs.html` → 200; tab still wired in `index.html` (`grep -c 'data-tab="livelogs"'` = 1).
- [ ] Live end-to-end (real creds + EC2-launch-type service + device key): List Clusters → pick → List Services → pick → List Tasks → **Logs** → add a filter term (only matching lines show) → **Record** → confirm `~/logs.txt` grows with only the filtered lines → **Stop** leaves no `ssh` process → **Clear All** empties fields, tables, console, and `localStorage`.
