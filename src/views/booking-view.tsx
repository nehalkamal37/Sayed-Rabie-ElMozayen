import { BookingFlow } from "@/components/booking/booking-flow";
import { PageFrame } from "@/components/page-frame";
import { getDictionary } from "@/content";
import type { Locale } from "@/i18n/config";
import { cairoNow } from "@/lib/booking";
import styles from "./booking-view.module.css";

export function BookingView({ locale }: { locale: Locale }) {
  const { booking } = getDictionary(locale);
  return (
    <PageFrame locale={locale}>
      <div className={`container ${styles.root}`}>
        <div className={styles.intro}>
          <h1>{booking.heading}</h1>
          <p>{booking.lede}</p>
        </div>
        <BookingFlow locale={locale} copy={booking} renderedAt={cairoNow()} />
      </div>
    </PageFrame>
  );
}
