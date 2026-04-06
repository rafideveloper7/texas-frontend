// Server wrapper for menu data to avoid client-side blank states on first load.
import MenuPageClient from "@/components/pages/MenuPageClient";
import { getCategories, getMenuItems } from "@/lib/api";

export default async function MenuPage() {
  const [initialItems, initialCategories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  return (
    <MenuPageClient
      initialItems={initialItems}
      initialCategories={initialCategories}
    />
  );
}
