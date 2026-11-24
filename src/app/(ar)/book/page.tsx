import { connection } from "next/server";
import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { bookingPath } from "@/lib/paths";
import { BookingView } from "@/views/booking-view";

const { booking } = getDictionary("ar");

export const metadata = pageMetadata("ar", bookingPath(), {
  title: booking.metaTitle,
  description: booking.metaDescription,
});

export default async function Page() {
  // Rendered per request so the branch in the URL is preselected in the HTML.
  await connection();
  return <BookingView locale="ar" />;
}
