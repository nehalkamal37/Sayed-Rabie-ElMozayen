import { BookingFlow } from "@/components/booking/booking-flow";
import { CallAction, PhoneText, WhatsAppAction } from "@/components/contact";
import { Icon } from "@/components/icons";
import { PageFrame } from "@/components/page-frame";
import { getDictionary } from "@/content";
import { bookingWhatsApp, socialProfiles } from "@/data/site";
import type { Locale } from "@/i18n/config";
import { cairoNow } from "@/lib/booking";
import styles from "./booking-view.module.css";

export function BookingView({ locale }: { locale: Locale }) {
  const { booking, common } = getDictionary(locale);
  const { contact } = booking;
  return (
    <PageFrame locale={locale} footerClose={false}>
      <div className={`container ${styles.root}`}>
        <div className={styles.intro}>
          <h1>{booking.heading}</h1>
          <p>{booking.lede}</p>
        </div>
        <section className={styles.contact} aria-label={contact.heading}>
          <a className={styles.card} href="#booking-form">
            <Icon name="calendar" size={22} strokeWidth={1.8} />
            <span className={styles.cardTitle}>{contact.form}</span>
            <span>{contact.formHint}</span>
          </a>
          <CallAction className={styles.card} pendingLabel={common.unavailable}>
            <Icon name="phone" size={22} strokeWidth={1.8} />
            <span className={styles.cardTitle}>{contact.call}</span>
            <PhoneText locale={locale} />
          </CallAction>
          <WhatsAppAction className={styles.card} pendingLabel={common.unavailable}>
            <Icon name="chat" size={22} strokeWidth={1.8} />
            <span className={styles.cardTitle}>{contact.whatsapp}</span>
            {bookingWhatsApp.status === "verified" ? null : (
              <span aria-hidden="true">{contact.whatsappPending}</span>
            )}
          </WhatsAppAction>
        </section>
        <div id="booking-form" className={styles.form}>
          <BookingFlow locale={locale} copy={booking} renderedAt={cairoNow()} />
        </div>
        <section className={styles.follow} aria-labelledby="follow-heading">
          <h2 id="follow-heading">{contact.follow}</h2>
          <ul>
            {socialProfiles.map(({ name, url }) => (
              <li key={url}>
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {name[locale]}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </PageFrame>
  );
}
