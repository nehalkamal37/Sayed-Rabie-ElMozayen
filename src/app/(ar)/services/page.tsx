import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { ServicesView } from "@/views/services-view";

const { services } = getDictionary("ar");

export const metadata = pageMetadata("ar", "/services", {
  title: services.metaTitle,
  description: services.metaDescription,
});

export default function Page() {
  return <ServicesView locale="ar" />;
}
