# Men’s lookbook demo

Local demo aligned with **PROJECT_BRIEF.md**: editorial gallery, five style filters, look detail, albums persisted in **localStorage** (no database).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

## MVP checklist

| Feature | Status |
|--------|--------|
| Offset gallery wall on home | Yes |
| Five aesthetic filters | Yes |
| Look detail + add to album | Yes |
| Album list & detail; survives refresh | Yes |
| Seed looks (JSON) | `src/data/looks.json` |
| MCP-style override | Optional — see below |

## Photos

Hero and gallery images are served from **`public/looks/`** (JPEGs). `src/data/looks.json` points at paths like `/looks/…jpg`. Regenerate files by swapping URLs in JSON and downloading, or replace with your own licensed assets.

To refresh thumbnails from Unsplash URLs, download each URL into `public/looks/` and update the JSON paths accordingly.

## MCP / custom data (optional)

By default the app loads `looks.json`. To simulate MCP-injected data in the same session, open the browser console on the app origin and run:

```js
sessionStorage.setItem(
  'lookbook_mcp_looks_v3',
  JSON.stringify([
    /* array of looks matching the same shape as looks.json */
  ])
);
location.reload();
```

Clear with: `sessionStorage.removeItem('lookbook_mcp_looks_v3')`.

## Build

```bash
npm run build
npm run preview
```
