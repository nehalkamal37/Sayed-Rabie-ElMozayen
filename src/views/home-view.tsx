import { existsSync } from "node:fs";
import { join } from "node:path";
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
import { StoryVideo } from "@/components/home/story-video";
import { ServiceMenu } from "@/components/home/service-menu";
import { Icon } from "@/components/icons";
import { OrganizationJsonLd } from "@/components/json-ld";
import { LanguageSwitch } from "@/components/language-switch";
import { getDictionary } from "@/content";
import { branchPath, getBranch } from "@/data/branches";
import { photos } from "@/data/photos";
import { stockClips } from "@/data/stock-clips";
import { brandName, reviews, socialProfiles } from "@/data/site";
import { localePath, type Locale } from "@/i18n/config";
import { directoryPath, groomPath, privacyPath } from "@/lib/paths";
import styles from "./home-view.module.css";
import rev from "./home-revision.module.css";

/** Area links to branch pages that are ready; drafts join as they are approved. */
const footerAreas = (["mohandessin", "sheikh-zayed", "madinaty", "midtown"] as const).filter(
  (id) => !getBranch(id).draft,
);

/** Clean heading text with one word drawn in the signature script. */
function withAccent(text: string, word: string | undefined, className: string) {
  const at = word ? text.indexOf(word) : -1;
  if (!word || at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className={className}>{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

/**
 * The Story film, from the approved original of reel DetHllrus5T. Until the file is in
 * public/videos, the section shows a still instead.
 */
const storyVideo = "/videos/story.mp4";
const hasStoryVideo = existsSync(join(process.cwd(), "public", storyVideo));


const step = (waitsFor: Step, order = 0) => ({ "data-step": waitsFor, "data-order": order });

interface Props {
  readonly locale: Locale;
  /** Sets the name in the logo's lettering. Arabic only. */
  readonly lettering?: boolean;
  /** The revised homepage, shown beside the current one for comparison. */
  readonly revision?: boolean;
  /** Typography under comparison in the revision. */
  readonly typography?: "signature";
}

export function HomeView({ locale, lettering = false, revision = false, typography }: Props) {
  const { directory, branch: branchCopy } = getDictionary(locale);
  const { common, home } = getDictionary(locale);
  const { groom, how, story } = home;
  const to = (path: string) => localePath(locale, path);
  // The approved headline, set as a lead-in and a two-line answer around the photo.
  const [question, answer] = home.headline.split(/(?<=\.\.|\?)\s/);
  const words = answer.split(" ");
  const groomWords = groom.heading.split(" ");
  const signed = typography === "signature";
  const accent = (text: string, word?: string) => (signed ? withAccent(text, word, rev.accent) : text);

  return (
    <HomeSelection first="haircut-beard">
      <div className={styles.page} data-type={typography}>
        <OrganizationJsonLd />
        <HomeHeader locale={locale} common={common} mark={lettering} />

        <main id="content" tabIndex={-1}>
          <section
            className={styles.hero}
            data-revision={revision || undefined}
            data-lettering={lettering || undefined}
            data-own-booking
          >
            <h1 className={styles.headline}>
              {revision && typography !== "signature" ? (
                <Image
                  className={styles.flourish}
                  src="/brand/divider-gold-600.webp"
                  alt=""
                  width={600}
                  height={23}
                  sizes="240px"
                  loading="eager"
                />
              ) : null}
              <span className={styles.question}>{question}</span>{" "}
              {lettering ? (
                <span className={styles.lettering}>
                  <span className="visually-hidden">{words.slice(0, 2).join(" ")}</span>
                  <Image
                    src="/brand/lettering-sayed-rabie-brown.webp"
                    alt=""
                    width={1164}
                    height={344}
                    sizes="(min-width: 60rem) 560px, 84vw"
                    loading="eager"
                    fetchPriority="high"
                  />
                </span>
              ) : (
                <span className={styles.lineOne}>
                  {typography === "signature" && locale === "ar" ? (
                    <>
                      <span className="visually-hidden">{words.slice(0, 2).join(" ")}</span>
                      <Image
                        className={styles.signatureArt}
                        src="/brand/lettering-sayed-rabie-brown.webp"
                        alt=""
                        width={1164}
                        height={344}
                        sizes="(min-width: 60rem) 420px, 72vw"
                        loading="eager"
                        fetchPriority="high"
                      />
                    </>
                  ) : (
                    words.slice(0, 2).join(" ")
                  )}
                </span>
              )}{" "}
              <span className={styles.lineTwo}>
                {words.slice(2).join(" ")}
              </span>
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
              <div className={styles.heroLinks}>
                <p className={styles.call}>
                  {home.orCall} <PhoneLink locale={locale} />
                </p>
                <a className={styles.heroBranches} href="#branches">
                  <Icon name="pin" size={20} strokeWidth={1.8} />
                  {common.nav.branches}
                </a>
              </div>
            </div>
          </section>

          {revision ? (
            <section id="story" className={rev.story} aria-labelledby="story-heading">
              <div className={rev.storyText}>
                <p className={rev.label}>{story.eyebrow}</p>
                <h2 id="story-heading">
                  {story.heading.map((line) => (
                    <span key={line}>{accent(line, story.accent)} </span>
                  ))}
                </h2>
                <p className={rev.storyLead}>{story.lead}</p>
                <p className={rev.storyBody}>{story.body}</p>
              </div>
              <div className={rev.storyFrame}>
                <div className={rev.storyPhoto}>
                  {signed && !hasStoryVideo ? (
                    <StoryVideo
                      src={stockClips.story.src}
                      poster={stockClips.story.poster}
                      position={stockClips.story.position}
                      label={stockClips.story.label[locale]}
                      playLabel={story.playVideo}
                      pauseLabel={story.pauseVideo}
                    />
                  ) : hasStoryVideo ? (
                    <StoryVideo
                      src={storyVideo}
                      poster={photos.leatherChairs.src}
                      label={story.video}
                      playLabel={story.playVideo}
                      pauseLabel={story.pauseVideo}
                    />
                  ) : (
                    <Image
                      src={photos.leatherChairs.src}
                      width={photos.leatherChairs.width}
                      height={photos.leatherChairs.height}
                      alt={photos.leatherChairs.alt[locale]}
                      sizes="(min-width: 60rem) 40vw, 85vw"
                    />
                  )}
                </div>
                <div className={rev.promise}>
                  <PromiseRotation copy={story} progress />
                </div>
              </div>
            </section>
          ) : (
            <section id="story" className={styles.story} aria-labelledby="story-heading">
              <div>
                <p className={styles.storyLead}>{story.lead}</p>
                <h2 id="story-heading">
                  {story.heading.map((line) => (
                    <span key={line}>{line} </span>
                  ))}
                </h2>
                <p className={styles.storyBody}>{story.body}</p>
                {lettering ? null : (
                  <Image
                    className={styles.signature}
                    src="/brand/logo-brown.webp"
                    alt=""
                    width={720}
                    height={251}
                    sizes="140px"
                  />
                )}
              </div>
              <PromiseRotation copy={story} />
            </section>
          )}

          <section id="services" className={styles.services} aria-labelledby="services-heading">
            <div className={styles.servicesHead}>
              <h2 id="services-heading">{accent(home.services.heading, home.services.accent)}</h2>
              <Link className={styles.textLink} href={to("/services")}>
                {home.services.allLong}
              </Link>
            </div>
            <ServiceMenu
              locale={locale}
              copy={home.services}
              bookLabel={common.bookNow}
              clips={signed ? [stockClips.cutBeard, stockClips.hairColour, stockClips.skinCare] : undefined}
              videoLabels={{ play: story.playVideo, pause: story.pauseVideo }}
            />
          </section>

          {revision ? (
            <section id="groom" aria-labelledby="groom-heading">
              <Sequence className={rev.groom}>
                <div className={rev.groomPhotos}>
                  <div className={rev.groomMain} {...step("part")}>
                    {signed ? (
                      <StoryVideo
                        src={stockClips.groom.src}
                        poster={stockClips.groom.poster}
                        position={stockClips.groom.position}
                        label={stockClips.groom.label[locale]}
                        playLabel={story.playVideo}
                        pauseLabel={story.pauseVideo}
                      />
                    ) : (
                      <Image
                        src={photos.groomChair.src}
                        width={photos.groomChair.width}
                        height={photos.groomChair.height}
                        alt={photos.groomChair.alt[locale]}
                        sizes="(min-width: 60rem) 34vw, 88vw"
                      />
                    )}
                  </div>
                  <div className={rev.groomInset} {...step("after-previous")}>
                    <Image
                      src={photos.groomStyling.src}
                      width={photos.groomStyling.width}
                      height={photos.groomStyling.height}
                      alt={photos.groomStyling.alt[locale]}
                      sizes="(min-width: 60rem) 16vw, 42vw"
                    />
                  </div>
                </div>
                <div className={rev.groomText}>
                  <h2 id="groom-heading" className={rev.groomTitle} {...step("after-previous", 1)}>
                    {typography === "signature" ? (
                      <>
                        {groom.heading.split(groom.accent)[0].trim()}{" "}
                        <span className={rev.groomAccent}>{groom.accent}</span>{" "}
                        {groom.heading.split(groom.accent)[1]?.trim()}
                      </>
                    ) : (
                      groom.heading
                    )}
                  </h2>
                  <p className={rev.groomBody} {...step("most", 2)}>{groom.body}</p>
                  <ol className={rev.inclusions} {...step("part", 2)}>
                    {groom.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                  <p className={rev.early} {...step("most", 2)}>{groom.early}</p>
                  <div className={rev.groomActions} {...step("part", 2)}>
                    <BookingLink className={rev.groomBook} preset={{ service: "groom-package" }} data-own-booking>
                      {groom.cta}
                    </BookingLink>
                    <Link className={rev.groomLink} href={to(groomPath)}>
                      {groom.details}
                    </Link>
                  </div>
                </div>
              </Sequence>
            </section>
          ) : (
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
          )}

          <section id="branches" className={styles.branches} aria-labelledby="branches-heading">
            <div className={styles.branchesHead}>
              <h2 id="branches-heading">{accent(home.branches.heading, home.branches.accent)}</h2>
              <span className="draft-pill">{home.branches.draft}</span>
            </div>
            <BranchTabs
              locale={locale}
              copy={home.branches}
              book={revision ? { label: directory.book, labelFor: branchCopy.bookAt } : undefined}
            />
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
              {signed ? (
                <div className={rev.closingClip}>
                  <StoryVideo
                    src={stockClips.closing.src}
                    poster={stockClips.closing.poster}
                    position={stockClips.closing.position}
                    label={stockClips.closing.label[locale]}
                    playLabel={story.playVideo}
                    pauseLabel={story.pauseVideo}
                  />
                </div>
              ) : (
                <Image
                  src={photos.readyChair.src}
                  width={photos.readyChair.width}
                  height={photos.readyChair.height}
                  alt={photos.readyChair.alt[locale]}
                  sizes="(min-width: 60rem) 45vw, 100vw"
                />
              )}
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
