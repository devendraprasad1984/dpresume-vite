# DNS Map Tab Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a fourth "DNS Map" tab to the Swiss Army Knife toolbox — a live graph builder where the user types directed `a -> b` relationships and an SVG force-directed graph draws itself, with color-coded categories and backend-persisted data.

**Architecture:** A new self-contained `dns-map.html` iframe tab renders an SVG graph using a tiny hand-rolled force layout (zero deps). A shared pure ES module `lib/dns-graph.js` parses the relationship text (importable by both browser and Node tests). Relationships persist to a git-ignored `dns-map.local.txt` via `lib/dns-map.js` and two new `server.js` routes, seeded from a committed fake `dns-map.sample.txt`. The tag→category/color mapping lives in committed `dns-map-categories.json`.

**Tech Stack:** Node ESM (`"type": "module"`, Node v24), vanilla browser JS, SVG, `node --test`. No build step, no external/CDN dependencies.

## Global Constraints

- Node ESM only (`"type": "module"`); every `.js` file uses `import`/`export`.
- Zero external/runtime dependencies — no CDN, no new npm packages. Everything self-contained.
- No build step — HTML/JS served as-is by `server.js`.
- Server binds `127.0.0.1` only; local single-user tool, no auth.
- Backend user errors: `throw new Error(msg)` with `err.status = 400`; `server.js` maps to `{ error, code }` JSON.
- Files that may contain real internal hostnames are git-ignored (like `data.csv`, `connect-profile.local.json`); local data files written with mode `0600`.
- Comment sparingly — only where intent isn't obvious.
- Tests use `node --test` with `node:test` + `node:assert/strict`, mirroring `test/parse-creds.test.js`.

---

## File Structure

- **Create (committed):**
  - `dns-map-categories.json` — tag → `{ label, color }` map + `default` key.
  - `dns-map.sample.txt` — small fake example topology (seed).
  - `lib/dns-graph.js` — pure `parseGraph(text, config)` parser (browser + Node).
  - `lib/dns-map.js` — backend `loadMap()` / `saveMap(text)` persistence.
  - `dns-map.html` — the tab UI (SVG force graph + textarea + autosave + legend).
  - `test/dns-graph.test.js` — parser unit tests.
  - `test/dns-map.test.js` — persistence unit tests.
- **Modify:**
  - `.gitignore` — add `dns-map.local.txt`.
  - `server.js` — add 2 routes + import `lib/dns-map.js`.
  - `index.html` — add 4th tab button, panel, iframe, lazy-load + hide CSS.
  - `README.md`, `AGENT.md` — document the new tab.
- **Runtime (git-ignored, created by app):** `dns-map.local.txt`.

---

### Task 1: Config, sample data, and gitignore

**Files:**
- Create: `dns-map-categories.json`
- Create: `dns-map.sample.txt`
- Modify: `.gitignore`

**Interfaces:**
- Consumes: nothing.
- Produces: `dns-map-categories.json` shape `{ default: string, categories: { [tag]: { label: string, color: string } } }` consumed by `lib/dns-graph.js` (`parseGraph`) and `dns-map.html` (legend + node colors). `dns-map.sample.txt` seed text consumed by `lib/dns-map.js` `loadMap()`.

- [ ] **Step 1: Create the category config**

Create `dns-map-categories.json`:

```json
{
  "default": "public",
  "categories": {
    "public": { "label": "Public domain",  "color": "#9ca3af" },
    "r53":    { "label": "Route 53 / DNS",  "color": "#a78bfa" },
    "cdn":    { "label": "CDN",             "color": "#34d399" },
    "lb":     { "label": "Load balancer",   "color": "#f59e0b" },
    "db":     { "label": "Database",        "color": "#f87171" },
    "app":    { "label": "App / origin",    "color": "#60a5fa" }
  }
}
```

- [ ] **Step 2: Create the fake sample topology**

Create `dns-map.sample.txt`:

```
# DNS Map sample — fake data. One or more links per line: a -> b -> c
# Optional [tag] after a node sets its category (see dns-map-categories.json).
acme.com [r53] -> www.acme.com
www.acme.com -> cdn.acme.com [cdn]
cdn.acme.com -> alb-prod.acme.com [lb]
alb-prod.acme.com -> api.internal.acme.com [app]
api.internal.acme.com -> cache.acme.com [cdn]
api.internal.acme.com -> db-primary.acme.com [db]
db-primary.acme.com -> db-replica.acme.com [db]
```

