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
  ChevronDown,
  Folder,
  Plus,
  ShieldKey,
} from '@/components/icons';
import { HangingTabsNav, type HangingTabItem } from './hanging-tabs-nav';
import { HookSidebar } from './hook-sidebar';
import { useDocsNav } from './docs-nav-context';
import {
  COMPONENT_CATEGORIES,
  COMPONENT_LIBRARY_REGISTRY,
  DOCUMENTATION_NAV_ITEMS,
  M3_COMPONENTS_NAV,
  PLATFORM_COMPONENTS_NAV,
  getComponentFreshness,
  getCategoryHierarchicalNodes,
} from './component-registry';
import { cn } from '@/lib/utils';

export interface DocsStickyHeaderProps {
  activeTab?: 'openapi' | 'library' | 'release' | 'document';
  version?: string;
  commitHash?: string;
}

const OPEN_API_SECTIONS = [
  { id: 'open-api-head', label: 'Welcome & Overview' },
  { id: 'available-services', label: '2 Core Services' },
  { id: 'public-feeds', label: 'Public Feeds & RSS 2.0' },
  { id: 'changelogs', label: 'Syndication Releases' },
];

const DESIGN_SYSTEM_SECTIONS = [
  { id: 'brand-blueprint', label: 'Brand Blueprint & Assets' },
  { id: 'color-ramps-tokens', label: 'Color Ramps & Tokens' },
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

  const isLibraryPath =
    pathname?.startsWith('/document/design-system') ||
    pathname === '/design-system' ||
    pathname === '/ui-library';
  const isChangelogPath = pathname?.startsWith('/document/changelog') || pathname === '/changelog';
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

  const [expandedFolders, setExpandedFolders] = React.useState<Record<string, boolean>>({});
  const [expandedParents, setExpandedParents] = React.useState<Record<string, boolean>>({});

  const toggleFolder = (category: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const toggleParentGroup = (parentId: string) => {
    setExpandedParents((prev) => ({
      ...prev,
      [parentId]: !prev[parentId],
    }));
  };

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

  // Filtered M3 components for mobile sidebar navigation
  const filteredM3Components = React.useMemo(() => {
    const q = mobileSearch.toLowerCase().trim();
    if (!q) return M3_COMPONENTS_NAV;
    return M3_COMPONENTS_NAV.filter((item) => {
      if (item.name.toLowerCase().includes(q)) return true;
      if (item.children && item.children.some((c) => c.name.toLowerCase().includes(q))) {
        return true;
      }
      return false;
    }).map((item) => {
      if (item.children) {
        return {
          ...item,
          children: item.children.filter((c) =>
            item.name.toLowerCase().includes(q) ? true : c.name.toLowerCase().includes(q),
          ),
        };
      }
      return item;
    });
  }, [mobileSearch]);

  // Filtered Platform components for mobile sidebar navigation
  const filteredPlatformComponents = React.useMemo(() => {
    const q = mobileSearch.toLowerCase().trim();
    if (!q) return PLATFORM_COMPONENTS_NAV;
    return PLATFORM_COMPONENTS_NAV.filter((item) =>
      item.name.toLowerCase().includes(q),
    );
  }, [mobileSearch]);

  // Auto-expand mobile parent group if search matches
  React.useEffect(() => {
    const q = mobileSearch.toLowerCase().trim();
    if (!q) return;
    for (const item of M3_COMPONENTS_NAV) {
      if (item.isParent && item.children) {
        if (item.children.some((c) => c.name.toLowerCase().includes(q))) {
          setExpandedParents((prev) => ({ ...prev, [item.id]: true }));
        }
      }
    }
  }, [mobileSearch]);

  // 3 Primary Distinct Views: COMPONENT, API, and BLUEPRINT
  const navTabs: HangingTabItem[] = [
    {
      id: 'library',
      label: 'COMPONENT',
      icon: Layers,
      href: '/document/design-system',
      onClick: () => setActiveTab('library', false),
    },
    {
      id: 'openapi',
      label: 'API',
      icon: FileText,
      href: '/document',
      onClick: () => setActiveTab('openapi', false),
    },
    {
      id: 'release',
      label: 'BLUEPRINT',
      icon: ShieldKey,
      href: '/document/design',
      onClick: () => setActiveTab('release', false),
    },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#0048D9] bg-[#0056FF] shadow-[0_2px_12px_rgba(0,40,150,0.2)] backdrop-blur-xl">
      <div className="relative mx-auto flex h-[68px] max-w-[1560px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left: Brand Identity */}
        <Link
          href="/document"
          className="group z-10 flex items-center gap-2.5 select-none sm:gap-3.5"
          title="SNPI-SMS Developer Documentation Portal"
        >
          <BrandMark compact size={38} />
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="font-sans text-base font-black tracking-tight text-white transition-colors group-hover:text-blue-100 sm:text-lg md:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-white/40" />
            <span className="font-sans text-[11px] font-bold tracking-wider text-blue-100 uppercase sm:text-xs">
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
            <div className="animate-in fade-in zoom-in-95 absolute top-[calc(100%+8px)] right-0 w-[min(calc(100vw-32px),360px)] overflow-hidden rounded-2xl border border-[#CAD3F5] bg-white p-4 shadow-none duration-150">
              {/* Top Primary Page Switcher Tabs (3 Distinct Views: Component, API, Design) */}
              <div className="mb-4">
                <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase sm:text-[11px]">
                  Select Page Hub
                </span>
                <div className="grid grid-cols-3 gap-1 rounded-xl bg-slate-100 p-1">
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('library')}
                    className={cn(
                      'flex items-center justify-center gap-1 rounded-lg py-2 font-sans text-[11px] font-bold transition-all select-none active:scale-95 sm:text-xs',
                      currentTab === 'library'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <Layers className="size-3.5 shrink-0 stroke-[2]" />
                    <span className="truncate">Component</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('openapi')}
                    className={cn(
                      'flex items-center justify-center gap-1 rounded-lg py-2 font-sans text-[11px] font-bold transition-all select-none active:scale-95 sm:text-xs',
                      currentTab === 'openapi'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <FileText className="size-3.5 shrink-0 stroke-[2]" />
                    <span className="truncate">API</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMobileNavigate('release')}
                    className={cn(
                      'flex items-center justify-center gap-1 rounded-lg py-2 font-sans text-[11px] font-bold transition-all select-none active:scale-95 sm:text-xs',
                      currentTab === 'release'
                        ? 'bg-[#0056FF] text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900',
                    )}
                  >
                    <ShieldKey className="size-3.5 shrink-0 stroke-[2]" />
                    <span className="truncate">Blueprint</span>
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
                  placeholder="Search documents"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-3 pl-8.5 font-sans text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0056FF] focus:bg-white focus:outline-hidden"
                />
              </div>

              {/* Sidebar Specific Links Scrollable Viewport (Knowledge Base Style) */}
              <div className="no-scrollbar max-h-[min(65vh,480px)] overflow-y-auto pr-1">
                {currentTab === 'library' ? (
                  /* UI Library Specific Demos Navigation (Material 3 Hierarchical Component Tree & Documentation) */
                  <div className="space-y-3 font-sans">
                    {/* DOCUMENTATION SECTION (Image 1: Dotted line guide with Brand Blueprint, Design Standards, Touch Targets) */}
                    <div className="space-y-1.5 pt-1">
                      <div className="px-2 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase select-none">
                        DOCUMENTATION
                      </div>
                      <div className="ml-2.5 space-y-1 border-l border-dotted border-slate-300 py-0.5 pl-2.5">
                        {DOCUMENTATION_NAV_ITEMS.map((doc) => (
                          <Link
                            key={doc.id}
                            href={doc.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="group flex items-center gap-2 rounded-md px-1.5 py-1 text-xs font-semibold text-slate-700 hover:text-[#0056FF] transition-colors"
                          >
                            <FileText className="size-3.5 text-slate-400 group-hover:text-[#0056FF] transition-colors shrink-0" />
                            <span className="truncate">{doc.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Subtle Divider */}
                    <div className="border-t border-slate-200/80 my-2" />

                    {/* MATERIAL 3 HIERARCHICAL COMPONENTS LIST (Images 2, 3, 4: Zero folder icons, clean rounded pills, collapsed parents by default) */}
                    <div className="space-y-0.5 pt-1 font-sans text-xs">
                      {filteredM3Components.length === 0 && filteredPlatformComponents.length === 0 ? (
                        <div className="py-4 text-center font-sans text-xs text-slate-400">
                          No matching components found
                        </div>
                      ) : (
                        <>
                          {filteredM3Components.map((item) => {
                            if (item.isParent && item.children) {
                              const isExpanded = Boolean(expandedParents[item.id]);

                              return (
                                <div key={item.id} className="space-y-0.5">
                                  {/* Parent Group Header (Default collapsed, tap to toggle) */}
                                  <button
                                    type="button"
                                    onClick={() => toggleParentGroup(item.id)}
                                    className="group flex w-full cursor-pointer items-center justify-between rounded-full px-3 py-1.5 text-left font-sans text-xs font-medium text-slate-800 transition-colors select-none hover:bg-slate-100 hover:text-slate-950"
                                  >
                                    <span className="truncate">{item.name}</span>
                                    {isExpanded ? (
                                      <ChevronDown className="size-3.5 shrink-0 text-slate-400 group-hover:text-slate-700" />
                                    ) : (
                                      <ChevronRight className="size-3.5 shrink-0 text-slate-400 group-hover:text-slate-700" />
                                    )}
                                  </button>

                                  {/* Child Items Dropdown */}
                                  {isExpanded && (
                                    <div className="ml-3.5 space-y-0.5 border-l border-dotted border-slate-300 py-0.5 pl-2.5">
                                      {item.children.map((child) => {
                                        const freshness = getComponentFreshness(child);
                                        const target = child.targetId || `comp-${child.id}`;
                                        const isComing = child.isFuture;

                                        return (
                                          <div
                                            key={child.id}
                                            onClick={() => {
                                              if (!isComing && child.targetId) {
                                                handleMobileNavigate('library', child.targetId);
                                              }
                                            }}
                                            className={cn(
                                              'group flex w-full items-center justify-between rounded-full px-2.5 py-1 text-left transition-colors select-none',
                                              isComing
                                                ? 'cursor-default opacity-75'
                                                : 'cursor-pointer hover:bg-slate-100',
                                            )}
                                          >
                                            <span
                                              className={cn(
                                                'truncate pr-2 font-sans text-xs transition-colors',
                                                isComing
                                                  ? 'text-slate-500'
                                                  : 'text-slate-700 font-medium group-hover:text-slate-950',
                                              )}
                                            >
                                              {child.name}
                                            </span>
                                            {freshness && (
                                              <span
                                                className={cn(
                                                  'shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] leading-none font-medium',
                                                  freshness === 'new' &&
                                                    'border border-emerald-300/80 bg-emerald-50/70 text-emerald-700',
                                                  freshness === 'updated' &&
                                                    'border border-slate-300 bg-slate-100/80 text-slate-700',
                                                  freshness === 'coming' &&
                                                    'border border-slate-200 bg-slate-50/60 text-slate-400',
                                                )}
                                              >
                                                {freshness === 'new'
                                                  ? 'New'
                                                  : freshness === 'updated'
                                                    ? 'Updated'
                                                    : 'Coming'}
                                              </span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              );
                            }

                            // Standalone Component Item
                            const freshness = getComponentFreshness(item);
                            const isComing = item.isFuture;

                            return (
                              <div
                                key={item.id}
                                onClick={() => {
                                  if (!isComing && item.targetId) {
                                    handleMobileNavigate('library', item.targetId);
                                  }
                                }}
                                className={cn(
                                  'group flex w-full items-center justify-between rounded-full px-3 py-1.5 text-left transition-colors select-none',
                                  isComing
                                    ? 'cursor-default opacity-75'
                                    : 'cursor-pointer hover:bg-slate-100',
                                )}
                              >
                                <span
                                  className={cn(
                                    'truncate pr-2 font-sans text-xs transition-colors',
                                    isComing
                                      ? 'text-slate-500'
                                      : 'text-slate-800 font-medium hover:text-slate-950',
                                  )}
                                >
                                  {item.name}
                                </span>
                                {freshness && (
                                  <span
                                    className={cn(
                                      'shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] leading-none font-medium',
                                      freshness === 'new' &&
                                        'border border-emerald-300/80 bg-emerald-50/70 text-emerald-700',
                                      freshness === 'updated' &&
                                        'border border-slate-300 bg-slate-100/80 text-slate-700',
                                      freshness === 'coming' &&
                                        'border border-slate-200 bg-slate-50/60 text-slate-400',
                                    )}
                                  >
                                    {freshness === 'new'
                                      ? 'New'
                                      : freshness === 'updated'
                                        ? 'Updated'
                                        : 'Coming'}
                                  </span>
                                )}
                              </div>
                            );
                          })}

                          {/* PLATFORM COMPONENTS SECTION (Image 6: Clean bullet category header with custom built components) */}
                          {filteredPlatformComponents.length > 0 && (
                            <div className="pt-3 space-y-0.5">
                              <div className="px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase flex items-center gap-1.5 select-none">
                                <span className="text-[#0056FF] text-xs leading-none">•</span>
                                <span>PLATFORM COMPONENTS</span>
                              </div>
                              {filteredPlatformComponents.map((item) => {
                                const freshness = getComponentFreshness(item);
                                const isComing = item.isFuture;

                                return (
                                  <div
                                    key={item.id}
                                    onClick={() => {
                                      if (!isComing && item.targetId) {
                                        handleMobileNavigate('library', item.targetId);
                                      }
                                    }}
                                    className={cn(
                                      'group flex w-full items-center justify-between rounded-full px-3 py-1.5 text-left transition-colors select-none',
                                      isComing
                                        ? 'cursor-default opacity-75'
                                        : 'cursor-pointer hover:bg-slate-100',
                                    )}
                                  >
                                    <span
                                      className={cn(
                                        'truncate pr-2 font-sans text-xs transition-colors',
                                        isComing
                                          ? 'text-slate-500'
                                          : 'text-slate-800 font-medium hover:text-slate-950',
                                      )}
                                    >
                                      {item.name}
                                    </span>
                                    {freshness && (
                                      <span
                                        className={cn(
                                          'shrink-0 rounded-full px-2 py-0.5 font-sans text-[10px] leading-none font-medium',
                                          freshness === 'new' &&
                                            'border border-emerald-300/80 bg-emerald-50/70 text-emerald-700',
                                          freshness === 'updated' &&
                                            'border border-slate-300 bg-slate-100/80 text-slate-700',
                                          freshness === 'coming' &&
                                            'border border-slate-200 bg-slate-50/60 text-slate-400',
                                        )}
                                      >
                                        {freshness === 'new'
                                          ? 'New'
                                          : freshness === 'updated'
                                            ? 'Updated'
                                            : 'Coming'}
                                      </span>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : currentTab === 'release' ? (
                  /* Design System Page Specific Navigation */
                  <div className="space-y-1.5 font-sans">
                    <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Jump to Design Section
                    </span>
                    {DESIGN_SYSTEM_SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleMobileNavigate('release', sec.id)}
                        className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left font-sans text-xs font-medium text-slate-700 hover:bg-[#EFF5FF] hover:text-[#0056FF]"
                      >
                        <span className="truncate">{sec.label}</span>
                        <ChevronRight className="size-3 text-slate-400" />
                      </button>
                    ))}
                  </div>
                ) : (
                  /* Open API Specific Sections Navigation */
                  <div className="space-y-1.5 font-sans">
                    <span className="mb-2 block font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Jump to API Guide Section
                    </span>
                    {OPEN_API_SECTIONS.map((sec) => (
                      <button
                        key={sec.id}
                        type="button"
                        onClick={() => handleMobileNavigate('openapi', sec.id)}
                        className="flex w-full items-center justify-between rounded-md px-2.5 py-2 text-left font-sans text-xs font-medium text-slate-700 hover:bg-[#EFF5FF] hover:text-[#0056FF]"
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
