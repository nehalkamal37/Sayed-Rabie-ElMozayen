"use client";

import { useRef, useState } from "react";
import type { Clip } from "@/data/media";
import type { Locale } from "@/i18n/config";
import { Icon } from "../icons";
import styles from "./reel-gallery.module.css";

interface Props {
  readonly locale: Locale;
  readonly clips: readonly Clip[];
  readonly labels: { readonly play: string; readonly pause: string; readonly previous: string; readonly next: string };
  /** Says the footage is illustrative. */
  readonly note?: string;
}

/** The clip playing now, so starting another one stops it. */
let current: HTMLVideoElement | null = null;

/**
 * Tall clips in a horizontal row that scrolls and snaps natively. Each plays only
 * when tapped, and only one plays at a time; nothing downloads until then.
 */
export function ReelGallery({ locale, clips, labels, note }: Props) {
  const track = useRef<HTMLUListElement>(null);

  function step(direction: 1 | -1) {
    const list = track.current;
    const card = list?.firstElementChild as HTMLElement | null;
    if (!list || !card) return;
    // Lists scroll toward the reading end; RTL scroll positions run negative.
    const sign = locale === "ar" ? -1 : 1;
    list.scrollBy({ left: direction * sign * (card.offsetWidth + 16), behavior: "smooth" });
  }

  return (
    <div className={styles.gallery}>
      <ul ref={track} className={styles.track}>
        {clips.map((clip, index) => (
          <li key={clip.src} className={styles.card}>
            <Reel clip={clip} locale={locale} labels={labels} number={index + 1} />
          </li>
        ))}
      </ul>
      <div className={styles.arrows}>
        {note ? <p className={styles.note}>{note}</p> : null}
        <button type="button" className={styles.arrow} aria-label={labels.previous} onClick={() => step(-1)}>
          <Icon name="arrow" size={22} strokeWidth={1.6} />
        </button>
        <button type="button" className={styles.arrow} aria-label={labels.next} onClick={() => step(1)}>
          <Icon name="arrow" size={22} strokeWidth={1.6} />
        </button>
      </div>
    </div>
  );
}

function Reel({
  clip,
  locale,
  labels,
  number,
}: {
  clip: Clip;
  locale: Locale;
  labels: Props["labels"];
  number: number;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);

  function start() {
    const element = video.current;
    if (!element) return;
    if (current && current !== element) current.pause();
    current = element;
    if (!element.getAttribute("src")) element.src = clip.src;
    element.play().catch(() => setPlaying(false));
  }

  // With a mouse, resting on a clip previews it; leaving stops it unless it was clicked.
  const held = useRef(false);

  function toggle() {
    const element = video.current;
    if (!element) return;
    // A click on a previewing clip keeps it playing; otherwise it toggles.
    if (!element.paused && !held.current) {
      held.current = true;
      return;
    }
    held.current = element.paused;
    if (element.paused) start();
    else element.pause();
  }
  function preview(on: boolean) {
    if (!matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) return;
    if (on) start();
    else if (!held.current) video.current?.pause();
  }

  return (
    <figure
      className={styles.reel}
      data-playing={playing || undefined}
      onPointerEnter={(event) => event.pointerType === "mouse" && preview(true)}
      onPointerLeave={(event) => event.pointerType === "mouse" && preview(false)}
    >
      <video
        ref={video}
        poster={clip.poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={clip.label[locale]}
        style={{ objectPosition: clip.position }}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={styles.toggle}
        aria-label={`${playing ? labels.pause : labels.play}: ${clip.label[locale]}`}
        onClick={toggle}
      >
        <span className={styles.icon} aria-hidden="true">
          <Icon name={playing ? "pause" : "play"} size={20} strokeWidth={2} />
        </span>
      </button>
      <figcaption className={styles.caption}>
        <span className={styles.number}>{String(number).padStart(2, "0")}</span>
        {clip.label[locale]}
      </figcaption>
    </figure>
  );
}
