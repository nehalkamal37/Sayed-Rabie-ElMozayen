"use client";

import { useEffect } from "react";

/**
 * One observer for the whole page. Elements marked `data-motion` that start below
 * the screen are held (`data-reveal="wait"`) and released (`"in"`) as they arrive.
 * Anything already on screen, and everything when scripts fail or the visitor
 * prefers reduced motion, is never hidden. Children of `data-stagger` get `--i`.
 */
export function MotionDirector() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((group) => {
      Array.from(group.children).forEach((child, index) => {
        (child as HTMLElement).style.setProperty("--i", String(index));
      });
    });

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-motion]"));
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          if (!isIntersecting) continue;
          (target as HTMLElement).dataset.reveal = "in";
          observer.unobserve(target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
    );

    for (const target of targets) {
      if (target.getBoundingClientRect().top < innerHeight * 0.92) continue;
      target.dataset.reveal = "wait";
      observer.observe(target);
    }
    return () => observer.disconnect();
  }, []);

  return null;
}
