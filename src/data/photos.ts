import type { Localized } from "@/i18n/config";

/**
 * TEMPORARY photos. None shows real El Mozayen staff, clients or branches.
 * Replace every entry before launch.
 */
export interface Photo {
  readonly src: string;
  readonly width: number;
  readonly height: number;
  readonly alt: Localized;
  readonly source: HandoffSource | StockSource;
}

/**
 * Crops of one image: slide 1 of Sayed_Rabie_Website_Competitor_Analysis_v2.pptx.pdf,
 * origin and licence unknown.
 */
interface HandoffSource {
  /** File in design-handoff/assets/photos-temporary this was converted from. */
  readonly handoffFile: string;
}

/**
 * CC BY photos need this credit shown to visitors if they are ever published.
 * The Pexels License does not require one.
 */
interface StockSource {
  readonly title: string;
  readonly credit: string;
  readonly licence: string;
  readonly url: string;
  readonly edits: string;
}

const photo = (
  name: string,
  width: number,
  height: number,
  handoffFile: string,
  alt: Localized,
): Photo => ({
  src: `/photos-temporary/${name}.webp`,
  width,
  height,
  alt,
  source: { handoffFile },
});

const stojkovic = (title: string, edits: string): StockSource => ({
  title,
  credit: "Nenad Stojkovic, via Wikimedia Commons",
  licence: "CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/)",
  url: `https://commons.wikimedia.org/wiki/File:${title.replaceAll(" ", "_")}`,
  edits,
});

const pexels = (page: string, title: string, credit: string, edits: string): StockSource => ({
  title,
  credit: `${credit}, via Pexels`,
  licence: "Pexels License (https://www.pexels.com/license/)",
  url: `https://www.pexels.com/photo/${page}/`,
  edits,
});

const heroAlt: Localized = {
  ar: "إيد حلاق بتقص شعر عميل بالمشط والمكنة، صورة من قريب",
  en: "Close-up of a barber's hands cutting a client's hair with a comb and clippers",
};

export const photos = {
  /** Mirrored for right-to-left text; flipped back for English. */
  heroWide: {
    src: "/photos-temporary/barber-comb-and-clipper-cut-wide.webp",
    width: 1280,
    height: 854,
    alt: heroAlt,
    source: stojkovic(
      "Barber cutting hair with comb. Back view of man in barber shop.jpg",
      "Mirrored, comb brand name removed",
    ),
  },
  heroPortrait: {
    src: "/photos-temporary/barber-comb-and-clipper-cut-portrait.webp",
    width: 1000,
    height: 1172,
    alt: heroAlt,
    source: stojkovic(
      "Barber cutting hair with comb. Back view of young man in barber shop.jpg",
      "Cropped, comb brand name removed",
    ),
  },
  /** Homepage haircut-and-beard service. */
  razorBeard: {
    src: "/photos-temporary/straight-razor-beard-line-up.webp",
    width: 1280,
    height: 812,
    alt: {
      ar: "حلاق بيحدد ذقن عميل بالموس",
      en: "Barber shaping a client's beard with a straight razor",
    },
    source: stojkovic(
      "Attractive hairdresser is shaving male beard with the knife.jpg",
      "Cropped, warmer tone",
    ),
  },
  /** Homepage protein, treatment and colour service. */
  hairColour: {
    src: "/photos-temporary/hair-colour-brush-on-mans-hair.webp",
    width: 1300,
    height: 1039,
    alt: {
      ar: "إيدين بجوانتي بتحط صبغة بالفرشة على شعر راجل",
      en: "Gloved hands brushing colour onto a man's hair",
    },
    source: pexels(
      "woman-applying-hair-dye-on-black-client-7388941",
      "Woman applying hair dye on black client",
      "John Diez",
      "Cropped to the hands and hair; teal background and clothing recoloured to warm beige",
    ),
  },
  /** Homepage skin and care service. */
  faceMask: {
    src: "/photos-temporary/face-mask-brushed-on-man.webp",
    width: 1600,
    height: 1247,
    alt: {
      ar: "حلاق بيحط ماسك بالفرشة على وش عميل نايم على الكرسي",
      en: "Barber brushing a face mask onto a reclining client",
    },
    source: pexels(
      "man-at-beautician-18704463",
      "Man at Beautician",
      "Macrookai filmmaker",
      "Cropped, warmer tone",
    ),
  },
  /** Homepage groom package. */
  groomStyling: {
    src: "/photos-temporary/groom-in-suit-hair-styling.webp",
    width: 1400,
    height: 1705,
    alt: {
      ar: "شاب ببدلة وكرافتة وحلاق بيظبط شعره بالمشط والمقص",
      en: "Young man in a suit and tie having his hair finished with comb and scissors",
    },
    source: pexels(
      "man-receiving-haircut-at-barbershop-35556916",
      "Man Receiving Haircut at Barbershop",
      "Alexander Mass",
      "Cropped, warmer tone",
    ),
  },
  /** Homepage story section, the last image before the footer. */
  leatherChairs: {
    src: "/photos-temporary/leather-barber-chairs-brick-wall.webp",
    width: 1800,
    height: 1200,
    alt: {
      ar: "كراسي حلاقة جلد قدام مرايات وحيطة طوب",
      en: "Leather barber chairs facing mirrors on a brick wall",
    },
    source: pexels(
      "brown-leather-barbers-chairs-in-a-barber-shop-13138476",
      "Brown Leather Barbers Chairs in a Barber Shop",
      "Marvin Sacdalan",
      "Darkened, warmer tone",
    ),
  },
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
