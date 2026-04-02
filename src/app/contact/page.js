'use client';
import { useState, useEffect, useRef } from 'react';
import { motion, useInView, useAnimation } from 'framer-motion';
import Link from 'next/link';
import { IKImage } from '@imagekit/next';

export default function ContactPage() {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState(null);
  const controls = useAnimation();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, threshold: 0.1 });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  // Handle form submission – sends to FormSubmit (email) and optionally to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus('sending');

    try {
      // 1. Send to FormSubmit (frontend email)
      const formSubmitEmail = process.env.NEXT_PUBLIC_FORMSUBMIT_EMAIL || 'admin@texasgrill.pk';
      const formSubmitRes = await fetch('https://formsubmit.co/ajax/' + formSubmitEmail, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          _subject: `New Contact Message from ${formData.name}`,
          _template: 'table',
          _captcha: 'false'
        })
      });

      if (!formSubmitRes.ok) throw new Error('FormSubmit failed');

      // 2. Optionally also save to backend (comment out if not needed)
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL;
        await fetch(`${baseUrl}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
      } catch (backendErr) {
        console.warn('Backend save failed, but email sent');
      }

      setFormStatus('success');
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      setFormStatus('error');
    } finally {
      setTimeout(() => setFormStatus(null), 3000);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: "📍",
      title: "Visit Us",
      details: "Village Togh Bala, Kohat, Pakistan",
      action: "Get Directions",
      link: "https://maps.app.goo.gl/f2RDbL316e3VoFgc6"
    },
    {
      icon: "📞",
      title: "Call Us",
      details: "+92 300 0000000",
      action: "Call Now",
      link: "tel:+923000000000"
    },
    {
      icon: "✉️",
      title: "Email Us",
      details: "info@texasgrill.pk",
      action: "Send Email",
      link: "mailto:info@texasgrill.pk"
    },
    {
      icon: "⏰",
      title: "Opening Hours",
      details: "12:00 PM - 12:00 AM",
      action: "View Hours",
      link: "#hours"
    }
  ];

  const socialLinks = [
    { name: "Facebook", icon: "📘", url: "https://facebook.com/texasgrillkohat", color: "from-blue-600 to-blue-700", followers: "15K" },
    { name: "Instagram", icon: "📸", url: "https://instagram.com/texasgrillkohat", color: "from-pink-500 to-purple-600", followers: "22K" },
    { name: "WhatsApp", icon: "💬", url: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '923000000000'}`, color: "from-green-500 to-green-600", followers: "Order Now" },
    { name: "TikTok", icon: "🎵", url: "https://tiktok.com/@texasgrillkohat", color: "from-black to-gray-800", followers: "8K" }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 }
    }
  };

  return (
    <div className="bg-gradient-to-b from-[#121212] via-[#0f0f0f] to-[#0a0a0a] min-h-screen pt-20 md:pt-28 pb-20 font-sans text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <motion.span 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block text-[#d8a43f] font-black tracking-[0.2em] text-xs md:text-sm uppercase mb-4 bg-[#d8a43f]/10 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            📍 Get In Touch
          </motion.span>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black uppercase tracking-tighter mb-6"
          >
            <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Visit</span>
            <span className="block md:inline md:ml-4 bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] bg-clip-text text-transparent">Texas Grill</span>
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0, width: 0 }}
            animate={{ opacity: 1, width: "100px" }}
            transition={{ delay: 0.5 }}
            className="w-24 h-1 bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] mx-auto"
          />
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-400 max-w-2xl mx-auto mt-6 text-base md:text-lg"
          >
            Visit us in the heart of Kohat for an unforgettable dining experience
          </motion.p>
        </motion.div>

        {/* Contact Info Cards Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12 md:mb-16"
        >
          {contactInfo.map((info, idx) => (
            <motion.a
              key={idx}
              href={info.link}
              target={info.link.startsWith('http') ? '_blank' : undefined}
              rel={info.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl p-6 border border-gray-800 hover:border-[#d8a43f]/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{info.icon}</div>
              <h3 className="text-lg font-black mb-2 text-white">{info.title}</h3>
              <p className="text-gray-400 text-sm mb-3 leading-relaxed">{info.details}</p>
              <span className="text-[#d8a43f] text-xs font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                {info.action}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* Main Content - Form & Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16">
          
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black mb-2">Send a Message</h2>
              <p className="text-gray-400 text-sm">We'll get back to you within 24 hours</p>
              <div className="w-16 h-1 bg-[#d8a43f] mt-4"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full min-h-[48px] bg-black/50 border border-gray-700 rounded-xl px-4 text-white focus:outline-none focus:border-[#d8a43f] transition"
                  placeholder="+92 300 0000000"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2 text-gray-300">Your Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#d8a43f] transition resize-none"
                  placeholder="Tell us about your inquiry, reservation request, or feedback..."
                />
              </div>

              <button
                type="submit"
                disabled={formStatus === 'sending'}
                className="w-full min-h-[52px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl uppercase tracking-wider hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {formStatus === 'sending' ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  "Send Message"
                )}
              </button>

              {formStatus === 'success' && (
                <div className="bg-green-500/20 border border-green-500 rounded-xl p-3 text-center text-green-400 text-sm">
                  ✓ Message sent successfully! We'll contact you soon.
                </div>
              )}
              {formStatus === 'error' && (
                <div className="bg-red-500/20 border border-red-500 rounded-xl p-3 text-center text-red-400 text-sm">
                  ✗ Failed to send. Please try again later.
                </div>
              )}
            </form>
          </motion.div>

          {/* Google Map */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
          >
            <div className="mb-6">
              <h2 className="text-2xl md:text-3xl font-black mb-2">Find Us Here</h2>
              <p className="text-gray-400 text-sm">Visit our restaurant in Kohat</p>
              <div className="w-16 h-1 bg-[#d8a43f] mt-4"></div>
            </div>

            <div className="relative w-full rounded-xl overflow-hidden shadow-2xl" style={{ height: '350px', minHeight: '350px' }}>
              {!isMapLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#1a1a1a] z-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#d8a43f]"></div>
                </div>
              )}
              <iframe
                title="Texas Grill Kohat Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26573.03369685814!2d71.37050961847119!3d33.585501869389274!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d8e5760bdffff1%3A0xe54ec0d4b85c18b7!2sKohat%2C%20Khyber%20Pakhtunkhwa%2C%20Pakistan!5e0!3m2!1sen!2s!4v1703648079532!5m2!1sen!2s"
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={() => setIsMapLoaded(true)}
              />
            </div>

            <div className="mt-5 flex justify-between items-center flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-400">Open Now • 12:00 PM - 12:00 AM</span>
              </div>
              <a
                href="https://maps.app.goo.gl/f2RDbL316e3VoFgc6"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#d8a43f] text-sm font-bold hover:gap-3 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path>
                </svg>
                Get Directions via Google Maps
              </a>
            </div>
          </motion.div>
        </div>

        {/* Opening Hours Detailed Section */}
        <motion.div
          id="hours"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800 mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Opening Hours</h2>
            <p className="text-gray-400 text-sm">We're ready to serve you delicious meals</p>
            <div className="w-16 h-1 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(day => (
              <div key={day} className="text-center p-4 bg-black/30 rounded-xl">
                <p className="font-black text-white text-lg">{day}</p>
                <p className="text-[#d8a43f] font-bold mt-1">12:00 PM - 12:00 AM</p>
                {day === 'Friday' && (
                  <p className="text-xs text-gray-500 mt-1">Prayer Break: 1:00 PM - 2:30 PM</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 text-center bg-[#d8a43f]/10 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              📞 Last order 30 minutes before closing • Delivery available within Kohat city
            </p>
          </div>
        </motion.div>

        {/* Social Media Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-black mb-6">Follow Our Journey</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {socialLinks.map((social, idx) => (
              <a
                key={idx}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative overflow-hidden bg-gradient-to-br ${social.color} rounded-xl p-5 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl`}
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <div className="relative z-10">
                  <div className="text-3xl md:text-4xl mb-2">{social.icon}</div>
                  <p className="text-sm font-bold uppercase tracking-wider">{social.name}</p>
                  <p className="text-xs text-white/80 mt-1">{social.followers}</p>
                </div>
              </a>
            ))}
          </div>
        </motion.div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] rounded-2xl md:rounded-3xl p-6 md:p-8 border border-gray-800"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-black mb-2">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm">Quick answers to common questions</p>
            <div className="w-16 h-1 bg-[#d8a43f] mx-auto mt-4"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">Do you offer home delivery?</h3>
                <p className="text-gray-400 text-sm">Yes! We deliver within Kohat city. Minimum order Rs. 500, delivery fee Rs. 150.</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">Do I need to make a reservation?</h3>
                <p className="text-gray-400 text-sm">Reservations are recommended for weekends and large groups (6+ people).</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">Is there parking available?</h3>
                <p className="text-gray-400 text-sm">Yes, we have free parking space available for our customers.</p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">Do you cater for events?</h3>
                <p className="text-gray-400 text-sm">Yes! We offer catering services for events, parties, and corporate functions.</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">Are your meats halal?</h3>
                <p className="text-gray-400 text-sm">100% halal certified. All our meat is sourced from trusted halal suppliers.</p>
              </div>
              <div className="bg-black/30 rounded-xl p-4">
                <h3 className="font-black text-[#d8a43f] mb-2">What's your cancellation policy?</h3>
                <p className="text-gray-400 text-sm">Free cancellation up to 1 hour before reservation time.</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
          className="mt-12 md:mt-16 relative overflow-hidden rounded-2xl md:rounded-3xl bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] p-8 md:p-12 text-center"
        >
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative z-10">
            <h3 className="text-2xl md:text-3xl font-black mb-4">Have More Questions?</h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">We're here to help! Contact us anytime and we'll get back to you promptly.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="tel:+923000000000">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-white text-[#cc2b2b] font-bold rounded-full hover:shadow-xl transition"
                >
                  Call Us Now
                </motion.button>
              </a>
              <Link href="/custom-order">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-bold rounded-full hover:bg-white/10 transition"
                >
                  Make a Reservation
                </motion.button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}