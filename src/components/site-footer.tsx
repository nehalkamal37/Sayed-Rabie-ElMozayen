import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/content";
import { branchPath, getBranch } from "@/data/branches";
import { brandName, socialProfiles } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { directoryPath, privacyPath } from "@/lib/paths";
import { BookingLink } from "./booking/booking-provider";
import { PhoneLink } from "./contact";
import { navLinks } from "./nav-links";
import styles from "./site-footer.module.css";

/** "branch" adds the note that branch numbers are still being confirmed. */
export type FooterVariant = "compact" | "branch";

/** Area links to branch pages that are ready; drafts join as they are approved. */
const areas = (["mohandessin", "sheikh-zayed", "madinaty", "midtown"] as const).filter(
  (id) => !getBranch(id).draft,
);

/** The editorial close of every page: one large line, the booking action, then the index. */
export function SiteFooter({
  locale,
  variant = "compact",
  close = true,
}: {
  locale: Locale;
  variant?: FooterVariant;
  /** The large closing line and booking action; off where the page is the booking form. */
  close?: boolean;
}) {
  const { common, home } = getDictionary(locale);
  const copy = common.footer;
  const to = (path: string) => localePath(locale, path);

  return (
    <footer className={`${styles.footer} on-dark`} data-own-booking>
      {close ? (
        <div className={styles.close}>
          <p className="eyebrow">{home.end.eyebrow}</p>
          <p className={styles.line} data-motion="rise">
            {copy.tagline}
          </p>
          <div className={styles.actions}>
            <BookingLink className={styles.book}>{common.bookNow}</BookingLink>
            <span className={styles.call}>
              {copy.bookingLine} <PhoneLink locale={locale} className={styles.phone} />
              {variant === "branch" ? <span className={styles.small}> {copy.sharedLine}</span> : null}
            </span>
          </div>
        </div>
      ) : null}

      <div className={styles.index}>
        <Image
          className={styles.logo}
          src="/brand/logo-white-520.webp"
          alt={brandName[locale]}
          width={520}
          height={181}
          sizes="180px"
        />
        <nav className={styles.column} aria-label={copy.nav}>
          <p className={styles.heading}>{copy.pages}</p>
          <ul>
            {navLinks(locale, common.nav)
              .filter((link) => link.path !== "/")
              .map((link) => (
                <li key={link.path}>
                  <Link href={link.href}>{link.label}</Link>
                </li>
              ))}
            <li>
              <Link href={to("/services#kids")}>{copy.kids}</Link>
            </li>
          </ul>
        </nav>
        <nav className={styles.column} aria-label={copy.branches}>
          <p className={styles.heading}>{copy.branches}</p>
          <ul>
            {areas.map((id) => (
              <li key={id}>
                <Link href={to(branchPath(id))}>{copy.areas[id]}</Link>
              </li>
            ))}
            <li>
              <Link href={to(directoryPath)}>{copy.allBranches}</Link>
            </li>
          </ul>
        </nav>
        <div className={styles.column}>
          <p className={styles.heading}>{copy.contact}</p>
          <ul>
            {socialProfiles.map(({ name, url }) => (
              <li key={url}>
                <a href={url} rel="noopener" target="_blank">
                  {name[locale]}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.base}>
        <span>{copy.copyright}</span>
        <Link href={to(privacyPath)}>{copy.privacy}</Link>
      </div>
    </footer>
  );
}
