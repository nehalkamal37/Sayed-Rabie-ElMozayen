"use client";

import { useEffect, useRef, useState } from "react";
import type { Dictionary } from "@/content";
import { Icon } from "../icons";
import styles from "./promise-rotation.module.css";

/** Matches the keyframes: each phrase enters, holds and leaves in its own turn. */
const ENTER_MS = 250;
const HOLD_MS = 2200;
const TURN_MS = ENTER_MS + HOLD_MS + 250;

/**
 * One phrase at a time in a fixed slot, looping while it is on screen. The phrases
 * stay a plain list underneath, so screen readers meet them once, and without
 * JavaScript or with reduced motion the list simply shows in full.
 */
export function PromiseRotation({ copy }: { copy: Dictionary["home"]["story"] }) {
  const root = useRef<HTMLDivElement>(null);
  const onScreen = useRef(false);
  const [paused, setPaused] = useState(false);
  const pausedNow = useRef(paused);

  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let started = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen.current = entry.isIntersecting;
        // Waits at the start until the slot is first reached, so phrase one opens it.
        if (!started) {
          run(element, false);
          setTime(element, () => 0);
        }
        started ||= entry.isIntersecting;
        run(element, entry.isIntersecting && !pausedNow.current);
      },
      { threshold: 0.6 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  function toggle() {
    const next = !paused;
    pausedNow.current = next;
    setPaused(next);
    if (!root.current) return;
    run(root.current, onScreen.current && !next);
    // Pausing always leaves a whole phrase in the slot.
    if (next) {
      setTime(root.current, (time) => {
        const turn = time % TURN_MS;
        return time - turn + Math.min(Math.max(turn, ENTER_MS), ENTER_MS + HOLD_MS);
      });
    }
  }

  return (
    <div ref={root} className={styles.slot}>
      <ul className={styles.phrases}>
        {copy.points.map((point) => (
          <li key={point}>{point}</li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.toggle}
        aria-label={paused ? copy.resume : copy.pause}
        onClick={toggle}
      >
        <Icon name={paused ? "play" : "pause"} size={20} strokeWidth={3} />
      </button>
    </div>
  );
}

const phraseAnimations = (element: HTMLElement) =>
  element.getAnimations({ subtree: true }).filter((item) => item instanceof CSSAnimation);

function run(element: HTMLElement, running: boolean) {
  for (const animation of phraseAnimations(element)) {
    if (running) animation.play();
    else animation.pause();
  }
}

/** Moves every phrase to the same point of the loop. Pause first: it lands a frame late. */
function setTime(element: HTMLElement, next: (time: number) => number) {
  for (const animation of phraseAnimations(element)) {
    animation.currentTime = next(Number(animation.currentTime ?? 0));
  }
}
