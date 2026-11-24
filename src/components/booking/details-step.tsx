import { useState, type FormEvent, type HTMLInputTypeAttribute } from "react";
import type { Locale } from "@/i18n/config";
import {
  cairoNow,
  detailFields,
  formatDate,
  formatTime,
  latestDate,
  validateDetails,
  type BookingDetails,
  type DetailErrors,
  type DetailField,
} from "@/lib/booking";
import type { BookingCopy } from "./booking-flow";
import styles from "./booking-flow.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: BookingCopy;
  readonly details: BookingDetails;
  readonly today: string;
  readonly onChange: (patch: Partial<BookingDetails>) => void;
  readonly onBack: () => void;
  readonly onContinue: () => void;
}

interface FieldProps {
  readonly type: HTMLInputTypeAttribute;
  readonly autoComplete: string;
  readonly inputMode?: "tel";
  readonly dir?: "ltr" | "auto";
  readonly min?: string;
  readonly max?: string;
  readonly hint?: string;
}

export function DetailsStep({
  locale,
  copy,
  details,
  today,
  onChange,
  onBack,
  onContinue,
}: Props) {
  const [errors, setErrors] = useState<DetailErrors>({});

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validateDetails(details, cairoNow());
    setErrors(found);
    const firstInvalid = detailFields.find((field) => found[field]);
    if (!firstInvalid) return onContinue();
    document.getElementById(`booking-${firstInvalid}`)?.focus();
  }

  function change(field: DetailField, value: string) {
    onChange({ [field]: value });
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  // The browser formats native date and time controls in its own language, so
  // the chosen value is repeated below in the page's language.
  const fieldProps: Record<DetailField, FieldProps> = {
    date: {
      type: "date",
      autoComplete: "off",
      min: today,
      max: latestDate(today),
      hint: formatDate(locale, details.date),
    },
    time: { type: "time", autoComplete: "off", hint: formatTime(locale, details.time) },
    name: { type: "text", autoComplete: "name", dir: "auto" },
    mobile: {
      type: "tel",
      autoComplete: "tel",
      inputMode: "tel",
      dir: "ltr",
      hint: copy.mobileHint,
    },
  };

  const hasErrors = detailFields.some((field) => errors[field]);

  return (
    <form noValidate onSubmit={submit}>
      <p className={styles.note}>{copy.preferenceNote}</p>
      <div role="alert">
        {hasErrors ? <p className={styles.error}>{copy.errors.summary}</p> : null}
      </div>

      <div className={styles.fields}>
        {detailFields.map((field) => {
          const id = `booking-${field}`;
          const { hint, ...input } = fieldProps[field];
          const error = errors[field];
          return (
            <div key={field} className={styles.field}>
              <label htmlFor={id}>{copy.fields[field]}</label>
              {/* No name attribute: these values must never end up in a URL. */}
              <input
                id={id}
                {...input}
                required
                value={details[field]}
                onChange={(event) => change(field, event.target.value)}
                aria-invalid={error ? true : undefined}
                aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
              />
              {error ? (
                <p id={`${id}-error`} className={styles.error}>
                  {copy.errors[error]}
                </p>
              ) : hint ? (
                <p id={`${id}-hint`} className={styles.hint}>
                  <bdi>{hint}</bdi>
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <p className={styles.privacy}>{copy.privacyNote}</p>
      <div className={styles.actions}>
        <button type="submit" className="button button--dark">
          {copy.review}
        </button>
        <button type="button" className="button button--outline" onClick={onBack}>
          {copy.back}
        </button>
      </div>
    </form>
  );
}
