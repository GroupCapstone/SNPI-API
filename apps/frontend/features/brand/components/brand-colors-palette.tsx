'use client';

import * as React from 'react';
import { Copy, Check } from '@/components/icons';
import { cn } from '@/lib/utils';

export function BrandColorsPalette({ className }: { className?: string }) {
  const [copiedCode, setCopiedCode] = React.useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 1800);
  };

  return (
    <section className={cn('w-full space-y-6', className)}>
      {/* Top Header matching reference image: 20 | BRAND / 26 | BLUE */}
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[#CAD3F5] pb-4">
        <div>
          <h2 className="font-sans text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Brand Colors &amp; Gradients
          </h2>
          <p className="mt-1 font-sans text-sm font-medium text-slate-600 sm:text-base">
            Royal Blue primary base, futurewave gradients, and Sora typography.
          </p>
        </div>
        <div className="text-right font-mono font-bold">
          <div className="text-base text-slate-900 tracking-wider">
            20 <span className="text-slate-400">|</span> <span className="text-[#0056FF]">BRAND</span>
          </div>
          <div className="text-base text-slate-900 tracking-wider">
            26 <span className="text-slate-400">|</span> <span className="text-[#0056FF]">BLUE</span>
          </div>
        </div>
      </div>

      {/* Grid Layout matching media_1793422641993_ec1967ec.png */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* 01 Royal Blue Large Block (Col span 4) */}
        <div
          className="group relative flex min-h-[460px] flex-col justify-between rounded-[4px] bg-[#0056FF] p-6 text-white shadow-sm transition-all duration-150 hover:brightness-105 lg:col-span-4"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-6xl font-black tracking-tighter">01</span>
            <button
              type="button"
              onClick={() => handleCopy('#0056FF')}
              className="flex items-center gap-1.5 rounded-[3px] bg-white/20 px-2.5 py-1 font-mono text-xs font-bold backdrop-blur-md transition-colors hover:bg-white/30"
              title="Copy HEX #0056FF"
            >
              {copiedCode === '#0056FF' ? <Check className="size-3" /> : <Copy className="size-3" />}
              <span>#0056FF</span>
            </button>
          </div>

          <div className="space-y-1">
            <h3 className="font-sans text-2xl font-bold tracking-tight">Royal Blue</h3>
            <p className="font-mono text-sm font-semibold opacity-90">#0056FF</p>
            <p className="pt-2 font-sans text-xs text-blue-100 opacity-80">
              Primary brand baseline. Applied to hero sections, active navigational docks, CTAs, and authoritative typography.
            </p>
          </div>
        </div>

        {/* Right Side 2x2 Swatches + 2 Full Width Gradients (Col span 8) */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          {/* Row 1: 02 Azure Blue & 03 Black */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 02 Azure Blue */}
            <div
              className="group relative flex min-h-[140px] flex-col justify-between rounded-[4px] bg-[#2277FF] p-5 text-white shadow-sm transition-all duration-150 hover:brightness-105"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-4xl font-black tracking-tight">02</span>
                <button
                  type="button"
                  onClick={() => handleCopy('#2277FF')}
                  className="font-mono text-xs font-bold text-white/90 hover:underline"
                  title="Copy HEX #2277FF"
                >
                  {copiedCode === '#2277FF' ? '[COPIED]' : '#2277FF'}
                </button>
              </div>
              <div>
                <h4 className="font-sans text-lg font-bold">Azure Blue</h4>
                <p className="font-mono text-xs opacity-80">#2277FF &middot; Vibrant Accent</p>
              </div>
            </div>

            {/* 03 Black */}
            <div
              className="group relative flex min-h-[140px] flex-col justify-between rounded-[4px] bg-[#000000] p-5 text-white shadow-sm transition-all duration-150 hover:brightness-110"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-4xl font-black tracking-tight">03</span>
                <button
                  type="button"
                  onClick={() => handleCopy('#000000')}
                  className="font-mono text-xs font-bold text-white/90 hover:underline"
                  title="Copy HEX #000000"
                >
                  {copiedCode === '#000000' ? '[COPIED]' : '#000000'}
                </button>
              </div>
              <div>
                <h4 className="font-sans text-lg font-bold">Black</h4>
                <p className="font-mono text-xs opacity-80">#000000 &middot; Absolute Contrast</p>
              </div>
            </div>
          </div>

          {/* Row 2: 04 Soft Lavender & 05 White */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 04 Soft Lavender */}
            <div
              className="group relative flex min-h-[140px] flex-col justify-between rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] p-5 text-slate-900 shadow-sm transition-all duration-150 hover:border-[#0056FF]"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-4xl font-black tracking-tight">04</span>
                <button
                  type="button"
                  onClick={() => handleCopy('#E3E7FC')}
                  className="font-mono text-xs font-bold text-slate-700 hover:text-[#0056FF]"
                  title="Copy HEX #E3E7FC"
                >
                  {copiedCode === '#E3E7FC' ? '[COPIED]' : '#E3E7FC'}
                </button>
              </div>
              <div>
                <h4 className="font-sans text-lg font-bold">Soft Lavender</h4>
                <p className="font-mono text-xs text-slate-600">#E3E7FC &middot; Neutral Tint Base</p>
              </div>
            </div>

            {/* 05 White */}
            <div
              className="group relative flex min-h-[140px] flex-col justify-between rounded-[4px] border border-[#CAD3F5] bg-[#FFFFFF] p-5 text-slate-900 shadow-sm transition-all duration-150 hover:border-[#0056FF]"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-4xl font-black tracking-tight">05</span>
                <button
                  type="button"
                  onClick={() => handleCopy('#FFFFFF')}
                  className="font-mono text-xs font-bold text-slate-700 hover:text-[#0056FF]"
                  title="Copy HEX #FFFFFF"
                >
                  {copiedCode === '#FFFFFF' ? '[COPIED]' : '#FFFFFF'}
                </button>
              </div>
              <div>
                <h4 className="font-sans text-lg font-bold">White</h4>
                <p className="font-mono text-xs text-slate-600">#FFFFFF &middot; Pure Canvas</p>
              </div>
            </div>
          </div>

          {/* Row 3: Gradient 1 Futurewave */}
          <div
            className="group relative flex min-h-[85px] flex-col justify-between rounded-[4px] p-5 text-white shadow-sm transition-all duration-150 hover:brightness-105"
            style={{ background: 'linear-gradient(90deg, #2277FF 0%, #AEC2FF 100%)' }}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-sans text-lg font-black tracking-tight">Gradient 1</h4>
              <button
                type="button"
                onClick={() => handleCopy('#2277FF -> #AEC2FF')}
                className="font-mono text-xs font-bold text-white/95 hover:underline"
                title="Copy Gradient 1"
              >
                {copiedCode === '#2277FF -> #AEC2FF' ? '[COPIED]' : '#2277FF \u2192 #AEC2FF'}
              </button>
            </div>
            <div>
              <p className="font-sans text-base font-bold">Futurewave</p>
            </div>
          </div>

          {/* Row 4: GRADIENT 2 Midnight Surge */}
          <div
            className="group relative flex min-h-[85px] flex-col justify-between rounded-[4px] p-5 text-white shadow-sm transition-all duration-150 hover:brightness-110"
            style={{ background: 'linear-gradient(90deg, #000B26 0%, #0056FF 100%)' }}
          >
            <div className="flex items-start justify-between">
              <h4 className="font-sans text-xs font-black tracking-wider uppercase opacity-90">GRADIENT 2</h4>
              <button
                type="button"
                onClick={() => handleCopy('#000B26 -> #0056FF')}
                className="font-mono text-xs font-bold text-white/95 hover:underline"
                title="Copy Gradient 2"
              >
                {copiedCode === '#000B26 -> #0056FF' ? '[COPIED]' : '#000B26 \u2192 #0056FF'}
              </button>
            </div>
            <div>
              <p className="font-sans text-base font-bold">Midnight Surge</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
