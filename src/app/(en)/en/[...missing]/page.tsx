import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary } from "@/content";

export const metadata: Metadata = { title: getDictionary("en").notFound.metaTitle };

/** Unknown URLs get a localized 404 inside this language's layout. */
export default function Page() {
  notFound();
}
