import { getDictionary } from "@/content";
import { directoryPath } from "@/lib/paths";
import { pageMetadata } from "@/lib/metadata";
import { DirectoryView } from "@/views/directory-view";

const { directory } = getDictionary("en");

export const metadata = pageMetadata("en", directoryPath, {
  title: directory.metaTitle,
  description: directory.metaDescription,
});

export default function Page() {
  return <DirectoryView locale="en" />;
}
