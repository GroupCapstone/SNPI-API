'use client';

import * as React from 'react';
import Image from 'next/image';
import { Copy, Check, X } from '@/components/icons';
import { GeometricHeaderStamp } from './geometric-tag-primitives';
import { cn } from '@/lib/utils';

export function BrandConceptBlueprint() {
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const handleCopy = (token: string, label: string) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(token);
    }
    setCopiedToken(label);
    setTimeout(() => setCopiedToken(null), 2000);
  };

  const cssTokens = `:root {
  /* Primary Brand Solids */
  --brand-royal-blue: #0056FF;   /* rgb(0, 86, 255)   - Primary Brand Base & CTA */
  --brand-azure-blue: #2277FF;   /* rgb(34, 119, 255) - High-Energy Interactive Accent */
  --brand-black: #000000;        /* rgb(0, 0, 0)      - High-Contrast Depth & Dark Canvas */
  --brand-soft-lavender: #E3E7FC;/* rgb(227, 231, 252)- Surface Micro-Tint & Badges */
  --brand-white: #FFFFFF;        /* rgb(255, 255, 255)- Clean Document Canvas Base */

  /* Signature Brand Gradients */
  --brand-gradient-futurewave: linear-gradient(135deg, #2277FF 0%, #AEC2FF 100%);
  --brand-gradient-midnight-surge: linear-gradient(135deg, #000B26 0%, #0056FF 100%);
}`;

  const tsTokens = `export const BRAND_TOKENS = {
  royalBlue: '#0056FF',
  azureBlue: '#2277FF',
  black: '#000000',
  softLavender: '#E3E7FC',
  white: '#FFFFFF',
  gradients: {
    futurewave: 'linear-gradient(135deg, #2277FF 0%, #AEC2FF 100%)',
    midnightSurge: 'linear-gradient(135deg, #000B26 0%, #0056FF 100%)',
  },
} as const;`;

  // System Color Application Map
  const applicationMatrix = [
    {
      name: 'Royal Blue',
      hex: '#0056FF',
      role: 'Primary Brand Base & CTAs',
      applied:
        'Primary action buttons, active navigation indicators, key focus rings, primary hyperlinks, and flight contrail paths.',
      surface: 'Light & Dark Canvas',
      contrast: '4.68:1 on White (WCAG AA)',
      colorPreview: '#0056FF',
      textColor: '#FFFFFF',
    },
    {
      name: 'Azure Blue',
      hex: '#2277FF',
      role: 'Illuminated Accents & Hover States',
      applied:
        'Button hover fills, 3D faceted illuminated wing panels, waypoint tick notches, and gradient start stops.',
      surface: 'Light & Dark Canvas',
      contrast: '3.12:1 on White (Accent / Display)',
      colorPreview: '#2277FF',
      textColor: '#FFFFFF',
    },
    {
      name: 'Black',
      hex: '#000000',
      role: 'High-Contrast Depth & Headings',
      applied:
        'Primary typography in light mode (text-slate-950), terminal code consoles, dark mode card foundations, and deep contrast borders.',
      surface: 'Light & Dark Canvas',
      contrast: '21:1 on White (WCAG AAA)',
      colorPreview: '#000000',
      textColor: '#FFFFFF',
    },
    {
      name: 'Soft Lavender',
      hex: '#E3E7FC',
      role: 'Surface Micro-Tints & Badges',
      applied:
        'Filter tag pill containers, code snippet note callouts, active segment track backgrounds, and subtle hover overlays.',
      surface: 'Light Canvas',
      contrast: '15.2:1 with Royal Blue Text',
      colorPreview: '#E3E7FC',
      textColor: '#000B26',
    },
    {
      name: 'White',
      hex: '#FFFFFF',
      role: 'Clean Document Canvas Base',
      applied:
        'Default document canvas background, high-contrast typography in dark mode, origami jet spine creases, and card highlights.',
      surface: 'Document Root',
      contrast: 'Base Standard (Print Ready)',
      colorPreview: '#FFFFFF',
      textColor: '#000000',
      hasBorder: true,
    },
    {
      name: 'Gradient 1: Futurewave',
      hex: '#2277FF -> #AEC2FF',
      role: 'Kinetic Visual Beams & Spotlight Headers',
      applied:
        'Feature spotlight hero cards, interactive border beams, dynamic progress rails, and documentation banner motifs.',
      surface: 'Spotlight Sections',
      contrast: 'Vibrant Light Energy',
      colorPreview: 'linear-gradient(135deg, #2277FF 0%, #AEC2FF 100%)',
      textColor: '#FFFFFF',
      isGradient: true,
    },
    {
      name: 'Gradient 2: Midnight Surge',
      hex: '#000B26 -> #0056FF',
      role: 'Aerospace Mecha HUD & Terminal Surfaces',
      applied:
        'Cyber Armor navigation rails, dark mode code console backdrops, flight telemetry decks, and sticky header backdrops.',
      surface: 'HUD & Terminal Panels',
      contrast: 'Deep Cosmic Luminescence',
      colorPreview: 'linear-gradient(135deg, #000B26 0%, #0056FF 100%)',
      textColor: '#FFFFFF',
      isGradient: true,
    },
  ];

  // Brand Color Do's & Don'ts
  const dos = [
    {
      rule: 'Use Royal Blue (#0056FF) as Primary Anchor',
      desc: 'Anchor all primary call-to-action buttons, active navigation segments, and key interactive landmarks with Royal Blue.',
    },
    {
      rule: 'Default Main Canvas to White (#FFFFFF)',
      desc: 'Maintain pure white (#FFFFFF) as the default document canvas for maximum readability, clean printing, and accessibility.',
    },
    {
      rule: 'Layer Azure Blue (#2277FF) for Mathematical Depth',
      desc: 'Combine Azure Blue with Royal Blue across 3D faceted geometry (such as paper jet wings) to achieve luminous depth without blur shadows.',
    },
    {
      rule: 'Use Soft Lavender (#E3E7FC) for Micro-Containers',
      desc: 'Apply Soft Lavender to status badge pills, filter chips, and code callout boxes for clean, non-distracting visual grouping.',
    },
    {
      rule: 'Use Midnight Surge (#000B26 -> #0056FF) for HUDs',
      desc: 'Deploy Midnight Surge for Cyber Armor navigation consoles, technical code boxes, and aerospace telemetry decks.',
    },
    {
      rule: 'Strictly Enforce WCAG AA/AAA Contrast Ratios',
      desc: 'Verify a minimum 4.5:1 contrast ratio for body text and 3:1 for large headers before finalizing any UI component.',
    },
  ];

  const donts = [
    {
      rule: 'Never Use Solid Black (#000000) as Full Canvas',
      desc: 'Never set the entire page or document canvas background to solid black unless explicitly requested by the user.',
    },
    {
      rule: 'Never Introduce Unverified Third-Party Neons',
      desc: 'Strictly avoid random neon purples, discordant pinks, or off-palette blues outside the 7 approved brand tokens.',
    },
    {
      rule: 'Never Use Dropped Blur Shadows (Zero-Shadow Rule)',
      desc: 'Never use fuzzy box-shadows (e.g. shadow-lg, shadow-2xl). Establish spatial depth strictly through 1px border contrast and luminance.',
    },
    {
      rule: 'Never Place Low-Contrast Text on Soft Lavender',
      desc: 'Never use light gray text (#94A3B8) on Soft Lavender (#E3E7FC) or dark text on Midnight Surge. Always maintain crisp legibility.',
    },
    {
      rule: 'Never Bake Colors into Flat Raster Pixels',
      desc: 'Never deliver flat flattened pixel layers as design sources. Keep all UI shapes as live vector SVG paths and CSS tokens.',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Anchor alias for existing toc */}
      <span id="brand-blueprint" className="scroll-mt-24" />

      {/* HEADER SECTION (Matches User Attachment Exact Style) */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-950 sm:text-2xl dark:text-white">
            Brand Colors & Gradients
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm dark:text-slate-400">
            Royal Blue primary base, futurewave gradients, and Sora typography.
          </p>
        </div>
        <GeometricHeaderStamp codeA="20" titleA="BRAND" codeB="26" titleB="BLUE" />
      </div>

      {/* BENTO GRID: EXACT 1:1 REPLICATION OF USER ATTACHMENT */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
        {/* 01 Royal Blue (Tall Left Card: Spans 4 Columns & All 4 Rows) */}
        <div
          onClick={() => handleCopy('#0056FF', 'Royal Blue')}
          className="group relative flex min-h-[380px] cursor-pointer flex-col justify-between rounded-2xl bg-[#0056FF] p-6 text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] md:col-span-4 md:row-span-4"
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

        {/* 02 Azure Blue (Row 1, Middle) */}
        <div
          onClick={() => handleCopy('#2277FF', 'Azure Blue')}
          className="group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl bg-[#2277FF] p-5 text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] sm:col-span-6 md:col-span-4"
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
          <h4 className="font-sans text-base font-bold">Azure Blue</h4>
        </div>

        {/* 03 Black (Row 1, Right) */}
        <div
          onClick={() => handleCopy('#000000', 'Black')}
          className="group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl bg-[#000000] p-5 text-white transition-all duration-200 hover:brightness-125 active:scale-[0.99] sm:col-span-6 md:col-span-4"
          title="Click to copy HEX: #000000"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter select-none">
              03
            </span>
            <span className="font-mono text-xs font-bold opacity-90">
              {copiedToken === 'Black' ? 'Copied!' : '#000000'}
            </span>
          </div>
          <h4 className="font-sans text-base font-bold">Black</h4>
        </div>

        {/* 04 Soft Lavender (Row 2, Middle) */}
        <div
          onClick={() => handleCopy('#E3E7FC', 'Soft Lavender')}
          className="group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl bg-[#E3E7FC] p-5 text-[#000B26] transition-all duration-200 hover:brightness-95 active:scale-[0.99] sm:col-span-6 md:col-span-4"
          title="Click to copy HEX: #E3E7FC"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-slate-950 select-none">
              04
            </span>
            <span className="font-mono text-xs font-bold text-slate-700">
              {copiedToken === 'Soft Lavender' ? 'Copied!' : '#E3E7FC'}
            </span>
          </div>
          <h4 className="font-sans text-base font-bold text-slate-950">Soft Lavender</h4>
        </div>

        {/* 05 White (Row 2, Right) */}
        <div
          onClick={() => handleCopy('#FFFFFF', 'White')}
          className="group relative flex min-h-[140px] cursor-pointer flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-slate-950 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] sm:col-span-6 md:col-span-4 dark:border-slate-800"
          title="Click to copy HEX: #FFFFFF"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-slate-950 select-none">
              05
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
              {copiedToken === 'White' ? 'Copied!' : '#FFFFFF'}
            </span>
          </div>
          <h4 className="font-sans text-base font-bold text-slate-950">White</h4>
        </div>

        {/* Gradient 1: Futurewave (Row 3, Spans 8 Columns) */}
        <div
          onClick={() =>
            handleCopy('linear-gradient(135deg, #2277FF 0%, #AEC2FF 100%)', 'Futurewave')
          }
          className="group relative flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl bg-gradient-to-r from-[#2277FF] to-[#AEC2FF] p-5 text-white transition-all duration-200 hover:brightness-105 active:scale-[0.99] md:col-span-8"
          title="Click to copy CSS: linear-gradient(135deg, #2277FF 0%, #AEC2FF 100%)"
        >
          <div className="flex items-start justify-between">
            <h4 className="font-sans text-base font-bold text-white sm:text-lg">Gradient 1</h4>
            <span className="font-mono text-xs font-bold text-white/95">
              {copiedToken === 'Futurewave' ? 'Copied CSS!' : '#2277FF → #AEC2FF'}
            </span>
          </div>
          <p className="font-sans text-sm font-semibold text-white sm:text-base">Futurewave</p>
        </div>

        {/* GRADIENT 2: Midnight Surge (Row 4, Spans 8 Columns) */}
        <div
          onClick={() =>
            handleCopy('linear-gradient(135deg, #000B26 0%, #0056FF 100%)', 'Midnight Surge')
          }
          className="group relative flex min-h-[110px] cursor-pointer flex-col justify-between rounded-2xl bg-gradient-to-r from-[#000B26] to-[#0056FF] p-5 text-white transition-all duration-200 hover:brightness-110 active:scale-[0.99] md:col-span-8"
          title="Click to copy CSS: linear-gradient(135deg, #000B26 0%, #0056FF 100%)"
        >
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs font-bold tracking-wider text-white/80 uppercase">
              GRADIENT 2
            </span>
            <span className="font-mono text-xs font-bold text-white/95">
              {copiedToken === 'Midnight Surge' ? 'Copied CSS!' : '#000B26 → #0056FF'}
            </span>
          </div>
          <h4 className="font-sans text-base font-bold text-white">Midnight Surge</h4>
        </div>
      </div>

      {/* OFFICIAL IDENTITY ASSET: SNP INTERNATIONAL SCHOOL LOGO */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1.5">
            <span className="font-mono text-xs font-black tracking-widest text-[#0056FF] uppercase">
              Official Identity Asset
            </span>
            <h3 className="font-sans text-xl font-extrabold text-slate-950 sm:text-2xl dark:text-white">
              SNP International School Logo
            </h3>
            <p className="max-w-md font-sans text-xs text-slate-600 sm:text-sm dark:text-slate-400">
              The official institutional seal and brand mark for all digital interfaces, print
              certificates, and web portals.
            </p>
          </div>

          {/* Logo Previews (Light Canvas & Dark Canvas) */}
          <div className="flex flex-wrap items-center gap-4">
            {/* Light Mode Preview */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs dark:border-slate-800 dark:bg-slate-950">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-slate-200 bg-white p-1 shadow-2xs dark:border-slate-700">
                <Image
                  src="/images/logo.png"
                  alt="SNP International School Logo - Light Canvas"
                  width={56}
                  height={56}
                  className="size-full object-contain"
                  priority
                />
              </div>
              <div className="space-y-0.5">
                <div className="font-sans text-xs font-bold text-slate-950 dark:text-white">
                  Light Canvas
                </div>
                <div className="font-mono text-[10px] text-slate-500">bg-[#FFFFFF]</div>
              </div>
            </div>

            {/* Dark Mode Preview */}
            <div className="flex items-center gap-4 rounded-xl border border-slate-800 bg-[#000B26] p-3.5 text-white shadow-2xs">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-full border border-white/20 bg-white p-1 shadow-2xs">
                <Image
                  src="/images/logo.png"
                  alt="SNP International School Logo - Dark Canvas"
                  width={56}
                  height={56}
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

      {/* SYSTEM COLOR APPLICATION MATRIX ("EVERY PLACE NEED THAT COLOR") */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="mb-5 flex flex-col gap-1 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-[1px] bg-[#0056FF]" />
            <h3 className="font-sans text-base font-bold text-slate-950 dark:text-white">
              System Color Application Matrix
            </h3>
          </div>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
            Authoritative token mappings across user interface components, interactive states, and
            surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2">
          {applicationMatrix.map((item) => (
            <div
              key={item.name}
              className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 p-4 transition-all hover:border-[#0056FF]/40 hover:bg-white dark:border-slate-800 dark:bg-slate-900/60 dark:hover:bg-slate-900"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* Color Swatch */}
                    <div
                      className={cn(
                        'size-5 shrink-0 rounded-[3px]',
                        item.hasBorder && 'border border-slate-300 dark:border-slate-600',
                      )}
                      style={{ background: item.colorPreview }}
                    />
                    <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white">
                      {item.name}
                    </h4>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {item.hex}
                  </span>
                </div>

                <div className="mt-2.5">
                  <span className="rounded-[3px] bg-white px-2 py-0.5 font-mono text-[9px] font-bold text-[#0056FF] ring-1 ring-slate-200 dark:bg-slate-800 dark:text-blue-300 dark:ring-slate-700">
                    {item.role}
                  </span>
                  <p className="mt-2 font-sans text-[11px] leading-relaxed text-slate-600 dark:text-slate-300">
                    {item.applied}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between border-t border-slate-200/60 pt-2 font-mono text-[9px] text-slate-500 dark:border-slate-800">
                <span>SURFACE: {item.surface}</span>
                <span>{item.contrast}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND COLOR DO'S AND DON'TS ("AD DO DONT") */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* DO PANEL */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-6 dark:border-emerald-950/60 dark:bg-emerald-950/10">
          <div className="mb-4 flex items-center gap-2 border-b border-emerald-200/60 pb-3 dark:border-emerald-900/40">
            <div className="flex size-5 items-center justify-center rounded-[3px] bg-emerald-600 text-white">
              <Check className="size-3.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-emerald-950 dark:text-emerald-200">
                Brand Color Best Practices (DO)
              </h3>
              <p className="font-sans text-[11px] text-emerald-700 dark:text-emerald-400">
                Approved conventions for colors and elevations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {dos.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-[2px] bg-emerald-600/15 font-mono text-[9px] font-bold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.rule}
                  </h4>
                  <p className="font-sans text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DON'T PANEL */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-6 dark:border-rose-950/60 dark:bg-rose-950/10">
          <div className="mb-4 flex items-center gap-2 border-b border-rose-200/60 pb-3 dark:border-rose-900/40">
            <div className="flex size-5 items-center justify-center rounded-[3px] bg-rose-600 text-white">
              <X className="size-3.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-bold text-rose-950 dark:text-rose-200">
                Prohibited Anti-Patterns (DON'T)
              </h3>
              <p className="font-sans text-[11px] text-rose-700 dark:text-rose-400">
                Strict workspace and brand design restrictions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {donts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-1 flex size-3.5 shrink-0 items-center justify-center rounded-[2px] bg-rose-600/15 font-mono text-[9px] font-bold text-rose-700 dark:bg-rose-900/40 dark:text-rose-300">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-slate-100">
                    {item.rule}
                  </h4>
                  <p className="font-sans text-[11px] leading-relaxed text-slate-600 dark:text-slate-400">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CODE COLOR TOKENS (CSS VARIABLES & TYPESCRIPT TOKENS) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7 dark:border-slate-800 dark:bg-slate-900/50">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-sans text-base font-bold text-slate-950 dark:text-white">
              Code Color Tokens (CSS Variables & TypeScript)
            </h4>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Ready-to-use style tokens for stylesheets, theme configs, and application components.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleCopy(cssTokens, 'css-tokens')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] bg-[#0056FF] px-3 py-1.5 font-sans text-xs font-bold text-white transition-all select-none hover:bg-blue-700"
            >
              {copiedToken === 'css-tokens' ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copied CSS!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy CSS Variables</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => handleCopy(tsTokens, 'ts-tokens')}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-slate-200 bg-slate-100 px-3 py-1.5 font-sans text-xs font-bold text-slate-800 transition-all select-none hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
            >
              {copiedToken === 'ts-tokens' ? (
                <>
                  <Check className="size-3.5" />
                  <span>Copied TS!</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>Copy TS Contract</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* CSS Code Box */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-800 bg-[#000B26] p-4 text-white">
          <pre className="font-mono text-xs leading-relaxed text-[#AEC2FF]">
            <code>{cssTokens}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
