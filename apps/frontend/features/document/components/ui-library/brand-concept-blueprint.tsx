'use client';

import * as React from 'react';
import Image from 'next/image';
import { Copy, Check, Code } from '@/components/icons';
import { GeometricHeaderStamp } from './geometric-tag-primitives';
import { LibraryTooltip } from './tooltip';
import { cn } from '@/lib/utils';

export function BrandConceptBlueprint() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);
  const [tokenFormat, setTokenFormat] = React.useState<'css' | 'ts'>('css');

  const handleCopy = async (token: string, label: string) => {
    if (typeof window === 'undefined') return;
    let ok = false;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(token);
        ok = true;
      }
    } catch {
      // Fall through to fallback
    }

    if (!ok) {
      try {
        const textArea = document.createElement('textarea');
        textArea.value = token;
        textArea.style.position = 'fixed';
        textArea.style.top = '0';
        textArea.style.left = '0';
        textArea.style.opacity = '0';
        textArea.setAttribute('readonly', '');
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        ok = true;
      } catch (e) {
        console.error('Copy token failed:', e);
      }
    }

    if (ok) {
      setCopiedToken(label);
      setTimeout(() => setCopiedToken(null), 2000);
    }
  };

  const cssTokens = `:root {
  /* Primary Brand Solids - Pure Flat Colors Only (Zero Gradients, Zero Black/Gray) */
  --brand-royal-blue: #0056FF;   /* rgb(0, 86, 255)    - Primary Brand Base & Core CTAs */
  --brand-azure-blue: #2277FF;   /* rgb(34, 119, 255)  - High-Energy Interactive Accent */
  --brand-soft-lavender: #E3E7FC;/* rgb(227, 231, 252) - Surface Micro-Tint & Badges */
  --brand-ice-tint: #EFF5FF;     /* rgb(239, 245, 255) - Subsurface Micro-Card Fill */
  --brand-white: #FFFFFF;        /* rgb(255, 255, 255) - Clean Document Canvas Base */
  --brand-deep-navy: #0A1A4A;    /* rgb(10, 26, 74)    - High-Contrast Readable Brand Text */
}`;

  const tsTokens = `export const BRAND_TOKENS = {
  royalBlue: '#0056FF',
  azureBlue: '#2277FF',
  softLavender: '#E3E7FC',
  iceTint: '#EFF5FF',
  white: '#FFFFFF',
  deepNavy: '#0A1A4A',
} as const;`;

  // System Color Application Map (Pure Flat Solid Tokens Only)
  const applicationMatrix = [
    {
      name: 'Royal Blue',
      hex: '#0056FF',
      role: 'Primary Brand Base & Core CTAs',
      applied:
        'Primary action buttons, active navigation indicators, key focus rings, primary hyperlinks, and waypoint markers.',
      surface: 'Light Canvas Base',
      contrast: '4.68:1 on White (WCAG AA)',
      colorPreview: '#0056FF',
      textColor: '#FFFFFF',
    },
    {
      name: 'Azure Blue',
      hex: '#2277FF',
      role: 'Illuminated Accents & Hover States',
      applied:
        'Button hover fills, 3D faceted illuminated wing panels, waypoint tick notches, and active tab highlights.',
      surface: 'Interactive Surfaces',
      contrast: '3.12:1 on White (Accent / Display)',
      colorPreview: '#2277FF',
      textColor: '#FFFFFF',
    },
    {
      name: 'Soft Lavender',
      hex: '#E3E7FC',
      role: 'Surface Micro-Tints & Badges',
      applied:
        'Filter tag pill containers, code snippet note callouts, active segment track backgrounds, and subtle card borders.',
      surface: 'Card & Chip Surfaces',
      contrast: '15.2:1 with Royal Blue Text',
      colorPreview: '#E3E7FC',
      textColor: '#0A1A4A',
    },
    {
      name: 'Ice Tint',
      hex: '#EFF5FF',
      role: 'Secondary Card & Segment Fills',
      applied:
        'Quick jump pill buttons, icon badge backgrounds, hover stage backgrounds, and telemetry badge containers.',
      surface: 'Subsurface Layers',
      contrast: '16.5:1 with Royal Blue Text',
      colorPreview: '#EFF5FF',
      textColor: '#0056FF',
      hasBorder: true,
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      role: 'Clean Document Canvas Base',
      applied:
        'Default document canvas background, card foundations, print-ready surfaces, and high-contrast icon strokes.',
      surface: 'Document Root',
      contrast: 'Base Standard (Print Ready)',
      colorPreview: '#FFFFFF',
      textColor: '#0A1A4A',
      hasBorder: true,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Anchor alias for existing toc */}
      <span id="brand-blueprint" className="scroll-mt-24" />

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Brand Colors
          </h2>
        </div>
        <GeometricHeaderStamp codeA="20" titleA="BRAND" codeB="26" titleB="BLUE" />
      </div>

      {/* BENTO GRID: PURE FLAT SOLID BRAND PALETTE (ZERO GRADIENTS, ZERO BLACK/GRAY) */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* 01 Royal Blue (Tall Left Anchor: Spans 5 Columns & Both Rows) */}
        <div
          onClick={() => handleCopy('#0056FF', 'Royal Blue')}
          className="group relative flex min-h-[340px] cursor-pointer flex-col justify-between rounded-2xl bg-[#0056FF] p-6 text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] md:col-span-5 md:row-span-2"
          title="Click to copy HEX: #0056FF"
        >
          {/* Top: Massive Number & Copy Badge */}
          <div className="flex items-start justify-between">
            <span className="font-sans text-6xl font-black tracking-tighter select-none sm:text-7xl">
              01
            </span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleCopy('#0056FF', 'Royal Blue');
              }}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 font-mono text-xs font-semibold text-white backdrop-blur-xs transition-colors hover:bg-white/25"
            >
              {copiedToken === 'Royal Blue' ? (
                <>
                  <Check className="size-3 text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3 text-white/80" />
                  <span>#0056FF</span>
                </>
              )}
            </button>
          </div>

          {/* Bottom: Name & Hex Code */}
          <div className="space-y-0.5 pt-12">
            <h3 className="font-sans text-xl font-extrabold tracking-tight">Royal Blue</h3>
            <p className="font-mono text-xs font-semibold opacity-90">#0056FF</p>
          </div>
        </div>

        {/* Right 2x2 Grid of Solid Tokens (Spans 7 Columns) */}
        {/* 02 Azure Blue */}
        <div
          onClick={() => handleCopy('#2277FF', 'Azure Blue')}
          className="group relative flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl bg-[#2277FF] p-5 text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] sm:col-span-6 md:col-span-3"
          title="Click to copy HEX: #2277FF"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter select-none">
              02
            </span>
            <span className="font-mono text-xs font-bold opacity-90">
              {copiedToken === 'Azure Blue' ? 'Copied!' : '#2277FF'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-sans text-base font-bold">Azure Blue</h4>
            <p className="font-mono text-[11px] opacity-80">Interactive Accent</p>
          </div>
        </div>

        {/* 03 Soft Lavender */}
        <div
          onClick={() => handleCopy('#E3E7FC', 'Soft Lavender')}
          className="group relative flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC] p-5 text-[#0A1A4A] transition-all duration-200 hover:brightness-95 active:scale-[0.99] sm:col-span-6 md:col-span-4"
          title="Click to copy HEX: #E3E7FC"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-[#0A1A4A] select-none">
              03
            </span>
            <span className="font-mono text-xs font-bold text-[#0056FF]">
              {copiedToken === 'Soft Lavender' ? 'Copied!' : '#E3E7FC'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-sans text-base font-bold text-[#0A1A4A]">Soft Lavender</h4>
            <p className="font-mono text-[11px] text-[#0056FF]">Micro-Tint & Badges</p>
          </div>
        </div>

        {/* 04 White */}
        <div
          onClick={() => handleCopy('#FFFFFF', 'White')}
          className="group relative flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border-2 border-[#CAD3F5] bg-white p-5 text-[#0A1A4A] shadow-xs transition-all duration-200 hover:border-[#0056FF] active:scale-[0.99] sm:col-span-6 md:col-span-3"
          title="Click to copy HEX: #FFFFFF"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-[#0A1A4A] select-none">
              04
            </span>
            <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
              {copiedToken === 'White' ? 'Copied!' : '#FFFFFF'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-sans text-base font-bold text-[#0A1A4A]">White</h4>
            <p className="font-mono text-[11px] text-slate-500">Document Canvas Base</p>
          </div>
        </div>

        {/* 05 Ice Tint */}
        <div
          onClick={() => handleCopy('#EFF5FF', 'Ice Tint')}
          className="group relative flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border border-[#D0E1FD] bg-[#EFF5FF] p-5 text-[#0056FF] transition-all duration-200 hover:brightness-95 active:scale-[0.99] sm:col-span-6 md:col-span-4"
          title="Click to copy HEX: #EFF5FF"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-[#0056FF] select-none">
              05
            </span>
            <span className="font-mono text-xs font-bold text-[#0056FF]">
              {copiedToken === 'Ice Tint' ? 'Copied!' : '#EFF5FF'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-sans text-base font-bold text-[#0056FF]">Ice Tint</h4>
            <p className="font-mono text-[11px] text-slate-600">Subsurface Card Fill</p>
          </div>
        </div>
      </div>

      {/* OFFICIAL IDENTITY ASSET: SNP INTERNATIONAL SCHOOL LOGO */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-black tracking-widest text-[#0056FF] uppercase">
              Official Identity Asset
            </span>
            <h3 className="font-sans text-xl font-extrabold text-slate-950 sm:text-2xl">
              SNPI International School Logo
            </h3>
            <p className="max-w-md font-sans text-xs text-slate-600 sm:text-sm">
              The official institutional seal and brand mark for all digital interfaces, print
              certificates, and web portals.
            </p>
          </div>

          {/* Logo Visual Presentation */}
          <div className="flex flex-wrap items-center gap-4">
            {/* White Canvas Preview */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-slate-100 bg-white p-1 shadow-2xs">
                <Image
                  src="/images/logo.png"
                  alt="SNPI International School Logo - Light Canvas"
                  width={56}
                  height={56}
                  className="size-full object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-sans text-xs font-bold text-slate-950">White Canvas</div>
                <div className="font-mono text-[10px] text-slate-500">bg-[#FFFFFF]</div>
              </div>
            </div>

            {/* Soft Lavender Canvas Preview */}
            <div className="flex items-center gap-4 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC] p-3.5 shadow-2xs">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-white/40 bg-white p-1 shadow-2xs">
                <Image
                  src="/images/logo.png"
                  alt="SNPI International School Logo - Soft Lavender Canvas"
                  width={56}
                  height={56}
                  className="size-full object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-sans text-xs font-bold text-[#0A1A4A]">Lavender Canvas</div>
                <div className="font-mono text-[10px] text-[#0056FF]">bg-[#E3E7FC]</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SYSTEM COLOR APPLICATION MATRIX - COMPACT MATHEMATICAL SPECIFICATION TABLE */}
      <div className="overflow-hidden rounded-2xl border border-[#CAD3F5] bg-white shadow-xs">
        {/* Table Header Strip */}
        <div className="flex items-center justify-between border-b border-[#CAD3F5] bg-[#F8FAFC] px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="h-3 w-1 rounded-[1px] bg-[#0056FF]" />
            <h3 className="font-sans text-sm font-bold text-slate-950 sm:text-base">
              System Color Application Matrix
            </h3>
            <span className="rounded-[3px] border border-[#CAD3F5] bg-[#E3E7FC] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0056FF]">
              5 SOLID TOKENS
            </span>
          </div>
          <span className="font-mono text-[10px] font-bold text-slate-500">WCAG AAA / AA</span>
        </div>

        {/* Compact Specification Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-slate-100 bg-[#EFF5FF]/40 text-[10px] font-bold text-slate-500 uppercase">
                <th className="px-4 py-2.5">Token</th>
                <th className="px-4 py-2.5">Role</th>
                <th className="hidden px-4 py-2.5 sm:table-cell">Applied Components</th>
                <th className="px-4 py-2.5">Contrast</th>
                <th className="px-4 py-2.5 text-right">Copy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {applicationMatrix.map((item) => (
                <tr key={item.name} className="transition-colors hover:bg-[#EFF5FF]/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className="size-4 shrink-0 rounded-[3px] border border-[#CAD3F5]"
                        style={{ backgroundColor: item.hex }}
                      />
                      <div>
                        <span className="block font-sans leading-tight font-bold text-slate-900">
                          {item.name}
                        </span>
                        <span className="font-mono text-[10px] text-[#0056FF]">{item.hex}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-[3px] border border-[#CAD3F5] bg-[#E3E7FC] px-1.5 py-0.5 font-mono text-[9px] font-bold whitespace-nowrap text-[#0056FF]">
                      {item.role}
                    </span>
                  </td>
                  <td className="hidden px-4 py-3 font-sans text-xs text-slate-600 sm:table-cell">
                    {item.applied}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[11px] font-bold whitespace-nowrap text-[#0056FF]">
                      {item.contrast}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <LibraryTooltip content={`Copy ${item.hex}`} position="left" delayMs={80}>
                      <button
                        type="button"
                        onClick={() => handleCopy(item.hex, item.name)}
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF] active:scale-95"
                        aria-label={`Copy ${item.name} hex code`}
                      >
                        {copiedToken === item.name ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </LibraryTooltip>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CODE COLOR TOKENS (CSS VARIABLES & TYPESCRIPT TOKENS) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs sm:p-7">
        {/* Card Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-sans text-base font-bold text-slate-950 sm:text-lg">
                Code Color Tokens
              </h4>
              <span className="rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                CSS & TypeScript
              </span>
            </div>
            <p className="mt-0.5 font-sans text-xs text-slate-500">
              Ready-to-use style tokens for stylesheets, theme configs, and application components.
            </p>
          </div>

          {/* Controls: Segment Tabs & Compact Differentiated Icon Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Format Switcher Tabs */}
            <div className="flex items-center rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-1">
              <button
                type="button"
                onClick={() => setTokenFormat('css')}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-all',
                  tokenFormat === 'css'
                    ? 'bg-white text-[#0056FF] shadow-2xs'
                    : 'text-slate-600 hover:text-[#0056FF]',
                )}
              >
                CSS Variables
              </button>
              <button
                type="button"
                onClick={() => setTokenFormat('ts')}
                className={cn(
                  'cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-all',
                  tokenFormat === 'ts'
                    ? 'bg-white text-[#0056FF] shadow-2xs'
                    : 'text-slate-600 hover:text-[#0056FF]',
                )}
              >
                TypeScript
              </button>
            </div>

            {/* Differentiated Icon Buttons */}
            <div className="flex items-center gap-1.5">
              {/* Copy CSS Variables Icon Button */}
              <LibraryTooltip content="Copy CSS Variables" position="top" delayMs={80}>
                <button
                  type="button"
                  onClick={() => handleCopy(cssTokens, 'css-tokens')}
                  className={cn(
                    'group relative flex size-8.5 cursor-pointer items-center justify-center rounded-lg border transition-all duration-200 active:scale-95',
                    copiedToken === 'css-tokens'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-slate-300/80 bg-white text-slate-700 hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                  )}
                  aria-label="Copy CSS Variables"
                >
                  {copiedToken === 'css-tokens' ? (
                    <Check className="size-4 stroke-[2.5] text-emerald-600" />
                  ) : (
                    <Copy className="size-4 stroke-[2] transition-transform group-hover:scale-110" />
                  )}
                </button>
              </LibraryTooltip>

              {/* Copy TypeScript Contract Icon Button */}
              <LibraryTooltip content="Copy TS Contract" position="top" delayMs={80}>
                <button
                  type="button"
                  onClick={() => handleCopy(tsTokens, 'ts-tokens')}
                  className={cn(
                    'group relative flex size-8.5 cursor-pointer items-center justify-center rounded-lg border transition-all duration-200 active:scale-95',
                    copiedToken === 'ts-tokens'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-600'
                      : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF] hover:border-[#0056FF] hover:bg-[#0056FF] hover:text-white',
                  )}
                  aria-label="Copy TypeScript Contract"
                >
                  {copiedToken === 'ts-tokens' ? (
                    <Check className="size-4 stroke-[2.5] text-emerald-600" />
                  ) : (
                    <Code className="size-4 stroke-[2] transition-transform group-hover:scale-110" />
                  )}
                </button>
              </LibraryTooltip>
            </div>
          </div>
        </div>

        {/* Interactive Code Box Frame */}
        <div className="mt-4 overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#F8FAFC]">
          {/* Frame Sub-header Bar */}
          <div className="flex items-center justify-between border-b border-[#CAD3F5]/80 bg-[#EFF5FF]/80 px-4 py-2 font-mono text-[11px]">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0056FF]">
                {tokenFormat === 'css' ? 'tokens.css' : 'tokens.ts'}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500">
                {tokenFormat === 'css'
                  ? '6 Solid Custom Properties'
                  : 'Immutable TypeScript Object'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0056FF]">
                {tokenFormat === 'css' ? 'UTF-8' : 'ES6 / TS'}
              </span>
            </div>
          </div>

          {/* Code Content with Live Inline Swatches & Syntax Highlighting */}
          <div className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
            {tokenFormat === 'css' ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                    1
                  </span>
                  <span>
                    <strong className="text-[#0A1A4A]">:root</strong> &#123;
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                    2
                  </span>
                  <span className="font-mono text-[11px] text-slate-400 italic">
                    {`/* Primary Brand Solids - Pure Flat Colors Only */`}
                  </span>
                </div>
                {applicationMatrix.map((item, idx) => (
                  <div
                    key={item.name}
                    className="group flex flex-wrap items-center gap-2 rounded px-1.5 py-0.5 transition-colors hover:bg-[#EFF5FF]"
                  >
                    <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                      {idx + 3}
                    </span>
                    <span className="font-bold text-[#0056FF]">
                      --brand-{item.name.toLowerCase().replace(/\s+/g, '-')}:
                    </span>
                    <span className="flex items-center gap-1.5 font-bold text-[#0A1A4A]">
                      <span
                        className="size-3 shrink-0 rounded-[2px] border border-[#CAD3F5]"
                        style={{ backgroundColor: item.hex }}
                      />
                      {item.hex};
                    </span>
                    <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
                      {`/* ${item.role} */`}
                    </span>
                  </div>
                ))}
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                    {applicationMatrix.length + 3}
                  </span>
                  <span>&#125;</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                    1
                  </span>
                  <span>
                    <strong className="text-[#0056FF]">export const</strong>{' '}
                    <strong className="text-[#0A1A4A]">BRAND_TOKENS</strong> = &#123;
                  </span>
                </div>
                {applicationMatrix.map((item, idx) => {
                  const key = item.name
                    .replace(/\s+(.)/g, (_, c) => c.toUpperCase())
                    .replace(/^[A-Z]/, (c) => c.toLowerCase());
                  return (
                    <div
                      key={item.name}
                      className="group flex flex-wrap items-center gap-2 rounded px-1.5 py-0.5 transition-colors hover:bg-[#EFF5FF]"
                    >
                      <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                        {idx + 2}
                      </span>
                      <span className="font-bold text-[#0A1A4A]">{key}:</span>
                      <span className="flex items-center gap-1.5 font-bold text-[#0056FF]">
                        <span
                          className="size-3 shrink-0 rounded-[2px] border border-[#CAD3F5]"
                          style={{ backgroundColor: item.hex }}
                        />
                        &apos;{item.hex}&apos;,
                      </span>
                      <span className="hidden font-mono text-[11px] text-slate-400 sm:inline">
                        {`// ${item.role}`}
                      </span>
                    </div>
                  );
                })}
                <div className="flex items-center gap-2 text-slate-400">
                  <span className="w-5 shrink-0 text-right font-mono text-[11px] text-slate-300 select-none">
                    {applicationMatrix.length + 2}
                  </span>
                  <span>
                    &#125; <strong className="text-[#0056FF]">as const</strong>;
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
