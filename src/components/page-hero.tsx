import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { getDictionary } from "@/content";
import type { Still } from "@/data/media";
import { localePath, type Locale } from "@/i18n/config";
import styles from "./page-hero.module.css";

interface Props {
  readonly locale: Locale;
  readonly heading: string;
  /** Label of this page in the breadcrumb. */
  readonly crumb: string;
  readonly lede?: string;
  readonly draft?: string;
  readonly children?: ReactNode;
  /** A photo behind the title, darkened so the words read on it. */
  readonly image?: Still;
}

/** The dark title band used on inner pages. */
export function PageHero({ locale, heading, crumb, lede, draft, children, image }: Props) {
  const { common } = getDictionary(locale);
  return (
    <div className={styles.hero} data-image={image ? "" : undefined}>
      {image ? (
        <div className={styles.image} data-parallax>
          <Image
            src={image.src}
            width={image.width}
            height={image.height}
            alt=""
            sizes="100vw"
            style={{ objectPosition: image.position }}
            preload
          />
        </div>
      ) : null}
      <nav className={styles.crumbs} aria-label={common.breadcrumb}>
        <Link href={localePath(locale, "/")}>{common.nav.home}</Link>{" "}
        <span aria-hidden="true">{locale === "ar" ? "‹" : "›"}</span>{" "}
        <span aria-current="page">{crumb}</span>
      </nav>
      <h1>{heading}</h1>
      {lede ? <p className={styles.lede}>{lede}</p> : null}
      {draft ? <p className={styles.draft}>{draft}</p> : null}
      {children}
    </div>
  );
}
