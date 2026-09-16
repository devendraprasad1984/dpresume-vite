# AGENT.md — Swiss Army Knife

Context for AI agents (and humans) working in this repo. Read this first.

## What this is

A **local, single-user developer toolbox** served by a tiny Node HTTP server. It is
**not** a deployable web app — it runs on the developer's own laptop, bound to
`127.0.0.1`, and is intended for hands-on operational tasks. It started life as a
CSV viewer ("csv-viewer") and grew into a multi-tool, hence the rename.

Three tabs (top-level, in `index.html`, each an isolated `<iframe>`):

1. **Secret CSV** (`index.html`'s own panel) — a Matrix-green CSV viewer. Custom CSV
   parser, sortable/filterable table, auto-masks any column whose header contains
   `pass` / `pwd` / `secret` (value stays copyable). Auto-loads sibling `data.csv`.
2. **Spectrum** (`spectrum-analyzer.html`) — a self-contained microphone spectrum
   analyzer (Web Audio + canvas). Loaded lazily on first tab activation.
3. **AWS Tunnel** (`aws.html`) — assume-role into an AWS account and drive several
   services from the browser via the local Node backend. This is the biggest piece.
4. **DNS Map** (`dns-map.html`) — a live directed-graph builder. Textarea of
   `a -> b` links (multi-hop chains + optional `[tag]` per node) is parsed by the
   shared pure module `lib/dns-graph.js` and rendered as a hand-rolled SVG
   force-directed graph (zero deps). Edits persist to git-ignored
   `dns-map.local.txt` via `lib/dns-map.js` + `GET/POST /api/dns-map`, seeded from
   committed `dns-map.sample.txt`. Tag→category/color map: `dns-map-categories.json`.

5. **LiveLogs** (`livelogs.html`) — standalone browser port of `accesslogs.sh`. Paste
   AWS `export` creds + region + a device SSH key path, enter a cluster ARN + service
   ARN, list running tasks, and click **Logs** to stream live `docker logs -f`
   (`--tail 200`) from the task's container. Backend `lib/livelogs.js` resolves task →
   container-instance EC2 → private IP, then the SSE route
   `GET /api/livelogs/stream` spawns `ssh ec2-user@<ip> … sudo docker logs -f`.
   Creds are in-memory only; SSH mirrors the script (`StrictHostKeyChecking=no`).
   Cluster/service pickers (`GET /api/livelogs/clusters` + `/services`) let you
   list-and-click instead of pasting ARNs; non-secret fields (devkey, region,
   cluster, service) auto-persist to browser `localStorage` and a **Clear All**
   button resets everything. The console supports add/remove substring filters
   (OR) and a **Record** toggle that appends matching lines to `~/logs.txt`
   (`POST /api/livelogs/record`, per-stream registry in `lib/livelogs.js`).

## Run it

```bash
npm install
npm start          # === node server.js
# open http://127.0.0.1:8777/
```

- Server binds **127.0.0.1:8777** only (see `server.js` `HOST`/`PORT`).
- `npm test` runs Node's built-in test runner (`node --test`) — currently
  `test/parse-creds.test.js`.

### ⚠️ The #1 footgun: HTTP 501

If you see **HTTP 501** on any AWS action, you are almost certainly loading the app
through a stale **Python `http.server`** (often on `:8080`) instead of the Node
server. Python's `http.server` only implements GET/HEAD and returns **501 to every
POST**. Fix: close it and use **http://127.0.0.1:8777/**. The AWS tab's POST calls
(`/api/aws/*`) require the Node server. This has bitten us twice — check the port first.

## AWS Tunnel — the model

CORS blocks browsers from calling AWS APIs directly, so `aws.html` (browser) talks to
`server.js` (Node), which uses the AWS SDK v3. **Credentials live in memory only**
(`lib/aws.js` `store = { base, region, active }`) and are never written to disk by the
credential path.

**Two-lock UX** (mirror the visual "lock" metaphor in the UI):

- **Lock #1 · Assume Role** — paste base AWS `export …` lines + Role ARN / Region /
  (optional) Session name → `sts:AssumeRole` → temporary creds are formatted back into
  the "Assumed-role exports" box (area 2). Handler: `assumeRole()`.
- **Lock #2 · Activate** — takes the exports in area 2 (or anything you paste there)
  and marks them **active** for all subsequent service calls. Handler: `activate()`.
  Every service handler calls `requireActive()`, which throws `400 "No active
  credentials. Lock #2 first."` when nothing is active.

**Connect profile persistence** (opt-in convenience): the Connect form (base exports,
role ARN, region, session name — **not** the temporary active exports, which expire)
can be saved to a local file so it survives a page reload.
- File: `connect-profile.local.json` at repo root, written with mode `0600`,
  **git-ignored**. Module: `lib/profile.js`. Routes: `GET/POST/DELETE /api/aws/profile`.
- **Security:** this writes the long-lived base secret key to disk in plaintext. It is
  an explicit, laptop-only convenience. Never commit that file; never widen this to a
  shared/committed location.

### Services implemented (subtabs in `aws.html`, handlers in `lib/aws.js`)

| Subtab          | Operations                                                                 |
|-----------------|----------------------------------------------------------------------------|
| Secrets Manager | List (name filter), Get value, Describe, Put value                          |
| ECS             | List clusters/services/tasks, Describe service/task, Update service, Stop task |
| ACM             | List, Describe, Request (DNS validation)                                    |
| S3              | List buckets, Get bucket location, List objects (prefix), Get object (≤1 MB text view/download), Put object (text) |
| Route53         | List zones, Get zone, List records (paginated), Change record (UPSERT/DELETE) |
| KMS             | **Not yet implemented** (subtab disabled placeholder).                      |

## Architecture / file map

```
server.js            HTTP server (127.0.0.1:8777). Static files + /api/* route table.
                     Route table maps "METHOD /path" strings to lib functions.
                     Path-traversal guard on static serving. POST bodies parsed as JSON.
lib/
  aws.js             All AWS SDK operations + in-memory cred store + client factories.
                     Helpers: requireActive(), throwBad(msg) (sets err.status=400),
                     chunk() (Describe* APIs cap at 10/100), shortName() (ARN tail),
                     zoneId() (strips /hostedzone/ prefix).
  parse-creds.js     Parses pasted "export/set AWS_… = …" text into a creds object
                     (handles quotes, aliases, prefixes).
  profile.js         Connect-form persistence (save/load/clear) to connect-profile.local.json.
  dns-graph.js       Pure parseGraph(text, config) for the DNS Map tab (browser + Node).
  dns-map.js         DNS Map relationship-text persistence (dns-map.local.txt).
  livelogs.js        LiveLogs backend: in-memory creds + task->EC2 IP resolution +
                     SSH log-stream ticketing. Used by /api/livelogs/* routes.
index.html           Outer shell: 3-tab bar + generic lazy iframe tab switcher + CSV viewer.
aws.html             AWS Tunnel UI (Connect two-lock panel + service subtabs).
spectrum-analyzer.html  Standalone mic spectrum analyzer.
dns-map.html         DNS Map tab UI (SVG force-directed graph + autosave textarea).
dns-map.sample.txt   SAMPLE fake topology seed for the DNS Map (safe to commit).
dns-map-categories.json  Tag -> {label,color} map + default category for DNS Map.
livelogs.html        LiveLogs tab UI (connect panel, task list, live SSE console).
data.csv             SAMPLE data for the CSV viewer (sanitized/fake — safe to commit).
test/parse-creds.test.js  node --test suite for the creds parser.
```

## Conventions & patterns (follow these when extending)

- **Adding an AWS operation:** write the handler in `lib/aws.js` (start with
  `requireActive()`, validate args with `throwBad("… is required.")`, keep responses
  as plain JSON with short field names), then register a `"METHOD /api/aws/…"` entry in
  the `routes` table in `server.js`, then add UI + a `fetch` call in `aws.html`.
- **Backend errors:** throw `Error` with `err.status = 400` for user errors; `server.js`
  maps it to `{ error, code }` JSON. Anything else becomes 500.
- **UI helpers in `aws.html`:** `$(id)`, `api(method, path, body?)`, `setMsg(el, text,
  isErr?)`. HTML-escape all interpolated values with `escapeHtml` / `escapeAttr`.
- **Client-side "contains" filters:** long lists (ECS services/tasks, ACM certs, S3
  objects, Route53 records) each have a search `<input>` wired via `wireFilter(inputId,
  tableId)` + `resetFilter(inputId, tableId, count)` (shows the box only when rows
  exist). Reuse these helpers; don't add server round-trips for filtering. Do **not**
  add filters to short dropdowns (bucket/zone/cluster selects) — "do it wisely".
- **Tab switching (`index.html`):** a generic `lazy` map sets each iframe's `src` on
  first activation (avoids zero-width canvas/container). Panel hiding relies on
  ID-specific CSS: `#csvPanel.hidden, #spectrumPanel.hidden, #awsPanel.hidden { display:none }`.
- **Subtab switching (`aws.html`):** toggles `.svc-panel` display by `svc-<name>` id.
- **Comment sparingly** — only where intent isn't obvious.

## Security rules (do not violate)

- **Never commit real credentials.** `data.csv` in the repo is fake sample data. The
  original tool had a `data.csv` with real plaintext creds — that file was **not**
  migrated. If you regenerate sample data, keep it obviously fake.
- `connect-profile.local.json` is git-ignored and may contain a real secret key — never
  commit it, never print its contents in logs/PRs.
- Keep the server bound to `127.0.0.1`. This tool has no auth; do not expose it.
- Credentials are in-memory by design (except the opt-in profile file). Don't add
  logging that echoes secret values or tokens.

## Testing / verification workflow

- Syntax: `node --check <file>` for `.js`; for `aws.html`, extract the `<script>` block
  and `node --check` it (e.g. `awk '/<script>/{f=1;next}/<\/script>/{f=0}f' aws.html`).
- Unit: `npm test` (creds parser).
- Route wiring: `curl` each `/api/aws/*` route; **400** ("No active credentials" or a
  validation message) means wired correctly, **404** means the route is missing.
- DOM behavior (tab/subtab switching, filters): jsdom with `runScripts:"dangerously"`,
  stub `fetch`/`alert`/`confirm` and `HTMLCanvasElement.prototype.getContext`. The page
  runs `setInterval` (status refresh + matrix), so the jsdom process won't exit on its
  own — stop it explicitly after assertions.
- Live AWS: paste fresh creds (STS temp creds expire ~1h) and exercise the subtab.

## Environment notes

- Node ESM (`"type": "module"`). Developed on Node v24, AWS SDK v3.
- No build step — plain HTML/JS served as-is.
- macOS: kill processes by explicit numeric PID (`lsof -ti tcp:8777` then `kill <pid>`);
  avoid `pkill`/`killall`.

## History / status

- Done: CSV viewer, Spectrum tab, AWS Tunnel (Secrets, ECS, ACM, S3, Route53),
  client-side search filters, Connect profile save/clear.
- Pending: **KMS** subtab (Decrypt/Encrypt/GenerateDataKey/DescribeKey) — placeholder
  is disabled in `aws.html`.
- Original request also mentioned S3 multipart-abort and broader KMS; scoped down to
  what's above. Route53 permissions on some roles may be missing — surfaces as a clean
  error, not a crash.
