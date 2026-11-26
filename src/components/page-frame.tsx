import type { ReactNode } from "react";
import type { Locale } from "@/i18n/config";
import { MotionDirector } from "./motion/motion-director";
import { SiteFooter, type FooterVariant } from "./site-footer";
import { SiteHeader } from "./site-header";

interface Props {
  readonly locale: Locale;
  readonly footer?: FooterVariant;
  /** False on the booking page, which needs no closing call to book. */
  readonly footerClose?: boolean;
  readonly children: ReactNode;
}

/** Header and footer for every page but the homepage, which has its own. */
export function PageFrame({ locale, footer = "compact", footerClose = true, children }: Props) {
  return (
    <>
      <SiteHeader locale={locale} />
      <main id="content" tabIndex={-1}>
        {children}
      </main>
      <SiteFooter locale={locale} variant={footer} close={footerClose} />
      <MotionDirector />
    </>
  );
}
