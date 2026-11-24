import Image from "next/image";
import Link from "next/link";
import { StickyBook } from "@/components/booking/sticky-book";
import { ServicesJsonLd } from "@/components/json-ld";
import { PageFrame } from "@/components/page-frame";
import { ForwardArrow, ResponsiveText } from "@/components/responsive-text";
import { BeforeList } from "@/components/services/before-list";
import {
  BranchChoiceProvider,
  BranchChoiceSelect,
  ServiceBookLink,
} from "@/components/services/branch-choice";
import { getDictionary } from "@/content";
import { getBranch } from "@/data/branches";
import { photos } from "@/data/photos";
import { serviceGroups, servicesInGroup, type Service, type ServiceGroup } from "@/data/services";
import type { Verifiable } from "@/data/verification";
import { localePath, type Locale } from "@/i18n/config";
import styles from "./services-view.module.css";

export function ServicesView({ locale }: { locale: Locale }) {
  const { services: copy, common } = getDictionary(locale);

  return (
    <PageFrame locale={locale}>
      <ServicesJsonLd locale={locale} name={copy.heading} />
      <BranchChoiceProvider>
        <section className="on-dark">
          <div className={styles.hero}>
            <div className={styles.heroText}>
              <nav className={styles.crumbs} aria-label={common.breadcrumb}>
                <Link href={localePath(locale, "/")}>{common.nav.home}</Link>{" "}
                <span aria-hidden="true">{locale === "ar" ? "‹" : "›"}</span>{" "}
                <span aria-current="page">{common.nav.services}</span>
              </nav>
              <h1>{copy.heading}</h1>
              <p className={styles.lede}>{copy.lede}</p>
            </div>
            <div className={styles.heroSide}>
              <div className="only-desktop">
                <BranchChoiceSelect
                  locale={locale}
                  copy={copy}
                  label={copy.filter}
                  className={styles.heroFilter}
                  statusClassName={styles.heroStatus}
                />
              </div>
              <p className={styles.draft}>{copy.draft}</p>
            </div>
          </div>
        </section>

        <div className={`${styles.bar} only-mobile`}>
          <nav className={styles.chips} aria-label={copy.groupsNav}>
            {serviceGroups.map((group) => (
              <a key={group.id} href={`#${group.id}`}>
                {group.name[locale]}
              </a>
            ))}
          </nav>
          <BranchChoiceSelect
            locale={locale}
            copy={copy}
            label={copy.filterShort}
            className={styles.barFilter}
            statusClassName={styles.barStatus}
          />
        </div>

        <div className={`container ${styles.layout}`}>
          <aside className={`${styles.aside} only-desktop`}>
            <nav className={styles.sideNav} aria-label={copy.groupsNav}>
              {serviceGroups.map((group) => (
                <a key={group.id} href={`#${group.id}`}>
                  <span>{group.name[locale]}</span>
                  <span className={styles.count}>{servicesInGroup(group.id).length}</span>
                </a>
              ))}
            </nav>
            <div className={`${styles.groomCard} on-dark`}>
              <Image
                src={photos.groom.src}
                width={photos.groom.width}
                height={photos.groom.height}
                alt={copy.groomCard.photoAlt}
                sizes="250px"
              />
              <div>
                <span className={styles.groomTitle}>{common.nav.groom}</span>
                <span className={styles.groomBody}>{copy.groomCard.body}</span>
                <a href="#groom">
                  {copy.groomCard.cta}
                  <ForwardArrow locale={locale} />
                </a>
              </div>
            </div>
          </aside>
          <div className={styles.groups}>
            {serviceGroups.map((group) => (
              <Group key={group.id} locale={locale} group={group} />
            ))}
          </div>
        </div>
      </BranchChoiceProvider>

      <section id="before" className={styles.before} aria-labelledby="before-heading">
        <div className={`container ${styles.beforeInner}`}>
          <h2 id="before-heading">{copy.before.heading}</h2>
          <BeforeList items={copy.before.items} />
        </div>
      </section>
      <StickyBook>{common.bookNow}</StickyBook>
    </PageFrame>
  );
}

function Group({ locale, group }: { locale: Locale; group: ServiceGroup }) {
  const { services: copy } = getDictionary(locale);
  const headingId = `${group.id}-heading`;
  return (
    <section id={group.id} className={styles.group} aria-labelledby={headingId}>
      <div className={styles.groupHead}>
        <Image
          src={group.photo.src}
          width={group.photo.width}
          height={group.photo.height}
          alt=""
          sizes="80px"
          style={{ objectPosition: group.photoPosition }}
        />
        <h2 id={headingId}>{group.name[locale]}</h2>
      </div>
      <div className={styles.card}>
        <div role="table" aria-labelledby={headingId}>
          <div role="row" className={`${styles.row} ${styles.headRow}`}>
            <span role="columnheader">{copy.columns.service}</span>
            <span role="columnheader">{copy.columns.duration}</span>
            <span role="columnheader">{copy.columns.price}</span>
            <span role="columnheader" className={`${styles.available} only-desktop`}>
              {copy.columns.available}
            </span>
            <span role="columnheader">
              <span className="visually-hidden">{copy.columns.book}</span>
            </span>
          </div>
          {servicesInGroup(group.id).map((service) => (
            <Row key={service.id} locale={locale} service={service} />
          ))}
        </div>
        <p className={`${styles.units} only-mobile`}>{copy.unitsNote}</p>
      </div>
    </section>
  );
}

function Row({ locale, service }: { locale: Locale; service: Service }) {
  const { services: copy, common } = getDictionary(locale);
  const name = service.name[locale];
  const { availableAt } = service;

  const amount = (value: Verifiable<number>, unit: string) => (
    <span role="cell" className={styles.amount}>
      {value.status === "verified" ? (
        <>
          {value.value} <span className="only-desktop">{unit}</span>
        </>
      ) : (
        <span className={styles.empty}>
          <span aria-hidden="true">
            — <span className="only-desktop">{unit}</span>
          </span>
          <span className="visually-hidden">{common.toBeConfirmed}</span>
        </span>
      )}
    </span>
  );

  return (
    <div role="row" className={`${styles.row} ${styles.bodyRow}`}>
      <div role="rowheader" className={styles.service}>
        <span className={styles.nameLine}>
          <h3>{name}</h3>
          {service.popular ? <span className={styles.tag}>{copy.popular}</span> : null}
        </span>
        <span className={styles.description}>
          <ResponsiveText
            long={service.description[locale]}
            short={service.shortDescription?.[locale]}
          />
        </span>
      </div>
      {amount(service.minutes, copy.minutesUnit)}
      {amount(service.price, copy.priceUnit)}
      <span role="cell" className={`${styles.available} only-desktop`}>
        {availableAt.status === "verified" ? (
          availableAt.value.map((id) => getBranch(id).name[locale]).join(" · ")
        ) : (
          <span className={styles.empty}>{copy.availabilityPending}</span>
        )}
      </span>
      <span role="cell" className={styles.bookCell}>
        <ServiceBookLink service={service.id} className={styles.book}>
          {copy.book} <span className="visually-hidden">{name}</span>
        </ServiceBookLink>
      </span>
    </div>
  );
}
