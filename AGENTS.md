# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**Men's Lookbook Demo** — a client-only React + TypeScript SPA (Vite 5) for editorial men's fashion browsing. No backend, database, or Docker services.

| Area | Details |
|------|---------|
| Package manager | **npm** (`package-lock.json`) |
| Dev server | Vite on `http://localhost:5173` (default) |
| Data | `src/data/looks.json` + static JPEGs in `public/looks/` |
| Persistence | Albums in browser `localStorage`; optional look override via `sessionStorage` key `lookbook_mcp_looks_v13` |

See `README.md` and `PROJECT_BRIEF.md` for feature scope and MCP simulation notes.

## Cursor Cloud specific instructions

### Services

Only one service is required for local development:

| Service | Command | Notes |
|---------|---------|-------|
| Vite dev server | `npm run dev` | Serves the SPA with HMR. Reuse an existing instance if one is already running (check tmux session `vite-dev-server` or port 5173). |

No backend, database, Redis, or docker-compose stack exists in this repo.

### Standard commands

| Task | Command |
|------|---------|
| Install deps | `npm install` |
| Dev server | `npm run dev` |
| Production build | `npm run build` |
| Preview build | `npm run preview` |
| Type-check | `npx tsc --noEmit -p tsconfig.app.json` |

There is **no** `lint` or `test` script in `package.json`. ESLint, Prettier, Vitest, and Playwright are not configured.

### Type-check caveat

`npx tsc --noEmit -p tsconfig.app.json` may report strict-null errors in `src/pages/LookDetail.tsx` (`look` possibly null). `npm run build` (Vite) still succeeds because Vite does not run `tsc` as part of the build by default.

### Skills

- **Start dev server:** `.cursor/skills/start-dev-server/SKILL.md` — check for an existing server before starting a second instance.
- **Commit workflow:** `.cursor/skills/commit-all/SKILL.md` — bracket-tagged multi-commit flow when the user asks to commit everything.

### Manual testing (hello-world flow)

After `npm run dev`, open `http://localhost:5173` and verify:

1. Home gallery loads with offset look cards.
2. A style filter (e.g. Streetwear) narrows the grid.
3. A look detail page opens from a card click.
4. Create an album and add a look; confirm it appears under `/albums` and survives refresh.

### Optional external dependency

Google Fonts load from `fonts.googleapis.com` in `index.html`. The app works without them (system font fallback).
