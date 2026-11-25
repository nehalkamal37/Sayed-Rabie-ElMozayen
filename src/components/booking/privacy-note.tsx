import Link from "next/link";
import type { Dictionary } from "@/content";
import { localePath, type Locale } from "@/i18n/config";
import { privacyPath } from "@/lib/paths";

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["booking"];
  readonly className?: string;
}

/** Opens the policy in a new tab so a half-filled request is not lost. */
export function PrivacyNote({ locale, copy, className }: Props) {
  return (
    <p className={className}>
      {copy.privacyNote}{" "}
      <Link href={localePath(locale, privacyPath)} target="_blank">
        {copy.privacyLink}
      </Link>
    </p>
  );
}
