import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // src/proxy.ts owns the slash redirects, including the old /en/ home page
  // moving to /, instead of Next.js.
  skipTrailingSlashRedirect: true,
  // Keeps the dev badge from covering page content during client review.
  devIndicators: false,
  images: { formats: ["image/avif", "image/webp"] },
};

export default nextConfig;
