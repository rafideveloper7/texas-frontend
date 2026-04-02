'use client';
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
      <div 
        className={`fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />
      <div className={`fixed top-0 right-0 h-full w-[85vw] max-w-[320px] bg-[#121212] border-l border-gray-800 z-[70] transform transition-transform duration-300 ease-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b border-gray-800 flex justify-between items-start">
          <div>
            <div className="w-14 h-14 rounded-full bg-[#cc2b2b]/20 text-[#cc2b2b] flex items-center justify-center mb-3">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h3 className="text-white font-black text-xl">Guest User</h3>
            <p className="text-[#d8a43f] text-sm font-bold tracking-wider">Welcome to Texas Grill</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="min-w-[44px] min-h-[44px] flex items-center justify-center bg-gray-900 text-gray-400 rounded-full hover:bg-gray-800 hover:text-white transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4">
          <div className="space-y-2 mb-8 border-b border-gray-800 pb-8">
            <Link href="/" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
              Home
            </Link>
            <Link href="/menu" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/menu' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              Dine-in Menu
            </Link>
            <Link href="/products" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/products' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" /></svg>
              Products
            </Link>
            <Link href="/custom-order" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/custom-order' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4 text-[#cc2b2b]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" /></svg>
              VIP Custom Order
            </Link>
            <Link href="/about" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/about' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              About Us
            </Link>
            <Link href="/contact" onClick={() => setIsOpen(false)} className={`flex items-center min-h-[44px] px-4 rounded-xl font-bold uppercase tracking-wider text-sm transition ${pathname === '/contact' ? 'bg-[#d8a43f] text-black' : 'text-gray-300 hover:bg-gray-900'}`}>
              <svg className="w-5 h-5 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              Contact
            </Link>
          </div>

          <div className="bg-[#cc2b2b]/10 border border-[#cc2b2b]/30 p-4 rounded-2xl mb-8 relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-16 h-16 bg-[#cc2b2b] rounded-full opacity-20 blur-xl" />
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
}