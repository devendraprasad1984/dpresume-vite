// AWS operations for the "AWS Tunnel" tab. All state is in-memory (single local
// user) and never written to disk. Credentials arrive from the browser as pasted
// "export" text and are parsed here.
import {
  STSClient,
  AssumeRoleCommand,
  GetCallerIdentityCommand,
} from "@aws-sdk/client-sts";
import {
  SecretsManagerClient,
  ListSecretsCommand,
  GetSecretValueCommand,
  DescribeSecretCommand,
  PutSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";
import {
  ECSClient,
  ListClustersCommand,
  DescribeClustersCommand,
  ListServicesCommand,
  DescribeServicesCommand,
  ListTasksCommand,
  DescribeTasksCommand,
  UpdateServiceCommand,
  StopTaskCommand,
} from "@aws-sdk/client-ecs";
import {
  ACMClient,
  ListCertificatesCommand,
  DescribeCertificateCommand,
  RequestCertificateCommand,
} from "@aws-sdk/client-acm";
import {
  S3Client,
  ListBucketsCommand,
  GetBucketLocationCommand,
  ListObjectsV2Command,
  GetObjectCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import {
  Route53Client,
  ListHostedZonesCommand,
  GetHostedZoneCommand,
  ListResourceRecordSetsCommand,
  ChangeResourceRecordSetsCommand,
} from "@aws-sdk/client-route-53";
import { parseCreds } from "./parse-creds.js";

const DEFAULT_REGION = "us-east-1";

// In-memory session (single local user). Cleared on unlock / process exit.
const store = {
  base: null, // creds used to assume the role (Lock #1)
  region: DEFAULT_REGION,
  active: null, // creds used for service calls (Lock #2)
};

function formatExports(c) {
  const lines = [
    `export AWS_ACCESS_KEY_ID=${c.accessKeyId}`,
    `export AWS_SECRET_ACCESS_KEY=${c.secretAccessKey}`,
  ];
  if (c.sessionToken) lines.push(`export AWS_SESSION_TOKEN=${c.sessionToken}`);
  return lines.join("\n");
}

function requireActive() {
  if (!store.active) {
    const e = new Error("No active credentials. Lock #2 first.");
    e.status = 400;
    throw e;
  }
  return store.active;
}

// Lock #1: parse base creds, assume the given role, return temporary creds.
export async function assumeRole({ exports, roleArn, region, sessionName }) {
  if (!roleArn || !String(roleArn).trim()) {
    const e = new Error("Role ARN is required.");
    e.status = 400;
    throw e;
  }
  const base = parseCreds(exports);
  const rgn = (region && region.trim()) || DEFAULT_REGION;
  store.base = base;
  store.region = rgn;

  const sts = new STSClient({ region: rgn, credentials: base });
  const res = await sts.send(
    new AssumeRoleCommand({
      RoleArn: roleArn.trim(),
      RoleSessionName: (sessionName && sessionName.trim()) || `aws-tunnel-${Date.now()}`,
      DurationSeconds: 3600,
    })
  );
  const c = res.Credentials;
  const creds = {
    accessKeyId: c.AccessKeyId,
    secretAccessKey: c.SecretAccessKey,
    sessionToken: c.SessionToken,
    expiration: c.Expiration ? new Date(c.Expiration).toISOString() : null,
  };
  return {
    credentials: creds,
    exportsText: formatExports(creds),
    assumedRoleArn: res.AssumedRoleUser?.Arn || null,
    region: rgn,
  };
}

// Lock #2: activate a set of creds (usually the assumed-role ones) for service calls.
export async function activate({ exports, region }) {
  const creds = parseCreds(exports);
  const rgn = (region && region.trim()) || store.region || DEFAULT_REGION;
  store.active = creds;
  store.region = rgn;
  const id = await identity();
  return { region: rgn, identity: id };
}

export function unlock({ which } = {}) {
  if (which === "base") store.base = null;
  else if (which === "active") store.active = null;
  else {
    store.base = null;
    store.active = null;
  }
  return { base: !!store.base, active: !!store.active };
}

export function status() {
  return {
    base: !!store.base,
    active: !!store.active,
    region: store.region,
  };
}

export async function identity() {
  const creds = requireActive();
  const sts = new STSClient({ region: store.region, credentials: creds });
  const res = await sts.send(new GetCallerIdentityCommand({}));
  return { account: res.Account, arn: res.Arn, userId: res.UserId };
}

function secretsClient() {
  const creds = requireActive();
  return new SecretsManagerClient({ region: store.region, credentials: creds });
}

export async function secretsList({ query } = {}) {
  const client = secretsClient();
  const filters = query && query.trim()
    ? [{ Key: "name", Values: [query.trim()] }]
    : undefined;
  const out = [];
  let token;
  do {
    const res = await client.send(
      new ListSecretsCommand({ MaxResults: 100, NextToken: token, Filters: filters })
    );
    for (const s of res.SecretList || []) {
      out.push({
        name: s.Name,
        arn: s.ARN,
        description: s.Description || "",
        lastChangedDate: s.LastChangedDate ? new Date(s.LastChangedDate).toISOString() : null,
      });
    }
    token = res.NextToken;
  } while (token && out.length < 500);
  return { secrets: out };
}

export async function secretsGet({ secretId }) {
  if (!secretId) throwBad("secretId is required.");
  const client = secretsClient();
  const res = await client.send(new GetSecretValueCommand({ SecretId: secretId }));
  return {
    name: res.Name,
    arn: res.ARN,
    versionId: res.VersionId,
    secretString: res.SecretString ?? null,
    secretBinary: res.SecretBinary ? Buffer.from(res.SecretBinary).toString("base64") : null,
  };
}

export async function secretsDescribe({ secretId }) {
  if (!secretId) throwBad("secretId is required.");
  const client = secretsClient();
  const res = await client.send(new DescribeSecretCommand({ SecretId: secretId }));
  return {
    name: res.Name,
    arn: res.ARN,
    description: res.Description || "",
    kmsKeyId: res.KmsKeyId || null,
    rotationEnabled: !!res.RotationEnabled,
    tags: res.Tags || [],
    createdDate: res.CreatedDate ? new Date(res.CreatedDate).toISOString() : null,
    lastChangedDate: res.LastChangedDate ? new Date(res.LastChangedDate).toISOString() : null,
    lastAccessedDate: res.LastAccessedDate ? new Date(res.LastAccessedDate).toISOString() : null,
    versionIdsToStages: res.VersionIdsToStages || {},
  };
}

export async function secretsPut({ secretId, secretString }) {
  if (!secretId) throwBad("secretId is required.");
  if (typeof secretString !== "string") throwBad("secretString is required.");
  const client = secretsClient();
  const res = await client.send(
    new PutSecretValueCommand({ SecretId: secretId, SecretString: secretString })
  );
  return { name: res.Name, arn: res.ARN, versionId: res.VersionId };
}

function throwBad(msg) {
  const e = new Error(msg);
  e.status = 400;
  throw e;
}

// ===================== ECS =====================
function ecsClient() {
  return new ECSClient({ region: store.region, credentials: requireActive() });
}

const shortName = (arn) => (arn ? arn.split("/").pop() : arn);

// Split an array into chunks of size n (Describe* APIs cap at 10/100).
function chunk(arr, n) {
  const out = [];
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
  return out;
}

export async function ecsListClusters() {
  const client = ecsClient();
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
        pendingTasks: c.pendingTasksCount,
        activeServices: c.activeServicesCount,
      });
    }
  }
  return { clusters };
}

