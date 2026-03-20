# AGENTS.md

## Cursor Cloud specific instructions

This is a client-side-only React SPA (Vite + TypeScript + React 18). There is no backend, database, or authentication. All data comes from static JSON (`src/data/looks.json`) and localStorage.

### Services

| Service | Command | URL |
|---------|---------|-----|
| Vite dev server | `npm run dev` | `http://localhost:5173` |

This is the **only** service. See `README.md` **Run locally** for standard setup/run commands.

### Notes

- No linter or test runner is configured in `package.json`. TypeScript type-checking is done via `vite build` (which runs `tsc` internally through the Vite plugin).
- To verify types and build: `npm run build`.
- The project has no ESLint, Prettier, or test framework configured.
- Album state lives in `localStorage`; MCP-style data override uses `sessionStorage` (key: `lookbook_mcp_looks_v13`).
- Static images are served from `public/looks/` (~22 JPEGs). These are checked into the repo.
