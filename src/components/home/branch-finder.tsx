"use client";

import Link from "next/link";
import { useState } from "react";
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
            <BranchEntry locale={locale} branch={branch} />
          </li>
        ))}
      </ul>
    </>
  );
}

function BranchEntry({ locale, branch }: { locale: Locale; branch: Branch }) {
  return (
    <Link className={styles.entry} href={localePath(locale, branchPath(branch.id))}>
      <span className={styles.text}>
        <span className={styles.region}>{regionNames[branch.region][locale]}</span>
        <span className={styles.name}>{branch.name[locale]}</span>
        {branch.area ? (
          <span className={styles.note}>{branch.area[locale]}</span>
        ) : branch.pendingNote ? (
          <span className={`${styles.note} ${styles.pending}`}>{branch.pendingNote[locale]}</span>
        ) : null}
        <span className="visually-hidden">{branch.detail.linkLabel[locale]}</span>
      </span>
      <Icon name="chevronForward" className={styles.chevron} />
    </Link>
  );
}
