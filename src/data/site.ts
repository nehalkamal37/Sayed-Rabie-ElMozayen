import type { Localized } from "@/i18n/config";
import { pending, verified, type Verifiable } from "./verification";

export const brandName: Localized = {
  ar: "سيد ربيع المزين",
  en: "Sayed Rabie El Mozayen",
};

/** Set NEXT_PUBLIC_SITE_URL (no trailing slash) once a domain is approved. */
export const productionUrl = process.env.NEXT_PUBLIC_SITE_URL ?? null;

/** Base for canonical and hreflang URLs. */
export const siteUrl = productionUrl ?? "http://localhost:3000";

export interface PhoneNumber {
  /** International format for tel: links. */
  readonly e164: string;
  readonly display: Localized;
}

/**
 * Shared booking line, shown on every approved screen. Whether it has WhatsApp,
 * and whether branches have their own numbers, is still open.
 */
export const bookingPhone: Verifiable<PhoneNumber> = verified({
  e164: "+201020204040",
  display: { ar: "0102 020 4040", en: "+20 102 020 4040" },
});

/**
 * Booking WhatsApp number in international digits only, for example "201XXXXXXXXX".
 * WhatsApp actions stay unavailable until this is `verified(...)`.
 */
export const bookingWhatsApp: Verifiable<string> = pending;

/** Profiles listed in the content plan, section 17. Confirm the handles before launch. */
export const socialProfiles: readonly { readonly name: Localized; readonly url: string }[] = [
  { name: { ar: "فيسبوك", en: "Facebook" }, url: "https://www.facebook.com/SayedElMezien" },
  {
    name: { ar: "انستجرام", en: "Instagram" },
    url: "https://www.instagram.com/sayedrabie_elmozayen",
  },
  { name: { ar: "Threads", en: "Threads" }, url: "https://www.threads.com/@sayedrabie_elmozayen" },
];

export interface Review {
  readonly text: Localized;
  readonly author: string;
  readonly branch: Localized;
}

/** Real Google reviews only. The section stays hidden while this is empty. */
export const reviews: readonly Review[] = [];
