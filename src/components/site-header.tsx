import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "@/content";
import { brandName } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { bookingPath } from "@/lib/paths";
import { HeaderBook, HeaderNav } from "./header-nav";
import { LanguageSwitch } from "./language-switch";
import { MobileMenu } from "./mobile-menu";
import { navLinks } from "./nav-links";
import styles from "./site-header.module.css";

export function SiteHeader({ locale }: { locale: Locale }) {
  const { common } = getDictionary(locale);
  const book = bookingPath();

  return (
    <header className={`${styles.header} on-dark`}>
      <div className={styles.bar}>
        <Link className={styles.brand} href={localePath(locale, "/")}>
          <Image
            src="/brand/logo-white-520.webp"
            alt={brandName[locale]}
            width={520}
            height={181}
            sizes="(min-width: 60rem) 150px, 110px"
            loading="eager"
          />
        </Link>
        <HeaderNav locale={locale} nav={common.nav} label={common.mainNav} />
        <div className={styles.actions}>
          <LanguageSwitch
            locale={locale}
            label={common.switchLanguage}
            accessibleLabel={common.switchLanguageLabel}
          />
          <HeaderBook label={common.bookNow} />
          <MobileMenu
            links={[
              ...navLinks(locale, common.nav),
              { path: book, href: localePath(locale, book), label: common.bookNow },
            ]}
            labels={{ nav: common.mainNav, open: common.openMenu, close: common.closeMenu }}
          />
        </div>
      </div>
    </header>
  );
}
