import type { Localized } from "@/i18n/config";
import { photos, type Photo } from "./photos";
import { pending, type Verifiable } from "./verification";

export const regionIds = ["giza", "new-cairo", "north-coast"] as const;
export type RegionId = (typeof regionIds)[number];

export const regionNames: Record<RegionId, Localized> = {
  giza: { ar: "الجيزة", en: "Giza" },
  "new-cairo": { ar: "القاهرة الجديدة", en: "New Cairo" },
  "north-coast": { ar: "الساحل الشمالي", en: "North Coast" },
};

/** Fits the three-way switch on phones. */
export const regionTabNames: Record<RegionId, Localized> = {
  ...regionNames,
  "north-coast": { ar: "الساحل", en: "Coast" },
};

export const defaultRegionId: RegionId = "new-cairo";

export const branchIds = [
  "mohandessin",
  "sheikh-zayed",
  "hadayek-october",
  "madinaty",
  "midtown",
  "triumph",
  "rehab",
  "seashell",
] as const;
export type BranchId = (typeof branchIds)[number];

/** Egyptian week order. `day` matches Date.getUTCDay(). */
export const weekDays = [
  { id: "sat", day: 6, name: { ar: "السبت", en: "Saturday" } },
  { id: "sun", day: 0, name: { ar: "الحد", en: "Sunday" } },
  { id: "mon", day: 1, name: { ar: "الاتنين", en: "Monday" } },
  { id: "tue", day: 2, name: { ar: "التلات", en: "Tuesday" } },
  { id: "wed", day: 3, name: { ar: "الأربع", en: "Wednesday" } },
  { id: "thu", day: 4, name: { ar: "الخميس", en: "Thursday" } },
  { id: "fri", day: 5, name: { ar: "الجمعة", en: "Friday" } },
] as const satisfies readonly { id: string; day: number; name: Localized }[];
export type WeekDayId = (typeof weekDays)[number]["id"];

export interface BranchPhoto {
  readonly photo: Photo;
  readonly alt: Localized;
  readonly position: string;
}

/** A question can be published before the client supplies its answer. */
export interface BranchQuestion {
  readonly question: Localized;
  readonly answer: Verifiable<Localized>;
  /** Supplied advice that holds whatever the answer turns out to be. */
  readonly tip?: Localized;
}

/** Everything the reusable branch page needs. */
export interface BranchDetail {
  /** Local-search anchor text for internal links, "barber in + area". */
  readonly linkLabel: Localized;
  readonly heading: Localized;
  readonly intro: Localized;
  readonly metaTitle: Localized;
  readonly metaDescription: Localized;
  readonly cover: BranchPhoto;
  readonly gallery: readonly BranchPhoto[];
  readonly questions: readonly BranchQuestion[];
}

export interface Branch {
  readonly id: BranchId;
  readonly region: RegionId;
  readonly name: Localized;
  /** Name plus landmark, for booking controls. Falls back to the name. */
  readonly bookingLabel?: Localized;
  /** Confirmed landmark or district shown under the name. */
  readonly area?: Localized;
  readonly note?: Localized;
  /** Stands in for the area while the location is unconfirmed. */
  readonly pendingNote?: Localized;
  readonly address: Verifiable<Localized>;
  readonly landmark: Verifiable<Localized>;
  readonly parking: Verifiable<Localized>;
  readonly hours: Verifiable<Readonly<Record<WeekDayId, Localized>>>;
  readonly directionsUrl: Verifiable<string>;
  /** Not yet signed off by the client: labelled on every page and kept out of search. */
  readonly draft?: true;
  readonly detail: BranchDetail;
}

const unverifiedOperations = {
  address: pending,
  landmark: pending,
  parking: pending,
  hours: pending,
  directionsUrl: pending,
} as const;

const addressPending: Localized = { ar: "العنوان لسه بيتأكد", en: "Address being confirmed" };

/** The same three questions on every branch page, answered per branch by the client. */
const unansweredQuestions: readonly BranchQuestion[] = [
  {
    question: { ar: "فيه باركن قريب من الفرع؟", en: "Is there parking near the branch?" },
    answer: pending,
  },
  {
    question: { ar: "الفرع مفتوح لحد امتى؟", en: "How late is the branch open?" },
    answer: pending,
  },
  {
    question: { ar: "ينفع آجي من غير حجز؟", en: "Can I walk in without booking?" },
    answer: pending,
    tip: {
      ar: "يفضل الحجز خميس وجمعة وقبل الأعياد.",
      en: "We recommend booking on Thursdays, Fridays and before holidays.",
    },
  },
];

