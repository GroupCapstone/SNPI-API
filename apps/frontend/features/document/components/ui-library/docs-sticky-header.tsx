'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { cn } from '@/lib/utils';

export interface DocsStickyHeaderProps {
  activeTab: 'document' | 'library';
}

export function DocsStickyHeader({ activeTab }: DocsStickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/85 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5">
          <BrandMark compact size={36} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              SNP-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-xs font-bold tracking-wider text-slate-500 uppercase">
              Docs
            </span>
          </div>
        </div>

        {/* Right / Center: Sticky Navigation Menu (Apple Liquid Glass Style) */}
        <nav aria-label="Documentation Switcher" className="flex items-center gap-2">
          {/* Document / Open API Link */}
          <Link
            href="/document"
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-xl px-4 font-sans text-xs font-bold tracking-wider uppercase transition-all select-none',
              activeTab === 'document'
                ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_4px_12px_rgba(0,86,255,0.2)]'
                : 'border border-slate-200/90 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] hover:border-[#0056FF]/40 hover:bg-white hover:text-[#0056FF]',
            )}
          >
            Open API
          </Link>

          {/* Library / Design System Link */}
          <Link
            href="/document/design-system"
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-xl px-4 font-sans text-xs font-bold tracking-wider uppercase transition-all select-none',
              activeTab === 'library'
                ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_4px_12px_rgba(0,86,255,0.2)]'
                : 'border border-slate-200/90 bg-white/70 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] hover:border-[#0056FF]/40 hover:bg-white hover:text-[#0056FF]',
            )}
          >
            Library
          </Link>
        </nav>
      </div>
    </header>
  );
}
