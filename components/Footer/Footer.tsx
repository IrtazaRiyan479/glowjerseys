'use client';

import { useState } from 'react';
import LocalizationSwitcher from './LocalizationSwitcher';

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

const headingClass =
  'font-[Bayon,sans-serif] text-[10px] leading-[16px] tracking-[2px] uppercase text-[#0e0f11]';
const linkClass = 'font-[Poppins,sans-serif] text-[16px] leading-[22.4px] text-[#1c1d1f] hover:underline';

function IconFacebook() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-facebook" viewBox="0 0 320 512" width="18" height="18">
      <path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
    </svg>
  );
}

function IconInstagram() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-instagram" viewBox="0 0 448 512" width="18" height="18">
      <path fill="currentColor" d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
    </svg>
  );
}

function IconTiktok() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-tiktok" viewBox="0 0 448 512" width="18" height="18">
      <path fill="currentColor" d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg aria-hidden focusable="false" className="icon icon-arrow" width="14" height="10" viewBox="0 0 14 10" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.537.808a.5.5 0 01.817-.162l4 4a.5.5 0 010 .708l-4 4a.5.5 0 11-.708-.708L11.793 5.5H1a.5.5 0 010-1h10.793L8.646 1.354a.5.5 0 01-.109-.546z"
        fill="currentColor"
      />
    </svg>
  );
}

function FooterColumn({ heading, links }: { heading: string; links: { label: string; href: string }[] }) {
  return (
    <div className="pb-[20px]">
      <div className={`${headingClass} mb-[25px]`}>{heading}</div>
      <ul>
        {links.map((link) => (
          <li key={link.label}>
            <a href={link.href} className={`${linkClass} block py-[5px]`}>
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
    <footer className="gj-theme bg-[#f4f4f4] text-[#1c1d1f]">
      <div className="page-width">
        <div className="pt-10 pb-8 md:pt-[70px] md:pb-[60px] grid grid-cols-1 gap-y-[60px] lg:grid-cols-2 lg:gap-x-[30px]">
          <div className="grid grid-cols-2 gap-x-5">
            <FooterColumn heading="Support" links={SUPPORT_LINKS} />
            <FooterColumn heading="Legal" links={LEGAL_LINKS} />
          </div>
          <div className="w-full lg:ml-auto" style={{ width: '312px' }}>
            <div className={headingClass}>Join The Glow Jersey Team</div>
            <form method="post" action="/contact#ContactFooter" className="mt-[25px]">
              <div className="flex items-stretch border-b border-[#e6e7e9]">
                <input type="hidden" name="form_type" value="customer" />
                <input type="hidden" name="contact[tags]" value="newsletter" />
                <input
                  type="email"
                  name="contact[email]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email here"
                  required
                  className="footer-email flex-1 min-w-0 bg-transparent pl-3 h-[45px] text-[14px] font-[Poppins,sans-serif] text-[#1c1d1f] placeholder:text-[#1c1d1f]/60 outline-none"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="w-[23px] flex items-center justify-center text-[#1c1d1f] hover:opacity-60 transition-opacity"
                >
                  <IconArrow />
                </button>
              </div>
            </form>
            <div className="mt-[14px] text-[13px] font-bold italic font-[Poppins,sans-serif] text-[#1c1d1f]">
              Sign up for special offers, giveaways &amp; exclusive drops!
            </div>
            <ul className="flex gap-[5px] mt-[30px]" style={{ marginLeft: -10, marginTop: '30px' }}>
              <li>
                <a
                  target="_blank"
                  rel="noopener"
                  href="https://www.facebook.com/people/Glow-Jerseys/61559872375068/"
                  aria-label="Facebook"
                  className="social-icon w-10 h-10 flex items-center justify-center text-[#1c1d1f]"
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
                  className="social-icon w-10 h-10 flex items-center justify-center text-[#1c1d1f]"
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
                  className="social-icon w-10 h-10 flex items-center justify-center text-[#1c1d1f]"
                >
                  <IconTiktok />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="page-width">
        <div className="pb-[30px] flex flex-wrap items-start justify-between gap-4 font-[Poppins,sans-serif] text-[12px] text-[#1c1d1f]">
          <div>
            <div className="mb-1 leading-[21.6px]">
              © {new Date().getFullYear()}, <a href={ORIGIN} className="hover:underline">Glow Jerseys</a>. All rights
              reserved.
            </div>
            <div className="leading-[25.2px]">
              <a
                target="_blank"
                rel="nofollow noopener"
                href="https://www.shopify.com?utm_campaign=poweredby&utm_medium=shopify&utm_source=onlinestore"
                className="hover:underline"
              >
                Powered by Shopify
              </a>
            </div>
          </div>
          <LocalizationSwitcher />
        </div>
      </div>
    </footer>
  );
}
