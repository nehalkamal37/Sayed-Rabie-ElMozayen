import { bookingWhatsApp } from "@/data/site";
import type { Locale } from "@/i18n/config";
import {
  buildMessage,
  describeRequest,
  whatsAppUrl,
  type BookingRequest,
} from "@/lib/booking";
import { fill } from "@/lib/text";
import type { BookingCopy } from "./booking-flow";
import styles from "./booking-flow.module.css";

interface Props {
  readonly locale: Locale;
  readonly copy: BookingCopy;
  readonly request: BookingRequest;
  readonly onEdit: (field: keyof BookingRequest) => void;
  readonly onBack: () => void;
}

export function ReviewStep({ locale, copy, request, onEdit, onBack }: Props) {
  const message = buildMessage(locale, copy, request);
  const verified = bookingWhatsApp.status === "verified";

  return (
    <div>
      <p className={styles.note}>{copy.preferenceNote}</p>
      <dl className={styles.summary}>
        {describeRequest(locale, copy, request).map(({ key, label, value }) => (
          <div key={key}>
            <dt>{label}</dt>
            <dd>
              <bdi dir={key === "mobile" ? "ltr" : "auto"}>{value}</bdi>
            </dd>
            <dd className={styles.editCell}>
              <button
                type="button"
                className={styles.edit}
                onClick={() => onEdit(key)}
                aria-label={fill(copy.editLabel, { field: label })}
              >
                {copy.edit}
              </button>
            </dd>
          </div>
        ))}
      </dl>

      <div className={styles.messageHeader}>
        <h3>{copy.messageHeading}</h3>
        {verified ? null : <span className={styles.badge}>{copy.previewBadge}</span>}
      </div>
      <p className={styles.message}>
        {message}
      </p>

      <p className={styles.note} id="send-note">
        {verified ? copy.sendNote : copy.previewNote}
      </p>
      <div className={styles.actions}>
        {bookingWhatsApp.status === "verified" ? (
          <a
            className="button"
            href={whatsAppUrl(bookingWhatsApp.value, message)}
            target="_blank"
            rel="noopener noreferrer"
            aria-describedby="send-note"
          >
            {copy.send}
          </a>
        ) : (
          <button type="button" className="button" disabled aria-describedby="send-note">
            {copy.send}
          </button>
        )}
        <button type="button" className="button button--outline" onClick={onBack}>
          {copy.back}
        </button>
      </div>
    </div>
  );
}
