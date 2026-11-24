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
  /** Branch pages exist only for branches with detail content. */
  readonly detail?: BranchDetail;
}

const unverifiedOperations = {
  address: pending,
  landmark: pending,
  parking: pending,
  hours: pending,
  directionsUrl: pending,
} as const;

const addressPending: Localized = { ar: "العنوان لسه بيتأكد", en: "Address being confirmed" };

const records: Record<BranchId, Omit<Branch, "id">> = {
  mohandessin: {
    region: "giza",
    name: { ar: "المهندسين", en: "Mohandessin" },
    pendingNote: addressPending,
    ...unverifiedOperations,
  },
  "sheikh-zayed": {
    region: "giza",
    name: { ar: "الشيخ زايد", en: "Sheikh Zayed" },
    pendingNote: addressPending,
    ...unverifiedOperations,
  },
  "hadayek-october": {
    region: "giza",
    name: { ar: "حدائق أكتوبر", en: "October Gardens" },
    pendingNote: addressPending,
    ...unverifiedOperations,
  },
  madinaty: {
    region: "new-cairo",
    name: { ar: "مدينتي", en: "Madinaty" },
    bookingLabel: { ar: "مدينتي · East Hub", en: "Madinaty · East Hub" },
    area: { ar: "East Hub", en: "East Hub" },
    ...unverifiedOperations,
    detail: {
      linkLabel: { ar: "حلاق في مدينتي", en: "Barber in Madinaty" },
      heading: {
        ar: "حلاق في مدينتي – سيد ربيع المزين فرع مدينتي",
        en: "Barber in Madinaty – Sayed Rabie, Madinaty branch",
      },
      intro: {
        ar: "في East Hub في مدينتي، قريب من سكان مدينتي والشروق.",
        en: "At East Hub in Madinaty. Easy for anyone living in Madinaty or El Shorouk.",
      },
      metaTitle: {
        ar: "حلاق في مدينتي – East Hub | سيد ربيع المزين",
        en: "Barber in Madinaty – East Hub | Sayed Rabie",
      },
      metaDescription: {
        ar: "حلاق رجالي في مدينتي في East Hub: قص شعر وفيد وتحديد ذقن وعناية بالبشرة. اطلب معادك في فرع مدينتي من سيد ربيع المزين، وفريق الفرع يأكدلك المتاح.",
        en: "Men's barber in Madinaty at East Hub: haircuts, beard trims and skin care. Request your preferred time and the branch team will confirm availability.",
      },
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
      questions: [
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
        },
      ],
    },
  },
  midtown: {
    region: "new-cairo",
    name: { ar: "Midtown", en: "Midtown" },
    bookingLabel: { ar: "Midtown · التجمع", en: "Midtown · New Cairo" },
    area: { ar: "Midtown Mall · التجمع", en: "Midtown Mall · New Cairo" },
    ...unverifiedOperations,
  },
  triumph: {
    region: "new-cairo",
    name: { ar: "فندق Triumph", en: "Triumph Hotel" },
    area: { ar: "جوه الفندق · التجمع", en: "Inside the hotel · New Cairo" },
    ...unverifiedOperations,
  },
  rehab: {
    region: "new-cairo",
    name: { ar: "الرحاب", en: "Rehab" },
    pendingNote: addressPending,
    ...unverifiedOperations,
  },
  seashell: {
    region: "north-coast",
    name: { ar: "سي شل", en: "Seashell" },
    note: { ar: "مواعيد الموسم يأكدها الفرع", en: "Season dates confirmed by the branch" },
    pendingNote: { ar: "موسمي · المواعيد لسه بتتأكد", en: "Seasonal · dates being confirmed" },
    ...unverifiedOperations,
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
