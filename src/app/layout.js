import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { ImageKitProvider } from "@imagekit/next";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Home",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
      </head>
      <body className={inter.className}>
        <CartProvider>
          <NavbarWrapper>
            <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IK_URL_ENDPOINT}>
            <main className="min-h-screen">{children}</main>
            </ImageKitProvider>
          </NavbarWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
