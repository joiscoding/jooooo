# AGENTS.md

## Cursor Cloud specific instructions

This is a single-service, frontend-only app: **Vite + React + TypeScript** (men's lookbook demo). There is no backend, database, or accounts — albums persist in the browser's `localStorage`, and look data comes from `src/data/looks.json` (optionally overridden via `sessionStorage`, see `README.md`).

- Run the dev server with `npm run dev` (Vite, serves on `http://localhost:5173`). See `README.md` for build/preview.
- There are **no `lint` or `test` scripts** defined in `package.json`.
- `npm run build` does **not** run `tsc`; it is purely `vite build`. Running `npx tsc -p tsconfig.app.json --noEmit` separately currently reports pre-existing type errors in `src/pages/LookDetail.tsx` (`look` possibly `null`) that do not block `vite build` or the dev server.
