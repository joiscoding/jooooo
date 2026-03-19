# Master prompt: Men’s lookbook retail (mock)

Use this as the single spec for building the app.

---

## North-star reference

**Primary inspiration:** [COS US Men](https://www.cos.com/en-us/men) — not a pixel-perfect clone. Match the **quiet, modern, Scandinavian-minimal** direction: clean layout, strong photography, **restrained neutrals**, clear hierarchy, **editorial seasonal** feel (campaign-style headers where it fits). COS aligns with **“Modern Style, Designed To Last”** — calm, quality-forward tone in copy where relevant.

**Constraint:** Do **not** copy COS logo, trademarks, or exact layouts. Capture **aesthetic and UX calmness** only.

---

## Product

Greenfield **web app**: men’s fashion only. Center on **gallery lookbooks** — outfit-first **“looks”** with image-led discovery, not a cluttered e-commerce grid.

**UI:** Clean, trendy, **COS-adjacent** — generous whitespace, strong typography, minimal chrome, subtle motion only.

**Homepage:** An **offset / staggered gallery wall** (asymmetric frames, varied sizes). Keep it **editorial, not chaotic**: muted backgrounds, consistent rhythm, restrained animation so it still feels premium.

---

## Style filters (exactly five)

Primary aesthetic filters for looks:

1. **Minimal / quiet** — neutrals, clean silhouettes, understated.
2. **Streetwear / urban** — sneakers, layers, graphic or utility cues.
3. **Classic / tailored** — structure, prep, dress-casual.
4. **Athleisure / sporty** — performance-inspired, relaxed athletic.
5. **Workwear / heritage** — durable fabrics, utilitarian / vintage-work influence.

Each look should map to at least **one** primary tag (multi-tag optional later).

---

## Albums (local-only mock)

- **No backend, no accounts, no database.** Demo scope only.
- **Persist albums in `localStorage` (or equivalent):**
  - Create **multiple named albums**.
  - **Add a look** to an album (from look detail or gallery).
  - **View** “what’s in this album” on album detail.
  - Remove a look from an album if straightforward.
- **After browser refresh**, albums and saved looks **still appear** (same browser / same origin).

---

## Data & MCP

- **Looks / lookbooks** should be driven by **MCP** (or a client that talks to your MCP-connected source) where possible.
- **If MCP fails or is empty**, use **seed / static JSON** with the same schema so the UI always works.
- Each look: **hero image(s)**, short **title/label**, **primary style tag** (one of five), optional metadata (season, occasion, key items).
- Respect **terms of service, APIs, and rate limits** for any real source; prefer official or licensed feeds over scraping.

---

## Navigation / IA (optional COS echo)

Keep nav simple: e.g. **Lookbooks / Gallery**, **Albums**, optional **category-style** browsing (shirts, outerwear, etc.) as **filters on looks**, not a full COS catalog clone.

---

## Success criteria (MVP)

1. Homepage **offset gallery wall** + paths into looks.
2. Browse looks with **five aesthetic filters**.
3. Look detail + **add to album** (pick album or create new).
4. **Album list** + **album detail** showing saved looks; **survives refresh** via local storage.
5. **MCP-backed** look data when available; **graceful fallback** to seed data.

---

## Future (out of scope for this mock)

Accounts, server DB, sync across devices, payments, real checkout.
