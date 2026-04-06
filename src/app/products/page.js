// Server wrapper for the products page so the first render includes data.
import ProductsPageClient from "@/components/pages/ProductsPageClient";
import { getCategories, getMenuItems } from "@/lib/api";

export default async function ProductsPage() {
  const [initialItems, initialCategories] = await Promise.all([
    getMenuItems(),
    getCategories(),
  ]);

  return (
    <ProductsPageClient
      initialItems={initialItems}
      initialCategories={initialCategories}
    />
  );
}
