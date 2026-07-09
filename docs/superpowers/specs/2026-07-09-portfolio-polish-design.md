# Portfolio Polish & Bug Fix — Design

Date: 2026-07-09
Author: Halil Bagosi (with Claude)

## Goal

A three-"world" artistic portfolio (Painting / Photography / Videography) that switches
its entire visual identity per discipline. Keep the three bold worlds, fix the bugs,
polish each world, tighten the transitions between them, and make it super mobile
responsive. This is a visual showcase / WIP — the contact form may stay stubbed but must
never *look* broken.

## Decisions (locked)

- **Keep three distinct worlds**, unified only by shared connective tissue (motion timing,
  spacing, nav, transitions) — not a single flat aesthetic.
- **Visual showcase / WIP**: form can be stubbed; images/content wired where cheap.
- **Keep effects (custom cursor, liquid glass, motion) but make them robust** and
  gracefully degrading.
- **Include a click-to-zoom lightbox** for artworks/photos, shared across all worlds.

## Bugs to fix

1. **Asymmetric painting grid dead** — `PaintingMode.tsx` builds Tailwind classes at
   runtime (`md:${myWidth}`), which the JIT never sees. Replace with fixed, literal
   class combos (or inline style widths) so the staggered layout renders.
2. **Mode resets to Painting when switching from About/Contact** — Navbar does
   `window.location.href = '/'` (full reload) and the Zustand store isn't persisted.
   Persist mode to localStorage and navigate via the Next router (no full reload).
3. **Contact form posts to a fake Formspree id (404)** — intercept submit, show an inline
   success state; clearly a demo, never a dead 404.
4. **`/noise.png` missing (404, no texture)** — replace with an inline SVG `feTurbulence`
   grain utility; remove the file reference.
5. **About page ignores its CMS content** — wire to the `about` collection
   (`profileImage` + rich-text body) instead of a hardcoded empty grey box.
6. **Videos never play** — `videoUrl` is fetched but unused; hover reveals a permanent
   black "● REC" screen. Play muted looping video on hover (desktop) / in-view (mobile)
   when `videoUrl` present; fall back to the stylized poster otherwise. Remove the
   hardcoded `client: 'Film Client'`.
7. **Minor** — generic `<title>`/meta, `data-mode` flash on load, `cursor:none` risk,
   `border-white/5` invisible in light mode.

## Scope by area

### Shared connective tissue
- Persist `useModeStore` to localStorage; hydrate safely (avoid SSR mismatch).
- Set `data-mode` on `<html>` from persisted value via an inline pre-hydration script to
  prevent theme flicker.
- Navbar: switch modes through the Next router; if already on `/`, no navigation.
- Grain: a reusable inline-SVG noise background utility (no external asset).
- **World transition**: a brief accent-colored wipe (incoming world's color) on mode change.
- Cursor: hide native cursor only while custom cursor is mounted; fix mid-tone visibility.
- Real metadata; shared spacing/max-width/motion tokens.

### Painting world
- Fix asymmetric grid with literal classes. Keep placards, warm palette, grain.
- Tighten typography rhythm and mobile heading sizes.

### Photography world
- Keep campaign accordion; fix contrast; tighten grid + expand animation. Grid 1→2→3→4.

### Videography world
- Real `videoUrl` playback with poster fallback. Title + category (no fake client).
- Clamp oversized title so it never overflows at small widths.

### About + Contact
- About: render CMS profile image + bio.
- Contact: stubbed submit with inline success state.

### Lightbox (new, shared)
- Tap/click any artwork or photo → full-screen overlay with the image, title, and meta.
- Escape / click-outside / close button to dismiss; body scroll lock; keyboard accessible.
- Reused by Painting and Photography (and video poster where sensible).

### Global mobile pass
- Every world audited at 375px: no horizontal overflow, adequate tap targets, working
  menu, sane heading sizes, correct image aspect ratios.

## Out of scope

- Real backend for the contact form.
- CMS schema changes.
- New content authoring.
