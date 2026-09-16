# LiveLogs Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a standalone **LiveLogs** tab that lists an ECS service's running tasks and streams live `docker logs -f` from each task's container over SSH into the browser.

**Architecture:** A new isolated `lib/livelogs.js` module holds its own in-memory AWS creds and resolves a task → container-instance EC2 → private IP. `server.js` gains three JSON routes plus one special-cased Server-Sent-Events (SSE) endpoint that spawns `ssh … sudo docker logs -f` and streams stdout to the browser. A new `livelogs.html` iframe tab (Matrix-green theme) drives it via `fetch` + native `EventSource`.

**Tech Stack:** Node ESM (`"type":"module"`, Node v24), AWS SDK v3 (`@aws-sdk/client-ecs`, new `@aws-sdk/client-ec2`), `node:child_process` `spawn`, plain HTML/JS, `node --test`.

## Global Constraints

- Server binds **127.0.0.1** only; no auth/TLS. Do not change this.
- AWS credentials live **in memory only**; never write creds/tokens to disk or logs.
- Reuse existing patterns: backend user errors are `Error` with `err.status = 400`
  (mapped to `{ error, code }` JSON by `server.js`); parse creds with
  `lib/parse-creds.js` `parseCreds(text)`.
- HTML pages are served as-is (no build step). Escape all interpolated HTML with
  `escapeHtml`/`escapeAttr` helpers (as in `aws.html`).
- ESM only (`import`, not `require`). AWS SDK version line: `^3.1104.0`.
- SSH mirrors `accesslogs.sh` exactly: user `ec2-user`, `-o StrictHostKeyChecking=no`,
  `sudo docker logs -f --tail 200`, match container by ECS labels
  `com.amazonaws.ecs.task-arn` and `com.amazonaws.ecs.container-name`.
- The "ECS ARN" input is the **cluster ARN**.
- macOS: kill processes by explicit numeric PID (`lsof -ti tcp:8777` then `kill <pid>`).

---

## File Structure

- Create `lib/livelogs.js` — cred store, ticket map, `activate`, `requireCreds`,
  `listTasks`, `prepare`, `openStream`, `sweepTickets`, injectable client factories.
- Modify `server.js` — import `livelogs`, register 3 JSON routes, add the SSE handler.
- Create `livelogs.html` — the tab UI (connect panel, target inputs, task table, console).
- Modify `index.html` — 5th tab button, panel, `lazy` entry, CSS.
- Create `test/livelogs.test.js` — unit tests for guards/validation with fake clients.
- Modify `package.json` / `package-lock.json` — add `@aws-sdk/client-ec2`.
- Modify `AGENT.md` — document the new tab.

---

### Task 1: Scaffold `lib/livelogs.js` (dependency + creds store + activate)

**Files:**
- Modify: `package.json` (add `@aws-sdk/client-ec2`)
- Create: `lib/livelogs.js`
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: `parseCreds(text)` from `./parse-creds.js`.
- Produces:
  - `activate({ exportsText, region }) -> { region, hasCreds: true }`
  - `requireCreds() -> { accessKeyId, secretAccessKey, sessionToken? }` (throws 400)
  - internal `store = { creds, region }`, `DEFAULT_REGION = "us-west-2"`
  - `throwBad(msg)` sets `err.status = 400`.

- [ ] **Step 1: Install the EC2 SDK client**

Run:
```bash
npm install @aws-sdk/client-ec2@^3.1104.0
```
Expected: `package.json` gains `"@aws-sdk/client-ec2": "^3.1104.0"`; lockfile updates.

- [ ] **Step 2: Write the failing test**

Create `test/livelogs.test.js`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import * as livelogs from "../lib/livelogs.js";

const EXPORTS = [
  "export AWS_ACCESS_KEY_ID=AKIAEXAMPLE",
  "export AWS_SECRET_ACCESS_KEY=secret/example",
  "export AWS_SESSION_TOKEN=token-example",
].join("\n");

test("requireCreds throws 400 before activate", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.requireCreds(), (e) => e.status === 400);
});

test("activate parses exports and sets region", () => {
  livelogs.__resetForTest();
  const res = livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.equal(res.region, "us-west-2");
  assert.equal(res.hasCreds, true);
  assert.equal(livelogs.requireCreds().accessKeyId, "AKIAEXAMPLE");
});

test("activate with blank exports throws 400", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.activate({ exportsText: "", region: "" }),
    (e) => e.status === 400);
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot import `../lib/livelogs.js` (module not found).

