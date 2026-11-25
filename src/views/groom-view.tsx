import Image from "next/image";
import Link from "next/link";
import { BookingLink } from "@/components/booking/booking-provider";
import { StickyBook } from "@/components/booking/sticky-book";
import { CallAction, PhoneText } from "@/components/contact";
import { PageFrame } from "@/components/page-frame";
import { PageHero } from "@/components/page-hero";
import { QuestionList } from "@/components/question-list";
import { ForwardArrow } from "@/components/responsive-text";
import { getDictionary } from "@/content";
import { photos } from "@/data/photos";
import { localePath, type Locale } from "@/i18n/config";
import styles from "./groom-view.module.css";

const preset = { service: "groom-package" } as const;

export function GroomView({ locale }: { locale: Locale }) {
  const { groom, common, branch } = getDictionary(locale);
  const photo = photos.groomStyling;

  return (
    <PageFrame locale={locale}>
      <section className="on-dark">
        <div className={styles.hero}>
          <PageHero
            locale={locale}
            heading={groom.heading}
            crumb={common.nav.groom}
            lede={groom.lede}
          >
            <div className={styles.actions}>
              <BookingLink className={`${styles.primary} only-desktop`} preset={preset}>
                {groom.cta}
              </BookingLink>
              <CallAction className={styles.call} pendingLabel={common.unavailable}>
                {common.call} <PhoneText locale={locale} />
              </CallAction>
            </div>
          </PageHero>
          <div className={styles.photo}>
            <Image
              src={photo.src}
              width={photo.width}
              height={photo.height}
              alt={photo.alt[locale]}
              sizes="(min-width: 60rem) 480px, 100vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        </div>
      </section>

      <section className={`container ${styles.included}`} aria-labelledby="included-heading">
        <h2 id="included-heading">{groom.included}</h2>
        <ul>
          {groom.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
        <p className={styles.pending}>
          <span className="draft-pill">{common.draft}</span> {groom.pending}
        </p>
        <Link className={styles.services} href={localePath(locale, "/services")}>
          {groom.services}
          <ForwardArrow locale={locale} />
        </Link>
      </section>

      <section className={`container ${styles.questions}`} aria-labelledby="questions-heading">
        <h2 id="questions-heading">{groom.questionsHeading}</h2>
        <QuestionList
          pendingLabel={branch.answerPending}
          items={groom.questions.map((question) => ({ question }))}
        />
      </section>

      <section className={styles.early} aria-labelledby="early-heading">
        <div className="container">
          <h2 id="early-heading">{groom.earlyHeading}</h2>
          <p>{groom.earlyBody}</p>
          <BookingLink className="button button--dark" preset={preset}>
            {groom.cta}
          </BookingLink>
        </div>
      </section>
      <StickyBook preset={preset}>{groom.cta}</StickyBook>
    </PageFrame>
  );
}
