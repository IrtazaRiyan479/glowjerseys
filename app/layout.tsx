import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './custom.css';
// Judge.me's own widget stylesheet + this shop's theme variables, vendored so
// the reviews widget renders identically to the one on the live storefront.
import './judgeme.css';
import Navbar from '@/components/Navigations/Navbar/Navbar';
import CartDrawer from '@/components/Cart/CartDrawer';
import Footer from '@/components/Footer/Footer';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Custom Glow Jersey | Glow Jerseys',
  description: 'Customize your glow jersey',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col bg-white">
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}