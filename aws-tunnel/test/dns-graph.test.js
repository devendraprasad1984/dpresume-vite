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
