---
name: start-dev-server
description: Starts, runs, and stops the local Vite dev server for this repo (npm run dev, default http://localhost:5173). Use when the user asks to start or run the dev server, open the app locally, fix "port already in use", or run preview/build for local verification.
---

# Start dev server

**Stack:** Vite + React (`package.json` scripts: `dev`, `build`, `preview`).

## Start

From the **repository root**:

1. Dependencies: `npm install` (first clone or after `package.json` / lockfile changes).
2. Dev server: `npm run dev`.
3. Open the URL Vite prints — typically **`http://localhost:5173`**.

Prefer **one** `npm run dev` in a dedicated terminal; avoid starting duplicate Vite processes on the same port.

## Stop

In the terminal where dev is running: **Ctrl+C** (SIGINT). That releases the port cleanly.

## Port in use

If 5173 (or the chosen port) is busy: stop the other process with Ctrl+C, or find and end the listener (e.g. `lsof -nP -iTCP:5173 -sTCP:LISTEN`) — do not kill unrelated system or IDE processes without the user’s intent.

## Production-style local check

```bash
npm run build
npm run preview
```

`preview` serves the built output; use for verifying production bundles, not day-to-day editing.

## Reference

Project copy lives in [README.md](../../../README.md) under **Run locally** / **Build**.
