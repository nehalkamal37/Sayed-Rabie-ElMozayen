import Link from "next/link";
import { PageFrame } from "@/components/page-frame";
import { getDictionary } from "@/content";
import { localePath, type Locale } from "@/i18n/config";

export function NotFoundView({ locale }: { locale: Locale }) {
  const { notFound } = getDictionary(locale);
  return (
    <PageFrame locale={locale}>
      <div className="container not-found">
        <h1>{notFound.heading}</h1>
        <p>{notFound.body}</p>
        <Link className="button" href={localePath(locale, "/")}>
          {notFound.cta}
        </Link>
      </div>
    </PageFrame>
  );
}