- [ ] **Step 3: Ignore the runtime data file**

Append to `.gitignore` (after the existing `connect-profile.local.json` / `data.csv` block):

```
# DNS Map local data may contain real internal hostnames — never commit.
dns-map.local.txt
```

- [ ] **Step 4: Verify JSON is valid and file is ignored**

Run: `node -e "console.log(require('./dns-map-categories.json').default)"`
Expected: prints `public`

Run: `git check-ignore -v dns-map.local.txt`
Expected: prints a `.gitignore:...:dns-map.local.txt` match line (exit 0)

- [ ] **Step 5: Commit**

```bash
git add dns-map-categories.json dns-map.sample.txt .gitignore
git commit -m "feat(dns-map): add category config, sample data, gitignore rule

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 2: Graph parser module (`lib/dns-graph.js`)

**Files:**
- Create: `lib/dns-graph.js`
- Test: `test/dns-graph.test.js`

**Interfaces:**
- Consumes: config object `{ default, categories }` from Task 1.
- Produces: `export function parseGraph(text, config)` → `{ nodes: Array<{ id: string, category: string }>, edges: Array<{ from: string, to: string }> }`. Nodes are deduped by `id`; edges deduped by `(from,to)`. Consumed by `dns-map.html` (Task 4).

- [ ] **Step 1: Write the failing tests**

Create `test/dns-graph.test.js`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseGraph } from "../lib/dns-graph.js";

const config = {
  default: "public",
  categories: {
    public: { label: "Public domain", color: "#9ca3af" },
    r53: { label: "Route 53 / DNS", color: "#a78bfa" },
    cdn: { label: "CDN", color: "#34d399" },
    db: { label: "Database", color: "#f87171" },
  },
};

test("parses a single tagged edge", () => {
  const g = parseGraph("acme.com [r53] -> www.acme.com", config);
  assert.deepEqual(g.edges, [{ from: "acme.com", to: "www.acme.com" }]);
  const cat = Object.fromEntries(g.nodes.map((n) => [n.id, n.category]));
  assert.equal(cat["acme.com"], "r53");
  assert.equal(cat["www.acme.com"], "public"); // untagged -> default
});

test("multi-hop chain makes consecutive edges, hyphens preserved", () => {
  const g = parseGraph("a -> alb-prod.acme.com [db] -> d", config);
  assert.deepEqual(g.edges, [
    { from: "a", to: "alb-prod.acme.com" },
    { from: "alb-prod.acme.com", to: "d" },
  ]);
  const cat = Object.fromEntries(g.nodes.map((n) => [n.id, n.category]));
  assert.equal(cat["alb-prod.acme.com"], "db");
});

test("ignores blank lines and # comments", () => {
  const g = parseGraph("# note\n\na -> b\n", config);
  assert.deepEqual(g.edges, [{ from: "a", to: "b" }]);
  assert.equal(g.nodes.length, 2);
});

test("last tag seen wins for a node", () => {
  const g = parseGraph("a [r53] -> b\nb [db] -> c", config);
  const cat = Object.fromEntries(g.nodes.map((n) => [n.id, n.category]));
  assert.equal(cat["b"], "db");
});

test("unknown tag falls back to default", () => {
  const g = parseGraph("a [nope] -> b", config);
  const cat = Object.fromEntries(g.nodes.map((n) => [n.id, n.category]));
  assert.equal(cat["a"], "public");
});

test("dedupes repeated edges and nodes", () => {
  const g = parseGraph("a -> b\na -> b", config);
  assert.equal(g.edges.length, 1);
  assert.equal(g.nodes.length, 2);
});

test("never throws on malformed input", () => {
  assert.doesNotThrow(() => parseGraph("-> ->\n[db]\n", config));
  assert.doesNotThrow(() => parseGraph("", config));
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test test/dns-graph.test.js`
Expected: FAIL — `Cannot find module '../lib/dns-graph.js'` (or "parseGraph is not a function").

- [ ] **Step 3: Implement the parser**

Create `lib/dns-graph.js`:

