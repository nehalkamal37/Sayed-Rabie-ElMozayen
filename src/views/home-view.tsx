import Image from "next/image";
import Link from "next/link";
import { Fragment, type ReactNode } from "react";
import { BookingLink } from "@/components/booking/booking-provider";
import { PhoneLink } from "@/components/contact";
import { BranchTabs } from "@/components/home/branch-tabs";
import { HomeBookingBar } from "@/components/home/home-booking-bar";
import { HomeSelection } from "@/components/home/home-selection";
import { PromiseRotation } from "@/components/home/promise-rotation";
import { ReelGallery } from "@/components/home/reel-gallery";
import { ServiceMenu } from "@/components/home/service-menu";
import { StoryVideo } from "@/components/home/story-video";
import { Icon } from "@/components/icons";
import { OrganizationJsonLd } from "@/components/json-ld";
import { MotionDirector } from "@/components/motion/motion-director";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getDictionary } from "@/content";
import { media, type Clip } from "@/data/media";
import { localePath, type Locale } from "@/i18n/config";
import { directoryPath, groomPath } from "@/lib/paths";
import styles from "./home.module.css";

/** Heading text with one meaningful word set as the editorial accent. */
function withAccent(text: string, word?: string): ReactNode {
  const at = word ? text.indexOf(word) : -1;
  if (!word || at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <span className="accent-word">{word}</span>
      {text.slice(at + word.length)}
    </>
  );
}

/** A heading whose lines rise from behind their own edges, one after another. */
function MaskedLines({ lines, accent }: { lines: readonly string[]; accent?: string }) {
  return lines.map((line, index) => (
    <Fragment key={line}>
      <span>
        <span style={{ "--line": index } as React.CSSProperties}>{withAccent(line, accent)}</span>
      </span>{" "}
    </Fragment>
  ));
}

/** Splits a heading into two balanced lines for the mask, around its middle space. */
function twoLines(text: string): string[] {
  const words = text.split(" ");
  if (words.length < 3) return [text];
  const middle = Math.ceil(words.length / 2);
  return [words.slice(0, middle).join(" "), words.slice(middle).join(" ")];
}

