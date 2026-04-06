"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import FastImage from "@/components/FastImage";
import GsapReveal from "@/components/GsapReveal";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a1a'/%3E%3Ctext x='100' y='140' text-anchor='middle' font-size='14' fill='%23555'%3ENo image%3C/text%3E%3C/svg%3E";

function ProductsContent({ initialItems, initialCategories }) {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get("category");
  const { addToCart } = useCart();

  const [items] = useState(initialItems ?? []);
  const [cats] = useState(initialCategories ?? []);
  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || "all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    if (!categoryFromUrl) {
      setSelectedCategory("all");
      return;
    }

    const exists = cats.some((cat) => cat.slug === categoryFromUrl);
    setSelectedCategory(exists ? categoryFromUrl : "all");
  }, [categoryFromUrl, cats]);

  const handleAddToCart = useCallback(
    (item) => {
      addToCart({
        id: item._id,
        name: item.name,
        price: item.price,
        image: item.image?.url || item.image || PLACEHOLDER_IMAGE,
        qty: 1,
      });
      setToastMessage(`${item.name} added to cart!`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    },
    [addToCart]
  );

  const filteredItems = useMemo(() => {
    const nextItems = items.filter((item) => {
      const catSlug =
        item.category && typeof item.category === "object"
          ? item.category.slug
          : cats.find((c) => c._id === item.category)?.slug;
      const matchCat = selectedCategory === "all" || catSlug === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });

    if (sortBy === "price-asc") nextItems.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") nextItems.sort((a, b) => b.price - a.price);

    return nextItems;
  }, [cats, items, searchQuery, selectedCategory, sortBy]);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    const url = new URL(window.location.href);
    if (slug === "all") url.searchParams.delete("category");
    else url.searchParams.set("category", slug);
    window.history.pushState({}, "", url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a43f] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          {toastMessage}
        </div>
      )}

      <GsapReveal y={40}>
        <h1 className="text-4xl font-black text-center mb-8">All Products</h1>
      </GsapReveal>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input type="text" placeholder="Search items..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition">
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 pb-2 justify-center">
        <button onClick={() => handleCategoryClick("all")} className={`pressable px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === "all" ? "bg-[#d8a43f] text-black" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"}`}>All</button>
        {cats.map((cat) => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={`pressable px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === cat.slug ? "bg-[#d8a43f] text-black" : "bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]"}`}>{cat.name}</button>
        ))}
      </div>

      {filteredItems.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 text-lg">No products found.</p><p className="text-gray-500 text-sm mt-2">Try a different category or search term.</p></div>
      ) : (
        <GsapReveal y={55}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const imageUrl = item.image?.url || item.image || PLACEHOLDER_IMAGE;
            return (
              <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition group">
                <Link href={`/product/${item._id}`}>
                  <div className="relative w-full h-44 overflow-hidden">
                    <FastImage src={imageUrl} alt={item.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item._id}`}><h3 className="font-bold text-lg mb-1 line-clamp-1 hover:text-[#d8a43f] transition">{item.name}</h3></Link>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#d8a43f] font-black tracking-tighter">Rs. {item.price}</span>
                    <button onClick={() => handleAddToCart(item)} className="pressable w-10 h-10 bg-[#cc2b2b] hover:bg-white hover:text-[#cc2b2b] rounded-xl font-bold flex items-center justify-center transition">+</button>
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        </GsapReveal>
      )}
    </div>
  );
}

export default function ProductsPageClient(props) {
  return (
    <div className="bg-black min-h-screen text-white">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading products...</div>}>
        <ProductsContent {...props} />
      </Suspense>
    </div>
  );
}
