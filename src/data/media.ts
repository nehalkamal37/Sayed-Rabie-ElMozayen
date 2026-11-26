import type { Locale } from "@/i18n/config";

/**
 * Every photo and video the homepage shows, in one place.
 *
 * TEMPORARY MEDIA: apart from `ownerPortrait`, everything below is licensed stock
 * footage standing in until El Mozayen supplies its own (sources and licences are
 * in MEDIA-CREDITS.md). The people and rooms shown are not Sayed Rabie, his team,
 * his clients or his branches, so labels describe only the action on screen.
 *
 * To replace an asset, drop the new file into public/ and change its entry here;
 * no component needs to change.
 */

type Text = Record<Locale, string>;

export interface Still {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Text;
  /** object-position that keeps the subject in frame. */
  readonly position: string;
  readonly temporary: boolean;
}

export interface Clip {
  readonly src: string;
  readonly poster: string;
  readonly posterWidth: number;
  readonly posterHeight: number;
  readonly position: string;
  readonly label: Text;
  readonly orientation: "wide" | "tall";
  readonly temporary: boolean;
}

const wide = [1000, 563] as const;
const tall = [563, 1000] as const;

const clip = (
  name: string,
  [posterWidth, posterHeight]: readonly [number, number],
  position: string,
  label: Text,
): Clip => ({
  src: `/videos/${name}.mp4`,
  poster: `/videos/${name}-poster.webp`,
  posterWidth,
  posterHeight,
  position,
  label,
  orientation: posterWidth > posterHeight ? "wide" : "tall",
  temporary: true,
});

export const media = {
  /** Behind the hero headline. TEMPORARY stock: Mixkit 43222. */
  heroVideo: clip("stock-haircut", wide, "16% 40%", {
    ar: "حلاق بيقص شعر راجل بالماكينة",
    en: "A barber cutting a man's hair with clippers",
  }),

  /**
   * Portrait of Sayed Rabie. Empty until an approved photo with confirmed usage rights
   * is supplied; nothing renders in its place. (The image placed earlier is published
   * on saeidrabie.com and is not confirmed to show him.)
   */
  ownerPortrait: null as Still | null,

  /** The film in the brand story. TEMPORARY stock: Pexels 7697179. */
  brandStoryVideo: clip("stock-tools-on-black", wide, "50% 50%", {
    ar: "موس ومقص ومشط على قماش أسود",
    en: "A straight razor, scissors and a comb on black cloth",
  }),

  /** Full-width interlude between the story and the services. TEMPORARY stock: Pexels 5450144. */
  craftVideo: clip("stock-razor-flame", wide, "50% 50%", {
    ar: "موس حلاقة بيتعقم على النار",
    en: "A straight razor being sterilised over a flame",
  }),

  /** The short-form gallery, tall clips. TEMPORARY stock: Pexels. */
  barberingVideos: [
    clip("stock-vertical-shave", tall, "50% 40%", {
      ar: "حلاقة ذقن بالموس",
      en: "A beard shaved with a razor",
    }),
    clip("stock-vertical-clippers", tall, "50% 30%", {
      ar: "حلاق ماسك الماكينة",
      en: "A barber with his clippers",
    }),
    clip("stock-vertical-haircut", tall, "50% 35%", {
      ar: "قصة شعر بالمقص والمشط",
      en: "A haircut with scissors and comb",
    }),
    clip("stock-vertical-tools", tall, "50% 50%", {
      ar: "أدوات الحلاقة على الترابيزة",
      en: "Barber's tools laid out on the counter",
    }),
  ],

  /** One clip per service group, in the copy's order. TEMPORARY stock. */
  servicesVideos: [
    clip("stock-beard-shaping", wide, "60% 50%", {
      ar: "حلاق بيظبط ذقن راجل بالموس",
      en: "A barber shaping a man's beard with a razor",
    }),
    clip("stock-hair-colour", tall, "50% 30%", {
      ar: "صبغة بتتحط على شعر راجل بالفرشاة",
      en: "Colour being brushed onto a man's hair",
    }),
    clip("stock-face-mask", [1000, 527], "50% 50%", {
      ar: "ماسك طين بيتحط على وش راجل بالفرشاة",
      en: "A clay mask being brushed onto a man's face",
    }),
  ],

  /** The groom feature. TEMPORARY stock: Mixkit 5185. */
  groomExperienceVideo: clip("stock-groom-bow-tie", wide, "62% 45%", {
    ar: "عريس بيظبط البيبيون بتاعه",
    en: "A groom adjusting his bow tie",
  }),

  /** Beside the groom film. TEMPORARY stock photo (Pexels). */
  groomStill: {
    src: "/photos-temporary/groom-in-suit-hair-styling.webp",
    width: 700,
    height: 933,
    alt: { ar: "شعر عريس بيتظبط قبل الفرح", en: "A groom's hair being styled before the wedding" },
    position: "50% 30%",
    temporary: true,
  } satisfies Still,

  /** Behind the title of each inner page. TEMPORARY stock photos (Pexels); not a branch. */
  pageHeroes: {
    services: {
      src: "/photos-temporary/barber-cutting-hair-wide.webp",
      width: 1800,
      height: 1200,
      alt: { ar: "", en: "" },
      position: "50% 35%",
      temporary: true,
    },
    groom: {
      src: "/photos-temporary/groom-in-suit-barber-chair.webp",
      width: 1400,
      height: 2058,
      alt: { ar: "", en: "" },
      position: "50% 30%",
      temporary: true,
    },
    branches: {
      src: "/photos-temporary/leather-barber-chairs-brick-wall.webp",
      width: 1800,
      height: 1200,
      alt: { ar: "", en: "" },
      position: "50% 55%",
      temporary: true,
    },
  } satisfies Record<string, Still>,

  /**
   * Atmosphere behind the branches and the closing. Not any specific branch.
   * TEMPORARY stock: Mixkit 43236 (crop keeps another shop's logo out of frame).
   */
  branchAtmosphere: clip("stock-barber-chairs", wide, "12% 50%", {
    ar: "كراسي حلاقة جلد في صالون",
    en: "Leather barber chairs in a salon",
  }),
} as const;
