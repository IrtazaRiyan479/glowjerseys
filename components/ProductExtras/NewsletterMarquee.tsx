const TEXT = 'Sign Up For Our Newsletter For 10% OFF';

export default function NewsletterMarquee() {
  return (
    <div className="overflow-hidden bg-white border-y border-gray-200 py-4">
      <style>{`
        @keyframes gj-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
      <div className="flex whitespace-nowrap" style={{ animation: 'gj-marquee 18s linear infinite' }}>
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="mx-6 text-lg md:text-xl font-medium text-[#1a1b18]">
            {TEXT}
          </span>
        ))}
      </div>
    </div>
  );
}
