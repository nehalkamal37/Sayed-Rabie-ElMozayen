"use client";

import { useEffect, useRef, useState, type FormEvent, type MouseEvent, type ReactNode } from "react";
import type { Dictionary } from "@/content";
import {
  bookingBranchName,
  branches,
  getBranch,
  parseBranchId,
  type BranchId,
} from "@/data/branches";
import { getService, parseServiceId, services, type ServiceId } from "@/data/services";
import { bookingWhatsApp } from "@/data/site";
import type { Locale } from "@/i18n/config";
import {
  addDays,
  buildMessage,
  cairoNow,
  detailFields,
  formatDay,
  parseTimePeriod,
  timePeriods,
  validateDetails,
  whatsAppUrl,
  type BookingRequest,
  type DetailField,
  type TimePeriod,
} from "@/lib/booking";
import { updateDraft, useBookingDraft } from "@/lib/booking-draft";
import { fill } from "@/lib/text";
import { Icon } from "../icons";
import type { PanelPreset } from "./booking-provider";
import { PrivacyNote } from "./privacy-note";
import styles from "./booking-panel.module.css";

const DAYS_OFFERED = 14;
/** Smaller changes are browser toolbars, not a keyboard. */
const KEYBOARD_MIN_PX = 120;

type Field = "service" | "branch" | DetailField;
const fieldOrder: readonly Field[] = ["service", "branch", ...detailFields];

interface Props {
  readonly locale: Locale;
  readonly copy: Dictionary["booking"];
  readonly preset: PanelPreset;
  readonly onClose: () => void;
}

/**
 * Booking request as a centred modal.
 * Nothing is submitted to a server: a complete request opens WhatsApp once its
 * number is verified, and until then is shown as a message preview.
 */
