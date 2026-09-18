import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import './custom.css';
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
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="flex min-h-dvh flex-col bg-white">
        <Navbar />
        <main className="flex min-h-0 flex-1 flex-col">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
}