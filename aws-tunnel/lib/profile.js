// Persists the Connect form (assume-role inputs) to a single local JSON file so
// values survive a page reload. Local single-user tool only.
//
// SECURITY: baseExports contains a long-lived secret access key and is written
// to disk in plaintext. The file is git-ignored. This is an explicit user choice
// for laptop-only convenience. Clear removes the file entirely.
import { readFile, writeFile, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FILE = join(__dirname, "..", "connect-profile.local.json");

// Only these fields are persisted. activeExports are omitted — they expire ~1hr.
const FIELDS = ["baseExports", "roleArn", "region1", "sessionName", "region2"];

function pick(obj = {}) {
  const out = {};
  for (const k of FIELDS) if (typeof obj[k] === "string") out[k] = obj[k];
  return out;
}

export async function saveProfile(body = {}) {
  const profile = pick(body);
  await writeFile(FILE, JSON.stringify(profile, null, 2), { mode: 0o600 });
  return { saved: true, fields: Object.keys(profile) };
}

export async function loadProfile() {
  try {
    const text = await readFile(FILE, "utf-8");
    return { exists: true, profile: pick(JSON.parse(text)) };
  } catch (e) {
    if (e.code === "ENOENT") return { exists: false, profile: null };
    throw e;
  }
}

export async function clearProfile() {
  try {
    await unlink(FILE);
    return { cleared: true };
  } catch (e) {
    if (e.code === "ENOENT") return { cleared: false };
    throw e;
  }
}
