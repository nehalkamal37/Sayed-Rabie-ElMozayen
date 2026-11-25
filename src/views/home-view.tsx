import Image from "next/image";
import Link from "next/link";
import { BookingLink } from "@/components/booking/booking-provider";
import { PhoneLink } from "@/components/contact";
import { BranchTabs } from "@/components/home/branch-tabs";
import { HomeBookingBar } from "@/components/home/home-booking-bar";
import { HomeHeader } from "@/components/home/home-header";
import { PromiseRotation } from "@/components/home/promise-rotation";
import { HomeSelection } from "@/components/home/home-selection";
import { Sequence, type Step } from "@/components/home/reveal";
import { ServiceMenu } from "@/components/home/service-menu";
import { OrganizationJsonLd } from "@/components/json-ld";
import { LanguageSwitch } from "@/components/language-switch";
import { getDictionary } from "@/content";
import { branchPath, getBranch } from "@/data/branches";
import { photos } from "@/data/photos";
import { brandName, reviews, socialProfiles } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { directoryPath, groomPath, privacyPath } from "@/lib/paths";
import styles from "./home-view.module.css";

/** Area links to branch pages that are ready; drafts join as they are approved. */
const footerAreas = (["mohandessin", "sheikh-zayed", "madinaty", "midtown"] as const).filter(
  (id) => !getBranch(id).draft,
);

const step = (waitsFor: Step, order = 0) => ({ "data-step": waitsFor, "data-order": order });

