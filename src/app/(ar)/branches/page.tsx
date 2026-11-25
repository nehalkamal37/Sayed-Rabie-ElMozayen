import { getDictionary } from "@/content";
import { directoryPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/metadata";
import { DirectoryView } from "@/views/directory-view";

const { directory } = getDictionary("ar");

export const metadata = pageMetadata("ar", directoryPath, {
  title: directory.metaTitle,
  description: directory.metaDescription,
});

export default function Page() {
  return <DirectoryView locale="ar" />;
}
