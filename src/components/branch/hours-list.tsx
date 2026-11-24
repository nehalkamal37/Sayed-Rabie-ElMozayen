"use client";

import { useSyncExternalStore } from "react";
import { weekDays, type Branch } from "@/data/branches";
import type { Locale } from "@/i18n/config";
import { cairoNow } from "@/lib/booking";
import styles from "./hours-list.module.css";

const subscribe = () => () => {};
const cairoWeekday = () => new Date(`${cairoNow().date}T00:00:00Z`).getUTCDay();

interface Props {
  readonly locale: Locale;
  readonly hours: Branch["hours"];
  readonly pendingLabel: string;
}

/** Weekly hours with today's row marked. The page is static, so today is set in the browser. */
export function HoursList({ locale, hours, pendingLabel }: Props) {
  const today = useSyncExternalStore(subscribe, cairoWeekday, () => null);
  return (
    <ul className={styles.list}>
      {weekDays.map(({ id, day, name }) => (
        <li key={id} aria-current={day === today ? "date" : undefined}>
          <span>{name[locale]}</span>
          {hours.status === "verified" ? (
            <span>{hours.value[id][locale]}</span>
          ) : (
            <span className={styles.empty}>
              <span aria-hidden="true">—</span>
              <span className="visually-hidden">{pendingLabel}</span>
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}
