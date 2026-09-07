'use client';

import Experience from '@/components/3d/Experience/Experience';
import React from 'react';

const Page = () => {
  return (
    <div className="h-[100dvh] overflow-hidden">
      <div className="h-full w-full bg-[#1a1a1a]">
        <Experience />
      </div>
    </div>
  );
};

export default Page;