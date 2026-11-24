import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { SiteFooter, type FooterVariant } from "./site-footer";

interface Props {
  readonly locale: Locale;
  readonly footer?: FooterVariant;
  readonly children: ReactNode;
}

export function PageFrame({ locale, footer = "compact", children }: Props) {
  return (
    <>
      <main id="content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} variant={footer} />
    </>
  );
}
