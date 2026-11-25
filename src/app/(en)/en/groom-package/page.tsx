import { getDictionary } from "@/content";
import { groomPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/metadata";
import { GroomView } from "@/views/groom-view";

const { groom } = getDictionary("en");

export const metadata = pageMetadata("en", groomPath, {
  title: groom.metaTitle,
  description: groom.metaDescription,
});

export default function Page() {
  return <GroomView locale="en" />;
}
