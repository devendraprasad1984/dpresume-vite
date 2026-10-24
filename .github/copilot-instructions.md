# Copilot instructions for `dpresume`

Personal resume/portfolio single-page app. **Vite 5 + React 19**, package manager **pnpm**.

## Commands

- `pnpm dev` — start the Vite dev server (HMR).
- `pnpm build` — production build (see non-standard build below).
- `pnpm preview` — serve the built output.
- `pnpm lint` — ESLint over `js,jsx`, runs with `--max-warnings 0` (zero-warning gate).
- `pnpm css` — Tailwind watcher compiling `src/input.css` → `src/output.css`.
- `./build.sh` — build, then copy `dist/` into the sibling `../devendraprasad1984.github.io`
  repo (GitHub Pages deploy).

**There is no working test setup.** There is no `test` script and no jest config. The root
`__tests__/` folder is legacy CRA + enzyme (enzyme isn't installed and it imports paths such as
`../configs` and `../components/common/*` that no longer exist). Don't try to run it or treat it
as current.

## Architecture (the big picture)

- Entry `src/main.jsx` → `HashRouter` → `src/App.jsx`.
- `App.jsx` swaps the **whole body component** for desktop vs mobile via the `useMobile()` hook
  (`BodyDesktop` vs `bodyMobile`) — responsiveness is component-level, not just CSS.
- Routes live in `src/components/route.jsx`: `/`, `/about`, `/projects`, `/apps`, `/apps/:id`,
  `/js-concepts`.
- **Mini-apps/demos** live under `src/apps/*`. They are lazy-loaded through `appMap` in
  `src/hooks/useAppSelectorComponentMap.js`, keyed by `src/enums/appEnum.js`. To add a demo:
  add a key in `appEnum`, a `React.lazy(...)` import, and an `appMap` entry.
- Static content/data (projects, experiences, links, badges, colors, about) lives in `src/core/*`.
- DOM ids and element keys are centralized in `src/enums/DOMEnum.js`; layout sizing in
  `src/core/rootNames.js`.

## Non-standard Vite build (`vite.config.js`)

- `build.root` is `src`, and output is a **single** `dpresume.js` + `dpresume.css` in `./dist`
  (fixed `entryFileNames`/`assetFileNames`), consumed by the top-level `index.html`.
- `rollupOptions.external` deliberately excludes sibling standalone projects
  (`oneliners`, `php-server`, `next-test`, `payload-cms-test`, `npm-express-redis`,
  `node-server`, `mocks`, `docs`).
- `manualChunks`: `node_modules` → `vendor`, `src/microFrontends` → `microFrontends`.

## Repo layout caveat (important)

This repository contains many **unrelated standalone projects** as sibling folders — e.g.
`webapps/`, `next-test/`, `payload-cms-test/`, `SanskarApp/`, `php-server/`, `node-server/`,
`npm-express-redis/`, `aws-tunnel/`, `oneliners/`. These are **not** part of the main Vite app and
are excluded from its build. When working on the resume site, stay within `src/` and the root
config files; don't edit sibling projects (and ignore their own `README`/`CLAUDE.md`/`AGENTS.md`).

## Conventions

- `.babelrc` enables `@preact/signals-react-transform`, so preact signals can be used directly
  inside React components.
- The `oneliners` npm package is used heavily for utilities (e.g. `oneliners.core.coalesce`,
  `oneliners.core.isPresent`) — prefer it where the codebase already does.
- Styling is intentionally mixed: hand-written CSS in `src/styles/*`, Tailwind v4 via the
  `@tailwindcss/vite` plugin, plus MUI, emotion, and styled-components are all present.
- Redux in `src/_redux/` uses **legacy** `redux` + `redux-thunk` (not Redux Toolkit) and no
  `<Provider>` is wired into `main.jsx`/`App.jsx` — treat it as demo/app-scoped state, not global
  app state.
- Secrets exist in `.npmrc` and `run-sonar-scanner.sh`; never surface, log, or commit them.
