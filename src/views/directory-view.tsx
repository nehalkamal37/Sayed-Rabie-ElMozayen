import { StickyBook } from "@/components/booking/sticky-book";
import { BranchDirectory } from "@/components/directory/branch-directory";
import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { getDictionary } from "@/content";
import type { Locale } from "@/i18n/config";
import styles from "./directory-view.module.css";

export function DirectoryView({ locale }: { locale: Locale }) {
  const { directory, common } = getDictionary(locale);
  return (
    <PageFrame locale={locale}>
      <section className="on-dark">
        <PageHero
          locale={locale}
          heading={directory.heading}
          crumb={common.nav.branches}
          lede={directory.lede}
          draft={directory.draft}
        />
      </section>
      <div className={`container ${styles.body}`}>
        <BranchDirectory locale={locale} copy={directory} draftLabel={common.draft} />
      </div>
      <StickyBook>{common.bookNow}</StickyBook>
    </PageFrame>
  );
}