export function HomeView({ locale }: { locale: Locale }) {
  const { common, home } = getDictionary(locale);
  const { groom, how, story } = home;
  const to = (path: string) => localePath(locale, path);
  // The approved headline, set as a lead-in and a two-line answer around the photo.
  const [question, answer] = home.headline.split(/(?<=\.\.|\?)\s/);
  const words = answer.split(" ");
  const groomWords = groom.heading.split(" ");

  return (
    <HomeSelection first="haircut-beard">
      <div className={styles.page}>
        <OrganizationJsonLd />
        <HomeHeader locale={locale} common={common} />

        <main id="content" tabIndex={-1}>
          <section className={styles.hero} data-own-booking>
            <h1 className={styles.headline}>
              <span className={styles.question}>{question}</span>{" "}
              <span className={styles.lineOne}>{words.slice(0, 2).join(" ")}</span>{" "}
              <span className={styles.lineTwo}>{words.slice(2).join(" ")}</span>
            </h1>
            <div className={styles.heroPhoto}>
              <Image
                src={photos.barberAtWork.src}
                width={photos.barberAtWork.width}
                height={photos.barberAtWork.height}
                alt={photos.barberAtWork.alt[locale]}
                sizes="(min-width: 60rem) 50vw, 100vw"
                preload
              />
            </div>
            <div className={styles.heroAction}>
              <p className={styles.lede}>
                {home.place} <span className="only-desktop">{home.ledeShort}</span>
              </p>
              <BookingLink className={styles.heroBook}>{common.bookNow}</BookingLink>
              <p className={styles.call}>
                {home.orCall} <PhoneLink locale={locale} />
              </p>
            </div>
          </section>

          <section id="story" className={styles.story} aria-labelledby="story-heading">
            <div>
              <p className={styles.storyLead}>{story.lead}</p>
              <h2 id="story-heading">{story.heading}</h2>
              <p className={styles.storyBody}>{story.body}</p>
            </div>
            <PromiseRotation copy={story} />
          </section>

          <section id="services" className={styles.services} aria-labelledby="services-heading">
            <div className={styles.servicesHead}>
              <h2 id="services-heading">{home.services.heading}</h2>
              <Link className={styles.textLink} href={to("/services")}>
                {home.services.allLong}
              </Link>
            </div>
            <ServiceMenu locale={locale} copy={home.services} bookLabel={common.bookNow} />
          </section>

          <section id="groom" aria-labelledby="groom-heading">
            <Sequence className={styles.groom}>
              <h2 id="groom-heading" className={styles.groomTitle} {...step("after-previous", 1)}>
                <span>{groomWords.slice(0, -1).join(" ")}</span> <span>{groomWords.at(-1)}</span>
              </h2>
              <div className={styles.groomPhoto} {...step("part")}>
                <Image
                  src={photos.groomChair.src}
                  width={photos.groomChair.width}
                  height={photos.groomChair.height}
                  alt={photos.groomChair.alt[locale]}
                  sizes="100vw"
                />
              </div>
              <div className={styles.groomText}>
                <p className={styles.groomBody} {...step("most", 2)}>{groom.body}</p>
                <ul className={styles.groomList} {...step("most", 2)}>
                  {groom.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <p className={styles.early} {...step("most", 2)}>{groom.early}</p>
                <div className={styles.groomActions} {...step("most", 2)}>
                  <BookingLink className={styles.groomBook} preset={{ service: "groom-package" }}>
                    {groom.cta}
                  </BookingLink>
                  <Link className={styles.textLink} href={to(groomPath)}>
                    {groom.details}
                  </Link>
                </div>
              </div>
            </Sequence>
          </section>

          <section id="branches" className={styles.branches} aria-labelledby="branches-heading">
            <div className={styles.branchesHead}>
              <h2 id="branches-heading">{home.branches.heading}</h2>
              <span className="draft-pill">{home.branches.draft}</span>
            </div>
            <BranchTabs locale={locale} copy={home.branches} />
            <Link className={styles.textLink} href={to(directoryPath)}>
              {home.branches.all}
            </Link>
          </section>

          {reviews.length > 0 ? (
            <section className={styles.reviews} aria-labelledby="reviews-heading">
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
            </section>
          ) : null}

          <section className={styles.closing} aria-labelledby="closing-heading" data-own-booking>
            <div className={styles.closingText}>
              <h2 id="closing-heading">{how.heading}</h2>
              <ol className={styles.steps}>
                {how.steps.map(({ title, body }) => (
                  <li key={title}>
                    <span className={styles.stepTitle}>{title}</span>
                    <span>{body}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className={styles.closingPhoto}>
              <Image
                src={photos.readyChair.src}
                width={photos.readyChair.width}
                height={photos.readyChair.height}
                alt={photos.readyChair.alt[locale]}
                sizes="(min-width: 60rem) 45vw, 100vw"
              />
            </div>
            <BookingLink className={styles.closingBook}>{common.bookNow}</BookingLink>
          </section>
        </main>

        <footer className={styles.footer} data-own-booking>
          <Image
            className={styles.footerLogo}
            src="/brand/logo-white.webp"
            alt={brandName[locale]}
            width={720}
            height={251}
            sizes="200px"
          />
          <nav className={styles.footerNav} aria-label={common.footer.nav}>
            <Link href={to("/services")}>{common.footer.services}</Link>
            <Link href={to("/services#kids")}>{common.footer.kids}</Link>
            <Link href={to(groomPath)}>{common.nav.groom}</Link>
            <Link href={to(directoryPath)}>{common.nav.branches}</Link>
            {footerAreas.map((id) => (
              <Link key={id} href={to(branchPath(id))}>
                {common.footer.areas[id]}
              </Link>
            ))}
            <Link href={to("/services#before")}>{common.footer.faq}</Link>
            <Link href={to(privacyPath)}>{common.footer.privacy}</Link>
            <LanguageSwitch
              locale={locale}
              label={common.switchLanguage}
              accessibleLabel={common.switchLanguageLabel}
            />
          </nav>
          <p className={styles.footerPhone}>
            {common.footer.bookingLine} <PhoneLink locale={locale} />
          </p>
          <p className={styles.footerNav}>
            {socialProfiles.map(({ name, url }) => (
              <a key={url} href={url} target="_blank" rel="noopener noreferrer">
                {name[locale]}
              </a>
            ))}
          </p>
          <p className={styles.copyright}>{common.footer.copyright}</p>
        </footer>

        <HomeBookingBar label={common.bookNow} />
      </div>
    </HomeSelection>
  );
}
