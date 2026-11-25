"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Dictionary } from "@/content";
import { photos, type Photo } from "@/data/photos";
import { getService, services, type ServiceGroupId, type ServiceId } from "@/data/services";
import type { Locale } from "@/i18n/config";
import { BookingLink } from "../booking/booking-provider";
import styles from "./service-menu.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["home"]["services"];
  readonly bookLabel: string;
}

interface View {
  readonly group: ServiceGroupId;
  readonly book: ServiceId;
  readonly photo: Photo;
  readonly position: string;
}

/** In the copy's order. */
const views: readonly View[] = [
  { group: "cut-beard", book: "haircut-beard", photo: photos.beardChair, position: "60% 50%" },
  { group: "hair-care", book: "hair-protein", photo: photos.flatIron, position: "58% 50%" },
  { group: "skin-care", book: "facial-cleansing", photo: photos.clayMask, position: "50% 40%" },
];

/** A visual menu: one choice changes the photo, the description and the booking action. */
export function ServiceMenu({ locale, copy, bookLabel }: Props) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent, index: number) {
    const count = views.length;
    const [forward, back] = locale === "ar" ? ["ArrowLeft", "ArrowRight"] : ["ArrowRight", "ArrowLeft"];
    const target = {
      ArrowDown: (index + 1) % count,
      [forward]: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      [back]: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    setActive(target);
    tabs.current[target]?.focus();
  }

  return (
    <div className={styles.menu}>
      <div
        className={styles.tabs}
        role="tablist"
        aria-label={copy.choose}
        style={{ "--i": active } as CSSProperties}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {copy.items.map((item, index) => (
          <button
            key={item.title}
            ref={(element) => {
              tabs.current[index] = element;
            }}
            type="button"
            role="tab"
            id={`service-tab-${index}`}
            aria-selected={index === active}
            aria-controls={`service-panel-${index}`}
            tabIndex={index === active ? 0 : -1}
            className={styles.tab}
            onClick={() => setActive(index)}
            onKeyDown={(event) => move(event, index)}
          >
            <span className={styles.thumb}>
              <Image
                src={views[index].photo.src}
                width={views[index].photo.width}
                height={views[index].photo.height}
                alt=""
                sizes="130px"
                style={{ objectPosition: views[index].position }}
              />
            </span>
            <span className={styles.tabTitle}>{item.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.stage}>
        {views.map(({ photo, position }, index) => (
          <Image
            key={photo.src}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt[locale]}
            aria-hidden={index === active ? undefined : true}
            sizes="(min-width: 60rem) 58vw, 100vw"
            data-active={index === active}
            style={{ objectPosition: position }}
          />
        ))}
      </div>

      <div className={styles.card}>
        {views.map(({ group, book }, index) => (
          <div
            key={group}
            id={`service-panel-${index}`}
            role="tabpanel"
            aria-labelledby={`service-tab-${index}`}
            className={styles.panel}
            data-active={index === active}
            inert={index !== active}
          >
            <p className={styles.title}>{copy.items[index].title}</p>
            <p className={styles.body}>{copy.items[index].body}</p>
            <ul className={styles.list}>
              {services
                .filter((service) => service.group === group)
                .map(({ id, name }) => (
                  <li key={id}>{name[locale]}</li>
                ))}
            </ul>
            <BookingLink className={styles.book} preset={{ service: book }}>
              <span>{bookLabel}</span>
              <span className={styles.bookService}>{getService(book).name[locale]}</span>
            </BookingLink>
          </div>
        ))}
      </div>
    </div>
  );
}