- [ ] **Step 4: Write minimal implementation**

Create `lib/livelogs.js`:
```js
// LiveLogs tab backend: standalone in-memory AWS creds + task->EC2 resolution +
// SSH log-stream ticketing. Never writes creds to disk. Mirrors accesslogs.sh.
import {
  ECSClient,
  ListTasksCommand,
  DescribeTasksCommand,
  DescribeContainerInstancesCommand,
} from "@aws-sdk/client-ecs";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { parseCreds } from "./parse-creds.js";

const DEFAULT_REGION = "us-west-2";

const store = { creds: null, region: DEFAULT_REGION };
const tickets = new Map(); // id -> { ip, devkey, taskArn, containers, createdAt }
const TICKET_TTL_MS = 5 * 60 * 1000;

export function throwBad(msg) {
  const e = new Error(msg);
  e.status = 400;
  throw e;
}

export function requireCreds() {
  if (!store.creds) throwBad("No active credentials. Activate first.");
  return store.creds;
}

export function activate({ exportsText, region } = {}) {
  let creds;
  try {
    creds = parseCreds(exportsText);
  } catch (err) {
    throwBad(err.message || "Could not parse credentials.");
  }
  store.creds = creds;
  store.region = (region && String(region).trim()) || DEFAULT_REGION;
  return { region: store.region, hasCreds: true };
}

const shortName = (arn) => (arn ? arn.split("/").pop() : arn);

function ecsClient() {
  return new ECSClient({ region: store.region, credentials: requireCreds() });
}
function ec2Client() {
  return new EC2Client({ region: store.region, credentials: requireCreds() });
}

// Test seam: reset state between tests.
export function __resetForTest() {
  store.creds = null;
  store.region = DEFAULT_REGION;
  tickets.clear();
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npm test`
Expected: PASS (3 passing).

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json lib/livelogs.js test/livelogs.test.js
git commit -m "feat(livelogs): scaffold module with in-memory creds + activate

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: `listTasks` — running tasks for a cluster/service

**Files:**
- Modify: `lib/livelogs.js`
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: `requireCreds()`, `ecsClient()` from Task 1.
- Produces: `listTasks({ cluster, service }, ecs?) -> { tasks: [{ taskArn, id,
  lastStatus, taskDefinition, startedAt, containers: [name] }] }`. `ecs` is an
  optional injected client (a `{ send(cmd) }`) for tests; defaults to `ecsClient()`.

- [ ] **Step 1: Write the failing test**

Append to `test/livelogs.test.js`:
```js
function fakeClient(handlers) {
  return {
    send(cmd) {
      const name = cmd.constructor.name;
      const h = handlers[name];
      if (!h) throw new Error("unexpected command " + name);
      return Promise.resolve(h(cmd.input));
    },
  };
}

test("listTasks requires cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(() => livelogs.listTasks({ service: "svc" }, fakeClient({})),
    (e) => e.status === 400);
});

test("listTasks returns mapped running tasks", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    ListTasksCommand: () => ({ taskArns: ["arn:aws:ecs:...:task/cl/abc123"] }),
    DescribeTasksCommand: () => ({
      tasks: [{
        taskArn: "arn:aws:ecs:...:task/cl/abc123",
        lastStatus: "RUNNING",
        taskDefinitionArn: "arn:aws:ecs:...:task-definition/web:5",
        startedAt: new Date("2026-09-01T00:00:00Z"),
        containers: [{ name: "web" }, { name: "sidecar" }],
      }],
    }),
  });
  const { tasks } = await livelogs.listTasks({ cluster: "cl", service: "svc" }, ecs);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, "abc123");
  assert.equal(tasks[0].lastStatus, "RUNNING");
  assert.deepEqual(tasks[0].containers, ["web", "sidecar"]);
  assert.equal(tasks[0].taskDefinition, "web:5");
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `livelogs.listTasks is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `lib/livelogs.js` (before `__resetForTest`):
```js
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export async function listTasks({ cluster, service } = {}, ecs = null) {
  if (!cluster) throwBad("cluster is required.");
  const client = ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(new ListTasksCommand({
      cluster,
      serviceName: service || undefined,
      desiredStatus: "RUNNING",
      nextToken: token,
    }));
    arns.push(...(res.taskArns || []));
    token = res.nextToken;
  } while (token);
  const tasks = [];
  for (const batch of chunk(arns, 100)) {
    const res = await client.send(new DescribeTasksCommand({ cluster, tasks: batch }));
    for (const t of res.tasks || []) {
      tasks.push({
        taskArn: t.taskArn,
        id: shortName(t.taskArn),
        lastStatus: t.lastStatus,
        taskDefinition: shortName(t.taskDefinitionArn),
        startedAt: t.startedAt ? new Date(t.startedAt).toISOString() : null,
        containers: (t.containers || []).map((c) => c.name),
      });
    }
  }
  return { tasks };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (5 passing).

- [ ] **Step 5: Commit**

```bash
git add lib/livelogs.js test/livelogs.test.js
git commit -m "feat(livelogs): list running tasks for a cluster/service

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: `prepare` — resolve task → private IP + issue a ticket

