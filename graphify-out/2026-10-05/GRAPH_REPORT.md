# Graph Report - artpage  (2026-10-05)

## Corpus Check
- 53 files · ~1,155,903 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 256 nodes · 469 edges · 25 communities (21 shown, 4 thin omitted)
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
- Gateway.tsx
- eslint.config.mjs
- next.config.ts
- postcss.config.mjs
- Reveal.tsx

## God Nodes (most connected - your core abstractions)
1. `guard()` - 16 edges
2. `compilerOptions` - 16 edges
3. `getSite()` - 15 edges
4. `errorResponse()` - 14 edges
5. `updateEntry()` - 9 edges
6. `readAll()` - 9 edges
7. `mediaKind` - 9 edges
8. `AboutPage()` - 8 edges
9. `api()` - 8 edges
10. `getPaintings()` - 8 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `readAll()`  [EXTRACTED]
  src/app/admin/page.tsx → src/lib/admin.ts
- `Home()` --calls--> `getSite()`  [EXTRACTED]
  src/app/page.tsx → src/lib/content.ts
- `initialValues()` --calls--> `fieldsOf()`  [EXTRACTED]
  src/components/admin/EntrySheet.tsx → src/lib/schema.ts
- `EntrySheet()` --calls--> `fieldsOf()`  [EXTRACTED]
  src/components/admin/EntrySheet.tsx → src/lib/schema.ts
- `MediaPicker()` --calls--> `uploadFiles()`  [EXTRACTED]
  src/components/admin/MediaPicker.tsx → src/components/admin/ui.tsx

## Import Cycles
- None detected.

## Communities (25 total, 4 thin omitted)

### Community 0 - "content.ts"
Cohesion: 0.08
Nodes (34): AboutPage(), mailto(), metadata, plural(), ArtPage(), metadata, FilmPage(), metadata (+26 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "AtelierGallery.tsx"
Cohesion: 0.12
Nodes (37): GET(), POST(), Context, DELETE(), PUT(), target(), DELETE(), POST() (+29 more)

### Community 3 - "package.json"
Cohesion: 0.08
Nodes (25): dependencies, clsx, framer-motion, image-size, next, react, react-dom, devDependencies (+17 more)

### Community 4 - "Scope by area"
Cohesion: 0.14
Nodes (13): About + Contact, Bugs to fix, Decisions (locked), Global mobile pass, Goal, Lightbox (new, shared), Out of scope, Painting world (+5 more)

### Community 5 - "Triptych Redesign — Design Spec (2026-07-10)"
Cohesion: 0.14
Nodes (13): `/about`, `/admin` — local dashboard, Architecture, `/art` — The Atelier, Content model, `/film` — The Screening Room, `/` — Gateway, Goal (+5 more)

### Community 6 - "devDependencies"
Cohesion: 0.11
Nodes (34): CollectionGrid(), Dashboard(), entryMeta(), Section, sectionLabel(), EntrySheet(), initialValues(), SPRING (+26 more)

### Community 7 - "Artpage — Triptych"
Cohesion: 0.29
Nodes (6): Architecture, Artpage — Triptych, Content model, Dashboard, Develop, The worlds

### Community 8 - "layout.tsx"
Cohesion: 0.29
Nodes (5): archivo, inter, jetbrains, metadata, playfair

### Community 24 - "Reveal.tsx"
Cohesion: 0.47
Nodes (5): AdminPage(), metadata, adminEnabled(), ADMIN_SECTIONS, AdminSection

## Knowledge Gaps
- **95 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+90 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getSite()` connect `content.ts` to `AtelierGallery.tsx`?**
  _High betweenness centrality (0.044) - this node is a cross-community bridge._
- **Why does `fieldsOf()` connect `AtelierGallery.tsx` to `devDependencies`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `guard()` connect `AtelierGallery.tsx` to `Reveal.tsx`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _95 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `content.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08106219426974144 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `AtelierGallery.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11818181818181818 - nodes in this community are weakly interconnected._