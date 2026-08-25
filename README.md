# Men’s lookbook demo

Local demo aligned with **PROJECT_BRIEF.md**: editorial gallery, five style filters, look detail, albums persisted in **localStorage** (no database).

## Landing page direction

The home page follows **hp.com** merchandising patterns rather than the COS reference in `PROJECT_BRIEF.md`: utility bar, sticky header with search and a saved-looks counter, site-wide promo band, rotating hero, round style tiles, horizontal card rails, dual promo banners, a filtered card grid, editorial tiles, a service strip, a newsletter band and a multi-column footer. Look detail and album pages keep the original quieter styling.

To support that layout, `looks.json` carries **fictional** retail metadata (`priceUsd`, `wasPriceUsd`, `rating`, `reviewCount`, `badge`) read as a bundle price for the whole outfit. Nothing is for sale and no payment path exists.

**Figma** (reverse from the landing page): [men’s lookbook demo — localhost](https://www.figma.com/design/OjlGUtFACU9iTR0sWgKKpR/mens-lookbook-demo-localhost?node-id=1-48&t=r9I681ZGqssj8ojh-0)

**Figma template** (Community): [FASCO — Fashion Ecommerce Website Page](https://www.figma.com/design/r8UAbgDHpyntbBc0Jo7YDX/FASCO--Fashion-Ecommerce-Website-Page--Community-?node-id=0-384&t=pyaoQE1dqwNrEQuw-0)

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`).

## MVP checklist

| Feature | Status |
|--------|--------|
| Offset gallery wall on home | Yes — “From the lookbook” section |
| Five aesthetic filters | Yes — pills plus round style tiles, synced to `?style=` |
| Search across looks | Yes — header search, synced to `?q=` |
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
  'lookbook_mcp_looks_v13',
  JSON.stringify([
    /* array of looks matching the same shape as looks.json */
  ])
);
location.reload();
```

Clear with: `sessionStorage.removeItem('lookbook_mcp_looks_v13')`.

## Build

```bash
npm run build
npm run preview
```
