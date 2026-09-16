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

test("saveMap rejects text larger than 1 MB with status 400", async () => {
  await assert.rejects(
    () => saveMap("x".repeat(1024 * 1024 + 1)),
    (e) => e.status === 400
  );
});

test("saveMap returns the correct byte count", async () => {
  const t = await tmpFiles();
  try {
    const testString = "a -> b\nc -> d\n";
    const res = await saveMap(testString, t.file);
    assert.equal(res.saved, true);
    assert.equal(res.bytes, Buffer.byteLength(testString, "utf-8"));
  } finally {
    await t.cleanup();
  }
});
