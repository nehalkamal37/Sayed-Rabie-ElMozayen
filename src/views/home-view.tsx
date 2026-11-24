import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { BookingLink } from "@/components/booking/booking-provider";
import { StickyBook } from "@/components/booking/sticky-book";
import { CallAction, PhoneLink, PhoneText, WhatsAppAction } from "@/components/contact";
import { BookingBar } from "@/components/home/booking-bar";
import { BranchFinder } from "@/components/home/branch-finder";
import { ServiceShowcase } from "@/components/home/service-showcase";
import { Icon } from "@/components/icons";
import { OrganizationJsonLd } from "@/components/json-ld";
import { PageFrame } from "@/components/page-frame";
import { ForwardArrow, ResponsiveText } from "@/components/responsive-text";
import { getDictionary } from "@/content";
import { photos, type Photo } from "@/data/photos";
import { reviews } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import styles from "./home-view.module.css";

export function HomeView({ locale }: { locale: Locale }) {
  const { home, common, booking } = getDictionary(locale);
  const { groom, how, story } = home;

  return (
    <PageFrame locale={locale} footer="full">
      <OrganizationJsonLd />
      <div className={styles.page}>
        <section className={`${styles.hero} on-dark`}>
          <HeroPicture locale={locale} />
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.heroInner}>
            <div className={styles.heroText}>
              <Divider className={styles.heroDivider} />
              <h1>
                <span className={styles.eyebrow}>{home.eyebrow}</span>{" "}
                <span className={styles.headline}>{home.headline}</span>
              </h1>
              <p className={styles.lede}>
                <ResponsiveText long={home.lede} short={home.ledeShort} />
              </p>
              <div className={`${styles.heroActions} only-desktop`}>
                <BookingLink className={styles.primary}>{common.bookNow}</BookingLink>
                <WhatsAppAction className={styles.secondary} pendingLabel={common.unavailable}>
                  {home.whatsapp}
                </WhatsAppAction>
              </div>
              <p className={`${styles.orCall} only-desktop`}>
                {home.orCall} <PhoneLink locale={locale} />
              </p>
              <div className={`${styles.pills} only-mobile`}>
                <WhatsAppAction className={styles.pill} pendingLabel={common.unavailable}>
                  {common.whatsapp}
                </WhatsAppAction>
                <CallAction className={styles.pill} pendingLabel={common.unavailable}>
                  {common.call} <PhoneText locale={locale} />
                </CallAction>
              </div>
            </div>
          </div>
        </section>

        <div className={`${styles.barBand} only-desktop`}>
          <div className="container">
            <BookingBar locale={locale} bar={home.bar} booking={booking} />
          </div>
        </div>

        <section id="branches" className="on-dark" aria-labelledby="branches-heading">
          <div className={`container ${styles.branches}`}>
            <div className={styles.branchesHead}>
              <div>
                <h2 id="branches-heading">{home.branches.heading}</h2>
                <p className="only-desktop">{home.branches.lede}</p>
              </div>
              <span className={styles.draft}>
                <ResponsiveText long={home.branches.draft} short={home.branches.draftShort} />
              </span>
            </div>
            <BranchFinder locale={locale} copy={home.branches} />
          </div>
        </section>

        <section id="services" className={styles.servicesSection} aria-labelledby="services-heading">
          <div className={`container ${styles.services}`}>
            <div className={styles.servicesHead}>
              <div>
                <p className={`${styles.servicesEyebrow} only-desktop`}>{home.services.eyebrow}</p>
                <h2 id="services-heading">{home.services.heading}</h2>
              </div>
              <Link
                className={`${styles.allServices} only-desktop`}
                href={localePath(locale, "/services")}
              >
                {home.services.all}
                <ForwardArrow locale={locale} />
              </Link>
            </div>
            <ServiceShowcase locale={locale} copy={home.services} />
            <Link
              className={`${styles.allServicesButton} only-mobile`}
              href={localePath(locale, "/services")}
            >
              {home.services.allLong}
            </Link>
          </div>
        </section>

        <section id="groom" className="on-dark" aria-labelledby="groom-heading">
          <div className={`container ${styles.groom}`}>
            <figure className={styles.groomPhoto}>
              <Image
                src={photos.groomStyling.src}
                width={photos.groomStyling.width}
                height={photos.groomStyling.height}
                alt={photos.groomStyling.alt[locale]}
                sizes="(min-width: 60rem) 520px, 110vw"
              />
            </figure>
            <div className={styles.groomText}>
              <Divider className={styles.groomDivider} />
              <h2 id="groom-heading">{groom.heading}</h2>
              <p className={styles.groomBody}>{groom.body}</p>
              <ul className={styles.groomList}>
                {groom.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className={`${styles.early} only-desktop`}>{groom.early}</p>
              <div className={styles.groomActions}>
                <BookingLink className={styles.groomCta} preset={{ service: "groom-package" }}>
                  {groom.cta}
                </BookingLink>
                <Link
                  className={`${styles.secondary} only-desktop`}
                  href={localePath(locale, "/services#groom")}
                >
                  {groom.details}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className={`${styles.howSection} on-dark`} aria-labelledby="how-heading">
          <div className={`container ${styles.how}`}>
            <div className={styles.howHead}>
              <h2 id="how-heading">
                <ResponsiveText long={how.heading} short={how.headingShort} />
              </h2>
              <BookingLink className={`${styles.primary} only-desktop`}>{common.bookNow}</BookingLink>
            </div>
            <ol className={styles.steps}>
              {how.steps.map((step, index) => (
                <li key={step.title}>
                  <span className={styles.number} aria-hidden="true">
                    {index + 1}
                  </span>
                  <span className={styles.stepText}>
                    <span className={styles.stepTitle}>{step.title}</span>
                    <span className={styles.stepBody}>{step.body}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="story" className={styles.storySection} aria-labelledby="story-heading">
          <div className={`container ${styles.story}`}>
            <Image
              className={styles.storyPhoto}
              src={photos.leatherChairs.src}
              width={photos.leatherChairs.width}
              height={photos.leatherChairs.height}
              alt={photos.leatherChairs.alt[locale]}
              sizes="(min-width: 60rem) 690px, 100vw"
            />
            <div className={styles.storyText}>
              <p className={styles.storyEyebrow}>{story.eyebrow}</p>
              <h2 id="story-heading">{story.heading}</h2>
              <p className={styles.storyBody}>
                <span className="only-desktop">{story.lead} </span>
                {story.body}
              </p>
              <ul className={`${styles.points} only-desktop`}>
                {story.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {reviews.length > 0 ? (
          <section className={styles.reviewsSection} aria-labelledby="reviews-heading">
            <div className={`container ${styles.reviews}`}>
              <h2 id="reviews-heading">{home.reviews.heading}</h2>
              <ul>
                {reviews.map((review) => (
                  <li key={review.author}>
                    <blockquote>{review.text[locale]}</blockquote>
                    <p>
                      {review.author} · {review.branch[locale]}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        ) : null}
      </div>
      <StickyBook>
        <Icon name="calendar" size={22} />
        {common.bookNow}
      </StickyBook>
    </PageFrame>
  );
}

/** Portrait crop on phones, the wide photo on desktop. */
function HeroPicture({ locale }: { locale: Locale }) {
  const alt = photos.heroWide.alt[locale];
  const source = ({ src, width, height }: Photo) => ({ src, width, height });
  const { props: wide } = getImageProps({ ...source(photos.heroWide), alt, sizes: "100vw" });
  const { props: portrait } = getImageProps({
    ...source(photos.heroPortrait),
    alt,
    sizes: "100vw",
  });
  return (
    <picture className={styles.heroPhoto}>
      <source media="(max-width: 59.99rem)" srcSet={portrait.srcSet} sizes={portrait.sizes} />
      <img {...wide} alt={alt} loading="eager" fetchPriority="high" />
    </picture>
  );
}

function Divider({ className }: { className: string }) {
  return (
    <Image
      className={`${className} only-desktop`}
      src="/brand/divider-gold-600.webp"
      alt=""
      width={600}
      height={23}
      sizes="220px"
    />
  );
}
