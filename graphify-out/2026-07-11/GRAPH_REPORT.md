# Graph Report - artpage  (2026-07-11)

## Corpus Check
- 34 files · ~1,148,198 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 145 nodes · 162 edges · 24 communities (20 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `3c8cffa3`
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

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Scope by area` - 8 edges
3. `Triptych Redesign — Design Spec (2026-07-10)` - 7 edges
4. `Reveal()` - 6 edges
5. `Portfolio Polish & Bug Fix — Design` - 6 edges
6. `Pages` - 6 edges
7. `scripts` - 5 edges
8. `readCollection()` - 5 edges
9. `getPaintings()` - 5 edges
10. `Artpage — Triptych` - 5 edges

## Surprising Connections (you probably didn't know these)
- `ArtPage()` --calls--> `getPaintings()`  [EXTRACTED]
  src/app/art/page.tsx → src/lib/content.ts
- `FilmPage()` --calls--> `getFilms()`  [EXTRACTED]
  src/app/film/page.tsx → src/lib/content.ts
- `PhotographyPage()` --calls--> `getPhotographsByClient()`  [EXTRACTED]
  src/app/photography/page.tsx → src/lib/content.ts

## Import Cycles
- None detected.

## Communities (24 total, 4 thin omitted)

### Community 0 - "content.ts"
Cohesion: 0.17
Nodes (15): ArtPage(), metadata, FilmPage(), metadata, metadata, PhotographyPage(), WorldHero(), SWITCHER (+7 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "AtelierGallery.tsx"
Cohesion: 0.16
Nodes (9): metadata, AtelierGallery(), placard(), DarkroomGallery(), LightboxItem, Reveal(), Film, Painting (+1 more)

### Community 3 - "package.json"
Cohesion: 0.13
Nodes (14): dependencies, clsx, framer-motion, next, react, react-dom, name, private (+6 more)

### Community 4 - "Scope by area"
Cohesion: 0.14
Nodes (13): About + Contact, Bugs to fix, Decisions (locked), Global mobile pass, Goal, Lightbox (new, shared), Out of scope, Painting world (+5 more)

### Community 5 - "Triptych Redesign — Design Spec (2026-07-10)"
Cohesion: 0.15
Nodes (12): `/about`, Architecture, `/art` — The Atelier, Content model, `/film` — The Screening Room, `/` — Gateway, Goal, Pages (+4 more)

### Community 6 - "devDependencies"
Cohesion: 0.22
Nodes (9): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/node, @types/react, @types/react-dom (+1 more)

### Community 7 - "Artpage — Triptych"
Cohesion: 0.33
Nodes (5): Architecture, Artpage — Triptych, Content model, Develop, The worlds

### Community 8 - "layout.tsx"
Cohesion: 0.33
Nodes (4): inter, jetbrains, metadata, playfair

## Knowledge Gaps
- **75 isolated node(s):** `eslintConfig`, `nextConfig`, `name`, `version`, `private` (+70 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `eslintConfig`, `nextConfig`, `name` to the rest of the system?**
  _75 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Scope by area` be split into smaller, more focused modules?**
  _Cohesion score 0.14285714285714285 - nodes in this community are weakly interconnected._