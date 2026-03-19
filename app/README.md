# ÉDIT — Men's Lookbook

A COS-inspired, Scandinavian-minimal men's fashion lookbook web app. Browse curated outfit-first "looks" with image-led discovery, filter by aesthetic style, and save favorites to local albums.

## Quick Start

```bash
cd app
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Features

- **Editorial Homepage** — Full-bleed hero with staggered gallery wall and style category previews
- **Gallery** — Masonry layout with 5 aesthetic filters (Minimal, Streetwear, Classic, Athleisure, Workwear)
- **Look Detail** — Full look information with key pieces, season, occasion, and "Save to Album"
- **Albums** — Create named albums, save looks, add external links. Persisted in localStorage across refreshes
- **Responsive** — Desktop, tablet, and mobile layouts
- **Animations** — Subtle scroll-triggered and page transition animations via Framer Motion

## Tech Stack

- React 19 + TypeScript
- Vite
- Tailwind CSS v4
- React Router v7
- Framer Motion
- Lucide React (icons)
- localStorage for album persistence

## Project Structure

```
app/
├── src/
│   ├── components/     # Navbar, Footer, Layout, AddToAlbumModal
│   ├── data/           # Seed look data (15 curated looks)
│   ├── pages/          # Home, Gallery, LookDetail, Albums, AlbumDetail
│   ├── store/          # localStorage-backed album management
│   ├── App.tsx         # Router setup
│   ├── main.tsx        # Entry point
│   └── index.css       # Tailwind + custom design tokens
├── index.html
└── package.json
```

## Design

Inspired by COS (cos.com) — quiet, modern, Scandinavian-minimal direction with clean layout, strong photography, restrained neutrals, and an editorial seasonal feel. Uses Inter for body text and Playfair Display for headings.
