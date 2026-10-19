# Artpage — Triptych

The portfolio of Halil Bagosi: one artist, three worlds. A full-screen gateway
splits into three panels — **Art**, **Photography**, **Film** — and each opens
into its own immersive space with a distinct palette, typography, and rhythm.

## The worlds

| Route          | World              | Character                                                                 |
| -------------- | ------------------ | ------------------------------------------------------------------------- |
| `/`            | Gateway            | Full-viewport triptych; hover expands a panel, keys 1·2·3 enter a world   |
| `/art`         | The Atelier        | Warm gesso paper, serif editorial rows, gallery frames, film grain        |
| `/photography` | The Darkroom       | OLED black contact sheet, mono metadata stamps, grouped by client         |
| `/film`        | The Screening Room | Letterboxed 2.39:1 frames, Ken Burns posters, cinema-red accents          |
| `/about`       | About              | Quiet ivory bio + contact                                                 |

## Architecture

- **Next.js 16 (App Router, Turbopack)** — every route is statically generated.
- **Content is plain markdown frontmatter** in `content/{paintings,photography,videography}/`,
  read at build time by [src/lib/content.ts](src/lib/content.ts). No CMS runtime;
  add a piece by dropping a `.md` file and an image in `public/media/`.
- **Theming** via a `data-world` attribute: each world defines its CSS custom
  properties in [globals.css](src/app/globals.css) (Tailwind 4).
- **Motion**: framer-motion drives the gateway panel choreography and lightbox;
  scroll reveals use CSS scroll-driven animations (`animation-timeline: view()`)
  as progressive enhancement. All animation respects `prefers-reduced-motion`.

## Content model

```yaml
# content/paintings/My-Piece.md
title: My Piece
image: /media/my-piece.jpg
month: April          # optional
year: '2026'          # optional
medium: Oil Paint
category: portraits
description: ''

# content/photography/My-Frame.md
title: My Frame
image: /media/my-frame.jpg
client: Client Name
category: Campaign

# content/videography/My-Film.md
title: My Film
poster: /media/my-poster.jpg
year: '2026'
role: Director / Editor
runtime: '02:40'
video: /media/my-film.mp4   # optional; plays on hover when present
sample: 'true'              # marks placeholder entries
```

## Develop

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # static production build
```