export async function ecsListServices({ cluster }) {
  if (!cluster) throwBad("cluster is required.");
  const client = ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(new ListServicesCommand({ cluster, nextToken: token, maxResults: 100 }));
    arns.push(...(res.serviceArns || []));
    token = res.nextToken;
  } while (token);
  const services = [];
  for (const batch of chunk(arns, 10)) {
    const res = await client.send(new DescribeServicesCommand({ cluster, services: batch }));
    for (const s of res.services || []) {
      services.push({
        name: s.serviceName,
        arn: s.serviceArn,
        status: s.status,
        desired: s.desiredCount,
        running: s.runningCount,
        pending: s.pendingCount,
        taskDefinition: shortName(s.taskDefinition),
        launchType: s.launchType,
      });
    }
  }
  return { services };
}

export async function ecsDescribeService({ cluster, service }) {
  if (!cluster || !service) throwBad("cluster and service are required.");
  const client = ecsClient();
  const res = await client.send(new DescribeServicesCommand({ cluster, services: [service] }));
  const s = (res.services || [])[0];
  if (!s) throwBad("Service not found.");
  return {
    name: s.serviceName,
    arn: s.serviceArn,
    status: s.status,
    desired: s.desiredCount,
    running: s.runningCount,
    pending: s.pendingCount,
    taskDefinition: s.taskDefinition,
    launchType: s.launchType,
    deployments: (s.deployments || []).map((d) => ({
      status: d.status,
      taskDefinition: shortName(d.taskDefinition),
      desired: d.desiredCount,
      running: d.runningCount,
      pending: d.pendingCount,
      rolloutState: d.rolloutState,
      updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : null,
    })),
    events: (s.events || []).slice(0, 10).map((e) => ({
      createdAt: e.createdAt ? new Date(e.createdAt).toISOString() : null,
      message: e.message,
    })),
  };
}

