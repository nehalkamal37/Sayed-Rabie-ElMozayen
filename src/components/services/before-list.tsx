"use client";

import { useSyncExternalStore } from "react";
import type { Dictionary } from "@/content";
import { Icon } from "../icons";
import { ResponsiveText } from "../responsive-text";
import styles from "./before-list.module.css";

const query = "(min-width: 60rem)";

function subscribe(listener: () => void) {
  const media = window.matchMedia(query);
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}

/** Accordions on phones; always-open cards on desktop. */
export function BeforeList({ items }: { items: Dictionary["services"]["before"]["items"] }) {
  const desktop = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
  return (
    <div className={styles.list}>
      {items.map((item) => (
        <details key={item.title} className={styles.item} open={desktop || undefined} data-fixed={desktop}>
          <summary tabIndex={desktop ? -1 : undefined}>
            <h3>
              <ResponsiveText long={item.title} short={item.titleShort} />
            </h3>
            <Icon name="chevronDown" size={18} className={styles.chevron} />
          </summary>
          <p>{item.body}</p>
        </details>
      ))}
    </div>
  );
}
