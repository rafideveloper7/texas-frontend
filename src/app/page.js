import HomePageClient from "@/components/pages/HomePageClient";
import { getCategories, getMenuItems } from "@/lib/api";

export default async function HomePage() {
  const [initialItems, initialCategories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  return (
    <HomePageClient
      initialItems={initialItems}
      initialCategories={initialCategories}
    />
  );
}
