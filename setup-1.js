const fs = require('fs');
const path = require('path');

// Create directory structure (excluding admin)
const directories = [
  'src/app',
  'src/app/about',
  'src/app/checkout',
  'src/app/contact',
  'src/app/custom-order',
  'src/app/menu',
  'src/app/product/[id]',
  'src/app/products',
  'src/components',
  'public/galleries',
  'public/IMGs'
];

directories.forEach(dir => {
  const fullPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`✅ Created: ${dir}/`);
  }
});

// ==================== CONFIG FILES ====================

// .env.local
const envLocal = `# API Configuration
NEXT_PUBLIC_API_URL=https://texas-api.vercel.app/api

# WhatsApp Number for Orders
NEXT_PUBLIC_WHATSAPP_NUMBER=923000000000

# Restaurant Contact
NEXT_PUBLIC_RESTAURANT_PHONE=+923000000000
NEXT_PUBLIC_EMAIL=info@texasgrill.pk
`;
fs.writeFileSync('.env.local', envLocal);
console.log('✅ Created: .env.local');

// package.json
const packageJson = `{
  "name": "texas-grill-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "vercel-build": "next build"
  },
  "dependencies": {
    "framer-motion": "^10.16.4",
    "lucide-react": "^1.7.0",
    "next": "14.2.33",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "recharts": "^3.8.1",
    "tailwindcss": "^3.4.1"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.18",
    "eslint": "^8.57.0",
    "eslint-config-next": "14.2.33",
    "postcss": "^8.4.35"
  }
}`;
fs.writeFileSync('package.json', packageJson);
console.log('✅ Created: package.json');

// next.config.mjs
const nextConfig = `/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;`;
fs.writeFileSync('next.config.mjs', nextConfig);
console.log('✅ Created: next.config.mjs');

// tailwind.config.js (ES module)
const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#d8a43f',
        secondary: '#cc2b2b',
        dark: '#0a0a0a',
        darker: '#050505',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}`;
fs.writeFileSync('tailwind.config.js', tailwindConfig);
console.log('✅ Created: tailwind.config.js');

// postcss.config.mjs
const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};`;
fs.writeFileSync('postcss.config.mjs', postcssConfig);
console.log('✅ Created: postcss.config.mjs');

// vercel.json
const vercelJson = `{
  "version": 2,
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "https://texas-api.vercel.app/api"
  }
}`;
fs.writeFileSync('vercel.json', vercelJson);
console.log('✅ Created: vercel.json');

// .gitignore
const gitignore = `# dependencies
/node_modules
/.pnp
.pnp.js
.yarn/install-state.gz

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# local env files
.env*.local
.env

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts
`;
fs.writeFileSync('.gitignore', gitignore);
console.log('✅ Created: .gitignore');

// ==================== GLOBAL STYLES ====================
const globalsCSS = `@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #0a0a0a;
  --foreground: #ededed;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--background);
  color: var(--foreground);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #cc2b2b;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: #d8a43f;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fadeIn 0.5s ease-out;
}

.glass {
  background: rgba(18, 18, 18, 0.8);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.scrollbar-none {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-none::-webkit-scrollbar {
  display: none;
}`;
fs.writeFileSync('src/app/globals.css', globalsCSS);
console.log('✅ Created: src/app/globals.css');

// ==================== ROOT LAYOUT ====================
const layout = `import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { NavbarWrapper } from "@/components/NavbarWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Texas Grill Kohat - Premium BBQ & Grill Restaurant",
  description: "Experience the best BBQ, steaks, and traditional Pakistani cuisine in Kohat. Texas Grill serves authentic flavors with a Texas twist.",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=yes",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CartProvider>
          <NavbarWrapper>
            <main className="min-h-screen">
              {children}
            </main>
          </NavbarWrapper>
        </CartProvider>
      </body>
    </html>
  );
}`;
fs.writeFileSync('src/app/layout.js', layout);
console.log('✅ Created: src/app/layout.js');

// ==================== COMPONENTS ====================

// CartProvider.js
const cartProvider = `'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('texas_cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('texas_cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item, quantity = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + quantity } : i);
      }
      return [...prev, { ...item, qty: quantity }];
    });
  };

  const updateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCart(prev => prev.filter(i => i.id !== id));
    } else {
      setCart(prev => prev.map(i => i.id === id ? { ...i, qty: newQty } : i));
    }
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const numItems = cart.reduce((sum, item) => sum + item.qty, 0);
  const total = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, removeFromCart, clearCart, numItems, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}`;
fs.writeFileSync('src/components/CartProvider.js', cartProvider);
console.log('✅ Created: src/components/CartProvider.js');

// Footer.js
const footer = `'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState(null);

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
    { name: 'WhatsApp', icon: '💬', url: 'https://wa.me/923000000000', color: 'hover:text-[#25d366]' },
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
                  className={\`w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-[#2a2a2a] \${social.color} transition-all duration-300\`}
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
                  <Link href={link.href} className="text-gray-400 hover:text-[#d8a43f] transition-colors text-sm flex items-center gap-2 group">
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
              <Link href="/privacy" className="text-gray-500 hover:text-[#d8a43f] text-xs transition">Privacy Policy</Link>
              <Link href="/terms" className="text-gray-500 hover:text-[#d8a43f] text-xs transition">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-600 text-[10px]">Crafted with 🔥 in Kohat, Pakistan</p>
        </div>
      </div>
    </footer>
  );
}`;
fs.writeFileSync('src/components/Footer.js', footer);
console.log('✅ Created: src/components/Footer.js');

