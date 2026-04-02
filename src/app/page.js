"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/CartProvider";
// import IKImage from "@/components/IKImage";
import { CategorySkeleton, DishSkeleton } from "@/components/LoadingSkeleton";
import { IKImage } from '@imagekit/next';

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [apiItems, setApiItems] = useState([]);
  const [apiCats, setApiCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroImages = [
    "https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-2.jpg",
    "https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-3.jpg",
    "https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-1.jpg",
    "https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-4.jpg",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        const [itemsRes, catsRes] = await Promise.all([
          fetch(`${baseUrl}/menu`),
          fetch(`${baseUrl}/categories`)
        ]);
        if (!itemsRes.ok || !catsRes.ok) throw new Error("Failed to fetch");
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        setApiItems(itemsData.data || []);
        setApiCats(catsData.data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load data. Please refresh.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

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

  const handleCategoryClick = (categorySlug) => {
    router.push(`/menu?category=${categorySlug}`);
  };

  const featuredItems = apiItems
    .filter((item) => item.isPopular || item.price > 1500)
    .slice(0, 8);

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="bg-primary px-4 py-2 rounded">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black font-sans text-white overflow-x-hidden">
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 50, x: "-50%" }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a43f] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section – background images stay as CSS background, collage uses IKImage */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0 w-full h-full"
            >
              <div
                className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${heroImages[currentSlide]})`, backgroundPosition: "center center" }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <div className="flex items-center gap-1">{Array(5).fill().map((_, i) => <svg key={i} className="w-4 h-4 text-[#d8a43f] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}</div>
                    <span className="text-white text-sm font-medium">4.9</span>
                    <span className="text-white/50 text-xs">• 2,500+ Reviews</span>
                  </div>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] tracking-tight">
                  <span className="block text-white">Kohat</span>
                  <span className="block bg-gradient-to-r from-[#d8a43f] via-[#cc2b2b] to-[#d8a43f] bg-clip-text text-transparent mt-1">Finest Grill</span>
                </h1>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-lg leading-relaxed">Premium steaks, authentic karahi, and the perfect blend of American BBQ with Pakistani tradition.</p>
                <div className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/menu"><button className="px-8 py-3.5 bg-[#d8a43f] text-black font-bold rounded-full shadow-xl">View Full Menu</button></Link>
                  <Link href="/custom-order"><button className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black">Reserve a Table</button></Link>
                </div>
                <div className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">100% Halal</p><p className="text-gray-400 text-xs">Certified Premium Meat</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">Fresh Daily</p><p className="text-gray-400 text-xs">Made to Order</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">Kohat Best</p><p className="text-gray-400 text-xs">Since 2010</p></div></div>
                </div>
              </div>
              <div className="hidden lg:block relative">
                <div className="relative w-full">
                  <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-4 border border-white/20">
                    <div className="absolute inset-0 rounded-3xl border-2 border-[#d8a43f]/30 pointer-events-none"></div>
                    <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px] w-full">
                      <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative">
                        <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-6.jpg" alt="BBQ" width={600} height={400} className="w-full h-full object-cover" priority />
                      </div>
                      <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
                        <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-9.jpg" alt="Burger" width={200} height={200} className="w-full h-full object-cover" />
                      </div>
                      <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
                        <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-4.jpg" alt="Karahi" width={200} height={200} className="w-full h-full object-cover" />
                      </div>
                      <div className="col-span-1 row-span-1 rounded-2xl overflow-hidden">
                        <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-4.jpg" alt="Biryani" width={200} height={200} className="w-full h-full object-cover" />
                      </div>
                      <div className="col-span-2 row-span-1 rounded-2xl overflow-hidden">
                        <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/hero-8.jpg" alt="Pizza" width={400} height={200} className="w-full h-full object-cover" />
                      </div>
                    </div>
                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] text-black px-4 py-2 rounded-full shadow-2xl"><div className="flex items-center gap-2"><span className="text-lg">⭐</span><span className="font-bold text-sm">20+ Signature Dishes</span></div></div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20"><p className="text-xs text-white">✨ Authentic Pakistani Flavors • Texas Style Grilling ✨</p></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (<button key={idx} onClick={() => setCurrentSlide(idx)} className={`transition-all duration-500 rounded-full ${currentSlide === idx ? "w-8 h-1 bg-[#d8a43f]" : "w-2 h-1 bg-white/40 hover:bg-white/60"}`} />))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-black px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Discover</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Our Signature Categories</h2>
            <div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {loading ? (
              Array(5).fill().map((_, i) => <CategorySkeleton key={i} />)
            ) : (
              apiCats.slice(0, 10).map((category) => (
                <div key={category._id} onClick={() => handleCategoryClick(category.slug)} className="group cursor-pointer">
                  <div className="relative overflow-hidden rounded-xl aspect-square bg-gray-900 border border-gray-800">
                    <IKImage src={category.image?.url || category.image} alt={category.name} width={300} height={300} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                      <h3 className="text-white font-bold text-sm">{category.name}</h3>
                      <p className="text-[#d8a43f] text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition">Explore →</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Signature Dishes */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Must Try</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Signature Dishes</h2>
            <div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {loading ? (
              Array(8).fill().map((_, i) => <DishSkeleton key={i} />)
            ) : (
              featuredItems.map((item) => (
                <div key={item._id} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-[#d8a43f]/50 transition-all duration-300">
                  <Link href={`/product/${item._id}`}>
                    <div className="relative h-44 overflow-hidden">
                      <IKImage src={item.image?.url || item.image} alt={item.name} width={400} height={300} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" priority={item.isPopular} />
                      {(item.isPopular || item.price > 2000) && <span className="absolute top-2 right-2 bg-[#d8a43f] text-black text-[10px] font-bold px-2 py-1 rounded-full">Chefs Pick</span>}
                    </div>
                  </Link>
                  <div className="p-3">
                    <Link href={`/product/${item._id}`}><h3 className="font-bold text-sm mb-1 line-clamp-1 hover:text-[#d8a43f] transition">{item.name}</h3></Link>
                    <p className="text-gray-500 text-xs mb-2 line-clamp-2">{item.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-[#d8a43f] font-bold">Rs. {item.price}</span>
                      <button onClick={() => handleAddToCart(item)} className="w-8 h-8 bg-[#d8a43f]/20 rounded-full flex items-center justify-center hover:bg-[#d8a43f] transition-colors">
                        <svg className="w-4 h-4 text-[#d8a43f] hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="text-center mt-10">
            <Link href="/menu"><button className="px-8 py-3 border-2 border-[#d8a43f] text-[#d8a43f] font-bold rounded-full hover:bg-[#d8a43f] hover:text-black transition">View Full Menu</button></Link>
          </div>
        </div>
      </section>

      {/* About Preview – static */}
      <section className="py-20 bg-black px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2 mb-4">Where Tradition Meets Flame</h2>
              <div className="w-12 h-0.5 bg-[#d8a43f] mb-6"></div>
              <p className="text-gray-400 leading-relaxed mb-6">Experience the perfect fusion of American BBQ and Pakistani tradition in the heart of Kohat. Every dish tells a story of passion, tradition, and culinary excellence.</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">14+</div><div className="text-xs text-gray-500 mt-1">Years of Excellence</div></div>
                <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">50K+</div><div className="text-xs text-gray-500 mt-1">Happy Customers</div></div>
              </div>
              <Link href="/about"><button className="text-[#d8a43f] font-semibold flex items-center gap-2 hover:gap-3 transition-all">Learn More About Us<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button></Link>
            </div>
            <div className="relative"><div className="relative rounded-xl overflow-hidden shadow-2xl"><IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/logo.png" alt="Texas Grill" width={800} height={600} className="w-full h-auto object-cover" priority /></div></div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-10 text-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Ready for an Experience?</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">Book your table now and discover why we are Kohats most loved grill restaurant.</p>
              <Link href="/custom-order"><button className="px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition">Reserve Your Table</button></Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}