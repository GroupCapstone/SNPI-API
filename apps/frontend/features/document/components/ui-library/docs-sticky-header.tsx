'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import { FileText, Layers, Code } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { useDocsNav } from './docs-nav-context';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'release' | 'document';
  version?: string;
  commitHash?: string;
}

export function DocsStickyHeader({
  activeTab: propActiveTab,
  version: _version = 'v0.2.11',
  commitHash: _commitHash = '0d81689',
}: DocsStickyHeaderProps = {}) {
  const pathname = usePathname();
  const { activeTab: navActiveTab, setActiveTab } = useDocsNav();

  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const isChangelogPath = pathname?.startsWith('/document/changelog');
  const pathDerivedTab = isLibraryPath ? 'library' : isChangelogPath ? 'release' : 'openapi';

  const normalizedPropTab = propActiveTab === 'document' ? 'openapi' : propActiveTab;
  const currentTab = normalizedPropTab || navActiveTab || pathDerivedTab;

  // 3 Menus merged together: UI LIBRARY, OPEN API, and CHANGELOG
  const navTabs: HangingTabItem[] = [
    {
      id: 'library',
      label: 'UI LIBRARY',
      icon: Layers,
      href: '/document/design-system',
      onClick: () => setActiveTab('library', false),
    },
    {
      id: 'openapi',
      label: 'OPEN API',
      icon: FileText,
      href: '/document',
      onClick: () => setActiveTab('openapi', false),
    },
    {
      id: 'release',
      label: 'CHANGELOG',
      icon: Code,
      href: '/document/changelog',
      onClick: () => setActiveTab('release', false),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CAD3F5] bg-white shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[68px] max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <Link
          href="/document"
          className="group z-10 flex items-center gap-3.5 select-none"
          title="SNPI-SMS Developer Documentation Portal"
        >
          <BrandMark compact size={38} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-slate-950 transition-colors group-hover:text-[#0056FF] sm:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-xs font-bold tracking-wider text-slate-500 uppercase">
              Docs
            </span>
          </div>
        </Link>

        {/* Center: Futuristic Cyber Armor Modular Nav Bar (3 Merged Menus: UI Library, Open API, Release) */}
        <div className="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
          <HangingTabsNav items={navTabs} activeId={currentTab} size="md" />
        </div>

        {/* Right: Empty spacer to maintain layout balance */}
        <div className="z-10 hidden sm:block" />
      </div>
    </header>
  );
}
