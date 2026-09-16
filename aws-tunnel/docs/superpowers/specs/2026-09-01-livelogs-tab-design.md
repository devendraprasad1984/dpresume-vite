# LiveLogs tab — Design

Date: 2026-09-01
Status: Approved (pending spec review)

## Summary

Add a fifth top-level tab, **LiveLogs**, to the Swiss Army Knife toolbox, positioned
beside **DNS Map**. It is a browser-driven port of `accesslogs.sh`: given AWS
credentials, a device SSH key, an ECS cluster ARN and a service ARN, it lists the
service's running tasks and lets the user click a **Logs** button per task to watch a
live `docker logs -f` stream from the container running on its EC2 host.

The backend resolves a task down to the private IP of its container-instance EC2, then
SSHes in (as `ec2-user`, using the provided device key) and follows the Docker logs of
the matching container, streaming lines to the browser via Server-Sent Events (SSE).

This tab is **standalone**: it holds its own in-memory AWS credentials and does not
depend on the AWS Tunnel tab.

## Non-goals (YAGNI)

- No `ssh`-into-container shell or `describe`/stopped-task modes (only live logs).
- No ECS Exec / SSM path (mirrors the SSH + `sudo docker logs` path of the script).
- No Fargate support — assumes the EC2 launch type (there is an SSH host to reach).
- No credential persistence to disk (in-memory only, like the AWS tab's active creds).
- No multi-user / no auth (consistent with the rest of this local-only tool).
- No log search/download in v1 (just live view, Stop, Clear, autoscroll).

## User-facing flow (`livelogs.html`)

1. **Connect panel** (top):
   - **Device key path** — filesystem path to the SSH key (e.g. `~/.ssh/ecs`).
   - **AWS exports** — textarea to paste `export AWS_ACCESS_KEY_ID=… / SECRET / SESSION_TOKEN`.
   - **Region** — text field, default `us-west-2` (editable).
   - **Activate** button → parses and holds creds/region in memory server-side.
2. **Target inputs**:
   - **Cluster ARN** (the "ECS ARN").
   - **Service ARN**.
   - **List Tasks** button.
3. **Task table** — one row per running task: task id, last status, task definition,
   started-at, and a **Logs ▶** button. When a task has multiple containers, a small
   container picker is shown before streaming.
4. **Console panel** — opens on **Logs**; shows the live `docker logs -f` output
   (seeded with `--tail 200`) with **Stop**, **Clear**, and autoscroll.

## Architecture

### New backend module `lib/livelogs.js`

Isolated from `lib/aws.js`, with its own in-memory store and a short-lived ticket map.

- `store = { creds, region }` — creds parsed via the existing `lib/parse-creds.js`.
  Never written to disk; cleared on process exit.
- `tickets = Map<id, { ip, devkey, taskArn, containers[], createdAt }>` — short-lived
  (TTL-expired) records that back an SSE stream request without putting connection
  details in the query string beyond an opaque id.

Functions:

- `activate({ exportsText, region })` → parse exports, store creds + region.
  Throws `400` (via the shared `throwBad`-style error with `err.status = 400`) if no
  usable credentials are found.
- `requireCreds()` → returns the stored creds or throws `400 "No active credentials.
  Activate first."` (mirrors `aws.js` `requireActive()`).
- `listTasks({ cluster, service })` → ECS `ListTasks` (desired status RUNNING) +
  `DescribeTasks`; returns `[{ taskArn, id, lastStatus, taskDefinition, startedAt,
  containers: [name] }]`.
- `prepare({ cluster, task, devkey })` → resolve task → `containerInstanceArn` →
  ECS `DescribeContainerInstances` → `ec2InstanceId` → EC2 `DescribeInstances` →
  `PrivateIpAddress`. Validates devkey is provided. Creates a ticket and returns
  `{ ticket: id, ip, containers: [name] }`.
- `openStream({ ticket, container })` → validates the ticket exists and the container
  name is one of the ticket's containers; returns `{ ip, devkey, taskArn, container }`
  for the server to spawn `ssh`. (Pure lookup/validation — no process spawn here.)
- `sweepTickets()` — drop tickets older than the TTL (called opportunistically).

New AWS SDK usage:
- Add `DescribeContainerInstancesCommand` to the existing `@aws-sdk/client-ecs` import
  set (used only by this module via its own client factory, or a small shared helper).
- Add a new dependency-free-to-install `@aws-sdk/client-ec2` with
  `DescribeInstancesCommand` for the private-IP lookup.
- `livelogs.js` builds its own ECS/EC2 clients from its own creds/region store — it
  does **not** reuse `aws.js`'s `requireActive()` client factories.

### Streaming endpoint in `server.js`

`docker logs -f` is a continuous one-way stream, so it does not fit the JSON route
table. Add a **special-cased SSE handler** checked before `handleApi`:

- `GET /api/livelogs/stream?ticket=<id>&container=<name>`
  - Calls `livelogs.openStream(...)` to validate and resolve `{ ip, devkey, taskArn,
    container }`.
  - Writes SSE headers (`content-type: text/event-stream`, `cache-control: no-cache`,
    `connection: keep-alive`).
  - `spawn("ssh", ["-i", devkey, "-o", "StrictHostKeyChecking=no",
    "ec2-user@" + ip, remoteCmd])` — **array args, no shell**, to avoid injection.
  - `remoteCmd` finds the container id by the ECS labels
    (`com.amazonaws.ecs.task-arn`, `com.amazonaws.ecs.container-name`) and runs
    `sudo docker logs -f --tail 200 <cid>`. `taskArn`/`container` are validated
    server-side (taskArn comes from AWS, container is checked against the ticket) and
    single-quoted inside `remoteCmd`.
  - Pipe child `stdout`/`stderr` line-buffered → SSE `data:` events; emit periodic
    comment heartbeats to keep the connection alive.
  - On `req`/`res` `close` (Stop button, tab switch, page unload) → `child.kill()`.

JSON routes added to the normal route table:
- `POST /api/livelogs/activate` → `livelogs.activate(b)`
- `GET  /api/livelogs/tasks?cluster=…&service=…` → `livelogs.listTasks(...)`
- `POST /api/livelogs/prepare` → `livelogs.prepare(b)`

### Tab integration

- New file `livelogs.html`, loaded as an isolated `<iframe>` like Spectrum / AWS /
  DNS tabs, reusing the shared Matrix-green theme and the `$`, `api`, `setMsg`,
  `escapeHtml`/`escapeAttr` helper conventions from `aws.html`.
- In `index.html`:
  - Add a 5th tab button `data-tab="livelogs"` after the DNS Map tab.
  - Add an `#livelogsPanel` panel containing `#livelogsFrame`.
  - Register the iframe in the existing generic `lazy` map (`src: "livelogs.html"`)
    so it loads on first activation.
  - Extend the ID-specific hide CSS:
    `#…, #livelogsPanel.hidden { display: none }` and the sizing rule for the frame.

### Browser side (`livelogs.html`)

- Uses `fetch` (`api(...)`) for activate / list-tasks / prepare.
- Uses the native `EventSource` for the log stream:
  - On **Logs**: call `prepare`; if one container, open the stream; if several, show a
    picker, then open `new EventSource("/api/livelogs/stream?ticket=…&container=…")`.
  - Append `event.data` lines to the console; autoscroll unless the user scrolled up.
  - **Stop** → `eventSource.close()`. **Clear** → empty the console element.
  - Switching away from a task / closing replaces or closes the current `EventSource`
    so only one stream runs at a time.

## Error handling

- Backend user errors throw `Error` with `err.status = 400` → mapped by `server.js` to
  `{ error, code }` JSON (existing convention). Examples: no creds, missing cluster/
  service/devkey, task not found, no running tasks, could not resolve EC2/private IP.
- SSE stream: if `ssh` exits non-zero or emits stderr (bad key, unreachable host, no
  matching container), forward the message as an SSE `data:` line and end the stream so
  the console shows the failure; the child is always killed on disconnect.
- Ticket not found / container not in ticket → `400`.

## Security

- Server stays bound to `127.0.0.1` only; no auth/TLS (consistent with the tool).
- AWS credentials are in memory only (never written to disk), like the AWS tab's
  active creds. No logging echoes secret values or tokens.
- SSH uses the user-supplied **device key path** (read locally by `ssh`, never
  uploaded) and `StrictHostKeyChecking=no` + `ec2-user` + `sudo docker`, mirroring
  `accesslogs.sh` exactly. The tradeoff (host-key checking disabled) is inherited from
  the script and unchanged.
- `ssh` is invoked via `spawn` with an argument array (no shell); interpolated values
  in the remote command are validated (container against ticket list, taskArn from AWS)
  and single-quoted to prevent command injection.

## Testing / verification

- Syntax: `node --check server.js lib/livelogs.js`; for `livelogs.html`, extract the
  `<script>` block and `node --check` it (per AGENT.md).
- Unit: add a `test/livelogs.test.js` (`node --test`) covering `parse`/`activate`
  guards, `prepare` validation errors, and `openStream` ticket/container validation
  (mock the AWS SDK clients; no live calls).
- Route wiring: `curl` each new JSON route — `400` ("No active credentials." or a
  validation message) means wired correctly; `404` means the route is missing.
- SSE: `curl -N "http://127.0.0.1:8777/api/livelogs/stream?ticket=bad"` returns a
  clean error event rather than hanging or crashing.
- Live end-to-end: paste fresh creds, a real cluster/service ARN and device key,
  confirm task listing and a live `docker logs -f` stream that stops on **Stop**.

## Dependencies

- Adds `@aws-sdk/client-ec2` (v3, matching the existing SDK v3 versions) for
  `DescribeInstances`. All other pieces reuse existing modules and Node built-ins
  (`node:child_process` `spawn`).