```js
// Pure parser for the DNS Map tab. Shared by the browser page (dns-map.html)
// and the Node test suite. Never throws — malformed input is tolerated so the
// live preview stays responsive.
//
// Syntax: one or more links per line, separator "->". A line may be a multi-hop
// chain (a -> b -> c). An optional trailing [tag] on a segment sets that node's
// category. Blank lines and lines starting with "#" are ignored.

function parseSegment(seg) {
  const m = seg.match(/^(.*?)\s*\[([^\]]+)\]\s*$/);
  if (m) return { id: m[1].trim(), tag: m[2].trim().toLowerCase() };
  return { id: seg.trim(), tag: null };
}

export function parseGraph(text, config) {
  const def = (config && config.default) || "public";
  const categories = (config && config.categories) || {};
  const category = new Map(); // id -> resolved category
  const order = []; // preserve first-seen node order
  const edgeSet = new Set();
  const edges = [];

  const lines = typeof text === "string" ? text.split(/\r?\n/) : [];
  for (let line of lines) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;

    const segs = line
      .split("->")
      .map(parseSegment)
      .filter((s) => s.id !== "");

    for (const s of segs) {
      if (!category.has(s.id)) order.push(s.id);
      if (s.tag) {
        category.set(s.id, categories[s.tag] ? s.tag : def);
      } else if (!category.has(s.id)) {
        category.set(s.id, def);
      }
    }

    for (let i = 0; i + 1 < segs.length; i++) {
      const from = segs[i].id;
      const to = segs[i + 1].id;
      const key = from + "\u0000" + to;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push({ from, to });
      }
    }
  }

  const nodes = order.map((id) => ({ id, category: category.get(id) || def }));
  return { nodes, edges };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test test/dns-graph.test.js`
Expected: PASS — all 7 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/dns-graph.js test/dns-graph.test.js
git commit -m "feat(dns-map): add shared relationship-graph parser

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 3: Persistence module + server routes

**Files:**
- Create: `lib/dns-map.js`
- Test: `test/dns-map.test.js`
- Modify: `server.js` (import + 2 route entries)

**Interfaces:**
- Consumes: `dns-map.sample.txt` (seed) from Task 1.
- Produces:
  - `export async function loadMap(file?, sampleFile?)` → `{ text: string, source: "local" | "sample" | "empty" }`.
  - `export async function saveMap(text, file?)` → `{ saved: true, bytes: number }`; throws `Error` with `.status = 400` on non-string or oversized (>1 MB) input.
  - Routes `GET /api/dns-map` and `POST /api/dns-map` (body `{ text }`).

- [ ] **Step 1: Write the failing tests**

Create `test/dns-map.test.js`:

```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { loadMap, saveMap } from "../lib/dns-map.js";

async function tmpFiles() {
  const dir = await mkdtemp(join(tmpdir(), "dnsmap-"));
  return {
    dir,
    file: join(dir, "dns-map.local.txt"),
    sample: join(dir, "dns-map.sample.txt"),
    cleanup: () => rm(dir, { recursive: true, force: true }),
  };
}

test("saveMap then loadMap round-trips from local file", async () => {
  const t = await tmpFiles();
  try {
    const res = await saveMap("a -> b", t.file);
    assert.equal(res.saved, true);
    const loaded = await loadMap(t.file, t.sample);
    assert.equal(loaded.text, "a -> b");
    assert.equal(loaded.source, "local");
  } finally {
    await t.cleanup();
  }
});

test("loadMap falls back to sample when local file is missing", async () => {
  const t = await tmpFiles();
  try {
    await writeFile(t.sample, "seed -> node");
    const loaded = await loadMap(t.file, t.sample);
    assert.equal(loaded.text, "seed -> node");
    assert.equal(loaded.source, "sample");
  } finally {
    await t.cleanup();
  }
});

test("loadMap returns empty when neither file exists", async () => {
  const t = await tmpFiles();
  try {
    const loaded = await loadMap(t.file, t.sample);
    assert.equal(loaded.text, "");
    assert.equal(loaded.source, "empty");
  } finally {
    await t.cleanup();
  }
});

test("saveMap rejects non-string input with status 400", async () => {
  await assert.rejects(() => saveMap(123), (e) => e.status === 400);
});

test("saveMap writes with 0600 permissions", async () => {
  const t = await tmpFiles();
  try {
    await saveMap("x -> y", t.file);
    const { mode } = await import("node:fs/promises").then((fs) => fs.stat(t.file));
    assert.equal(mode & 0o777, 0o600);
  } finally {
    await t.cleanup();
  }
});
```

- [ ] **Step 2: Run the tests to verify they fail**

Run: `node --test test/dns-map.test.js`
Expected: FAIL — `Cannot find module '../lib/dns-map.js'`.

- [ ] **Step 3: Implement the persistence module**

