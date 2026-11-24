import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/content";
import { branchPath, getBranch, type BranchId } from "@/data/branches";
import { brandName } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
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
  // No privacy page exists yet, so the approved label is shown without a link.
  const privacy = (
    <span className={styles.privacy}>
      {copy.privacy} ({common.soon})
    </span>
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
            <Link href={to("/#groom")}>{common.nav.groom}</Link>
            <Link className="only-mobile" href={to("/#branches")}>
              {copy.branches}
            </Link>
            <Link href={to("/services#kids")}>{copy.kids}</Link>
            <Link href={to("/services#before")}>{copy.faq}</Link>
            <span className="only-mobile">{privacy}</span>
          </nav>
          <nav className={`${styles.areas} only-desktop`} aria-label={copy.branches}>
            <span className={styles.title}>{copy.branches}</span>
            {footerBranches.map((id) => (
              <Link key={id} href={to(getBranch(id).detail ? branchPath(id) : "/#branches")}>
                {copy.areas[id]}
              </Link>
            ))}
            <Link href={to("/#branches")}>
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
            <span className="only-desktop">{copy.social}</span>
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
