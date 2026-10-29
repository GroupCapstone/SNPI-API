'use client';

import * as React from 'react';
import { Copy, Check } from '@/components/icons';
import { GeometricHeaderStamp } from './geometric-tag-primitives';

export function BrandConceptBlueprint() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const handleCopy = (token: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(token);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  return (
    <section className="space-y-6">
      {/* Blueprint Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900">
            Brand Colors & Gradients
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-500">
            Royal Blue primary base, futurewave gradients, and Sora typography.
          </p>
        </div>
        <GeometricHeaderStamp codeA="20" titleA="BRAND" codeB="26" titleB="BLUE" />
      </div>

      {/* Main Blueprint Grid (Apple Liquid Glass Style) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: 01 Royal Blue (Tall Hero Card) */}
        <div className="lg:col-span-4">
          <button
            type="button"
            onClick={() => handleCopy('#0056FF')}
            className="group relative flex h-full min-h-[480px] w-full flex-col justify-between rounded-3xl border border-[#0056FF] bg-[#0056FF] p-8 text-left text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_12px_32px_rgba(0,86,255,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(0,86,255,0.35)]"
          >
            {/* Top: 01 */}
            <div className="flex items-start justify-between">
              <span className="font-sans text-7xl font-extrabold tracking-tighter sm:text-8xl">
                01
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 font-mono text-xs font-semibold backdrop-blur-md transition-colors group-hover:bg-white/30">
                {copiedToken === '#0056FF' ? (
                  <>
                    <Check className="h-3 w-3" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    <span>#0056FF</span>
                  </>
                )}
              </span>
            </div>

            {/* Bottom: Name & Token */}
            <div className="space-y-1">
              <h3 className="font-sans text-3xl font-extrabold tracking-tight">Royal Blue</h3>
              <p className="font-mono text-xl font-bold tracking-tight text-white/90">#0056FF</p>
            </div>
          </button>
        </div>

        {/* Right Column: 02, 03, 04, 05 and Gradients */}
        <div className="flex flex-col gap-4 lg:col-span-8">
          {/* Row 1: 02 Azure Blue + 03 Black */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 02 Azure Blue */}
            <button
              type="button"
              onClick={() => handleCopy('#2277FF')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-2xl border border-[#2277FF] bg-[#2277FF] p-6 text-left text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_8px_20px_rgba(34,119,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight">02</span>
                <span className="font-mono text-xs font-bold text-white/90">#2277FF</span>
              </div>
              <h4 className="font-sans text-base font-bold">Azure Blue</h4>
            </button>

            {/* 03 Black */}
            <button
              type="button"
              onClick={() => handleCopy('#000000')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-900 bg-[#000000] p-6 text-left text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15),_0_8px_20px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight">03</span>
                <span className="font-mono text-xs font-bold text-white/90">#000000</span>
              </div>
              <h4 className="font-sans text-base font-bold">Black</h4>
            </button>
          </div>

          {/* Row 2: 04 Soft Lavender + 05 White */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 04 Soft Lavender */}
            <button
              type="button"
              onClick={() => handleCopy('#E3E7FC')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC] p-6 text-left text-[#000B26] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),_0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight text-[#000B26]">
                  04
                </span>
                <span className="font-mono text-xs font-bold text-[#000B26]">#E3E7FC</span>
              </div>
              <h4 className="font-sans text-base font-bold text-[#000B26]">Soft Lavender</h4>
            </button>

            {/* 05 White */}
            <button
              type="button"
              onClick={() => handleCopy('#FFFFFF')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-2xl border border-slate-200/90 bg-[#FFFFFF] p-6 text-left text-slate-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.9),_0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300 hover:-translate-y-1 hover:border-[#0056FF]/40 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight text-slate-900">
                  05
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">#FFFFFF</span>
              </div>
              <h4 className="font-sans text-base font-bold text-slate-900">White</h4>
            </button>
          </div>

          {/* Row 3: Gradient 1 Futurewave */}
          <button
            type="button"
            onClick={() => handleCopy('linear-gradient(135deg, #2277FF, #6899FF, #AEC2FF)')}
            className="group relative flex min-h-[140px] flex-col justify-between rounded-2xl border border-[#2277FF]/40 bg-gradient-to-r from-[#2277FF] via-[#5C93FF] to-[#AEC2FF] p-6 text-left text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_8px_24px_rgba(34,119,255,0.2)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="font-sans text-2xl font-bold tracking-tight">Gradient 1</span>
              <span className="font-mono text-xs font-semibold text-white/90">
                #2277FF &rarr; #AEC2FF
              </span>
            </div>
            <h4 className="font-sans text-3xl font-extrabold tracking-tight">Futurewave</h4>
          </button>

          {/* Row 4: Gradient 2 Midnight Surge */}
          <button
            type="button"
            onClick={() => handleCopy('linear-gradient(135deg, #000B26, #002D8A, #0056FF)')}
            className="group relative flex min-h-[110px] flex-col justify-between rounded-2xl border border-slate-900 bg-gradient-to-r from-[#000B26] via-[#002D8A] to-[#0056FF] p-6 text-left text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2),_0_8px_24px_rgba(0,11,38,0.25)] transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="flex items-start justify-between">
              <span className="font-sans text-sm font-semibold tracking-wider text-white/80 uppercase">
                Gradient 2
              </span>
              <span className="font-mono text-xs font-semibold text-white/80">
                #000B26 &rarr; #0056FF
              </span>
            </div>
            <h4 className="font-sans text-2xl font-extrabold tracking-tight">Midnight Surge</h4>
          </button>
        </div>
      </div>
    </section>
  );
}
