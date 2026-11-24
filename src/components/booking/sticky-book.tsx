import type { ReactNode } from "react";
import type { BookingPreset } from "@/lib/paths";
import { BookingLink } from "./booking-provider";
import styles from "./sticky-book.module.css";

/** Fixed booking button for phones. */
export function StickyBook({ preset, children }: { preset?: BookingPreset; children: ReactNode }) {
  return (
    <div className={styles.bar} data-sticky-book>
      <BookingLink preset={preset} className={styles.button}>
        {children}
      </BookingLink>
    </div>
  );
}
