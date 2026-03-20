# Men’s lookbook demo

Local demo aligned with **PROJECT_BRIEF.md**: **FASCO-inspired landing** at `/`, editorial **lookbook gallery** at `/lookbook`, five style filters, look detail, albums persisted in **localStorage** (no database).

The landing page follows the structure of the community **FASCO** fashion ecommerce template ([Figma file](https://www.figma.com/design/r8UAbgDHpyntbBc0Jo7YDX/FASCO--Fashion-Ecommerce-Website-Page--Community-?node-id=0-1)); photography is from Unsplash URLs in code (replace with exported assets from your file if you use Figma MCP).

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown (usually `http://localhost:5173`). **`/`** is the marketing landing; **`/lookbook`** is the gallery MVP.

## Landing demo (screenshots + screen recording)

With the dev server running on port **5173**:

```bash
npm run demo:capture
```

Outputs under **`/opt/cursor/artifacts/assets/fasco-landing-demo/`** (PNG frames + **`landing-demo.webm`** from the Playwright session). Override with `DEMO_OUT_DIR` / `DEMO_BASE_URL` if needed.

### Slack (optional)

With a bot token and your Slack user ID:

```bash
export SLACK_BOT_TOKEN=xoxb-...
export SLACK_USER_ID=U...
npm run notify:slack
```

Or run `node scripts/send-slack-dm.mjs` with the same env vars. Without them, the script exits successfully and prints a skip message.

## MVP checklist

| Feature | Status |
|--------|--------|
| Offset gallery wall on `/lookbook` | Yes |
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
