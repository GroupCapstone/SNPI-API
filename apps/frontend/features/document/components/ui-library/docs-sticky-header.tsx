'use client';

import * as React from 'react';
import { BrandMark } from '@/components/shared/brand-mark';
import { FileText, Layers, Newspaper } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';

export interface DocsStickyHeaderProps {
  activeTab: 'document' | 'library' | 'changelog';
}

export function DocsStickyHeader({ activeTab }: DocsStickyHeaderProps) {
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
      badge: 10,
      badgeColor: 'blue',
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

        {/* Center / Right: Hanging Trapezoid Top Navigation */}
        <div className="-mb-[1px] flex items-end self-stretch">
          <HangingTabsNav items={navTabs} activeId={activeTab} size="sm" />
        </div>
      </div>
    </header>
  );
}
