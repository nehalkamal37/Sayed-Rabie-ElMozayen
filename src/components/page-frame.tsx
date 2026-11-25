import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { SiteFooter, type FooterVariant } from "./site-footer";
import { SiteHeader } from "./site-header";

interface Props {
  readonly locale: Locale;
  readonly footer?: FooterVariant;
  readonly children: ReactNode;
}

/** Header and footer for every page but the homepage, which has its own. */
export function PageFrame({ locale, footer = "compact", children }: Props) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} variant={footer} />
    </>
  );
}
