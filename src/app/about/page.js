'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import { IKImage } from '@imagekit/next';

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
        // But to keep dynamic, we can fetch from backend if we add an about route.
        setAboutData({
          text: "Born in the vibrant streets of Kohat, Texas Grill serves as a beacon of culinary authenticity, blending traditional Pakistani recipes with premium Texas-style grilling techniques.",
          address: "Village Togh Bala, Kohat, Pakistan",
          mapLink: process.env.NEXT_PUBLIC_MAP_EMBED_LINK,
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
              <IKImage src="https://ik.imagekit.io/o7uoqfzynm/IMGs/owner.jpg" alt="Texas Grill Restaurant" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
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
              <div className={`w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${stat.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition`}><span className="text-2xl md:text-3xl">{stat.icon}</span></div>
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
              <motion.div key={idx} initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className={`relative flex flex-col md:flex-row items-center gap-6 mb-12 md:mb-16 ${idx % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-12 h-12 bg-gradient-to-br from-[#d8a43f] to-[#cc2b2b] rounded-full z-20 flex items-center justify-center shadow-xl"><span className="text-white text-xl">{item.icon}</span></div>
                <div className={`w-full md:w-5/12 pl-16 md:pl-0 ${idx % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
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
}