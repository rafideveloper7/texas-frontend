'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

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
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const [itemsRes, catsRes] = await Promise.all([
          fetch(`${baseUrl}/menu`),
          fetch(`${baseUrl}/categories`)
        ]);
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        
        setItems(itemsData.data || []);
        setCats(catsData.data || []);
        
        if (categoryFromUrl) {
          const exists = catsData.data?.some(cat => cat.slug === categoryFromUrl);
          if (exists) setSelectedCategory(categoryFromUrl);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFromUrl]);

  const handleAddToCart = (item) => {
    addToCart({ id: item._id, name: item.name, price: item.price, image: item.image?.url || item.image, qty: 1 });
    setToastMessage(`${item.name} added!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  let filtered = items.filter(item => {
    const catSlug = typeof item.category === 'object' ? item.category.slug : cats.find(c => c._id === item.category)?.slug;
    const matchCat = selectedCategory === 'all' || catSlug === selectedCategory;
    const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  if (sortBy === 'price-asc') filtered.sort((a,b) => a.price - b.price);
  if (sortBy === 'price-desc') filtered.sort((a,b) => b.price - a.price);

  const handleCategoryClick = (slug) => {
    setSelectedCategory(slug);
    const url = new URL(window.location.href);
    if (slug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', slug);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {showToast && <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#d8a43f] text-black px-6 py-3 rounded-full z-50">{toastMessage}</div>}
      
      <h1 className="text-4xl font-black text-center mb-8">All Products</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="flex-1 bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-[#1a1a1a] border border-gray-800 rounded-xl px-5 py-3 text-white">
          <option value="default">Sort: Default</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex gap-2 overflow-x-auto mb-8 pb-2 scrollbar-none">
        <button onClick={() => handleCategoryClick('all')} className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === 'all' ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}`}>All</button>
        {cats.map(cat => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={`px-4 py-2 rounded-full whitespace-nowrap ${selectedCategory === cat.slug ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#cc2b2b] border-t-white rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition duration-300 group">
              <Link href={`/product/${item._id}`}>
                <img src={item.image?.url || item.image} alt={item.name} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
              </Link>
              <div className="p-4">
                <Link href={`/product/${item._id}`}><h3 className="font-bold text-lg mb-1">{item.name}</h3></Link>
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[#d8a43f] font-black tracking-tighter">Rs. {item.price}</span>
                  <button onClick={() => handleAddToCart(item)} className="w-10 h-10 bg-[#cc2b2b] hover:bg-white hover:text-[#cc2b2b] rounded-xl font-bold flex items-center justify-center transition">+</button>
                </div>
              </div>
            </div>
          ))}
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