"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Dictionary } from "@/content";
import { neutralPath, type Locale } from "@/i18n/config";
import { directoryPath } from "@/lib/paths";
import { BookingLink } from "./booking/booking-provider";
import { navLinks } from "./nav-links";
import styles from "./site-header.module.css";

interface Props {
  readonly locale: Locale;
  readonly nav: Dictionary["common"]["nav"];
  readonly label: string;
}

export function HeaderNav({ locale, nav, label }: Props) {
  const path = neutralPath(usePathname());
  const section = path.startsWith(`${directoryPath}/`) ? directoryPath : path;

  return (
    <nav className={styles.nav} aria-label={label}>
      <ul>
        {navLinks(locale, nav).map((link) => (
          <li key={link.path}>
            <Link href={link.href} aria-current={link.path === section ? "page" : undefined}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Branch pages carry their own booking button, and the booking page is the form. */
export function HeaderBook({ label }: { label: string }) {
  const path = neutralPath(usePathname());
  if (path.startsWith(`${directoryPath}/`) || path === "/book") return null;
  return <BookingLink className={styles.book}>{label}</BookingLink>;
}