export function BookingPanel({ locale, copy, preset, onClose }: Props) {
  const sheet = copy.sheet;
  const dialog = useRef<HTMLDialogElement>(null);
  const title = useRef<HTMLHeadingElement>(null);
  const draft = useBookingDraft();

  const [now] = useState(() => cairoNow());
  const [branch, setBranch] = useState<BranchId | null>(preset.branch ?? null);
  const [service, setService] = useState<ServiceId | null>(preset.service ?? null);
  const [editing, setEditing] = useState<{ branch?: boolean; service?: boolean }>({});
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>({});
  const [ready, setReady] = useState(false);
  const [date, setDate] = useState(() => {
    const wanted = preset.date ?? draft.date;
    return wanted >= now.date ? wanted : addDays(now.date, 1);
  });
  const [period, setPeriod] = useState<TimePeriod>(
    () => preset.period ?? parseTimePeriod(draft.period) ?? "evening",
  );

  useEffect(() => {
    const page = document.documentElement;
    page.dataset.modal = "";
    const element = dialog.current;
    if (element && !element.open) element.showModal();
    return () => {
      delete page.dataset.modal;
    };
  }, []);

  // An open keyboard covers part of the screen without resizing the page, so the
  // modal is fitted to what is left. Nothing is touched until one really opens.
  useEffect(() => {
    const viewport = window.visualViewport;
    const element = dialog.current;
    if (!viewport || !element) return;
    function fit() {
      if (!viewport || !element || viewport.scale > 1.01) return;
      if (window.innerHeight - viewport.height < KEYBOARD_MIN_PX) {
        element.style.removeProperty("--visible-height");
        element.style.removeProperty("--visible-top");
      } else {
        element.style.setProperty("--visible-height", `${viewport.height}px`);
        element.style.setProperty("--visible-top", `${viewport.offsetTop}px`);
      }
      keepFieldVisible();
    }
    viewport.addEventListener("resize", fit);
    viewport.addEventListener("scroll", fit);
    return () => {
      viewport.removeEventListener("resize", fit);
      viewport.removeEventListener("scroll", fit);
    };
  }, []);

  useEffect(() => {
    if (ready) title.current?.focus();
  }, [ready]);

  const verified = bookingWhatsApp.status === "verified";
  const details = { date, time: period, name: draft.name, mobile: draft.mobile };
  const request: BookingRequest | null =
    branch && service ? { ...details, branch, service } : null;
  const message = request ? buildMessage(locale, copy, request) : "";
  const branchName = branch ? getBranch(branch).name[locale] : "";

  /** The panel stays mounted until its closing transition has run. */
  async function finishClosing() {
    const running = dialog.current?.getAnimations({ subtree: true }) ?? [];
    await Promise.allSettled(running.map((animation) => animation.finished));
    onClose();
  }

  function closeFromBackdrop(event: MouseEvent) {
    if (event.target === dialog.current) dialog.current?.close();
  }

  function clearErrors(...fields: Field[]) {
    setErrors((current) => ({
      ...current,
      ...Object.fromEntries(fields.map((field) => [field, undefined])),
    }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Partial<Record<Field, string>> = {};
    if (!service) found.service = copy.errors.service;
    if (!branch) found.branch = copy.errors.branch;
    const invalid = validateDetails(details, cairoNow());
    for (const field of detailFields) {
      const key = invalid[field];
      if (key) found[field] = copy.errors[key];
    }
    setErrors(found);

    const first = fieldOrder.find((field) => found[field]);
    if (first) {
      document.getElementById(`panel-${first}`)?.focus();
      return;
    }
    updateDraft({ date, period });
    if (bookingWhatsApp.status === "verified") {
      window.open(whatsAppUrl(bookingWhatsApp.value, message), "_blank", "noopener");
    }
    setReady(true);
  }

  const days = Array.from({ length: DAYS_OFFERED }, (_, index) => addDays(now.date, index));
  if (!days.includes(date)) days.push(date);
  const dayLabel = (value: string, index: number) =>
    index === 0
      ? sheet.today
      : index === 1
        ? sheet.tomorrow
        : formatDay(locale, value, { weekday: "long", day: "numeric", month: "long" });

  const banner = verified ? null : <p className={styles.banner}>{sheet.previewBanner}</p>;

  return (
    <dialog
      ref={dialog}
      className={styles.dialog}
      aria-labelledby="panel-title"
      onClose={finishClosing}
      onClick={closeFromBackdrop}
    >
      <div className={styles.panel}>
        <div className={styles.header}>
          <h2 id="panel-title" ref={title} tabIndex={-1}>
            {ready ? (verified ? sheet.handoffTitle : sheet.preparedTitle) : sheet.title}
          </h2>
          <button
            type="button"
            className={styles.close}
            aria-label={sheet.close}
            onClick={() => dialog.current?.close()}
          >
            <Icon name="close" size={22} />
          </button>
        </div>
        {ready ? (
          <div className={styles.form}>
            <div className={styles.body} data-scroll>
              {banner}
              <div className={styles.ready}>
                <span className={styles.badge}>
                  <Icon name={verified ? "check" : "info"} size={28} strokeWidth={2.2} />
                </span>
                <p className={styles.readyHeading}>
                  {verified ? sheet.handoffHeading : sheet.preparedHeading}
                </p>
                <p className={styles.readyBody}>
                  {fill(verified ? sheet.handoffBody : sheet.preparedBody, { branch: branchName })}
                </p>
                <p className={styles.message}>{message}</p>
                {bookingWhatsApp.status === "verified" ? (
                  <a
                    className={styles.textButton}
                    href={whatsAppUrl(bookingWhatsApp.value, message)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {sheet.reopen}
                  </a>
                ) : null}
                <button type="button" className={styles.textButton} onClick={() => setReady(false)}>
                  {sheet.edit}
                </button>
              </div>
            </div>
            <div className={styles.footer}>
              <button
                type="button"
                className={styles.submit}
                onClick={() => dialog.current?.close()}
              >
                {sheet.done}
              </button>
            </div>
          </div>
        ) : (
          <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.body} data-scroll>
              {banner}
              {service && preset.service && !editing.service ? (
                <Locked
                  label={copy.fields.service}
                  value={getService(service).name[locale]}
                  action={sheet.change}
                  actionLabel={fill(sheet.changeLabel, { field: copy.fields.service })}
                  onChange={() => setEditing({ ...editing, service: true })}
                />
              ) : (
                <SelectField
                  id="panel-service"
                  label={copy.fields.service}
                  value={service ?? ""}
                  error={errors.service}
                  chosen={service !== null}
                  focusOnMount={editing.service}
                  onChange={(value) => {
                    setService(parseServiceId(value));
                    clearErrors("service");
                  }}
                >
                  {service ? null : <option value="">{sheet.chooseService}</option>}
                  {services.map((option) => (
                    <option key={option.id} value={option.id}>
                      {option.name[locale]}
                    </option>
                  ))}
                </SelectField>
              )}

              {branch && preset.branch && !editing.branch ? (
                <Locked
                  label={copy.fields.branch}
                  value={bookingBranchName(getBranch(branch))[locale]}
                  action={sheet.change}
                  actionLabel={fill(sheet.changeLabel, { field: copy.fields.branch })}
                  onChange={() => setEditing({ ...editing, branch: true })}
                />
              ) : (
                <SelectField
                  id="panel-branch"
                  label={copy.fields.branch}
                  value={branch ?? ""}
                  error={errors.branch}
                  chosen={branch !== null}
                  focusOnMount={editing.branch}
                  onChange={(value) => {
                    setBranch(parseBranchId(value));
                    clearErrors("branch");
                  }}
                >
                  {branch ? null : <option value="">{sheet.chooseBranch}</option>}
                  {branches.map((option) => (
                    <option key={option.id} value={option.id}>
                      {bookingBranchName(option)[locale]}
                    </option>
                  ))}
                </SelectField>
              )}

              <div className={styles.pair}>
                <SelectField
                  id="panel-date"
                  label={sheet.day}
                  value={date}
                  error={errors.date}
                  onChange={(value) => {
                    setDate(value);
                    clearErrors("date", "time");
                  }}
                >
                  {days.map((day, index) => (
                    <option key={day} value={day}>
                      {dayLabel(day, index)}
                    </option>
                  ))}
                </SelectField>
                <SelectField
                  id="panel-time"
                  label={sheet.time}
                  value={period}
                  error={errors.time}
                  onChange={(value) => {
                    setPeriod(parseTimePeriod(value) ?? "evening");
                    clearErrors("time");
                  }}
                >
                  {timePeriods.map((option) => (
                    <option key={option} value={option}>
                      {sheet.periods[option]}
                    </option>
                  ))}
                </SelectField>
              </div>

              <div className={styles.pair}>
                {/* No name attributes: these values must never end up in a URL. */}
                <Field id="panel-name" label={sheet.name} error={errors.name}>
                  <input
                    id="panel-name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder={sheet.namePlaceholder}
                    value={draft.name}
                    aria-invalid={errors.name ? true : undefined}
                    aria-describedby={errors.name ? "panel-name-error" : undefined}
                    onChange={(event) => {
                      updateDraft({ name: event.target.value });
                      clearErrors("name");
                    }}
                  />
                </Field>
                <Field id="panel-mobile" label={sheet.mobile} error={errors.mobile}>
                  <input
                    id="panel-mobile"
                    type="tel"
                    dir="ltr"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    placeholder="01x xxxx xxxx"
                    value={draft.mobile}
                    aria-invalid={errors.mobile ? true : undefined}
                    aria-describedby={errors.mobile ? "panel-mobile-error" : undefined}
                    onChange={(event) => {
                      updateDraft({ mobile: event.target.value });
                      clearErrors("mobile");
                    }}
                  />
                </Field>
              </div>

              <p className={styles.note}>{sheet.note}</p>
              <PrivacyNote locale={locale} copy={copy} className={styles.note} />
            </div>
            <div className={styles.footer}>
              <button type="submit" className={styles.submit}>
                {verified ? copy.send : sheet.prepare}
              </button>
            </div>
          </form>
        )}
      </div>
    </dialog>
  );
}

/** Scrolls only the modal's own fields, never the page. */
function keepFieldVisible() {
  const field = document.activeElement;
  const scroller = field?.closest("[data-scroll]");
  if (!field || !scroller) return;
  const { top, bottom } = field.getBoundingClientRect();
  const view = scroller.getBoundingClientRect();
  if (bottom > view.bottom) scroller.scrollTop += bottom - view.bottom + 12;
  else if (top < view.top) scroller.scrollTop -= view.top - top + 12;
}

interface LockedProps {
  readonly label: string;
  readonly value: string;
  readonly action: string;
  readonly actionLabel: string;
  readonly onChange: () => void;
}

/** A choice carried in from the page, with a way to change it. */
function Locked({ label, value, action, actionLabel, onChange }: LockedProps) {
  return (
    <div className={styles.locked}>
      <Icon name="check" size={22} strokeWidth={2.4} className={styles.lockedIcon} />
      <span className={styles.lockedText}>
        <span className={styles.lockedLabel}>{label}</span>
        <span className={styles.lockedValue}>{value}</span>
      </span>
      <button type="button" className={styles.change} aria-label={actionLabel} onClick={onChange}>
        {action}
      </button>
    </div>
  );
}

interface FieldProps {
  readonly id: string;
  readonly label: string;
  readonly error?: string;
  readonly children: ReactNode;
}

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      {children}
      {error ? (
        <p id={`${id}-error`} className={styles.error}>
          {error}
        </p>
      ) : null}
    </div>
  );
}

interface SelectProps extends FieldProps {
  readonly value: string;
  /** Marks a branch or service that has been picked. */
  readonly chosen?: boolean;
  readonly focusOnMount?: boolean;
  readonly onChange: (value: string) => void;
}

function SelectField({ chosen, focusOnMount, value, onChange, children, ...field }: SelectProps) {
  const select = useRef<HTMLSelectElement>(null);
  useEffect(() => {
    if (focusOnMount) select.current?.focus();
  }, [focusOnMount]);

  return (
    <Field {...field}>
      <select
        ref={select}
        id={field.id}
        data-chosen={chosen || undefined}
        value={value}
        aria-invalid={field.error ? true : undefined}
        aria-describedby={field.error ? `${field.id}-error` : undefined}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
    </Field>
  );
}
