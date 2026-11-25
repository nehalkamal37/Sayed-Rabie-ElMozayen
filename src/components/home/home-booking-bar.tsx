"use client";

import { useEffect, useState } from "react";
import { BookingLink } from "../booking/booking-provider";
import styles from "./home-booking-bar.module.css";

/** Phone booking bar, shown while no section with its own booking button is on screen. */
export function HomeBookingBar({ label }: { label: string }) {
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const onScreen = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) onScreen.add(target);
        else onScreen.delete(target);
      }
      setShown(onScreen.size === 0);
    });
    document.querySelectorAll("[data-own-booking]").forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.bar} data-shown={shown} data-sticky-book>
      <BookingLink className={styles.link}>{label}</BookingLink>
    </div>
  );
}
