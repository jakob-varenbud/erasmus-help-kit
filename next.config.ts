import type { NextConfig } from "next";

// For GitHub Pages the site is built as static HTML and served from /<repo-name>.
// Set PAGES_BASE_PATH (e.g. "/erasmus-help-kit") to enable it – locally nothing changes.
const basePath = process.env.PAGES_BASE_PATH ?? "";
const isPagesBuild = process.env.PAGES_BASE_PATH !== undefined;

const nextConfig: NextConfig = {
  /* config options here */
  ...(isPagesBuild
    ? {
        output: "export",
        basePath,
        trailingSlash: true,
        images: { unoptimized: true },
      }
    : {
        cacheComponents: true,
        partialPrefetching: true,
      }),
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
