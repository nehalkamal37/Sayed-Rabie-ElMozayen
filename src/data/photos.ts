import type { Localized } from "@/i18n/config";

/**
 * TEMPORARY photos from the approved design handoff. Every one is a crop of a
 * single image: slide 1 of Sayed_Rabie_Website_Competitor_Analysis_v2.pptx.pdf.
 * Its origin and licence are unknown and it shows no real El Mozayen staff,
 * client or branch. Replace every entry before launch.
 */
export interface Photo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
  /** File in design-handoff/assets/photos-temporary this was converted from. */
  readonly handoffFile: string;
}

const photo = (
  name: string,
  width: number,
  height: number,
  handoffFile: string,
  alt: Localized,
): Photo => ({ src: `/photos-temporary/${name}.webp`, width, height, alt, handoffFile });

const heroAlt: Localized = {
  ar: "حلاق بيظبط قصة عميل في صالون بإضاءة دافية",
  en: "Barber finishing a client's haircut in a warmly lit shop",
};

export const photos = {
  /** Mirrored in the handoff for right-to-left text; flipped back for English. */
  heroWide: photo("barber-cutting-hair-wide", 1800, 1200, "h-hero-desk.jpg", heroAlt),
  heroPortrait: photo("barber-cutting-hair-portrait", 900, 1029, "h-hero-mob.jpg", heroAlt),
  cut: photo("scissors-and-comb-haircut", 900, 675, "h-svc-cut.jpg", {
    ar: "إيد الحلاق بالمقص والمشط وهو بيظبط القصة",
    en: "Barber's hands shaping a haircut with scissors and a comb",
  }),
  beard: photo("barber-with-trimmed-beard", 800, 847, "h-svc-beard.jpg", {
    ar: "حلاق بذقن متظبطة وشعر مموج",
    en: "Barber with a neat beard and wavy hair",
  }),
  chair: photo("leather-barber-chair", 800, 888, "h-svc-care.jpg", {
    ar: "كرسي حلاقة جلد في ركن هادي",
    en: "Leather barber chair in a quiet corner",
  }),
  groom: photo("client-after-haircut-and-beard-trim", 900, 1014, "h-groom.jpg", {
    ar: "عميل جاهز بعد قصة وتحديد ذقن",
    en: "Client after a haircut and beard trim",
  }),
  story: photo("barbershop-mirror-and-warm-lamp", 700, 1267, "h-story.jpg", {
    ar: "جوه الصالون: مراية وإضاءة دافية",
    en: "Inside the shop: a mirror and warm light",
  }),
} as const satisfies Record<string, Photo>;
