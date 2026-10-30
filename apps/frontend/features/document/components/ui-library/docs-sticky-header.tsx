'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import { FileText, Layers, Terminal } from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { useDocsNav } from './docs-nav-context';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'document';
  version?: string;
  commitHash?: string;
}

export function DocsStickyHeader({
  activeTab: propActiveTab,
  version = 'v0.2.8',
  commitHash = 'a62fcd4',
}: DocsStickyHeaderProps = {}) {
  const pathname = usePathname();
  const { activeTab: navActiveTab, setActiveTab } = useDocsNav();

  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const pathDerivedTab = isLibraryPath ? 'library' : 'openapi';

  const normalizedPropTab = propActiveTab === 'document' ? 'openapi' : propActiveTab;
  const currentTab = normalizedPropTab || navActiveTab || pathDerivedTab;

  // 1. UI Library comes FIRST, Open API comes SECOND
  const navTabs: HangingTabItem[] = [
    {
      id: 'library',
      label: 'UI Library',
      icon: Layers,
      href: '/document/design-system',
      onClick: () => setActiveTab('library', false),
    },
    {
      id: 'openapi',
      label: 'Open API',
      icon: FileText,
      href: '/document',
      onClick: () => setActiveTab('openapi', false),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#CAD3F5] bg-[#E3E7FC]/95 shadow-[0_1px_8px_rgba(0,0,0,0.03)] backdrop-blur-xl">
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

        {/* Center: Creative Hanging Trapezoid Top Navigation (Hanging From Header Baseline) */}
        <div className="pointer-events-auto absolute bottom-0 left-1/2 -mb-[1px] flex -translate-x-1/2 items-end">
          <HangingTabsNav items={navTabs} activeId={currentTab} size="md" />
        </div>

        {/* Right: Real-time Status, Version, and Commit Change Tracker Box */}
        <div className="z-10 flex items-center gap-2 select-none">
          <div
            className="hidden items-center gap-2.5 rounded-[4px] border border-[#CAD3F5] bg-white/95 px-3 py-1.5 shadow-2xs backdrop-blur-md sm:flex"
            title={`SNPI-SMS Release ${version} • Commit ${commitHash} • 193 API Endpoints Active`}
          >
            {/* Version Display with Blue Pulse Dot */}
            <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
              <span className="relative flex size-2 items-center justify-center">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#0056FF] opacity-75" />
                <span className="relative inline-flex size-1.5 rounded-full bg-[#0056FF]" />
              </span>
              <span>{version}</span>
            </div>

            {/* Subtle Divider */}
            <span className="font-mono text-xs text-slate-300">|</span>

            {/* Commit Change Tracker */}
            <Link
              href="/document/changelog"
              className="group/commit flex items-center gap-1 font-mono text-[11px] font-semibold text-slate-600 transition-colors hover:text-[#0056FF]"
              title="View Real-Time Commit Changelog"
            >
              <Terminal className="size-3 text-slate-400 transition-colors group-hover/commit:text-[#0056FF]" />
              <span>{commitHash}</span>
            </Link>

            {/* Subtle Divider */}
            <span className="font-mono text-xs text-slate-300">|</span>

            {/* API Status Badge */}
            <div className="flex items-center gap-1.5 rounded-[3px] border border-emerald-200/90 bg-emerald-50 px-2 py-0.5 font-mono text-[10.5px] font-bold text-emerald-800">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-600" />
              <span>API Healthy (193)</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