Create `lib/dns-map.js`:

```js
// Persists the DNS Map relationship text to a single local file so it survives
// reloads. Local single-user tool only. The file may contain real internal
// hostnames, so it is git-ignored and written with mode 0600. On first load
// (no local file yet) the committed sample seeds the textarea.
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MAP_FILE = join(__dirname, "..", "dns-map.local.txt");
const SAMPLE_FILE = join(__dirname, "..", "dns-map.sample.txt");
const MAX_BYTES = 1024 * 1024; // 1 MB

function badRequest(msg) {
  const e = new Error(msg);
  e.status = 400;
  return e;
}

export async function loadMap(file = MAP_FILE, sampleFile = SAMPLE_FILE) {
  try {
    return { text: await readFile(file, "utf-8"), source: "local" };
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  try {
    return { text: await readFile(sampleFile, "utf-8"), source: "sample" };
  } catch (e) {
    if (e.code !== "ENOENT") throw e;
  }
  return { text: "", source: "empty" };
}

export async function saveMap(text, file = MAP_FILE) {
  if (typeof text !== "string") throw badRequest("text must be a string.");
  const bytes = Buffer.byteLength(text, "utf-8");
  if (bytes > MAX_BYTES) throw badRequest("DNS map is too large.");
  await writeFile(file, text, { mode: 0o600 });
  return { saved: true, bytes };
}
```

- [ ] **Step 4: Run the tests to verify they pass**

Run: `node --test test/dns-map.test.js`
Expected: PASS — all 5 tests pass.

- [ ] **Step 5: Wire the routes into `server.js`**

In `server.js`, add the import next to the existing `profile` import:

```js
import * as dnsMap from "./lib/dns-map.js";
```

In the `routes` object, add these two entries after the profile routes (`DELETE /api/aws/profile`):

```js
  "GET /api/dns-map": () => dnsMap.loadMap(),
  "POST /api/dns-map": (b) => dnsMap.saveMap(b.text),
```

- [ ] **Step 6: Verify syntax and route wiring**

Run: `node --check server.js`
Expected: no output (exit 0).

Run the server and curl the routes:

```bash
node server.js &
SRV=$!
sleep 1
curl -s http://127.0.0.1:8777/api/dns-map | head -c 120; echo
curl -s -X POST http://127.0.0.1:8777/api/dns-map \
  -H 'content-type: application/json' -d '{"text":"a -> b"}'
echo
kill $SRV
```
Expected: GET returns JSON with a `"source"` field; POST returns `{"saved":true,"bytes":6}`. (Delete the created `dns-map.local.txt` afterward if you don't want it: `rm -f dns-map.local.txt` — it's git-ignored regardless.)

- [ ] **Step 7: Commit**

