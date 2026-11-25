"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Dictionary } from "@/content";
import { brandName } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { Icon } from "../icons";
import { LanguageSwitch } from "../language-switch";
import { navLinks } from "../nav-links";
import styles from "./home-header.module.css";

interface Props {
  readonly locale: Locale;
  readonly common: Dictionary["common"];
}

/** Logo in the middle, menu on one side and the language on the other. */
export function HomeHeader({ locale, common }: Props) {
  const [open, setOpen] = useState(false);
  const links = navLinks(locale, common.nav).filter(({ path }) => path !== "/");

  return (
    <header
      className={styles.header}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <div className={styles.row}>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="home-nav"
          aria-label={open ? common.closeMenu : common.openMenu}
          onClick={() => setOpen(!open)}
        >
          <Icon name={open ? "close" : "menu"} size={26} />
        </button>
        <Image
          className={styles.logo}
          src="/brand/logo-brown.webp"
          alt={brandName[locale]}
          width={720}
          height={251}
          sizes="170px"
          loading="eager"
        />
        <div className={styles.language}>
          <LanguageSwitch
            locale={locale}
            label={common.switchLanguage}
            accessibleLabel={common.switchLanguageLabel}
          />
        </div>
      </div>
      <nav
        id="home-nav"
        className={styles.nav}
        data-open={open}
        aria-label={common.mainNav}
        onClick={() => setOpen(false)}
      >
        {links.map(({ href, label }) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
