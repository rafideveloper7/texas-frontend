'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from './CartProvider';
import { useState } from 'react';
import SidebarMenu from './SidebarMenu';
import { IKImage } from "@imagekit/next";

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
                    <IKImage src="./IMGs/logo.PNG" alt="Logo" className="w-full h-full object-cover rounded-full border border-[#d8a43f]" />
                  </div>
                  <div className="font-extrabold tracking-tight hover:opacity-80 transition text-xl md:text-2xl">
                    <span className="text-white">TEXAS </span>
                    <span className="text-[#d8a43f]">WINGS & GRILL</span>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="hidden lg:flex items-center space-x-6">
              <Link href="/" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase ${pathname === '/' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}`}>Home</Link>
              <Link href="/about" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase ${pathname === '/about' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}`}>About</Link>
              <Link href="/menu" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase ${pathname === '/menu' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}`}>Menu</Link>
              <Link href="/products" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase ${pathname === '/products' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}`}>Order</Link>
              <Link href="/custom-order" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase flex items-center ${pathname === '/custom-order' ? 'text-[#cc2b2b]' : 'text-[#d8a43f] hover:text-[#cc2b2b]'}`}>
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"></path></svg>
                VIP
              </Link>
              <Link href="/contact" className={`font-bold transition duration-300 tracking-wider text-[13px] uppercase ${pathname === '/contact' ? 'text-[#d8a43f]' : 'text-gray-300 hover:text-[#d8a43f]'}`}>Contact</Link>
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
}