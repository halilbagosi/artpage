# Graph Report - bulk-photo-upload-optional-titles-b8b80d  (2026-10-20)

## Corpus Check
- 170 files · ~3,555,775 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 419 nodes · 647 edges · 137 communities (134 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c6490091`
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
- page.tsx
- Sample-Still-Waters.md
- Gateway.tsx

## God Nodes (most connected - your core abstractions)
1. `guard()` - 20 edges
2. `errorResponse()` - 18 edges
3. `compilerOptions` - 16 edges
4. `getSite()` - 13 edges
5. `mediaKind` - 13 edges
6. `api()` - 12 edges
7. `replaceReferences()` - 12 edges
8. `sendJson()` - 11 edges
9. `videoEmbed` - 11 edges
10. `updateEntry()` - 10 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `readAll()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/admin.ts
- `ArtPage()` --calls--> `getSite()`  [EXTRACTED]
  src/app/art/page.tsx → src/lib/content.ts
- `FilmPage()` --calls--> `getSite()`  [EXTRACTED]
  src/app/film/page.tsx → src/lib/content.ts
- `Home()` --calls--> `getSiteForDisplay()`  [EXTRACTED]
  src/app/page.tsx → src/lib/content.ts
- `PhotographyPage()` --calls--> `getSite()`  [EXTRACTED]
  src/app/photography/page.tsx → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (137 total, 3 thin omitted)

### Community 0 - "content.ts"
Cohesion: 0.08
Nodes (36): AboutPage(), mailto(), metadata, plural(), ArtPage(), metadata, FilmPage(), metadata (+28 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "AtelierGallery.tsx"
Cohesion: 0.09
Nodes (59): GET(), PATCH(), POST(), Context, DELETE(), PUT(), target(), Context (+51 more)

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
Cohesion: 0.11
Nodes (41): BulkPhotoSheet(), SPRING, CollectionGrid(), Dashboard(), entryMeta(), Section, sectionLabel(), capitalize() (+33 more)

### Community 7 - "Artpage — Triptych"
Cohesion: 0.29
Nodes (6): Architecture, Artpage — Triptych, Content model, Dashboard, Develop, The worlds

### Community 8 - "layout.tsx"
Cohesion: 0.29
Nodes (5): archivo, inter, jetbrains, metadata, playfair

### Community 9 - "ScreeningRoom.tsx"
Cohesion: 0.24
Nodes (12): FilmPlayer(), isPlayable(), Screening(), PlayCue(), ScreeningHero(), ScreeningRoom(), Film, parseUrl() (+4 more)

### Community 22 - "page.tsx"
Cohesion: 0.60
Nodes (4): AdminPage(), metadata, adminEnabled(), ADMIN_SECTIONS

### Community 23 - "Sample-Still-Waters.md"
Cohesion: 0.40
Nodes (4): LOCAL_ONLY, moved, ROOT, STASH

## Knowledge Gaps
- **105 isolated node(s):** `eslintConfig`, `name`, `version`, `private`, `dev` (+100 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSite()` connect `AtelierGallery.tsx` to `content.ts`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **Why does `videoEmbed` connect `ScreeningRoom.tsx` to `content.ts`, `AtelierGallery.tsx`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **Why does `guard()` connect `AtelierGallery.tsx` to `page.tsx`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `name`, `version` to the rest of the system?**
  _105 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07764876632801161 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `AtelierGallery.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09181365897783808 - nodes in this community are weakly interconnected._