export async function ecsListTasks({ cluster, service }) {
  if (!cluster) throwBad("cluster is required.");
  const client = ecsClient();
  const arns = [];
  let token;
  do {
    const res = await client.send(
      new ListTasksCommand({ cluster, serviceName: service || undefined, nextToken: token })
    );
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
        desiredStatus: t.desiredStatus,
        healthStatus: t.healthStatus,
        taskDefinition: shortName(t.taskDefinitionArn),
        group: t.group,
        startedAt: t.startedAt ? new Date(t.startedAt).toISOString() : null,
      });
    }
  }
  return { tasks };
}

export async function ecsDescribeTask({ cluster, task }) {
  if (!cluster || !task) throwBad("cluster and task are required.");
  const client = ecsClient();
  const res = await client.send(new DescribeTasksCommand({ cluster, tasks: [task] }));
  const t = (res.tasks || [])[0];
  if (!t) throwBad("Task not found.");
  return {
    taskArn: t.taskArn,
    lastStatus: t.lastStatus,
    desiredStatus: t.desiredStatus,
    healthStatus: t.healthStatus,
    taskDefinition: t.taskDefinitionArn,
    group: t.group,
    cpu: t.cpu,
    memory: t.memory,
    startedAt: t.startedAt ? new Date(t.startedAt).toISOString() : null,
    stoppedReason: t.stoppedReason || null,
    containers: (t.containers || []).map((c) => ({
      name: c.name,
      lastStatus: c.lastStatus,
      healthStatus: c.healthStatus,
      exitCode: c.exitCode ?? null,
      reason: c.reason || null,
    })),
  };
}

export async function ecsUpdateService({ cluster, service, desiredCount, forceNewDeployment }) {
  if (!cluster || !service) throwBad("cluster and service are required.");
  const input = { cluster, service };
  if (desiredCount !== undefined && desiredCount !== null && desiredCount !== "") {
    const n = Number(desiredCount);
    if (!Number.isInteger(n) || n < 0) throwBad("desiredCount must be a non-negative integer.");
    input.desiredCount = n;
  }
  if (forceNewDeployment) input.forceNewDeployment = true;
  if (input.desiredCount === undefined && !input.forceNewDeployment) {
    throwBad("Provide desiredCount and/or forceNewDeployment.");
  }
  const client = ecsClient();
  const res = await client.send(new UpdateServiceCommand(input));
  const s = res.service || {};
  return { name: s.serviceName, desired: s.desiredCount, running: s.runningCount, status: s.status };
}

export async function ecsStopTask({ cluster, task, reason }) {
  if (!cluster || !task) throwBad("cluster and task are required.");
  const client = ecsClient();
  const res = await client.send(
    new StopTaskCommand({ cluster, task, reason: reason || "Stopped via AWS Tunnel" })
  );
  return { taskArn: res.task?.taskArn, lastStatus: res.task?.lastStatus, desiredStatus: res.task?.desiredStatus };
}

