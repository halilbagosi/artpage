import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a fully static site into out/ for GitHub Pages.
const nextConfig: NextConfig =
  process.env.STATIC_EXPORT === "1"
    ? { output: "export", trailingSlash: true, images: { unoptimized: true } }
    : {};

export default nextConfig;
