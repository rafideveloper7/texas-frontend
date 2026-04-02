const fs = require('fs');
const path = require('path');

// Create remaining directories (if not already created)
const directories = [
  'src/app/about',
  'src/app/checkout',
  'src/app/contact',
  'src/app/custom-order',
  'src/app/menu',
  'src/app/product/[id]',
  'src/app/products'
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}/`);
  }
});

// ==================== HOME PAGE ====================
const homePage = `"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  motion,
  useInView,
  useAnimation,
  AnimatePresence,
} from "framer-motion";
import { useCart } from "@/components/CartProvider";

export default function HomePage() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiItems, setApiItems] = useState([]);
  const [apiCats, setApiCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  const heroImages = [
    "/galleries/hero_desktop_1774507841290.png",
    "/galleries/bbq_items.jpg",
    "/galleries/karahi.jpg",
    "/galleries/restaurant_exterior_1774507931384.png",
  ];

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5001/api';
        const [itemsRes, catsRes] = await Promise.all([
          fetch(\`\${baseUrl}/menu\`),
          fetch(\`\${baseUrl}/categories\`)
        ]);
        const itemsData = await itemsRes.json();
        const catsData = await catsRes.json();
        setApiItems(itemsData.data || []);
        setApiCats(catsData.data || []);
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    setTimeout(() => {
      handleResize();
      setIsLoaded(true);
    }, 0);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (inView) controls.start("visible");
  }, [controls, inView]);

  useEffect(() => {
    if (!isLoaded) return;
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 6000);
    return () => clearInterval(timer);
  }, [isLoaded]);

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

  const handleCategoryClick = (categorySlug) => router.push(\`/menu?category=\${categorySlug}\`);

  const featuredItems = apiItems.filter((item) => item.isPopular || item.price > 1500).slice(0, 8);

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 50, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } } };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#d8a43f]"></div>
      </div>
    );
  }

  return (
    <div className="bg-black font-sans text-white overflow-x-hidden">
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: 50, x: "-50%" }} animate={{ opacity: 1, y: 0, x: "-50%" }} exit={{ opacity: 0, y: 50, x: "-50%" }} className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 bg-[#d8a43f] text-black px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 font-semibold">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero section – same as original but using dynamic data */}
      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            <motion.div key={currentSlide} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1.2 }} className="absolute inset-0 w-full h-full">
              <div className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat" style={{ backgroundImage: \`url(\${heroImages[currentSlide]})\`, backgroundPosition: "center center" }} />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="relative z-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="mb-6">
                  <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
                    <div className="flex items-center gap-1">{Array(5).fill().map((_, i) => <svg key={i} className="w-4 h-4 text-[#d8a43f] fill-current" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>)}</div>
                    <span className="text-white text-sm font-medium">4.9</span>
                    <span className="text-white/50 text-xs">• 2,500+ Reviews</span>
                  </div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mb-5">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-[1.2] tracking-tight">
                    <span className="block text-white">Kohat</span>
                    <span className="block bg-gradient-to-r from-[#d8a43f] via-[#cc2b2b] to-[#d8a43f] bg-clip-text text-transparent mt-1">Finest Grill</span>
                  </h1>
                </motion.div>
                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-gray-300 text-base md:text-lg mb-8 max-w-lg leading-relaxed">
                  Premium steaks, authentic karahi, and the perfect blend of American BBQ with Pakistani tradition. Experience the taste that made us Kohat favorite.
                </motion.p>
                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 mb-10">
                  <Link href="/menu"><button className="group relative px-8 py-3.5 bg-[#d8a43f] text-black font-bold rounded-full overflow-hidden shadow-xl hover:shadow-[#d8a43f]/30 transition-shadow duration-300"><span className="relative z-10 flex items-center gap-2">View Full Menu<svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></span></button></Link>
                  <Link href="/custom-order"><button className="px-8 py-3.5 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300">Reserve a Table</button></Link>
                </motion.div>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="flex flex-wrap gap-6">
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">100% Halal</p><p className="text-gray-400 text-xs">Certified Premium Meat</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">Fresh Daily</p><p className="text-gray-400 text-xs">Made to Order</p></div></div>
                  <div className="flex items-center gap-2"><div className="w-10 h-10 rounded-full bg-[#d8a43f]/20 flex items-center justify-center"><svg className="w-5 h-5 text-[#d8a43f]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg></div><div><p className="text-white font-semibold text-sm">Kohat Best</p><p className="text-gray-400 text-xs">Since 2010</p></div></div>
                </motion.div>
              </div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8, type: "spring" }} className="hidden lg:block">
                <div className="relative w-[75%]"><div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-4 border border-white/20 shadow-2xl"><div className="absolute inset-0 rounded-3xl border-2 border-[#d8a43f]/30 pointer-events-none"></div><div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-[#d8a43f]/20 to-[#cc2b2b]/20 blur-xl -z-10"></div>
                  <div className="relative grid grid-cols-3 grid-rows-3 gap-3 h-[500px] w-full">
                    <motion.div className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group"><img src="/galleries/bbq_items.jpg" alt="BBQ Platter" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></motion.div>
                    <motion.div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group"><img src="/galleries/crunchy_zinger_burger_1774507949571.png" alt="Zinger Burger" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></motion.div>
                    <motion.div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group"><img src="/galleries/karahi.jpg" alt="Karahi" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></motion.div>
                    <motion.div className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group"><img src="/galleries/rice_biryani.jpg" alt="Biryani" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></motion.div>
                    <motion.div className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative group"><img src="/galleries/pizza.jpg" alt="Pizza" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /></motion.div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-[#d8a43f]/20 rounded-full blur-xl"></div>
                  </div>
                  <motion.div className="absolute -top-4 -right-4 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] text-black px-4 py-2 rounded-full shadow-2xl"><div className="flex items-center gap-2"><span className="text-lg">⭐</span><span className="font-bold text-sm">20+ Signature Dishes</span></div></motion.div>
                  <motion.div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap"><p className="text-xs text-white">✨ Authentic Pakistani Flavors • Texas Style Grilling ✨</p></motion.div>
                </div></div>
              </motion.div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">{heroImages.map((_, idx) => (<button key={idx} onClick={() => setCurrentSlide(idx)} className={\`transition-all duration-500 rounded-full \${currentSlide === idx ? "w-8 h-1 bg-[#d8a43f]" : "w-2 h-1 bg-white/40 hover:bg-white/60"}\`} />))}</div>
      </section>

      {/* Categories section */}
      <section className="py-20 bg-black px-4"><div className="max-w-7xl mx-auto"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12"><span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Discover</span><h2 className="text-3xl md:text-4xl font-black mt-2">Our Signature Categories</h2><div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div></motion.div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">{apiCats.slice(0, 10).map((category) => (<motion.div key={category._id} variants={itemVariants} whileHover={{ y: -5 }} className="group cursor-pointer" onClick={() => handleCategoryClick(category.slug)}><div className="relative overflow-hidden rounded-xl aspect-square bg-gray-900 border border-gray-800"><img src={category.image?.url || category.image} alt={category.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" /><div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" /><div className="absolute bottom-0 left-0 right-0 p-3 text-center"><h3 className="text-white font-bold text-sm">{category.name}</h3><p className="text-[#d8a43f] text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition">Explore →</p></div></div></motion.div>))}</motion.div></div></section>

      {/* Signature dishes */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-900 px-4"><div className="max-w-7xl mx-auto"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12"><span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Must Try</span><h2 className="text-3xl md:text-4xl font-black mt-2">Signature Dishes</h2><div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div></motion.div>
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">{featuredItems.map((item) => (<motion.div key={item._id} variants={itemVariants} whileHover={{ y: -5 }} className="group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-[#d8a43f]/50 transition-all duration-300"><Link href={\`/product/\${item._id}\`}><div className="relative h-44 overflow-hidden"><img src={item.image?.url || item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" />{(item.isPopular || item.price > 2000) && <span className="absolute top-2 right-2 bg-[#d8a43f] text-black text-[10px] font-bold px-2 py-1 rounded-full">Chefs Pick</span>}</div></Link><div className="p-3"><Link href={\`/product/\${item._id}\`}><h3 className="font-bold text-sm mb-1 line-clamp-1 hover:text-[#d8a43f] transition">{item.name}</h3></Link><p className="text-gray-500 text-xs mb-2 line-clamp-2">{item.description}</p><div className="flex justify-between items-center"><span className="text-[#d8a43f] font-bold">Rs. {item.price}</span><button onClick={() => handleAddToCart(item)} className="w-8 h-8 bg-[#d8a43f]/20 rounded-full flex items-center justify-center hover:bg-[#d8a43f] transition-colors"><svg className="w-4 h-4 text-[#d8a43f] hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg></button></div></div></motion.div>))}</motion.div>
        <div className="text-center mt-10"><Link href="/menu"><button className="px-8 py-3 border-2 border-[#d8a43f] text-[#d8a43f] font-bold rounded-full hover:bg-[#d8a43f] hover:text-black transition-all duration-300">View Full Menu</button></Link></div></div></section>

      {/* About preview */}
      <section className="py-20 bg-black px-4"><div className="max-w-7xl mx-auto"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"><motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}><span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Our Story</span><h2 className="text-3xl md:text-4xl font-black mt-2 mb-4">Where Tradition Meets Flame</h2><div className="w-12 h-0.5 bg-[#d8a43f] mb-6"></div><p className="text-gray-400 leading-relaxed mb-6">Experience the perfect fusion of American BBQ and Pakistani tradition in the heart of Kohat. Every dish tells a story of passion, tradition, and culinary excellence.</p><div className="grid grid-cols-2 gap-4 mb-6"><div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">14+</div><div className="text-xs text-gray-500 mt-1">Years of Excellence</div></div><div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">50K+</div><div className="text-xs text-gray-500 mt-1">Happy Customers</div></div></div><Link href="/about"><button className="text-[#d8a43f] font-semibold flex items-center gap-2 hover:gap-3 transition-all">Learn More About Us<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button></Link></motion.div><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative"><div className="relative rounded-xl overflow-hidden shadow-2xl"><img src="/galleries/restaurant_exterior_1774507931384.png" alt="Texas Grill Restaurant" className="w-full h-auto object-cover" /></div></motion.div></div></div></section>

      {/* CTA */}
      <section className="py-16 px-4"><div className="max-w-7xl mx-auto"><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-10 text-center"><div className="absolute inset-0 bg-black/20"></div><div className="relative z-10"><h3 className="text-2xl md:text-3xl font-black mb-3">Ready for an Experience?</h3><p className="text-white/90 mb-6 max-w-2xl mx-auto">Book your table now and discover why we are Kohats most loved grill restaurant.</p><Link href="/custom-order"><button className="px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition">Reserve Your Table</button></Link></div></motion.div></div></section>
    </div>
  );
}`;
fs.writeFileSync('src/app/page.js', homePage);
console.log('✅ Created: src/app/page.js');

// ==================== ABOUT PAGE ====================
const aboutPage = `'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';

export default function AboutPage() {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // Since there's no specific about endpoint, we'll use categories and menu data to derive info
        // Or we can create a separate about endpoint later. For now, we'll hardcode the about text.
        // But to keep dynamic, we can fetch from backend if you add an about route.
        setAboutData({
          text: "Born in the vibrant streets of Kohat, Texas Grill serves as a beacon of culinary authenticity, blending traditional Pakistani recipes with premium Texas-style grilling techniques.",
          address: "Village Togh Bala, Kohat, Pakistan",
          mapLink: "https://maps.app.goo.gl/f2RDbL316e3VoFgc6",
          hours: [
            { day: "Monday", time: "12:00 PM - 12:00 AM" },
            { day: "Tuesday", time: "12:00 PM - 12:00 AM" },
            { day: "Wednesday", time: "12:00 PM - 12:00 AM" },
            { day: "Thursday", time: "12:00 PM - 12:00 AM" },
            { day: "Friday", time: "12:00 PM - 12:00 AM" },
            { day: "Saturday", time: "12:00 PM - 12:00 AM" },
            { day: "Sunday", time: "12:00 PM - 12:00 AM" }
          ]
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  }, []);

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const stats = [
    { value: "14+", label: "Years of Excellence", icon: "🏆", color: "from-amber-500 to-yellow-500" },
    { value: "50K+", label: "Happy Customers", icon: "👥", color: "from-red-500 to-orange-500" },
    { value: "100+", label: "Signature Dishes", icon: "🍖", color: "from-yellow-500 to-amber-500" },
    { value: "24/7", label: "Service Available", icon: "⏰", color: "from-green-500 to-emerald-500" }
  ];

  const timeline = [
    { year: "2010", title: "The Humble Beginning", description: "Started as a small street-side corner in Kohat, serving authentic chicken broast with secret family recipes.", icon: "🔥" },
    { year: "2015", title: "Arabian Mandi Revolution", description: "Introduced Kohat's first authentic underground Arabian Mandi, cooked in traditional clay ovens.", icon: "🏺" },
    { year: "2020", title: "Premium Dining Experience", description: "Expanded to a state-of-the-art premium dine-in facility seating 300+ guests.", icon: "🏛️" },
    { year: "2024", title: "Digital Evolution", description: "Launched online ordering and delivery services, bringing Texas Grill flavors to every home in Kohat.", icon: "📱" }
  ];

  const values = [
    { title: "Quality First", description: "Only the freshest ingredients, halal certified", icon: "🥩", color: "red" },
    { title: "Authentic Flavors", description: "Traditional recipes passed down through generations", icon: "👨‍🍳", color: "amber" },
    { title: "Customer Love", description: "Your satisfaction is our greatest achievement", icon: "❤️", color: "pink" },
    { title: "Innovation", description: "Blending tradition with modern techniques", icon: "💡", color: "blue" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } }
  };
  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-secondary"></div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12 md:mb-20">
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-block text-[#d8a43f] font-black tracking-[0.2em] text-xs md:text-sm uppercase mb-4 bg-[#d8a43f]/10 px-4 py-2 rounded-full backdrop-blur-sm">🔥 Our Legacy 🔥</motion.span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">The Legend</span><br />
            <span className="bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] bg-clip-text text-transparent">of Kohat</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg">Where Texas-style grilling meets Pakistani tradition</p>
        </motion.div>

        {/* Story Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center mb-20 md:mb-32">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2 relative group">
            <div className="aspect-[4/3] relative rounded-2xl md:rounded-3xl overflow-hidden border border-gray-800 shadow-2xl">
              <img src="/galleries/restaurant_exterior_1774507931384.png" alt="Texas Grill Restaurant" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black to-transparent"><p className="text-sm text-gray-300">Est. 2010 • Kohat, Pakistan</p></div>
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 border-t-2 border-l-2 border-[#d8a43f]/30 rounded-tl-2xl"></div>
            <div className="absolute -bottom-4 -right-4 w-20 h-20 border-b-2 border-r-2 border-[#d8a43f]/30 rounded-br-2xl"></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="w-full lg:w-1/2">
            <span className="text-[#d8a43f] font-bold text-sm uppercase tracking-wider mb-4 inline-block">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight mb-6 leading-tight">Crafting Perfection<span className="block text-[#d8a43f]">Since Day One</span></h2>
            <div className="w-20 h-1 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] mb-8"></div>
            <div className="space-y-5 text-gray-300 leading-relaxed text-base md:text-lg mb-10">
              <p>{aboutData?.text}</p>
              <p>Every portion of our signature dishes is prepared with passion, using organic clay pots and traditional methods to bring out the pure, authentic taste that Kohat has come to love. From our smoky BBQ platters to our sizzling steaks, we engineer memories under a fiery grill.</p>
            </div>
            <div className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-l-4 border-[#d8a43f] p-6 rounded-r-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 text-[#d8a43f]/5 text-6xl font-serif">"</div>
              <p className="relative z-10 text-lg md:text-xl italic font-serif text-white leading-relaxed">"We don't just serve food. We engineer memories under a fiery grill."</p>
              <p className="relative z-10 mt-3 text-sm text-[#d8a43f] font-bold">— Chef's Table, Texas Grill</p>
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <motion.div variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-20 md:mb-32">
          {stats.map((stat, idx) => (
            <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-gray-800 p-6 md:p-8 rounded-2xl text-center group">
              <div className={\`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br \${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition\`}><span className="text-2xl md:text-3xl">{stat.icon}</span></div>
              <h3 className="text-3xl md:text-4xl font-black text-white mb-2">{stat.value}</h3>
              <p className="text-xs md:text-sm font-bold uppercase text-gray-500 tracking-wider">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Timeline */}
        <div className="mb-20 md:mb-32">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="text-[#d8a43f] text-sm font-bold tracking-wider uppercase">Our Journey</span>
            <h2 className="text-3xl md:text-5xl font-black mt-2">Milestones That <span className="text-[#d8a43f]">Matter</span></h2>
          </motion.div>
          <div className="relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-[#d8a43f] via-[#cc2b2b] to-transparent"></div>
            {timeline.map((item, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className={\`relative flex flex-col md:flex-row items-center gap-6 mb-12 md:mb-16 \${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}\`}>
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#d8a43f] to-[#cc2b2b] rounded-full z-20 flex items-center justify-center shadow-xl"><span className="text-white text-xl">{item.icon}</span></div>
                <div className={\`w-full md:w-5/12 pl-16 md:pl-0 \${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}\`}>
                  <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-gray-800 hover:border-[#d8a43f]/50 transition">
                    <span className="inline-block bg-[#cc2b2b] text-white px-3 py-1 rounded-full text-xs font-black mb-3">{item.year}</span>
                    <h3 className="text-xl font-black mb-2 text-[#d8a43f]">{item.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
                <div className="hidden md:block w-5/12"></div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-20 md:mb-32">
          <div className="text-center mb-12"><span className="text-[#d8a43f] text-sm font-bold tracking-wider uppercase">What We Stand For</span><h2 className="text-3xl md:text-5xl font-black mt-2">Our Core <span className="text-[#d8a43f]">Values</span></h2></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {values.map((value, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 text-center border border-gray-800 hover:border-[#d8a43f]/50 transition-all">
                <div className="text-4xl mb-3">{value.icon}</div>
                <h3 className="text-lg font-bold mb-2 text-white">{value.title}</h3>
                <p className="text-gray-400 text-xs">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10"><h3 className="text-2xl md:text-4xl font-black mb-4">Ready to Experience Texas Grill?</h3><p className="text-white/90 mb-6 max-w-2xl mx-auto">Join us for an unforgettable dining experience in the heart of Kohat</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link href="/menu"><button className="px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition">View Our Menu</button></Link><Link href="/custom-order"><button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition">Reserve a Table</button></Link></div></div>
        </motion.div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/about/page.js', aboutPage);
console.log('✅ Created: src/app/about/page.js');

// ==================== CONTACT PAGE ====================
const contactPage = `'use client';
import { useState, useEffect } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Link from 'next/link';

export default function ContactPage() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [formStatus, setFormStatus] = useState(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(\`\${baseUrl}/contact\`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setFormStatus('success');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormStatus(null), 3000);
      } else {
        throw new Error(data.message || 'Failed to send');
      }
    } catch (err) {
      console.error(err);
      setFormStatus('error');
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const contactInfo = [
    { icon: "📍", title: "Visit Us", details: "Village Togh Bala, Kohat, Pakistan", action: "Get Directions", link: "https://maps.app.goo.gl/f2RDbL316e3VoFgc6" },
    { icon: "📞", title: "Call Us", details: "+92 300 0000000", action: "Call Now", link: "tel:+923000000000" },
    { icon: "✉️", title: "Email Us", details: "info@texasgrill.pk", action: "Send Email", link: "mailto:info@texasgrill.pk" },
    { icon: "⏰", title: "Opening Hours", details: "12:00 PM - 12:00 AM", action: "View Hours", link: "#hours" }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://facebook.com", color: "from-blue-600 to-blue-700", followers: "15K" },
    { name: "Instagram", icon: "📸", url: "https://instagram.com", color: "from-pink-500 to-purple-600", followers: "22K" },
    { name: "WhatsApp", icon: "💬", url: "https://wa.me/923000000000", color: "from-green-500 to-green-600", followers: "Order Now" },
    { name: "TikTok", icon: "🎵", url: "https://tiktok.com", color: "from-black to-gray-800", followers: "8K" }
  ];

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } };
  const itemVariants = { hidden: { y: 30, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 12 } } };

  return (
    <div className="bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none"><div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div><div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="text-center mb-12 md:mb-16">
          <motion.span initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="inline-block text-[#d8a43f] font-black tracking-[0.2em] text-xs md:text-sm uppercase mb-4 bg-[#d8a43f]/10 px-4 py-2 rounded-full backdrop-blur-sm">📍 Get In Touch</motion.span>
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6"><span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Visit</span><span className="block md:inline md:ml-4 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] bg-clip-text text-transparent">Texas Grill</span></motion.h1>
          <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "100px" }} transition={{ delay: 0.5 }} className="w-24 h-1 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] mx-auto" />
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-gray-400 max-w-2xl mx-auto mt-6 text-base md:text-lg">Visit us in the heart of Kohat for an unforgettable dining experience</motion.p>
        </motion.div>

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16">
          {contactInfo.map((info, idx) => (
            <motion.a key={idx} href={info.link} target={info.link.startsWith('http') ? '_blank' : undefined} rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined} variants={itemVariants} whileHover={{ y: -5 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-gray-800 hover:border-[#d8a43f]/50 transition-all duration-300 group cursor-pointer">
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{info.icon}</div><h3 className="text-lg font-black mb-2 text-white">{info.title}</h3><p className="text-gray-400 text-sm mb-3 leading-relaxed">{info.details}</p>
              <span className="text-[#d8a43f] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">{info.action}<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg></span>
            </motion.a>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
            <div className="mb-6"><h2 className="text-2xl md:text-3xl font-black mb-2">Send a Message</h2><p className="text-gray-400 text-sm">We'll get back to you within 24 hours</p><div className="w-16 h-1 bg-[#d8a43f] mt-4"></div></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="block text-sm font-bold mb-2 text-gray-300">Your Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="Enter your full name" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-300">Email Address *</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="your@email.com" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-300">Phone Number</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition" placeholder="+92 300 0000000" /></div>
              <div><label className="block text-sm font-bold mb-2 text-gray-300">Your Message *</label><textarea name="message" value={formData.message} onChange={handleChange} required rows="4" className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition resize-none" placeholder="Tell us about your inquiry, reservation request, or feedback..." /></div>
              <button type="submit" disabled={formStatus === 'sending'} className="w-full min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {formStatus === 'sending' ? (<span className="flex items-center justify-center gap-2"><svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Sending...</span>) : "Send Message"}
              </button>
              {formStatus === 'success' && <div className="bg-green-500/20 border border-green-500 rounded-xl p-3 text-center text-green-400 text-sm">✓ Message sent successfully! We'll contact you soon.</div>}
              {formStatus === 'error' && <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-center text-red-400 text-sm">✗ Failed to send. Please try again later.</div>}
            </form>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
            <div className="mb-6"><h2 className="text-2xl md:text-3xl font-black mb-2">Find Us Here</h2><p className="text-gray-400 text-sm">Visit our restaurant in Kohat</p><div className="w-16 h-1 bg-[#d8a43f] mt-4"></div></div>
            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ height: '350px', minHeight: '350px' }}>
              {!isMapLoaded && (<div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10"><div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d8a43f]"></div></div>)}
              <iframe title="Texas Grill Kohat Location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26573.03369685814!2d71.37050961847119!3d33.585501869389274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d8e5760bdffff1%3A0xe54ec0d4b85c18b7!2sKohat%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!4m5!1s0x38d8e5760bdffff1%3A0xe54ec0d4b85c18b7!2sTexas%20Grill%20Kohat!3m2!1d33.588701!2d71.4495!5e0!3m2!1sen!2s!4v1703648079532!5m2!1sen!2s" className="absolute inset-0 w-full h-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" onLoad={() => setIsMapLoaded(true)} />
            </div>
            <div className="mt-5 flex justify-between items-center flex-wrap gap-3"><div className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div><span className="text-xs text-gray-400">Open Now • 12:00 PM - 12:00 AM</span></div><a href="https://maps.app.goo.gl/f2RDbL316e3VoFgc6" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#d8a43f] text-sm font-bold hover:gap-3 transition-all"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>Get Directions via Google Maps</a></div>
          </motion.div>
        </div>

        <motion.div id="hours" initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800 mb-16">
          <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-black mb-2">Opening Hours</h2><p className="text-gray-400 text-sm">We're ready to serve you delicious meals</p><div className="w-16 h-1 bg-[#d8a43f] mx-auto mt-4"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
              <div key={day} className="text-center p-4 bg-black/30 rounded-xl">
                <p className="font-black text-white text-lg">{day}</p>
                <p className="text-[#d8a43f] font-bold mt-1">12:00 PM - 12:00 AM</p>
                {day === 'Friday' && <p className="text-xs text-gray-500 mt-1">Prayer Break: 1:00 PM - 2:30 PM</p>}
              </div>
            ))}
          </div>
          <div className="mt-6 text-center bg-[#d8a43f]/10 rounded-xl p-4"><p className="text-sm text-gray-300">📞 Last order 30 minutes before closing • Delivery available within Kohat city</p></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }} className="text-center mb-12"><h2 className="text-2xl md:text-3xl font-black mb-6">Follow Our Journey</h2><div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">{socialLinks.map((social, idx) => (<a key={idx} href={social.url} target="_blank" rel="noopener noreferrer" className={\`group relative overflow-hidden bg-gradient-to-br \${social.color} rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl\`}><div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div><div className="relative z-10"><div className="text-3xl md:text-4xl mb-2">{social.icon}</div><p className="text-sm font-bold uppercase tracking-wider">{social.name}</p><p className="text-xs text-white/80 mt-1">{social.followers}</p></div></a>))}</div></motion.div>

        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }} className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800">
          <div className="text-center mb-8"><h2 className="text-2xl md:text-3xl font-black mb-2">Frequently Asked Questions</h2><p className="text-gray-400 text-sm">Quick answers to common questions</p><div className="w-16 h-1 bg-[#d8a43f] mx-auto mt-4"></div></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4"><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">Do you offer home delivery?</h3><p className="text-gray-400 text-sm">Yes! We deliver within Kohat city. Minimum order Rs. 500, delivery fee Rs. 150.</p></div><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">Do I need to make a reservation?</h3><p className="text-gray-400 text-sm">Reservations are recommended for weekends and large groups (6+ people).</p></div><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">Is there parking available?</h3><p className="text-gray-400 text-sm">Yes, we have free parking space available for our customers.</p></div></div>
            <div className="space-y-4"><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">Do you cater for events?</h3><p className="text-gray-400 text-sm">Yes! We offer catering services for events, parties, and corporate functions.</p></div><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">Are your meats halal?</h3><p className="text-gray-400 text-sm">100% halal certified. All our meat is sourced from trusted halal suppliers.</p></div><div className="bg-black/30 rounded-xl p-4"><h3 className="font-black text-[#d8a43f] mb-2">What's your cancellation policy?</h3><p className="text-gray-400 text-sm">Free cancellation up to 1 hour before reservation time.</p></div></div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.7 }} className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-8 md:p-12 text-center">
          <div className="absolute inset-0 bg-black/20"></div><div className="relative z-10"><h3 className="text-2xl md:text-3xl font-black mb-4">Have More Questions?</h3><p className="text-white/90 mb-6 max-w-2xl mx-auto">We're here to help! Contact us anytime and we'll get back to you promptly.</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><a href="tel:+923000000000"><button className="px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition">Call Us Now</button></a><Link href="/custom-order"><button className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition">Make a Reservation</button></Link></div></div>
        </motion.div>
      </div>
    </div>
  );
}`;
fs.writeFileSync('src/app/contact/page.js', contactPage);
console.log('✅ Created: src/app/contact/page.js');

console.log('\n🎉 Part 2 complete! Now run Part 3 to add remaining pages (Checkout, Custom Order, Menu, Products, Product Detail).');