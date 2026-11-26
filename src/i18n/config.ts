export const locales = ["ar", "en"] as const;
export type Locale = (typeof locales)[number];

/** A value supplied once per language. */
export type Localized = Readonly<Record<Locale, string>>;

export const localeMeta = {
  ar: { dir: "rtl", hreflang: "ar-EG", format: "ar-EG-u-nu-latn" },
  en: { dir: "ltr", hreflang: "en-EG", format: "en-GB" },
} as const;

/** Maps a language-neutral path ("/", "/book", "/#branches") to its localized URL. */
export function localePath(locale: Locale, path: string): string {
  // The English home page is the site's front door at /; the Arabic one is at /ar.
  // Every other page keeps Arabic at the root and English under /en.
  const home = /^\/(?=[?#]|$)/.exec(path);
  if (home) return locale === "ar" ? `/ar${path.slice(1)}` : path;
  return locale === "ar" ? path : `/en${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** Strips the language prefix so the same page can be resolved in another language. */
export function neutralPath(pathname: string): string {
  const path = pathname.replace(/^\/(?:en|ar)(?=\/|$)/, "");
  return path === "" ? "/" : path;
}
