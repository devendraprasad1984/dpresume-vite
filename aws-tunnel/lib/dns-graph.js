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
