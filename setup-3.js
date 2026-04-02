const fs = require('fs');
const path = require('path');

// Ensure all needed directories exist (safe)
const directories = [
  'src/app/menu',
  'src/app/products',
  'src/app/product/[id]',
  'src/app/custom-order',
  'src/app/checkout'
];
directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}/`);
  }
});

// ==================== MENU PAGE ====================
const menuPage = `'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';

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
          fetch(\`\${baseUrl}/menu\`),
          fetch(\`\${baseUrl}/categories\`)
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
        console.error('Error fetching menu data:', error);
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
    setToastMessage(\`\${item.name} added to cart!\`);
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

      <div className="flex gap-2 overflow-x-auto mb-8 pb-2 scrollbar-none">
        <button onClick={() => handleCategoryClick('all')} className={\`px-4 py-2 rounded-full whitespace-nowrap \${activeCategory === 'all' ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}\`}>All</button>
        {cats.map(cat => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={\`px-4 py-2 rounded-full whitespace-nowrap \${activeCategory === cat.slug ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}\`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#cc2b2b] border-t-white rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredItems.map(item => (
            <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition">
              <Link href={\`/product/\${item._id}\`}>
                <img src={item.image?.url || item.image} alt={item.name} className="w-full h-40 object-cover" />
              </Link>
              <div className="p-4">
                <Link href={\`/product/\${item._id}\`}><h3 className="font-bold">{item.name}</h3></Link>
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
}`;
fs.writeFileSync('src/app/menu/page.js', menuPage);
console.log('✅ Created: src/app/menu/page.js');

// ==================== PRODUCTS PAGE ====================
const productsPage = `'use client';
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
          fetch(\`\${baseUrl}/menu\`),
          fetch(\`\${baseUrl}/categories\`)
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
    setToastMessage(\`\${item.name} added!\`);
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
        <button onClick={() => handleCategoryClick('all')} className={\`px-4 py-2 rounded-full whitespace-nowrap \${selectedCategory === 'all' ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}\`}>All</button>
        {cats.map(cat => (
          <button key={cat._id} onClick={() => handleCategoryClick(cat.slug)} className={\`px-4 py-2 rounded-full whitespace-nowrap \${selectedCategory === cat.slug ? 'bg-[#d8a43f] text-black' : 'bg-[#1a1a1a] text-gray-400'}\`}>{cat.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-[#cc2b2b] border-t-white rounded-full animate-spin"></div></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(item => (
            <div key={item._id} className="bg-[#1a1a1a] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#cc2b2b] transition duration-300 group">
              <Link href={\`/product/\${item._id}\`}>
                <img src={item.image?.url || item.image} alt={item.name} className="w-full h-44 object-cover group-hover:scale-105 transition duration-500" />
              </Link>
              <div className="p-4">
                <Link href={\`/product/\${item._id}\`}><h3 className="font-bold text-lg mb-1">{item.name}</h3></Link>
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
}`;
fs.writeFileSync('src/app/products/page.js', productsPage);
console.log('✅ Created: src/app/products/page.js');

// ==================== PRODUCT DETAIL PAGE ====================
const productDetailPage = `'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/components/CartProvider';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('regular');
  const [selectedSpice, setSelectedSpice] = useState('medium');
  const [showToast, setShowToast] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(\`\${baseUrl}/menu/\${id}\`);
        const data = await res.json();
        
        if (data.success && data.data) {
          setProduct(data.data);
          
          // Fetch related items (same category)
          const relRes = await fetch(\`\${baseUrl}/menu\`);
          const relData = await relRes.json();
          const categoryId = typeof data.data.category === 'object' ? data.data.category._id : data.data.category;
          
          setRelatedProducts(
            (relData.data || [])
              .filter(item => {
                const itemCatId = typeof item.category === 'object' ? item.category._id : item.category;
                return itemCatId === categoryId && item._id !== id;
              })
              .slice(0, 4)
          );
        } else {
          router.push('/products');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

  if (loading || !product) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d8a43f] mx-auto"></div>
          <p className="text-white mt-4">Cooking something delicious...</p>
        </div>
      </div>
    );
  }

  const sizes = [
    { name: 'Regular', price: 0, multiplier: 1 },
    { name: 'Large', price: 300, multiplier: 1.3 },
    { name: 'Family', price: 600, multiplier: 1.6 }
  ];

  const spiceLevels = ['Mild', 'Medium', 'Hot', 'Extra Hot'];

  const getPrice = () => {
    let basePrice = product.price;
    const size = sizes.find(s => s.name.toLowerCase() === selectedSize);
    if (size) {
      basePrice = Math.round(product.price * size.multiplier);
    }
    return basePrice * quantity;
  };

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: getPrice() / quantity,
      image: product.image?.url || product.image,
      qty: quantity,
      size: selectedSize,
      spice: selectedSpice
    });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const productImages = [
    product.image?.url || product.image,
    product.image?.url?.replace('.jpg', '_2.jpg') || product.image
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx);

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {product.name} added to cart!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-[#d8a43f] transition">Home</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <Link href="/products" className="hover:text-[#d8a43f] transition">Products</Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
            <span className="text-white truncate max-w-[150px]">{product.name}</span>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2">
            <div className="relative rounded-2xl overflow-hidden bg-[#1a1a1a] border border-gray-800">
              <img src={productImages[activeImage]} alt={product.name} className="w-full h-auto object-cover" />
              {product.price > 2000 && (
                <span className="absolute top-4 left-4 bg-[#d8a43f] text-black text-xs font-black px-3 py-1 rounded-full">🔥 Chef's Special</span>
              )}
            </div>
            {productImages.length > 1 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                {productImages.map((img, idx) => (
                  <button key={idx} onClick={() => setActiveImage(idx)} className={\`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all \${activeImage === idx ? 'border-[#d8a43f]' : 'border-gray-800 hover:border-gray-600'}\`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="lg:w-1/2">
            <span className="text-[#d8a43f] text-sm font-bold uppercase tracking-wider">
              {typeof product.category === 'object' ? product.category.name : 'Premium Dish'}
            </span>
            <h1 className="text-3xl md:text-4xl font-black mt-2 mb-4">{product.name}</h1>
            <p className="text-gray-400 leading-relaxed mb-6">{product.description}</p>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Select Size</h3>
              <div className="flex gap-3 flex-wrap">
                {sizes.map((size) => (
                  <button
                    key={size.name}
                    onClick={() => setSelectedSize(size.name.toLowerCase())}
                    className={\`px-5 py-2 rounded-full border-2 font-bold transition \${
                      selectedSize === size.name.toLowerCase()
                        ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }\`}
                  >
                    {size.name}
                    {size.price > 0 && <span className="text-xs ml-1">(+Rs.{size.price})</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Spice Level</h3>
              <div className="flex gap-3 flex-wrap">
                {spiceLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedSpice(level.toLowerCase())}
                    className={\`px-5 py-2 rounded-full border-2 font-bold transition \${
                      selectedSpice === level.toLowerCase()
                        ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]'
                        : 'border-gray-700 text-gray-400 hover:border-gray-500'
                    }\`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-bold mb-3">Quantity</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center hover:bg-[#d8a43f] hover:border-[#d8a43f] transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                </button>
                <span className="text-2xl font-black w-12 text-center">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="w-10 h-10 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center hover:bg-[#d8a43f] hover:border-[#d8a43f] transition">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
              </div>
            </div>

            <div className="border-t border-gray-800 pt-6 mt-6">
              <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400">Total Price:</span>
                <span className="text-3xl font-black text-[#d8a43f]">Rs. {getPrice()}</span>
              </div>
              <button onClick={handleAddToCart} className="w-full min-h-[56px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider hover:shadow-xl transition-all">
                Add to Cart
              </button>
            </div>
          </motion.div>
        </div>

        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-2xl md:text-3xl font-black mb-6">You Might Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedProducts.map((item) => (
                <Link href={\`/product/\${item._id}\`} key={item._id}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl overflow-hidden border border-gray-800 hover:border-[#d8a43f]/50 transition-all">
                    <div className="h-32 md:h-40 overflow-hidden">
                      <img src={item.image?.url || item.image} alt={item.name} className="w-full h-full object-cover hover:scale-110 transition duration-500" />
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm line-clamp-1">{item.name}</h3>
                      <p className="text-[#d8a43f] font-black text-sm mt-1">Rs. {item.price}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/product/[id]/page.js', productDetailPage);
console.log('✅ Created: src/app/product/[id]/page.js');

// ==================== CUSTOM ORDER PAGE ====================
const customOrderPage = `'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useCart } from '@/components/CartProvider';

export default function CustomOrderPage() {
  const router = useRouter();
  const { addToCart } = useCart();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', orderType: 'delivery', address: '', deliveryTime: '',
    occasion: 'regular', specialRequests: '', items: []
  });
  const [menuItems, setMenuItems] = useState([]);
  const [selectedDish, setSelectedDish] = useState(null);
  const [dishQuantity, setDishQuantity] = useState(1);
  const [showDishSelector, setShowDishSelector] = useState(false);
  const [estimatedPrice, setEstimatedPrice] = useState(0);
  const [formStatus, setFormStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const res = await fetch(\`\${baseUrl}/menu\`);
        const data = await res.json();
        setMenuItems(data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  useEffect(() => {
    const total = formData.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    setEstimatedPrice(total);
  }, [formData.items]);

  const occasions = [
    { id: 'regular', name: 'Regular Meal', icon: '🍽️' },
    { id: 'birthday', name: 'Birthday', icon: '🎂' },
    { id: 'anniversary', name: 'Anniversary', icon: '💕' },
    { id: 'corporate', name: 'Corporate Event', icon: '💼' },
    { id: 'family', name: 'Family Gathering', icon: '👨‍👩‍👧‍👦' }
  ];

  const addDishToOrder = () => {
    if (selectedDish) {
      const existingItem = formData.items.find(item => item.id === selectedDish._id);
      if (existingItem) {
        setFormData(prev => ({
          ...prev,
          items: prev.items.map(item =>
            item.id === selectedDish._id
              ? { ...item, qty: item.qty + dishQuantity }
              : item
          )
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          items: [...prev.items, {
            id: selectedDish._id,
            name: selectedDish.name,
            price: selectedDish.price,
            image: selectedDish.image?.url || selectedDish.image,
            qty: dishQuantity
          }]
        }));
      }
      setSelectedDish(null);
      setDishQuantity(1);
      setShowDishSelector(false);
    }
  };

  const removeItem = (itemId) => {
    setFormData(prev => ({ ...prev, items: prev.items.filter(item => item.id !== itemId) }));
  };

  const updateItemQuantity = (itemId, newQty) => {
    if (newQty <= 0) removeItem(itemId);
    else {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map(item => item.id === itemId ? { ...item, qty: newQty } : item)
      }));
    }
  };

  const handleSubmit = () => {
    setFormStatus('submitting');
    // Add all custom order items to cart
    formData.items.forEach(item => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        qty: item.qty,
        custom: true,
        specialRequests: formData.specialRequests
      });
    });
    setTimeout(() => {
      setFormStatus('success');
      setTimeout(() => router.push('/checkout'), 1500);
    }, 1000);
  };

  const nextStep = () => {
    if (step === 1 && formData.name && formData.phone) setStep(2);
    else if (step === 2 && formData.items.length > 0) setStep(3);
  };

  const prevStep = () => setStep(step - 1);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
          <span className="text-[#d8a43f] font-black tracking-wider text-xs md:text-sm uppercase block mb-2">Customize Your Feast</span>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Custom Order</h1>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">Create your perfect meal by selecting dishes and customizing to your taste</p>
        </motion.div>

        <div className="mb-8 md:mb-12">
          <div className="flex justify-between items-center max-w-md mx-auto">
            {[1,2,3].map(s => (
              <div key={s} className="flex flex-col items-center">
                <div className={\`w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg transition-all \${
                  step >= s ? 'bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white shadow-lg' : 'bg-[#1a1a1a] text-gray-500 border border-gray-700'
                }\`}>
                  {step > s ? (<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>) : s}
                </div>
                <span className="text-xs text-gray-500 mt-2 hidden md:block">{s===1?'Your Info':s===2?'Select Dishes':'Review'}</span>
              </div>
            ))}
          </div>
          <div className="relative max-w-md mx-auto mt-2">
            <div className="absolute top-0 left-0 h-1 bg-gray-800 rounded-full w-full"></div>
            <div className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] rounded-full transition-all duration-500" style={{ width: \`\${((step-1)/2)*100}%\` }}></div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
              <h2 className="text-2xl font-black mb-6">Your Information</h2>
              <div className="space-y-5">
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Full Name *</label><input type="text" value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="Enter your full name" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Phone Number *</label><input type="tel" value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="+92 300 0000000" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Email (Optional)</label><input type="email" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="your@email.com" /></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Order Type *</label><div className="grid grid-cols-2 gap-3"><button type="button" onClick={()=>setFormData({...formData, orderType:'delivery'})} className={\`min-h-[48px] rounded-xl border-2 font-bold transition \${formData.orderType === 'delivery' ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]' : 'border-gray-700 text-gray-400'}\`}>🚚 Delivery</button><button type="button" onClick={()=>setFormData({...formData, orderType:'takeaway'})} className={\`min-h-[48px] rounded-xl border-2 font-bold transition \${formData.orderType === 'takeaway' ? 'border-[#d8a43f] bg-[#d8a43f]/10 text-[#d8a43f]' : 'border-gray-700 text-gray-400'}\`}>📦 Takeaway</button></div></div>
                {formData.orderType === 'delivery' && (<motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }}><label className="block text-sm font-bold mb-2 text-gray-300">Delivery Address *</label><textarea rows="2" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="Enter your complete address" /></motion.div>)}
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Occasion</label><div className="grid grid-cols-2 md:grid-cols-5 gap-2">{occasions.map(occ=> (<button key={occ.id} type="button" onClick={()=>setFormData({...formData, occasion:occ.id})} className={\`p-2 rounded-xl text-center transition \${formData.occasion === occ.id ? 'bg-[#d8a43f]/20 border border-[#d8a43f]' : 'bg-black/30 border border-gray-700'}\`}><div className="text-xl">{occ.icon}</div><div className="text-xs mt-1">{occ.name}</div></button>))}</div></div>
                <div><label className="block text-sm font-bold mb-2 text-gray-300">Preferred Delivery Time</label><input type="datetime-local" value={formData.deliveryTime} onChange={e=>setFormData({...formData, deliveryTime:e.target.value})} className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" /></div>
              </div>
              <button onClick={nextStep} disabled={!formData.name || !formData.phone} className="w-full mt-8 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed">Continue to Select Dishes</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
              <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black">Select Your Dishes</h2><button onClick={()=>setShowDishSelector(true)} className="px-4 py-2 bg-[#d8a43f] text-black font-bold rounded-full text-sm">+ Add Dish</button></div>
              {formData.items.length === 0 ? (<div className="text-center py-12"><div className="text-6xl mb-4">🍽️</div><p className="text-gray-400 mb-4">No dishes added yet</p><button onClick={()=>setShowDishSelector(true)} className="text-[#d8a43f] font-bold">Click here to add your first dish</button></div>) : (
                <div className="space-y-4 mb-6">{formData.items.map(item => (<div key={item.id} className="bg-black/30 rounded-xl p-4 flex gap-4 items-center"><img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" /><div className="flex-1"><h3 className="font-bold">{item.name}</h3><p className="text-[#d8a43f] text-sm">Rs. {item.price}</p></div><div className="flex items-center gap-2"><button onClick={()=>updateItemQuantity(item.id, item.qty-1)} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">-</button><span className="w-8 text-center font-bold">{item.qty}</span><button onClick={()=>updateItemQuantity(item.id, item.qty+1)} className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center">+</button><button onClick={()=>removeItem(item.id)} className="ml-2 text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div></div>))}</div>
              )}
              <div className="mb-6"><label className="block text-sm font-bold mb-2 text-gray-300">Special Requests</label><textarea rows="3" value={formData.specialRequests} onChange={e=>setFormData({...formData, specialRequests:e.target.value})} className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="Any special instructions? (spice level, allergies, etc.)" /></div>
              <div className="bg-black/30 rounded-xl p-4 mb-6"><div className="flex justify-between items-center"><span className="text-gray-400">Estimated Total:</span><span className="text-2xl font-black text-[#d8a43f]">Rs. {estimatedPrice}</span></div></div>
              <div className="flex gap-3"><button onClick={prevStep} className="flex-1 min-h-[52px] bg-gray-800 text-white font-bold rounded-xl">Back</button><button onClick={nextStep} disabled={formData.items.length === 0} className="flex-1 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl disabled:opacity-50">Review Order</button></div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
              <h2 className="text-2xl font-black mb-6">Review Your Order</h2>
              <div className="space-y-6">
                <div className="border-b border-gray-800 pb-4"><h3 className="text-[#d8a43f] font-bold mb-2">Customer Details</h3><p><span className="text-gray-500">Name:</span> {formData.name}</p><p><span className="text-gray-500">Phone:</span> {formData.phone}</p>{formData.email && <p><span className="text-gray-500">Email:</span> {formData.email}</p>}<p><span className="text-gray-500">Order Type:</span> {formData.orderType === 'delivery' ? '🚚 Delivery' : '📦 Takeaway'}</p>{formData.orderType === 'delivery' && <p><span className="text-gray-500">Address:</span> {formData.address}</p>}<p><span className="text-gray-500">Occasion:</span> {occasions.find(o=>o.id===formData.occasion)?.name}</p>{formData.deliveryTime && <p><span className="text-gray-500">Delivery Time:</span> {new Date(formData.deliveryTime).toLocaleString()}</p>}</div>
                <div className="border-b border-gray-800 pb-4"><h3 className="text-[#d8a43f] font-bold mb-2">Order Items</h3>{formData.items.map((item,idx)=><div key={idx} className="flex justify-between py-2"><span>{item.qty}x {item.name}</span><span className="text-[#d8a43f]">Rs. {item.price * item.qty}</span></div>)}<div className="flex justify-between pt-2 mt-2 border-t border-gray-700 font-bold"><span>Total</span><span className="text-[#d8a43f]">Rs. {estimatedPrice}</span></div></div>
                {formData.specialRequests && (<div className="border-b border-gray-800 pb-4"><h3 className="text-[#d8a43f] font-bold mb-2">Special Requests</h3><p className="text-gray-400">{formData.specialRequests}</p></div>)}
              </div>
              <div className="flex gap-3 mt-8"><button onClick={prevStep} className="flex-1 min-h-[52px] bg-gray-800 text-white font-bold rounded-xl">Edit Order</button><button onClick={handleSubmit} disabled={formStatus === 'submitting'} className="flex-1 min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl disabled:opacity-50">{formStatus === 'submitting' ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</span>) : "Place Custom Order"}</button></div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {formStatus === 'success' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-md w-full p-8 text-center border border-gray-700">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"><svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></div>
                <h3 className="text-2xl font-black mb-2">Order Ready!</h3><p className="text-gray-400 mb-4">Your custom order has been added to cart</p><p className="text-sm text-gray-500">Redirecting to checkout...</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showDishSelector && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowDishSelector(false)}>
              <motion.div initial={{ scale: 0.9, y: 50 }} animate={{ scale: 1, y: 0 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden border border-gray-700" onClick={e=>e.stopPropagation()}>
                <div className="p-6 border-b border-gray-800 flex justify-between items-center"><h3 className="text-xl font-black">Select a Dish</h3><button onClick={()=>setShowDishSelector(false)} className="text-gray-500 hover:text-white">✕</button></div>
                <div className="p-6 overflow-y-auto max-h-[60vh]"><div className="grid grid-cols-2 gap-3">{menuItems.slice(0,12).map(item=> (<button key={item._id} onClick={()=>setSelectedDish(item)} className={\`p-3 rounded-xl text-left transition \${selectedDish?._id === item._id ? 'bg-[#d8a43f]/20 border border-[#d8a43f]' : 'bg-black/30 border border-gray-700 hover:border-gray-500'}\`}><div className="flex gap-3"><img src={item.image?.url || item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" /><div><p className="font-bold text-sm">{item.name}</p><p className="text-[#d8a43f] text-xs">Rs. {item.price}</p></div></div></button>))}</div></div>
                {selectedDish && (<div className="p-6 border-t border-gray-800"><div className="flex justify-between items-center mb-4"><span className="text-gray-400">Quantity:</span><div className="flex items-center gap-3"><button onClick={()=>setDishQuantity(Math.max(1,dishQuantity-1))} className="w-8 h-8 bg-gray-800 rounded-full">-</button><span className="font-bold w-8 text-center">{dishQuantity}</span><button onClick={()=>setDishQuantity(dishQuantity+1)} className="w-8 h-8 bg-gray-800 rounded-full">+</button></div></div><button onClick={addDishToOrder} className="w-full py-3 bg-[#d8a43f] text-black font-bold rounded-xl">Add to Order (Rs. {selectedDish.price * dishQuantity})</button></div>)}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/custom-order/page.js', customOrderPage);
console.log('✅ Created: src/app/custom-order/page.js');

// ==================== CHECKOUT PAGE ====================
const checkoutPage = `'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutPage() {
  const { cart, removeFromCart, updateQuantity, total } = useCart();
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: '', phone: '', address: '', note: '', orderType: 'delivery', paymentMethod: 'cod'
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  const deliveryFee = formData.orderType === 'delivery' ? 150 : 0;
  const subtotal = total || 0;
  const grandTotal = subtotal + deliveryFee - discount;

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!/^03\\d{9}$/.test(formData.phone) && formData.phone) newErrors.phone = 'Invalid Pakistani number (03xxxxxxxxx)';
    if (formData.orderType === 'delivery' && !formData.address.trim()) newErrors.address = 'Delivery address required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePromoApply = () => {
    const promos = {
      'WELCOME10': { discount: 10, type: 'percentage' },
      'TEXAS50': { discount: 50, type: 'fixed' },
      'GRILL20': { discount: 20, type: 'percentage' },
      'SAVE15': { discount: 15, type: 'percentage' }
    };
    const code = promoCode.toUpperCase();
    if (promos[code]) {
      const promo = promos[code];
      let discountValue = promo.type === 'percentage' ? (subtotal * promo.discount / 100) : promo.discount;
      discountValue = Math.min(discountValue, subtotal);
      setDiscount(discountValue);
      setAppliedPromo(code);
      setPromoCode('');
    } else {
      setDiscount(0);
      setAppliedPromo(null);
      alert('Invalid promo code');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || cart.length === 0) return;
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      const orderPayload = {
        customer: {
          name: formData.name,
          phone: formData.phone,
          address: formData.orderType === 'delivery' ? formData.address : 'Takeaway'
        },
        items: cart.map(item => ({
          menuItem: item.id,
          name: item.name,
          quantity: item.qty,
          price: item.price,
          totalPrice: item.price * item.qty,
          customizations: {
            size: item.size || 'regular',
            spiceLevel: item.spice || 'medium'
          }
        })),
        totalAmount: grandTotal,
        paymentStatus: 'pending',
        orderType: formData.orderType,
        paymentMethod: formData.paymentMethod,
        notes: formData.note
      };

      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const response = await fetch(\`\${baseUrl}/orders\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.message || 'Failed to place order');
      }

      // WhatsApp message
      let message = \`🍖 *TEXAS GRILL - NEW ORDER* 🍖%0A━━━━━━━━━━━━━━━━━━━━%0A🆔 *Order ID:* ${orderPayload.orderNumber || 'Pending'}%0A📋 *Order Type:* \${formData.orderType.toUpperCase()}%0A💳 *Payment:* \${formData.paymentMethod.toUpperCase()}%0A━━━━━━━━━━━━━━━━━━━━%0A👤 *Customer:* \${formData.name}%0A📱 *Phone:* \${formData.phone}%0A\${formData.orderType === 'delivery' ? \`📍 *Address:* \${formData.address}%0A\` : ''}\${formData.note ? \`📝 *Note:* \${formData.note}%0A\` : ''}━━━━━━━━━━━━━━━━━━━━%0A🍽️ *ORDER ITEMS:*%0A\`;
      cart.forEach((item, idx) => {
        message += \`\${idx+1}. \${item.qty}x \${item.name} (\${item.size||'Reg'}) - Rs. \${item.price * item.qty}%0A\`;
      });
      message += \`━━━━━━━━━━━━━━━━━━━━%0A💰 *Subtotal:* Rs. \${subtotal}%0A\${discount>0 ? \`🎁 *Discount:* -Rs. \${discount}%0A\` : ''}\${deliveryFee>0 ? \`🚚 *Delivery:* Rs. \${deliveryFee}%0A\` : ''}━━━━━━━━━━━━━━━━━━━━%0A💎 *GRAND TOTAL:* Rs. \${grandTotal}%0A━━━━━━━━━━━━━━━━━━━━%0A⏰ *Order Time:* \${new Date().toLocaleString()}%0A👨‍🍳 *Preparing in:* 30-45 mins%0A━━━━━━━━━━━━━━━━━━━━%0A🔗 _Order via Texas Grill App_\`;

      window.open(\`https://wa.me/923000000000?text=\${encodeURIComponent(message)}\`, '_blank');
      setShowSuccessModal(true);
      setTimeout(() => router.push('/'), 4000);
    } catch (error) {
      console.error('Order submission error:', error);
      alert('Something went wrong. Please try again or contact us directly.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isMounted) return null;

  if (!cart || cart.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#121212] to-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border-2 border-gray-800 rounded-full flex items-center justify-center mb-8">
          <svg className="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
        </div>
        <h1 className="text-4xl font-black uppercase mb-3">Cart Empty</h1>
        <p className="text-gray-400 mb-8 max-w-xs">Your VIP order queue is empty. Time to fill it with deliciousness!</p>
        <Link href="/products"><button className="min-h-[56px] px-8 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-full font-black uppercase tracking-wider shadow-xl shadow-red-900/40">Browse Menu</button></Link>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-32 font-sans text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-8 md:mb-12 border-b border-gray-800 pb-6">
          <div><span className="text-[#d8a43f] font-black tracking-wider text-xs md:text-sm uppercase block mb-2 flex items-center gap-2"><span className="w-2 h-2 bg-[#d8a43f] rounded-full animate-pulse"></span>Secure Checkout</span><h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Complete Order</h1></div>
          <div className="hidden md:flex items-center gap-2 text-sm text-gray-500"><span className="w-8 h-8 rounded-full bg-[#cc2b2b]/20 text-[#cc2b2b] flex items-center justify-center font-bold">3</span><span>Steps to feast</span></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="lg:w-2/3">
            <form onSubmit={handleSubmit} className="space-y-6 md:space-y-8">
              {/* Order Type */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">1</span>How to serve?</h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {['delivery','takeaway'].map(type => (
                    <label key={type} className={\`cursor-pointer min-h-[80px] rounded-xl md:rounded-2xl border-2 flex flex-col justify-center items-center transition-all duration-300 \${
                      formData.orderType === type 
                        ? \`bg-gradient-to-br \${type === 'delivery' ? 'from-[#cc2b2b]/20 to-[#cc2b2b]/5 border-[#cc2b2b]' : 'from-[#d8a43f]/20 to-[#d8a43f]/5 border-[#d8a43f]'} shadow-lg scale-105\` 
                        : 'bg-black/50 border-gray-800 hover:border-gray-600'
                    }\`}>
                      <input type="radio" name="orderType" value={type} className="hidden" checked={formData.orderType === type} onChange={(e) => setFormData({...formData, orderType: e.target.value})} />
                      <svg className={\`w-7 h-7 mb-2 \${formData.orderType === type ? (type === 'delivery' ? 'text-[#cc2b2b]' : 'text-[#d8a43f]') : 'text-gray-500'}\`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {type === 'delivery' ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>}
                      </svg>
                      <span className="font-black text-xs md:text-sm uppercase tracking-wider">{type === 'delivery' ? 'Door Delivery' : 'Takeaway'}</span>
                      <span className="text-[10px] text-gray-500 mt-1">{type === 'delivery' ? 'Rs. 150 fee' : 'Free pickup'}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800 space-y-5">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">2</span>Your Details</h2>
                <div><input required type="text" placeholder="Full Name *" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className={\`w-full min-h-[56px] bg-black/50 border \${errors.name ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 text-white focus:outline-none focus:border-[#cc2b2b]\`} /></div>
                <div><input required type="tel" placeholder="WhatsApp / Phone Number *" value={formData.phone} onChange={e=>setFormData({...formData,phone:e.target.value})} className={\`w-full min-h-[56px] bg-black/50 border \${errors.phone ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 text-white focus:outline-none focus:border-[#cc2b2b]\`} /></div>
                <AnimatePresence>
                  {formData.orderType === 'delivery' && (
                    <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:'auto' }} exit={{ opacity:0, height:0 }}>
                      <textarea required rows="3" placeholder="Delivery Address *" value={formData.address} onChange={e=>setFormData({...formData,address:e.target.value})} className={\`w-full bg-black/50 border \${errors.address ? 'border-red-500' : 'border-gray-700'} rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#cc2b2b] resize-none\`} />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div><textarea rows="2" placeholder="Special instructions (spice level, allergies, etc.)" value={formData.note} onChange={e=>setFormData({...formData,note:e.target.value})} className="w-full bg-black/50 border border-dashed border-gray-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:border-[#d8a43f] resize-none" /></div>
              </div>

              {/* Payment */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-800">
                <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white flex items-center justify-center text-sm shadow-lg">3</span>Payment Method</h2>
                <div className="grid grid-cols-1 gap-3">
                  <label className={\`cursor-pointer min-h-[72px] rounded-xl border-2 flex justify-between px-5 items-center transition-all duration-300 \${
                    formData.paymentMethod === 'cod' ? 'bg-gradient-to-r from-[#d8a43f]/20 to-[#d8a43f]/5 border-[#d8a43f] shadow-lg' : 'bg-black/50 border-gray-800 hover:border-gray-600'
                  }\`}>
                    <input type="radio" name="paymentMethod" value="cod" className="hidden" checked={formData.paymentMethod === 'cod'} onChange={(e)=>setFormData({...formData, paymentMethod:e.target.value})} />
                    <div className="flex items-center gap-3"><div className="w-12 h-12 bg-gradient-to-br from-[#d8a43f]/20 to-[#d8a43f]/10 rounded-full flex items-center justify-center"><svg className="w-6 h-6 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg></div><div><span className="font-black text-sm uppercase tracking-wider">Cash on Delivery / Pickup</span><p className="text-[10px] text-gray-500 mt-1">Pay when you receive your order</p></div></div>
                    <div className={\`w-6 h-6 rounded-full border-2 flex items-center justify-center \${formData.paymentMethod === 'cod' ? 'border-[#d8a43f]' : 'border-gray-700'}\`}>{formData.paymentMethod === 'cod' && <div className="w-3 h-3 bg-[#d8a43f] rounded-full"></div>}</div>
                  </label>
                </div>
              </div>
              <button type="submit" disabled={isProcessing} className="hidden lg:flex w-full min-h-[72px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-2xl font-black uppercase tracking-wider hover:shadow-2xl items-center justify-center text-xl gap-3 disabled:opacity-50">{isProcessing ? (<><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>) : <>Place Order • Rs. {grandTotal}</>}</button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl border border-gray-800 sticky top-28 shadow-2xl overflow-hidden">
              <div className="p-5 md:p-6 border-b border-gray-800 bg-gradient-to-r from-[#cc2b2b]/10 to-transparent"><h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-2"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path></svg>Order Summary</h3><p className="text-xs text-gray-500 mt-1">{cart.length} items in cart</p></div>
              <div className="max-h-[40vh] overflow-y-auto divide-y divide-gray-800">
                {cart.map(item => (
                  <div key={item.id} className="p-4 md:p-5 hover:bg-white/5 transition-colors group">
                    <div className="flex gap-3"><img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover border border-gray-700" /><div className="flex-1 min-w-0"><h4 className="font-bold text-sm md:text-base line-clamp-1">{item.name}</h4><p className="text-[#d8a43f] font-bold text-sm mt-1">Rs. {item.price * item.qty}</p><div className="flex items-center gap-2 mt-2"><button onClick={()=>{if(item.qty>1) updateQuantity(item.id, item.qty-1); else removeFromCart(item.id);}} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#cc2b2b] transition-colors flex items-center justify-center text-white font-bold">-</button><span className="font-bold text-sm w-6 text-center">{item.qty}</span><button onClick={()=>updateQuantity(item.id, item.qty+1)} className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-[#cc2b2b] transition-colors flex items-center justify-center text-white font-bold">+</button></div></div><button onClick={()=>removeFromCart(item.id)} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button></div>
                  </div>
                ))}
              </div>
              <div className="p-5 border-t border-gray-800"><div className="flex gap-2"><input type="text" placeholder="Promo code" value={promoCode} onChange={e=>setPromoCode(e.target.value)} className="flex-1 bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#d8a43f]" /><button onClick={handlePromoApply} className="px-5 py-3 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] rounded-xl font-bold text-sm hover:shadow-lg">Apply</button></div>{appliedPromo && <p className="text-green-500 text-xs mt-2">✓ Promo {appliedPromo} applied! -Rs. {discount}</p>}</div>
              <div className="p-5 bg-black/30 space-y-3"><div className="flex justify-between text-sm text-gray-400"><span>Subtotal</span><span>Rs. {subtotal}</span></div>{deliveryFee>0 && <div className="flex justify-between text-sm text-gray-400"><span>Delivery Fee</span><span>Rs. {deliveryFee}</span></div>}{discount>0 && <div className="flex justify-between text-sm text-green-500"><span>Discount</span><span>-Rs. {discount}</span></div>}<div className="border-t border-gray-800 pt-3 mt-2"><div className="flex justify-between text-xl font-black"><span>Total</span><span className="text-[#d8a43f]">Rs. {grandTotal}</span></div></div></div>
              <div className="p-5 lg:hidden bg-gradient-to-t from-black to-transparent"><button type="submit" form="checkout-form" disabled={isProcessing} className="w-full min-h-[56px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white rounded-xl font-black uppercase tracking-wider flex items-center justify-center gap-2 disabled:opacity-50">{isProcessing ? (<><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Processing...</>) : <>Place Order • Rs. {grandTotal}</>}</button></div>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={()=>setShowSuccessModal(false)}>
            <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }} exit={{ scale:0.9, opacity:0 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl max-w-md w-full p-8 text-center border border-gray-700" onClick={e=>e.stopPropagation()}>
              <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:"spring", stiffness:200 }} className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg></motion.div>
              <h3 className="text-2xl font-black mb-2">Order Confirmed!</h3><p className="text-gray-400 mb-6">Your order has been sent to WhatsApp. We'll prepare it fresh!</p><div className="bg-black/50 rounded-xl p-4 mb-6"><p className="text-sm text-gray-400">Order Total</p><p className="text-2xl font-bold text-[#d8a43f]">Rs. {grandTotal}</p></div><p className="text-xs text-gray-500">Redirecting to home...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}`;
fs.writeFileSync('src/app/checkout/page.js', checkoutPage);
console.log('✅ Created: src/app/checkout/page.js');

console.log('\n🎉 All frontend files created!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm install" to install dependencies');
console.log('2. Run "npm run dev" to start development server');
console.log('3. Ensure your backend API is running at: ' + process.env.NEXT_PUBLIC_API_URL);
console.log('4. Deploy to Vercel using "vercel --prod"');