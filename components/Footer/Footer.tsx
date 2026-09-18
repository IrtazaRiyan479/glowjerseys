'use client';

import { useState } from 'react';

const ORIGIN = 'https://glowjerseys.com';

const SUPPORT_LINKS = [
  { label: 'About Us', href: `${ORIGIN}/pages/about-us` },
  { label: 'FAQ', href: `${ORIGIN}/pages/faq` },
  { label: 'Become an Affiliate', href: 'https://af.uppromote.com/glowjerseysaffiliate/register' },
  { label: 'Contact Us', href: `${ORIGIN}/pages/contact` },
];

const LEGAL_LINKS = [
  { label: 'Shipping Policy', href: `${ORIGIN}/policies/shipping-policy` },
  { label: 'Refund & Return Policy', href: `${ORIGIN}/policies/refund-policy` },
  { label: 'Privacy Policy', href: `${ORIGIN}/policies/privacy-policy` },
  { label: 'Terms of Service', href: `${ORIGIN}/policies/terms-of-service` },
  { label: 'Warranty', href: `${ORIGIN}/pages/warranty` },
];

function IconFacebook() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-facebook" viewBox="0 0 320 512" width="16" height="16">
      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-instagram" viewBox="0 0 448 512" width="16" height="16">
      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-tiktok" viewBox="0 0 448 512" width="16" height="16">
      <path fill="currentColor" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-gray-800 mb-3">{heading}</p>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className="text-sm text-gray-600 hover:text-black transition-colors">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  const [email, setEmail] = useState('');

  return (
    <footer className="border-t border-gray-200 bg-[#f4f4f4] text-[#1c1d1f]">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <FooterColumn heading="Support" links={SUPPORT_LINKS} />
        <FooterColumn heading="Legal" links={LEGAL_LINKS} />
        <div className="lg:col-span-2">
          <p className="text-xs font-bold uppercase tracking-wide text-[#0e0f11] mb-3">Join The Glow Jersey Team</p>
          {/* Real Shopify newsletter signup — same form_type/action the live
              theme uses, so it actually subscribes through Shopify. Only
              resolves through the App Proxy (same-origin), same as /cart.js. */}
          <form method="post" action="/contact#ContactFooter" className="flex items-stretch max-w-sm">
            <input type="hidden" name="form_type" value="customer" />
            <input type="hidden" name="contact[tags]" value="newsletter" />
            <input
              type="email"
              name="contact[email]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email here"
              required
              className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-black"
            />
            <button
              type="submit"
              aria-label="Subscribe"
              className="rounded-r-md border border-l-0 border-gray-300 bg-black px-4 text-white hover:bg-gray-800 transition-colors"
            >
              →
            </button>
          </form>
          <p className="mt-2 text-sm italic text-gray-600">
            Sign up for special offers, giveaways &amp; exclusive drops!
          </p>
          <ul className="flex gap-3 mt-4">
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://www.facebook.com/people/Glow-Jerseys/61559872375068/"
                aria-label="Facebook"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <IconFacebook />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://www.instagram.com/glowjerseys/"
                aria-label="Instagram"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <IconInstagram />
              </a>
            </li>
            <li>
              <a
                target="_blank"
                rel="noopener"
                href="https://www.tiktok.com/@glowjerseys?is_from_webapp=1&sender_device=pc"
                aria-label="TikTok"
                className="text-gray-700 hover:text-black transition-colors"
              >
                <IconTiktok />
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-4 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-600">
          <span>
            © {new Date().getFullYear()}, <a href={ORIGIN} className="hover:text-black">Glow Jerseys</a>. All rights reserved.
          </span>
          <a
            target="_blank"
            rel="nofollow noopener"
            href="https://www.shopify.com?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore"
            className="hover:text-black"
          >
            Powered by Shopify
          </a>
        </div>
      </div>
    </footer>
  );
}
