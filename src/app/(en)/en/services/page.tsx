import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { ServicesView } from "@/views/services-view";

const { services } = getDictionary("en");

export const metadata = pageMetadata("en", "/services", {
  title: services.metaTitle,
  description: services.metaDescription,
});

export default function Page() {
  return <ServicesView locale="en" />;
}
