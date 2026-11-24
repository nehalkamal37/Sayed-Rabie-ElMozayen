import type { Dictionary } from "@/content";
import { bookingBranchName, getBranch, type BranchId } from "@/data/branches";
import { getService, type ServiceId } from "@/data/services";
import { localeMeta, type Locale } from "@/i18n/config";

export interface BookingDetails {
  /** YYYY-MM-DD */
  readonly date: string;
  /** HH:MM, 24-hour, or a TimePeriod */
  readonly time: string;
  readonly name: string;
  readonly mobile: string;
}

/** Parts of the day offered by the booking sheet. */
export const timePeriods = ["morning", "afternoon", "evening"] as const;
export type TimePeriod = (typeof timePeriods)[number];

export function parseTimePeriod(value: string): TimePeriod | null {
  return timePeriods.find((period) => period === value) ?? null;
}

/** Cairo time from which a period no longer makes sense for today. */
const periodEnds: Record<TimePeriod, string> = {
  morning: "12:00",
  afternoon: "17:00",
  evening: "24:00",
};

export interface BookingRequest extends BookingDetails {
  readonly branch: BranchId;
  readonly service: ServiceId;
}

export type DetailField = keyof BookingDetails;
export const detailFields: readonly DetailField[] = ["date", "time", "name", "mobile"];

type ErrorKey = Exclude<keyof Dictionary["booking"]["errors"], "summary" | "branch" | "service">;
export type DetailErrors = Partial<Record<DetailField, ErrorKey>>;

/** Current date and time in Cairo, whatever the visitor's timezone. */
export function cairoNow(now: Date = new Date()): { date: string; time: string } {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Cairo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const part = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((entry) => entry.type === type)?.value ?? "";
  return {
    date: `${part("year")}-${part("month")}-${part("day")}`,
    time: `${part("hour")}:${part("minute")}`,
  };
}

/** Moves a YYYY-MM-DD date by whole days. */
export function addDays(date: string, days: number): string {
  const value = new Date(`${date}T00:00:00Z`);
  value.setUTCDate(value.getUTCDate() + days);
  return value.toISOString().slice(0, 10);
}

/** The furthest date we accept, one year on, to catch mistyped years. */
export function latestDate(today: string): string {
  return `${Number(today.slice(0, 4)) + 1}${today.slice(4)}`;
}

/** Converts Arabic-Indic and Persian digits to 0-9. */
function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (digit) => String((digit.codePointAt(0) ?? 0) & 0xf));
}

/**
 * Returns a clean mobile number, or null when it is not valid. Egyptian numbers
 * become 01XXXXXXXXX; other countries need a leading + or 00.
 */
export function normalizeMobile(value: string): string | null {
  const compact = toLatinDigits(value)
    .replace(/[\s().\-‎‏⁦-⁩]/g, "")
    .replace(/^00/, "+");
  const egyptian = /^(?:\+?20|0)?(1[0125]\d{8})$/.exec(compact);
  if (egyptian) return `0${egyptian[1]}`;
  if (compact.startsWith("+20")) return null;
  return /^\+[1-9]\d{7,14}$/.test(compact) ? compact : null;
}

export function validateDetails(
  details: BookingDetails,
  now: { date: string; time: string },
): DetailErrors {
  const errors: DetailErrors = {};

  if (!/^\d{4}-\d{2}-\d{2}$/.test(details.date)) errors.date = "dateRequired";
  else if (details.date < now.date) errors.date = "datePast";
  else if (details.date > latestDate(now.date)) errors.date = "dateFar";

  const period = parseTimePeriod(details.time);
  const deadline = period ? periodEnds[period] : details.time;
  if (!/^\d{2}:\d{2}$/.test(deadline)) errors.time = "timeRequired";
  else if (details.date === now.date && deadline <= now.time) errors.time = "timePast";

  if (!details.name.trim()) errors.name = "nameRequired";

  if (!details.mobile.trim()) errors.mobile = "mobileRequired";
  else if (!normalizeMobile(details.mobile)) errors.mobile = "mobileInvalid";

  return errors;
}

export function formatDate(locale: Locale, date: string): string {
  return formatDay(locale, date, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatDay(
  locale: Locale,
  date: string,
  options: Intl.DateTimeFormatOptions,
): string {
  const value = new Date(`${date}T00:00:00Z`);
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat(localeMeta[locale].format, { ...options, timeZone: "UTC" }).format(
    value,
  );
}

export function formatTime(locale: Locale, time: string): string {
  const value = new Date(`1970-01-01T${time}:00Z`);
  if (Number.isNaN(value.getTime())) return "";
  return new Intl.DateTimeFormat(localeMeta[locale].format, {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(value);
}

/** Localized label and value for each part of the request, in reading order. */
export function describeRequest(
  locale: Locale,
  copy: Dictionary["booking"],
  request: BookingRequest,
): readonly { key: keyof BookingRequest; label: string; value: string }[] {
  const { fields } = copy;
  const period = parseTimePeriod(request.time);
  return [
    {
      key: "branch",
      label: fields.branch,
      value: bookingBranchName(getBranch(request.branch))[locale],
    },
    { key: "service", label: fields.service, value: getService(request.service).name[locale] },
    { key: "date", label: fields.date, value: formatDate(locale, request.date) },
    {
      key: "time",
      label: fields.time,
      value: period ? copy.sheet.periods[period] : formatTime(locale, request.time),
    },
    { key: "name", label: fields.name, value: request.name.trim() },
    { key: "mobile", label: fields.mobile, value: normalizeMobile(request.mobile) ?? request.mobile },
  ];
}

const LRM = "‎";

export function buildMessage(
  locale: Locale,
  copy: Dictionary["booking"],
  request: BookingRequest,
): string {
  const lines = describeRequest(locale, copy, request).map(({ key, label, value }) => {
    // Left-to-right marks keep an international "+" on the correct side in Arabic.
    const text = key === "mobile" ? `${LRM}${value}${LRM}` : value;
    return `${label}: ${text}`;
  });
  return [copy.message.title, "", ...lines, "", copy.message.closing].join("\n");
}

export function whatsAppUrl(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
