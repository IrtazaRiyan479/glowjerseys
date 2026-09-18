// Matches the storefront's "rich-text--colored" section: sits inside the
// theme's page-width container (max 1600px, 50px gutters) rather than
// bleeding full width.
export default function InstagramBanner() {
  return (
    <div className="gj-theme">
      <div className="page-width">
        <div className="bg-black text-center px-[15px] py-[27px] md:px-[50px] md:py-9">
          <p className="font-[Poppins,sans-serif] italic text-[#ff0000] text-[20px] md:text-[24px] leading-[1.4]">
            Tag @Glowjerseys on Instagram to be featured!
          </p>
        </div>
      </div>
    </div>
  );
}
