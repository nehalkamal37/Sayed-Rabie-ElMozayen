import Image from "next/image";
import Link from "next/link";
import { BookingLink } from "@/components/booking/booking-provider";
import { StickyBook } from "@/components/booking/sticky-book";
import { HoursList } from "@/components/branch/hours-list";
import { CallAction, PhoneLink, WhatsAppAction } from "@/components/contact";
import { Icon } from "@/components/icons";
import { BranchJsonLd } from "@/components/json-ld";
import { PageFrame } from "@/components/page-frame";
import { ForwardArrow } from "@/components/responsive-text";
import { getDictionary } from "@/content";
import {
  bookingBranchName,
  branchesInRegion,
  branchPath,
  type Branch,
  type BranchDetail,
} from "@/data/branches";
import { getService, topServiceIds } from "@/data/services";
import type { Verifiable } from "@/data/verification";
import { localePath, type Localized, type Locale } from "@/i18n/config";
import { fill } from "@/lib/text";
import styles from "./branch-view.module.css";

interface Props {
  readonly locale: Locale;
  readonly branch: Branch;
  readonly detail: BranchDetail;
}

/** Reusable branch page. All branch facts come from the single record in src/data/branches.ts. */
export function BranchView({ locale, branch, detail }: Props) {
  const { common, branch: copy, services: serviceCopy } = getDictionary(locale);
  const name = branch.name[locale];
  const preset = { branch: branch.id };
  const bookLabel = fill(copy.bookAt, { branch: name });
  const nearby = branchesInRegion(branch.region).filter((other) => other.id !== branch.id);

  const fact = (value: Verifiable<Localized>) =>
    value.status === "verified" ? (
      <dd>{value.value[locale]}</dd>
    ) : (
      <dd className={styles.empty}>{copy.factPending}</dd>
    );

  return (
    <PageFrame locale={locale} footer="branch">
      <BranchJsonLd locale={locale} branch={branch} detail={detail} />

      <section className="on-dark">
        <div className={styles.hero}>
          <figure className={styles.cover}>
            <Image
              src={detail.cover.photo.src}
              width={detail.cover.photo.width}
              height={detail.cover.photo.height}
              alt={detail.cover.alt[locale]}
              sizes="(min-width: 60rem) 541px, 100vw"
              style={{ objectPosition: detail.cover.position }}
              loading="eager"
              fetchPriority="high"
            />
            <figcaption>{common.previewPhoto}</figcaption>
          </figure>
          <div className={styles.heroText}>
            <nav className={styles.crumbs} aria-label={common.breadcrumb}>
              <Link href={localePath(locale, "/#branches")}>{copy.branches}</Link>{" "}
              <span aria-hidden="true">{locale === "ar" ? "‹" : "›"}</span>{" "}
              <span aria-current="page">{name}</span>
            </nav>
            <h1>{detail.heading[locale]}</h1>
            <p className={styles.intro}>{detail.intro[locale]}</p>
            {branch.hours.status === "verified" ? null : (
              <p className={styles.status}>{copy.hoursPendingStatus}</p>
            )}
            <div className={`${styles.tiles} only-mobile`}>
              <a className={styles.tile} href="#map">
                <Icon name="pin" size={22} strokeWidth={1.8} />
                {copy.directions}
              </a>
              <CallAction className={styles.tile} pendingLabel={common.unavailable}>
                <Icon name="phone" size={22} strokeWidth={1.8} />
                {common.call}
              </CallAction>
              <WhatsAppAction className={styles.tile} pendingLabel={common.unavailable}>
                <Icon name="chat" size={22} strokeWidth={1.8} />
                {common.whatsapp}
              </WhatsAppAction>
            </div>
            <div className={`${styles.heroActions} only-desktop`}>
              <BookingLink className={styles.primary} preset={preset}>
                {bookLabel}
              </BookingLink>
              <a className={styles.secondary} href="#map">
                {copy.directions}
              </a>
              <WhatsAppAction className={styles.secondary} pendingLabel={common.unavailable}>
                {common.whatsapp}
              </WhatsAppAction>
            </div>
          </div>
        </div>
      </section>

      <div className={`container ${styles.visit}`}>
        <section id="map" className={styles.where} aria-labelledby="where-heading">
          <h2 id="where-heading">{copy.where}</h2>
          <div className={styles.card}>
            {/* Replace with an embedded map once the location is verified. */}
            <div className={styles.map} role="img" aria-label={copy.mapPending}>
              <span className={styles.roads} />
              <span className={styles.blockA} />
              <span className={styles.blockB} />
              <span className={styles.marker} />
              <span className={styles.mapLabel}>{copy.mapPending}</span>
            </div>
            <div className={styles.facts}>
              <dl>
                <dt>{copy.address}</dt>
                {branch.address.status === "verified" ? (
                  <dd className={styles.address}>{branch.address.value[locale]}</dd>
                ) : (
                  <dd className={styles.address}>
                    {branch.area ? (
                      <span className={styles.draftValue}>{branch.area[locale]}</span>
                    ) : null}{" "}
                    <span className={styles.draftNote}>{copy.addressPending}</span>
                  </dd>
                )}
                <dt>{copy.landmark}</dt>
                {fact(branch.landmark)}
                <dt>{copy.parking}</dt>
                {fact(branch.parking)}
              </dl>
              {branch.directionsUrl.status === "verified" ? (
                <a
                  className={styles.mapButton}
                  href={branch.directionsUrl.value}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {copy.openMap}
                </a>
              ) : (
                <span
                  className={styles.mapButton}
                  role="link"
                  aria-disabled="true"
                  title={copy.factPending}
                >
                  {copy.openMap}
                  <span className="visually-hidden">({copy.factPending})</span>
                </span>
              )}
            </div>
          </div>
        </section>

        <section className={styles.hours} aria-labelledby="hours-heading">
          <div className={styles.titleRow}>
            <h2 id="hours-heading">{copy.hours}</h2>
            {branch.hours.status === "verified" ? null : (
              <span className="draft-pill">{common.draft}</span>
            )}
          </div>
          <HoursList locale={locale} hours={branch.hours} pendingLabel={common.toBeConfirmed} />
          <p className={`${styles.hoursPhone} only-desktop`}>
            {common.footer.bookingLine} <PhoneLink locale={locale} /> {copy.sharedLine}
          </p>
        </section>
      </div>

      <section className={`container ${styles.services}`} aria-labelledby="services-heading">
        <div className={styles.servicesHead}>
          <h2 id="services-heading">{fill(copy.services, { branch: name })}</h2>
          <Link
            className={`${styles.allServices} only-desktop`}
            href={localePath(locale, "/services")}
          >
            {copy.allServices}
            <ForwardArrow locale={locale} />
          </Link>
        </div>
        <p className={`${styles.servicesNote} only-mobile`}>{copy.servicesNote}</p>
        <ul className={styles.serviceList}>
          {topServiceIds.map((id) => {
            const service = getService(id);
            const value = (item: Verifiable<number>, unit: string) =>
              item.status === "verified" ? `${item.value} ${unit}` : "—";
            return (
              <li key={id}>
                <span className={styles.serviceText}>
                  <h3>{service.name[locale]}</h3>
                  <span className={styles.serviceFacts}>
                    {copy.duration} {value(service.minutes, serviceCopy.minutesUnit)} · {copy.price}{" "}
                    {value(service.price, serviceCopy.priceUnit)}
                  </span>
                </span>
                <BookingLink className={styles.serviceBook} preset={{ ...preset, service: id }}>
                  {copy.book} <span className="visually-hidden">{service.name[locale]}</span>
                </BookingLink>
              </li>
            );
          })}
        </ul>
        <Link className={`${styles.allServices} only-mobile`} href={localePath(locale, "/services")}>
          {copy.allServices}
          <ForwardArrow locale={locale} />
        </Link>
      </section>

      <section className={styles.photos} aria-labelledby="photos-heading">
        <div className={styles.titleRow}>
          <h2 id="photos-heading">{copy.photos}</h2>
          <span className="draft-pill">{copy.photosBadge}</span>
        </div>
        <ul className={styles.strip} tabIndex={0} aria-labelledby="photos-heading">
          {detail.gallery.map(({ photo, alt, position }, index) => (
            <li key={photo.src}>
              <Image
                src={photo.src}
                width={photo.width}
                height={photo.height}
                alt={alt[locale]}
                sizes={index === 0 ? "(min-width: 60rem) 574px, 72vw" : "(min-width: 60rem) 400px, 80vw"}
                style={{ objectPosition: position }}
              />
            </li>
          ))}
        </ul>
      </section>

      <div className={styles.questionsBand}>
        <div className={`container ${styles.questions}`}>
          <section className={styles.faq} aria-labelledby="faq-heading">
            <h2 id="faq-heading">{fill(copy.questions, { branch: name })}</h2>
            {detail.questions.map(({ question, answer }) => (
              <details key={question.en}>
                <summary>
                  <h3>{question[locale]}</h3>
                  <Icon name="chevronDown" size={18} className={styles.chevron} />
                </summary>
                {answer.status === "verified" ? (
                  <p>{answer.value[locale]}</p>
                ) : (
                  <p className={styles.answerPending}>{copy.answerPending}</p>
                )}
              </details>
            ))}
          </section>
          <section className={styles.nearby} aria-labelledby="nearby-heading">
            <h2 id="nearby-heading">{copy.nearby}</h2>
            <ul>
              {nearby.map((other) => {
                const label = bookingBranchName(other)[locale];
                return (
                  <li key={other.id}>
                    {other.detail ? (
                      <Link href={localePath(locale, branchPath(other.id))}>{label}</Link>
                    ) : (
                      <BookingLink preset={{ branch: other.id }}>
                        {label} <span className="visually-hidden">{copy.bookHere}</span>
                      </BookingLink>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        </div>
      </div>

      <StickyBook preset={preset}>{bookLabel}</StickyBook>
    </PageFrame>
  );
}
