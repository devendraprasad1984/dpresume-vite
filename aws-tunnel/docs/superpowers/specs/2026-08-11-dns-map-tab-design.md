# DNS Map tab — Design

Date: 2026-08-11
Status: Approved (pending spec review)

## Summary

Add a fourth top-level tab, **DNS Map**, to the Swiss Army Knife toolbox. It is a
live relationship graph builder: the user types directed links in a textarea on the
left (`a -> b`), and an SVG graph draws itself on the right. Nodes are draggable and
color-coded by category. Relationships are persisted to a git-ignored local text file
via the Node backend; the tag→category/color mapping lives in a committed JSON config.

This mirrors the mockup: a left textarea, a right graph canvas, a "Re-layout" button,
a `N nodes · M links` footer, and a category legend.

## Non-goals (YAGNI)

- No editing of categories/colors from the UI (config file is edited by hand).
- No graph persistence of node positions across reloads (layout re-runs on load).
- No export/import beyond the plain text file.
- No multi-user / no auth (consistent with the rest of this local-only tool).

## Tab integration

- New file `dns-map.html`, loaded as an isolated `<iframe>` like the Spectrum and
  AWS tabs.
- In `index.html`:
  - Add a 4th tab button and an `#dnsPanel` panel containing the iframe.
  - Register the iframe in the existing generic `lazy` map so its `src` is set on
    first activation (avoids zero-size layout).
  - Add `#dnsPanel.hidden { display: none }` to the ID-specific hide CSS rule.
- No changes to existing tabs' behavior.

## Input syntax

One or more links per line. The link separator is `->`. A line may be a multi-hop
chain; consecutive segments form directed edges.

```
# comments (leading #) and blank lines are ignored
acme.com [r53] -> www.acme.com
www.acme.com -> cdn.acme.com [cdn]
alb-prod.acme.com [lb] -> api.internal.acme.com [app] -> db-primary.acme.com [db]
```

Parsing rules (client-side, pure function `parseGraph(text, config)`):

1. Split input into lines; trim; skip blank lines and lines starting with `#`.
2. Split each line on `->`. Trim each segment.
3. For each segment, extract an optional trailing `[tag]` (e.g. `foo [db]`); the
   remainder (trimmed) is the node id. Hyphens inside the node id are preserved
   (e.g. `alb-prod.acme.com`), because the separators are `->` and `[...]`, not `-`.
4. A tag sets that node's category. If the same node is tagged differently on
   different lines, the last tag seen wins.
5. Link each consecutive pair of segments in a line as a directed edge
   `segment[i] -> segment[i+1]`.
6. A node with no tag, or a tag not present in the config, falls back to the config
   `default` category.
7. Segments that are empty (e.g. a trailing `->`) are skipped; a line that yields
   fewer than two valid segments contributes nodes but no edge. Malformed input never
   throws — it is silently tolerated so the live preview stays responsive.

Result shape:
```
{
  nodes: [{ id, category }],   // deduped
  edges: [{ from, to }],       // deduped by (from,to)
}
```

## Category / color config

Committed file `dns-map-categories.json` at repo root, served as a static asset
(`server.js` already serves `.json`; the page `fetch`es it — no new route needed).

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

- The legend is rendered dynamically from `categories`.
- `default` names the fallback category key used for untagged/unknown nodes.
- Adding a category = add a key here; no code change.

## Rendering & layout

Self-contained vanilla JS in `dns-map.html`, zero external dependencies (consistent
with the no-build, self-contained convention of the other tabs).

- **SVG** graph: each node is a `<g>` containing a rounded `<rect>` and a `<text>`
  label, filled with its category color. Real DOM elements make labels crisp and
  hit-testing (for drag) trivial.
- **Edges**: `<line>`/`<path>` with an arrowhead marker, drawn from node center to
  node center and clipped at the node boundary.
