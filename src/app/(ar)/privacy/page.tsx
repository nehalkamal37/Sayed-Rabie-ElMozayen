import { getDictionary } from "@/content";
import { privacyPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/metadata";
import { PrivacyView } from "@/views/privacy-view";

const { privacy } = getDictionary("ar");

export const metadata = pageMetadata(
  "ar",
  privacyPath,
  { title: privacy.metaTitle, description: privacy.metaDescription },
  { draft: true },
);

export default function Page() {
  return <PrivacyView locale="ar" />;
}
