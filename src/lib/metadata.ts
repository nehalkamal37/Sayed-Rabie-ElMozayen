import type { Metadata } from "next";
import { localeMeta, localePath, type Locale } from "@/i18n/config";
import { siteUrl } from "@/data/site";

/** Page metadata with canonical and hreflang links for a language-neutral path. */
export function pageMetadata(
  locale: Locale,
  path: string,
  copy: { title: string; description: string },
  /** Draft pages stay out of search results. */
  { draft = false }: { draft?: boolean } = {},
): Metadata {
  const url = (target: Locale) => `${siteUrl}${localePath(target, path)}`;
  return {
    title: copy.title,
    description: copy.description,
    ...(draft ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: url(locale),
      languages: {
        [localeMeta.ar.hreflang]: url("ar"),
        [localeMeta.en.hreflang]: url("en"),
        "x-default": url("en"),
      },
    },
  };
}
