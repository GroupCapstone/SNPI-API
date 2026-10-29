'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { GeometricAsterisk } from './geometric-tag-primitives';
import { cn } from '@/lib/utils';

export interface DocsStickyHeaderProps {
  activeTab: 'document' | 'library';
}

export function DocsStickyHeader({ activeTab }: DocsStickyHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b-2 border-slate-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-3.5">
          <BrandMark compact size={36} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              SNP-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-sm font-bold tracking-wider text-slate-500 uppercase">
              Docs
            </span>
          </div>
        </div>

        {/* Right / Center: Sticky Navigation Menu (Open API / Document & Library) */}
        <nav aria-label="Documentation Switcher" className="flex items-center gap-2 sm:gap-3">
          {/* Document / Open API Link */}
          <Link
            href="/document"
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 border-2 px-4 font-sans text-xs font-bold tracking-wider uppercase transition-all select-none sm:text-sm',
              '[clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]',
              activeTab === 'document'
                ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-sm'
                : 'border-slate-300 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
            )}
          >
            <span>Open API</span>
            {activeTab === 'document' && <GeometricAsterisk className="h-3.5 w-3.5 text-white" />}
          </Link>

          {/* Library / Design System Link */}
          <Link
            href="/document/design-system"
            className={cn(
              'inline-flex h-10 items-center justify-center gap-2 border-2 px-4 font-sans text-xs font-bold tracking-wider uppercase transition-all select-none sm:text-sm',
              '[clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]',
              activeTab === 'library'
                ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-sm'
                : 'border-slate-300 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
            )}
          >
            <span>Library</span>
            {activeTab === 'library' && <GeometricAsterisk className="h-3.5 w-3.5 text-white" />}
          </Link>
        </nav>
      </div>
    </header>
  );
}
