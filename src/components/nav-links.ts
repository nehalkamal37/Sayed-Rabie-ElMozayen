import type { Dictionary } from "@/content";
import { localePath, type Locale } from "@/i18n/config";

export interface NavLink {
  /** Language-neutral path. */
  readonly path: string;
  readonly href: string;
  readonly label: string;
}

/** Only destinations that exist. Pages still to come point at their homepage section. */
export function navLinks(locale: Locale, nav: Dictionary["common"]["nav"]): readonly NavLink[] {
  return [
    { path: "/", label: nav.home },
    { path: "/services", label: nav.services },
    { path: "/#groom", label: nav.groom },
    { path: "/#branches", label: nav.branches },
    { path: "/#story", label: nav.about },
  ].map((link) => ({ ...link, href: localePath(locale, link.path) }));
}
