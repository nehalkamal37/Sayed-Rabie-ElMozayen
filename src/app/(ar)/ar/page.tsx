import { getDictionary } from "@/content";
import { pageMetadata } from "@/lib/metadata";
import { HomeView } from "@/views/home-view";

const { home } = getDictionary("ar");

export const metadata = pageMetadata("ar", "/", {
  title: home.metaTitle,
  description: home.metaDescription,
});

export default function Page() {
  return <HomeView locale="ar" revision typography="signature" />;
}
