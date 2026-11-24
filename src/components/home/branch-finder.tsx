"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import type { Dictionary } from "@/content";
import {
  branches,
  branchPath,
  defaultRegionId,
  regionIds,
  regionNames,
  regionTabNames,
  type Branch,
} from "@/data/branches";
import { localePath, type Locale } from "@/i18n/config";
import { BookingLink } from "../booking/booking-provider";
import { Icon } from "../icons";
import styles from "./branch-finder.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["home"]["branches"];
}

/** A region switch and list on phones; all branches as a card grid on desktop. */
export function BranchFinder({ locale, copy }: Props) {
  const [region, setRegion] = useState(defaultRegionId);

  return (
    <>
      <div className={styles.regions} role="group" aria-label={copy.region}>
        {regionIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === region}
            onClick={() => setRegion(id)}
          >
            {regionTabNames[id][locale]}
          </button>
        ))}
      </div>
      <ul className={styles.list}>
        {branches.map((branch) => (
          <li key={branch.id} data-shown={branch.region === region}>
            <BranchEntry locale={locale} branch={branch} copy={copy} />
          </li>
        ))}
      </ul>
    </>
  );
}

/** Opens the branch page where one exists, otherwise a booking at that branch. */
function BranchEntry({ locale, branch, copy }: Props & { branch: Branch }) {
  const content: ReactNode = (
    <>
      <span className={styles.text}>
        <span className={styles.region}>{regionNames[branch.region][locale]}</span>
        <span className={styles.name}>{branch.name[locale]}</span>
        {branch.area ? (
          <span className={styles.note}>{branch.area[locale]}</span>
        ) : branch.pendingNote ? (
          <span className={`${styles.note} ${styles.pending}`}>{branch.pendingNote[locale]}</span>
        ) : null}
        <span className="visually-hidden">{branch.detail ? copy.open : copy.bookHere}</span>
      </span>
      <Icon name="chevronForward" className={styles.chevron} />
    </>
  );
  return branch.detail ? (
    <Link className={styles.entry} href={localePath(locale, branchPath(branch.id))}>
      {content}
    </Link>
  ) : (
    <BookingLink className={styles.entry} preset={{ branch: branch.id }}>
      {content}
    </BookingLink>
  );
}