**Files:**
- Modify: `lib/livelogs.js`
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: `requireCreds()`, `ecsClient()`, `ec2Client()`.
- Produces: `prepare({ cluster, task, devkey }, { ecs?, ec2? }?) -> { ticket, ip,
  containers: [name] }`. Creates a ticket `{ id, ip, devkey, taskArn, containers,
  createdAt }` in the module `tickets` map. Ticket id is a random hex string.

- [ ] **Step 1: Write the failing test**

Append to `test/livelogs.test.js`:
```js
test("prepare validates required args", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(
    () => livelogs.prepare({ cluster: "cl", task: "t" }, {}), // missing devkey
    (e) => e.status === 400);
});

test("prepare resolves IP and returns a ticket", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({
      tasks: [{
        taskArn: "arn:task/cl/abc",
        containerInstanceArn: "arn:ci/cl/ci1",
        containers: [{ name: "web" }],
      }],
    }),
    DescribeContainerInstancesCommand: () => ({
      containerInstances: [{ ec2InstanceId: "i-0abc" }],
    }),
  });
  const ec2 = fakeClient({
    DescribeInstancesCommand: () => ({
      Reservations: [{ Instances: [{ PrivateIpAddress: "10.0.1.5" }] }],
    }),
  });
  const res = await livelogs.prepare(
    { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" },
    { ecs, ec2 });
  assert.equal(res.ip, "10.0.1.5");
  assert.deepEqual(res.containers, ["web"]);
  assert.ok(res.ticket && res.ticket.length > 0);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `livelogs.prepare is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `lib/livelogs.js` (import `randomUUID`-free approach uses `crypto`):
```js
import { randomBytes } from "node:crypto";
```
(place with the other imports at the top of the file), then:
```js
export async function prepare({ cluster, task, devkey } = {}, deps = {}) {
  if (!cluster) throwBad("cluster is required.");
  if (!task) throwBad("task is required.");
  if (!devkey || !String(devkey).trim()) throwBad("device key path is required.");
  const ecs = deps.ecs || ecsClient();
  const ec2 = deps.ec2 || ec2Client();

  const dt = await ecs.send(new DescribeTasksCommand({ cluster, tasks: [task] }));
  const t = (dt.tasks || [])[0];
  if (!t) throwBad("Task not found.");
  const containers = (t.containers || []).map((c) => c.name);
  if (!containers.length) throwBad("Task has no containers.");
  if (!t.containerInstanceArn) {
    throwBad("Task has no container instance (Fargate tasks are not supported).");
  }

  const dci = await ecs.send(new DescribeContainerInstancesCommand({
    cluster, containerInstances: [t.containerInstanceArn],
  }));
  const instanceId = (dci.containerInstances || [])[0]?.ec2InstanceId;
  if (!instanceId) throwBad("Could not resolve EC2 instance for task.");

  const di = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
  const ip = di.Reservations?.[0]?.Instances?.[0]?.PrivateIpAddress;
  if (!ip) throwBad("Could not resolve private IP for instance " + instanceId + ".");

  sweepTickets();
  const id = randomBytes(16).toString("hex");
  tickets.set(id, {
    id, ip, devkey: String(devkey).trim(), taskArn: t.taskArn,
    containers, createdAt: Date.now(),
  });
  return { ticket: id, ip, containers };
}

export function sweepTickets() {
  const now = Date.now();
  for (const [id, t] of tickets) {
    if (now - t.createdAt > TICKET_TTL_MS) tickets.delete(id);
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (7 passing).

- [ ] **Step 5: Commit**

```bash
git add lib/livelogs.js test/livelogs.test.js
git commit -m "feat(livelogs): resolve task to EC2 private IP and issue stream ticket

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: `openStream` — validate ticket + container for the SSE handler

**Files:**
- Modify: `lib/livelogs.js`
- Test: `test/livelogs.test.js`

