'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Copy, Check, FileText } from '@/components/icons';

export type TactileFolderTheme = 'dark' | 'light' | 'blue';

export interface TactileFolderCard {
  id: string;
  title: string;
  badge?: string;
  description?: string;
  content: React.ReactNode;
}

export interface TactileFolderShowcaseProps {
  initialTheme?: TactileFolderTheme;
  cards: TactileFolderCard[];
  initialActiveIndex?: number;
  onThemeChange?: (theme: TactileFolderTheme) => void;
  className?: string;
}

/**
 * TactileFolderShowcase
 * Implements the tactile stacked documents folder container with floating 3-color switcher capsule dock (Image 2 reference).
 * Features a rounded wallet/folder container with 3 layered document sheets peeking out,
 * a frosted translucent front pocket, and an interactive floating capsule dock with 3 theme swatches.
 */
export function TactileFolderShowcase({
  initialTheme = 'dark',
  cards,
  initialActiveIndex = 0,
  onThemeChange,
  className,
}: TactileFolderShowcaseProps) {
  const [theme, setTheme] = React.useState<TactileFolderTheme>(initialTheme);
  const [activeCardIndex, setActiveCardIndex] = React.useState<number>(initialActiveIndex);
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleSelectTheme = (newTheme: TactileFolderTheme) => {
    setTheme(newTheme);
    onThemeChange?.(newTheme);
  };

  const activeCard = cards[activeCardIndex] || cards[0];

  // Dynamic theme-specific styling tokens
  const themeStyles = {
    dark: {
      folderBg: 'bg-[#0A1A4A] border border-[#0A1A4A] shadow-[0_20px_50px_rgba(10,26,74,0.3)]',
      pocketBg:
        'bg-[#0A1A4A]/80 backdrop-blur-md border border-white/15 text-white shadow-[0_-8px_20px_rgba(0,0,0,0.2)]',
      cardBg: 'bg-white text-[#0A1A4A] border border-[#CAD3F5]',
      cardMutedBg: 'bg-slate-50 text-slate-800 border border-slate-200',
      pillActive: 'ring-2 ring-offset-2 ring-[#0A1A4A]',
      stampText: 'text-white/80',
    },
    light: {
      folderBg: 'bg-white border-2 border-[#CAD3F5] shadow-[0_20px_50px_rgba(0,86,255,0.08)]',
      pocketBg:
        'bg-[#EFF5FF]/90 backdrop-blur-md border border-[#CAD3F5] text-[#0A1A4A] shadow-[0_-8px_20px_rgba(0,86,255,0.06)]',
      cardBg: 'bg-white text-[#0A1A4A] border-2 border-[#0056FF]/30',
      cardMutedBg: 'bg-slate-50 text-slate-800 border border-slate-200',
      pillActive: 'ring-2 ring-offset-2 ring-[#0056FF]',
      stampText: 'text-[#0A1A4A]',
    },
    blue: {
      folderBg:
        'bg-gradient-to-br from-[#0056FF] to-[#2277FF] border border-[#0056FF] shadow-[0_20px_50px_rgba(0,86,255,0.35)]',
      pocketBg:
        'bg-[#0056FF]/80 backdrop-blur-md border border-white/25 text-white shadow-[0_-8px_20px_rgba(0,0,0,0.2)]',
      cardBg: 'bg-white text-[#0A1A4A] border border-[#CAD3F5]',
      cardMutedBg: 'bg-slate-50 text-slate-800 border border-slate-200',
      pillActive: 'ring-2 ring-offset-2 ring-[#0056FF]',
      stampText: 'text-white',
    },
  }[theme];

  return (
    <div className={cn('flex flex-col items-center', className)}>
      {/* =================================================================== */}
      {/* 3D TACTILE FOLDER CONTAINER (IMAGE 2 REFERENCE)                     */}
      {/* =================================================================== */}
      <div
        className={cn(
          'relative w-full max-w-xl transition-all duration-300',
          'rounded-[32px] sm:rounded-[36px]',
          themeStyles.folderBg,
        )}
      >
        {/* Outer Folder Body Container */}
        <div className="relative min-h-[360px] p-4 pt-10 pb-20 sm:min-h-[400px] sm:p-6 sm:pt-12 sm:pb-24">
          {/* Top Folder Lip / Tab Arch */}
          <div className="absolute -top-3 left-8 h-4 w-28 rounded-t-xl bg-inherit border-t border-x border-inherit" />

          {/* =============================================================== */}
          {/* 3 STACKED DOCUMENT SHEETS PEEKING OUT                           */}
          {/* =============================================================== */}
          <div className="relative mx-auto h-[260px] w-full max-w-md sm:h-[300px]">
            {cards.slice(0, 3).map((card, idx) => {
              const isActive = activeCardIndex === idx;

              // Transformation classes based on card slot position
              let transformClasses = '';
              let zIndexClass = 'z-10';

              if (isActive) {
                transformClasses = 'translate-y-0 rotate-0 scale-100';
                zIndexClass = 'z-20';
              } else if (idx === 0) {
                // Tilted left
                transformClasses = '-translate-y-4 -rotate-4 sm:-rotate-6 scale-95 opacity-85';
                zIndexClass = 'z-10 hover:-translate-y-6 hover:opacity-100';
              } else if (idx === 1) {
                // Tilted right
                transformClasses = '-translate-y-4 rotate-4 sm:rotate-6 scale-95 opacity-85';
                zIndexClass = 'z-10 hover:-translate-y-6 hover:opacity-100';
              } else {
                transformClasses = '-translate-y-6 rotate-1 scale-90 opacity-75';
                zIndexClass = 'z-0 hover:-translate-y-8 hover:opacity-100';
              }

              return (
                <div
                  key={card.id}
                  onClick={() => setActiveCardIndex(idx)}
                  className={cn(
                    'absolute inset-x-0 top-0 mx-auto h-[280px] w-full max-w-sm sm:max-w-md cursor-pointer select-none rounded-2xl p-4 transition-all duration-300 sm:p-5',
                    isActive ? themeStyles.cardBg : themeStyles.cardMutedBg,
                    transformClasses,
                    zIndexClass,
                  )}
                >
                  {/* Card Header Bar */}
                  <div className="flex items-center justify-between border-b border-slate-200/80 pb-2.5">
                    <div className="flex items-center gap-2">
                      <FileText className="size-4 text-[#0056FF]" />
                      <span className="font-sans text-xs font-bold text-slate-900">
                        {card.title}
                      </span>
                    </div>
                    {card.badge && (
                      <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[9px] font-bold text-[#0056FF]">
                        {card.badge}
                      </span>
                    )}
                  </div>

                  {/* Card Main Body Content */}
                  <div className="mt-3 overflow-hidden text-xs">
                    {card.content}
                  </div>
                </div>
              );
            })}
          </div>

          {/* =============================================================== */}
          {/* FROSTED TRANSLUCENT FRONT SLEEVE / POCKET                       */}
          {/* =============================================================== */}
          <div
            className={cn(
              'pointer-events-none absolute inset-x-3 bottom-3 z-30 flex items-center justify-between rounded-[24px] sm:rounded-[28px] px-5 py-3.5',
              themeStyles.pocketBg,
            )}
          >
            <div className="flex items-center gap-2.5">
              <span className="size-2 rounded-full bg-emerald-400" />
              <span className={cn('font-mono text-xs font-bold uppercase tracking-wider', themeStyles.stampText)}>
                {activeCard.title}
              </span>
            </div>

            <span className="font-mono text-[10px] opacity-75">
              Doc {activeCardIndex + 1} of {cards.length}
            </span>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* FLOATING CAPSULE DOCK WITH 3-COLOR SWITCHER (EXACT IMAGE 2 RECREATION) */}
      {/* =================================================================== */}
      <div className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#CAD3F5] bg-white px-3.5 py-1.5 shadow-md">
        {/* Left 6-Dot Grip Icon (Image 2) */}
        <div className="flex items-center pr-1 text-slate-400" title="Drag / Theme Selector">
          <svg className="size-3.5" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
          </svg>
        </div>

        {/* 3 Color Swatch Pills */}
        <div className="flex items-center gap-2">
          {/* Swatch 1: Black / Deep Navy */}
          <button
            type="button"
            onClick={() => handleSelectTheme('dark')}
            title="Black Theme (Obsidian Navy)"
            aria-label="Select Black Theme"
            className={cn(
              'size-5.5 rounded-full bg-[#0A1A4A] transition-all hover:scale-110 active:scale-95 focus:outline-none',
              theme === 'dark' ? 'ring-2 ring-offset-2 ring-[#0A1A4A]' : 'opacity-70 hover:opacity-100',
            )}
          />

          {/* Swatch 2: Pure White / Ice */}
          <button
            type="button"
            onClick={() => handleSelectTheme('light')}
            title="White Theme (Minimal Ice)"
            aria-label="Select White Theme"
            className={cn(
              'size-5.5 rounded-full border border-[#CAD3F5] bg-white transition-all hover:scale-110 active:scale-95 focus:outline-none',
              theme === 'light' ? 'ring-2 ring-offset-2 ring-[#0056FF]' : 'opacity-70 hover:opacity-100',
            )}
          />

          {/* Swatch 3: Royal Blue */}
          <button
            type="button"
            onClick={() => handleSelectTheme('blue')}
            title="Royal Blue Theme (Brand Electric)"
            aria-label="Select Royal Blue Theme"
            className={cn(
              'size-5.5 rounded-full bg-[#0056FF] transition-all hover:scale-110 active:scale-95 focus:outline-none',
              theme === 'blue' ? 'ring-2 ring-offset-2 ring-[#0056FF]' : 'opacity-70 hover:opacity-100',
            )}
          />
        </div>
      </div>
    </div>
  );
}