```bash
git add lib/dns-map.js test/dns-map.test.js server.js
git commit -m "feat(dns-map): add persistence module and /api/dns-map routes

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 4: DNS Map page (`dns-map.html`)

**Files:**
- Create: `dns-map.html`

**Interfaces:**
- Consumes: `parseGraph` from `lib/dns-graph.js` (Task 2); `dns-map-categories.json` (Task 1); `GET/POST /api/dns-map` (Task 3).
- Produces: a self-contained page rendered inside an iframe. No exports.

- [ ] **Step 1: Create the page**

Create `dns-map.html`:

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>DNS Map</title>
<style>
  :root {
    --bg: #0b0f0c; --panel: #0f1512; --text: #d7ffe0; --muted: #6f8f78;
    --accent: #1f8f4e; --border: #1c2a22; --edge: #3a5445;
  }
  * { box-sizing: border-box; }
  html, body { margin: 0; height: 100%; }
  body {
    background: var(--bg); color: var(--text); height: 100vh;
    font: 14px/1.4 ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    display: grid; grid-template-columns: 340px 1fr; gap: 12px; padding: 12px;
  }
  .left { display: flex; flex-direction: column; gap: 8px; min-height: 0; }
  .hint { color: var(--muted); font-size: 12px; }
  .hint code { color: var(--text); }
  textarea {
    flex: 1; resize: none; background: var(--panel); color: var(--text);
    border: 1px solid var(--border); border-radius: 6px; padding: 10px;
    font: inherit; line-height: 1.5; min-height: 0;
  }
  .row { display: flex; align-items: center; gap: 8px; }
  button {
    background: var(--panel); color: var(--text); border: 1px solid var(--border);
    border-radius: 6px; padding: 8px 12px; cursor: pointer; font: inherit;
  }
  button:hover { border-color: var(--accent); }
  .status { font-size: 12px; color: var(--muted); }
  .status.err { color: #f87171; }
  .right {
    position: relative; background: var(--panel); border: 1px solid var(--border);
    border-radius: 6px; overflow: hidden; min-height: 0;
  }
  svg { width: 100%; height: 100%; display: block; cursor: grab; }
  .node rect { stroke: rgba(0,0,0,0.35); stroke-width: 1; rx: 6; ry: 6; }
  .node text { fill: #0b0f0c; font-size: 12px; dominant-baseline: middle; }
  .node { cursor: grab; }
  .node.dragging { cursor: grabbing; }
  .edge { stroke: var(--edge); stroke-width: 1.5; fill: none; }
  .legend {
    position: absolute; left: 10px; bottom: 10px; display: flex; flex-wrap: wrap;
    gap: 6px 14px; font-size: 12px; color: var(--muted);
    background: rgba(11,15,12,0.7); padding: 6px 10px; border-radius: 6px;
    border: 1px solid var(--border); max-width: calc(100% - 20px);
  }
  .legend .item { display: flex; align-items: center; gap: 6px; }
  .legend .dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
  .footer {
    position: absolute; right: 10px; top: 10px; font-size: 12px; color: var(--muted);
    background: rgba(11,15,12,0.7); padding: 4px 8px; border-radius: 6px;
    border: 1px solid var(--border);
  }
</style>
</head>
<body>
  <div class="left">
    <div class="hint">One link per line: <code>a -&gt; b</code>. Chains ok:
      <code>a -&gt; b -&gt; c</code>. Tag a node: <code>a [r53]</code>.</div>
    <textarea id="input" spellcheck="false" placeholder="acme.com [r53] -> www.acme.com"></textarea>
    <div class="row">
      <button id="relayout">Re-layout</button>
      <span id="status" class="status"></span>
    </div>
  </div>
  <div class="right">
    <svg id="svg">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7"
                markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3a5445"></path>
        </marker>
      </defs>
      <g id="edges"></g>
      <g id="nodes"></g>
    </svg>
    <div id="footer" class="footer">0 nodes · 0 links</div>
    <div id="legend" class="legend"></div>
  </div>

<script type="module">
import { parseGraph } from "./lib/dns-graph.js";

const SVGNS = "http://www.w3.org/2000/svg";
const $ = (id) => document.getElementById(id);
const input = $("input"), status = $("status");
const gEdges = $("edges"), gNodes = $("nodes");

let config = { default: "public", categories: {} };
let sim = null;               // running animation frame id
let nodes = [];               // {id, category, x, y, vx, vy, pinned, el, rectEl, textEl}
let edges = [];               // {from, to, el}
const byId = new Map();

function colorFor(cat) {
  const c = config.categories[cat] || config.categories[config.default];
  return (c && c.color) || "#9ca3af";
}

function setStatus(text, isErr = false) {
  status.textContent = text;
  status.classList.toggle("err", isErr);
}

function renderLegend() {
  const el = $("legend");
  el.innerHTML = "";
  for (const [, c] of Object.entries(config.categories)) {
    const item = document.createElement("div");
    item.className = "item";
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.style.background = c.color;
    item.appendChild(dot);
    item.appendChild(document.createTextNode(c.label));
    el.appendChild(item);
  }
}

// --- Reconcile parsed graph into the live node/edge arrays (keep positions) ---
function reconcile(text) {
  const g = parseGraph(text, config);
  const svg = $("svg");
  const W = svg.clientWidth || 800, H = svg.clientHeight || 600;

  const next = new Map();
  for (const n of g.nodes) {
    const existing = byId.get(n.id);
    if (existing) {
      existing.category = n.category;
      next.set(n.id, existing);
    } else {
      next.set(n.id, {
        id: n.id, category: n.category,
        x: W / 2 + (Math.random() - 0.5) * 200,
        y: H / 2 + (Math.random() - 0.5) * 200,
        vx: 0, vy: 0, pinned: false,
        el: null, rectEl: null, textEl: null,
      });
    }
  }
  byId.clear();
  for (const [k, v] of next) byId.set(k, v);
  nodes = [...next.values()];
  edges = g.edges.map((e) => ({ ...e, el: null }));

  buildSvg();
  $("footer").textContent = `${nodes.length} nodes · ${edges.length} links`;
  kick();
}

function buildSvg() {
  gNodes.innerHTML = "";
  gEdges.innerHTML = "";
  for (const e of edges) {
    const line = document.createElementNS(SVGNS, "line");
    line.setAttribute("class", "edge");
    line.setAttribute("marker-end", "url(#arrow)");
    gEdges.appendChild(line);
    e.el = line;
  }
  for (const n of nodes) {
    const gEl = document.createElementNS(SVGNS, "g");
    gEl.setAttribute("class", "node");
    const rect = document.createElementNS(SVGNS, "rect");
    rect.setAttribute("rx", "6"); rect.setAttribute("ry", "6");
    rect.setAttribute("fill", colorFor(n.category));
    const text = document.createElementNS(SVGNS, "text");
    text.setAttribute("x", "10"); text.setAttribute("y", "0");
    text.textContent = n.id;
    gEl.appendChild(rect); gEl.appendChild(text);
    gNodes.appendChild(gEl);
    n.el = gEl; n.rectEl = rect; n.textEl = text;
    sizeNode(n);
    enableDrag(n);
  }
}

function sizeNode(n) {
  const pad = 10, h = 26;
  const w = Math.max(60, n.textEl.getComputedTextLength() + pad * 2);
  n.w = w; n.h = h;
  n.rectEl.setAttribute("width", w);
  n.rectEl.setAttribute("height", h);
  n.rectEl.setAttribute("x", 0);
  n.rectEl.setAttribute("y", -h / 2);
  n.textEl.setAttribute("y", 0);
  n.rectEl.setAttribute("fill", colorFor(n.category));
}

// --- Tiny force-directed layout ---
function kick() { cooling = 1; if (!sim) sim = requestAnimationFrame(tick); }
let cooling = 1;

function tick() {
  const svg = $("svg");
  const W = svg.clientWidth || 800, H = svg.clientHeight || 600;
  const REPULSE = 9000, SPRING = 0.02, LINK_LEN = 130, CENTER = 0.003, DAMP = 0.85;

  for (const a of nodes) { a.fx = 0; a.fy = 0; }
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i], b = nodes[j];
      let dx = a.x - b.x, dy = a.y - b.y;
      let d2 = dx * dx + dy * dy || 0.01;
      const f = REPULSE / d2;
      const d = Math.sqrt(d2);
      const ux = dx / d, uy = dy / d;
      a.fx += ux * f; a.fy += uy * f;
      b.fx -= ux * f; b.fy -= uy * f;
    }
  }
  for (const e of edges) {
    const a = byId.get(e.from), b = byId.get(e.to);
    if (!a || !b) continue;
    let dx = b.x - a.x, dy = b.y - a.y;
    const d = Math.sqrt(dx * dx + dy * dy) || 0.01;
    const f = (d - LINK_LEN) * SPRING;
    const ux = dx / d, uy = dy / d;
    a.fx += ux * f; a.fy += uy * f;
    b.fx -= ux * f; b.fy -= uy * f;
  }
  let maxV = 0;
  for (const n of nodes) {
    n.fx += (W / 2 - n.x) * CENTER;
    n.fy += (H / 2 - n.y) * CENTER;
    if (n.pinned) { n.vx = 0; n.vy = 0; continue; }
    n.vx = (n.vx + n.fx) * DAMP * cooling;
    n.vy = (n.vy + n.fy) * DAMP * cooling;
    n.x += n.vx; n.y += n.vy;
    n.x = Math.max(60, Math.min(W - 60, n.x));
    n.y = Math.max(30, Math.min(H - 30, n.y));
    maxV = Math.max(maxV, Math.abs(n.vx), Math.abs(n.vy));
  }
  draw();
  cooling *= 0.995;
  if (maxV < 0.2 || cooling < 0.02) { sim = null; return; }
  sim = requestAnimationFrame(tick);
}

function draw() {
  for (const n of nodes) {
    n.el.setAttribute("transform", `translate(${n.x - n.w / 2}, ${n.y})`);
  }
  for (const e of edges) {
    const a = byId.get(e.from), b = byId.get(e.to);
    if (!a || !b) continue;
    // Clip endpoints to the target node's box edge so the arrow isn't hidden.
    const p = clip(a, b);
    e.el.setAttribute("x1", a.x); e.el.setAttribute("y1", a.y);
    e.el.setAttribute("x2", p.x); e.el.setAttribute("y2", p.y);
  }
}

function clip(a, b) {
  const dx = b.x - a.x, dy = b.y - a.y;
  const hw = b.w / 2 + 4, hh = b.h / 2 + 4;
  if (dx === 0 && dy === 0) return { x: b.x, y: b.y };
  const scale = Math.min(
    Math.abs(hw / (dx || 1e-6)),
    Math.abs(hh / (dy || 1e-6))
  );
  return { x: b.x - dx * scale, y: b.y - dy * scale };
}

// --- Drag to pin ---
function enableDrag(n) {
  n.el.addEventListener("pointerdown", (ev) => {
    ev.preventDefault();
    n.el.setPointerCapture(ev.pointerId);
    n.el.classList.add("dragging");
    const svg = $("svg");
    const rect = svg.getBoundingClientRect();
    const move = (e) => {
      n.x = e.clientX - rect.left;
      n.y = e.clientY - rect.top;
      n.pinned = true;
      draw();
    };
    const up = (e) => {
      n.el.classList.remove("dragging");
      n.el.releasePointerCapture(ev.pointerId);
      svg.removeEventListener("pointermove", move);
      svg.removeEventListener("pointerup", up);
      kick();
    };
    svg.addEventListener("pointermove", move);
    svg.addEventListener("pointerup", up);
  });
}

// --- Persistence ---
let saveTimer = null;
async function save() {
  try {
    const res = await fetch("/api/dns-map", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text: input.value }),
    });
    if (!res.ok) throw new Error((await res.json()).error || "save failed");
    setStatus("saved");
  } catch (e) {
    setStatus(e.message, true);
  }
}
function scheduleSave() {
  clearTimeout(saveTimer);
  setStatus("editing…");
  saveTimer = setTimeout(save, 500);
}

input.addEventListener("input", () => {
  reconcile(input.value);
  scheduleSave();
});

$("relayout").addEventListener("click", () => {
  for (const n of nodes) n.pinned = false;
  kick();
});

// --- Boot ---
async function boot() {
  try {
    config = await (await fetch("./dns-map-categories.json")).json();
  } catch {
    /* keep defaults */
  }
  renderLegend();
  try {
    const data = await (await fetch("/api/dns-map")).json();
    input.value = data.text || "";
  } catch {
    input.value = "";
  }
  reconcile(input.value);
}
boot();
</script>
</body>
</html>
```

