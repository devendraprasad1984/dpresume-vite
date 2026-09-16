// LiveLogs tab backend: standalone in-memory AWS creds + task->EC2 resolution +
// SSH log-stream ticketing. Never writes creds to disk. Mirrors accesslogs.sh.
import { randomBytes } from "node:crypto";
import {
  ECSClient,
  ListTasksCommand,
  DescribeTasksCommand,
  DescribeContainerInstancesCommand,
  ListClustersCommand,
  DescribeClustersCommand,
  ListServicesCommand,
  DescribeServicesCommand,
} from "@aws-sdk/client-ecs";
import { EC2Client, DescribeInstancesCommand } from "@aws-sdk/client-ec2";
import { parseCreds } from "./parse-creds.js";

const DEFAULT_REGION = "us-west-2";

const store = { creds: null, region: DEFAULT_REGION };
// Used by listTasks/prepare in later tasks.
const tickets = new Map(); // id -> { ip, devkey, taskArn, containers, createdAt }
const recorders = new Map(); // streamId -> { on, terms }
const TICKET_TTL_MS = 5 * 60 * 1000;

export function throwBad(msg) {
  const e = new Error(msg);
  e.status = 400;
  throw e;
}

export function requireCreds() {
  if (!store.creds) throwBad("No active credentials. Activate first.");
  return store.creds;
}

export function activate({ exportsText, region } = {}) {
  let creds;
  try {
    creds = parseCreds(exportsText);
  } catch (err) {
    throwBad(err.message || "Could not parse credentials.");
  }
  store.creds = creds;
  store.region = (region && String(region).trim()) || DEFAULT_REGION;
  return { region: store.region, hasCreds: true };
}

// Used by listTasks/prepare in later tasks.
const shortName = (arn) => (arn ? arn.split("/").pop() : arn);

function ecsClient() {
  return new ECSClient({ region: store.region, credentials: requireCreds() });
}
function ec2Client() {
  return new EC2Client({ region: store.region, credentials: requireCreds() });
}

function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export async function listTasks({ cluster, service } = {}, ecs = null) {
  if (!cluster) throwBad("cluster is required.");
  const client = ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(new ListTasksCommand({
      cluster,
      serviceName: service || undefined,
      desiredStatus: "RUNNING",
      nextToken: token,
    }));
    arns.push(...(res.taskArns || []));
    token = res.nextToken;
  } while (token);
  const tasks = [];
  for (const batch of chunk(arns, 100)) {
    const res = await client.send(new DescribeTasksCommand({ cluster, tasks: batch }));
    for (const t of res.tasks || []) {
      tasks.push({
        taskArn: t.taskArn,
        id: shortName(t.taskArn),
        lastStatus: t.lastStatus,
        taskDefinition: shortName(t.taskDefinitionArn),
        startedAt: t.startedAt ? new Date(t.startedAt).toISOString() : null,
        containers: (t.containers || []).map((c) => c.name),
      });
    }
  }
  return { tasks };
}

export async function listClusters(deps = {}) {
  const client = deps.ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(new ListClustersCommand({ nextToken: token }));
    arns.push(...(res.clusterArns || []));
    token = res.nextToken;
  } while (token);
  const clusters = [];
  for (const batch of chunk(arns, 100)) {
    const res = await client.send(new DescribeClustersCommand({ clusters: batch }));
    for (const c of res.clusters || []) {
      clusters.push({
        name: c.clusterName,
        arn: c.clusterArn,
        status: c.status,
        runningTasks: c.runningTasksCount,
        activeServices: c.activeServicesCount,
      });
    }
  }
  return { clusters };
}

export async function listServices({ cluster } = {}, deps = {}) {
  if (!cluster || !String(cluster).trim()) throwBad("cluster is required.");
  const client = deps.ecs || ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(
      new ListServicesCommand({ cluster, nextToken: token, maxResults: 100 }));
    arns.push(...(res.serviceArns || []));
    token = res.nextToken;
  } while (token);
  const services = [];
  for (const batch of chunk(arns, 10)) {
    const res = await client.send(
      new DescribeServicesCommand({ cluster, services: batch }));
    for (const s of res.services || []) {
      services.push({
        name: s.serviceName,
        arn: s.serviceArn,
        status: s.status,
        desired: s.desiredCount,
        running: s.runningCount,
        launchType: s.launchType,
      });
    }
  }
  return { services };
}

