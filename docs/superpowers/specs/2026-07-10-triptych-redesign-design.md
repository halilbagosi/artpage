# Triptych Redesign — Design Spec (2026-07-10)

## Goal

Rebuild the portfolio as an immersive three-world site (Art / Photography / Film)
that feels like three distinct physical spaces, while simplifying the stack.

## Architecture

- **Next.js 16 App Router, server components, static generation.** Each world is
  a real route (`/art`, `/photography`, `/film`) instead of a client-side mode
  switch — shareable URLs, SEO, instant loads.
- **Content = plain markdown frontmatter in `content/`**, parsed at build time by
  `src/lib/content.ts` (tiny custom frontmatter parser, no CMS runtime).
  TinaCMS, Zustand, `@samasante/liquid-glass`, `heic-convert`, and `lucide-react`
  are removed. The markdown format is unchanged, so a git-based CMS can be
  reattached later if desired.
- **Theming** via a `data-world` attribute set per route; each world defines its
  own CSS custom properties (colors, fonts, accents) in `globals.css`
  (Tailwind 4 `@theme` + scoped vars).
- **Motion**: framer-motion for the gateway panel expansion, world entry
  transition, and scroll reveals. Respects `prefers-reduced-motion`.

## Pages

### `/` — Gateway
Full-viewport triptych: three vertical panels (stacked bands on mobile), each a
full-bleed artwork, dimmed/desaturated at rest. Hover expands a panel and
saturates its image; the world name reveals. The artist name spans all three
panels with `mix-blend-mode: difference`. Keys 1/2/3 navigate. Clicking a panel
plays a brief expansion transition, then routes to the world.

### `/art` — The Atelier
Warm gesso background, ink text, terracotta accent, serif display type.
Alternating editorial rows: large framed image, oversized serif title, small-caps
placard (medium · category · month year). Grain texture overlay. Click → lightbox.

### `/photography` — The Darkroom
Warm black under a red safelight glow; grease-pencil red accent; wide
(Archivo expanded) film-box type with monospaced edge print. Hero: numeral
label, wordmark, then a hairline with the blurb and shoots/pictures/years set
in columns, and a strip of film edge-printed with the shoot names. Each client is a "roll" printed as a contact sheet:
35mm strips with sprocket holes and edge-print frame numbers, frames at each
photo's true aspect ratio. Prints "develop" up from black as they scroll into
view; hover draws a grease-pencil selection box. Click → lightbox.
*(Revised 2026-10-05.)*

### `/film` — The Screening Room
House-lights-down black with marquee-gold accent and velvet crimson;
extra-condensed uppercase (Archivo) title cards. Hero: numeral label and
title above a proscenium whose velvet curtains part (once in view) onto the
featured film; when the house scrolls into view the projector turns on (lamp
strike, room catches the light, picture pulls into focus). A hairline caption
beneath reads "Now showing · title · year · runtime". Programme: each film
is a numbered reel — 2.39:1 letterboxed frame (Ken Burns poster, video plays
on hover when `video:` is set), condensed title
card, and end-credits-style role/year/runtime. Closes on a "Fin." card with
"Request a session", linking to /about#contact. Ships with two clearly-marked sample entries. *(Revised 2026-10-05.)*

### `/about`
Quiet ivory page that blends the three rooms: the name with "Painter ·
Photographer · Filmmaker" each set in its room's type, portrait and bio with
stats, a preview card per room rendered in that room's own palette (scoped
`data-world`), and a contact section with one enquiry per discipline.
*(Revised 2026-10-05.)*

### `/admin` — local dashboard
Run with `npm run admin`. Edits `content/site.json`, the three collections and
`public/media` on disk; 404 everywhere else.

All labels (eyebrows, metadata, credits) share one `type-label` utility:
11px mono, uppercase, 0.14em tracking.

## Shared chrome

Fixed minimal header inside worlds: "HB" monogram → gateway, plus a three-item
world switcher with active underline. Shared `Lightbox` client component
(Esc/backdrop close, scroll lock, placard).

## Removed

`tina/`, `src/store/`, `public/admin/`, `scripts/convert-heic.mjs`,
`src/app/api/tina-graphql/`, `src/app/debug/`, `src/app/contact/`, old mode
components, `test-sort.js`.

## Content model

- `content/paintings/*.md`: title, image, month, year, medium, category, palette, style, description
- `content/photography/*.md`: title, image, client, category
- `content/videography/*.md`: title, poster, year, role, runtime, video (optional), sample (bool)
