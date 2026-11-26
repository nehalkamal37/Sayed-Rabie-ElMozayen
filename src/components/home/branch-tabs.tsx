"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import type { Dictionary } from "@/content";
import { branches, branchPath, defaultRegionId, regionIds, regionTabNames } from "@/data/branches";
import { localePath, type Locale } from "@/i18n/config";
import { fill } from "@/lib/text";
import { BookingLink } from "../booking/booking-provider";
import { Icon } from "../icons";
import { useHomeSelection } from "./home-selection";
import styles from "./branch-tabs.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["home"]["branches"];
  /** Adds a request button to each branch, carrying the branch and any chosen service. */
  readonly book?: { readonly label: string; readonly labelFor: string };
}

/** Compact region tabs. Every region is laid out, so changing it never moves the page. */
export function BranchTabs({ locale, copy, book }: Props) {
  const { service, chosen } = useHomeSelection();
  const [region, setRegion] = useState(defaultRegionId);
  const active = regionIds.indexOf(region);
  return (
    <div>
      <div
        className={styles.regions}
        role="group"
        aria-label={copy.region}
        style={{ "--i": active } as CSSProperties}
      >
        <span className={styles.indicator} aria-hidden="true" />
        {regionIds.map((id) => (
          <button key={id} type="button" aria-pressed={id === region} onClick={() => setRegion(id)}>
            {regionTabNames[id][locale]}
          </button>
        ))}
      </div>
      <div className={styles.results} aria-live="polite">
        {regionIds.map((id) => (
          <ul key={id} className={styles.list} data-active={id === region} inert={id !== region}>
            {branches
              .filter((branch) => branch.region === id)
              .map((branch, index) => (
                <li key={branch.id} style={{ "--n": index } as CSSProperties}>
                  <Link className={styles.entry} href={localePath(locale, branchPath(branch.id))}>
                    <span className={styles.name}>{branch.name[locale]}</span>
                    {branch.area ? (
                      <span className={styles.note}>{branch.area[locale]}</span>
                    ) : branch.pendingNote ? (
                      <span className={styles.pending}>{branch.pendingNote[locale]}</span>
                    ) : null}
                    <Icon name="chevronForward" className={styles.arrow} />
                    <span className="visually-hidden">{branch.detail.linkLabel[locale]}</span>
                  </Link>
                  {book ? (
                    <BookingLink
                      className={styles.book}
                      preset={chosen ? { branch: branch.id, service } : { branch: branch.id }}
                      aria-label={fill(book.labelFor, { branch: branch.name[locale] })}
                    >
                      {book.label}
                    </BookingLink>
                  ) : null}
                </li>
              ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
