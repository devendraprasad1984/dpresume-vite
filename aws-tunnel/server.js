// Local dev server for the csv-viewer tool.
// - Serves the static files (index.html, spectrum-analyzer.html, aws.html, data.csv...)
// - Exposes /api/aws/* used by the "AWS Tunnel" tab.
// Binds to 127.0.0.1 only. Credentials are held in memory (see lib/aws.js), never
// written to disk. This is a local-only tool with no auth/TLS by design.
import http from "node:http";
import { spawn } from "node:child_process";
import { createWriteStream } from "node:fs";
import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { randomUUID } from "node:crypto";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import * as aws from "./lib/aws.js";
import * as profile from "./lib/profile.js";
import * as dnsMap from "./lib/dns-map.js";
import * as livelogs from "./lib/livelogs.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOST = "127.0.0.1";
const PORT = Number(process.env.PORT) || 8777;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function sendJson(res, status, body) {
  const data = JSON.stringify(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8" });
  res.end(data);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 5 * 1024 * 1024) reject(new Error("Body too large."));
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON body."));
      }
    });
    req.on("error", reject);
  });
}

// Map POST/GET api routes to aws.js functions.
const routes = {
  "POST /api/aws/assume-role": (b) => aws.assumeRole(b),
  "POST /api/aws/activate": (b) => aws.activate(b),
  "POST /api/aws/unlock": (b) => aws.unlock(b),
  "GET /api/aws/status": () => aws.status(),
  "GET /api/aws/identity": () => aws.identity(),
  "GET /api/aws/secrets/list": (b, q) => aws.secretsList({ query: q.get("query") }),
  "POST /api/aws/secrets/get": (b) => aws.secretsGet(b),
  "POST /api/aws/secrets/describe": (b) => aws.secretsDescribe(b),
  "POST /api/aws/secrets/put": (b) => aws.secretsPut(b),
  // ECS
  "GET /api/aws/ecs/clusters": () => aws.ecsListClusters(),
  "GET /api/aws/ecs/services": (b, q) => aws.ecsListServices({ cluster: q.get("cluster") }),
  "POST /api/aws/ecs/service": (b) => aws.ecsDescribeService(b),
  "GET /api/aws/ecs/tasks": (b, q) => aws.ecsListTasks({ cluster: q.get("cluster"), service: q.get("service") }),
  "POST /api/aws/ecs/task": (b) => aws.ecsDescribeTask(b),
  "POST /api/aws/ecs/update-service": (b) => aws.ecsUpdateService(b),
  "POST /api/aws/ecs/stop-task": (b) => aws.ecsStopTask(b),
  // ACM
  "GET /api/aws/acm/list": () => aws.acmList(),
  "POST /api/aws/acm/describe": (b) => aws.acmDescribe(b),
  "POST /api/aws/acm/request": (b) => aws.acmRequest(b),

  "GET /api/aws/s3/buckets": () => aws.s3ListBuckets(),
  "GET /api/aws/s3/location": (b, q) => aws.s3GetBucketLocation({ bucket: q.get("bucket") }),
  "GET /api/aws/s3/objects": (b, q) => aws.s3ListObjects({ bucket: q.get("bucket"), prefix: q.get("prefix") }),
  "POST /api/aws/s3/get": (b) => aws.s3GetObject(b),
  "POST /api/aws/s3/put": (b) => aws.s3PutObject(b),

  "GET /api/aws/route53/zones": () => aws.r53ListZones(),
  "GET /api/aws/route53/zone": (b, q) => aws.r53GetZone({ id: q.get("id") }),
  "GET /api/aws/route53/records": (b, q) => aws.r53ListRecords({ id: q.get("id") }),
  "POST /api/aws/route53/change": (b) => aws.r53ChangeRecord(b),

  "GET /api/aws/profile": () => profile.loadProfile(),
  "POST /api/aws/profile": (b) => profile.saveProfile(b),
  "DELETE /api/aws/profile": () => profile.clearProfile(),

  "GET /api/dns-map": () => dnsMap.loadMap(),
  "POST /api/dns-map": (b) => dnsMap.saveMap(b.text),

  "POST /api/livelogs/activate": (b) => livelogs.activate(b),
  "GET /api/livelogs/tasks": (b, q) =>
    livelogs.listTasks({ cluster: q.get("cluster"), service: q.get("service") }),
  "POST /api/livelogs/prepare": (b) => livelogs.prepare(b),
  "POST /api/livelogs/record": (b) => livelogs.setRecording(b),

  "GET /api/livelogs/clusters": () => livelogs.listClusters(),
  "GET /api/livelogs/services": (b, q) => livelogs.listServices({ cluster: q.get("cluster") }),
};

