"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "../icons";
import styles from "./story-video.module.css";

interface Props {
  readonly src: string;
  readonly poster: string;
  readonly label: string;
  readonly playLabel: string;
  readonly pauseLabel: string;
  /** object-position for the poster and the video. */
  readonly position?: string;
  /** False keeps it paused and unloaded, as for a service tab not chosen. */
  readonly active?: boolean;
}

/**
 * Muted, plays while on screen and pauses off it. The file loads only as it nears
 * the screen; the poster holds its place until then. With reduced motion, or when
 * the browser refuses to start it, it waits for the Play button.
 */
export function StoryVideo({ src, poster, label, playLabel, pauseLabel, position, active = true }: Props) {
  const video = useRef<HTMLVideoElement>(null);
  const live = useRef(active);
  const visible = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [paused, setPaused] = useState(false);

  function start(element: HTMLVideoElement) {
    load(element);
    // A play cut short by a pause or a new load is not a refusal; only a refusal shows Play.
    element.play().catch((error: unknown) => {
      if (!(error instanceof DOMException && error.name === "AbortError")) setPaused(true);
    });
  }

  function load(element: HTMLVideoElement) {
    if (!element.getAttribute("src")) element.src = src;
  }

  useEffect(() => {
    const element = video.current;
    if (!element) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) element.dataset.held = "";
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || !live.current) return;
        load(element);
        near.disconnect();
      },
      { rootMargin: "400px 0px" },
    );
    near.observe(element);
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible.current = entry.isIntersecting;
        if (!entry.isIntersecting || !live.current) element.pause();
        else if (element.dataset.held !== undefined) setPaused(true);
        else start(element);
      },
      { threshold: 0.5 },
    );
    observer.observe(element);
    return () => {
      near.disconnect();
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- load and start only read src
  }, [src]);

  // Only the chosen service plays; switching back resumes it if it is on screen.
  useEffect(() => {
    live.current = active;
    const element = video.current;
    if (!element) return;
    if (!active) element.pause();
    else if (visible.current && element.dataset.held === undefined) start(element);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- start only reads src
  }, [active]);

  function toggle() {
    const element = video.current;
    if (!element) return;
    if (element.paused) {
      delete element.dataset.held;
      setPaused(false);
      start(element);
    } else {
      element.dataset.held = "";
      setPaused(true);
      element.pause();
    }
  }

  const waiting = paused && !playing;
  return (
    <div className={styles.frame}>
      <video
        ref={video}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={label}
        style={position ? { objectPosition: position } : undefined}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
      <button
        type="button"
        className={styles.toggle}
        data-large={waiting ? "" : undefined}
        data-idle={playing ? undefined : ""}
        aria-label={playing ? pauseLabel : playLabel}
        onClick={toggle}
      >
        <Icon name={playing ? "pause" : "play"} size={28} strokeWidth={2.2} />
      </button>
    </div>
  );
}
