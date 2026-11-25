"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";

const STAGGER_MS = 180;

/** Clear of the phone booking bar. */
const VIEW_MARGIN = "0px 0px -72px 0px";

/** What a step waits for: most of it on screen, part of it, or only the step before. */
export type Step = "most" | "part" | "after-previous";

/**
 * Plays the `data-step` elements inside it one after another, once, in page order
 * unless `data-order` says otherwise. Each starts a
 * beat after the one before and never before it is on screen, so none plays out of
 * sight. It holds nothing back without JavaScript or with reduced motion.
 */
function useSequence(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const root = ref.current;
    if (!root || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (root.getBoundingClientRect().top < innerHeight) return;

    const order = (step: HTMLElement) => Number(step.dataset.order ?? 0);
    const steps = [...root.querySelectorAll<HTMLElement>("[data-step]")].sort(
      (a, b) => order(a) - order(b),
    );
    for (const step of steps) step.dataset.reveal = "wait";

    let next = 0;
    let furthestSeen = -1;
    let lastStart = -Infinity;
    let timer: number | undefined;

    const follows = (index: number) => steps[index]?.dataset.step === "after-previous";

    function play() {
      if (timer !== undefined || next >= steps.length) return;
      if (next > furthestSeen && !(next > 0 && follows(next))) return;
      timer = window.setTimeout(
        () => {
          timer = undefined;
          lastStart = performance.now();
          steps[next].dataset.reveal = "in";
          next += 1;
          if (next === steps.length) observer.disconnect();
          else play();
        },
        Math.max(0, lastStart + STAGGER_MS - performance.now()),
      );
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, intersectionRatio } of entries) {
          const step = target as HTMLElement;
          const enough = step.dataset.step === "part" ? 0.25 : 0.9;
          if (intersectionRatio >= enough - 0.01) {
            furthestSeen = Math.max(furthestSeen, steps.indexOf(step));
          }
        }
        play();
      },
      { threshold: [0.25, 0.9], rootMargin: VIEW_MARGIN },
    );
    steps.forEach((step, index) => {
      if (!follows(index)) observer.observe(step);
    });

    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
      for (const step of steps) delete step.dataset.reveal;
    };
  }, [ref]);
}

interface SequenceProps {
  readonly className?: string;
  readonly children: ReactNode;
}

export function Sequence({ className, children }: SequenceProps) {
  const ref = useRef<HTMLDivElement>(null);
  useSequence(ref);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
