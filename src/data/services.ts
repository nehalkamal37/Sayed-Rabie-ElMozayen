import type { Localized } from "@/i18n/config";
import { photos, type Photo } from "./photos";
import { pending, type Verifiable } from "./verification";
import type { BranchId } from "./branches";

export const serviceGroupIds = ["cut-beard", "hair-care", "skin-care", "kids", "groom"] as const;
export type ServiceGroupId = (typeof serviceGroupIds)[number];

export interface ServiceGroup {
  /** Also the section's anchor on the services page. */
  readonly id: ServiceGroupId;
  readonly name: Localized;
  readonly photo: Photo;
  readonly photoPosition: string;
}

export const serviceGroups: readonly ServiceGroup[] = [
  {
    id: "cut-beard",
    name: { ar: "القص والذقن", en: "Haircut & beard" },
    photo: photos.cut,
    photoPosition: "50% 25%",
  },
  {
    id: "hair-care",
    name: { ar: "علاج وصبغة الشعر", en: "Hair treatments & colour" },
    photo: photos.beard,
    photoPosition: "50% 20%",
  },
  {
    id: "skin-care",
    name: { ar: "البشرة والعناية", en: "Skin & care" },
    photo: photos.chair,
    photoPosition: "50% 50%",
  },
  { id: "kids", name: { ar: "الأطفال", en: "Kids" }, photo: photos.story, photoPosition: "50% 40%" },
  { id: "groom", name: { ar: "العريس", en: "Groom" }, photo: photos.groom, photoPosition: "50% 20%" },
];

export const serviceIds = [
  "haircut-beard",
  "haircut",
  "beard-trim",
  "skin-fade",
  "hair-protein",
  "hair-treatment",
  "hair-beard-colour",
  "facial-cleansing",
  "manicure-pedicure",
  "kids-haircut",
  "groom-package",
] as const;
export type ServiceId = (typeof serviceIds)[number];

export interface Service {
  readonly id: ServiceId;
  readonly group: ServiceGroupId;
  readonly name: Localized;
  readonly description: Localized;
  /** Shorter wording for phones, where the approved screens use one. */
  readonly shortDescription?: Localized;
  readonly popular?: boolean;
  /** Extra line in the booking service list. */
  readonly note?: Localized;
  readonly minutes: Verifiable<number>;
  /** Egyptian pounds. */
  readonly price: Verifiable<number>;
  readonly availableAt: Verifiable<readonly BranchId[]>;
}

const unverified = { minutes: pending, price: pending, availableAt: pending } as const;

const records: Record<ServiceId, Omit<Service, "id">> = {
  "haircut-beard": {
    group: "cut-beard",
    name: { ar: "قص + ذقن", en: "Haircut + beard" },
    description: { ar: "قصة وتحديد ذقن في قعدة واحدة.", en: "A cut and a beard trim in one visit." },
    popular: true,
    ...unverified,
  },
  haircut: {
    group: "cut-beard",
    name: { ar: "قص شعر رجالي", en: "Men's haircut" },
    description: { ar: "استشارة + قصة + غسيل واستشوار.", en: "Consultation, cut, wash & style." },
    ...unverified,
  },
  "beard-trim": {
    group: "cut-beard",
    name: { ar: "تحديد ذقن", en: "Beard trim" },
    description: { ar: "بالموس والفوطة السخنة وزيت الذقن.", en: "Straight razor, hot towel, beard oil." },
    ...unverified,
  },
  "skin-fade": {
    group: "cut-beard",
    name: { ar: "فيد", en: "Skin fade" },
    description: { ar: "تدريج ناعم من الجلد للطول.", en: "Smooth blend from skin to length." },
    ...unverified,
  },
  "hair-protein": {
    group: "hair-care",
    name: { ar: "بروتين للشعر", en: "Hair protein" },
    description: { ar: "لفرد الشعر الهايش والمجعد.", en: "Smooths frizzy, curly hair." },
    ...unverified,
  },
  "hair-treatment": {
    group: "hair-care",
    name: { ar: "علاج شعر", en: "Hair treatment" },
    description: { ar: "للشعر الناشف والمجهد.", en: "For dry, tired hair." },
    ...unverified,
  },
  "hair-beard-colour": {
    group: "hair-care",
    name: { ar: "صبغة شعر أو ذقن", en: "Hair or beard colour" },
    description: { ar: "لون طبيعي أو تغطية شيب.", en: "Natural colour or grey coverage." },
    ...unverified,
  },
  "facial-cleansing": {
    group: "skin-care",
    name: { ar: "تنظيف بشرة", en: "Facial cleansing" },
    description: { ar: "تنظيف عميق + بخار + ماسك.", en: "Deep clean, steam & mask." },
    ...unverified,
  },
  "manicure-pedicure": {
    group: "skin-care",
    name: { ar: "منيكير وبديكير", en: "Manicure & pedicure" },
    description: { ar: "عناية كاملة للإيدين والرجلين.", en: "Full hand & foot care." },
    ...unverified,
  },
  "kids-haircut": {
    group: "kids",
    name: { ar: "حلاقة أطفال", en: "Kids' haircut" },
    description: {
      ar: "حلاقين متعودين على الصغيرين، ومن غير استعجال.",
      en: "Barbers used to little ones, and no rush.",
    },
    ...unverified,
  },
  "groom-package": {
    group: "groom",
    name: { ar: "باكدج العريس", en: "Groom package" },
    description: {
      ar: "قصة واستشوار، ذقن بالفوطة السخنة، تنظيف بشرة ومنيكير.",
      en: "Haircut & styling, hot-towel beard trim, facial cleansing and manicure.",
    },
    shortDescription: {
      ar: "قصة، ذقن بالفوطة السخنة، بشرة ومنيكير.",
      en: "Haircut, hot-towel beard, facial and manicure.",
    },
    note: {
      ar: "استفسار، والتفاصيل يأكدها الفرع",
      en: "Enquiry, details confirmed by the branch",
    },
    ...unverified,
  },
};

export const services: readonly Service[] = serviceIds.map((id) => ({ id, ...records[id] }));

/** Shown on branch pages. */
export const topServiceIds: readonly ServiceId[] = [
  "haircut-beard",
  "haircut",
  "beard-trim",
  "skin-fade",
  "hair-protein",
  "facial-cleansing",
];

export function getService(id: ServiceId): Service {
  return { id, ...records[id] };
}

export function parseServiceId(value: string | null | undefined): ServiceId | null {
  return serviceIds.find((id) => id === value) ?? null;
}

export function servicesInGroup(group: ServiceGroupId): readonly Service[] {
  return services.filter((service) => service.group === group);
}
