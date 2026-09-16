import { test } from "node:test";
import assert from "node:assert/strict";
import * as livelogs from "../lib/livelogs.js";

const EXPORTS = [
  "export AWS_ACCESS_KEY_ID=AKIAEXAMPLE",
  "export AWS_SECRET_ACCESS_KEY=secret/example",
  "export AWS_SESSION_TOKEN=token-example",
].join("\n");

test("requireCreds throws 400 before activate", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.requireCreds(), (e) => e.status === 400);
});

test("activate parses exports and sets region", () => {
  livelogs.__resetForTest();
  const res = livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.equal(res.region, "us-west-2");
  assert.equal(res.hasCreds, true);
  assert.equal(livelogs.requireCreds().accessKeyId, "AKIAEXAMPLE");
});

test("activate with blank exports throws 400", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.activate({ exportsText: "", region: "" }),
    (e) => e.status === 400);
});

function fakeClient(handlers) {
  return {
    send(cmd) {
      const name = cmd.constructor.name;
      const h = handlers[name];
      if (!h) throw new Error("unexpected command " + name);
      return Promise.resolve(h(cmd.input));
    },
  };
}

test("listTasks requires cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(() => livelogs.listTasks({ service: "svc" }, fakeClient({})),
    (e) => e.status === 400);
});

test("listTasks returns mapped running tasks", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    ListTasksCommand: () => ({ taskArns: ["arn:aws:ecs:...:task/cl/abc123"] }),
    DescribeTasksCommand: () => ({
      tasks: [{
        taskArn: "arn:aws:ecs:...:task/cl/abc123",
        lastStatus: "RUNNING",
        taskDefinitionArn: "arn:aws:ecs:...:task-definition/web:5",
        startedAt: new Date("2026-09-01T00:00:00Z"),
        containers: [{ name: "web" }, { name: "sidecar" }],
      }],
    }),
  });
  const { tasks } = await livelogs.listTasks({ cluster: "cl", service: "svc" }, ecs);
  assert.equal(tasks.length, 1);
  assert.equal(tasks[0].id, "abc123");
  assert.equal(tasks[0].lastStatus, "RUNNING");
  assert.deepEqual(tasks[0].containers, ["web", "sidecar"]);
  assert.equal(tasks[0].taskDefinition, "web:5");
});

test("prepare validates required args", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(
    () => livelogs.prepare({ cluster: "cl", task: "t" }, {}), // missing devkey
    (e) => e.status === 400);
});

test("prepare requires cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(
    () => livelogs.prepare({ task: "t", devkey: "k" }, {}),
    (e) => e.status === 400);
});

test("prepare requires task", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(
    () => livelogs.prepare({ cluster: "cl", devkey: "k" }, {}),
    (e) => e.status === 400);
});

test("prepare rejects Fargate task (no containerInstanceArn)", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({
      tasks: [{
        taskArn: "arn:task/cl/abc",
        containers: [{ name: "web" }],
        // No containerInstanceArn - Fargate task
      }],
    }),
  });
  await assert.rejects(
    () => livelogs.prepare(
      { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" },
      { ecs, ec2: {} }),
    (e) => e.status === 400);
});

test("sweepTickets deletes expired tickets", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ticketMap = livelogs.__ticketsForTest();
  
  // Insert a ticket older than TICKET_TTL_MS (5 minutes)
  const tooOldMs = Date.now() - (5 * 60 * 1000) - 1000;
  ticketMap.set("old", {
    id: "old",
    ip: "1.2.3.4",
    devkey: "k",
    taskArn: "a",
    containers: ["web"],
    createdAt: tooOldMs,
  });
  
  // Verify it exists
  assert.ok(ticketMap.has("old"));
  
  // Sweep and verify it's gone
  livelogs.sweepTickets();
  assert.ok(!ticketMap.has("old"));
});

