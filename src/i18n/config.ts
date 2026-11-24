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
  return locale === "ar" ? path : `/en${path}`;
}

export function otherLocale(locale: Locale): Locale {
  return locale === "ar" ? "en" : "ar";
}

/** Strips the language prefix so the same page can be resolved in another language. */
export function neutralPath(pathname: string): string {
  const path = pathname.replace(/^\/en(?=\/|$)/, "");
  return path === "" ? "/" : path;
}