- [ ] **Step 2: Verify the embedded script parses**

Run (extract the module script and syntax-check it, per AGENT.md workflow):

```bash
awk '/<script type="module">/{f=1;next}/<\/script>/{f=0}f' dns-map.html > /tmp/dns-map.mjs
node --check /tmp/dns-map.mjs && echo OK
rm -f /tmp/dns-map.mjs
```
Expected: prints `OK` (note: the `import` line resolves at runtime in the browser; `node --check` only validates syntax, which is fine).

- [ ] **Step 3: Smoke-test in the running server**

```bash
node server.js &
SRV=$!
sleep 1
curl -s http://127.0.0.1:8777/dns-map.html | grep -c "DNS Map"
curl -s http://127.0.0.1:8777/lib/dns-graph.js | grep -c "parseGraph"
curl -s http://127.0.0.1:8777/dns-map-categories.json | grep -c "categories"
kill $SRV
```
Expected: each `grep -c` prints a non-zero count (the page, the module, and the config all serve correctly).

- [ ] **Step 4: Commit**

```bash
git add dns-map.html
git commit -m "feat(dns-map): add SVG force-directed graph page

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 5: Integrate the tab into `index.html`

**Files:**
- Modify: `index.html` (tab button, panel, hide CSS, lazy map)

**Interfaces:**
- Consumes: `dns-map.html` (Task 4).
- Produces: a visible "DNS Map" tab wired into the existing tab switcher.

- [ ] **Step 1: Add the hide rule to the ID-specific CSS**

In `index.html`, change the existing rule:

```css
  #csvPanel.hidden, #spectrumPanel.hidden, #awsPanel.hidden { display: none; }