function handleLiveLogsStream(req, res, url) {
  // Defense-in-depth against DNS-rebinding: this endpoint spawns outbound SSH, so
  // only accept requests whose Host header resolves to this loopback server.
  const host = String(req.headers.host || "");
  const hostname = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "");
  if (!["127.0.0.1", "localhost", "::1"].includes(hostname)) {
    return sendJson(res, 403, { error: "Forbidden host." });
  }
  let ctx;
  try {
    ctx = livelogs.openStream({
      ticket: url.searchParams.get("ticket"),
      container: url.searchParams.get("container"),
      ip: url.searchParams.get("ip"),
      devkey: url.searchParams.get("devkey"),
      taskArn: url.searchParams.get("taskArn"),
    });
  } catch (err) {
    return sendJson(res, err?.status || 400, { error: err?.message || "stream error" });
  }

  res.writeHead(200, {
    "content-type": "text/event-stream; charset=utf-8",
    "cache-control": "no-cache, no-transform",
    connection: "keep-alive",
  });
  res.write(": connected\n\n");

  const streamId = randomUUID();
  livelogs.registerRecorder(streamId);
  res.write(`event: streamid\ndata: ${streamId}\n\n`);

  const logPath = join(homedir(), "logs.txt");
  let recStream = null;
  const recordLine = (line) => {
    const rec = livelogs.getRecorder(streamId);
    if (!rec || !rec.on) return;
    if (rec.terms.length &&
        !rec.terms.some((t) => line.toLowerCase().includes(t.toLowerCase()))) return;
    if (!recStream) {
      recStream = createWriteStream(logPath, { flags: "a" });
      recStream.on("error", () => {});
    }
    recStream.write(line + "\n");
  };

  const { ip, devkey, taskArn, container } = ctx;
  const remoteCmd =
    `CID=$(sudo docker ps ` +
    `--filter 'label=com.amazonaws.ecs.task-arn=${taskArn}' ` +
    `--filter 'label=com.amazonaws.ecs.container-name=${container}' -q | head -n 1); ` +
    `if [ -z "$CID" ]; then echo "No matching container on host"; exit 1; fi; ` +
    `sudo docker logs -f --tail 200 "$CID"`;

  const child = spawn("ssh", [
    "-i", devkey,
    "-o", "StrictHostKeyChecking=no",
    "-o", "BatchMode=yes",
    `ec2-user@${ip}`,
    remoteCmd,
  ]);

  let buf = "";
  const forward = (data) => {
    buf += data.toString();
    let nl;
    while ((nl = buf.indexOf("\n")) >= 0) {
      const line = buf.slice(0, nl);
      buf = buf.slice(nl + 1);
      res.write(`data: ${line}\n\n`);
      recordLine(line);
    }
  };
  child.stdout.on("data", forward);
  child.stderr.on("data", forward);

  let ended = false;
  const heartbeat = setInterval(() => res.write(": ping\n\n"), 15000);
  const finish = (extra) => {
    if (ended) return;
    ended = true;
    clearInterval(heartbeat);
    livelogs.removeRecorder(streamId);
    if (recStream) { try { recStream.end(); } catch {} recStream = null; }
    if (extra) res.write(extra);
    res.end();
  };
  const cleanup = () => { finish(); try { child.kill("SIGTERM"); } catch {} };

  child.on("close", (code) => {
    const tail = buf ? `data: ${buf}\n\n` : "";
    finish(`${tail}event: end\ndata: stream ended (exit ${code})\n\n`);
  });
  child.on("error", (e) => {
    if (!ended) res.write(`data: ssh error: ${e.message}\n\n`);
    finish(`event: end\ndata: stream ended\n\n`);
  });
  req.on("close", cleanup);
  res.on("close", cleanup);
  res.on("error", () => {});
}

async function handleApi(req, res, url) {
  const key = `${req.method} ${url.pathname}`;
  const handler = routes[key];
  if (!handler) return sendJson(res, 404, { error: "Unknown API route." });
  try {
    const body = req.method === "POST" ? await readBody(req) : {};
    const result = await handler(body, url.searchParams);
    sendJson(res, 200, result);
  } catch (err) {
    const status = err?.status || (err?.name === "CredentialsProviderError" ? 400 : 500);
    sendJson(res, status, {
      error: err?.message || "Internal error.",
      code: err?.name || undefined,
    });
  }
}

async function serveStatic(req, res, url) {
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === "/") pathname = "/index.html";
  // Prevent path traversal: resolve within __dirname.
  const filePath = normalize(join(__dirname, pathname));
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403).end("Forbidden");
    return;
  }
  try {
    const data = await readFile(filePath);
    const type = MIME[extname(filePath).toLowerCase()] || "application/octet-stream";
    res.writeHead(200, { "content-type": type, "cache-control": "no-store" });
    res.end(data);
  } catch {
    res.writeHead(404, { "content-type": "text/plain" }).end("Not found");
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  if (req.method === "GET" && url.pathname === "/api/livelogs/stream") {
    return handleLiveLogsStream(req, res, url);
  }
  if (url.pathname.startsWith("/api/")) return handleApi(req, res, url);
  return serveStatic(req, res, url);
});

server.listen(PORT, HOST, () => {
  console.log(`csv-viewer server running at http://${HOST}:${PORT}`);
});
