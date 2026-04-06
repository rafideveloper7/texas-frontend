"use client";

// Homepage interactions stay on the client while primary data is rendered on the server.
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/components/CartProvider";
import FastImage from "@/components/FastImage";
import GsapReveal from "@/components/GsapReveal";

function HomeImage({ src, alt, className, priority = false, sizes }) {
  return (
    <div className={className}>
      <FastImage
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    </div>
  );
}

export default function HomePageClient({ initialItems, initialCategories }) {
  const router = useRouter();
  const { addToCart } = useCart();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const apiItems = initialItems ?? [];
  const apiCats = initialCategories ?? [];

  const heroImages = useMemo(
    () =>
      [
        process.env.NEXT_PUBLIC_HERO_IMAGE_1,
        process.env.NEXT_PUBLIC_HERO_IMAGE_2,
        process.env.NEXT_PUBLIC_HERO_IMAGE_3,
        process.env.NEXT_PUBLIC_HERO_IMAGE_4,
      ].filter(Boolean),
    []
  );

  const collageImages = useMemo(
    () => ({
      large: process.env.NEXT_PUBLIC_COLLAGE_LARGE,
      small1: process.env.NEXT_PUBLIC_COLLAGE_SMALL_1,
      small2: process.env.NEXT_PUBLIC_COLLAGE_SMALL_2,
      small3: process.env.NEXT_PUBLIC_COLLAGE_SMALL_3,
      wide: process.env.NEXT_PUBLIC_COLLAGE_WIDE,
    }),
    []
  );

  useEffect(() => {
    if (heroImages.length < 2) {
      return undefined;
    }

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

  return (
    <div className="light-shell bg-black font-sans text-white overflow-x-hidden">
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

      <section className="relative min-h-screen w-full overflow-hidden">
        <div className="absolute inset-0 w-full h-full">
          <AnimatePresence mode="wait">
            {heroImages.length > 0 && (
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="absolute inset-0 w-full h-full"
              >
                <HomeImage
                  src={heroImages[currentSlide]}
                  alt="Texas Wings and Grill hero"
                  className="absolute inset-0"
                  priority
                  sizes="100vw"
                />
                <div className="hero-overlay hero-overlay-x absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
                <div className="hero-overlay hero-overlay-y absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="hero-overlay hero-overlay-soft absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="relative z-20 min-h-screen flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16 md:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
              <div className="text-center lg:text-left">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }} className="light-hero-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 mb-6">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.07 5.82 22 7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white text-sm font-semibold">4.9</span>
                  <span className="text-gray-300 text-xs">(2,500+ reviews)</span>
                </motion.div>

                <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8 }} className="mb-6 text-[2.85rem] sm:text-[4rem] md:text-[5.25rem] lg:text-[6.25rem] xl:text-[7.5rem] 2xl:text-[8.25rem] font-black leading-[0.95] tracking-[-0.05em]">
                  <span className="block text-white/95">Kohat&apos;s</span>
                  <span className="mt-2 block">
                    <span className="inline-block bg-gradient-to-r from-[#ffd47a] via-[#e85b3a] to-[#ffbf5f] bg-clip-text text-transparent drop-shadow-[0_6px_24px_rgba(0,0,0,0.28)]">
                      Finest Grill
                    </span>
                  </span>
                </motion.h1>

                <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.8 }} className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                  Premium steaks, authentic karahi, and the perfect blend of American BBQ with Pakistani tradition.
                </motion.p>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-10">
                  <Link href="/menu">
                    <button className="pressable glow-sheen group relative px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-black font-bold rounded-full overflow-hidden shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
                      <span className="relative z-10 flex items-center gap-2">
                        View Full Menu
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </button>
                  </Link>
                  <Link href="/custom-order">
                    <button className="pressable light-outline-button px-8 py-4 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-black transition-all duration-300 hover:scale-105">
                      Reserve a Table
                    </button>
                  </Link>
                </motion.div>

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="grid grid-cols-3 gap-4 max-w-md mx-auto lg:mx-0">
                  <div className="flex flex-col items-center lg:items-start gap-2"><div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"><svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="text-white font-semibold text-sm">100% Halal</p><p className="text-gray-400 text-xs">Certified</p></div>
                  <div className="flex flex-col items-center lg:items-start gap-2"><div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"><svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div><p className="text-white font-semibold text-sm">Fresh Daily</p><p className="text-gray-400 text-xs">Made to Order</p></div>
                  <div className="flex flex-col items-center lg:items-start gap-2"><div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center"><svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /></svg></div><p className="text-white font-semibold text-sm">Since 2010</p><p className="text-gray-400 text-xs">14+ Years</p></div>
                </motion.div>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5, duration: 0.8, type: "spring" }} className="hidden lg:block relative">
                <div className="relative w-full max-w-lg mx-auto">
                  <div className="light-hero-panel relative bg-black/40 backdrop-blur-sm rounded-3xl p-4 border border-white/20 shadow-2xl">
                    <div className="absolute inset-0 rounded-3xl border border-amber-500/30 pointer-events-none" />
                    <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-amber-500/20 to-red-500/20 blur-xl -z-10" />

                    <div className="grid grid-cols-3 grid-rows-3 gap-3 h-[500px] w-full">
                      <HomeImage src={collageImages.large} alt="BBQ" className="col-span-2 row-span-2 rounded-2xl overflow-hidden relative group" sizes="(max-width: 1024px) 0px, 40vw" />
                      <HomeImage src={collageImages.small1} alt="Burger" className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group" sizes="(max-width: 1024px) 0px, 15vw" />
                      <HomeImage src={collageImages.small2} alt="Karahi" className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group" sizes="(max-width: 1024px) 0px, 15vw" />
                      <HomeImage src={collageImages.small3} alt="Biryani" className="col-span-1 row-span-1 rounded-2xl overflow-hidden relative group" sizes="(max-width: 1024px) 0px, 15vw" />
                      <HomeImage src={collageImages.wide} alt="Pizza" className="col-span-2 row-span-1 rounded-2xl overflow-hidden relative group" sizes="(max-width: 1024px) 0px, 30vw" />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-amber-500/20 rounded-full blur-xl" />
                    </div>

                    <div className="absolute -top-4 -right-4 bg-gradient-to-r from-amber-500 to-red-500 text-black px-4 py-2 rounded-full shadow-2xl">
                      <div className="flex items-center gap-2"><span className="font-bold text-sm">20+ Signature Dishes</span></div>
                    </div>
                    <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 whitespace-nowrap">
                      <p className="text-xs text-white">Authentic Pakistani Flavors • Texas Style Grilling</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
          {heroImages.map((_, idx) => (
            <button key={idx} onClick={() => setCurrentSlide(idx)} className={`transition-all duration-500 rounded-full ${currentSlide === idx ? "w-10 h-1.5 bg-amber-500" : "w-2 h-1.5 bg-white/40 hover:bg-white/60"}`} />
          ))}
        </div>
      </section>

      <GsapReveal y={60}>
        <section className="light-section-soft py-20 bg-black px-4">
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Discover</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Our Signature Categories</h2>
            <div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {apiCats.slice(0, 10).map((category) => (
              <div key={category._id} onClick={() => handleCategoryClick(category.slug)} className="group cursor-pointer">
                <div className="category-card relative overflow-hidden rounded-xl aspect-square bg-gray-900 border border-gray-800">
                  <FastImage src={category.image?.url || category.image} alt={category.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw" className="object-cover group-hover:scale-110 transition duration-700" />
                  <div className="category-overlay absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 text-center">
                    <h3 className="category-label text-white font-bold text-sm inline-block px-3 py-2 rounded-2xl">{category.name}</h3>
                    <p className="text-[#d8a43f] text-[10px] mt-0.5 opacity-0 group-hover:opacity-100 transition">Explore →</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </div>
        </section>
      </GsapReveal>

      <GsapReveal y={70}>
        <section className="light-section-warm py-20 bg-gradient-to-b from-black to-gray-900 px-4">
          <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Must Try</span>
            <h2 className="text-3xl md:text-4xl font-black mt-2">Signature Dishes</h2>
            <div className="w-16 h-0.5 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {featuredItems.map((item) => (
              <div key={item._id} className="light-card group bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-[#d8a43f]/50 transition-all duration-300">
                <Link href={`/product/${item._id}`}>
                  <div className="relative h-44 overflow-hidden">
                    <FastImage src={item.image?.url || item.image} alt={item.name} fill sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw" className="object-cover group-hover:scale-110 transition duration-500" />
                    {(item.isPopular || item.price > 2000) && <span className="absolute top-2 right-2 bg-[#d8a43f] text-black text-[10px] font-bold px-2 py-1 rounded-full">Chefs Pick</span>}
                  </div>
                </Link>
                <div className="p-3">
                  <Link href={`/product/${item._id}`}><h3 className="font-bold text-sm mb-1 line-clamp-1 hover:text-[#d8a43f] transition">{item.name}</h3></Link>
                  <p className="text-gray-500 text-xs mb-2 line-clamp-2">{item.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-[#d8a43f] font-bold">Rs. {item.price}</span>
                    <button onClick={() => handleAddToCart(item)} className="pressable w-8 h-8 bg-[#d8a43f]/20 rounded-full flex items-center justify-center hover:bg-[#d8a43f] transition-colors">
                      <svg className="w-4 h-4 text-[#d8a43f] hover:text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/menu"><button className="pressable light-outline-button px-8 py-3 border-2 border-[#d8a43f] text-[#d8a43f] font-bold rounded-full hover:bg-[#d8a43f] hover:text-black transition">View Full Menu</button></Link>
          </div>
          </div>
        </section>
      </GsapReveal>

      <GsapReveal y={65}>
        <section className="light-section-soft py-20 bg-black px-4">
          <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-[#d8a43f] text-sm font-medium tracking-wider uppercase">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-black mt-2 mb-4">Where Tradition Meets Flame</h2>
              <div className="w-12 h-0.5 bg-[#d8a43f] mb-6"></div>
              <p className="text-gray-400 leading-relaxed mb-6">Experience the perfect fusion of American BBQ and Pakistani tradition in the heart of Kohat. Every dish tells a story of passion, tradition, and culinary excellence.</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="light-card rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">14+</div><div className="text-xs text-gray-500 mt-1">Years of Excellence</div></div>
                <div className="light-card rounded-xl p-4 text-center border border-gray-800"><div className="text-3xl font-black text-[#d8a43f]">50K+</div><div className="text-xs text-gray-500 mt-1">Happy Customers</div></div>
              </div>
              <Link href="/about"><button className="pressable text-[#d8a43f] font-semibold flex items-center gap-2 hover:gap-3 transition-all">Learn More About Us<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg></button></Link>
            </div>
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl aspect-[4/3]">
                <FastImage src={process.env.NEXT_PUBLIC_RESTAURANT_IMAGE} alt="Texas Grill" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </div>
          </div>
          </div>
        </section>
      </GsapReveal>

      <GsapReveal y={50}>
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
          <div className="light-cta relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-10 text-center">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative z-10">
              <h3 className="text-2xl md:text-3xl font-black mb-3">Ready for an Experience?</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">Book your table now and discover why we are Kohats most loved grill restaurant.</p>
              <Link href="/custom-order"><button className="pressable glow-sheen px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition">Reserve Your Table</button></Link>
            </div>
          </div>
          </div>
        </section>
      </GsapReveal>
    </div>
  );
}
