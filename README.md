# Quiet Fold

Quiet Fold is a frontend-only MVP for a men's lookbook retail concept. It ships with:

- an editorial landing page with an offset gallery wall
- five exact aesthetic filters from the project brief
- look detail pages
- localStorage-backed albums
- custom links inside albums for references, products, or moodboards
- seeded look data with a graceful path for swapping in a remote/MCP-backed feed later

## App location

The Vite app lives in `webapp/`.

## Run locally

```bash
cd webapp
npm install
npm run dev:host
```

Then open the local URL shown by Vite in your browser.

## Build

```bash
cd webapp
npm run build
```

## Optional remote look feed

If you want to replace the seeded fallback data, set `VITE_LOOKS_ENDPOINT` to a JSON endpoint that returns either:

- an array of look objects, or
- an object shaped like `{ "looks": [...] }`

If the endpoint fails or returns unusable data, the app automatically falls back to the seeded looks.