**Interfaces:**
- Consumes: module `tickets` map.
- Produces: `openStream({ ticket, container, ip, devkey, taskArn }) -> { ip, devkey,
  taskArn, container }`. Two modes:
  - **Ticket mode** (`ticket` present): look up the ticket; container defaults to the
    ticket's first container and must be one of the ticket's containers.
  - **Direct/fallback mode** (no `ticket`): `ip`, `devkey`, `taskArn`, and `container`
    are supplied directly (e.g. from query params) and used as-is.
  - Both modes throw 400 if required values are missing or any of `container`/`taskArn`/
    `devkey`/`ip` contains a single quote (defense-in-depth against command injection).

- [ ] **Step 1: Write the failing test**

Append to `test/livelogs.test.js`:
```js
test("openStream rejects unknown ticket", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.openStream({ ticket: "nope", container: "web" }),
    (e) => e.status === 400);
});

test("openStream validates container against ticket and returns ssh context", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({ tasks: [{ taskArn: "arn:task/cl/abc",
      containerInstanceArn: "arn:ci/cl/ci1", containers: [{ name: "web" }] }] }),
    DescribeContainerInstancesCommand: () => ({
      containerInstances: [{ ec2InstanceId: "i-0abc" }] }),
  });
  const ec2 = fakeClient({ DescribeInstancesCommand: () => ({
    Reservations: [{ Instances: [{ PrivateIpAddress: "10.0.1.5" }] }] }) });
  const { ticket } = await livelogs.prepare(
    { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" }, { ecs, ec2 });

  assert.throws(() => livelogs.openStream({ ticket, container: "bad" }),
    (e) => e.status === 400);
  const ctx = livelogs.openStream({ ticket, container: "web" });
  assert.equal(ctx.ip, "10.0.1.5");
  assert.equal(ctx.devkey, "~/.ssh/ecs");
  assert.equal(ctx.taskArn, "arn:task/cl/abc");
  assert.equal(ctx.container, "web");
});

test("openStream direct/fallback mode without a ticket", () => {
  livelogs.__resetForTest();
  const ctx = livelogs.openStream({
    ip: "10.0.2.9", devkey: "~/.ssh/ecs",
    taskArn: "arn:task/cl/xyz", container: "api",
  });
  assert.equal(ctx.ip, "10.0.2.9");
  assert.equal(ctx.container, "api");
  assert.equal(ctx.taskArn, "arn:task/cl/xyz");
});

test("openStream direct mode requires ip/devkey/taskArn/container", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.openStream({ ip: "10.0.2.9", container: "api" }),
    (e) => e.status === 400);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `livelogs.openStream is not a function`.

- [ ] **Step 3: Write minimal implementation**

Add to `lib/livelogs.js`:
```js
function assertNoQuote(...vals) {
  for (const v of vals) {
    if (String(v).includes("'")) throwBad("Illegal character in stream parameters.");
  }
}

