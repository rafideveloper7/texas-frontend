'use client';
// Wraps the public site chrome so admin routes can opt out of navbar/footer rendering.
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
}
