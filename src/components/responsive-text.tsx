import type { Locale } from "@/i18n/config";

/** Wording that differs between the approved phone and desktop screens. */
export function ResponsiveText({ long, short }: { long: string; short?: string }) {
  if (!short || short === long) return long;
  return (
    <>
      <span className="only-mobile">{short}</span>
      <span className="only-desktop">{long}</span>
    </>
  );
}

/** Points onward in the reading direction. */
export function ForwardArrow({ locale }: { locale: Locale }) {
  return <span aria-hidden="true"> {locale === "ar" ? "←" : "→"}</span>;
}
