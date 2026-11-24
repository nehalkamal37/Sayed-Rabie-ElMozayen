import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/home-view";

const { home } = getDictionary("en");

export const metadata = pageMetadata("en", "/", {
  title: home.metaTitle,
  description: home.metaDescription,
});

export default function Page() {
  return <HomeView locale="en" />;
}
