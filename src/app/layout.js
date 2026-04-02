import { Inter } from "next/font/google";
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
}