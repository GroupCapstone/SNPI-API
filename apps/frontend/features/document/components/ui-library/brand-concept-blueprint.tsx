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
      rule: 'Enforce High-Contrast Deep Navy Typography (#0A1A4A)',
      desc: 'All body text, table cells, and labels on white or ice tint must strictly use Deep Navy (#0A1A4A) or Slate-900 (#0F172A) with WCAG AAA (>= 7:1) contrast ratio.',
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
  ];

  const donts = [
    {
      rule: 'Never Use Muddy Gray, Slate Containers, or Blur Styles',
      desc: 'Under no circumstances should components use muddy gray (#64748B, #475569), dark slate containers, black buttons (bg-slate-900), or blur backgrounds.',
    },
    {
      rule: 'Never Use Washed-Out, Pale Gray, or Hidden Text',
      desc: 'Never render faint washed-out gray text (text-slate-300, text-slate-400, or #CAD3F5 text on white) that hides information or fails WCAG readability.',
    },
    {
      rule: 'Never Use Color Gradients in Component Designs',
      desc: 'Never apply CSS gradients (bg-gradient-to-*, linear-gradient) to UI components, banners, or document sections.',
    },
    {
      rule: 'Never Use Solid Black (#000000) for Cards or Buttons',
      desc: 'Never use solid black (#000000, bg-black, bg-slate-900) for button fills, badges, or containers. Maintain clean light-day brand colors.',
    },
    {
      rule: 'Never Use Dropped Blur Shadows (Zero-Shadow Rule)',
      desc: 'Never use fuzzy box-shadows (e.g. shadow-lg, shadow-2xl). Establish spatial depth strictly through 1px border contrast (#CAD3F5) and luminance.',
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
      <div className="rounded-2xl border border-[#CAD3F5] bg-white p-6 shadow-xs sm:p-7">
        <div className="mb-6 flex flex-col gap-1 border-b border-[#CAD3F5]/60 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="size-2.5 rounded-[2px] bg-[#0056FF]" />
            <h3 className="font-sans text-lg font-black tracking-tight text-slate-950">
              System Color Application Matrix
            </h3>
          </div>
          <p className="font-sans text-xs font-medium text-slate-600">
            Authoritative token mappings across user interface components, interactive states, and
            surfaces.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {applicationMatrix.map((item) => (
            <div
              key={item.name}
              className={cn(
                'flex flex-col justify-between rounded-xl border p-5 transition-all',
                item.name === 'White'
                  ? 'border-2 border-[#CAD3F5] bg-white shadow-xs hover:border-[#0056FF] md:col-span-2'
                  : item.name === 'Soft Lavender'
                    ? 'border border-[#CAD3F5] bg-[#E3E7FC]/40 hover:border-[#0056FF]'
                    : item.name === 'Ice Tint'
                      ? 'border border-[#CAD3F5] bg-[#EFF5FF]/70 hover:border-[#0056FF]'
                      : 'border border-[#CAD3F5] bg-white shadow-xs hover:border-[#0056FF]',
              )}
            >
              <div>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    {/* Color Swatch */}
                    <div
                      className={cn(
                        'flex size-7 shrink-0 items-center justify-center rounded-lg shadow-xs',
                        item.name === 'White'
                          ? 'border-2 border-[#CAD3F5] bg-white ring-2 ring-[#CAD3F5]/30'
                          : 'border border-[#CAD3F5]',
                      )}
                      style={{ background: item.colorPreview }}
                    />
                    <div>
                      <h4 className="font-sans text-sm font-black text-[#0A1A4A]">{item.name}</h4>
                      <span className="font-mono text-[11px] font-bold text-slate-500">
                        {item.surface}
                      </span>
                    </div>
                  </div>
                  <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                    {item.hex}
                  </span>
                </div>

                <div className="mt-3.5 space-y-2">
                  <span
                    className={cn(
                      'inline-block rounded-md border px-2.5 py-0.5 font-mono text-[10px] font-bold tracking-wider uppercase',
                      item.name === 'Royal Blue'
                        ? 'border-[#0056FF] bg-[#0056FF] text-white'
                        : item.name === 'Azure Blue'
                          ? 'border-[#2277FF] bg-[#2277FF] text-white'
                          : 'border-[#CAD3F5] bg-[#EFF5FF] text-[#0056FF]',
                    )}
                  >
                    {item.role}
                  </span>
                  <p className="font-sans text-xs leading-relaxed text-slate-700">{item.applied}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#CAD3F5]/60 pt-2.5 font-mono text-[10px] text-slate-500">
                <span className="font-bold text-slate-600">SURFACE: {item.surface}</span>
                <span className="font-bold text-[#0056FF]">{item.contrast}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BRAND COLOR DO'S AND DON'TS ("AD DO DONT") */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* DO PANEL */}
        <div className="rounded-2xl border border-emerald-300 bg-[#ECFDF5] p-6 shadow-xs">
          <div className="mb-4 flex items-center gap-2 border-b border-emerald-200 pb-3">
            <div className="flex size-5 items-center justify-center rounded-[3px] bg-emerald-700 text-white">
              <Check className="size-3.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-black text-emerald-950">
                Brand Color Best Practices (DO)
              </h3>
              <p className="font-sans text-xs font-semibold text-emerald-800">
                Approved conventions for colors and elevations.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {dos.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-emerald-200 font-mono text-[10px] font-black text-emerald-900">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">{item.rule}</h4>
                  <p className="font-sans text-xs leading-relaxed text-[#334155]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DON'T PANEL */}
        <div className="rounded-2xl border border-rose-300 bg-[#FFF1F2] p-6 shadow-xs">
          <div className="mb-4 flex items-center gap-2 border-b border-rose-200 pb-3">
            <div className="flex size-5 items-center justify-center rounded-[3px] bg-rose-700 text-white">
              <X className="size-3.5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-sans text-sm font-black text-rose-950">
                Prohibited Anti-Patterns (DON&apos;T)
              </h3>
              <p className="font-sans text-xs font-semibold text-rose-800">
                Strict workspace and brand design restrictions.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {donts.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5">
                <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-[3px] bg-rose-200 font-mono text-[10px] font-black text-rose-900">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-sans text-xs font-bold text-[#0A1A4A]">{item.rule}</h4>
                  <p className="font-sans text-xs leading-relaxed text-[#334155]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CODE COLOR TOKENS (CSS VARIABLES & TYPESCRIPT TOKENS) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="font-sans text-base font-bold text-slate-950">
              Code Color Tokens (CSS Variables & TypeScript)
            </h4>
            <p className="font-sans text-xs text-slate-500">
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
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-[4px] border border-slate-200 bg-slate-100 px-3 py-1.5 font-sans text-xs font-bold text-slate-800 transition-all select-none hover:bg-slate-200"
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
        <div className="mt-4 overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#F8FAFC] p-4 text-[#0056FF]">
          <pre className="font-mono text-xs leading-relaxed text-[#0056FF]">
            <code>{cssTokens}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