export function openStream({ ticket, container, ip, devkey, taskArn } = {}) {
  if (ticket) {
    const t = tickets.get(ticket);
    if (!t) throwBad("Unknown or expired ticket. Click Logs again.");
    const name = container || t.containers[0];
    if (!t.containers.includes(name)) throwBad("Container not part of this task.");
    assertNoQuote(name, t.taskArn, t.devkey, t.ip);
    return { ip: t.ip, devkey: t.devkey, taskArn: t.taskArn, container: name };
  }
  // Direct/fallback mode: no ticket, params supplied directly.
  if (!ip || !String(ip).trim()) throwBad("ip is required.");
  if (!devkey || !String(devkey).trim()) throwBad("device key path is required.");
  if (!taskArn || !String(taskArn).trim()) throwBad("taskArn is required.");
  if (!container || !String(container).trim()) throwBad("container is required.");
  assertNoQuote(container, taskArn, devkey, ip);
  return {
    ip: String(ip).trim(), devkey: String(devkey).trim(),
    taskArn: String(taskArn).trim(), container: String(container).trim(),
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS (11 passing).

- [ ] **Step 5: Commit**

```bash
git add lib/livelogs.js test/livelogs.test.js
git commit -m "feat(livelogs): validate stream ticket + container for SSH context

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Wire the JSON routes in `server.js`

**Files:**
- Modify: `server.js`

**Interfaces:**
- Consumes: `livelogs.activate`, `livelogs.listTasks`, `livelogs.prepare`.
- Produces routes: `POST /api/livelogs/activate`, `GET /api/livelogs/tasks`,
  `POST /api/livelogs/prepare`.

- [ ] **Step 1: Add the import**

In `server.js`, next to the other `lib` imports:
```js
import * as livelogs from "./lib/livelogs.js";
```

- [ ] **Step 2: Register the routes**

In the `routes` object, after the DNS map routes, add:
```js
  "POST /api/livelogs/activate": (b) => livelogs.activate(b),
  "GET /api/livelogs/tasks": (b, q) =>
    livelogs.listTasks({ cluster: q.get("cluster"), service: q.get("service") }),
  "POST /api/livelogs/prepare": (b) => livelogs.prepare(b),
```

- [ ] **Step 3: Syntax check**

Run: `node --check server.js`
Expected: no output (exit 0).

- [ ] **Step 4: Verify routes are wired (server not yet running the SSE part)**

Run:
```bash
node server.js & SRV=$!; sleep 1
curl -s -X POST http://127.0.0.1:8777/api/livelogs/prepare -H 'content-type: application/json' -d '{}'
echo
curl -s "http://127.0.0.1:8777/api/livelogs/tasks?cluster=&service="
echo
kill $SRV
```
Expected: both return a 400-style JSON error (`{"error":"No active credentials. Activate first."...}` or `cluster is required.`), **not** `Unknown API route.`

- [ ] **Step 5: Commit**

```bash
git add server.js
git commit -m "feat(livelogs): wire activate/tasks/prepare JSON routes

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: SSE log-stream endpoint in `server.js`

**Files:**
- Modify: `server.js`

**Interfaces:**
- Consumes: `livelogs.openStream({ ticket, container })`.
- Produces: `GET /api/livelogs/stream?ticket=<id>&container=<name>` — streams SSE.

- [ ] **Step 1: Add the `spawn` import**

At the top of `server.js`:
```js
import { spawn } from "node:child_process";
```

- [ ] **Step 2: Add the SSE handler function**

Add this function to `server.js` (near `handleApi`):
```js
function handleLiveLogsStream(req, res, url) {
  let ctx;
  try {
    ctx = livelogs.openStream({
      ticket: url.searchParams.get("ticket"),
      container: url.searchParams.get("container"),
      ip: url.searchParams.get("ip"),
      devkey: url.searchParams.get("devkey"),
      taskArn: url.searchParams.get("taskArn"),
    });
  } catch (err) {
    return sendJson(res, err?.status || 400, { error: err?.message || "stream error" });
  }

  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });
  res.write(": connected\n\n");

  const { ip, devkey, taskArn, container } = ctx;
  const remoteCmd =
    `CID=$(sudo docker ps ` +
    `--filter 'label=com.amazonaws.ecs.task-arn=${taskArn}' ` +
    `--filter 'label=com.amazonaws.ecs.container-name=${container}' -q | head -n 1); ` +
    `if [ -z "$CID" ]; then echo "No matching container on host"; exit 1; fi; ` +
    `sudo docker logs -f --tail 200 "$CID"`;

  const child = spawn("ssh", [
    "-i", devkey,
    "-o", "StrictHostKeyChecking=no",
    "-o", "BatchMode=yes",
    `ec2-user@${ip}`,
    remoteCmd,
  ]);

  let buf = "";
  const forward = (data) => {
    buf += data.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      res.write(`data: ${line}\n\n`);
    }
  };
  child.stdout.on("data", forward);
  child.stderr.on("data", forward);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
  const cleanup = () => { clearInterval(heartbeat); try { child.kill("SIGTERM"); } catch {} };

  child.on("close", (code) => {
    if (buf) res.write(`data: ${buf}\n\n`);
    res.write(`event: end\ndata: stream ended (exit ${code})\n\n`);
    clearInterval(heartbeat);
    res.end();
  });
  child.on("error", (e) => {
    res.write(`data: ssh error: ${e.message}\n\n`);
    res.write(`event: end\ndata: stream ended\n\n`);
    cleanup();
    res.end();
  });
  req.on("close", cleanup);
}
```

- [ ] **Step 3: Route the SSE path before `handleApi`**

In the `http.createServer` callback, change the API branch:
```js
const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/livelogs/stream") {
    return handleLiveLogsStream(req, res, url);
  }
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});
```

- [ ] **Step 4: Syntax check**

Run: `node --check server.js`
Expected: no output (exit 0).

- [ ] **Step 5: Verify the SSE endpoint handles a bad ticket cleanly**

Run:
```bash
node server.js & SRV=$!; sleep 1
curl -s "http://127.0.0.1:8777/api/livelogs/stream?ticket=bad&container=web"
echo
kill $SRV
```
Expected: JSON `{"error":"Unknown or expired ticket. Click Logs again."...}` and the
process exits (no hang).

- [ ] **Step 6: Commit**

```bash
git add server.js
git commit -m "feat(livelogs): SSE endpoint streaming docker logs -f over ssh

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 7: `livelogs.html` — the tab UI

**Files:**
- Create: `livelogs.html`

**Interfaces:**
- Consumes: `POST /api/livelogs/activate` `{ exportsText, region }`;
  `GET /api/livelogs/tasks?cluster=&service=`; `POST /api/livelogs/prepare`
  `{ cluster, task, devkey }` → `{ ticket, ip, containers }`;
  `GET /api/livelogs/stream?ticket=&container=` (SSE).
- Produces: a self-contained page (no exports).

- [ ] **Step 1: Create the page**

Create `livelogs.html`:
```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>LiveLogs</title>
<style>
  :root {
    --bg:#000; --panel:#04120a; --border:#0f3d1f; --text:#00ff41; --muted:#2ea043;
    --accent:#00ff41; --hover:#0a2612; --green:#00ff41; --glow:0 0 6px #00ff41,0 0 12px #00a82a;
  }
  *{box-sizing:border-box;}
  html,body{height:100%;}
  body{margin:0;font:13px/1.5 "Courier New",ui-monospace,Menlo,Consolas,monospace;
    background:var(--bg);color:var(--text);display:flex;flex-direction:column;
    text-shadow:0 0 2px rgba(0,255,65,.4);}
  h2{font-size:14px;margin:0 0 8px;text-transform:uppercase;letter-spacing:2px;text-shadow:var(--glow);}
  .wrap{padding:16px 20px;overflow:auto;}
  .row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-end;margin-bottom:10px;}
  label{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--muted);text-transform:uppercase;letter-spacing:1px;}
  input,textarea{background:var(--panel);border:1px solid var(--border);color:var(--text);
    padding:8px 10px;border-radius:4px;outline:none;font-family:inherit;font-size:13px;}
  input:focus,textarea:focus{border-color:var(--accent);box-shadow:var(--glow);}
  input.wide{min-width:520px;} textarea{min-width:520px;height:70px;resize:vertical;}
  button{background:var(--panel);border:1px solid var(--border);color:var(--text);
    padding:8px 14px;border-radius:4px;cursor:pointer;font-family:inherit;font-size:12px;
    text-transform:uppercase;letter-spacing:1px;}
  button:hover{background:var(--hover);border-color:var(--accent);box-shadow:var(--glow);}
  .accent{border-color:var(--accent);color:var(--accent);text-shadow:var(--glow);}
  .msg{font-size:12px;color:var(--muted);min-height:16px;margin:4px 0;}
  .msg.err{color:#ff6b6b;text-shadow:none;}
  table{border-collapse:collapse;width:100%;font-size:12px;margin-top:8px;}
  th,td{text-align:left;padding:6px 10px;border-bottom:1px solid var(--border);white-space:nowrap;}
  th{background:#041a0c;color:var(--green);text-transform:uppercase;letter-spacing:1px;}
  tbody tr:hover{background:var(--hover);}
  fieldset{border:1px solid var(--border);border-radius:6px;margin:0 0 14px;padding:12px;}
  legend{color:var(--green);text-transform:uppercase;letter-spacing:1px;font-size:11px;padding:0 6px;}
  #console{background:#000;border:1px solid var(--green);border-radius:6px;height:340px;
    overflow:auto;padding:10px;white-space:pre-wrap;word-break:break-all;font-size:12px;
    box-shadow:0 -2px 12px rgba(0,255,65,.15);margin-top:8px;}
  .hide{display:none;}
</style>
</head>
<body>
<div class="wrap">
  <h2>&#9608; LiveLogs</h2>

  <fieldset>
    <legend>1 · Connect</legend>
    <div class="row">
      <label>Device key path<input id="devkey" class="wide" placeholder="~/.ssh/ecs"></label>
      <label>Region<input id="region" value="us-west-2"></label>
    </div>
    <div class="row">
      <label>AWS exports<textarea id="exports" placeholder="export AWS_ACCESS_KEY_ID=...&#10;export AWS_SECRET_ACCESS_KEY=...&#10;export AWS_SESSION_TOKEN=..."></textarea></label>
      <button id="activate" class="accent">Activate</button>
    </div>
    <div id="connectMsg" class="msg"></div>
  </fieldset>

  <fieldset>
    <legend>2 · Target</legend>
    <div class="row">
      <label>Cluster ARN (ECS ARN)<input id="cluster" class="wide" placeholder="arn:aws:ecs:...:cluster/..."></label>
    </div>
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

  <fieldset>
    <legend>3 · Logs</legend>
    <div class="row">
      <span id="streamLabel" class="msg"></span>
      <div style="flex:1"></div>
      <button id="stop" class="hide">Stop</button>
      <button id="clear">Clear</button>
    </div>
    <div id="console"></div>
  </fieldset>
</div>

<script>
const $ = (id) => document.getElementById(id);
function escapeHtml(s){return String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));}
function escapeAttr(s){return escapeHtml(s).replace(/'/g,"&#39;");}
function setMsg(el,text,isErr){el.textContent=text||"";el.classList.toggle("err",!!isErr);}

async function api(method, path, body){
  const opt={method,headers:{}};
  if(body!==undefined){opt.headers["content-type"]="application/json";opt.body=JSON.stringify(body);}
  const res=await fetch(path,opt);
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||("HTTP "+res.status));
  return data;
}

$("activate").onclick=async()=>{
  setMsg($("connectMsg"),"Activating…");
  try{
    const r=await api("POST","/api/livelogs/activate",
      {exportsText:$("exports").value,region:$("region").value});
    setMsg($("connectMsg"),"Active · region "+r.region);
  }catch(e){setMsg($("connectMsg"),e.message,true);}
};

$("listTasks").onclick=async()=>{
  setMsg($("tasksMsg"),"Loading tasks…");
  $("tasksTable").classList.add("hide");
  try{
    const cluster=encodeURIComponent($("cluster").value.trim());
    const service=encodeURIComponent($("service").value.trim());
    const r=await api("GET",`/api/livelogs/tasks?cluster=${cluster}&service=${service}`);
    const tb=$("tasksTable").querySelector("tbody");
    if(!r.tasks.length){setMsg($("tasksMsg"),"No running tasks.");tb.innerHTML="";return;}
    tb.innerHTML=r.tasks.map(t=>
      `<tr><td>${escapeHtml(t.id)}</td><td>${escapeHtml(t.lastStatus||"")}</td>`+
      `<td>${escapeHtml(t.taskDefinition||"")}</td><td>${escapeHtml(t.startedAt||"")}</td>`+
      `<td><button class="accent" data-task="${escapeAttr(t.taskArn)}" `+
      `data-containers="${escapeAttr((t.containers||[]).join(","))}">Logs &#9654;</button></td></tr>`
    ).join("");
    setMsg($("tasksMsg"),r.tasks.length+" running task(s).");
    $("tasksTable").classList.remove("hide");
  }catch(e){setMsg($("tasksMsg"),e.message,true);}
};

let es=null;
function stopStream(){
  if(es){es.close();es=null;}
  $("stop").classList.add("hide");
}
$("stop").onclick=stopStream;
$("clear").onclick=()=>{$("console").textContent="";};

function appendLine(text){
  const c=$("console");
  const atBottom=c.scrollHeight-c.scrollTop-c.clientHeight<40;
  c.textContent+=text+"\n";
  if(atBottom) c.scrollTop=c.scrollHeight;
}

$("tasksTable").addEventListener("click",async(e)=>{
  const btn=e.target.closest("button[data-task]");
  if(!btn) return;
  const task=btn.dataset.task;
  const containers=(btn.dataset.containers||"").split(",").filter(Boolean);
  stopStream();
  setMsg($("streamLabel"),"Preparing…");
  try{
    const r=await api("POST","/api/livelogs/prepare",
      {cluster:$("cluster").value.trim(),task,devkey:$("devkey").value.trim()});
    let container=r.containers[0];
    if(r.containers.length>1){
      const pick=prompt("Container ("+r.containers.join(", ")+"):",r.containers[0]);
      if(!pick) {setMsg($("streamLabel"),"Cancelled.");return;}
      container=pick.trim();
    }
    setMsg($("streamLabel"),`${container} @ ${r.ip}`);
    es=new EventSource(`/api/livelogs/stream?ticket=${encodeURIComponent(r.ticket)}&container=${encodeURIComponent(container)}`);
    $("stop").classList.remove("hide");
    es.onmessage=(ev)=>appendLine(ev.data);
    es.addEventListener("end",(ev)=>{appendLine("— "+ev.data+" —");stopStream();});
    es.onerror=()=>{appendLine("— connection closed —");stopStream();};
  }catch(err){setMsg($("streamLabel"),err.message,true);}
});
</script>
</body>
</html>
```

- [ ] **Step 2: Syntax-check the inline script**

Run:
```bash
awk '/<script>/{f=1;next}/<\/script>/{f=0}f' livelogs.html > /tmp/livelogs.script.js && node --check /tmp/livelogs.script.js && echo OK && rm /tmp/livelogs.script.js
```
Expected: `OK`.

- [ ] **Step 3: Verify the page serves**

Run:
```bash
node server.js & SRV=$!; sleep 1
curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:8777/livelogs.html
kill $SRV
```
Expected: `200`.

- [ ] **Step 4: Commit**

```bash
git add livelogs.html
git commit -m "feat(livelogs): LiveLogs tab UI (connect, task list, live console)

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 8: Wire the tab into `index.html`

**Files:**
- Modify: `index.html`

**Interfaces:**
- Consumes: `livelogs.html`.
- Produces: a 5th tab `data-tab="livelogs"` after DNS Map.

- [ ] **Step 1: Add the tab button**

In the `.tabbar` nav, after the DNS Map button:
```html
  <button class="tab" data-tab="livelogs">LiveLogs</button>
```

- [ ] **Step 2: Add the panel**

After the `#dnsPanel` block:
```html
<div id="livelogsPanel" class="panel hidden">
  <iframe id="livelogsFrame" title="LiveLogs"></iframe>
</div>
```

- [ ] **Step 3: Extend the panel/frame CSS**

Update these two CSS rules to include the new ids:
```css
  #spectrumPanel, #awsPanel, #dnsPanel, #livelogsPanel { flex: 1 1 auto; min-height: 0; }
  #spectrumFrame, #awsFrame, #dnsFrame, #livelogsFrame { width: 100%; height: 100%; border: 0; display: block; }
  #csvPanel.hidden, #spectrumPanel.hidden, #awsPanel.hidden, #dnsPanel.hidden, #livelogsPanel.hidden { display: none; }
```

- [ ] **Step 4: Register the panel and lazy iframe in the tab script**

In the `tabs()` IIFE, add to `panels`:
```js
    livelogs: document.getElementById("livelogsPanel"),
```
and to `lazy`:
```js
    livelogs: { frame: document.getElementById("livelogsFrame"), src: "livelogs.html", loaded: false },
```

- [ ] **Step 5: Manual smoke test**

Run:
```bash
node server.js & SRV=$!; sleep 1
curl -s http://127.0.0.1:8777/ | grep -c 'data-tab="livelogs"'
kill $SRV
```
Expected: `1`. Then optionally open http://127.0.0.1:8777/ and confirm the **LiveLogs**
tab appears after DNS Map and loads the iframe on click.

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(livelogs): add LiveLogs tab beside DNS Map

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 9: Document the tab in `AGENT.md`

**Files:**
- Modify: `AGENT.md`

- [ ] **Step 1: Add a tab entry**

In the tab list near the top of `AGENT.md`, add after the DNS Map entry:
```markdown
5. **LiveLogs** (`livelogs.html`) — standalone browser port of `accesslogs.sh`. Paste
   AWS `export` creds + region + a device SSH key path, enter a cluster ARN + service
   ARN, list running tasks, and click **Logs** to stream live `docker logs -f`
   (`--tail 200`) from the task's container. Backend `lib/livelogs.js` resolves task →
   container-instance EC2 → private IP, then the SSE route
   `GET /api/livelogs/stream` spawns `ssh ec2-user@<ip> … sudo docker logs -f`.
   Creds are in-memory only; SSH mirrors the script (`StrictHostKeyChecking=no`).
```

- [ ] **Step 2: Add file-map entries**

In the "Architecture / file map" block, add:
```
lib/livelogs.js      LiveLogs backend: in-memory creds + task->EC2 IP resolution +
                     SSH log-stream ticketing. Used by /api/livelogs/* routes.
livelogs.html        LiveLogs tab UI (connect panel, task list, live SSE console).
```

- [ ] **Step 3: Commit**

```bash
git add AGENT.md
git commit -m "docs(livelogs): document the LiveLogs tab

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Final verification

- [ ] Run the full unit suite: `npm test` → all passing (11 livelogs + existing parse-creds).
- [ ] `node --check server.js lib/livelogs.js` → clean.
- [ ] Live end-to-end (requires real creds + EC2-launch-type ECS service + device key):
  activate → list tasks → click **Logs** → confirm a live `docker logs -f` stream that
  stops on **Stop** and does not leave an `ssh` process behind (`ps` check).
