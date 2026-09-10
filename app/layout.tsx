import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navigations/Navbar/Navbar';
import CartDrawer from '@/components/Cart/CartDrawer';

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
      <body className="flex h-dvh flex-col overflow-hidden bg-white">
        <Navbar />
        <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
          {children}
        </main>
        <CartDrawer />
      </body>
    </html>
  );
}