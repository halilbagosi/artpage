# Graph Report - artpage  (2026-10-05)

## Corpus Check
- 54 files · ~1,157,968 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 277 nodes · 549 edges · 23 communities (20 shown, 3 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3f0e0d1b`
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
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `guard()` - 19 edges
2. `errorResponse()` - 17 edges
3. `compilerOptions` - 16 edges
4. `getSite()` - 13 edges
5. `mediaKind` - 13 edges
6. `replaceReferences()` - 12 edges
7. `updateEntry()` - 9 edges
8. `readAll()` - 9 edges
9. `getPaintings()` - 9 edges
10. `MediaFile` - 9 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `readAll()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/admin.ts
- `Home()` --calls--> `getSiteForDisplay()`  [EXTRACTED]
  src/app/page.tsx → src/lib/content.ts
- `MediaPicker()` --calls--> `uploadFiles()`  [EXTRACTED]
  src/components/admin/MediaPicker.tsx → src/components/admin/ui.tsx
- `cleanFields()` --calls--> `fieldsOf()`  [EXTRACTED]
  src/lib/admin.ts → src/lib/schema.ts
- `saveSite()` --calls--> `getSite()`  [EXTRACTED]
  src/lib/admin.ts → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (23 total, 3 thin omitted)

### Community 0 - "content.ts"
Cohesion: 0.07
Nodes (38): AboutPage(), mailto(), metadata, plural(), ArtPage(), metadata, FilmPage(), metadata (+30 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "AtelierGallery.tsx"
Cohesion: 0.10
Nodes (51): GET(), POST(), Context, DELETE(), PUT(), target(), Context, DELETE() (+43 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (26): dependencies, clsx, framer-motion, image-size, next, react, react-dom, sharp (+18 more)

### Community 4 - "Scope by area"
Cohesion: 0.14
Nodes (13): About + Contact, Bugs to fix, Decisions (locked), Global mobile pass, Goal, Lightbox (new, shared), Out of scope, Painting world (+5 more)

### Community 5 - "Triptych Redesign — Design Spec (2026-07-10)"
Cohesion: 0.14
Nodes (13): `/about`, `/admin` — local dashboard, Architecture, `/art` — The Atelier, Content model, `/film` — The Screening Room, `/` — Gateway, Goal (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.09
Nodes (42): AdminPage(), metadata, CollectionGrid(), Dashboard(), entryMeta(), Section, sectionLabel(), EntrySheet() (+34 more)

### Community 7 - "Artpage — Triptych"
Cohesion: 0.29
Nodes (6): Architecture, Artpage — Triptych, Content model, Dashboard, Develop, The worlds

### Community 8 - "layout.tsx"
Cohesion: 0.29
Nodes (5): archivo, inter, jetbrains, metadata, playfair

## Knowledge Gaps
- **98 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+93 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSite()` connect `content.ts` to `AtelierGallery.tsx`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `guard()` connect `AtelierGallery.tsx` to `devDependencies`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _98 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07422559906487435 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `AtelierGallery.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10227936879018118 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._