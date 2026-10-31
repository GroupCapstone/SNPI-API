'use client';

import * as React from 'react';
import Image from 'next/image';
import { Copy, Check } from '@/components/icons';
import { GeometricHeaderStamp } from './geometric-tag-primitives';

export function BrandConceptBlueprint() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const handleCopy = (token: string, label: string) => {
    navigator.clipboard.writeText(token);
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const coreColors = [
    {
      num: '01',
      name: 'Royal Blue',
      role: 'Primary Brand Base',
      hex: '#0056FF',
      rgb: 'rgb(0, 86, 255)',
      hsl: 'hsl(220, 100%, 50%)',
      bgClass: 'bg-[#0056FF]',
      borderClass: 'border-[#0056FF]',
      textClass: 'text-white',
      badgeClass: 'bg-white/20 text-white',
    },
    {
      num: '02',
      name: 'Black',
      role: 'High-Contrast Depth',
      hex: '#000000',
      rgb: 'rgb(0, 0, 0)',
      hsl: 'hsl(0, 0%, 0%)',
      bgClass: 'bg-[#000000]',
      borderClass: 'border-slate-900',
      textClass: 'text-white',
      badgeClass: 'bg-white/20 text-white',
    },
    {
      num: '03',
      name: 'White',
      role: 'Clean Canvas Base',
      hex: '#FFFFFF',
      rgb: 'rgb(255, 255, 255)',
      hsl: 'hsl(0, 0%, 100%)',
      bgClass: 'bg-[#FFFFFF]',
      borderClass: 'border-slate-200/90',
      textClass: 'text-slate-950',
      badgeClass: 'bg-slate-100 text-slate-700',
    },
  ];

  const cssTokens = `:root {
  --brand-royal-blue: #0056FF; /* rgb(0, 86, 255) */
  --brand-black: #000000;      /* rgb(0, 0, 0) */
  --brand-white: #FFFFFF;      /* rgb(255, 255, 255) */
}`;

  return (
    <section id="brand-identity" className="scroll-mt-24 space-y-6">
      {/* Anchor alias for existing toc */}
      <span id="brand-blueprint" className="scroll-mt-24" />

      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Brand Identity & Colors
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
            Official logo mark, 3 core brand colors, and code color tokens.
          </p>
        </div>
        <GeometricHeaderStamp codeA="03" titleA="CORE" codeB="26" titleB="BRAND" />
      </div>

      {/* LOGO SECTION (Light & Dark Presentation) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          {/* Logo Identity Title */}
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-black tracking-widest text-[#0056FF] uppercase">
              Official Identity Asset
            </span>
            <h3 className="font-sans text-xl font-extrabold text-slate-950 sm:text-2xl">
              SNP International School Logo
            </h3>
            <p className="max-w-md font-sans text-xs text-slate-600 sm:text-sm">
              The official institutional seal and brand mark for all digital interfaces, print
              certificates, and web portals.
            </p>
          </div>

          {/* Logo Previews (Light Canvas & Dark Canvas) */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Light Mode Preview */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="SNP International School Logo - Light Canvas"
                  width={64}
                  height={64}
                  className="size-full object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-sans text-xs font-bold text-slate-950">Light Canvas</div>
                <div className="font-mono text-[10px] text-slate-500">bg-[#FFFFFF]</div>
              </div>
            </div>

            {/* Dark Mode Preview */}
            <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-[#000B26] p-4 text-white shadow-xs">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white p-1 shadow-xs">
                <Image
                  src="/images/logo.png"
                  alt="SNP International School Logo - Dark Canvas"
                  width={64}
                  height={64}
                  className="size-full object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-sans text-xs font-bold text-white">Dark Canvas</div>
                <div className="font-mono text-[10px] text-blue-200">bg-[#000B26]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 CORE COLORS ONLY */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {coreColors.map((color) => {
          const isHexCopied = copiedToken === `${color.name}-hex`;
          const isRgbCopied = copiedToken === `${color.name}-rgb`;

          return (
            <div
              key={color.num}
              className={`relative flex min-h-[260px] flex-col justify-between rounded-3xl border p-6 shadow-xs transition-all duration-200 hover:-translate-y-1 sm:p-7 ${color.bgClass} ${color.borderClass} ${color.textClass}`}
            >
              {/* Top: Number & Role */}
              <div className="flex items-start justify-between">
                <span className="font-sans text-5xl font-black tracking-tighter opacity-90 sm:text-6xl">
                  {color.num}
                </span>
                <span
                  className={`rounded-full px-3 py-1 font-mono text-[10px] font-bold uppercase ${color.badgeClass}`}
                >
                  {color.role}
                </span>
              </div>

              {/* Bottom: Name & Click-to-Copy Buttons */}
              <div className="space-y-3 pt-6">
                <div>
                  <h4 className="font-sans text-2xl font-black tracking-tight">{color.name}</h4>
                  <p className="font-mono text-xs opacity-80">{color.hsl}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {/* HEX Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(color.hex, `${color.name}-hex`)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                      color.hex === '#FFFFFF'
                        ? 'border-slate-300 bg-slate-50 text-slate-900 hover:border-[#0056FF]'
                        : 'border-white/20 bg-white/10 text-white hover:bg-white/20'
                    }`}
                  >
                    {isHexCopied ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 opacity-70" />
                        <span>{color.hex}</span>
                      </>
                    )}
                  </button>

                  {/* RGB Copy Button */}
                  <button
                    type="button"
                    onClick={() => handleCopy(color.rgb, `${color.name}-rgb`)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-mono text-xs font-bold transition-all ${
                      color.hex === '#FFFFFF'
                        ? 'border-slate-300 bg-slate-50 text-slate-700 hover:border-[#0056FF]'
                        : 'border-white/20 bg-white/10 text-white/90 hover:bg-white/20'
                    }`}
                  >
                    {isRgbCopied ? (
                      <>
                        <Check className="size-3.5 text-emerald-400" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5 opacity-70" />
                        <span>{color.rgb}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* CODE COLOR (Developer Tokens Box) */}
      <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-sans text-base font-bold text-slate-950">
              Code Color Tokens (CSS Variables)
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Drop-in style tokens for web stylesheets and theme config.
            </p>
          </div>
          <button
            type="button"
            onClick={() => handleCopy(cssTokens, 'css-tokens')}
            className="inline-flex items-center gap-2 rounded-lg bg-[#0056FF] px-4 py-2 font-sans text-xs font-bold text-white transition-all hover:bg-blue-700"
          >
            {copiedToken === 'css-tokens' ? (
              <>
                <Check className="size-3.5" />
                <span>Copied CSS Tokens!</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copy Code Tokens</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-800 bg-[#000B26] p-4 text-white">
          <pre className="font-mono text-xs leading-relaxed text-[#AEC2FF]">
            <code>{cssTokens}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