export async function prepare({ cluster, task, devkey } = {}, deps = {}) {
  if (!cluster) throwBad("cluster is required.");
  if (!task) throwBad("task is required.");
  if (!devkey || !String(devkey).trim()) throwBad("device key path is required.");
  const ecs = deps.ecs || ecsClient();
  const ec2 = deps.ec2 || ec2Client();

  const dt = await ecs.send(new DescribeTasksCommand({ cluster, tasks: [task] }));
  const t = (dt.tasks || [])[0];
  if (!t) throwBad("Task not found.");
  const containers = (t.containers || []).map((c) => c.name);
  if (!containers.length) throwBad("Task has no containers.");
  if (!t.containerInstanceArn) {
    throwBad("Task has no container instance (Fargate tasks are not supported).");
  }

  const dci = await ecs.send(new DescribeContainerInstancesCommand({
    cluster, containerInstances: [t.containerInstanceArn],
  }));
  const instanceId = (dci.containerInstances || [])[0]?.ec2InstanceId;
  if (!instanceId) throwBad("Could not resolve EC2 instance for task.");

  const di = await ec2.send(new DescribeInstancesCommand({ InstanceIds: [instanceId] }));
  const ip = di.Reservations?.[0]?.Instances?.[0]?.PrivateIpAddress;
  if (!ip) throwBad("Could not resolve private IP for instance " + instanceId + ".");

  sweepTickets();
  const id = randomBytes(16).toString("hex");
  tickets.set(id, {
    id, ip, devkey: String(devkey).trim(), taskArn: t.taskArn,
    containers, createdAt: Date.now(),
  });
  return { ticket: id, ip, containers };
}

export function sweepTickets() {
  const now = Date.now();
  for (const [id, t] of tickets) {
    if (now - t.createdAt > TICKET_TTL_MS) tickets.delete(id);
  }
}

function assertNoQuote(...vals) {
  for (const v of vals) {
    if (String(v).includes("'")) throwBad("Illegal character in stream parameters.");
  }
}

export function registerRecorder(streamId) {
  recorders.set(streamId, { on: false, terms: [] });
}

export function getRecorder(streamId) {
  return recorders.get(streamId);
}

export function removeRecorder(streamId) {
  recorders.delete(streamId);
}

export function setRecording({ streamId, on, terms } = {}) {
  const rec = recorders.get(streamId);
  if (!rec) throwBad("Unknown stream.");
  rec.on = !!on;
  rec.terms = Array.isArray(terms)
    ? terms.filter((t) => t !== null && t !== undefined && t !== "").map((t) => String(t))
    : [];
  return { ok: true, path: "~/logs.txt", on: rec.on };
}

export function openStream({ ticket, container, ip, devkey, taskArn } = {}) {
  if (ticket) {
    const t = tickets.get(ticket);
    if (!t || Date.now() - t.createdAt > TICKET_TTL_MS) {
      tickets.delete(ticket);
      throwBad("Unknown or expired ticket. Click Logs again.");
    }
    const name = container || t.containers[0];
    if (!t.containers.includes(name)) throwBad("Container not part of this task.");
    assertNoQuote(name, t.taskArn, t.devkey, t.ip);
    return { ip: t.ip, devkey: t.devkey, taskArn: t.taskArn, container: name };
  }
  // Direct/fallback mode: no ticket, params supplied directly. Still requires an
  // active in-memory session so this endpoint is not a credless CSRF-reachable
  // primitive for spawning outbound SSH to an arbitrary host.
  requireCreds();
  if (!ip || !String(ip).trim()) throwBad("ip is required.");
  if (!devkey || !String(devkey).trim()) throwBad("device key path is required.");
  if (!taskArn || !String(taskArn).trim()) throwBad("taskArn is required.");
  if (!container || !String(container).trim()) throwBad("container is required.");
  assertNoQuote(container, taskArn, devkey, ip);
  return {
    ip: String(ip).trim(), devkey: String(devkey).trim(),
    taskArn: String(taskArn).trim(), container: String(container).trim(),
  };
}

// Test seam: reset state between tests.
export function __resetForTest() {
  store.creds = null;
  store.region = DEFAULT_REGION;
  tickets.clear();
  recorders.clear();
}

// Test seam: inspect the internal ticket map.
export function __ticketsForTest() { return tickets; }

// Test seam: inspect the internal recorder map.
export function __recordersForTest() { return recorders; }
