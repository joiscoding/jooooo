# Atelier — Men’s lookbook MVP

Editorial men’s lookbooks: offset gallery wall, five aesthetic filters, look detail, and **albums** persisted in `localStorage` (no backend). Albums can store **looks** and **custom links**.

Spec: see [`PROJECT_BRIEF.md`](./PROJECT_BRIEF.md).

## Run locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173** (Vite default).

## Optional: MCP / API-backed looks

Set `VITE_LOOKS_API_URL` to a URL that returns JSON matching the shape of `src/data/seedLooks.json`. If unset or the request fails, the app uses built-in seed data.

```bash
cp .env.example .env
# edit .env — e.g. VITE_LOOKS_API_URL=https://your-endpoint/looks.json
npm run dev
```

## Production build

```bash
npm run build
npm run preview
```

Preview serves at **http://localhost:4173**.

## Screenshots & screen recording (Playwright)

After a build, this starts preview, captures PNGs, and records a short session video:

```bash
npm run build
npm run capture
```

Outputs go to `capture-output/` (gitignored). Committed reference captures live in **`docs/preview/`**. Install browsers once if needed:

```bash
npx playwright install chromium
```

## Stack

- Vite + React + TypeScript + Tailwind CSS + React Router
