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

/** The Pexels License does not require a visible credit. */
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

const pexels = (page: string, title: string, credit: string, edits: string): StockSource => ({
  title,
  credit: `${credit}, via Pexels`,
  licence: "Pexels License (https://www.pexels.com/license/)",
  url: `https://www.pexels.com/photo/${page}/`,
  edits,
});

export const photos = {
  /** Branch pages. */
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
  /** Branch pages. */
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
  /** Groom package and branch pages. */
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
  /** Branch pages. */
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
  /** Homepage protein, treatment and colour service. */
  flatIron: {
    src: "/photos-temporary/flat-iron-on-mans-short-hair.webp",
    width: 1800,
    height: 1200,
    alt: {
      ar: "حلاق بيفرد شعر عميل بالمكواة",
      en: "Barber smoothing a client's hair with a flat iron",
    },
    source: pexels(
      "a-person-holding-a-hair-iron-3916358",
      "A Person Holding a Hair Iron",
      "Davis Sánchez",
      "Warmer tone, less saturated",
    ),
  },
  /** Homepage skin and care service. */
  clayMask: {
    src: "/photos-temporary/clay-mask-brushed-on-mans-face.webp",
    width: 1400,
    height: 1974,
    alt: {
      ar: "شاب على وشه ماسك بيتفرد بالفرشة",
      en: "Young man with a mask being spread on his face with a brush",
    },
    source: pexels(
      "young-man-spreading-a-white-face-mask-with-a-brush-on-his-face-16672782",
      "Young Man Spreading a White Face Mask with a Brush on His Face",
      "Shiwa Yachachin",
      "Cropped, brighter and warmer tone",
    ),
  },
  /** Homepage groom package. */
  groomChair: {
    src: "/photos-temporary/groom-in-suit-barber-chair.webp",
    width: 1400,
    height: 2058,
    alt: {
      ar: "شاب ببدلة شيك قاعد على كرسي الحلاق بيجهز",
      en: "Man in a formal suit reclining in a barber's chair as he gets ready",
    },
    source: pexels(
      "man-in-elegant-suit-sitting-in-barbers-chair-17015346",
      "Man in Elegant Suit Sitting in Barbers Chair",
      "Luiz Woellner Fotografia",
      "Cropped, brighter and warmer tone",
    ),
  },
  /** Homepage booking section, the last image before the footer. */
  readyChair: {
    src: "/photos-temporary/vintage-barber-chair-ready.webp",
    width: 1500,
    height: 2250,
    alt: {
      ar: "كرسي حلاقة كلاسيك فاضي ومستني العميل اللي جاي",
      en: "Classic barber chair standing empty, ready for the next client",
    },
    source: pexels(
      "barber-chair-in-a-barber-shop-12201170",
      "Barber Chair in a Barber Shop",
      "Filip Rankovic Grobgaard",
      "Warmer tone, less saturated",
    ),
  },
  /** Homepage hero. */
  barberAtWork: {
    src: "/photos-temporary/barber-at-work-portrait.webp",
    width: 1500,
    height: 2115,
    alt: {
      ar: "حلاق مركز وهو بيظبط قصة عميل بالموس",
      en: "Barber concentrating on a client's cut with a razor",
    },
    source: pexels(
      "barber-cutting-person-s-hair-2076930",
      "Barber Cutting Person's Hair",
      "Th2city Santana",
      "Cropped, warmer tone, less saturated",
    ),
  },
  /** Homepage haircut-and-beard service. */
  beardChair: {
    src: "/photos-temporary/beard-shaping-close-up.webp",
    width: 1500,
    height: 1313,
    alt: {
      ar: "حلاق بيحدد ذقن عميل على الكرسي",
      en: "Barber shaping a client's beard in the chair",
    },
    source: pexels(
      "a-barber-grooming-a-man-s-beard-2881253",
      "A Barber Grooming A Man's Beard",
      "Th2city Santana",
      "Cropped to the hands and beard, warmer tone",
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
