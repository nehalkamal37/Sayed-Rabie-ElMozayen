"use client";

import Image from "next/image";
import { useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import type { Dictionary } from "@/content";
import { photos } from "@/data/photos";
import type { Locale } from "@/i18n/config";
import { ResponsiveText } from "../responsive-text";
import styles from "./service-showcase.module.css";

/** Photo and approved crop for each service, in the copy's order. */
const views = [
  { photo: photos.razorBeard, mobile: "50% 50%", desktop: "41% 50%" },
  { photo: photos.hairColour, mobile: "50% 45%", desktop: "50% 50%" },
  { photo: photos.faceMask, mobile: "50% 40%", desktop: "60% 50%" },
] as const;

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["home"]["services"];
}

/** Hover, focus, tap or arrow keys choose a service and cross-fade its photo. */
export function ServiceShowcase({ locale, copy }: Props) {
  const [active, setActive] = useState(0);
  const rows = useRef<(HTMLButtonElement | null)[]>([]);

  function moveFocus(event: KeyboardEvent, index: number) {
    const last = copy.items.length - 1;
    const target = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    }[event.key];
    if (target === undefined) return;
    event.preventDefault();
    rows.current[target]?.focus();
  }

  return (
    <div className={styles.split}>
      <figure className={styles.figure}>
        {views.map(({ photo, mobile, desktop }, index) => (
          <Image
            key={photo.src}
            src={photo.src}
            width={photo.width}
            height={photo.height}
            alt={photo.alt[locale]}
            aria-hidden={index === active ? undefined : true}
            sizes="(min-width: 60rem) 600px, 110vw"
            data-active={index === active}
            style={{ "--mobile": mobile, "--desktop": desktop } as CSSProperties}
          />
        ))}
        <figcaption className="only-desktop" aria-live="polite">
          {copy.items[active].caption}
        </figcaption>
      </figure>
      <div className={styles.rows}>
        <div role="group" aria-label={copy.choose} className={styles.group}>
          {copy.items.map((item, index) => (
            <button
              key={item.title}
              ref={(element) => {
                rows.current[index] = element;
              }}
              type="button"
              className={styles.row}
              aria-pressed={index === active}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onClick={() => setActive(index)}
              onKeyDown={(event) => moveFocus(event, index)}
            >
              <span className={styles.bar} aria-hidden="true" />
              <span className={styles.text}>
                <span className={styles.title}>{item.title}</span>
                <span className={styles.body}>
                  <ResponsiveText long={item.body} short={item.short} />
                </span>
              </span>
            </button>
          ))}
        </div>
        <p className={`${styles.hint} only-desktop`}>{copy.keys}</p>
      </div>
    </div>
  );
}