```
to:
```css
  #csvPanel.hidden, #spectrumPanel.hidden, #awsPanel.hidden, #dnsPanel.hidden { display: none; }
```

- [ ] **Step 2: Add the tab button**

In the `<nav class="tabbar">`, after the AWS Tunnel button:

```html
  <button class="tab" data-tab="aws">AWS Tunnel</button>
  <button class="tab" data-tab="dns">DNS Map</button>
```

- [ ] **Step 3: Add the panel + iframe**

After the existing `#awsPanel` block:

```html
<div id="awsPanel" class="panel hidden">
  <iframe id="awsFrame" title="AWS Tunnel"></iframe>
</div>

<div id="dnsPanel" class="panel hidden">
  <iframe id="dnsFrame" title="DNS Map"></iframe>
</div>
```

- [ ] **Step 4: Register the panel and lazy loader in the `tabs()` IIFE**

In the `panels` object, add the `dns` entry:

```js
  const panels = {
    csv: document.getElementById("csvPanel"),
    spectrum: document.getElementById("spectrumPanel"),
    aws: document.getElementById("awsPanel"),
    dns: document.getElementById("dnsPanel"),
  };
```

In the `lazy` object, add the `dns` entry:

```js
  const lazy = {
    spectrum: { frame: document.getElementById("spectrumFrame"), src: "spectrum-analyzer.html", loaded: false },
    aws: { frame: document.getElementById("awsFrame"), src: "aws.html", loaded: false },
    dns: { frame: document.getElementById("dnsFrame"), src: "dns-map.html", loaded: false },
  };
```

