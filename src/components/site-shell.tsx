import "@fontsource/ibm-plex-sans-arabic/400.css";
import "@fontsource/ibm-plex-sans-arabic/500.css";
import "@fontsource/ibm-plex-sans-arabic/600.css";
import "@fontsource/ibm-plex-sans-arabic/700.css";
import "@/styles/tokens.css";
import "@/styles/globals.css";

import type { ReactNode } from "react";
import { getDictionary } from "@/content";
import { localeMeta, type Locale } from "@/i18n/config";
import { BookingProvider } from "./booking/booking-provider";

/** Document shell. Each language has its own root layout so lang and dir are server-rendered. */
export function SiteShell({ locale, children }: { locale: Locale; children: ReactNode }) {
  const { common, booking } = getDictionary(locale);
  return (
    <html lang={locale} dir={localeMeta[locale].dir}>
      <body>
        <a className="skip-link" href="#content">
          {common.skipToContent}
        </a>
        <BookingProvider locale={locale} copy={booking}>
          {children}
        </BookingProvider>
      </body>
    </html>
  );
}
