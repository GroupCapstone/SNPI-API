'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  X,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  Sliders,
  Layers,
  Eye,
  ArrowRight,
} from '@/components/icons';

// ============================================================================
// WCAG 2.1 RELATIVE LUMINANCE & CONTRAST RATIO MATHEMATICAL ALGORITHM
// ============================================================================

/**
 * Converts a hex string (#RRGGBB or #RGB) into normalized [r, g, b] in [0, 1].
 */
export function hexToRgb(hex: string): [number, number, number] | null {
  const cleanHex = hex.trim().replace(/^#/, '');
  let r = 0;
  let g = 0;
  let b = 0;

  if (cleanHex.length === 3) {
    r = parseInt(cleanHex[0] + cleanHex[0], 16);
    g = parseInt(cleanHex[1] + cleanHex[1], 16);
    b = parseInt(cleanHex[2] + cleanHex[2], 16);
  } else if (cleanHex.length === 6) {
    r = parseInt(cleanHex.substring(0, 2), 16);
    g = parseInt(cleanHex.substring(2, 4), 16);
    b = parseInt(cleanHex.substring(4, 6), 16);
  } else {
    return null;
  }

  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return [r / 255, g / 255, b / 255];
}

/**
 * Calculates WCAG 2.1 relative luminance for an sRGB component.
 * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
 */
export function getChannelLuminance(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
}

export function getRelativeLuminance(r: number, g: number, b: number): number {
  const rL = getChannelLuminance(r);
  const gL = getChannelLuminance(g);
  const bL = getChannelLuminance(b);
  return 0.2126 * rL + 0.7152 * gL + 0.0722 * bL;
}

/**
 * Calculates WCAG 2.1 Contrast Ratio: (L1 + 0.05) / (L2 + 0.05)
 * Returns ratio number (e.g. 21.00)
 */
export function calculateContrastRatio(colorHex1: string, colorHex2: string): number {
  const rgb1 = hexToRgb(colorHex1);
  const rgb2 = hexToRgb(colorHex2);

  if (!rgb1 || !rgb2) return 1.0;

  const l1 = getRelativeLuminance(...rgb1);
  const l2 = getRelativeLuminance(...rgb2);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  const ratio = (lighter + 0.05) / (darker + 0.05);
  return Math.round(ratio * 100) / 100;
}

// ============================================================================
// COLOR CONTRAST CHECKER COMPONENT
// ============================================================================

export interface ColorContrastCheckerProps {
  initialForeground?: string;
  initialBackground?: string;
  theme?: 'light' | 'dark';
  className?: string;
}

export function ColorContrastChecker({
  initialForeground = '#000000',
  initialBackground = '#ffffff',
  theme = 'light',
  className,
}: ColorContrastCheckerProps) {
  const [foreground, setForeground] = React.useState<string>(initialForeground);
  const [background, setBackground] = React.useState<string>(initialBackground);

  // Compute contrast ratio in real-time
  const ratio = React.useMemo(() => {
    return calculateContrastRatio(foreground, background);
  }, [foreground, background]);

  // WCAG Compliance evaluations
  const passNormalAA = ratio >= 4.5;
  const passNormalAAA = ratio >= 7.0;
  const passLargeAA = ratio >= 3.0;
  const passLargeAAA = ratio >= 4.5;
  const passGraphicsAA = ratio >= 3.0;

  // Swap foreground and background
  const handleSwap = () => {
    const temp = foreground;
    setForeground(background);
    setBackground(temp);
  };

  const presets = [
    { name: 'Pure Black / White', fg: '#000000', bg: '#ffffff' },
    { name: 'SNPI Blue / White', fg: '#0056FF', bg: '#ffffff' },
    { name: 'White / Dark Obsidian', fg: '#ffffff', bg: '#000B26' },
    { name: 'Cyan / Dark Obsidian', fg: '#38BDF8', bg: '#000B26' },
    { name: 'Amber / Slate 950', fg: '#F59E0B', bg: '#020617' },
    { name: 'Emerald / Slate 900', fg: '#10B981', bg: '#0F172A' },
  ];

  return (
    <div
      className={cn(
        'w-full space-y-6 max-sm:rounded-none max-sm:border-y max-sm:border-x-0 sm:rounded-2xl sm:border border-slate-200 bg-white text-slate-900 p-6 shadow-xs transition-colors',
        className,
      )}
    >
      {/* Header & Overall Metric */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Eye className="size-5 text-[#0056FF]" />
            <h3 className="font-sans text-base font-bold text-slate-900">
              WCAG 2.1 Contrast Ratio Inspector
            </h3>
          </div>
          <p className="font-sans text-xs text-slate-500">
            Real-time relative luminance calculation ($L_1 + 0.05) / (L_2 + 0.05)$ for accessibility
            conformance.
          </p>
        </div>

        {/* Big Contrast Ratio Display */}
        <div className="flex items-center gap-3 rounded-[4px] border border-slate-200 bg-slate-50/80 px-4 py-2.5">
          <div className="text-right">
            <span className="block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              CONTRAST RATIO
            </span>
            <span className="font-mono text-2xl font-black text-slate-900 tabular-nums">
              {ratio.toFixed(2)}:1
            </span>
          </div>

          <div
            className={cn(
              'flex size-9 items-center justify-center rounded-[4px] font-mono text-xs font-bold text-white shadow-xs',
              passNormalAAA ? 'bg-emerald-600' : passNormalAA ? 'bg-[#0056FF]' : 'bg-red-600',
            )}
          >
            {passNormalAAA ? 'AAA' : passNormalAA ? 'AA' : 'FAIL'}
          </div>
        </div>
      </div>

      {/* Color Selectors & Swap Button */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Foreground Input */}
        <div className="space-y-2 rounded-[4px] border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-slate-800 dark:bg-slate-900/20">
          <label className="flex items-center justify-between font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Foreground (Text)</span>
            <span className="text-[11px] font-normal text-slate-400">color:</span>
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="size-9 cursor-pointer rounded-[4px] border border-slate-200 bg-transparent p-0.5 outline-none dark:border-slate-700"
            />
            <input
              type="text"
              value={foreground}
              onChange={(e) => setForeground(e.target.value)}
              className="flex-1 rounded-[4px] border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-800 transition-colors outline-none focus:border-[#0056FF] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>

        {/* Background Input */}
        <div className="space-y-2 rounded-[4px] border border-slate-200/80 bg-slate-50/40 p-3.5 dark:border-slate-800 dark:bg-slate-900/20">
          <label className="flex items-center justify-between font-mono text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Background (Surface)</span>
            <span className="text-[11px] font-normal text-slate-400">background-color:</span>
          </label>
          <div className="flex items-center gap-2.5">
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="size-9 cursor-pointer rounded-[4px] border border-slate-200 bg-transparent p-0.5 outline-none dark:border-slate-700"
            />
            <input
              type="text"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="flex-1 rounded-[4px] border border-slate-200 bg-white px-3 py-1.5 font-mono text-xs font-bold text-slate-800 transition-colors outline-none focus:border-[#0056FF] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Preset Swatches & Swap Control */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Presets:
          </span>
          {presets.map((p) => (
            <button
              key={p.name}
              type="button"
              onClick={() => {
                setForeground(p.fg);
                setBackground(p.bg);
              }}
              className="flex items-center gap-1.5 rounded-[4px] border border-slate-200 bg-white px-2 py-1 font-mono text-[10px] text-slate-600 transition-colors hover:border-[#0056FF] hover:text-[#0056FF] dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-cyan-400"
            >
              <span
                className="size-2 rounded-full border border-slate-300"
                style={{ backgroundColor: p.fg }}
              />
              <span
                className="size-2 rounded-full border border-slate-300"
                style={{ backgroundColor: p.bg }}
              />
              <span>{p.name}</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleSwap}
          className="flex items-center gap-1.5 rounded-[4px] border border-slate-200 bg-slate-50 px-3 py-1.5 font-mono text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
        >
          <RotateCcw className="size-3" />
          <span>Swap Colors</span>
        </button>
      </div>

      {/* WCAG Compliance Status Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Normal Text AA */}
        <div
          className={cn(
            'space-y-1 rounded-[4px] border p-3 transition-colors',
            passNormalAA
              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-red-500/30 bg-red-500/5 dark:bg-red-500/10',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              Normal Text
            </span>
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-bold',
                passNormalAA
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400',
              )}
            >
              {passNormalAA ? (
                <Check className="size-3 stroke-[2.5]" />
              ) : (
                <X className="size-3 stroke-[2.5]" />
              )}
              <span>{passNormalAA ? 'Pass AA' : 'Fail'}</span>
            </span>
          </div>
          <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400">
            Min 4.5:1 required (body text &lt; 18pt).
          </p>
        </div>

        {/* Normal Text AAA */}
        <div
          className={cn(
            'space-y-1 rounded-[4px] border p-3 transition-colors',
            passNormalAAA
              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              Enhanced
            </span>
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-bold',
                passNormalAAA
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
              )}
            >
              {passNormalAAA ? (
                <Check className="size-3 stroke-[2.5]" />
              ) : (
                <X className="size-3 stroke-[2.5]" />
              )}
              <span>{passNormalAAA ? 'Pass AAA' : 'Fail'}</span>
            </span>
          </div>
          <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400">
            Min 7.0:1 required for high accessibility.
          </p>
        </div>

        {/* Large Text AA */}
        <div
          className={cn(
            'space-y-1 rounded-[4px] border p-3 transition-colors',
            passLargeAA
              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-red-500/30 bg-red-500/5 dark:bg-red-500/10',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              Large Text
            </span>
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-bold',
                passLargeAA
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-red-500/15 text-red-600 dark:text-red-400',
              )}
            >
              {passLargeAA ? (
                <Check className="size-3 stroke-[2.5]" />
              ) : (
                <X className="size-3 stroke-[2.5]" />
              )}
              <span>{passLargeAA ? 'Pass AA' : 'Fail'}</span>
            </span>
          </div>
          <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400">
            Min 3.0:1 required (18pt / 14pt bold).
          </p>
        </div>

        {/* Large Text AAA */}
        <div
          className={cn(
            'space-y-1 rounded-[4px] border p-3 transition-colors',
            passLargeAAA
              ? 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10'
              : 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10',
          )}
        >
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
              Large Enhanced
            </span>
            <span
              className={cn(
                'flex items-center gap-0.5 rounded-[4px] px-1.5 py-0.5 font-mono text-[10px] font-bold',
                passLargeAAA
                  ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                  : 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
              )}
            >
              {passLargeAAA ? (
                <Check className="size-3 stroke-[2.5]" />
              ) : (
                <X className="size-3 stroke-[2.5]" />
              )}
              <span>{passLargeAAA ? 'Pass AAA' : 'Fail'}</span>
            </span>
          </div>
          <p className="font-sans text-[11px] text-slate-500 dark:text-slate-400">
            Min 4.5:1 required for large AAA text.
          </p>
        </div>
      </div>

      {/* Live Visual Sandbox Preview */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Live Rendered Sample:
        </span>
        <div
          style={{
            backgroundColor: background,
            color: foreground,
          }}
          className="space-y-3 rounded-[4px] border border-slate-200/40 p-6 shadow-sm transition-all"
        >
          <div className="space-y-1">
            <h4 className="text-xl font-bold tracking-tight">
              SNP-SMS Monorepo Design System & Accessibility
            </h4>
            <p className="max-w-xl text-sm leading-relaxed">
              This typography specimen is rendered live using your active foreground ({foreground})
              and background ({background}) color specifications. Verify legibility under actual
              reading conditions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span
              style={{
                border: `1.5px solid ${foreground}`,
                color: foreground,
              }}
              className="rounded-[4px] px-3 py-1 font-mono text-xs font-bold"
            >
              UI Component Border
            </span>
            <span className="font-mono text-xs">
              Contrast Ratio: <strong>{ratio.toFixed(2)}:1</strong>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// INTERACTIVE DOCUMENTATION DEMO: ColorContrastCheckerDemo
// ============================================================================

export function ColorContrastCheckerDemo() {
  return (
    <div className="w-full space-y-6">
      {/* Control Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase">
          <span>Brand Luminance Matrix</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-xs text-slate-500">
          <ShieldCheck className="size-3.5 text-emerald-500" />
          <span>WCAG 2.1 Conformance Engine</span>
        </div>
      </div>

      {/* Instance with #000000 on #ffffff (21.00:1 AAA Pass) */}
      <ColorContrastChecker theme="light" initialForeground="#000000" initialBackground="#ffffff" />
    </div>
  );
}