// Navbar.js
const navbar = `'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';

export function Navbar() {
  const { numItems } = useCart();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <>
      <nav className="fixed w-full z-50 bg-[#121212]/95 backdrop-blur-xl border-b border-gray-800 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <div className="flex items-center cursor-pointer">
                  <div className="w-10 h-10 mr-3 hidden sm:block">
                    <img src="/IMGs/Texas Wings & Grill at night.png" alt="Logo" className="w-full h-full object-cover rounded-full border border-[#d8a43f]" />
                  </div>
                  <div className="font-extrabold tracking-tight hover:opacity-80 transition text-xl md:text-2xl">
                    <span className="text-white">TEXAS </span>
                    <span className="text-[#d8a43f]">WINGS & GRILL</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase \${pathname === '/' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}\`}>Home</Link>
              <Link href="/about" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase \${pathname === '/about' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}\`}>About</Link>
              <Link href="/menu" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase \${pathname === '/menu' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}\`}>Menu</Link>
              <Link href="/products" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase \${pathname === '/products' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}\`}>Order</Link>
              <Link href="/custom-order" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase flex items-center \${pathname === '/custom-order' ? 'text-[#cc2b2b]' : 'text-[#d8a43f] hover:text-[#cc2b2b]'}\`}>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                VIP
              </Link>
              <Link href="/contact" className={\`font-bold transition duration-300 tracking-wider text-[13px] uppercase \${pathname === '/contact' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}\`}>Contact</Link>
            </div>

            <div className="flex items-center space-x-3 sm:space-x-4">
              <Link href="/checkout" className="relative min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[#d8a43f] transition">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                {numItems > 0 && (
                  <span className="absolute top-1 right-0 sm:right-1 inline-flex items-center justify-center px-2 py-1 text-[10px] font-black leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-[#cc2b2b] border-2 border-[#121212] rounded-full">{numItems}</span>
                )}
              </Link>

              <Link href="/custom-order" className="hidden lg:flex items-center justify-center bg-[#cc2b2b] hover:bg-[#a12020] text-white px-6 min-h-[44px] rounded-full font-bold transition duration-300 transform shadow-lg shadow-red-900/50 uppercase tracking-wider text-xs">
                Book Table
              </Link>

              <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden min-w-[44px] min-h-[44px] flex items-center justify-center text-white hover:text-[#d8a43f] transition bg-gray-900 border border-gray-800 p-2 rounded-xl" aria-label="Open Mobile Menu">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <SidebarMenu isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </>
  );
}`;
fs.writeFileSync('src/components/Navbar.js', navbar);
console.log('✅ Created: src/components/Navbar.js');

// NavbarWrapper.js
const navbarWrapper = `'use client';
import { usePathname } from 'next/navigation';
import { Navbar } from './Navbar';
import Footer from './Footer';

export function NavbarWrapper({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  if (isAdminPath) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}`;
fs.writeFileSync('src/components/NavbarWrapper.js', navbarWrapper);
console.log('✅ Created: src/components/NavbarWrapper.js');

// SidebarMenu.js
const sidebarMenu = `'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';

export default function SidebarMenu({ isOpen, setIsOpen }) {
  const pathname = usePathname();
  const { numItems } = useCart();

  if (typeof window !== 'undefined') {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }

  return (
    <>
      <div className={\`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 \${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}\`} onClick={() => setIsOpen(false)}></div>
      <div className={\`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-[#121212] border-l border-gray-800 z-[70] transform transition-transform duration-300 ease-out flex flex-col \${isOpen ? 'translate-x-0' : 'translate-x-full'}\`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <div className="w-14 h-14 rounded-full bg-[#cc2b2b]/20 text-[#cc2b2b] flex items-center justify-center mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </div>
            <h3 className="text-white font-black text-xl">Guest User</h3>
            <p className="text-[#d8a43f] text-sm font-bold tracking-wider">Welcome to Texas Grill</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-900 text-gray-400 rounded-full hover:bg-gray-800 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar py-6 px-4">
          <div className="space-y-2 mb-8 border-b border-gray-800 pb-8">
            <Link href="/" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
              Home
            </Link>
            <Link href="/menu" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/menu' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
              Dine-in Menu
            </Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/products' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
              Products (Order Online)
            </Link>
            <Link href="/custom-order" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/custom-order' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4 text-[#cc2b2b]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
              VIP Custom Order
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/about' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              About Us
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className={\`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition \${pathname === '/contact' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}\`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg>
              Contact
            </Link>
          </div>

          <div className="bg-[#cc2b2b]/10 border border-[#cc2b2b]/30 p-4 rounded-2xl mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#cc2b2b] rounded-full opacity-20 blur-xl"></div>
            <h4 className="font-black text-white text-lg mb-1 relative z-10">Weekend Special!</h4>
            <p className="text-[#d8a43f] text-xs font-bold leading-relaxed relative z-10">Get 20% OFF on all deeply baked Matka Pizzas.</p>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 bg-[#1a1a1a]">
          <Link href="/checkout" onClick={() => setIsOpen(false)} className="flex items-center justify-between min-h-[56px] bg-[#cc2b2b] hover:bg-[#a12020] text-white px-6 rounded-xl font-black uppercase tracking-widest shadow-lg shadow-red-900/30 transition w-full">
            <span>Checkout Cart</span>
            <span className="bg-white text-[#cc2b2b] px-3 py-1 rounded-lg text-sm">{numItems}</span>
          </Link>
        </div>
      </div>
    </>
  );
}`;
fs.writeFileSync('src/components/SidebarMenu.js', sidebarMenu);
console.log('✅ Created: src/components/SidebarMenu.js');

console.log('\n🎉 Part 1 complete! Now run Part 2 to add page files.');