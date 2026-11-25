import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";
import { getDictionary } from "@/content";
import { branchPath, type BranchId } from "@/data/branches";
import { brandName, socialProfiles } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { directoryPath, groomPath, privacyPath } from "@/lib/paths";
import { PhoneLink, WhatsAppAction } from "./contact";
import { ForwardArrow } from "./responsive-text";
import styles from "./site-footer.module.css";

const footerBranches = [
  "mohandessin",
  "sheikh-zayed",
  "madinaty",
  "midtown",
] as const satisfies readonly BranchId[];

/** The homepage footer is full; inner pages use the approved compact ones. */
export type FooterVariant = "full" | "compact" | "branch";

export function SiteFooter({ locale, variant }: { locale: Locale; variant: FooterVariant }) {
  const { common } = getDictionary(locale);
  const copy = common.footer;
  const to = (path: string) => localePath(locale, path);

  const logo = (
    <Image
      className={styles.logo}
      src="/brand/logo-white-520.webp"
      alt={brandName[locale]}
      width={520}
      height={181}
      sizes="180px"
    />
  );
  const phone = (
    <span>
      {copy.bookingLine} <PhoneLink locale={locale} className={styles.phone} />
    </span>
  );
  const privacy = (
    <Link className={styles.privacy} href={to(privacyPath)}>
      {copy.privacy}
    </Link>
  );

  if (variant !== "full") {
    return (
      <footer className={`${styles.footer} on-dark`}>
        <div className={`container ${styles.compact}`}>
          <span className="only-desktop">{logo}</span>
          <span>
            {phone}{" "}
            {variant === "branch" ? (
              <span className={`${styles.small} only-mobile`}>{copy.sharedLine}</span>
            ) : null}
            <span className="only-desktop">· {privacy}</span>
          </span>
          <span className={`${styles.small} only-mobile`}>
            {copy.copyright}
            {variant === "compact" ? <> · {privacy}</> : null}
          </span>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`${styles.footer} on-dark`}>
      <div className={`container ${styles.full}`}>
        <div className={styles.columns}>
          <div className={styles.brand}>
            {logo}
            <p className="only-desktop">{copy.tagline}</p>
          </div>
          <nav className={styles.pages} aria-label={copy.nav}>
            <span className={`${styles.title} only-desktop`}>{copy.pages}</span>
            <Link href={to("/services")}>
              <span className="only-mobile">{common.nav.services}</span>
              <span className="only-desktop">{copy.services}</span>
            </Link>
            <Link href={to(groomPath)}>{common.nav.groom}</Link>
            <Link className="only-mobile" href={to(directoryPath)}>
              {copy.branches}
            </Link>
            <Link href={to("/services#kids")}>{copy.kids}</Link>
            <Link href={to("/services#before")}>{copy.faq}</Link>
            <Link className={`${styles.privacy} only-mobile`} href={to(privacyPath)}>
              {copy.privacy}
            </Link>
          </nav>
          <nav className={`${styles.areas} only-desktop`} aria-label={copy.branches}>
            <span className={styles.title}>{copy.branches}</span>
            {footerBranches.map((id) => (
              <Link key={id} href={to(branchPath(id))}>
                {copy.areas[id]}
              </Link>
            ))}
            <Link href={to(directoryPath)}>
              {copy.allBranches}
              <ForwardArrow locale={locale} />
            </Link>
          </nav>
          <div className={styles.contact}>
            <span className={`${styles.title} only-desktop`}>{copy.contact}</span>
            {phone}
            <span className="only-desktop">
              <WhatsAppAction pendingLabel={common.unavailable}>{common.whatsapp}</WhatsAppAction>
            </span>
            <span className="only-desktop">
              {socialProfiles.map(({ name, url }, index) => (
                <Fragment key={url}>
                  {index > 0 ? " · " : null}
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    {name[locale]}
                  </a>
                </Fragment>
              ))}
            </span>
          </div>
        </div>
        <div className={styles.legal}>
          <span className={styles.small}>{copy.copyright}</span>
          <span className="only-desktop">{privacy}</span>
        </div>
      </div>
    </footer>
  );
}
