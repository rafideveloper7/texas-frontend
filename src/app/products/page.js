'use client';
import { Suspense, useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
// import IKImage from '@/components/IKImage';
import { IKImage } from "@imagekit/next";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'%3E%3Crect width='200' height='200' fill='%231a1a1a'/%3E%3Ctext x='100' y='110' text-anchor='middle' font-size='40' fill='%23666' font-family='Arial'%3E🍽️%3C/text%3E%3Ctext x='100' y='140' text-anchor='middle' font-size='14' fill='%23555'%3ENo image%3C/text%3E%3C/svg%3E";

function ProductSkeleton() {
  return (
    <div className="animate-pulse bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800">
      <div className="w-full h-44 bg-gray-800" />
      <div className="p-4 space-y-2">
        <div className="h-5 bg-gray-800 rounded w-3/4" />
        <div className="h-4 bg-gray-800 rounded w-1/2" />
        <div className="flex justify-between items-center mt-3">
          <div className="h-6 bg-gray-800 rounded w-1/3" />
          <div className="w-10 h-10 bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { addToCart } = useCart();

  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const [itemsRes, catsRes] = await Promise.all([
          fetch(`${baseUrl}/menu`),
          fetch(`${baseUrl}/categories`),
        ]);
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        setItems(itemsData.data || []);
        setCats(catsData.data || []);

        if (categoryFromUrl) {
          const exists = catsData.data?.some((cat) => cat.slug === categoryFromUrl);
          if (exists) setSelectedCategory(categoryFromUrl);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFromUrl]);

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

  let filteredItems = items.filter((item) => {
    const catSlug =
      typeof item.category === 'object'
        ? item.category.slug
        : cats.find((c) => c._id === item.category)?.slug;
    const matchCat = selectedCategory === 'all' || catSlug === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortBy === 'price-asc') filteredItems.sort((a, b) => a.price - b.price);
  if (sortBy === 'price-desc') filteredItems.sort((a, b) => b.price - a.price);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {showToast && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a43f] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
          {toastMessage}
        </div>
      )}

      <h1 className="text-4xl font-black text-center mb-8">All Products</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input
          type="text"
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition"
        >
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8 pb-2 justify-center">
        <button onClick={() => handleCategoryClick('all')} className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === 'all' ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'}`}>All</button>
        {cats.map((cat) => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={`px-4 py-2 rounded-full whitespace-nowrap transition ${selectedCategory === cat.slug ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'}`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill().map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-20"><p className="text-gray-400 text-lg">No products found.</p><p className="text-gray-500 text-sm mt-2">Try a different category or search term.</p></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => {
            const imageUrl = item.image?.url || item.image || PLACEHOLDER_IMAGE;
            return (
              <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition group">
                <Link href={`/product/${item._id}`}>
                  <div className="relative w-full h-44 overflow-hidden">
                    <IKImage src={imageUrl} alt={item.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${item._id}`}><h3 className="font-bold text-lg mb-1 line-clamp-1 hover:text-[#d8a43f] transition">{item.name}</h3></Link>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[#d8a43f] font-black tracking-tighter">Rs. {item.price}</span>
                    <button onClick={() => handleAddToCart(item)} className="w-10 h-10 bg-[#cc2b2b] hover:bg-white hover:text-[#cc2b2b] rounded-xl font-bold flex items-center justify-center transition">+</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading products...</div>}>
        <ProductsContent />
      </Suspense>
    </div>
  );
}