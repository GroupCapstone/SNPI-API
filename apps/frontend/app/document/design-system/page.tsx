'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  BrandConceptBlueprint,
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
  LibraryDropdown,
  LibraryTooltip,
  DualModeSystemUI,
  HangingTabsNav,
  COMPONENT_LIBRARY_REGISTRY,
  GeometricButton,
  GeometricInput,
  GeometricHeaderStamp,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  Plus,
  MapPin,
  Check,
  Code,
  Copy,
  Layers,
  Pin,
  Newspaper,
  FilePlus,
  Contacts,
  Eye,
  EyeOff,
  User,
  SlidersHorizontal,
  ChevronDown,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function DesignSystemPage() {
  // Search query to filter components
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Per-component tab view state: 'preview' | 'usage' | 'code'
  const [componentTabs, setComponentTabs] = React.useState<
    Record<string, 'preview' | 'usage' | 'code'>
  >({});

  const getCompTab = (id: string): 'preview' | 'usage' | 'code' => componentTabs[id] || 'preview';

  const setCompTab = (id: string, tab: 'preview' | 'usage' | 'code') => {
    setComponentTabs((prev) => ({ ...prev, [id]: tab }));
  };

  // Active section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('how-it-works');

  // Copy tracking states
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);
  const [copiedInstallId, setCopiedInstallId] = React.useState<string | null>(null);

  // --- Interactive State for Real Demos in the Feed ---

  // 1. Snackbar state
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState(
    'Student enrollment confirmed for STU-2026-0891.',
  );

  // 2. Bottom Sheet state
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [bottomSheetChoice, setBottomSheetChoice] = React.useState(
    'Export Student Roster (CSV / PDF)',
  );

  // 3. Dialog state
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dialogDecision, setDialogDecision] = React.useState('Pending');

  // 4. Tooltip state
  const [activeTool, setActiveTool] = React.useState('Move Tool (V)');
  const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'bottom'>('top');

  // 5. FAB state
  const [fabCount, setFabCount] = React.useState(0);
  const [fabSpeedDialOpen, setFabSpeedDialOpen] = React.useState(false);

  // 6. Chip state
  const [selectedChips, setSelectedChips] = React.useState<string[]>(['All', 'Enrolled']);

  const toggleChip = (label: string) => {
    if (label === 'All') {
      setSelectedChips(['All']);
      return;
    }
    const withoutAll = selectedChips.filter((c) => c !== 'All');
    if (withoutAll.includes(label)) {
      const next = withoutAll.filter((c) => c !== label);
      setSelectedChips(next.length === 0 ? ['All'] : next);
    } else {
      setSelectedChips([...withoutAll, label]);
    }
  };

  // 7. Toggle Switch states
  const [switchAutoSync, setSwitchAutoSync] = React.useState(true);
  const [switchBiometric, setSwitchBiometric] = React.useState(true);
  const [switchSMSAlerts, setSwitchSMSAlerts] = React.useState(false);

  // 8. Dropdown state
  const [dropdownValue, setDropdownValue] = React.useState('sora');

  // 9. Bottom Nav state
  const [bottomNavTab, setBottomNavTab] = React.useState('home');
  const [bottomNavBadge, setBottomNavBadge] = React.useState(8);

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // 10. Card interactive states (Folder mode & Metrics mode)
  const [cardPresentationMode, setCardPresentationMode] = React.useState<'folder' | 'metrics'>(
    'folder',
  );
  const [cardRevealed, setCardRevealed] = React.useState(false);
  const [cardSlidOut, setCardSlidOut] = React.useState(false);
  const [metricsTimeRange, setMetricsTimeRange] = React.useState<'30D' | '90D' | '1Y' | 'All'>(
    '30D',
  );

  // 11. Hanging Tabs state
  const [hangingNavTab, setHangingNavTab] = React.useState('newswire');
  const [hangingNavSize, setHangingNavSize] = React.useState<'sm' | 'md' | 'lg'>('md');

  // 12. Input & Search state
  const [inputDemoText, setInputDemoText] = React.useState('Dara Sok');
  const [inputDemoVariant, setInputDemoVariant] = React.useState<
    'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline'
  >('blue');
  const [inputDemoSize, setInputDemoSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [inputDemoLoading, setInputDemoLoading] = React.useState(false);
  const [inputDemoDisabled, setInputDemoDisabled] = React.useState(false);

  // Headings for Right Sidebar Line Tracker (Real-time Scroll Feed)
  const tocHeadings: TocHeadingItem[] = React.useMemo(
    () => [
      { id: 'how-it-works', title: 'SNPI-SMS Design System: how it works', level: 1 },
      { id: 'top-nav-style', title: 'Top Navigation Hanging Tabs Style', level: 1 },
      { id: 'interactive-feed', title: 'Component Catalog (12 Core UI)', level: 1 },
      { id: 'comp-snackbar', title: '1. Snackbar', level: 2 },
      { id: 'comp-bottom-sheet', title: '2. Bottom Sheet', level: 2 },
      { id: 'comp-dialog', title: '3. Dialog', level: 2 },
      { id: 'comp-tooltip', title: '4. Tooltip', level: 2 },
      { id: 'comp-fab', title: '5. FAB', level: 2 },
      { id: 'comp-chip', title: '6. Chip', level: 2 },
      { id: 'comp-switch', title: '7. Toggle Switch', level: 2 },
      { id: 'comp-dropdown', title: '8. Dropdown', level: 2 },
      { id: 'comp-bottom-nav', title: '9. Bottom Nav', level: 2 },
      { id: 'comp-card', title: '10. Card (Folder & Metrics)', level: 2 },
      { id: 'comp-hanging-tabs-nav', title: '11. Hanging Tabs', level: 2 },
      { id: 'comp-input', title: '12. Pill Input & Search', level: 2 },
      { id: 'brand-blueprint', title: 'Brand Blueprint (#0056FF)', level: 1 },
      { id: 'dual-mode-system', title: 'Dual Mode System UI', level: 1 },
      { id: 'design-principles', title: 'Design Standards & Policies', level: 1 },
      { id: 'touch-targets', title: 'Touch Targets & Accessibility', level: 2 },
    ],
    [],
  );

  // Filter 12 components in real-time
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

  // Smooth scroll helper with header offset clearance
  const scrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const top = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  // Real-time scroll spy for tracking point lines
  React.useEffect(() => {
    const handleScroll = () => {
      const isAtBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
      if (isAtBottom) {
        setActiveSectionId('design-principles');
        return;
      }

      const scrollPosition = window.scrollY + 140;
      for (let i = tocHeadings.length - 1; i >= 0; i--) {
        const item = tocHeadings[i];
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY;
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

  const handleCopyCode = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleCopyInstall = (id: string, cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstallId(id);
    setTimeout(() => setCopiedInstallId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-[#0056FF] selection:text-white">
      {/* Main Grid Container */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* COLUMN 1: Left Sticky Sidebar Navigation */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Filter Input */}
              <GeometricInput
                inputSize="sm"
                placeholder="Filter components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-3.5 w-3.5 text-[#0056FF]" />}
              />

              {/* Navigation Quick Links */}
              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-1.5">
                  <GeometricButton
                    variant="blue"
                    size="sm"
                    isActive={
                      activeSectionId === 'how-it-works' ||
                      activeSectionId === 'top-nav-style' ||
                      activeSectionId === 'interactive-feed' ||
                      activeSectionId === 'comp-snackbar'
                    }
                    onClick={() => scrollToSection('how-it-works')}
                    className="w-full justify-start"
                  >
                    <span>Catalog</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="azure"
                    size="sm"
                    isActive={activeSectionId === 'comp-card'}
                    onClick={() => scrollToSection('comp-card')}
                    className="w-full justify-start"
                  >
                    <span>Playground</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="soft-lavender"
                    size="sm"
                    isActive={activeSectionId === 'brand-blueprint'}
                    onClick={() => scrollToSection('brand-blueprint')}
                    className="w-full justify-start"
                  >
                    <span>Brand Colors</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="black"
                    size="sm"
                    isActive={activeSectionId === 'dual-mode-system'}
                    onClick={() => scrollToSection('dual-mode-system')}
                    className="w-full justify-start"
                  >
                    <span>Dual Mode UI</span>
                  </GeometricButton>
                </div>

                {/* 12 Core UI Components List with Active Highlights */}
                <div className="border-t border-slate-200/80 pt-3">
                  <div className="flex items-center justify-between pb-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>Components</span>
                    <span className="text-[#0056FF]">{filteredComponents.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredComponents.length === 0 ? (
                      <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                        No matching components found
                      </div>
                    ) : (
                      filteredComponents.map((comp) => {
                        const targetId = `comp-${comp.id}`;
                        const isCurrentActive = activeSectionId === targetId;
                        return (
                          <button
                            key={comp.id}
                            type="button"
                            onClick={() => scrollToSection(targetId)}
                            className={cn(
                              'flex w-full cursor-pointer items-center gap-2.5 rounded-full border px-3.5 py-1.5 text-left font-sans text-xs font-semibold transition-all',
                              isCurrentActive
                                ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                                : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
                            )}
                          >
                            <span
                              className={cn(
                                'size-1.5 rounded-full transition-colors',
                                isCurrentActive ? 'bg-white' : 'bg-slate-400',
                              )}
                            />
                            <span className="truncate">{comp.name}</span>
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Interactive Component Feed (1-Column Continuous Scroll Feed) */}
          <main className="space-y-12 lg:col-span-6">
            {/* SECTION 1: How It Works & Architecture Overview */}
            <section id="how-it-works" className="scroll-mt-24 space-y-4">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
                    SNPI-SMS Design System: how it works
                  </h1>
                </div>
                <GeometricHeaderStamp codeA="20" titleA="SYSTEM" codeB="26" titleB="DOCS" />
              </div>

              <p className="font-sans text-sm leading-relaxed text-slate-600">
                When you build or extend interfaces in SNPI-SMS, the Design System enforces visual
                cohesion, strict flat aesthetics, and luminance-based depth before any code reaches
                production. It does not matter whether the view is an institutional dashboard, a
                public verification portal, or a mobile portal. If it runs on SNPI-SMS, it follows
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
            </section>

            {/* SECTION 2: Top Navigation Hanging Tabs Style */}
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
                      SNPI-SMS Design Standard
                    </span>
                  </div>

                  <div className="flex items-end justify-center">
                    <HangingTabsNav
                      items={[
                        { id: 'map', label: 'Map', icon: MapPin },
                        { id: 'newswire', label: 'Newswire', icon: Newspaper },
                        { id: 'post', label: 'Post', icon: FilePlus },
                        { id: 'friends', label: 'Friends', icon: Contacts },
                      ]}
                      activeId={hangingNavTab}
                      onSelect={(tabId) => setHangingNavTab(tabId)}
                      size={hangingNavSize}
                    />
                  </div>
                </div>

                {/* Sub-bar Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-white px-5 py-3 font-sans">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">Active Tab:</span>
                    <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF] uppercase">
                      {hangingNavTab}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {(['sm', 'md', 'lg'] as const).map((sz) => (
                      <GeometricButton
                        key={sz}
                        variant={hangingNavSize === sz ? 'blue' : 'outline'}
                        size="sm"
                        isActive={hangingNavSize === sz}
                        onClick={() => setHangingNavSize(sz)}
                      >
                        {sz.toUpperCase()}
                      </GeometricButton>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* SECTION 3: 12 Core UI Components Single Scroll Feed */}
            <div
              id="interactive-feed"
              className="scroll-mt-24 space-y-2 border-t border-slate-200/80 pt-8 pb-2"
            >
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  Single Feed Mode
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  12 Interactive Demos · Live Keyboard Ready
                </span>
              </div>
              <h2 className="font-sans text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                Component Catalog (12 Core UI)
              </h2>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Scroll through the complete interactive component feed. Every component is fully
                tapable with real states, realistic content, accessibility targets, and copyable
                code.
              </p>
            </div>

            {/* THE 12 REAL INTERACTIVE COMPONENT DEMOS (STACKED VERTICALLY IN ONE CONTINUOUS FEED) */}
            <div className="space-y-14">
              {filteredComponents.map((comp, idx) => {
                const sectionId = `comp-${comp.id}`;
                const currentTab = getCompTab(comp.id);

                return (
                  <section
                    key={comp.id}
                    id={sectionId}
                    className="scroll-mt-24 space-y-4 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-[#0056FF]/40 sm:p-6"
                  >
                    {/* Component Card Header */}
                    <div className="flex flex-col justify-between gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black text-[#0056FF]">
                            0{idx + 1}.
                          </span>
                          <h2 className="font-sans text-xl font-black text-slate-950">
                            {comp.name}
                          </h2>
                          <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                            {comp.paradigm}
                          </span>
                          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 uppercase">
                            {comp.category}
                          </span>
                        </div>
                        <p className="mt-1 font-sans text-xs text-slate-600">{comp.description}</p>
                      </div>

                      {/* Triple Tabs: Preview | Usage | Code */}
                      <div className="flex shrink-0 items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                        {(['preview', 'usage', 'code'] as const).map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setCompTab(comp.id, t)}
                            className={cn(
                              'cursor-pointer rounded-full px-3 py-1 font-sans text-[11px] font-bold transition-all',
                              currentTab === t
                                ? 'bg-[#0056FF] text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900',
                            )}
                          >
                            {t === 'preview' ? 'Preview' : t === 'usage' ? 'Usage' : 'Code'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* TAB CONTENT: PREVIEW */}
                    {currentTab === 'preview' && (
                      <div className="space-y-4">
                        {/* Live Interactive Stage Canvas */}
                        <div className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-2xl border border-slate-200/90 bg-[#F8FAFC] p-6 shadow-inner">
                          {/* Subtle Dot Grid */}
                          <div
                            className="pointer-events-none absolute inset-0 opacity-30"
                            style={{
                              backgroundImage:
                                'radial-gradient(circle at 1px 1px, #CAD3F5 1px, transparent 0)',
                              backgroundSize: '16px 16px',
                            }}
                          />

                          {/* Real Functional Component Demo in Place */}
                          <div className="relative z-10 w-full max-w-md">
                            {renderFeedComponentDemo(comp.id, {
                              snackbarOpen,
                              setSnackbarOpen,
                              snackbarMsg,
                              setSnackbarMsg,
                              sheetOpen,
                              setSheetOpen,
                              bottomSheetChoice,
                              setBottomSheetChoice,
                              dialogOpen,
                              setDialogOpen,
                              dialogDecision,
                              setDialogDecision,
                              activeTool,
                              setActiveTool,
                              tooltipPosition,
                              setTooltipPosition,
                              fabCount,
                              setFabCount,
                              fabSpeedDialOpen,
                              setFabSpeedDialOpen,
                              selectedChips,
                              toggleChip,
                              switchAutoSync,
                              setSwitchAutoSync,
                              switchBiometric,
                              setSwitchBiometric,
                              switchSMSAlerts,
                              setSwitchSMSAlerts,
                              dropdownValue,
                              setDropdownValue,
                              bottomNavTab,
                              setBottomNavTab,
                              bottomNavBadge,
                              setBottomNavBadge,
                              bottomNavItems,
                              cardPresentationMode,
                              setCardPresentationMode,
                              cardRevealed,
                              setCardRevealed,
                              cardSlidOut,
                              setCardSlidOut,
                              metricsTimeRange,
                              setMetricsTimeRange,
                              hangingNavTab,
                              setHangingNavTab,
                              hangingNavSize,
                              setHangingNavSize,
                              inputDemoText,
                              setInputDemoText,
                              inputDemoVariant,
                              setInputDemoVariant,
                              inputDemoSize,
                              setInputDemoSize,
                              inputDemoLoading,
                              setInputDemoLoading,
                              inputDemoDisabled,
                              setInputDemoDisabled,
                            })}
                          </div>
                        </div>

                        {/* Supported States & Install Banner */}
                        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs">
                          <div className="flex flex-wrap items-center gap-1.5 font-mono text-[10px]">
                            <span className="font-bold text-slate-400 uppercase">States:</span>
                            {comp.supportedStates.map((st) => (
                              <span
                                key={st}
                                className="rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-semibold text-slate-700"
                              >
                                {st}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center gap-2">
                            <code className="font-mono text-[11px] text-[#0056FF]">
                              npx @snp/cli add {comp.id}
                            </code>
                            <button
                              type="button"
                              onClick={() =>
                                handleCopyInstall(comp.id, `npx @snp/cli add ${comp.id}`)
                              }
                              className="rounded-full border border-slate-200 px-2 py-0.5 font-mono text-[10px] font-semibold text-slate-600 hover:border-[#0056FF] hover:text-[#0056FF]"
                            >
                              {copiedInstallId === comp.id ? 'Copied' : 'Copy'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: USAGE */}
                    {currentTab === 'usage' && (
                      <div className="space-y-4 pt-2">
                        <div className="space-y-1.5 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-4">
                          <h4 className="font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
                            Mental Model & Paradigm
                          </h4>
                          <p className="font-sans text-xs leading-relaxed text-slate-600">
                            {comp.explanation}
                          </p>
                        </div>

                        {/* Real-world Scenarios */}
                        <div className="space-y-2">
                          <h4 className="font-sans text-xs font-bold tracking-wider text-slate-900 uppercase">
                            Production Scenarios
                          </h4>
                          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            {comp.realWorldExamples.map((ex, i) => (
                              <div
                                key={i}
                                className="rounded-xl border border-slate-200/90 bg-white p-3 text-xs"
                              >
                                <span className="font-mono text-[10px] font-bold text-[#0056FF]">
                                  0{i + 1}. {ex.title}
                                </span>
                                <p className="mt-1 font-sans text-[11px] text-slate-600">
                                  {ex.scenario}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Do's & Don'ts */}
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/40 p-3 text-xs">
                            <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                              Best Practices (DO)
                            </span>
                            <ul className="space-y-1 font-sans text-[11px] text-slate-700">
                              {comp.usageGuidelines.map((g, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="mt-1 size-1 shrink-0 rounded-full bg-[#0056FF]" />
                                  <span>{g.doItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div className="space-y-1.5 rounded-xl border border-slate-900 bg-[#000B26] p-3 text-xs text-white">
                            <span className="font-mono text-[10px] font-bold text-[#CAD3F5] uppercase">
                              Anti-Patterns (DON&apos;T)
                            </span>
                            <ul className="space-y-1 font-sans text-[11px] text-slate-300">
                              {comp.usageGuidelines.map((g, i) => (
                                <li key={i} className="flex items-start gap-1.5">
                                  <span className="mt-1 size-1 shrink-0 rounded-full bg-slate-400" />
                                  <span>{g.dontItem}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* TAB CONTENT: CODE */}
                    {currentTab === 'code' && (
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-700">
                            React / TypeScript Source
                          </span>
                          <GeometricButton
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopyCode(comp.id, comp.codeSnippet)}
                            icon={
                              copiedCodeId === comp.id ? (
                                <Check className="size-3 text-[#0056FF]" />
                              ) : (
                                <Copy className="size-3 text-slate-600" />
                              )
                            }
                          >
                            {copiedCodeId === comp.id ? 'Copied' : 'Copy Code'}
                          </GeometricButton>
                        </div>
                        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#000B26] p-4 text-white shadow-md">
                          <pre className="max-h-72 overflow-auto font-mono text-xs leading-relaxed text-slate-100">
                            <code>{comp.codeSnippet}</code>
                          </pre>
                        </div>
                      </div>
                    )}
                  </section>
                );
              })}
            </div>

            {/* SECTION: Brand Colors Blueprint */}
            <section
              id="brand-blueprint"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <BrandConceptBlueprint />
            </section>

            {/* SECTION: Dual Mode System UI */}
            <section
              id="dual-mode-system"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <DualModeSystemUI />
            </section>

            {/* SECTION: Design Standards & Policies */}
            <section
              id="design-principles"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <h2 className="font-sans text-xl font-bold text-slate-950">
                Flat Design & Zero Shadows Policy
              </h2>
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

          {/* COLUMN 3: Right Sidebar Line Tracker (Real-time Scroll Tracker) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <LineTrackerToc
              items={tocHeadings}
              activeId={activeSectionId}
              onSelect={scrollToSection}
              onActiveChange={setActiveSectionId}
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
        title="Campus Infrastructure Operations"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Siem Reap Science Wing B · Active student roster exports and telemetry diagnostics.
          </p>
          <GeometricButton variant="blue" className="w-full" onClick={() => setSheetOpen(false)}>
            Close Sheet
          </GeometricButton>
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
        onConfirm={() => {
          setDialogOpen(false);
          setDialogDecision('Revocation Confirmed');
        }}
      />
    </div>
  );
}

/**
 * Dedicated Real Interactive Component Demos inside the Single Scroll Feed
 * STRICTLY using the docs brand palette (#0056FF, #2277FF, #000B26, #E3E7FC, #CAD3F5, #FFFFFF)
 */
function renderFeedComponentDemo(
  id: string,
  state: {
    snackbarOpen: boolean;
    setSnackbarOpen: (o: boolean) => void;
    snackbarMsg: string;
    setSnackbarMsg: (m: string) => void;
    sheetOpen: boolean;
    setSheetOpen: (o: boolean) => void;
    bottomSheetChoice: string;
    setBottomSheetChoice: (c: string) => void;
    dialogOpen: boolean;
    setDialogOpen: (o: boolean) => void;
    dialogDecision: string;
    setDialogDecision: (d: string) => void;
    activeTool: string;
    setActiveTool: (t: string) => void;
    tooltipPosition: 'top' | 'bottom';
    setTooltipPosition: (p: 'top' | 'bottom') => void;
    fabCount: number;
    setFabCount: React.Dispatch<React.SetStateAction<number>>;
    fabSpeedDialOpen: boolean;
    setFabSpeedDialOpen: (o: boolean) => void;
    selectedChips: string[];
    toggleChip: (l: string) => void;
    switchAutoSync: boolean;
    setSwitchAutoSync: (s: boolean) => void;
    switchBiometric: boolean;
    setSwitchBiometric: (s: boolean) => void;
    switchSMSAlerts: boolean;
    setSwitchSMSAlerts: (s: boolean) => void;
    dropdownValue: string;
    setDropdownValue: (v: string) => void;
    bottomNavTab: string;
    setBottomNavTab: (t: string) => void;
    bottomNavBadge: number;
    setBottomNavBadge: React.Dispatch<React.SetStateAction<number>>;
    bottomNavItems: LibraryBottomNavItem[];
    cardPresentationMode: 'folder' | 'metrics';
    setCardPresentationMode: (m: 'folder' | 'metrics') => void;
    cardRevealed: boolean;
    setCardRevealed: (r: boolean) => void;
    cardSlidOut: boolean;
    setCardSlidOut: (s: boolean) => void;
    metricsTimeRange: '30D' | '90D' | '1Y' | 'All';
    setMetricsTimeRange: (r: '30D' | '90D' | '1Y' | 'All') => void;
    hangingNavTab: string;
    setHangingNavTab: (t: string) => void;
    hangingNavSize: 'sm' | 'md' | 'lg';
    setHangingNavSize: (s: 'sm' | 'md' | 'lg') => void;
    inputDemoText: string;
    setInputDemoText: (t: string) => void;
    inputDemoVariant: 'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline';
    setInputDemoVariant: (v: 'blue' | 'azure' | 'soft-lavender' | 'black' | 'outline') => void;
    inputDemoSize: 'sm' | 'md' | 'lg';
    setInputDemoSize: (s: 'sm' | 'md' | 'lg') => void;
    inputDemoLoading: boolean;
    setInputDemoLoading: (l: boolean) => void;
    inputDemoDisabled: boolean;
    setInputDemoDisabled: (d: boolean) => void;
  },
) {
  switch (id) {
    case 'snackbar':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Student enrollment confirmed for STU-2026-0891.');
                state.setSnackbarOpen(true);
              }}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Trigger Success</span>
            </GeometricButton>
            <GeometricButton
              variant="azure"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Batch attendance cloud sync in progress.');
                state.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Info</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setSnackbarMsg('Tuition payment gateway timed out.');
                state.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Error</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                state.setSnackbarOpen(false);
                state.setSnackbarMsg('Notification dismissed.');
              }}
            >
              <span>Reset</span>
            </GeometricButton>
          </div>

          {/* Interactive In-Stage Snackbar Card */}
          <div className="w-full rounded-2xl border border-slate-900 bg-[#000B26] p-4 text-white shadow-lg">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2 animate-pulse rounded-full bg-[#0056FF]" />
                <span className="font-sans text-xs">{state.snackbarMsg}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => state.setSnackbarMsg('Action reverted successfully.')}
                  className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-1 font-mono text-[11px] font-bold text-[#0056FF] transition-transform active:scale-95"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => state.setSnackbarOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-white"
                >
                  <span className="font-mono text-xs">Dismiss</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => state.setSheetOpen(true)}>
              <MapPin className="h-3.5 w-3.5" />
              <span>Open Modal Sheet</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => state.setBottomSheetChoice('None Selected')}
            >
              <span>Reset</span>
            </GeometricButton>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between pb-1">
              <h4 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase">
                Quick Campus Operations
              </h4>
              <span className="font-mono text-[10px] text-[#0056FF]">3 Actions</span>
            </div>
            <div className="mt-2.5 space-y-1.5 font-sans text-xs">
              {[
                'Export Student Roster (CSV / PDF)',
                'Generate Monthly Attendance Matrix',
                'Batch Dispatch SMS Announcement',
              ].map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => state.setBottomSheetChoice(opt)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border p-2.5 text-left font-semibold transition-all select-none',
                    state.bottomSheetChoice === opt
                      ? 'border-[#0056FF] bg-[#E3E7FC] text-[#0056FF]'
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white',
                  )}
                >
                  <span>{opt}</span>
                  {state.bottomSheetChoice === opt && (
                    <span className="size-2 rounded-full bg-[#0056FF]" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => state.setDialogOpen(true)}>
              <span>Open Modal Dialog</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => state.setDialogDecision('Pending')}
            >
              <span>Reset</span>
            </GeometricButton>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-sans text-sm font-bold text-slate-900">
                Confirm Enrollment Deferral
              </h4>
              <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Action Required
              </span>
            </div>
            <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
              This action defers student STU-2026-0891 to Academic Term 2027. Pending tuition fees
              will be preserved and classroom seat allocation released.
            </p>
            <div className="mt-4 flex items-center justify-end gap-2 border-t border-slate-100 pt-3">
              <GeometricButton
                size="sm"
                variant="outline"
                onClick={() => state.setDialogDecision('Cancelled')}
              >
                Cancel
              </GeometricButton>
              <GeometricButton
                size="sm"
                variant="blue"
                onClick={() => state.setDialogDecision('Confirmed (Deferred to 2027)')}
              >
                Confirm Deferral
              </GeometricButton>
            </div>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Decision: {state.dialogDecision}
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['top', 'bottom'] as const).map((pos) => (
              <GeometricButton
                key={pos}
                size="sm"
                variant={state.tooltipPosition === pos ? 'blue' : 'outline'}
                isActive={state.tooltipPosition === pos}
                onClick={() => state.setTooltipPosition(pos)}
              >
                Anchor {pos.toUpperCase()}
              </GeometricButton>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <LibraryTooltip
              content="Move Tool (Select & Transform)"
              shortcut="V"
              position={state.tooltipPosition}
            >
              <button
                type="button"
                onClick={() => state.setActiveTool('Move Tool (V)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition-all select-none',
                  state.activeTool === 'Move Tool (V)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-[#0056FF]',
                )}
              >
                V
              </button>
            </LibraryTooltip>

            <LibraryTooltip content="Save Record" shortcut="⌘S" position={state.tooltipPosition}>
              <button
                type="button"
                onClick={() => state.setActiveTool('Save Record (⌘S)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition-all select-none',
                  state.activeTool === 'Save Record (⌘S)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-[#0056FF]',
                )}
              >
                S
              </button>
            </LibraryTooltip>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Active Tool: {state.activeTool}
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => state.setFabSpeedDialOpen(!state.fabSpeedDialOpen)}
            >
              Toggle Speed Dial
            </GeometricButton>
            <GeometricButton variant="outline" size="sm" onClick={() => state.setFabCount(0)}>
              Reset Counter
            </GeometricButton>
          </div>

          <div className="relative flex items-center justify-center gap-4 py-2">
            {state.fabSpeedDialOpen && (
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Add Student
                </span>
                <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Attendance
                </span>
                <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Invoice
                </span>
              </div>
            )}

            <LibraryFab
              label="Quick Action"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => state.setFabCount((c) => c + 1)}
              className="bg-[#0056FF] text-white hover:bg-[#2277FF]"
            />
          </div>

          <div className="font-mono text-xs text-slate-600">Tap Count: {state.fabCount}</div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {['All', 'Academics', 'Students', 'Finance', 'Attendance', 'Graduation'].map(
              (label) => {
                const isActive = state.selectedChips.includes(label);
                return (
                  <LibraryChip
                    key={label}
                    active={isActive}
                    onClick={() => state.toggleChip(label)}
                  >
                    {label}
                  </LibraryChip>
                );
              },
            )}
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Selected: {state.selectedChips.join(', ')}
          </div>
        </div>
      );

    case 'switch':
      return (
        <div className="flex w-full flex-col items-center gap-3">
          <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div>
              <span className="font-sans text-xs font-bold text-slate-900">
                Auto Sync Telemetry
              </span>
              <p className="font-sans text-[11px] text-slate-500">
                Live replica set change streams
              </p>
            </div>
            <LibrarySwitch
              checked={state.switchAutoSync}
              onCheckedChange={state.setSwitchAutoSync}
            />
          </div>

          <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div>
              <span className="font-sans text-xs font-bold text-slate-900">
                Biometric Terminal Active
              </span>
              <p className="font-sans text-[11px] text-slate-500">Hardware scanner connection</p>
            </div>
            <LibrarySwitch
              checked={state.switchBiometric}
              onCheckedChange={state.setSwitchBiometric}
            />
          </div>

          <div className="flex w-full items-center justify-between rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs">
            <div>
              <span className="font-sans text-xs font-bold text-slate-900">SMS Parent Alerts</span>
              <p className="font-sans text-[11px] text-slate-500">Automatic absence dispatch</p>
            </div>
            <LibrarySwitch
              checked={state.switchSMSAlerts}
              onCheckedChange={state.setSwitchSMSAlerts}
            />
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full max-w-xs flex-col items-center gap-4">
          <LibraryDropdown
            label="Brand Typography Engine"
            value={state.dropdownValue}
            onChange={(val) => state.setDropdownValue(val)}
            options={[
              {
                value: 'sora',
                label: 'Sora — Primary Typography',
                description: 'Google Fonts geometric sans',
              },
              {
                value: 'inter',
                label: 'Inter — UI Standard Sans',
                description: 'Functional clean UI sans',
              },
              {
                value: 'mono',
                label: 'IBM Plex Mono — Code Standards',
                description: 'Monospace data display',
              },
            ]}
          />

          <div className="font-mono text-[11px] text-slate-500">
            Selected: {state.dropdownValue.toUpperCase()}
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <div className="flex items-center justify-around">
              {state.bottomNavItems.map((item) => {
                const isActive = state.bottomNavTab === item.id;
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => state.setBottomNavTab(item.id)}
                    className={cn(
                      'relative flex flex-col items-center gap-1 rounded-xl border px-3 py-1.5 transition-all select-none',
                      isActive
                        ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-xs'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-950',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-sans text-[10px] tracking-wider uppercase">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Active Screen: {state.bottomNavTab.toUpperCase()}
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4">
          {/* Card Presentation Mode Switcher (Folder vs Metrics) */}
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('folder')}
              className={cn(
                'rounded-full px-3 py-1 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'folder'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Card Folder Mode
            </button>
            <button
              type="button"
              onClick={() => state.setCardPresentationMode('metrics')}
              className={cn(
                'rounded-full px-3 py-1 font-sans text-xs font-bold transition-all',
                state.cardPresentationMode === 'metrics'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Daily Metrics Mode
            </button>
          </div>

          {/* MODE 1: Interactive Card Folder (User Images 3 & 4 Style) */}
          {state.cardPresentationMode === 'folder' ? (
            <div className="relative w-full max-w-sm pt-4 select-none">
              {/* Sliding Credit / Student Card */}
              <div
                onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
                className={cn(
                  'relative mx-auto w-[92%] cursor-pointer rounded-2xl p-4 transition-all duration-300 ease-out',
                  'border border-slate-700/60 bg-gradient-to-br from-[#0B0E14] via-[#000B26] to-[#0056FF]',
                  'text-white shadow-lg',
                  state.cardSlidOut ? '-translate-y-8 scale-[1.02]' : 'translate-y-0',
                )}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                    SNPI STUDENT PASS
                  </span>
                  <div className="h-6 w-8 rounded-md border border-amber-300/40 bg-amber-400/20" />
                </div>

                <div className="mt-5 font-mono text-base font-bold tracking-widest text-slate-100">
                  {state.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                </div>

                <div className="mt-4 flex items-end justify-between font-mono text-xs">
                  <div>
                    <span className="block text-[9px] text-slate-400 uppercase">Student</span>
                    <span className="font-bold text-slate-100">DARA SOK</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-slate-400 uppercase">Valid Thru</span>
                    <span className="font-bold text-slate-100">08/29</span>
                  </div>
                  <div className="text-right">
                    <span className="block text-[9px] text-slate-400 uppercase">CVV</span>
                    <span className="font-bold text-[#CAD3F5]">
                      {state.cardRevealed ? '742' : '•••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Curved Folder Pocket Base */}
              <div className="relative z-20 -mt-12 w-full rounded-2xl border border-slate-200/90 bg-white p-4 text-slate-900 shadow-md">
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3">
                  <button
                    type="button"
                    onClick={() => state.setCardRevealed(!state.cardRevealed)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:border-[#0056FF]"
                  >
                    {state.cardRevealed ? (
                      <EyeOff className="size-3.5 text-[#0056FF]" />
                    ) : (
                      <Eye className="size-3.5 text-slate-600" />
                    )}
                    <span>{state.cardRevealed ? 'Hide Details' : 'Reveal Details'}</span>
                  </button>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">Expiry</span>
                      <strong className="text-slate-800">08/29</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">CVV</span>
                      <strong className="text-slate-800">
                        {state.cardRevealed ? '742' : '•••'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold">Dara Sok</h4>
                    <p className="font-mono text-[11px] text-slate-500">
                      {state.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => state.setCardSlidOut(!state.cardSlidOut)}
                    className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF]"
                  >
                    {state.cardSlidOut ? 'Insert Card' : 'Pull Card'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: Daily Active Students Metrics Card (User Image 2 Style) */
            <div className="w-full max-w-sm rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-bold">Daily active students</h4>
                  <p className="font-sans text-xs text-slate-500">12,340 a day · Term 1 2026</p>
                </div>

                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 font-mono text-[10px]">
                  {(['30D', '90D', '1Y', 'All'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => state.setMetricsTimeRange(r)}
                      className={cn(
                        'rounded-full px-2 py-0.5 font-bold transition-colors',
                        state.metricsTimeRange === r
                          ? 'bg-[#0056FF] text-white'
                          : 'text-slate-600 hover:text-slate-950',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span>Saturday, Oct 30, 2026</span>
                  <span className="font-bold text-[#0056FF]">+8.5% growth</span>
                </div>
                <div className="mt-1 font-sans text-2xl font-black text-slate-950">
                  10,119 students
                </div>
                <p className="mt-0.5 font-sans text-[11px] text-slate-600">
                  14,002 seven day average vs a week earlier
                </p>
              </div>

              <div className="mt-4 flex h-14 w-full items-end gap-1.5 pt-2">
                {[38, 45, 42, 58, 64, 60, 72, 68, 85, 92, 88, 100].map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${val}%` }}
                    className={cn(
                      'flex-1 rounded-t-sm transition-all duration-200 hover:opacity-80',
                      i >= 8 ? 'bg-[#0056FF]' : 'bg-[#E3E7FC]',
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 pt-3 pb-0">
              <div className="flex items-center justify-between pb-2">
                <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Header Navigation Ceiling
                </span>
                <span className="font-mono text-[10px] text-slate-500">SNPI-SMS v2.4</span>
              </div>
              <div className="-mb-[1px] flex justify-center">
                <HangingTabsNav
                  activeId={state.hangingNavTab}
                  onSelect={state.setHangingNavTab}
                  size={state.hangingNavSize}
                  items={[
                    { id: 'map', label: 'Map', icon: Pin },
                    { id: 'newswire', label: 'Newswire', icon: Newspaper },
                    { id: 'post', label: 'Post', icon: FilePlus },
                    { id: 'friends', label: 'Friends', icon: Contacts },
                  ]}
                />
              </div>
            </div>
            <div className="p-4 text-center">
              <span className="font-mono text-xs text-slate-600">
                Active Tab:{' '}
                <strong className="text-[#0056FF]">{state.hangingNavTab.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <GeometricButton
                key={sz}
                size="sm"
                variant={state.hangingNavSize === sz ? 'blue' : 'outline'}
                isActive={state.hangingNavSize === sz}
                onClick={() => state.setHangingNavSize(sz)}
              >
                {sz.toUpperCase()}
              </GeometricButton>
            ))}
          </div>
        </div>
      );

    case 'input':
      return (
        <div className="flex w-full flex-col items-center gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['blue', 'azure', 'soft-lavender', 'black', 'outline'] as const).map((v) => (
              <GeometricButton
                key={v}
                variant={state.inputDemoVariant === v ? 'blue' : 'outline'}
                size="sm"
                isActive={state.inputDemoVariant === v}
                onClick={() => state.setInputDemoVariant(v)}
              >
                {v === 'blue'
                  ? 'Royal Blue'
                  : v === 'azure'
                    ? 'Azure'
                    : v === 'soft-lavender'
                      ? 'Lavender'
                      : v === 'black'
                        ? 'Black'
                        : 'Outline'}
              </GeometricButton>
            ))}
          </div>

          <div className="w-full max-w-md space-y-2">
            <GeometricInput
              type="search"
              placeholder="Search components, students, or endpoints..."
              value={state.inputDemoText}
              onChange={(e) => state.setInputDemoText(e.target.value)}
              clearable
              onClear={() => state.setInputDemoText('')}
              icon={<Search className="h-4 w-4 text-[#0056FF]" />}
              variant={state.inputDemoVariant}
              inputSize={state.inputDemoSize}
              isLoading={state.inputDemoLoading}
              disabled={state.inputDemoDisabled}
            />
          </div>

          <div className="font-mono text-[11px] text-slate-500">
            Value: &quot;{state.inputDemoText}&quot; · Variant:{' '}
            {state.inputDemoVariant.toUpperCase()}
          </div>
        </div>
      );

    default:
      return null;
  }
}
