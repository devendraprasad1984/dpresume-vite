# Swiss Army Knife

A small, local, single-user developer toolbox served by a tiny Node server. Runs on
your laptop only (`127.0.0.1`) — not a deployable app.

## Tabs

- **Secret CSV** — Matrix-green CSV viewer; sortable/filterable, auto-masks password-like
  columns (value stays copyable). Loads the sample `data.csv`.
- **Spectrum** — microphone spectrum analyzer (Web Audio + canvas).
- **AWS Tunnel** — assume an IAM role and drive AWS services from the browser:
  Secrets Manager, ECS, ACM, S3, and Route53.
- **DNS Map** — live relationship graph builder: type `a -> b` links (chains and
  `[tag]` categories supported), drag nodes to rearrange. Edits auto-save to a
  git-ignored `dns-map.local.txt`; categories/colors come from `dns-map-categories.json`.

## Quick start

```bash
npm install
npm start                 # node server.js
open http://127.0.0.1:8777/
```

> **Seeing HTTP 501?** You're loading the app through a stale Python `http.server`
> (which only handles GET). Use the Node server at **http://127.0.0.1:8777/**.

## AWS Tunnel in a nutshell

Browsers can't call AWS directly (CORS), so the page talks to the local Node backend
(AWS SDK v3). Two "locks": **Lock #1** does `sts:AssumeRole` from pasted base exports;
**Lock #2** activates the resulting temporary credentials for all service calls.
Credentials are held **in memory only**.

Optionally, **Save** the Connect form to a local, git-ignored `connect-profile.local.json`
so it survives reloads. ⚠️ That file stores your long-lived secret key in plaintext —
laptop-only convenience; never commit it.

## Development

See **[AGENT.md](./AGENT.md)** for architecture, conventions, security rules, and the
testing/verification workflow. Run tests with `npm test`.

## Security

Local, no-auth tool — keep it bound to `127.0.0.1`. The committed `data.csv` is fake
sample data; never commit real credentials.
