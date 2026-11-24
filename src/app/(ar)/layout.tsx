import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site-shell";
import { siteUrl } from "@/data/site";

export const metadata: Metadata = { metadataBase: new URL(siteUrl) };

export default function RootLayout({ children }: { children: ReactNode }) {
  return <SiteShell locale="ar">{children}</SiteShell>;
}
