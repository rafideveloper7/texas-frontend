'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import { DishSkeleton } from '@/components/LoadingSkeleton';

function MenuContent() {
  const searchParams = useSearchParams();
  const categoryFromUrl = searchParams.get('category');
  const { addToCart } = useCart();
  
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
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
          const cat = catsData.data?.find(c => c.slug === categoryFromUrl);
          if (cat) setActiveCategory(categoryFromUrl);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [categoryFromUrl]);

  const handleAddToCart = (item) => {
    addToCart({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image?.url || item.image,
      qty: 1,
    });
    setToastMessage(`${item.name} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const filteredItems = items.filter(item => {
    const itemCatSlug = typeof item.category === 'object' ? item.category.slug : cats.find(c => c._id === item.category)?.slug;
    const matchesCategory = activeCategory === 'all' || itemCatSlug === activeCategory;
    const matchesSearch = searchTerm === '' || item.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategoryClick = (categorySlug) => {
    setActiveCategory(categorySlug);
    const url = new URL(window.location.href);
    if (categorySlug === 'all') url.searchParams.delete('category');
    else url.searchParams.set('category', categorySlug);
    window.history.pushState({}, '', url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      {showToast && <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 bg-[#d8a43f] text-black px-6 py-3 rounded-full z-50">{toastMessage}</div>}
      
      <h1 className="text-4xl font-black text-center mb-8">Our Menu</h1>
      
      <div className="mb-8">
        <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-md mx-auto block bg-[#1a1a1a] border border-gray-800 rounded-full px-5 py-3 text-white" />
      </div>

      {/* Category filters – fully visible on large screens, scrollable on mobile */}
      <div className="flex flex-wrap gap-2 mb-8 pb-2 justify-center">
        <button onClick={() => handleCategoryClick('all')} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === 'all' ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'}`}>All</button>
        {cats.map(cat => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={`px-4 py-2 rounded-full whitespace-nowrap ${activeCategory === cat.slug ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400 hover:bg-[#2a2a2a]'}`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array(8).fill().map((_, i) => <DishSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition">
              <Link href={`/product/${item._id}`}>
                <img src={item.image?.url || item.image} alt={item.name} className="w-full h-40 object-cover" />
              </Link>
              <div className="p-4">
                <Link href={`/product/${item._id}`}><h3 className="font-bold">{item.name}</h3></Link>
                <div className="flex justify-between mt-3">
                  <span className="text-[#d8a43f] font-bold">Rs. {item.price}</span>
                  <button onClick={() => handleAddToCart(item)} className="w-8 h-8 bg-[#cc2b2b] rounded-full">+</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MenuPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <Suspense fallback={<div className="flex justify-center items-center h-screen">Loading...</div>}>
        <MenuContent />
      </Suspense>
    </div>
  );
}