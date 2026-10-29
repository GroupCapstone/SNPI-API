'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import {
  BrandConceptBlueprint,
  ComponentGalleryGrid,
  LineTrackerToc,
  type TocHeadingItem,
  LibrarySnackbar,
  LibraryBottomSheet,
  LibraryDialog,
  LibraryBottomNav,
  type LibraryBottomNavItem,
  LibrarySwitch,
  LibraryChip,
  LibraryFab,
  LibraryCard,
  LibraryCardHeader,
  LibraryCardTitle,
  LibraryCardDescription,
  LibraryCardMedia,
  LibraryCardFooter,
  LibraryDropdown,
  LibraryTooltip,
  DualModeSystemUI,
  HangingTabsNav,
  COMPONENT_LIBRARY_REGISTRY,
  GeometricButton,
  GeometricHeaderStamp,
  DocsStickyHeader,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  Plus,
  Star,
  MapPin,
  Calendar,
  Check,
  Code,
  Copy,
  Layers,
  Palette,
  Pin,
  Newspaper,
  FilePlus,
  Contacts,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function DesignSystemPage() {
  // Main View: 'catalog' | 'playground' | 'blueprint' | 'dual-mode' | 'top-nav'
  const [activeTab, setActiveTab] = React.useState<
    'catalog' | 'playground' | 'blueprint' | 'dual-mode' | 'top-nav'
  >('catalog');

  // Selected Component for playground inspection
  const [selectedComponentId, setSelectedComponentId] = React.useState<string>('snackbar');

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Active TOC section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('how-it-works');

  const [showCode, setShowCode] = React.useState<boolean>(false);
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);

  // Interactive Component States (Fully tapable live demos)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('Student enrollment confirmed.');
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bottomNavTab, setBottomNavTab] = React.useState('home');
  const [switchState, setSwitchState] = React.useState(true);
  const [selectedChip, setSelectedChip] = React.useState('Academics');
  const [fabCount, setFabCount] = React.useState(0);
  const [cardEnrolled, setCardEnrolled] = React.useState(false);

  // Hanging tabs navigation interactive state
  const [hangingNavTab, setHangingNavTab] = React.useState<string>('newswire');
  const [hangingNavSize, setHangingNavSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [hangingNavBadge, setHangingNavBadge] = React.useState<number>(8);

  // Additional component interactive states
  const [dropdownValue, setDropdownValue] = React.useState<string>('sora');
  const [activeTool, setActiveTool] = React.useState<string>('Move Tool (V)');
  const [bottomSheetChoice, setBottomSheetChoice] = React.useState<string>('Roster Exported');
  const [dialogDecision, setDialogDecision] = React.useState<string>('None');

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
  ];

  // Headings for Right Sidebar Line Tracker
  const tocHeadings: TocHeadingItem[] = React.useMemo(
    () => [
      { id: 'how-it-works', title: 'SNP-SMS Design System: how it works', level: 1 },
      { id: 'architecture-flow', title: 'Architectural token flow', level: 2 },
      { id: 'top-nav-style', title: 'Top Navigation Hanging Tabs Style', level: 1 },
      { id: 'component-gallery', title: 'Component Catalog & Variants', level: 1 },
      { id: 'interactive-stage', title: 'Interactive Component Playground', level: 1 },
      { id: 'brand-blueprint', title: 'Royal Blue (#0056FF) Brand Blueprint', level: 1 },
      { id: 'dual-mode-system', title: 'Dual Mode System UI (Light & Dark)', level: 1 },
      { id: 'design-principles', title: 'Flat Design & Zero Shadows Policy', level: 1 },
      { id: 'touch-targets', title: 'Touch Targets & Accessibility', level: 2 },
    ],
    [],
  );

  // Filter components in real-time
  const filteredComponents = React.useMemo(() => {
    if (!searchQuery.trim()) return COMPONENT_LIBRARY_REGISTRY;
    const q = searchQuery.toLowerCase().trim();
    return COMPONENT_LIBRARY_REGISTRY.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q),
    );
  }, [searchQuery]);

  // Smooth scroll helper
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Real-time scroll spy for tracking point lines
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 140;
      for (let i = tocHeadings.length - 1; i >= 0; i--) {
        const item = tocHeadings[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSectionId(item.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocHeadings]);

  const handleSelectFromGallery = (id: string) => {
    setSelectedComponentId(id);
    setActiveTab('playground');
    scrollToSection('interactive-stage');
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const activeDoc =
    COMPONENT_LIBRARY_REGISTRY.find((c) => c.id === selectedComponentId) ||
    COMPONENT_LIBRARY_REGISTRY[0];

  return (
    <div className="flex min-h-screen flex-col bg-white text-slate-900 antialiased selection:bg-[#0056FF] selection:text-white">
      {/* Sticky Header with Open API & Library Switcher */}
      <DocsStickyHeader activeTab="library" />

      {/* 3-Column Documentation Grid (Cloudflare Docs Layout from Image 2) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12">
          {/* COLUMN 1: Left Navigation Sidebar Menu */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Filter Input */}
              <div className="relative">
                <Search className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-lg border-2 border-slate-200 bg-white pr-4 pl-9 font-sans text-xs text-slate-900 placeholder-slate-400 focus:border-[#0056FF] focus:outline-none"
                />
              </div>

              {/* Navigation Links */}
              <div className="space-y-4 font-sans text-xs">
                <div>
                  <div className="space-y-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('catalog');
                        scrollToSection('component-gallery');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'catalog'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.2)]'
                          : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'catalog'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          01
                        </span>
                        <span className="tracking-wider uppercase">Catalog</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('playground');
                        scrollToSection('interactive-stage');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'playground'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.2)]'
                          : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'playground'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          02
                        </span>
                        <span className="tracking-wider uppercase">Playground</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('blueprint');
                        scrollToSection('brand-blueprint');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'blueprint'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.2)]'
                          : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'blueprint'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          03
                        </span>
                        <span className="tracking-wider uppercase">Brand Colors</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('dual-mode');
                        scrollToSection('dual-mode-system');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'dual-mode'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.2)]'
                          : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'dual-mode'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          04
                        </span>
                        <span className="tracking-wider uppercase">Dual Mode UI</span>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('top-nav');
                        scrollToSection('top-nav-style');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'top-nav'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.2)]'
                          : 'border-slate-200/80 bg-white/90 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'rounded-md px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'top-nav'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          05
                        </span>
                        <span className="tracking-wider uppercase">Top Nav</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* 10 Core UI Components List */}
                <div className="border-t border-slate-200/80 pt-4">
                  <div className="space-y-1">
                    {filteredComponents.length === 0 ? (
                      <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                        No matching components found
                      </div>
                    ) : (
                      filteredComponents.map((comp) => {
                        const isSelected =
                          activeTab === 'playground' && selectedComponentId === comp.id;
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => {
                              setSelectedComponentId(comp.id);
                              setActiveTab('playground');
                              scrollToSection('interactive-stage');
                            }}
                            className={cn(
                              'flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-left text-xs transition-all select-none',
                              isSelected
                                ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_8px_rgba(0,86,255,0.2)]'
                                : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                            )}
                          >
                            <span className="truncate">{comp.name}</span>
                            {isSelected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Documentation & Stage (Cloudflare Docs Style) */}
          <main className="space-y-10 lg:col-span-6">
            {/* Header Anchor Section */}
            <div id="how-it-works" className="space-y-4">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <h1 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    SNP-SMS Design System: how it works
                  </h1>
                </div>
                <GeometricHeaderStamp codeA="20" titleA="SYSTEM" codeB="26" titleB="DOCS" />
              </div>

              <p className="font-sans text-sm leading-relaxed text-slate-600">
                When you build or extend interfaces in SNP-SMS, the Design System enforces visual
                cohesion, strict flat aesthetics, and luminance-based depth before any code reaches
                production. It does not matter whether the view is an institutional dashboard, a
                public verification portal, or a mobile portal. If it runs on SNP-SMS, it follows
                the Royal Blue and Sora standards.
              </p>

              {/* Architectural Token Flow Diagram Card */}
              <div
                id="architecture-flow"
                className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#0056FF]/40"
              >
                <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
                  {/* Node 1: Developer */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                      <span className="font-mono text-base font-bold">DEV</span>
                    </div>
                    <span className="font-sans text-xs font-semibold tracking-wider text-slate-800 uppercase">
                      Developer
                    </span>
                  </div>

                  {/* Arrow 1 */}
                  <div className="flex items-center gap-1 font-mono text-slate-400">
                    <span className="h-0.5 w-8 bg-[#0056FF]" />
                    <span className="font-bold text-[#0056FF]">&rarr;</span>
                  </div>

                  {/* Node 2: Royal Blue Tokens */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="relative flex h-14 w-14 items-center justify-center rounded-xl border border-[#0056FF] bg-[#0056FF] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_4px_12px_rgba(0,86,255,0.25)]">
                      <span className="font-mono text-[11px] font-bold">#0056FF</span>
                    </div>
                    <span className="font-sans text-xs font-black tracking-wider text-[#0056FF] uppercase">
                      Royal Blue
                    </span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="flex items-center gap-1 font-mono text-slate-400">
                    <span className="h-0.5 w-8 bg-[#0056FF]" />
                    <span className="font-bold text-[#0056FF]">&rarr;</span>
                  </div>

                  {/* Node 3: Flat Component */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-800 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
                      <span className="font-mono text-base font-bold">UI 10</span>
                    </div>
                    <span className="font-sans text-xs font-semibold tracking-wider text-slate-800 uppercase">
                      Component
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION: Top Navigation Hanging Tabs Style (Image Reference) */}
            <section
              id="top-nav-style"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs font-bold tracking-wider text-[#0056FF] uppercase">
                  Header Navigation Architecture
                </span>
                <h2 className="font-sans text-xl font-bold text-slate-950 sm:text-2xl">
                  Top Navigation Hanging Tabs Style
                </h2>
                <p className="font-sans text-sm leading-relaxed text-slate-600">
                  Inverted trapezoid folder tabs suspended from the top header baseline. Built with
                  vector-smooth SVG geometry, non-scaling continuous strokes, stacked icon and title
                  hierarchy, and circular notification badges.
                </p>
              </div>

              {/* Live Interactive Header Bar Stage */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                {/* Header Ceiling Strip (Textured Slate Bar) */}
                <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-200/90 px-6 pt-4 pb-0">
                  <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#0056FF]" />
                      <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
                        Application Workspace Ceiling
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-500">
                      SNP-SMS Design Standard
                    </span>
                  </div>

                  {/* Hanging Tabs Suspended from Ceiling */}
                  <div className="-mb-[1px] flex justify-center">
                    <HangingTabsNav
                      activeId={hangingNavTab}
                      onSelect={setHangingNavTab}
                      size={hangingNavSize}
                      items={[
                        { id: 'map', label: 'Map', icon: Pin },
                        {
                          id: 'newswire',
                          label: 'Newswire',
                          icon: Newspaper,
                          badge: hangingNavBadge > 0 ? hangingNavBadge : undefined,
                          badgeColor: 'blue',
                        },
                        { id: 'post', label: 'Post', icon: FilePlus },
                        { id: 'friends', label: 'Friends', icon: Contacts },
                      ]}
                    />
                  </div>
                </div>

                {/* Interactive Controls & State Inspector */}
                <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-xs font-semibold text-slate-600">
                      Active Tab:
                    </span>
                    <span className="rounded-md border border-[#0056FF]/30 bg-[#0056FF]/10 px-2 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                      {hangingNavTab.toUpperCase()}
                    </span>
                  </div>

                  {/* Size Switcher & Badge Modifier */}
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
                      {(['sm', 'md', 'lg'] as const).map((sz) => (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => setHangingNavSize(sz)}
                          className={cn(
                            'rounded px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-all select-none',
                            hangingNavSize === sz
                              ? 'bg-[#0056FF] text-white'
                              : 'text-slate-600 hover:bg-slate-100',
                          )}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs">
                      <span className="text-slate-500">Badge Count:</span>
                      <button
                        type="button"
                        onClick={() => setHangingNavBadge((b) => Math.max(0, b - 1))}
                        className="rounded px-1.5 py-0.5 font-bold select-none hover:bg-slate-100"
                      >
                        -
                      </button>
                      <span className="font-bold text-[#0056FF]">{hangingNavBadge}</span>
                      <button
                        type="button"
                        onClick={() => setHangingNavBadge((b) => b + 1)}
                        className="rounded px-1.5 py-0.5 font-bold select-none hover:bg-slate-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Technical Architecture Specs */}
              <div className="grid grid-cols-1 gap-3 font-sans sm:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Vector Geometry</h4>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    d=&quot;M 0,0 L 100,0 L 88,44 Q 85,50 78,50 L 22,50 Q 15,50 12,44 Z&quot;
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Zero Broken Stroke</h4>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    vectorEffect=&quot;non-scaling-stroke&quot; prevents corner clipping
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-white p-3.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase">Notification Badge</h4>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    bg-[#0284C7] ring-2 ring-white floating on top-right of icon
                  </p>
                </div>
              </div>
            </section>

            {/* SECTION 1: Component Catalog (Image 1 Style Grid with Hover Animations) */}
            <section id="component-gallery" className="scroll-mt-24 space-y-4">
              <ComponentGalleryGrid
                onSelectComponent={handleSelectFromGallery}
                selectedId={selectedComponentId}
              />
            </section>

            {/* SECTION 2: Interactive Component Playground (Real Tapable Demo) */}
            <section id="interactive-stage" className="scroll-mt-24 space-y-6">
              <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                <div>
                  <h2 className="font-sans text-2xl font-black text-slate-950">{activeDoc.name}</h2>
                  <p className="mt-1 text-sm text-slate-600">{activeDoc.description}</p>
                </div>

                <GeometricButton
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToSection('component-gallery')}
                >
                  <span>&larr; Catalog</span>
                </GeometricButton>
              </div>

              {/* Interactive Stage Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#0056FF]/40">
                {/* Stage Body */}
                <div className="flex min-h-[240px] items-center justify-center bg-slate-50/70 p-6 sm:p-8">
                  {renderActivePlaygroundComponent({
                    id: activeDoc.id,
                    snackbarOpen,
                    setSnackbarOpen,
                    snackbarMsg,
                    setSnackbarMsg,
                    sheetOpen,
                    setSheetOpen,
                    dialogOpen,
                    setDialogOpen,
                    bottomNavTab,
                    setBottomNavTab,
                    bottomNavItems,
                    switchState,
                    setSwitchState,
                    selectedChip,
                    setSelectedChip,
                    fabCount,
                    setFabCount,
                    cardEnrolled,
                    setCardEnrolled,
                    dropdownValue,
                    setDropdownValue,
                    activeTool,
                    setActiveTool,
                    bottomSheetChoice,
                    setBottomSheetChoice,
                    dialogDecision,
                    setDialogDecision,
                    hangingNavTab,
                    setHangingNavTab,
                    hangingNavSize,
                    setHangingNavSize,
                    hangingNavBadge,
                    setHangingNavBadge,
                  })}
                </div>

                {/* Action Ribbon: Code Toggle & Copy */}
                <div className="flex items-center justify-between border-t border-slate-200/80 bg-white px-4 py-2.5">
                  <GeometricButton
                    size="sm"
                    variant={showCode ? 'primary' : 'outline'}
                    isActive={showCode}
                    onClick={() => setShowCode(!showCode)}
                  >
                    <Code className="h-3.5 w-3.5" />
                    <span>{showCode ? 'Hide Code' : 'View Code'}</span>
                  </GeometricButton>

                  {showCode && (
                    <GeometricButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(activeDoc.codeSnippet)}
                    >
                      {copiedCode ? (
                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </GeometricButton>
                  )}
                </div>

                {/* Collapsible Source Code View */}
                {showCode && (
                  <div className="border-t border-slate-200/80 bg-slate-900 p-4">
                    <pre className="overflow-x-auto font-mono text-xs text-slate-100">
                      <code>{activeDoc.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              {/* Component Props Table */}
              <div className="space-y-2">
                <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                  Props Interface
                </h3>
                <div className="overflow-x-auto rounded-xl border border-slate-200/80 bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] backdrop-blur-md">
                  <table className="w-full text-left font-sans text-xs">
                    <thead className="border-b border-slate-200/80 bg-slate-50 text-slate-600">
                      <tr>
                        <th className="px-4 py-2.5 font-bold tracking-wider uppercase">Prop</th>
                        <th className="px-4 py-2.5 font-bold tracking-wider uppercase">Type</th>
                        <th className="px-4 py-2.5 font-bold tracking-wider uppercase">Default</th>
                        <th className="px-4 py-2.5 font-bold tracking-wider uppercase">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                      {activeDoc.props.map((p) => (
                        <tr key={p.name}>
                          <td className="px-4 py-2 font-mono font-bold text-[#0056FF]">{p.name}</td>
                          <td className="px-4 py-2 font-mono text-slate-600">{p.type}</td>
                          <td className="px-4 py-2 font-mono text-slate-400">{p.default || '-'}</td>
                          <td className="px-4 py-2 text-slate-600">{p.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            {/* SECTION 3: Brand Colors Blueprint */}
            <section
              id="brand-blueprint"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <BrandConceptBlueprint />
            </section>

            {/* SECTION 4: Dual Mode System UI (Light & Dark) */}
            <section
              id="dual-mode-system"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <DualModeSystemUI />
            </section>

            {/* SECTION 5: Design Principles */}
            <section
              id="design-principles"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <div className="flex items-center gap-2">
                <h2 className="font-sans text-xl font-bold text-slate-950">
                  Flat Design & Zero Shadows Policy
                </h2>
              </div>

              <p className="font-sans text-sm leading-relaxed text-slate-600">
                Every component adheres to strict flat design principles without dropped blur
                shadows (`box-shadow: none`). Spatial depth is established strictly through 1px
                border contrast and background elevation hierarchy.
              </p>

              <div id="touch-targets" className="scroll-mt-24 space-y-2 pt-2">
                <h3 className="font-sans text-sm font-bold text-slate-900">
                  Touch Targets & Accessibility
                </h3>
                <p className="font-sans text-sm leading-relaxed text-slate-600">
                  All interactive elements provide a minimum 44×44px hit target area and exceed WCAG
                  AA contrast ratios of 4.5:1 on light surfaces.
                </p>
              </div>
            </section>
          </main>

          {/* COLUMN 3: Right Sidebar Line Tracker (Image 2 Style) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <LineTrackerToc
              items={tocHeadings}
              activeId={activeSectionId}
              onSelect={(id) => {
                scrollToSection(id);
              }}
            />
          </aside>
        </div>
      </div>

      {/* Global Interactive Overlays */}
      <LibrarySnackbar
        open={snackbarOpen}
        message={snackbarMsg}
        actionLabel="Undo"
        onAction={() => setSnackbarOpen(false)}
        onClose={() => setSnackbarOpen(false)}
      />

      <LibraryBottomSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Campus Infrastructure Status"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Siem Reap Science Wing B · Telemetry labs active with Gigabit Ethernet connectivity.
          </p>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#0056FF] text-xs font-bold text-white transition-colors hover:bg-[#0040C0]"
          >
            Close Sheet
          </button>
        </div>
      </LibraryBottomSheet>

      <LibraryDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Revoke enrollment?"
        description="Permanently revokes course registration for this academic term."
        confirmLabel="Confirm Revoke"
        cancelLabel="Cancel"
        isDestructive
        onConfirm={() => setDialogOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8 text-center font-sans text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0056FF]" />
            <span>SNP-SMS Design Standards & Component Catalog · Sora Typography</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/document"
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              API Docs
            </Link>
            <Link
              href="/dashboard"
              className="text-slate-600 transition-colors hover:text-slate-900"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Helper to render interactive playground component in light mode
 */
function renderActivePlaygroundComponent(props: {
  id: string;
  snackbarOpen: boolean;
  setSnackbarOpen: (o: boolean) => void;
  snackbarMsg: string;
  setSnackbarMsg: (m: string) => void;
  sheetOpen: boolean;
  setSheetOpen: (o: boolean) => void;
  dialogOpen: boolean;
  setDialogOpen: (o: boolean) => void;
  bottomNavTab: string;
  setBottomNavTab: (t: string) => void;
  bottomNavItems: LibraryBottomNavItem[];
  switchState: boolean;
  setSwitchState: (s: boolean) => void;
  selectedChip: string;
  setSelectedChip: (c: string) => void;
  fabCount: number;
  setFabCount: React.Dispatch<React.SetStateAction<number>>;
  cardEnrolled: boolean;
  setCardEnrolled: (e: boolean) => void;
  dropdownValue: string;
  setDropdownValue: (v: string) => void;
  activeTool: string;
  setActiveTool: (t: string) => void;
  bottomSheetChoice: string;
  setBottomSheetChoice: (c: string) => void;
  dialogDecision: string;
  setDialogDecision: (d: string) => void;
  hangingNavTab: string;
  setHangingNavTab: (t: string) => void;
  hangingNavSize: 'sm' | 'md' | 'lg';
  setHangingNavSize: (s: 'sm' | 'md' | 'lg') => void;
  hangingNavBadge: number;
  setHangingNavBadge: React.Dispatch<React.SetStateAction<number>>;
}) {
  switch (props.id) {
    case 'snackbar':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="primary"
              onClick={() => {
                props.setSnackbarMsg('Student enrollment confirmed.');
                props.setSnackbarOpen(true);
              }}
            >
              <Check className="h-4 w-4" />
              <span>Trigger Enrollment Notification</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              onClick={() => {
                props.setSnackbarMsg('Batch attendance sync completed.');
                props.setSnackbarOpen(true);
              }}
            >
              <span>Sync Attendance</span>
            </GeometricButton>
          </div>

          {/* Interactive In-Stage Snackbar Card */}
          <div className="w-full rounded-xl border border-slate-200/90 bg-slate-900 p-3.5 text-white shadow-lg transition-all">
            <div className="flex items-center justify-between gap-3">
              <span className="font-sans text-xs">{props.snackbarMsg}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => props.setSnackbarMsg('Action reverted successfully.')}
                  className="rounded px-2 py-1 font-mono text-[11px] font-bold text-[#60A5FA] uppercase transition-colors hover:bg-white/10"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => props.setSnackbarOpen(false)}
                  className="rounded p-1 text-slate-400 hover:text-white"
                >
                  <span className="font-mono text-xs">Close</span>
                </button>
              </div>
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Interactive state: {props.snackbarOpen ? 'Active (Displaying)' : 'Ready'}
          </span>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 py-2">
          <GeometricButton variant="primary" onClick={() => props.setSheetOpen(true)}>
            <MapPin className="h-4 w-4" />
            <span>Open Fullscreen Sheet</span>
          </GeometricButton>

          {/* In-Stage Interactive Action Sheet Mock */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <h4 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase">
              Quick Operations
            </h4>
            <div className="mt-2.5 space-y-1.5 font-sans text-xs">
              {[
                'Export Student Roster (CSV / PDF)',
                'Generate Monthly Attendance Matrix',
                'Batch Dispatch SMS Announcement',
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => props.setBottomSheetChoice(opt)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-lg border p-2.5 text-left font-semibold transition-all select-none',
                    props.bottomSheetChoice === opt
                      ? 'border-[#0056FF] bg-[#0056FF]/10 text-[#0056FF]'
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white',
                  )}
                >
                  <span>{opt}</span>
                  {props.bottomSheetChoice === opt && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[#0056FF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Selected Action: {props.bottomSheetChoice}
          </span>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-2">
          <GeometricButton variant="primary" onClick={() => props.setDialogOpen(true)}>
            <span>Open Decision Modal</span>
          </GeometricButton>

          {/* In-Stage Interactive Decision Dialog Container */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
            <h4 className="font-sans text-sm font-bold text-slate-900">
              Confirm Enrollment Deferral
            </h4>
            <p className="mt-1 font-sans text-xs text-slate-600">
              This action defers student STU-2026-0891 to Academic Term 2027. Pending tuition fees
              will be preserved.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => props.setDialogDecision('Cancelled / Preserved')}
                className="rounded-lg border border-slate-200 px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => props.setDialogDecision('Confirmed (Deferred to 2027)')}
                className="rounded-lg bg-[#0056FF] px-3.5 py-1.5 font-sans text-xs font-bold text-white transition-colors hover:bg-[#0040C0]"
              >
                Confirm Deferral
              </button>
            </div>
          </div>

          <span className="font-mono text-[11px] text-slate-500">
            Decision Status: {props.dialogDecision}
          </span>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-3 py-4">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-2 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
            <div className="flex items-center justify-around">
              {props.bottomNavItems.map((item) => {
                const isActive = props.bottomNavTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => props.setBottomNavTab(item.id)}
                    className={cn(
                      'flex flex-col items-center gap-1 rounded-xl border px-4 py-2 transition-all select-none',
                      isActive
                        ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_8px_rgba(0,86,255,0.2)]'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-950',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-sans text-[11px] tracking-wider uppercase">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Active Screen View: {props.bottomNavTab.toUpperCase()}
          </span>
        </div>
      );

    case 'switch':
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex items-center gap-3 rounded-xl border border-slate-200/80 bg-white px-5 py-3 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
            <span className="font-sans text-xs font-semibold text-slate-800">
              System Telemetry Probe
            </span>
            <LibrarySwitch checked={props.switchState} onCheckedChange={props.setSwitchState} />
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            {props.switchState
              ? 'ONLINE — Real-time telemetry streaming active'
              : 'OFFLINE — Telemetry paused'}
          </span>
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'Academics', 'Students', 'Finance', 'Attendance', 'Graduation'].map(
              (label) => (
                <LibraryChip
                  key={label}
                  active={props.selectedChip === label}
                  onClick={() => props.setSelectedChip(label)}
                >
                  {label}
                </LibraryChip>
              ),
            )}
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Active Filter: {props.selectedChip}
          </span>
        </div>
      );

    case 'fab':
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <div className="flex items-center gap-4">
            <LibraryFab
              label="Quick Action"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => props.setFabCount((c) => c + 1)}
              className="bg-[#0056FF] text-white hover:bg-[#0040C0]"
            />
            <button
              type="button"
              onClick={() => props.setFabCount(0)}
              className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 font-sans text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Reset
            </button>
          </div>
          <span className="font-mono text-xs text-slate-600">
            Total Tap Events Recorded: {props.fabCount}
          </span>
        </div>
      );

    case 'card':
      return (
        <div className="w-full max-w-xs py-4">
          <LibraryCard className="rounded-2xl border border-slate-200/80 bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md">
            <LibraryCardMedia className="relative flex h-24 w-full items-start justify-between rounded-lg bg-gradient-to-r from-blue-100 to-[#0056FF] p-3">
              <span className="rounded-full border border-white/40 bg-[#0056FF] px-2.5 py-0.5 font-sans text-[10px] font-bold text-white shadow-xs">
                {props.cardEnrolled ? 'ENROLLED' : 'AVAILABLE'}
              </span>
            </LibraryCardMedia>
            <LibraryCardHeader>
              <LibraryCardTitle className="text-base font-bold text-slate-900">
                Autonomous Robotics
              </LibraryCardTitle>
              <LibraryCardDescription className="text-xs text-slate-500">
                Sensors, telemetry & embedded systems.
              </LibraryCardDescription>
            </LibraryCardHeader>
            <LibraryCardFooter className="flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="font-sans text-xs font-bold text-slate-600">3 CREDITS</span>
              <GeometricButton
                size="sm"
                variant={props.cardEnrolled ? 'primary' : 'outline'}
                isActive={props.cardEnrolled}
                onClick={() => props.setCardEnrolled(!props.cardEnrolled)}
              >
                <Star className="h-3.5 w-3.5" />
                <span>{props.cardEnrolled ? 'Enrolled' : 'Enroll'}</span>
              </GeometricButton>
            </LibraryCardFooter>
          </LibraryCard>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full max-w-xs flex-col items-center gap-3 py-6">
          <LibraryDropdown
            label="Typography Engine"
            value={props.dropdownValue}
            onChange={(val) => props.setDropdownValue(val)}
            options={[
              {
                value: 'sora',
                label: 'Sora — Primary Brand Typography',
                description: 'Google Fonts geometric sans',
              },
              {
                value: 'inter',
                label: 'Inter — UI Standard Sans',
                description: 'Functional UI sans',
              },
              {
                value: 'mono',
                label: 'IBM Plex Mono — Code Standards',
                description: 'Monospace data display',
              },
              {
                value: 'roboto',
                label: 'Roboto — Material M3',
                description: 'Expressive enterprise sans',
              },
            ]}
          />
          <span className="font-mono text-[11px] text-slate-500">
            Selected Font Token: {props.dropdownValue.toUpperCase()}
          </span>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex items-center justify-center gap-3">
            <LibraryTooltip content="Move Tool (Select & Transform)" shortcut="V">
              <button
                type="button"
                onClick={() => props.setActiveTool('Move Tool (V)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] transition-all select-none',
                  props.activeTool === 'Move Tool (V)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200/80 bg-white/90 text-slate-800 hover:border-[#0056FF] hover:bg-slate-50',
                )}
              >
                V
              </button>
            </LibraryTooltip>

            <LibraryTooltip content="Hand Tool (Pan Canvas)" shortcut="H">
              <button
                type="button"
                onClick={() => props.setActiveTool('Hand Tool (H)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] transition-all select-none',
                  props.activeTool === 'Hand Tool (H)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200/80 bg-white/90 text-slate-800 hover:border-[#0056FF] hover:bg-slate-50',
                )}
              >
                H
              </button>
            </LibraryTooltip>

            <LibraryTooltip content="Inspect Element" shortcut="Cmd+I">
              <button
                type="button"
                onClick={() => props.setActiveTool('Inspect Element (Cmd+I)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] transition-all select-none',
                  props.activeTool === 'Inspect Element (Cmd+I)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200/80 bg-white/90 text-slate-800 hover:border-[#0056FF] hover:bg-slate-50',
                )}
              >
                I
              </button>
            </LibraryTooltip>

            <LibraryTooltip content="Quick Enroll Student" shortcut="E">
              <button
                type="button"
                onClick={() => props.setActiveTool('Quick Enroll Student (E)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] transition-all select-none',
                  props.activeTool === 'Quick Enroll Student (E)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200/80 bg-white/90 text-slate-800 hover:border-[#0056FF] hover:bg-slate-50',
                )}
              >
                E
              </button>
            </LibraryTooltip>
          </div>
          <span className="font-mono text-[11px] text-slate-500">
            Active Tool Selected: {props.activeTool}
          </span>
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex w-full max-w-lg flex-col items-center gap-4 py-4">
          {/* Top Bar Ceiling with Hanging Tabs */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="rounded-t-xl border-b border-slate-300 bg-slate-100/80 px-4 pt-3 pb-0">
              <div className="flex items-center justify-between pb-2">
                <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Application Header
                </span>
                <span className="font-mono text-[10px] text-slate-500">SNP-SMS v2.4</span>
              </div>
              <div className="-mb-[1px] flex justify-center">
                <HangingTabsNav
                  activeId={props.hangingNavTab}
                  onSelect={props.setHangingNavTab}
                  size={props.hangingNavSize}
                  items={[
                    { id: 'map', label: 'Map', icon: Pin },
                    {
                      id: 'newswire',
                      label: 'Newswire',
                      icon: Newspaper,
                      badge: props.hangingNavBadge > 0 ? props.hangingNavBadge : undefined,
                      badgeColor: 'blue',
                    },
                    { id: 'post', label: 'Post', icon: FilePlus },
                    { id: 'friends', label: 'Friends', icon: Contacts },
                  ]}
                />
              </div>
            </div>
            <div className="p-4 text-center">
              <span className="font-mono text-xs text-slate-600">
                Active Tab:{' '}
                <strong className="text-[#0056FF]">{props.hangingNavTab.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          {/* Interactive Controls */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            <div className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white p-1">
              {(['sm', 'md', 'lg'] as const).map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => props.setHangingNavSize(sz)}
                  className={cn(
                    'rounded px-2.5 py-1 font-mono text-[11px] font-bold uppercase transition-all select-none',
                    props.hangingNavSize === sz
                      ? 'bg-[#0056FF] text-white'
                      : 'text-slate-600 hover:bg-slate-100',
                  )}
                >
                  {sz}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1 font-mono text-xs">
              <span className="text-slate-500">Badge:</span>
              <button
                type="button"
                onClick={() => props.setHangingNavBadge((b) => Math.max(0, b - 1))}
                className="rounded px-1.5 py-0.5 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <span className="font-bold text-[#0056FF]">{props.hangingNavBadge}</span>
              <button
                type="button"
                onClick={() => props.setHangingNavBadge((b) => b + 1)}
                className="rounded px-1.5 py-0.5 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
}