// ===================== ACM =====================
function acmClient() {
  return new ACMClient({ region: store.region, credentials: requireActive() });
}

export async function acmList() {
  const client = acmClient();
  const certs = [];
  let token;
  do {
    const res = await client.send(new ListCertificatesCommand({ NextToken: token, MaxItems: 100 }));
    for (const c of res.CertificateSummaryList || []) {
      certs.push({ arn: c.CertificateArn, domainName: c.DomainName, status: c.Status || null });
    }
    token = res.NextToken;
  } while (token);
  return { certificates: certs };
}

export async function acmDescribe({ arn }) {
  if (!arn) throwBad("Certificate ARN is required.");
  const client = acmClient();
  const res = await client.send(new DescribeCertificateCommand({ CertificateArn: arn }));
  const c = res.Certificate || {};
  return {
    arn: c.CertificateArn,
    domainName: c.DomainName,
    subjectAlternativeNames: c.SubjectAlternativeNames || [],
    status: c.Status,
    type: c.Type,
    inUseBy: c.InUseBy || [],
    notBefore: c.NotBefore ? new Date(c.NotBefore).toISOString() : null,
    notAfter: c.NotAfter ? new Date(c.NotAfter).toISOString() : null,
    issuedAt: c.IssuedAt ? new Date(c.IssuedAt).toISOString() : null,
    validation: (c.DomainValidationOptions || []).map((d) => ({
      domainName: d.DomainName,
      validationStatus: d.ValidationStatus,
      validationMethod: d.ValidationMethod,
      resourceRecord: d.ResourceRecord
        ? { name: d.ResourceRecord.Name, type: d.ResourceRecord.Type, value: d.ResourceRecord.Value }
        : null,
    })),
  };
}

export async function acmRequest({ domainName, subjectAlternativeNames }) {
  if (!domainName || !domainName.trim()) throwBad("domainName is required.");
  const sans = (subjectAlternativeNames || "")
    .split(/[\n,]/)
    .map((s) => s.trim())
    .filter(Boolean);
  const client = acmClient();
  const res = await client.send(
    new RequestCertificateCommand({
      DomainName: domainName.trim(),
      ValidationMethod: "DNS",
      SubjectAlternativeNames: sans.length ? sans : undefined,
    })
  );
  return { certificateArn: res.CertificateArn };
}

// ===================== S3 =====================
function s3Client(region) {
  return new S3Client({ region: region || store.region, credentials: requireActive() });
}

export async function s3ListBuckets() {
  const res = await s3Client().send(new ListBucketsCommand({}));
  const buckets = (res.Buckets || []).map((b) => ({
    name: b.Name,
    creationDate: b.CreationDate ? new Date(b.CreationDate).toISOString() : null,
  }));
  return { buckets };
}

export async function s3GetBucketLocation({ bucket }) {
  if (!bucket) throwBad("bucket is required.");
  const res = await s3Client().send(new GetBucketLocationCommand({ Bucket: bucket }));
  // us-east-1 is returned as null / empty by the API.
  return { bucket, region: res.LocationConstraint || "us-east-1" };
}

export async function s3ListObjects({ bucket, prefix }) {
  if (!bucket) throwBad("bucket is required.");
  const res = await s3Client().send(
    new ListObjectsV2Command({
      Bucket: bucket,
      Prefix: prefix && prefix.trim() ? prefix.trim() : undefined,
      MaxKeys: 1000,
    })
  );
  const objects = (res.Contents || []).map((o) => ({
    key: o.Key,
    size: o.Size,
    lastModified: o.LastModified ? new Date(o.LastModified).toISOString() : null,
  }));
  return { bucket, prefix: prefix || "", objects, truncated: !!res.IsTruncated };
}

const S3_MAX_GET = 1024 * 1024; // 1 MB text guard

export async function s3GetObject({ bucket, key }) {
  if (!bucket || !key) throwBad("bucket and key are required.");
  const res = await s3Client().send(new GetObjectCommand({ Bucket: bucket, Key: key }));
  const size = Number(res.ContentLength || 0);
  if (size > S3_MAX_GET) {
    throwBad(`Object is ${size} bytes; too large to view here (limit ${S3_MAX_GET}). Use the AWS CLI to download.`);
  }
  const body = await res.Body.transformToString("utf-8");
  return {
    bucket,
    key,
    contentType: res.ContentType || null,
    contentLength: size,
    lastModified: res.LastModified ? new Date(res.LastModified).toISOString() : null,
    body,
  };
}