export function HomeView({ locale }: { locale: Locale }) {
  const { common, home, directory, branch: branchCopy } = getDictionary(locale);
  const { groom, how, story, reels } = home;
  const to = (path: string) => localePath(locale, path);
  const videoLabels = { play: story.playVideo, pause: story.pauseVideo };
  const player = (clip: Clip) => (
    <StoryVideo
      src={clip.src}
      poster={clip.poster}
      position={clip.position}
      label={clip.label[locale]}
      playLabel={story.playVideo}
      pauseLabel={story.pauseVideo}
    />
  );

  // The approved headline: a lead-in, the name, and the answer.
  const [question, answer] = home.headline.split(/(?<=\.\.|\?)\s/);
  const words = answer.split(" ");
  const name = words.slice(0, 2).join(" ");
  const rest = words.slice(2).join(" ");
  const [groomBefore, groomAfter] = groom.heading.split(groom.accent);

  return (
    <HomeSelection first="haircut-beard">
      <OrganizationJsonLd />
      <SiteHeader locale={locale} overlay />

      <main id="content" tabIndex={-1} className={styles.page}>
        {/* 1. Hero: film ground, portrait, and the name set large. */}
        <section className={styles.hero} data-ground="dark" data-own-booking aria-labelledby="hero-heading">
          <div className={styles.heroFilm}>{player(media.heroVideo)}</div>
          <figure className={styles.portrait}>
            <Image
              src={media.ownerPortrait.src}
              width={media.ownerPortrait.width}
              height={media.ownerPortrait.height}
              alt={media.ownerPortrait.alt[locale]}
              sizes="(min-width: 60rem) 30vw, 46vw"
              style={{ objectPosition: media.ownerPortrait.position }}
              preload
            />
          </figure>
          <div className={styles.heroText}>
            <h1 id="hero-heading" className={styles.heroTitle}>
              <span className={styles.question}>{question}</span>{" "}
              <span className={styles.name}>
                {locale === "ar" ? (
                  <>
                    <span className="visually-hidden">{name}</span>
                    <Image
                      className={styles.lettering}
                      src="/brand/lettering-sayed-rabie-brown.webp"
                      alt=""
                      width={1164}
                      height={344}
                      sizes="(min-width: 60rem) 520px, 78vw"
                      preload
                    />
                  </>
                ) : (
                  name
                )}
              </span>{" "}
              <span className={styles.answer}>{rest}</span>
            </h1>
            <p className={styles.lede}>
              {home.place} <span className="only-desktop">{home.ledeShort}</span>
            </p>
            <div className={styles.heroActions}>
              <BookingLink className={styles.primary}>{common.bookNow}</BookingLink>
              <p className={styles.call}>
                {home.orCall} <PhoneLink locale={locale} />
              </p>
              <a className={styles.quiet} href="#branches">
                <Icon name="pin" size={18} strokeWidth={1.6} />
                {common.nav.branches}
              </a>
            </div>
          </div>
          <a className={styles.cue} href="#story" aria-label={story.eyebrow}>
            <span />
          </a>
        </section>

        {/* 2. Story: the statement, the brand film, and the rotating promises. */}
        <section id="story" className={styles.story} aria-labelledby="story-heading">
          <div className={styles.storyHead}>
            <p className="eyebrow">{story.eyebrow}</p>
            <h2 id="story-heading" className={styles.display} data-motion="mask">
              <MaskedLines lines={story.heading} accent={story.accent} />
            </h2>
          </div>
          <div className={styles.storyCopy} data-motion="rise">
            <p className={styles.storyLead}>{story.lead}</p>
            <p>{story.body}</p>
          </div>
          <figure className={styles.film}>
            <div className={styles.filmFrame} data-motion="curtain">
              {player(media.brandStoryVideo)}
            </div>
            <figcaption className={styles.note}>{reels.illustrative}</figcaption>
          </figure>
          <div className={styles.promise} data-motion="rise">
            <PromiseRotation copy={story} progress />
          </div>
        </section>

        {/* 3. Craft interlude: the tools on black, with the services drifting across. */}
        <section className={styles.craft} data-ground="dark" aria-label={home.services.eyebrow}>
          <div className={styles.craftFilm} data-parallax>
            {player(media.craftVideo)}
          </div>
          <div className={styles.marquee} aria-hidden="true">
            <div className={styles.marqueeTrack}>
              {[0, 1].map((copy) => (
                <span key={copy}>
                  {home.craft.map((word) => (
                    <Fragment key={word}>
                      <em>{word}</em>
                      <i>·</i>
                    </Fragment>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 4. Services in action: tab, clip, description and booking move together. */}
        <section id="services" className={styles.services} aria-labelledby="services-heading">
          <div className={styles.sectionHead}>
            <p className="eyebrow">{home.services.eyebrow}</p>
            <h2 id="services-heading" className={styles.display} data-motion="mask">
              <MaskedLines lines={twoLines(home.services.heading)} accent={home.services.accent} />
            </h2>
            <Link className={styles.textLink} href={to("/services")}>
              {home.services.allLong}
            </Link>
          </div>
          <ServiceMenu
            locale={locale}
            copy={home.services}
            bookLabel={common.bookNow}
            clips={media.servicesVideos}
            videoLabels={videoLabels}
          />
        </section>

        {/* 5. Groom: a film across the width, the offer set over its foot. */}
        <section id="groom" className={styles.groom} data-ground="dark" aria-labelledby="groom-heading">
          <div className={styles.groomFilm} data-motion="curtain">
            {player(media.groomExperienceVideo)}
          </div>
          <div className={styles.groomBody}>
            <p className="eyebrow">{common.nav.groom}</p>
            <h2 id="groom-heading" className={styles.groomTitle} data-motion="mask">
              <span>
                <span style={{ "--line": 0 } as React.CSSProperties}>{groomBefore.trim()}</span>
              </span>{" "}
              <span>
                <span style={{ "--line": 1 } as React.CSSProperties} className="accent-word">
                  {groom.accent}
                </span>
              </span>
              {groomAfter?.trim() ? (
                <>
                  {" "}
                  <span>
                    <span style={{ "--line": 2 } as React.CSSProperties}>{groomAfter.trim()}</span>
                  </span>
                </>
              ) : null}
            </h2>
            <p className={styles.groomLede} data-motion="rise">
              {groom.body}
            </p>
            <ol className={styles.inclusions} data-motion="rise" data-stagger>
              {groom.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ol>
            <p className={styles.early}>{groom.early}</p>
            <div className={styles.groomActions}>
              <BookingLink className={styles.primary} preset={{ service: "groom-package" }} data-own-booking>
                {groom.cta}
              </BookingLink>
              <Link className={styles.textLink} href={to(groomPath)}>
                {groom.details}
              </Link>
            </div>
          </div>
          <figure className={styles.groomStill} data-motion="curtain">
            <Image
              src={media.groomStill.src}
              width={media.groomStill.width}
              height={media.groomStill.height}
              alt={media.groomStill.alt[locale]}
              sizes="(min-width: 60rem) 22vw, 40vw"
              style={{ objectPosition: media.groomStill.position }}
            />
          </figure>
        </section>

        {/* 6. Up close: short tall clips, each played on request. */}
        <section className={styles.reels} aria-labelledby="reels-heading">
          <div className={styles.sectionHead}>
            <p className="eyebrow">{reels.eyebrow}</p>
            <h2 id="reels-heading" className={styles.display} data-motion="mask">
              <MaskedLines lines={twoLines(reels.heading)} accent={reels.accent} />
            </h2>
            <p className={styles.sectionLede}>{reels.lede}</p>
            <p className={styles.note}>{reels.illustrative}</p>
          </div>
          <ReelGallery
            locale={locale}
            clips={media.barberingVideos}
            labels={{ ...videoLabels, previous: reels.previous, next: reels.next }}
          />
        </section>

        {/* 7. Branches: the atmosphere, then the tiles, then how a request works. */}
        <section id="branches" className={styles.branches} aria-labelledby="branches-heading">
          <div className={styles.atmosphere} data-parallax>
            {player(media.branchAtmosphere)}
          </div>
          <div className={styles.sectionHead}>
            <p className="eyebrow">{common.nav.branches}</p>
            <h2 id="branches-heading" className={styles.display} data-motion="mask">
              <MaskedLines lines={twoLines(home.branches.heading)} accent={home.branches.accent} />
            </h2>
            <span className="draft-pill">{home.branches.draft}</span>
          </div>
          <BranchTabs
            locale={locale}
            copy={home.branches}
            book={{ label: directory.book, labelFor: branchCopy.bookAt }}
          />
          <Link className={styles.textLink} href={to(directoryPath)}>
            {home.branches.all}
          </Link>
          <div className={styles.how}>
            <h3>{how.headingShort}</h3>
            <ol data-motion="rise" data-stagger>
              {how.steps.map(({ title, body }) => (
                <li key={title}>
                  <span className={styles.stepTitle}>{title}</span>
                  <span>{body}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>
      </main>

      <SiteFooter locale={locale} />
      <HomeBookingBar label={common.bookNow} />
      <MotionDirector />
    </HomeSelection>
  );
}
