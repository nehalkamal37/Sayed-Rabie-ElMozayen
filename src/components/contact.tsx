import type { ReactNode } from "react";
import { bookingPhone, bookingWhatsApp } from "@/data/site";
import type { Locale } from "@/i18n/config";

interface ActionProps {
  readonly className?: string;
  readonly children: ReactNode;
  /** Read out and shown on hover while the destination is unverified. */
  readonly pendingLabel: string;
}

function Unavailable({ className, children, pendingLabel }: ActionProps) {
  return (
    <span className={className} role="link" aria-disabled="true" title={pendingLabel}>
      {children}
      <span className="visually-hidden">({pendingLabel})</span>
    </span>
  );
}

export function WhatsAppAction(props: ActionProps) {
  if (bookingWhatsApp.status !== "verified") return <Unavailable {...props} />;
  return (
    <a
      className={props.className}
      href={`https://wa.me/${bookingWhatsApp.value}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
}

export function CallAction(props: ActionProps) {
  if (bookingPhone.status !== "verified") return <Unavailable {...props} />;
  return (
    <a className={props.className} href={`tel:${bookingPhone.value.e164}`}>
      {props.children}
    </a>
  );
}

/** The shared booking number, as a call link. */
export function PhoneLink({ locale, className }: { locale: Locale; className?: string }) {
  if (bookingPhone.status !== "verified") return null;
  return (
    <a className={className} href={`tel:${bookingPhone.value.e164}`}>
      <bdi dir="ltr">{bookingPhone.value.display[locale]}</bdi>
    </a>
  );
}

/** The number alone, for use inside another call link. */
export function PhoneText({ locale }: { locale: Locale }) {
  if (bookingPhone.status !== "verified") return null;
  return <bdi dir="ltr">{bookingPhone.value.display[locale]}</bdi>;
}