- [ ] **Step 5: Verify the wiring**

Run:

```bash
grep -c 'data-tab="dns"' index.html
grep -c '#dnsPanel.hidden' index.html
grep -c 'dns-map.html' index.html
```
Expected: each prints `1`.

Then load it live:

```bash
node server.js &
SRV=$!
sleep 1
curl -s http://127.0.0.1:8777/ | grep -c "DNS Map"
kill $SRV
```
Expected: non-zero count (the tab button is present in the served shell).

- [ ] **Step 6: Commit**

```bash
git add index.html
git commit -m "feat(dns-map): wire DNS Map tab into the toolbox shell

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

### Task 6: Documentation

**Files:**
- Modify: `README.md`, `AGENT.md`

**Interfaces:**
- Consumes: everything built in Tasks 1–5.
- Produces: user- and agent-facing docs describing the tab.

- [ ] **Step 1: Update `README.md`**

In the `## Tabs` list, add a bullet after the AWS Tunnel bullet:

```markdown
- **DNS Map** — live relationship graph builder: type `a -> b` links (chains and
  `[tag]` categories supported), drag nodes to rearrange. Edits auto-save to a
  git-ignored `dns-map.local.txt`; categories/colors come from `dns-map-categories.json`.
```

- [ ] **Step 2: Update `AGENT.md`**

In the tabs enumeration near the top (the numbered list of tabs), add a 4th entry:

```markdown
4. **DNS Map** (`dns-map.html`) — a live directed-graph builder. Textarea of
   `a -> b` links (multi-hop chains + optional `[tag]` per node) is parsed by the
   shared pure module `lib/dns-graph.js` and rendered as a hand-rolled SVG
   force-directed graph (zero deps). Edits persist to git-ignored
   `dns-map.local.txt` via `lib/dns-map.js` + `GET/POST /api/dns-map`, seeded from
   committed `dns-map.sample.txt`. Tag→category/color map: `dns-map-categories.json`.
```

In the `## Architecture / file map` code block, add these lines under `lib/`:

```
  dns-graph.js       Pure parseGraph(text, config) for the DNS Map tab (browser + Node).
  dns-map.js         DNS Map relationship-text persistence (dns-map.local.txt).
```

and under the top-level files, add:

```
dns-map.html         DNS Map tab UI (SVG force-directed graph + autosave textarea).
dns-map.sample.txt   SAMPLE fake topology seed for the DNS Map (safe to commit).
dns-map-categories.json  Tag -> {label,color} map + default category for DNS Map.
```

- [ ] **Step 3: Verify no broken references**

Run:

```bash
grep -c "DNS Map" README.md AGENT.md
```
Expected: each file prints a non-zero count.

- [ ] **Step 4: Commit**

```bash
git add README.md AGENT.md
git commit -m "docs(dns-map): document the DNS Map tab

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"
```

---

## Final Verification

- [ ] **Run the full test suite**

Run: `npm test`
Expected: all tests pass (parse-creds, dns-graph, dns-map suites).

- [ ] **Manual sanity check**

Run: `npm start`, open `http://127.0.0.1:8777/`, click **DNS Map**. Confirm: the sample graph draws, nodes are colored per legend, dragging a node repositions/pins it, **Re-layout** re-runs the sim, editing the textarea updates the graph and the status shows `saved`, and reloading the page restores your edits.
