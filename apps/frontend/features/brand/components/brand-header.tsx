'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import { Layers, Bookmark, FileText, Sparkles } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from '@/features/document/components/ui-library/hanging-tabs-nav';

export function BrandHeader() {
  const pathname = usePathname();

  const isStandards = pathname?.startsWith('/brand/standards') || pathname?.startsWith('/standards');
  const isResources = pathname?.startsWith('/brand/resources') || pathname?.startsWith('/resources');
  const activeId = isStandards ? 'standards' : isResources ? 'resources' : 'brand';

  const brandTabs: HangingTabItem[] = [
    {
      id: 'brand',
      label: 'BRAND HUB',
      icon: Sparkles,
      href: '/brand',
    },
    {
      id: 'standards',
      label: 'STANDARDS',
      icon: Bookmark,
      href: '/brand/standards',
    },
    {
      id: 'resources',
      label: 'RESOURCES',
      icon: Layers,
      href: '/brand/resources',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CAD3F5] bg-[#E3E7FC]/95 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[68px] max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <Link
          href="/brand"
          className="group z-10 flex items-center gap-3.5 select-none"
          title="SNPI-SMS Brand & Design Standards Portal"
        >
          <BrandMark compact size={38} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-slate-950 transition-colors group-hover:text-[#0056FF] sm:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-xs font-bold tracking-wider text-slate-600 uppercase">
              Brand
            </span>
          </div>
        </Link>

        {/* Center: Cyber Armor 3-Tab Brand Dock */}
        <div className="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
          <HangingTabsNav items={brandTabs} activeId={activeId} size="md" />
        </div>

        {/* Right: Quick Portals Switcher */}
        <div className="z-10 flex items-center gap-2 select-none">
          <div className="hidden items-center gap-2 rounded-[4px] border border-[#CAD3F5] bg-white/95 px-3 py-1.5 shadow-2xs backdrop-blur-md sm:flex">
            <Link
              href="/document/design-system"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors hover:text-[#0056FF]"
              title="Go to UI Library"
            >
              <Layers className="size-3.5 text-[#0056FF]" />
              <span>UI LIBRARY</span>
            </Link>

            <span className="font-mono text-xs text-slate-300">|</span>

            <Link
              href="/document"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 transition-colors hover:text-[#0056FF]"
              title="Go to Open API"
            >
              <FileText className="size-3.5 text-slate-500" />
              <span>OPEN API</span>
            </Link>

            <span className="font-mono text-xs text-slate-300">|</span>

            {/* Strict Color Indicator */}
            <div className="flex items-center gap-1 rounded-[3px] bg-[#0056FF] px-2 py-0.5 font-mono text-[10.5px] font-bold text-white">
              <span>ROYAL BLUE</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
