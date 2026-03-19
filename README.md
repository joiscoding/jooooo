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

Hero and gallery images use **Unsplash** URLs in `src/data/looks.json`. Replace with your own licensed assets anytime.

## MCP / custom data (optional)

By default the app loads `looks.json`. To simulate MCP-injected data in the same session, open the browser console on the app origin and run:

```js
sessionStorage.setItem(
  'lookbook_mcp_looks',
  JSON.stringify([
    /* array of looks matching the same shape as looks.json */
  ])
);
location.reload();
```

Clear with: `sessionStorage.removeItem('lookbook_mcp_looks')`.

## Build

```bash
npm run build
npm run preview
```
