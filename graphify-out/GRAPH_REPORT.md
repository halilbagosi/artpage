# Graph Report - bulk-photo-upload-optional-titles-b8b80d  (2026-10-20)

## Corpus Check
- 61 files · ~1,321,525 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 613 edges · 27 communities (25 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `e5057813`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- content.ts
- compilerOptions
- AtelierGallery.tsx
- package.json
- Scope by area
- Triptych Redesign — Design Spec (2026-07-10)
- devDependencies
- Artpage — Triptych
- layout.tsx
- ScreeningRoom.tsx
- eslint.config.mjs
- postcss.config.mjs
- Sample-Still-Waters.md

## God Nodes (most connected - your core abstractions)
1. `guard()` - 19 edges
2. `errorResponse()` - 17 edges
3. `compilerOptions` - 16 edges
4. `getSite()` - 13 edges
5. `mediaKind` - 13 edges
6. `replaceReferences()` - 12 edges
7. `videoEmbed` - 11 edges
8. `api()` - 10 edges
9. `MediaFile` - 10 edges
10. `sendJson()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `readAll()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/admin.ts
- `Home()` --calls--> `getSiteForDisplay()`  [EXTRACTED]
  src/app/page.tsx → src/lib/content.ts
- `ScreeningHero()` --calls--> `isPlayable()`  [EXTRACTED]
  src/components/ScreeningHero.tsx → src/components/FilmPlayer.tsx
- `ScreeningRoom()` --calls--> `isPlayable()`  [EXTRACTED]
  src/components/ScreeningRoom.tsx → src/components/FilmPlayer.tsx
- `Screening()` --calls--> `videoEmbed`  [EXTRACTED]
  src/components/FilmPlayer.tsx → src/lib/video.ts

## Import Cycles
- None detected.

## Communities (27 total, 2 thin omitted)

### Community 0 - "content.ts"
Cohesion: 0.08
Nodes (37): AboutPage(), mailto(), metadata, plural(), ArtPage(), metadata, FilmPage(), metadata (+29 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "AtelierGallery.tsx"
Cohesion: 0.10
Nodes (52): GET(), POST(), Context, DELETE(), PUT(), target(), Context, DELETE() (+44 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (27): dependencies, clsx, framer-motion, image-size, next, react, react-dom, sharp (+19 more)

### Community 4 - "Scope by area"
Cohesion: 0.14
Nodes (13): About + Contact, Bugs to fix, Decisions (locked), Global mobile pass, Goal, Lightbox (new, shared), Out of scope, Painting world (+5 more)

### Community 5 - "Triptych Redesign — Design Spec (2026-07-10)"
Cohesion: 0.14
Nodes (13): `/about`, `/admin` — local dashboard, Architecture, `/art` — The Atelier, Content model, `/film` — The Screening Room, `/` — Gateway, Goal (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.09
Nodes (46): AdminPage(), metadata, BulkPhotoSheet(), SPRING, CollectionGrid(), Dashboard(), entryMeta(), Section (+38 more)

### Community 7 - "Artpage — Triptych"
Cohesion: 0.29
Nodes (6): Architecture, Artpage — Triptych, Content model, Dashboard, Develop, The worlds

### Community 8 - "layout.tsx"
Cohesion: 0.29
Nodes (5): archivo, inter, jetbrains, metadata, playfair

### Community 9 - "ScreeningRoom.tsx"
Cohesion: 0.24
Nodes (12): FilmPlayer(), isPlayable(), Screening(), PlayCue(), ScreeningHero(), ScreeningRoom(), Film, parseUrl() (+4 more)

### Community 23 - "Sample-Still-Waters.md"
Cohesion: 0.40
Nodes (4): LOCAL_ONLY, moved, ROOT, STASH

## Knowledge Gaps
- **104 isolated node(s):** `eslintConfig`, `name`, `version`, `private`, `dev` (+99 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSite()` connect `content.ts` to `AtelierGallery.tsx`?**
  _High betweenness centrality (0.027) - this node is a cross-community bridge._
- **Why does `videoEmbed` connect `ScreeningRoom.tsx` to `content.ts`, `AtelierGallery.tsx`?**
  _High betweenness centrality (0.016) - this node is a cross-community bridge._
- **Why does `guard()` connect `AtelierGallery.tsx` to `devDependencies`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `version` to the rest of the system?**
  _104 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07811447811447811 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `AtelierGallery.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10056497175141244 - nodes in this community are weakly interconnected._