test("prepare resolves IP and returns a ticket", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({
      tasks: [{
        taskArn: "arn:task/cl/abc",
        containerInstanceArn: "arn:ci/cl/ci1",
        containers: [{ name: "web" }],
      }],
    }),
    DescribeContainerInstancesCommand: () => ({
      containerInstances: [{ ec2InstanceId: "i-0abc" }],
    }),
  });
  const ec2 = fakeClient({
    DescribeInstancesCommand: () => ({
      Reservations: [{ Instances: [{ PrivateIpAddress: "10.0.1.5" }] }],
    }),
  });
  const res = await livelogs.prepare(
    { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" },
    { ecs, ec2 });
  assert.equal(res.ip, "10.0.1.5");
  assert.deepEqual(res.containers, ["web"]);
  assert.ok(res.ticket && res.ticket.length > 0);
});

test("openStream rejects unknown ticket", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.openStream({ ticket: "nope", container: "web" }),
    (e) => e.status === 400);
});

test("openStream validates container against ticket and returns ssh context", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({ tasks: [{ taskArn: "arn:task/cl/abc",
      containerInstanceArn: "arn:ci/cl/ci1", containers: [{ name: "web" }] }] }),
    DescribeContainerInstancesCommand: () => ({
      containerInstances: [{ ec2InstanceId: "i-0abc" }] }),
  });
  const ec2 = fakeClient({ DescribeInstancesCommand: () => ({
    Reservations: [{ Instances: [{ PrivateIpAddress: "10.0.1.5" }] }] }) });
  const { ticket } = await livelogs.prepare(
    { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" }, { ecs, ec2 });

  assert.throws(() => livelogs.openStream({ ticket, container: "bad" }),
    (e) => e.status === 400);
  const ctx = livelogs.openStream({ ticket, container: "web" });
  assert.equal(ctx.ip, "10.0.1.5");
  assert.equal(ctx.devkey, "~/.ssh/ecs");
  assert.equal(ctx.taskArn, "arn:task/cl/abc");
  assert.equal(ctx.container, "web");
});

test("openStream direct/fallback mode without a ticket", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ctx = livelogs.openStream({
    ip: "10.0.2.9", devkey: "~/.ssh/ecs",
    taskArn: "arn:task/cl/xyz", container: "api",
  });
  assert.equal(ctx.ip, "10.0.2.9");
  assert.equal(ctx.container, "api");
  assert.equal(ctx.taskArn, "arn:task/cl/xyz");
});

test("openStream direct mode requires active credentials", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.openStream({
    ip: "10.0.2.9", devkey: "~/.ssh/ecs",
    taskArn: "arn:task/cl/xyz", container: "api",
  }), (e) => e.status === 400);
});

test("openStream direct mode requires ip/devkey/taskArn/container", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.throws(() => livelogs.openStream({ ip: "10.0.2.9", container: "api" }),
    (e) => e.status === 400);
});

test("openStream rejects single-quote in direct mode params (injection guard)", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.throws(
    () => livelogs.openStream({ ip: "10.0.1.1", devkey: "~/.ssh/ecs",
      taskArn: "arn:task/cl/ab'c", container: "api" }),
    (e) => e.status === 400);
});

test("openStream rejects single-quote in ticket-mode container (injection guard)", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    DescribeTasksCommand: () => ({ tasks: [{ taskArn: "arn:task/cl/abc",
      containerInstanceArn: "arn:ci/cl/ci1", containers: [{ name: "we'b" }] }] }),
    DescribeContainerInstancesCommand: () => ({
      containerInstances: [{ ec2InstanceId: "i-0abc" }] }),
  });
  const ec2 = fakeClient({ DescribeInstancesCommand: () => ({
    Reservations: [{ Instances: [{ PrivateIpAddress: "10.0.1.5" }] }] }) });
  const { ticket } = await livelogs.prepare(
    { cluster: "cl", task: "arn:task/cl/abc", devkey: "~/.ssh/ecs" }, { ecs, ec2 });
  assert.throws(() => livelogs.openStream({ ticket }),
    (e) => e.status === 400);
});

test("openStream direct mode requires ip", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.throws(
    () => livelogs.openStream({ devkey: "~/.ssh/ecs",
      taskArn: "arn:task/cl/abc", container: "api" }),
    (e) => e.status === 400);
});

test("openStream direct mode requires taskArn", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.throws(
    () => livelogs.openStream({ ip: "10.0.1.1", devkey: "~/.ssh/ecs",
      container: "api" }),
    (e) => e.status === 400);
});

