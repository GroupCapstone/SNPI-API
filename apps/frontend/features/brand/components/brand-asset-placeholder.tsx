'use client';

import * as React from 'react';
import { BrandMark } from '@/components/shared/brand-mark';
import { cn } from '@/lib/utils';

export interface BrandAssetPlaceholderProps {
  title: string;
  category: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '21:9' | 'auto';
  dimensions?: string;
  description: string;
  guidelines?: string[];
  className?: string;
}

export function BrandAssetPlaceholder({
  title,
  category,
  aspectRatio = '16:9',
  dimensions = 'Vector SVG / 1920x1080px',
  description,
  guidelines = [],
  className,
}: BrandAssetPlaceholderProps) {
  const aspectClass = {
    '16:9': 'aspect-[16/9]',
    '4:3': 'aspect-[4/3]',
    '1:1': 'aspect-square',
    '21:9': 'aspect-[21/9]',
    auto: 'min-h-[220px]',
  }[aspectRatio];

  return (
    <div
      className={cn(
        'group relative flex flex-col justify-between overflow-hidden rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/30 p-5 transition-all duration-150 hover:border-[#0056FF]',
        aspectClass,
        className,
      )}
    >
      {/* Top Meta Header */}
      <div className="flex items-center justify-between gap-2 border-b border-[#CAD3F5] pb-3">
        <div className="flex items-center gap-2">
          <span className="rounded-[3px] bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
            {category}
          </span>
          <span className="font-mono text-[10.5px] font-bold text-slate-700 uppercase">
            [OFFICIAL BRAND ASSET]
          </span>
        </div>
        <span className="font-mono text-[10px] font-semibold text-slate-500">{dimensions}</span>
      </div>

      {/* Center Official Brand Logo & Clear Term Description */}
      <div className="my-auto flex flex-col items-center justify-center gap-3 py-4 text-center">
        <div className="relative flex size-16 items-center justify-center rounded-full border border-[#CAD3F5] bg-white p-2 shadow-2xs">
          <BrandMark compact size={48} />
        </div>
        <div className="max-w-md space-y-1">
          <h4 className="font-sans text-sm font-black tracking-wider text-slate-900 uppercase">
            {title}
          </h4>
          <p className="line-clamp-2 font-sans text-xs font-medium text-slate-600">{description}</p>
        </div>
      </div>

      {/* Bottom Technical Rules & Usage Notes */}
      <div className="border-t border-[#CAD3F5] pt-3">
        {guidelines.length > 0 ? (
          <div className="flex flex-wrap items-center justify-between gap-1.5 font-mono text-[10px] text-slate-500">
            {guidelines.map((rule, idx) => (
              <span
                key={idx}
                className="rounded-[2px] border border-[#CAD3F5] bg-white px-1.5 py-0.5"
              >
                {rule}
              </span>
            ))}
          </div>
        ) : (
          <p className="font-mono text-[10px] text-slate-500">
            Strict brand palette: #0056FF, #2277FF, #000000, #E3E7FC, #FFFFFF. No outside colors.
          </p>
        )}
      </div>
    </div>
  );
}
