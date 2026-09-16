import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCreds } from "../lib/parse-creds.js";

test("parses full export block with quotes", () => {
  const text = `
    export AWS_ACCESS_KEY_ID="ASIAEXAMPLE"
    export AWS_SECRET_ACCESS_KEY='sec/ret+Value'
    export AWS_SESSION_TOKEN="FwoGtoken=="
  `;
  assert.deepEqual(parseCreds(text), {
    accessKeyId: "ASIAEXAMPLE",
    secretAccessKey: "sec/ret+Value",
    sessionToken: "FwoGtoken==",
  });
});

test("parses plain KEY=VALUE without export", () => {
  const text = "AWS_ACCESS_KEY_ID=AKIA123\nAWS_SECRET_ACCESS_KEY=shh";
  assert.deepEqual(parseCreds(text), { accessKeyId: "AKIA123", secretAccessKey: "shh" });
});

test("handles windows `set` prefix and legacy security token alias", () => {
  const text = "set AWS_ACCESS_KEY_ID=AKIA1\nset AWS_SECRET_ACCESS_KEY=s\nset AWS_SECURITY_TOKEN=tok";
  assert.deepEqual(parseCreds(text), { accessKeyId: "AKIA1", secretAccessKey: "s", sessionToken: "tok" });
});

test("ignores comments, blanks and unknown keys", () => {
  const text = "# creds\n\nAWS_REGION=us-east-1\nAWS_ACCESS_KEY_ID=AKIA9\nAWS_SECRET_ACCESS_KEY=k";
  assert.deepEqual(parseCreds(text), { accessKeyId: "AKIA9", secretAccessKey: "k" });
});

test("throws when access key id is missing", () => {
  assert.throws(() => parseCreds("AWS_SECRET_ACCESS_KEY=k"), /Missing AWS_ACCESS_KEY_ID/);
});

test("throws on empty input", () => {
  assert.throws(() => parseCreds("   "), /No credentials provided/);
});
