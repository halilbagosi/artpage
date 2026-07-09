# Artpage — Multi-Disciplinary Visual Portfolio

A premium, three-"world" artistic showcase built for visual artists, photographers, and filmmakers. The application switches its entire visual identity, typography, backgrounds, accent colors, and custom cursor dynamically depending on the selected discipline: **Painting**, **Photography**, or **Videography**.

---

## 🌌 The Three Worlds

The portfolio is unified by smooth transitions and consistent spacing but features three distinct, immersive visual spaces:

1. **🎨 Painting World (Warm & Organic)**
   - **Aesthetic:** Warm terracotta and paper tones (`#fdfbf7` background, `#1c1917` warm dark ink text, terracotta accents `#b45309`).
   - **Features:** Staggered asymmetric grid layout, custom placards, and fine canvas grain texture.
   - **Data Source:** Tracked in the `painting` collection.

2. **📸 Photography World (Apple Contrast)**
   - **Aesthetic:** High-contrast OLED black and glass card layouts (`#000000` background, `#ffffff` text, Apple blue accents `#0a84ff`).
   - **Features:** Expandable campaign accordions, smooth grids, and high contrast.
   - **Data Source:** Tracked in the `photography` collection.

3. **🎬 Videography World (Director's Cut)**
   - **Aesthetic:** Minimalist cinematic black and stark white accents.
   - **Features:** Video poster fallbacks with loop-on-hover video player previews, responsive aspect ratios, and custom playback styling.
   - **Data Source:** Tracked in the `videography` collection.

---

## 🛠️ Key Technical Features

- **Next.js & React 19:** Powered by the Next.js App Router for server-rendered page loading speed, fast routing, and SEO optimization.
- **Tailwind CSS v4:** Modern, forward-looking styling system leveraging CSS variables for the theme engine.
- **Dynamic Theme Engine:** Automatically injects `data-mode` onto the `<html>` element based on user selection. Custom properties (colors, typography, cursors) adapt dynamically across global scopes.
- **Local State & Hydration Protection:** Selected portfolio modes are managed via **Zustand** and persisted in `localStorage`. Pre-hydration scripts prevent visual "mode flickering" on load.
- **Smart WebGL2 Glass (`SafeGlass`):** Wraps custom WebGL liquid glass shaders (`@samasante/liquid-glass`). It features a seamless CSS fallback (`backdrop-filter`) for mobile browsers or older devices lacking WebGL2 context.
- **Shared Lightbox:** Fast click-to-zoom overlay for all artworks/photos with keyboard access (`Esc` to close), body-scroll locking, and clean meta placard overlays.
- **HEIC to JPEG Auto-Conversion:** Custom build-phase preprocessor that automatically converts uploaded `.heic` mobile image formats in `public/media/` to lightweight, web-compatible `.jpg` formats.
- **TinaCMS Integration:** Git-based, headless content management system allowing immediate schema-driven content updates.
- **Tina GraphQL Proxy Route:** An API proxy at `/api/tina-graphql` enabling physical LAN test devices (such as mobile devices on the local Wi-Fi) to hot-reload local content updates by bypassing localhost.

---

## 📂 Project Structure

```text
├── content/               # CMS Markdown Content
│   ├── about/             # Biography details (Rich Text + Profile Image)
│   ├── paintings/         # Artworks metadata and descriptions
│   └── photography/       # Photo campaign data
├── docs/                  # Specs and architectural designs
├── public/                # Static public assets
│   ├── admin/             # Compiled TinaCMS Admin panel
│   └── media/             # Artwork images, photos, and thumbnails
├── scripts/               # Automation scripts
│   └── convert-heic.mjs   # HEIC to JPEG preprocessor script
├── src/
│   ├── app/               # Next.js Pages, Routing & Proxy APIs
│   ├── components/        # React components (SafeGlass, CustomCursor, Modes, etc.)
│   ├── lib/               # Utility modules (Tina Client)
│   └── store/             # Zustand state management hooks
├── tina/                  # TinaCMS Schema Definitions & Generated typings
├── package.json           # Scripts and dependency tree
└── tsconfig.json          # TypeScript config
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.dev/) installed.

### Installation

Install the package dependencies:

```bash
npm install
```

### Local Development

Run the development command:

```bash
npm run dev
```

This starts the three-tier local dev processes:
1. **HEIC Conversion:** Scans `public/media/` for `.heic` files, converts them using the macOS native `sips` command, updates Markdown references, and cleans up the original assets.
2. **TinaCMS Server:** Starts the local GraphQL schema compiler and CMS dashboard at `http://localhost:4001/admin`.
3. **Next.js Dev Server:** Starts the Next.js frontend application at `http://localhost:3000`.

---

## 📝 Content Management (TinaCMS)

To edit or add paintings, photos, videography links, or modify the About page:
1. Run the local development server (`npm run dev`).
2. Navigate to `http://localhost:3000/admin`.
3. Use the visual editor to modify, create, or delete records.
4. Changes are written directly to the markdown files in `content/` and automatically committed to Git.
