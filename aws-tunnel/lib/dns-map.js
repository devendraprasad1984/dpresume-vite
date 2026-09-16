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
