'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BrandMark } from '@/components/shared/brand-mark';
import {
  FileText,
  Layers,
  Code,
  Menu,
  X,
  Search,
  Moon,
  ChevronRight,
} from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { useDocsNav } from './docs-nav-context';
import { COMPONENT_LIBRARY_REGISTRY } from './component-registry';
import { cn } from '@/lib/utils';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'release' | 'document';
  version?: string;
  commitHash?: string;
}

const OPEN_API_SECTIONS = [
  { id: 'open-api-head', label: 'Overview & Standards' },
  { id: 'public-feeds', label: 'Public Feeds & RSS 2.0' },
  { id: 'class-catalog-api', label: 'Class Catalog REST API' },
  { id: 'certificate-ledger-api', label: 'Certificate Ledger API' },
  { id: 'realtime-stream', label: 'Real-Time SSE Stream' },
  { id: 'rest-api-directory', label: 'Backend API Directory' },
  { id: 'changelogs', label: 'Syndication Releases' },
];

export function DocsStickyHeader({
  activeTab: propActiveTab,
  version: _version = 'v0.2.11',
  commitHash: _commitHash = '0d81689',
}: DocsStickyHeaderProps = {}) {
  const pathname = usePathname();
  const { activeTab: navActiveTab, setActiveTab } = useDocsNav();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState<boolean>(false);
  const [mobileSearch, setMobileSearch] = React.useState<string>('');
  const menuRef = React.useRef<HTMLDivElement>(null);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const isLibraryPath = pathname?.startsWith('/document/design-system');
  const isChangelogPath = pathname?.startsWith('/document/changelog');
  const pathDerivedTab = isLibraryPath ? 'library' : isChangelogPath ? 'release' : 'openapi';

  const normalizedPropTab = propActiveTab === 'document' ? 'openapi' : propActiveTab;
  const currentTab = normalizedPropTab || navActiveTab || pathDerivedTab;

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [mobileMenuOpen]);

  // Jump to specific component or section
  const handleMobileNavigate = (tab: 'library' | 'openapi' | 'release', sectionId?: string) => {
    setActiveTab(tab, true);
    setMobileMenuOpen(false);
    if (sectionId) {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    }
  };

  // Grouped library components for mobile sidebar navigation
  const groupedComponents = React.useMemo(() => {
    const map = new Map<string, typeof COMPONENT_LIBRARY_REGISTRY>();
    COMPONENT_LIBRARY_REGISTRY.forEach((item) => {
      if (
        mobileSearch &&
        !item.name.toLowerCase().includes(mobileSearch.toLowerCase()) &&
        !item.category.toLowerCase().includes(mobileSearch.toLowerCase())
      ) {
        return;
      }
      const list = map.get(item.category) || [];
      list.push(item);
      map.set(item.category, list);
    });
    return Array.from(map.entries()).map(([category, items]) => ({
      category,
      items,
    }));
  }, [mobileSearch]);

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
    <header className="sticky top-0 z-50 w-full border-b border-[#0048D9] bg-[#0056FF] shadow-[0_2px_12px_rgba(0,40,150,0.2)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[68px] max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <Link
          href="/document"
          className="group z-10 flex items-center gap-3.5 select-none"
          title="SNPI-SMS Developer Documentation Portal"
        >
          <BrandMark compact size={38} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-white transition-colors group-hover:text-blue-100 sm:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-white/40" />
            <span className="font-sans text-xs font-bold tracking-wider text-blue-100 uppercase">
              Docs
            </span>
          </div>
        </Link>

        {/* Center: Futuristic Cyber Armor Modular Nav Bar (Desktop Only) */}
        <div className="pointer-events-auto absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center md:flex">
          <HangingTabsNav items={navTabs} activeId={currentTab} size="md" />
        </div>

        {/* Right Side: Mobile Controls (Search, Theme, Hamburger Dropdown) */}
        <div ref={menuRef} className="relative z-20 flex items-center gap-1.5 md:hidden">
          {/* 1. Mobile Search Trigger */}
          <button
            type="button"
            onClick={() => {
              setMobileMenuOpen(true);
              setTimeout(() => searchInputRef.current?.focus(), 100);
            }}
            aria-label="Search Documentation"
            className="flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
          >
            <Search className="size-4 stroke-[2]" />
          </button>

          {/* 2. Theme / Mode Indicator */}
          <button
            type="button"
            aria-label="Toggle Theme Mode"
            className="flex size-9 items-center justify-center rounded-xl border border-white/20 bg-white/10 text-white transition-colors hover:bg-white/20 active:scale-95"
          >
            <Moon className="size-4 stroke-[2]" />
          </button>

          {/* 3. Mobile Hamburger Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
            className={cn(
              'flex size-9 items-center justify-center rounded-xl border transition-all active:scale-95',
              mobileMenuOpen
                ? 'border-white bg-white text-[#0056FF]'
                : 'border-white/20 bg-white/10 text-white hover:bg-white/20',
            )}
          >
            {mobileMenuOpen ? (
              <X className="size-4 stroke-[2.2]" />
            ) : (
              <Menu className="size-4 stroke-[2.2]" />
            )}
          </button>

          {/* Mobile Dropdown Panel (Right Side) */}
          {mobileMenuOpen && (
            <div className="absolute top-[calc(100%+8px)] right-0 w-[min(calc(100vw-32px),360px)] overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
              {/* Top Primary Page Switcher Tabs (Pill Style) */}
              <div className="mb-4">
                <span className="mb-2 block font-mono text-[10px] font-bold text-slate-400 uppercase">
                  Select Page Hub
                </span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('library')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg py-2 font-sans text-xs font-bold transition-all',
                      currentTab === 'library'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Layers className="size-3.5 stroke-[2]" />
                    <span>UI Library</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('openapi')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg py-2 font-sans text-xs font-bold transition-all',
                      currentTab === 'openapi'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <FileText className="size-3.5 stroke-[2]" />
                    <span>Open API</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('release')}
                    className={cn(
                      'flex items-center justify-center gap-1.5 rounded-lg py-2 font-sans text-xs font-bold transition-all',
                      currentTab === 'release'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Code className="size-3.5 stroke-[2]" />
                    <span>Release</span>
                  </button>
                </div>
              </div>

              {/* Fast Search Input */}
              <div className="relative mb-3">
                <Search className="pointer-events-none absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-slate-400" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={mobileSearch}
                  onChange={(e) => setMobileSearch(e.target.value)}
                  placeholder="Filter menu & specific links..."
                  className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-8 font-sans text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0056FF] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Sidebar Specific Links Scrollable Viewport */}
              <div className="max-h-[320px] overflow-y-auto pr-1">
                {currentTab === 'library' ? (
                  /* UI Library Specific Demos Navigation */
                  <div className="space-y-3">
                    <span className="block font-mono text-[10px] font-bold text-slate-400 uppercase">
                      Jump to Component Demo
                    </span>
                    {groupedComponents.map((grp) => (
                      <div key={grp.category} className="space-y-1">
                        <span className="block font-mono text-[9px] font-bold text-[#0056FF] uppercase">
                          {grp.category} ({grp.items.length})
                        </span>
                        <div className="space-y-0.5 pl-2 border-l border-slate-200">
                          {grp.items.map((comp) => (
                            <button
                              key={comp.id}
                              type="button"
                              onClick={() => handleMobileNavigate('library', `comp-${comp.id}`)}
                              className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left font-sans text-xs text-slate-700 hover:bg-[#EFF5FF] hover:text-[#0056FF]"
                            >
                              <span className="truncate">{comp.name}</span>
                              <ChevronRight className="size-3 text-slate-400" />
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Open API Specific Sections Navigation */
                  <div className="space-y-1.5">
                    <span className="block font-mono text-[10px] font-bold text-slate-400 uppercase mb-2">
                      Jump to API Guide Section
                    </span>
                    {OPEN_API_SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleMobileNavigate('openapi', sec.id)}
                        className="flex w-full items-center justify-between rounded-md px-2 py-2 text-left font-sans text-xs font-medium text-slate-700 hover:bg-[#EFF5FF] hover:text-[#0056FF]"
                      >
                        <span className="truncate">{sec.label}</span>
                        <ChevronRight className="size-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
