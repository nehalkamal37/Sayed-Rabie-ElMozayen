import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The English home page lives at /en/ while every other route has no trailing
  // slash, so src/proxy.ts owns the slash redirects instead of Next.js.
  skipTrailingSlashRedirect: true,
  // Keeps the dev badge from covering page content during client review.
  devIndicators: false,
};

export default nextConfig;
