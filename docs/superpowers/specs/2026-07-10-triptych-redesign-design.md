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
Pure black, white text, monospaced metadata. Contact-sheet grid grouped by
client; images slightly dimmed until hover, when a caption stamp slides in.
Frame counter in the header. Click → lightbox.

### `/film` — The Screening Room
Near-black with cinema-red accent, condensed uppercase type. 2.39:1 letterboxed
frames, one large per scroll section, slow Ken Burns zoom on the poster, title
card beneath ("directed by …"). Optional `video:` frontmatter plays on hover
when present. Ships with two clearly-marked sample entries (no real film content
exists yet).

### `/about`
Quiet ivory page: portrait, short bio, contact links. Replaces the separate
contact page.

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
