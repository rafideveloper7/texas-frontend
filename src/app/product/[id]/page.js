// Server wrapper for the product detail route so product content is available on first paint.
import { notFound } from "next/navigation";
import ProductDetailClient from "@/components/pages/ProductDetailClient";
import { getMenuItem, getMenuItems } from "@/lib/api";

export default async function ProductDetailPage({ params }) {
  const product = await getMenuItem(params.id);

  if (!product) {
    notFound();
  }

  const allItems = await getMenuItems();
  const categoryId =
    product.category && typeof product.category === "object"
      ? product.category._id
      : product.category;
  const relatedProducts = (allItems || [])
    .filter((item) => {
      const itemCategoryId =
        item.category && typeof item.category === "object"
          ? item.category._id
          : item.category;
      return itemCategoryId === categoryId && item._id !== params.id;
    })
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
