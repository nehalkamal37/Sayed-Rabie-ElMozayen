"use client";

import { useEffect } from "react";

/** Marks the page once it has scrolled, so an overlaid header can turn solid. */
export function HeaderScroll() {
  useEffect(() => {
    const root = document.documentElement;
    let frame = 0;
    function update() {
      frame = 0;
      root.toggleAttribute("data-scrolled", scrollY > 24);
    }
    function onScroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
      root.removeAttribute("data-scrolled");
    };
  }, []);
  return null;
}