test("openStream direct mode requires container", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  assert.throws(
    () => livelogs.openStream({ ip: "10.0.1.1", devkey: "~/.ssh/ecs",
      taskArn: "arn:task/cl/abc" }),
    (e) => e.status === 400);
});

test("openStream rejects a ticket past its TTL at redemption", () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ticketMap = livelogs.__ticketsForTest();
  ticketMap.set("stale", {
    ip: "10.0.1.9", devkey: "~/.ssh/ecs", taskArn: "arn:task/cl/abc",
    containers: ["web"], createdAt: Date.now() - (6 * 60 * 1000),
  });
  assert.throws(() => livelogs.openStream({ ticket: "stale" }),
    (e) => e.status === 400);
  assert.ok(!ticketMap.has("stale"));
});

test("listClusters maps clusters and follows pagination", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  let call = 0;
  const ecs = fakeClient({
    ListClustersCommand: () => {
      call++;
      return call === 1
        ? { clusterArns: ["arn:aws:ecs:::cluster/a"], nextToken: "t2" }
        : { clusterArns: ["arn:aws:ecs:::cluster/b"] };
    },
    DescribeClustersCommand: (input) => ({
      clusters: input.clusters.map((arn) => ({
        clusterName: arn.split("/").pop(), clusterArn: arn, status: "ACTIVE",
        runningTasksCount: 2, activeServicesCount: 1,
      })),
    }),
  });
  const r = await livelogs.listClusters({ ecs });
  assert.equal(r.clusters.length, 2);
  assert.equal(r.clusters[0].name, "a");
  assert.equal(r.clusters[0].arn, "arn:aws:ecs:::cluster/a");
  assert.equal(r.clusters[0].runningTasks, 2);
  assert.equal(r.clusters[0].activeServices, 1);
});

test("listServices requires a cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  await assert.rejects(() => livelogs.listServices({}, { ecs: fakeClient({}) }),
    (e) => e.status === 400);
});

test("listServices maps services for a cluster", async () => {
  livelogs.__resetForTest();
  livelogs.activate({ exportsText: EXPORTS, region: "us-west-2" });
  const ecs = fakeClient({
    ListServicesCommand: () => ({ serviceArns: ["arn:aws:ecs:::service/cl/web"] }),
    DescribeServicesCommand: () => ({ services: [{
      serviceName: "web", serviceArn: "arn:aws:ecs:::service/cl/web",
      status: "ACTIVE", desiredCount: 3, runningCount: 3, launchType: "EC2",
    }] }),
  });
  const r = await livelogs.listServices({ cluster: "cl" }, { ecs });
  assert.equal(r.services.length, 1);
  assert.equal(r.services[0].name, "web");
  assert.equal(r.services[0].desired, 3);
  assert.equal(r.services[0].launchType, "EC2");
});

test("registerRecorder / getRecorder / removeRecorder round-trip", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s1");
  const rec = livelogs.getRecorder("s1");
  assert.deepEqual(rec, { on: false, terms: [] });
  livelogs.removeRecorder("s1");
  assert.equal(livelogs.getRecorder("s1"), undefined);
});

test("setRecording rejects unknown streamId", () => {
  livelogs.__resetForTest();
  assert.throws(() => livelogs.setRecording({ streamId: "nope", on: true }),
    (e) => e.status === 400);
});

test("setRecording toggles on and coerces terms to an array", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s2");
  const r = livelogs.setRecording({ streamId: "s2", on: 1, terms: ["debug", 5, null] });
  assert.equal(r.ok, true);
  assert.equal(r.on, true);
  const rec = livelogs.getRecorder("s2");
  assert.equal(rec.on, true);
  assert.deepEqual(rec.terms, ["debug", "5"]);
});

test("setRecording off clears the flag", () => {
  livelogs.__resetForTest();
  livelogs.registerRecorder("s3");
  livelogs.setRecording({ streamId: "s3", on: true, terms: ["x"] });
  const r = livelogs.setRecording({ streamId: "s3", on: false });
  assert.equal(r.on, false);
  assert.equal(livelogs.getRecorder("s3").on, false);
});
