'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (email) {
      setNewsletterStatus('sending');
      setTimeout(() => {
        setNewsletterStatus('success');
        setEmail('');
        setTimeout(() => setNewsletterStatus(null), 3000);
      }, 1000);
    }
  };

  const quickLinks = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Products', href: '/products' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Custom Order', href: '/custom-order' }
  ];

  const socialLinks = [
    { name: 'Facebook', icon: '📘', url: 'https://facebook.com', color: 'hover:text-[#1877f2]' },
    { name: 'Instagram', icon: '📸', url: 'https://instagram.com', color: 'hover:text-[#e4405f]' },
    { name: 'WhatsApp', icon: '💬', url: `https://wa.me/${whatsappNumber}`, color: 'hover:text-[#25d366]' },
    { name: 'TikTok', icon: '🎵', url: 'https://tiktok.com', color: 'hover:text-white' }
  ];

  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0a0a0a] to-[#050505] border-t border-gray-800 pt-12 pb-6 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <Link href="/">
              <h2 className="text-2xl md:text-3xl font-black bg-gradient-to-r from-[#d8a43f] to-[#cc2b2b] bg-clip-text text-transparent mb-4">
                TEXAS GRILL
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              Experience the perfect fusion of American BBQ and Pakistani tradition in the heart of Kohat.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] ${social.color} transition-all duration-300`}
                >
                  <span className="text-lg">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#d8a43f] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 bg-[#d8a43f] rounded-full opacity-0 group-hover:opacity-100 transition"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-black text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="text-[#d8a43f]">📍</span>
                <p className="text-gray-400 text-sm leading-relaxed">Village Togh Bala, Kohat, Pakistan</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#d8a43f]">📞</span>
                <a href="tel:+923000000000" className="text-gray-400 hover:text-[#d8a43f] transition text-sm">+92 300 0000000</a>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[#d8a43f]">✉️</span>
                <a href="mailto:info@texasgrill.pk" className="text-gray-400 hover:text-[#d8a43f] transition text-sm">info@texasgrill.pk</a>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-[#d8a43f]">⏰</span>
                <div>
                  <p className="text-gray-400 text-sm">Mon - Sun: 12:00 PM - 12:00 AM</p>
                  <p className="text-gray-500 text-xs mt-1">Friday Prayer Break: 1:00 PM - 2:30 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white font-black text-lg mb-4">Newsletter</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to get exclusive offers and updates on new dishes!</p>
            <form onSubmit={handleNewsletter} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                className="w-full min-h-[44px] bg-[#1a1a1a] border border-gray-700 rounded-xl px-4 text-white text-sm focus:outline-none focus:border-[#d8a43f] transition"
                required
              />
              <button
                type="submit"
                disabled={newsletterStatus === 'sending'}
                className="w-full min-h-[44px] bg-gradient-to-r from-[#cc2b2b] to-[#d8a43f] text-white font-black rounded-xl text-sm uppercase tracking-wider hover:shadow-lg transition disabled:opacity-50"
              >
                {newsletterStatus === 'sending' ? 'Subscribing...' : 'Subscribe'}
              </button>
              {newsletterStatus === 'success' && <p className="text-green-500 text-xs text-center">✓ Subscribed successfully!</p>}
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs text-center md:text-left">© {currentYear} Texas Grill Kohat. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="text-gray-500 hover:text-[#d8a43f] text-xs transition">Privacy Policy</Link>
              <Link href="#" className="text-gray-500 hover:text-[#d8a43f] text-xs transition">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-[10px]">Crafted with ❤️ br <a href='https://github.com/rafideveloper7/' target='_blank'>Rafi Ullah</a></p>
        </div>
      </div>
    </footer>
  );
}