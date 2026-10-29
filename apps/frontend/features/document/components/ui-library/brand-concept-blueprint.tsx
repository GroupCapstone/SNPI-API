'use client';

import * as React from 'react';
import { Copy, Check } from '@/components/icons';

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
      <div>
        <h2 className="font-sans text-xl font-bold tracking-tight text-slate-900">
          Brand Colors & Gradients
        </h2>
        <p className="mt-1 font-sans text-xs text-slate-500">
          Royal Blue primary base, futurewave gradients, and Sora typography.
        </p>
      </div>

      {/* Main Blueprint Grid (Matching Uploaded Image Blueprint) */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: 01 Royal Blue (Tall Hero Card) */}
        <div className="lg:col-span-4">
          <button
            type="button"
            onClick={() => handleCopy('#0056FF')}
            className="group relative flex h-full min-h-[480px] w-full flex-col justify-between rounded-[28px] bg-[#0056FF] p-8 text-left text-white shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
          >
            {/* Top: 01 */}
            <div className="flex items-start justify-between">
              <span className="font-sans text-7xl font-extrabold tracking-tighter sm:text-8xl">
                01
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 font-mono text-xs font-semibold backdrop-blur-xs transition-colors group-hover:bg-white/30">
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
              className="group relative flex min-h-[170px] flex-col justify-between rounded-[24px] bg-[#2277FF] p-6 text-left text-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight">02</span>
                <span className="font-mono text-xs font-bold text-white/90">#2277FF</span>
              </div>
              <div>
                <h4 className="font-sans text-base font-bold">Azure Blue</h4>
              </div>
            </button>

            {/* 03 Black */}
            <button
              type="button"
              onClick={() => handleCopy('#000000')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-[24px] bg-[#000000] p-6 text-left text-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight">03</span>
                <span className="font-mono text-xs font-bold text-white/90">#000000</span>
              </div>
              <div>
                <h4 className="font-sans text-base font-bold">Black</h4>
              </div>
            </button>
          </div>

          {/* Row 2: 04 Soft Lavender + 05 White */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* 04 Soft Lavender */}
            <button
              type="button"
              onClick={() => handleCopy('#E3E7FC')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-[24px] bg-[#E3E7FC] p-6 text-left text-[#000B26] shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight text-[#000B26]">
                  04
                </span>
                <span className="font-mono text-xs font-bold text-[#000B26]">#E3E7FC</span>
              </div>
              <div>
                <h4 className="font-sans text-base font-bold text-[#000B26]">Soft Lavender</h4>
              </div>
            </button>

            {/* 05 White */}
            <button
              type="button"
              onClick={() => handleCopy('#FFFFFF')}
              className="group relative flex min-h-[170px] flex-col justify-between rounded-[24px] border border-slate-200 bg-[#FFFFFF] p-6 text-left text-slate-900 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-extrabold tracking-tight text-slate-900">
                  05
                </span>
                <span className="font-mono text-xs font-bold text-slate-500">#FFFFFF</span>
              </div>
              <div>
                <h4 className="font-sans text-base font-bold text-slate-900">White</h4>
              </div>
            </button>
          </div>

          {/* Row 3: Gradient 1 Futurewave */}
          <button
            type="button"
            onClick={() => handleCopy('linear-gradient(135deg, #2277FF, #6899FF, #AEC2FF)')}
            className="group relative flex min-h-[140px] flex-col justify-between rounded-[24px] bg-gradient-to-r from-[#2277FF] via-[#5C93FF] to-[#AEC2FF] p-6 text-left text-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="font-sans text-2xl font-bold tracking-tight">Gradient 1</span>
              <span className="font-mono text-xs font-semibold text-white/90">
                #2277FF &rarr; #AEC2FF
              </span>
            </div>
            <div>
              <h4 className="font-sans text-3xl font-extrabold tracking-tight">Futurewave</h4>
            </div>
          </button>

          {/* Row 4: Gradient 2 Midnight Surge */}
          <button
            type="button"
            onClick={() => handleCopy('linear-gradient(135deg, #000B26, #002D8A, #0056FF)')}
            className="group relative flex min-h-[110px] flex-col justify-between rounded-[24px] bg-gradient-to-r from-[#000B26] via-[#002D8A] to-[#0056FF] p-6 text-left text-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <span className="font-sans text-sm font-semibold tracking-wider text-white/80 uppercase">
                Gradient 2
              </span>
              <span className="font-mono text-xs font-semibold text-white/80">
                #000B26 &rarr; #0056FF
              </span>
            </div>
            <div>
              <h4 className="font-sans text-2xl font-extrabold tracking-tight">Midnight Surge</h4>
            </div>
          </button>
        </div>
      </div>
    </section>
  );
}