export async function s3PutObject({ bucket, key, body, contentType }) {
  if (!bucket || !key) throwBad("bucket and key are required.");
  if (typeof body !== "string") throwBad("body is required.");
  const res = await s3Client().send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType && contentType.trim() ? contentType.trim() : undefined,
    })
  );
  return { bucket, key, etag: res.ETag || null };
}

// ===================== Route53 =====================
function r53Client() {
  // Route53 is a global service; region is irrelevant but the client requires one.
  return new Route53Client({ region: store.region, credentials: requireActive() });
}

const zoneId = (id) => (id ? id.replace(/^\/hostedzone\//, "") : id);

export async function r53ListZones() {
  const res = await r53Client().send(new ListHostedZonesCommand({}));
  const zones = (res.HostedZones || []).map((z) => ({
    id: zoneId(z.Id),
    name: z.Name,
    private: !!z.Config?.PrivateZone,
    recordCount: z.ResourceRecordSetCount,
  }));
  return { zones, truncated: !!res.IsTruncated };
}

export async function r53GetZone({ id }) {
  if (!id) throwBad("id is required.");
  const res = await r53Client().send(new GetHostedZoneCommand({ Id: zoneId(id) }));
  const z = res.HostedZone || {};
  return {
    id: zoneId(z.Id),
    name: z.Name,
    private: !!z.Config?.PrivateZone,
    comment: z.Config?.Comment || null,
    recordCount: z.ResourceRecordSetCount,
    nameServers: res.DelegationSet?.NameServers || [],
  };
}

export async function r53ListRecords({ id }) {
  if (!id) throwBad("id is required.");
  const records = [];
  let startName, startType;
  // Paginate through all record sets (API caps at 100/page).
  do {
    const res = await r53Client().send(
      new ListResourceRecordSetsCommand({
        HostedZoneId: zoneId(id),
        StartRecordName: startName,
        StartRecordType: startType,
        MaxItems: 100,
      })
    );
    for (const r of res.ResourceRecordSets || []) {
      records.push({
        name: r.Name,
        type: r.Type,
        ttl: r.TTL ?? null,
        values: r.AliasTarget
          ? [`ALIAS → ${r.AliasTarget.DNSName}`]
          : (r.ResourceRecords || []).map((v) => v.Value),
      });
    }
    startName = res.IsTruncated ? res.NextRecordName : undefined;
    startType = res.IsTruncated ? res.NextRecordType : undefined;
  } while (startName);
  return { id: zoneId(id), records };
}

export async function r53ChangeRecord({ id, action, name, type, ttl, value }) {
  if (!id) throwBad("hosted zone id is required.");
  const act = String(action || "").toUpperCase();
  if (act !== "UPSERT" && act !== "DELETE") throwBad("action must be UPSERT or DELETE.");
  if (!name || !name.trim()) throwBad("record name is required.");
  if (!type || !type.trim()) throwBad("record type is required.");
  const n = Number.parseInt(ttl, 10);
  if (!Number.isInteger(n) || n < 0) throwBad("ttl must be a non-negative integer.");
  const values = String(value || "")
    .split(/[\n,]/)
    .map((v) => v.trim())
    .filter(Boolean);
  if (!values.length) throwBad("at least one value is required.");
  const res = await r53Client().send(
    new ChangeResourceRecordSetsCommand({
      HostedZoneId: zoneId(id),
      ChangeBatch: {
        Changes: [
          {
            Action: act,
            ResourceRecordSet: {
              Name: name.trim(),
              Type: type.trim().toUpperCase(),
              TTL: n,
              ResourceRecords: values.map((v) => ({ Value: v })),
            },
          },
        ],
      },
    })
  );
  return {
    changeId: zoneId(res.ChangeInfo?.Id),
    status: res.ChangeInfo?.Status || null,
  };
}