/** Stock stand-ins until each branch is photographed. */
const previewPhotos = {
  cover: {
    photo: photos.leatherChairs,
    alt: {
      ar: "كراسي حلاقة جلد (صورة للمعاينة، مش من الفرع)",
      en: "Leather barber chairs (preview photo, not the branch)",
    },
    position: "0% 60%",
  },
  gallery: [
    {
      photo: photos.faceMask,
      alt: {
        ar: "حلاق بيحط ماسك لعميل (صورة للمعاينة)",
        en: "Barber applying a face mask (preview photo)",
      },
      position: "50% 40%",
    },
    {
      photo: photos.hairColour,
      alt: {
        ar: "صبغة بالفرشة على شعر راجل (صورة للمعاينة)",
        en: "Colour brushed onto a man's hair (preview photo)",
      },
      position: "50% 50%",
    },
    {
      photo: photos.groomStyling,
      alt: {
        ar: "حلاق بيظبط شعر شاب ببدلة (صورة للمعاينة)",
        en: "Barber finishing a suited client's hair (preview photo)",
      },
      position: "50% 20%",
    },
  ],
} as const;

interface DetailCopy {
  /** "Barber in + area". */
  readonly linkLabel: Localized;
  /** Branch name as it reads after "branch". */
  readonly branchName: Localized;
  readonly intro: Localized;
  readonly metaTitle: Localized;
  readonly metaDescription: Localized;
}

function branchDetail(
  { branchName, ...copy }: DetailCopy,
  media: Pick<BranchDetail, "cover" | "gallery"> = previewPhotos,
): BranchDetail {
  return {
    ...copy,
    heading: {
      ar: `${copy.linkLabel.ar} – سيد ربيع المزين فرع ${branchName.ar}`,
      en: `${copy.linkLabel.en} – Saeid Rabie ${branchName.en}`,
    },
    ...media,
    questions: unansweredQuestions,
  };
}

