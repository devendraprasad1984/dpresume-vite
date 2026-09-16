// Parse pasted AWS credential "exports" into a credentials object.
//
// Accepts the common shapes people copy out of the console / CLI, e.g.:
//   export AWS_ACCESS_KEY_ID="ASIA..."
//   export AWS_SECRET_ACCESS_KEY=abc/def
//   export AWS_SESSION_TOKEN='FwoG...'
// as well as plain `KEY=VALUE` lines, `set KEY=VALUE` (Windows), surrounding
// quotes, inline `export` prefixes, and stray whitespace / blank lines.
//
// Returns { accessKeyId, secretAccessKey, sessionToken? }.
// Throws if the required access key id or secret access key are missing.

const KEY_MAP = {
  AWS_ACCESS_KEY_ID: "accessKeyId",
  AWS_SECRET_ACCESS_KEY: "secretAccessKey",
  AWS_SESSION_TOKEN: "sessionToken",
  AWS_SECURITY_TOKEN: "sessionToken", // legacy alias
};

function stripQuotes(v) {
  const t = v.trim();
  if (t.length >= 2 && ((t[0] === '"' && t.endsWith('"')) || (t[0] === "'" && t.endsWith("'")))) {
    return t.slice(1, -1);
  }
  return t;
}

export function parseCreds(text) {
  if (typeof text !== "string" || !text.trim()) {
    throw new Error("No credentials provided.");
  }
  const out = {};
  for (let line of text.split(/\r?\n/)) {
    line = line.trim();
    if (!line || line.startsWith("#")) continue;
    // Drop a leading `export ` or `set ` prefix (case-insensitive).
    line = line.replace(/^(export|set)\s+/i, "");
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const rawKey = line.slice(0, eq).trim().toUpperCase();
    const mapped = KEY_MAP[rawKey];
    if (!mapped) continue;
    const value = stripQuotes(line.slice(eq + 1));
    if (value) out[mapped] = value;
  }
  if (!out.accessKeyId || !out.secretAccessKey) {
    throw new Error("Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY in the pasted text.");
  }
  return out;
}
