import type { NextConfig } from "next";

// STATIC_EXPORT=1 builds a fully static site into out/ for GitHub Pages.
const isStaticExport = process.env.STATIC_EXPORT === "1";

const nextConfig: NextConfig = isStaticExport
  ? {
      output: "export",
      trailingSlash: true,
      images: { unoptimized: true },
    }
  : {
      async rewrites() {
        return [
          {
            source: "/admin",
            destination: "/admin/index.html",
          },
        ];
      },
    };

export default nextConfig;
