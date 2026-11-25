"use client";

import { useEffect, useState } from "react";
import { BookingLink } from "../booking/booking-provider";
import { useHomeSelection } from "./home-selection";
import styles from "./home-booking-bar.module.css";

/**
 * Phone booking bar, shown while nothing with its own booking button is on screen.
 * It carries the service chosen in the menu, or the highlighted one while the menu
 * itself is in view.
 */
export function HomeBookingBar({ label }: { label: string }) {
  const { service, chosen } = useHomeSelection();
  const [shown, setShown] = useState(false);
  const [atServices, setAtServices] = useState(false);

  useEffect(() => {
    const onScreen = new Set<Element>();
    const buttons = new IntersectionObserver((entries) => {
      for (const { target, isIntersecting } of entries) {
        if (isIntersecting) onScreen.add(target);
        else onScreen.delete(target);
      }
      setShown(onScreen.size === 0);
    });
    document.querySelectorAll("[data-own-booking]").forEach((element) => buttons.observe(element));

    const menu = new IntersectionObserver(
      ([entry]) => setAtServices(entry.isIntersecting),
      { rootMargin: "-30% 0px -30% 0px" },
    );
    const services = document.getElementById("services");
    if (services) menu.observe(services);

    return () => {
      buttons.disconnect();
      menu.disconnect();
    };
  }, []);

  return (
    <div className={styles.bar} data-shown={shown} data-sticky-book>
      <BookingLink className={styles.link} preset={chosen || atServices ? { service } : {}}>
        {label}
      </BookingLink>
    </div>
  );
}
