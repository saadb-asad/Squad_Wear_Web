import React from 'react';

interface MarqueeTickerProps {
  text?: string;
  items?: string[];
}

export const MarqueeTicker: React.FC<MarqueeTickerProps> = ({
  text,
  items = [
    'A WORLD OF TIMELESS DESIGNS BUILT FOR EVERYDAY WEAR',
    'FREE SHIPPING ON ALL ORDERS',
    'PREMIUM TECHWEAR & ESSENTIALS',
    'DESIGNED WITH PRECISION'
  ]
}) => {
  const displayItems = text ? [text, text, text, text] : items;

  return (
    <div className="w-full bg-[#030302] text-[#ffffff] border-y border-[#d3cec5] py-4 overflow-hidden select-none">
      <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
        {displayItems.concat(displayItems).map((item, idx) => (
          <div key={idx} className="flex items-center gap-12">
            <span className="font-geist text-xs md:text-sm font-semibold tracking-widest uppercase text-white/90">
              {item}
            </span>
            <span className="w-1.5 h-1.5 bg-[#d3cec5] rounded-full inline-block opacity-60" />
          </div>
        ))}
      </div>
    </div>
  );
};
