import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { getDictionary } from "@/content";
import type { Locale } from "@/i18n/config";
import styles from "./privacy-view.module.css";

/** Holds the supplied line and the preview's actual behaviour until the policy is approved. */
export function PrivacyView({ locale }: { locale: Locale }) {
  const { privacy, booking } = getDictionary(locale);
  return (
    <PageFrame locale={locale}>
      <section className="on-dark">
        <PageHero
          locale={locale}
          heading={privacy.heading}
          crumb={privacy.heading}
          draft={privacy.draft}
        />
      </section>
      <div className={`container ${styles.body}`}>
        <p>{privacy.pending}</p>
        <h2>{privacy.useHeading}</h2>
        <p>{booking.privacyNote}</p>
        <p>{privacy.preview}</p>
      </div>
    </PageFrame>
  );
}