const records: Record<BranchId, Omit<Branch, "id">> = {
  mohandessin: {
    region: "giza",
    name: { ar: "المهندسين", en: "Mohandessin" },
    pendingNote: addressPending,
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في المهندسين", en: "Barber in Mohandessin" },
      branchName: { ar: "المهندسين", en: "Mohandessin" },
      intro: {
        ar: "في قلب المهندسين. مناسب لو طالع من التمرين أو الشغل وعايز تتظبط بسرعة.",
        en: "In the heart of Mohandessin. Perfect for a quick sharpen-up after training or work.",
      },
      metaTitle: {
        ar: "حلاق في المهندسين | سيد ربيع المزين",
        en: "Barber in Mohandessin | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في المهندسين، مناسب لو طالع من التمرين أو الشغل وعايز تتظبط بسرعة. اختار الخدمة واليوم واطلب معادك في سيد ربيع المزين والفرع يأكدلك المتاح.",
        en: "Men's barber in Mohandessin, perfect for a quick sharpen-up after training or work. Request your time with Saeid Rabie and the branch will confirm it.",
      },
    }),
  },
  "sheikh-zayed": {
    region: "giza",
    name: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    pendingNote: addressPending,
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في الشيخ زايد", en: "Barber in Sheikh Zayed" },
      branchName: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
      intro: {
        ar: "فرع سيد ربيع المزين في الشيخ زايد. مكان الفرع بالتفصيل لسه بيتأكد.",
        en: "The Saeid Rabie branch in Sheikh Zayed. The exact location is being confirmed.",
      },
      metaTitle: {
        ar: "حلاق في الشيخ زايد | سيد ربيع المزين",
        en: "Barber in Sheikh Zayed | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في الشيخ زايد من سيد ربيع المزين. من غير تسجيل ولا حساب: اختار الخدمة واليوم والوقت اللي يناسبك واطلب معادك، وفريق الفرع يأكدلك المتاح.",
        en: "Men's barber in Sheikh Zayed by Saeid Rabie. No sign-up and no account: pick a service, a day and a time, and the branch team will confirm what's free.",
      },
    }),
  },
  "hadayek-october": {
    region: "giza",
    name: { ar: "حدائق أكتوبر", en: "October Gardens" },
    pendingNote: addressPending,
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في حدائق أكتوبر", en: "Barber in October Gardens" },
      branchName: { ar: "حدائق أكتوبر", en: "October Gardens" },
      intro: {
        ar: "فرع سيد ربيع المزين في حدائق أكتوبر. مكان الفرع بالتفصيل لسه بيتأكد.",
        en: "The Saeid Rabie branch in October Gardens. The exact location is being confirmed.",
      },
      metaTitle: {
        ar: "حلاق في حدائق أكتوبر | سيد ربيع المزين",
        en: "Barber in October Gardens | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في حدائق أكتوبر من سيد ربيع المزين. قولنا الخدمة واليوم والوقت اللي يناسبك واطلب معادك أونلاين من غير تسجيل، وفريق الفرع يأكدلك المتاح.",
        en: "Men's barber in October Gardens by Saeid Rabie. Tell us the service, day and time that suit you, send your request online and the branch will confirm.",
      },
    }),
  },
  madinaty: {
    region: "new-cairo",
    name: { ar: "مدينتي", en: "Madinaty" },
    bookingLabel: { ar: "مدينتي · East Hub", en: "Madinaty · East Hub" },
    area: { ar: "East Hub", en: "East Hub" },
    ...unverifiedOperations,
    detail: branchDetail(
      {
        linkLabel: { ar: "حلاق في مدينتي", en: "Barber in Madinaty" },
        branchName: { ar: "مدينتي", en: "Madinaty" },
        intro: {
          ar: "في East Hub في مدينتي، قريب من سكان مدينتي والشروق.",
          en: "At East Hub in Madinaty. Easy for anyone living in Madinaty or El Shorouk.",
        },
        metaTitle: {
          ar: "حلاق في مدينتي – East Hub | سيد ربيع المزين",
          en: "Barber in Madinaty – East Hub | Saeid Rabie",
        },
        metaDescription: {
          ar: "حلاق رجالي في مدينتي في East Hub: قص شعر وفيد وتحديد ذقن وعناية بالبشرة. اطلب معادك في فرع مدينتي من سيد ربيع المزين، وفريق الفرع يأكدلك المتاح.",
          en: "Men's barber in Madinaty at East Hub: haircuts, beard trims and skin care. Request your preferred time and the branch team will confirm availability.",
        },
      },
      {
        cover: {
          photo: photos.chair,
          alt: {
            ar: "كرسي حلاقة جلد (صورة للمعاينة، مش من الفرع)",
            en: "Leather barber chair (preview photo, not the branch)",
          },
          position: "50% 45%",
        },
        gallery: [
          {
            photo: photos.story,
            alt: { ar: "مراية وإضاءة دافية (صورة للمعاينة)", en: "Mirror and warm light (preview photo)" },
            position: "50% 30%",
          },
          {
            photo: photos.cut,
            alt: { ar: "حلاق شغال بالمقص (صورة للمعاينة)", en: "Barber at work with scissors (preview photo)" },
            position: "50% 20%",
          },
          {
            photo: photos.groom,
            alt: { ar: "عميل بعد القصة (صورة للمعاينة)", en: "Client after a haircut (preview photo)" },
            position: "50% 20%",
          },
        ],
      },
    ),
  },
  midtown: {
    region: "new-cairo",
    name: { ar: "Midtown", en: "Midtown" },
    bookingLabel: { ar: "Midtown · التجمع", en: "Midtown · New Cairo" },
    area: { ar: "Midtown Mall · التجمع", en: "Midtown Mall · New Cairo" },
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في التجمع الخامس", en: "Barber in New Cairo" },
      branchName: { ar: "Midtown", en: "Midtown" },
      intro: {
        ar: "فرع التجمع في Midtown Mall.",
        en: "Our New Cairo branch at Midtown Mall.",
      },
      metaTitle: {
        ar: "حلاق في التجمع الخامس – Midtown | سيد ربيع المزين",
        en: "Barber in New Cairo – Midtown Mall | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في التجمع الخامس في Midtown Mall من سيد ربيع المزين. اختار الخدمة واليوم والوقت اللي يناسبك واطلب معادك، وفريق الفرع يأكدلك المتاح.",
        en: "Men's barber in New Cairo, at Midtown Mall, by Saeid Rabie. Pick a service, a day and a time online, and the branch team will confirm what's available.",
      },
    }),
  },
  triumph: {
    region: "new-cairo",
    name: { ar: "فندق Triumph", en: "Triumph Hotel" },
    area: { ar: "جوه الفندق · التجمع", en: "Inside the hotel · New Cairo" },
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في فندق ترايمف", en: "Barber at Triumph Hotel" },
      branchName: { ar: "Triumph", en: "Triumph" },
      intro: {
        ar: "جوه فندق Triumph، هادي ومناسب لضيوف الفندق ولأي حد عايز خدمة VIP.",
        en: "Inside the Triumph Hotel. Quiet, private, and ideal for hotel guests or anyone after a VIP experience.",
      },
      metaTitle: {
        ar: "حلاق في فندق ترايمف التجمع | سيد ربيع المزين",
        en: "Barber at Triumph Hotel, New Cairo | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في فندق ترايمف في التجمع من سيد ربيع المزين، هادي ومناسب لضيوف الفندق. اختار الخدمة واليوم واطلب معادك، وفريق الفرع يأكدلك المتاح.",
        en: "Men's barber at Triumph Hotel, New Cairo. Quiet, private and ideal for hotel guests. Request your time with Saeid Rabie and the branch will confirm it.",
      },
    }),
  },
  rehab: {
    region: "new-cairo",
    name: { ar: "الرحاب", en: "Rehab" },
    pendingNote: addressPending,
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في الرحاب", en: "Barber in Rehab City" },
      branchName: { ar: "الرحاب", en: "Rehab" },
      intro: {
        ar: "فرع سيد ربيع المزين في الرحاب. مكان الفرع بالتفصيل لسه بيتأكد.",
        en: "The Saeid Rabie branch in Rehab City. The exact location is being confirmed.",
      },
      metaTitle: {
        ar: "حلاق في الرحاب | سيد ربيع المزين",
        en: "Barber in Rehab City | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في الرحاب من سيد ربيع المزين. اختار اللوك بتاعك، والباقي علينا: حدد الخدمة واليوم واطلب معادك أونلاين من غير تسجيل، والفرع يأكدلك المتاح.",
        en: "Men's barber in Rehab City by Saeid Rabie. Choose your own look, we'll handle the rest: pick a service and a day online and the branch will confirm it.",
      },
    }),
  },
  seashell: {
    region: "north-coast",
    name: { ar: "سي شل", en: "Seashell" },
    note: { ar: "مواعيد الموسم يأكدها الفرع", en: "Season dates confirmed by the branch" },
    pendingNote: { ar: "موسمي · المواعيد لسه بتتأكد", en: "Seasonal · dates being confirmed" },
    draft: true,
    ...unverifiedOperations,
    detail: branchDetail({
      linkLabel: { ar: "حلاق في الساحل الشمالي", en: "Barber on the North Coast" },
      branchName: { ar: "سي شل", en: "Seashell" },
      intro: {
        ar: "مصيفك في الساحل مش لازم يعطل قصتك. مواعيد الموسم لسه بتتأكد.",
        en: "Summer on the North Coast doesn't mean skipping your cut. Season dates are being confirmed.",
      },
      metaTitle: {
        ar: "حلاق في الساحل الشمالي – سي شل | سيد ربيع المزين",
        en: "Barber on the North Coast – Seashell | Saeid Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في الساحل الشمالي في سي شل. مصيفك في الساحل مش لازم يعطل قصتك: اختار الخدمة واليوم واطلب معادك من سيد ربيع المزين والفرع يأكدلك المتاح.",
        en: "Men's barber on the North Coast at Seashell. Summer doesn't mean skipping your cut: request your time with Saeid Rabie and the branch will confirm it.",
      },
    }),
  },
};

export const branches: readonly Branch[] = branchIds.map((id) => ({ id, ...records[id] }));

export function getBranch(id: BranchId): Branch {
  return { id, ...records[id] };
}

export function parseBranchId(value: string | null | undefined): BranchId | null {
  return branchIds.find((id) => id === value) ?? null;
}

export function branchesInRegion(region: RegionId): readonly Branch[] {
  return branches.filter((branch) => branch.region === region);
}

export function branchPath(id: BranchId): string {
  return `/branches/${id}`;
}

/** Branch name as booking controls show it. */
export function bookingBranchName(branch: Branch): Localized {
  return branch.bookingLabel ?? branch.name;
}
