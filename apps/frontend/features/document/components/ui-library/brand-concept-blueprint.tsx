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
      rule: 'Enforce Pure Flat Solid Colors (Zero Gradients)',
      desc: 'All surfaces, fills, and borders must be clean, solid colors. Never apply linear or radial gradients.',
    },
    {
      rule: 'Layer Azure Blue (#2277FF) for Mathematical Depth',
      desc: 'Combine Azure Blue with Royal Blue across 3D faceted geometry (such as paper jet wings) to achieve luminous depth without blur shadows.',
    },
    {
      rule: 'Use Soft Lavender (#E3E7FC) & Ice Tint (#EFF5FF) for Cards',
      desc: 'Apply Soft Lavender and Ice Tint to status badge pills, filter chips, and code callout boxes for clean, non-distracting visual grouping.',
    },
    {
      rule: 'Strictly Enforce WCAG AA/AAA Contrast Ratios',
      desc: 'Verify a minimum 4.5:1 contrast ratio for body text and 3:1 for large headers using Deep Brand Navy (#0A1A4A) on light surfaces.',
    },
  ];

  const donts = [
    {
      rule: 'Never Use Color Gradients in Component Designs',
      desc: 'Never apply CSS gradients (bg-gradient-to-*, linear-gradient) to UI components, banners, or document sections.',
    },
    {
      rule: 'Never Use Solid Black (#000000) or Drab Gray in Component Designs',
      desc: 'Never use solid black or dark drab gray to design components, cards, or backgrounds. Keep all interfaces light, clean, and brand-aligned.',
    },
    {
      rule: 'Never Introduce Unverified Third-Party Neons',
      desc: 'Strictly avoid random neon purples, discordant pinks, or off-palette blues outside the official brand palette.',
    },
    {
      rule: 'Never Use Dropped Blur Shadows (Zero-Shadow Rule)',
      desc: 'Never use fuzzy box-shadows (e.g. shadow-lg, shadow-2xl). Establish spatial depth strictly through 1px border contrast and luminance.',
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

      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-sans text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
            Brand Colors
          </h2>
          <p className="mt-1 font-sans text-xs text-slate-500 sm:text-sm">
            Royal Blue primary base, Azure Blue, Soft Lavender, and Pure White flat solid tokens
            (Zero Gradients, Zero Black/Gray).
          </p>
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
          className="group relative flex min-h-[160px] cursor-pointer flex-col justify-between rounded-2xl border border-slate-200/90 bg-white p-5 text-slate-950 transition-all duration-200 hover:bg-slate-50 active:scale-[0.99] sm:col-span-6 md:col-span-3"
          title="Click to copy HEX: #FFFFFF"
        >
          <div className="flex items-start justify-between">
            <span className="font-sans text-4xl font-extrabold tracking-tighter text-slate-950 select-none">
              04
            </span>
            <span className="font-mono text-xs font-bold text-slate-400">
              {copiedToken === 'White' ? 'Copied!' : '#FFFFFF'}
            </span>
          </div>
          <div className="space-y-0.5">
            <h4 className="font-sans text-base font-bold text-slate-950">White</h4>
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
              SNP International School Logo
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
                  alt="SNP International School Logo - Light Canvas"
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
                  alt="SNP International School Logo - Soft Lavender Canvas"
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
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4 text-[#0056FF]">
          <pre className="font-mono text-xs leading-relaxed text-[#0056FF]">
            <code>{cssTokens}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
