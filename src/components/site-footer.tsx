import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/content";
import { brandName } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { privacyPath } from "@/lib/paths";
import { PhoneLink } from "./contact";
import styles from "./site-footer.module.css";

/** The approved footers of the inner pages. The homepage has its own. */
export type FooterVariant = "compact" | "branch";

export function SiteFooter({ locale, variant }: { locale: Locale; variant: FooterVariant }) {
  const { common } = getDictionary(locale);
  const copy = common.footer;

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
    <Link className={styles.privacy} href={localePath(locale, privacyPath)}>
      {copy.privacy}
    </Link>
  );

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
