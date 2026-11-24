"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type MouseEvent } from "react";
import { localePath, neutralPath, otherLocale, type Locale } from "@/i18n/config";
import styles from "./language-switch.module.css";

interface Props {
  readonly locale: Locale;
  readonly label: string;
  readonly accessibleLabel: string;
}

/** Opens the same page in the other language, keeping the query string and section. */
export function LanguageSwitch(props: Props) {
  return (
    <Suspense fallback={<SwitchLink {...props} search="" />}>
      <SwitchWithSearch {...props} />
    </Suspense>
  );
}

function SwitchWithSearch(props: Props) {
  const search = useSearchParams().toString();
  return <SwitchLink {...props} search={search ? `?${search}` : ""} />;
}

function SwitchLink({ locale, label, accessibleLabel, search }: Props & { search: string }) {
  const target = otherLocale(locale);
  const path = localePath(target, neutralPath(usePathname()));

  function keepSection(event: MouseEvent<HTMLAnchorElement>) {
    event.currentTarget.href = `${path}${search}${window.location.hash}`;
  }

  return (
    <a
      className={styles.link}
      href={`${path}${search}`}
      onClick={keepSection}
      lang={target}
      hrefLang={target}
      aria-label={`${label} – ${accessibleLabel}`}
    >
      {label}
    </a>
  );
}
