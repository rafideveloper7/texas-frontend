import { Inter } from "next/font/google";
// Root layout wires up fonts, providers, and the early theme bootstrap script.
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import { NavbarWrapper } from "@/components/NavbarWrapper";
import { ImageKitProvider } from "@imagekit/next";
import { ThemeProvider } from "@/components/ThemeProvider";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href={process.env.NEXT_PUBLIC_API_URL} />
        {/* Apply the saved/system theme before React hydrates to avoid a flash. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var storedTheme = localStorage.getItem('texas-theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var theme = storedTheme || systemTheme;
                  document.documentElement.dataset.theme = theme;
                  document.documentElement.style.colorScheme = theme;
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {/* Providers are kept here so server-rendered routes can stay lean while
            interactive concerns remain centralized. */}
        <ThemeProvider>
          <CartProvider>
            <NavbarWrapper>
              <ImageKitProvider urlEndpoint={process.env.NEXT_PUBLIC_IK_URL_ENDPOINT}>
                <main className="min-h-screen">{children}</main>
              </ImageKitProvider>
            </NavbarWrapper>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