- **Layout**: a tiny force-directed simulation in vanilla JS:
  - repulsion between all nodes (inverse-square-ish),
  - spring attraction along edges (toward a target length),
  - mild centering force toward the canvas middle.
  Runs in a `requestAnimationFrame` loop with cooling; stops when settled (or after a
  bounded number of ticks) to avoid burning CPU.
- **Interaction**:
  - Drag a node to reposition; while dragged (and after release) the node is *pinned*
    so the sim doesn't move it.
  - **Re-layout** button unpins all nodes and restarts the simulation.
- **Footer**: `N nodes · M links`, computed from the parsed graph.

Live update: `input` on the textarea re-parses and reconciles the graph (add/remove
nodes/edges, keep positions of surviving nodes) without a full teardown, then nudges
the simulation.

## Persistence

Mirrors the existing `lib/profile.js` + `server.js` pattern.

- **Module** `lib/dns-map.js`:
  - `loadMap()` → reads `dns-map.local.txt`. If missing (`ENOENT`), reads and returns
    the contents of committed `dns-map.sample.txt` as the seed. Returns
    `{ text, source: "local" | "sample" | "empty" }`.
  - `saveMap(text)` → writes `dns-map.local.txt` with mode `0600`. Returns
    `{ saved: true }`. Rejects non-string / oversized input defensively.
- **Routes** in `server.js` route table:
  - `GET /api/dns-map` → `dnsMap.loadMap()`
  - `POST /api/dns-map` → `dnsMap.saveMap(body.text)`
- **Client**: on load, `GET /api/dns-map` populates the textarea. On edit, debounce
  ~500ms then `POST /api/dns-map` with the current text. A small saved/error status
  indicator reuses the existing message pattern.

## Files & git

- **New, committed**:
  - `dns-map.html`
  - `dns-map-categories.json`
  - `dns-map.sample.txt` (small, obviously-fake example topology)
  - `lib/dns-map.js`
  - `test/dns-map.test.js`
- **New, git-ignored** (add to `.gitignore`): `dns-map.local.txt` — may contain real
  internal hostnames; treated like `data.csv` / `connect-profile.local.json`.
- **Edited**: `index.html` (tab), `server.js` (2 routes), `.gitignore`,
  `README.md` + `AGENT.md` (document the new tab, following existing style).

## Error handling

- Backend: `saveMap` throws `Error` with `err.status = 400` for invalid input
  (non-string, too large), consistent with the repo convention; `server.js` maps it
  to `{ error, code }` JSON.
- Frontend: parser never throws; unknown tags fall back to default; a failed save
  shows an inline error but does not lose the textarea content.

## Testing / verification

- **Unit** (`node --test`, like `test/parse-creds.test.js`): `test/dns-map.test.js`
  covers `lib/dns-map.js` `saveMap`/`loadMap` (round-trip, ENOENT→sample fallback,
  invalid input rejection) using a temp file / overridable path.
- **Parser**: `parseGraph` is a pure function; extract it so it is unit-testable
  (single edge, multi-hop chain, hyphenated hostnames, tag-last-wins, comments/blank
  lines, unknown tag → default). If kept inline in the HTML, verify via the AGENT.md
  jsdom approach; preferred is a small shared/pure function tested directly.
- **Route wiring**: `curl` `GET /api/dns-map` → 200; `POST /api/dns-map` with a body
  → 200 and file written.
- **Syntax**: `node --check` for `.js`; extract and check the `<script>` block of
  `dns-map.html` per the AGENT.md workflow.

## Open questions

None. All resolved during brainstorming:
- Storage: backend-persisted local txt file, edited in UI. ✓
- Category source: explicit inline `[tag]` per node. ✓
- Rendering: hand-rolled SVG + vanilla force layout, zero deps. ✓
- Data file: git-ignored + committed fake sample. ✓
- Tag mapping: committed `dns-map-categories.json`. ✓
- Multi-hop chains + hyphenated hostnames: supported. ✓
