import type { Locale } from "@/i18n/config";

/**
 * Licensed stock clips for the Signature preview until El Mozayen's own footage is
 * approved. Sources and licenses are recorded in MEDIA-CREDITS.md. The people and
 * places shown are not El Mozayen staff or branches, so labels only describe the action.
 */
export interface Clip {
  readonly src: string;
  readonly poster: string;
  readonly posterWidth: number;
  readonly posterHeight: number;
  /** object-position that keeps the action in frame. */
  readonly position: string;
  readonly label: Record<Locale, string>;
}

const clip = (
  name: string,
  [posterWidth, posterHeight]: readonly [number, number],
  position: string,
  label: Record<Locale, string>,
): Clip => ({
  src: `/videos/${name}.mp4`,
  poster: `/videos/${name}-poster.webp`,
  posterWidth,
  posterHeight,
  position,
  label,
});

const wide = [1000, 563] as const;

export const stockClips = {
  story: clip("stock-haircut", wide, "45% 50%", {
    ar: "حلاق بيقص شعر راجل بالماكينة",
    en: "A barber cutting a man's hair with clippers",
  }),
  cutBeard: clip("stock-beard-shaping", wide, "60% 50%", {
    ar: "حلاق بيظبط ذقن راجل بالموس",
    en: "A barber shaping a man's beard with a razor",
  }),
  hairColour: clip("stock-hair-colour", [563, 1000], "50% 30%", {
    ar: "صبغة بتتحط على شعر راجل بالفرشاة",
    en: "Colour being brushed onto a man's hair",
  }),
  skinCare: clip("stock-face-mask", [1000, 527], "50% 50%", {
    ar: "ماسك طين بيتحط على وش راجل بالفرشاة",
    en: "A clay mask being brushed onto a man's face",
  }),
  groom: clip("stock-groom-bow-tie", wide, "65% 50%", {
    ar: "عريس بيظبط البيبيون بتاعه",
    en: "A groom adjusting his bow tie",
  }),
  closing: clip("stock-barber-chairs", wide, "12% 50%", {
    ar: "كراسي حلاقة جلد في صالون",
    en: "Leather barber chairs in a salon",
  }),
} satisfies Record<string, Clip>;
