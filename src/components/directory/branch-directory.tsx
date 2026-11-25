"use client";

import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/content";
import {
  branchesInRegion,
  branchPath,
  regionIds,
  regionNames,
  weekDays,
  type Branch,
  type RegionId,
} from "@/data/branches";
import { localePath, type Locale } from "@/i18n/config";
import { fill } from "@/lib/text";
import { BookingLink } from "../booking/booking-provider";
import { ForwardArrow } from "../responsive-text";
import styles from "./branch-directory.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["directory"];
  readonly draftLabel: string;
}

/** All branches by region. Every branch is in the HTML; the selector only narrows the view. */
export function BranchDirectory({ locale, copy, draftLabel }: Props) {
  const [region, setRegion] = useState<RegionId | "all">("all");
  const label = (id: RegionId | "all") => (id === "all" ? copy.all : regionNames[id][locale]);

  return (
    <>
      <div className={styles.selector} role="group" aria-label={copy.region}>
        {(["all", ...regionIds] as const).map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === region}
            onClick={() => setRegion(id)}
          >
            {label(id)}
          </button>
        ))}
      </div>
      <p className="visually-hidden" role="status">
        {fill(copy.showing, { region: label(region) })}
      </p>
      {regionIds.map((id) => (
        <section
          key={id}
          className={styles.region}
          aria-labelledby={`region-${id}`}
          hidden={region !== "all" && region !== id}
        >
          <h2 id={`region-${id}`}>{copy.regionHeadings[id]}</h2>
          <ul>
            {branchesInRegion(id).map((branch) => (
              <li key={branch.id}>
                <BranchCard locale={locale} copy={copy} branch={branch} draftLabel={draftLabel} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}

function BranchCard({ locale, copy, branch, draftLabel }: Props & { branch: Branch }) {
  const name = branch.name[locale];
  const { address, hours, directionsUrl } = branch;
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3>{name}</h3>
        {branch.draft ? <span className="draft-pill">{draftLabel}</span> : null}
      </div>
      {branch.area ? <p className={styles.area}>{branch.area[locale]}</p> : null}
      {branch.pendingNote ? <p className={styles.pending}>{branch.pendingNote[locale]}</p> : null}
      {address.status === "verified" || hours.status === "verified" ? (
        <dl className={styles.facts}>
          {address.status === "verified" ? (
            <div>
              <dt>{copy.address}</dt>
              <dd>{address.value[locale]}</dd>
            </div>
          ) : null}
          {hours.status === "verified" ? (
            <div>
              <dt>{copy.hours}</dt>
              {weekDays.map((day) => (
                <dd key={day.id}>
                  {day.name[locale]}: {hours.value[day.id][locale]}
                </dd>
              ))}
            </div>
          ) : null}
        </dl>
      ) : null}
      <div className={styles.actions}>
        <Link className={styles.detail} href={localePath(locale, branchPath(branch.id))}>
          {copy.details}{" "}
          <span className="visually-hidden">{branch.detail.linkLabel[locale]}</span>
          <ForwardArrow locale={locale} />
        </Link>
        {directionsUrl.status === "verified" ? (
          <a
            className={styles.directions}
            href={directionsUrl.value}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.directions} <span className="visually-hidden">{name}</span>
          </a>
        ) : null}
        <BookingLink className={styles.book} preset={{ branch: branch.id }}>
          {copy.book} <span className="visually-hidden">{name}</span>
        </BookingLink>
      </div>
    </article>
  );
}
