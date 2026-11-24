"use client";

import Link from "next/link";
import { useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./icons";
import type { NavLink } from "./nav-links";
import styles from "./mobile-menu.module.css";

interface Props {
  readonly links: readonly NavLink[];
  readonly labels: { readonly nav: string; readonly open: string; readonly close: string };
}

export function MobileMenu({ links, labels }: Props) {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);

  function closeOnEscape(event: KeyboardEvent) {
    if (event.key !== "Escape" || !open) return;
    setOpen(false);
    toggle.current?.focus();
  }

  return (
    <div className={styles.root} onKeyDown={closeOnEscape}>
      <button
        ref={toggle}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? labels.close : labels.open}
        onClick={() => setOpen(!open)}
      >
        <Icon name={open ? "close" : "menu"} size={22} strokeWidth={1.8} />
      </button>
      <nav id="mobile-menu" className={styles.panel} aria-label={labels.nav} hidden={!open}>
        <ul>
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
