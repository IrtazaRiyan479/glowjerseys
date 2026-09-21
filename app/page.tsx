'use client';

import Experience from '@/components/3d/Experience/Experience';
import ConfiguratorUI from '@/components/3d/ConfiguratorUI/ConfiguratorUI';
import ReviewsSection from '@/components/ProductExtras/ReviewsSection';
import InstagramBanner from '@/components/ProductExtras/InstagramBanner';
import NewsletterMarquee from '@/components/ProductExtras/NewsletterMarquee';
import React, { useCallback, useRef, useState } from 'react';
import { uploadImage } from '@/actions/cloudinary/uploadImage';
import { useCartStore } from '@/store/cartStore';
import {
  SIZE_OPTIONS,
  SPORT_MODELS,
  toCartLineProperties,
  numericVariantId,
  type JerseySelectedOptions,
} from '@/data';
import { getSizeOption } from '@/lib/pricing';
import { deleteReactDebugChannelForHtmlRequest } from 'next/dist/server/dev/debug-channel';

const sportsTypeData = [{ name: 'Soccer' }, { name: 'Basketball' }, { name: 'Baseball' }];

const Page = () => {
  const [sizeOptionValue, setSizeOptionValue] = useState(20);
  const [sportsTypeValue, setSportsTypeValue] = useState('Soccer');
  const [name, setName] = useState('BROWN');
  const [number, setNumber] = useState('7');
    const [outlineColor, setOutlineColor] = useState('#FF8A00');
  const [nameColor, setNameColor] = useState('#ffffff');
  const [numberColor, setNumberColor] = useState('#ffffff');
  const [backboardColor, setBackboardColor] = useState('transparent');
  const [selectedSport, setSelectedSport] = useState('Basketball');
  const [isDark, setIsDark] = useState(false);
  const [neonOn, setNeonOn] = useState(true);
  const [quantity, setQuantity] = useState(1);


const addStorefrontItem = useCartStore((s) => s.addStorefrontItem);
const snapshotRef = useRef<(() => Promise<string | null>) | null>(null);
const [addingToCart, setAddingToCart] = useState(false);
const [addToCartError, setAddToCartError] = useState<string | null>(null);

const onSnapshotReady = useCallback((fn: () => Promise<string | null>) => {
  snapshotRef.current = fn;
}, []);

const handleAddToCart = async () => {
  if (addingToCart) return;
  setAddingToCart(true);
  setAddToCartError(null);
  try {
    let previewImageUrl: string | undefined;

    const dataUrl = await snapshotRef.current?.();
    if (dataUrl) {
      try {
      previewImageUrl = await uploadImage(dataUrl);
      } catch {
        previewImageUrl = dataUrl;
      }
    }

    const selectedOptions: JerseySelectedOptions = {
      size: sizeOptionValue ?? 20,
      sport: selectedSport,
      name,
      number,
      jerseyColor: outlineColor,
      nameColor,
      numberColor,
      backboardColor,
      previewImageUrl,
    };

    // Added directly to the real Shopify cart (as the size's real product
    // variant + these as line item properties), not a local-only cart, so
    // it's genuinely shared with the rest of the store from the moment it's
    // added, not just at checkout.
    const { variantId } = getSizeOption(selectedOptions.size);
    await addStorefrontItem(numericVariantId(variantId), quantity, toCartLineProperties(selectedOptions));
  } catch (err) {
    setAddToCartError(err instanceof Error ? err.message : 'Failed to add to cart.');
  } finally {
    setAddingToCart(false);
  }
};

const currentGlbUrl = SPORT_MODELS[selectedSport] || SPORT_MODELS.Soccer;


   return (
  <>
  {/* Desktop: left canvas is sticky + capped to viewport; only right column scrolls.
      Mobile: canvas has fixed aspect band, then config scrolls below. */}
    <div className="gj-page mx-auto w-full max-w-[1600px] mb-16 lg:mb-24">
    <div className="gj-product">
      <div className="gj-media">
        <div className="gj-media__frame">
          <div className="absolute inset-0">
            <Experience
              glbUrl={currentGlbUrl}
              name={name}
              number={number}
              outlineColor={outlineColor}
              nameColor={nameColor}
              numberColor={numberColor}
              backboardColor={backboardColor}
              isDark={isDark}
              neonOn={neonOn}
              setNeonOn={setNeonOn}
              onSnapshotReady={onSnapshotReady}
            />
          </div>
        </div>
      </div>

      <div className="gj-info">
      {/* Right: normal flow — page scroll moves this; left stays sticky */}
      <div className="min-w-0 w-full bg-white text-black lg:pt-2">
        <ConfiguratorUI
          sizeOptionData={SIZE_OPTIONS}
          sizeOptionValue={sizeOptionValue}
          setSizeOptionValue={setSizeOptionValue}
          sportsTypeData={sportsTypeData}
          sportsTypeValue={sportsTypeValue}
          setSportsTypeValue={setSportsTypeValue}
          configurationData={null}
          selectedSport={selectedSport}
          setSelectedSport={setSelectedSport}
          name={name}
          setName={setName}
          number={number}
          setNumber={setNumber}
          outlineColor={outlineColor}
          setOutlineColor={setOutlineColor}
          nameColor={nameColor}
          setNameColor={setNameColor}
          numberColor={numberColor}
          setNumberColor={setNumberColor}
          backboardColor={backboardColor}
          setBackboardColor={setBackboardColor}
          isDark={isDark}
          setIsDark={setIsDark}
          neonOn={neonOn}
          setNeonOn={setNeonOn}
          quantity={quantity}
          setQuantity={setQuantity}
          onAddToCart={handleAddToCart}
          addingToCart={addingToCart}
          addToCartError={addToCartError}
        />
      </div>
    </div>
    </div>
  </div>

  <ReviewsSection />
  <InstagramBanner />
  <NewsletterMarquee />
  {/* Empty spacer before the footer, matching the live theme's own gap here. */}
  <div className="py-9" />
  </>
);
};

export default Page;