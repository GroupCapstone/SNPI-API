'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import { FileText, Layers, Newspaper, Code } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { GeometricButton } from './geometric-tag-primitives';

export interface DocsStickyHeaderProps {
  activeTab?: 'document' | 'library' | 'changelog';
}

export function DocsStickyHeader({ activeTab: propActiveTab }: DocsStickyHeaderProps = {}) {
  const pathname = usePathname();
  const activeTab =
    propActiveTab ||
    (pathname?.includes('/design-system')
      ? 'library'
      : pathname?.includes('#changelogs')
        ? 'changelog'
        : 'document');

  const navTabs: HangingTabItem[] = [
    {
      id: 'document',
      label: 'Open API',
      icon: FileText,
      href: '/document',
    },
    {
      id: 'library',
      label: 'Library',
      icon: Layers,
      href: '/document/design-system',
    },
    {
      id: 'changelog',
      label: 'Changelog',
      icon: Newspaper,
      href: '/document#changelogs',
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Left: Brand Identity */}
        <div className="z-10 flex items-center gap-3.5">
          <BrandMark compact size={36} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-slate-950 sm:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-xs font-bold tracking-wider text-slate-500 uppercase">
              Docs
            </span>
          </div>
        </div>

        {/* Center: Hanging Trapezoid Top Navigation (Centered on Page, Zero Number Labels) */}
        <div className="pointer-events-auto absolute bottom-0 left-1/2 -mb-[1px] flex -translate-x-1/2 items-end">
          <HangingTabsNav items={navTabs} activeId={activeTab} size="sm" />
        </div>

        {/* Right: Pill Blank Link with Zero Background Behind Icon */}
        <div className="z-10 hidden items-center gap-2 sm:flex">
          <GeometricButton
            href="https://github.com/shiliaiwei/SNP-SMS"
            target="_blank"
            rel="noopener noreferrer"
            variant="outline"
            size="sm"
            icon={<Code className="size-3.5" />}
          >
            GitHub
          </GeometricButton>
        </div>
      </div>
    </header>
  );
}
