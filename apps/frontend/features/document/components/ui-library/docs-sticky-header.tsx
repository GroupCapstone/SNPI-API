'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import { FileText, Layers, Code } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { GeometricButton } from './geometric-tag-primitives';
import { useDocsNav } from './docs-nav-context';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'document';
}

export function DocsStickyHeader({ activeTab: propActiveTab }: DocsStickyHeaderProps = {}) {
  const pathname = usePathname();
  const { activeTab: navActiveTab, setActiveTab } = useDocsNav();

  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const pathDerivedTab = isLibraryPath ? 'library' : 'openapi';

  const normalizedPropTab = propActiveTab === 'document' ? 'openapi' : propActiveTab;
  const currentTab = normalizedPropTab || navActiveTab || pathDerivedTab;

  const navTabs: HangingTabItem[] = [
    {
      id: 'openapi',
      label: 'Open API',
      icon: FileText,
      href: '/document',
      onClick: () => setActiveTab('openapi'),
    },
    {
      id: 'library',
      label: 'UI Library',
      icon: Layers,
      href: '/document/design-system',
      onClick: () => setActiveTab('library'),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/90 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-16 max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
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
          <HangingTabsNav items={navTabs} activeId={currentTab} size="sm" />
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
