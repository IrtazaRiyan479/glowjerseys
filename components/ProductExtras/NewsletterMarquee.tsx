const TEXT = 'Sign Up For Our Newsletter For 10% OFF';

// Matches the storefront's scrolling-promotion section. Bayon renders as
// small caps natively, which is where the uppercase look comes from.
export default function NewsletterMarquee() {
  return (
    <div className="overflow-hidden bg-white py-[27px] md:py-9">
      <style>{`
        @keyframes gj-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="flex whitespace-nowrap" style={{ animation: 'gj-marquee 18s linear infinite' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mx-[25px] font-[Bayon,sans-serif] font-normal text-[15px] md:text-[20px] leading-none tracking-[0.57px] text-[#1a1b18]"
          >
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
