---
name: start-dev-server
description: Starts the local development server from the repository root after checking it is not already running. Use when the user asks to start the dev server, run locally, open the app in development, npm/pnpm/yarn dev, or Vite dev.
---

# Start dev server

## Before starting

1. **Reuse an existing server.** List or read terminal session state in the project terminals folder. If a dev server is already running for this workspace (e.g. `vite`, `npm run dev`), report the URL/port and do not start a second instance unless the user wants a different port or a restart.

2. **Pick the command from the repo.** From the workspace root, read `package.json` → `scripts.dev`. Default for this project is `npm run dev` (Vite); if `pnpm-lock.yaml` or `yarn.lock` exists, prefer `pnpm dev` or `yarn dev` instead of npm.

## Start

From the **repository root** (workspace path), run the dev script as a **long-lived process** (background / non-blocking shell invocation per agent tooling). Typical invocation:

```bash
npm run dev
```

## After start

- Note the URL Vite prints (usually `http://localhost:5173` or the next free port).
- If the command fails, read the error (missing deps → `npm install`, port in use → suggest kill or alternate port).

## Restart

If the user asks to restart: stop the existing dev process for this project (or the relevant terminal job), then start again using the steps above.
