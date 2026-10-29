'use client';

import * as React from 'react';
import { Copy, Check } from '@/components/icons';
import { cn } from '@/lib/utils';

interface ColorSpec {
  name: string;
  hex: string;
  rgb: string;
  cmyk: string;
  pantone: string;
  bgClass: string;
  textClass: string;
  borderClass?: string;
  isFullWidth?: boolean;
}

const BRAND_PALETTE: ColorSpec[] = [
  {
    name: 'Signal Lime',
    hex: '#92FF5F',
    rgb: '146, 255, 95',
    cmyk: '43, 0, 63, 0',
    pantone: '902 C',
    bgClass: 'bg-[#92FF5F]',
    textClass: 'text-[#0B2518]',
    isFullWidth: true,
  },
  {
    name: 'Move Green',
    hex: '#0F3B27',
    rgb: '15, 59, 39',
    cmyk: '75, 0, 34, 77',
    pantone: '5535 C',
    bgClass: 'bg-[#0F3B27]',
    textClass: 'text-[#F7F9F7]',
    borderClass: 'border border-white/20',
    isFullWidth: true,
  },
  {
    name: 'Soft White',
    hex: '#F7F9F7',
    rgb: '247, 249, 247',
    cmyk: '1, 0, 1, 2',
    pantone: '656 C',
    bgClass: 'bg-[#F7F9F7]',
    textClass: 'text-[#0F3B27]',
    isFullWidth: true,
  },
  {
    name: 'Orange',
    hex: '#FF7036',
    rgb: '255, 112, 54',
    cmyk: '0, 56, 79, 0',
    pantone: '1645 C',
    bgClass: 'bg-[#FF7036]',
    textClass: 'text-[#0B2518]',
    isFullWidth: false,
  },
  {
    name: 'Ice',
    hex: '#BFF2F0',
    rgb: '191, 242, 240',
    cmyk: '21, 0, 1, 5',
    pantone: '9480 C',
    bgClass: 'bg-[#BFF2F0]',
    textClass: 'text-[#0B2518]',
    isFullWidth: false,
  },
  {
    name: 'Mint',
    hex: '#CFF1D2',
    rgb: '207, 241, 210',
    cmyk: '14, 0, 13, 5',
    pantone: '2253 C',
    bgClass: 'bg-[#CFF1D2]',
    textClass: 'text-[#0B2518]',
    isFullWidth: false,
  },
];

export function BrandConceptBlueprint() {
  const [copiedColor, setCopiedColor] = React.useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const fullWidthCards = BRAND_PALETTE.filter((c) => c.isFullWidth);
  const bottomRowCards = BRAND_PALETTE.filter((c) => !c.isFullWidth);

  return (
    <section className="space-y-4">
      {/* Blueprint Header */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#92FF5F]" />
            <span className="font-mono text-xs font-bold tracking-widest text-[#92FF5F] uppercase">
              Brand Color System · Concept Blueprint
            </span>
          </div>
          <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            Docs & UI Library Design Language
          </h2>
        </div>
        <div className="font-mono text-xs text-[#7DAF99]">Click any card to copy HEX token</div>
      </div>

      {/* Blueprint Container Box */}
      <div className="space-y-3.5 rounded-3xl border border-[#1A4530] bg-[#071D13] p-4 sm:p-6">
        {/* Top 3 Full-Width Cards */}
        {fullWidthCards.map((color) => {
          const isCopied = copiedColor === color.hex;
          return (
            <div
              key={color.name}
              onClick={() => handleCopy(color.hex)}
              className={cn(
                'group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl p-6 transition-transform hover:scale-[1.008] sm:min-h-[160px] sm:flex-row sm:items-center sm:p-8',
                color.bgClass,
                color.textClass,
                color.borderClass,
              )}
            >
              {/* Display Heading */}
              <div>
                <h3 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                  {color.name}
                </h3>
              </div>

              {/* Color Metadata Specification */}
              <div className="mt-4 flex items-end justify-between sm:mt-0 sm:flex-col sm:items-end sm:text-right">
                <div className="space-y-0.5 font-mono text-xs opacity-90">
                  <p className="font-bold">Hex {color.hex}</p>
                  <p>RGB: {color.rgb}</p>
                  <p>CMYK: {color.cmyk}</p>
                  <p>PANTONE {color.pantone}</p>
                </div>

                <div className="flex items-center gap-1 rounded px-2 py-1 font-mono text-[11px] opacity-80 group-hover:opacity-100">
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 opacity-60" />
                      <span>Copy Hex</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Bottom Row: 3 Accent Cards (Orange, Ice, Mint) */}
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {bottomRowCards.map((color) => {
            const isCopied = copiedColor === color.hex;
            return (
              <div
                key={color.name}
                onClick={() => handleCopy(color.hex)}
                className={cn(
                  'group relative flex min-h-[150px] cursor-pointer flex-col justify-between rounded-2xl p-5 transition-transform hover:scale-[1.015] sm:min-h-[170px]',
                  color.bgClass,
                  color.textClass,
                )}
              >
                <div>
                  <h3 className="text-2xl font-black tracking-tight sm:text-3xl">{color.name}</h3>
                </div>

                <div className="space-y-0.5 font-mono text-[11px] opacity-90">
                  <p className="font-bold">Hex {color.hex}</p>
                  <p>RGB: {color.rgb}</p>
                  <p>CMYK: {color.cmyk}</p>
                  <p>PANTONE {color.pantone}</p>

                  <div className="pt-2 text-[10px] font-semibold">
                    {isCopied ? 'Copied!' : 'Click to copy'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
