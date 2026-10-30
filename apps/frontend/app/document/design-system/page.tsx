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
  GeometricInput,
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
  Pin,
  Newspaper,
  FilePlus,
  Contacts,
  Zap,
  Eye,
  EyeOff,
  User,
  SlidersHorizontal,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function DesignSystemPage() {
  // Main View: 'catalog' | 'playground' | 'blueprint' | 'dual-mode'
  const [activeTab, setActiveTab] = React.useState<
    'catalog' | 'playground' | 'blueprint' | 'dual-mode'
  >('catalog');

  // Selected Component for playground inspection
  const [selectedComponentId, setSelectedComponentId] = React.useState<string>('card');

  // Playground Stage Tab: 'preview' | 'usage' | 'code'
  const [stageTab, setStageTab] = React.useState<'preview' | 'usage' | 'code'>('preview');

  // Playground Stage Canvas Theme: 'light' | 'dark'
  const [stageTheme, setStageTheme] = React.useState<'light' | 'dark'>('light');

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Active TOC section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('component-gallery');

  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);
  const [copiedInstall, setCopiedInstall] = React.useState<boolean>(false);

  // Interactive Component States (Fully tapable live demos)
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState(
    'Student enrollment confirmed for STU-2026-0891.',
  );
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bottomNavTab, setBottomNavTab] = React.useState('home');
  const [switchState, setSwitchState] = React.useState(true);
  const [selectedChip, setSelectedChip] = React.useState('All');
  const [fabCount, setFabCount] = React.useState(0);
  const [cardEnrolled, setCardEnrolled] = React.useState(false);

  // Hanging tabs navigation interactive state
  const [hangingNavTab, setHangingNavTab] = React.useState<string>('newswire');
  const [hangingNavSize, setHangingNavSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [hangingNavBadge, setHangingNavBadge] = React.useState<number>(8);

  // Additional component interactive states
  const [dropdownValue, setDropdownValue] = React.useState<string>('sora');
  const [activeTool, setActiveTool] = React.useState<string>('Move Tool (V)');
  const [bottomSheetChoice, setBottomSheetChoice] = React.useState<string>(
    'Export Student Roster (CSV / PDF)',
  );
  const [dialogDecision, setDialogDecision] = React.useState<string>('Pending');

  // Card component interactive modes: 'folder' | 'metrics'
  const [cardPresentationMode, setCardPresentationMode] = React.useState<'folder' | 'metrics'>(
    'folder',
  );
  const [cardRevealed, setCardRevealed] = React.useState<boolean>(false);
  const [cardSlidOut, setCardSlidOut] = React.useState<boolean>(false);
  const [metricsTimeRange, setMetricsTimeRange] = React.useState<'30D' | '90D' | '1Y' | 'All'>(
    '30D',
  );

  // Input & Search interactive states
  const [inputDemoText, setInputDemoText] = React.useState<string>('Dara Sok');
  const [inputDemoVariant, setInputDemoVariant] = React.useState<
    'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error'
  >('blue');
  const [inputDemoSize, setInputDemoSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [inputDemoLoading, setInputDemoLoading] = React.useState<boolean>(false);
  const [inputDemoDisabled, setInputDemoDisabled] = React.useState<boolean>(false);

  // Additional component state controls
  const [fabSpeedDialOpen, setFabSpeedDialOpen] = React.useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'bottom'>('top');

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  // Headings for Right Sidebar Line Tracker
  const tocHeadings: TocHeadingItem[] = React.useMemo(
    () => [
      { id: 'component-gallery', title: 'Component Catalog (12 Core UI)', level: 1 },
      {
        id: 'interactive-stage',
        title: 'Interactive Playground (Preview · Usage · Code)',
        level: 1,
      },
      { id: 'brand-blueprint', title: 'Brand Blueprint (#0056FF)', level: 1 },
      { id: 'dual-mode-system', title: 'Dual Mode System UI', level: 1 },
      { id: 'design-principles', title: 'Design Standards & Policies', level: 1 },
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

  // Active component document item
  const activeDoc = React.useMemo(() => {
    return (
      COMPONENT_LIBRARY_REGISTRY.find((c) => c.id === selectedComponentId) ||
      COMPONENT_LIBRARY_REGISTRY[0]
    );
  }, [selectedComponentId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInstall = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedInstall(true);
    setTimeout(() => setCopiedInstall(false), 2000);
  };

  const handleSelectFromGallery = (id: string) => {
    setSelectedComponentId(id);
    setActiveTab('playground');
    setStageTab('preview');
    scrollToSection('interactive-stage');
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

              {/* Navigation Links */}
              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-2">
                  <GeometricButton
                    variant="blue"
                    size="sm"
                    isActive={activeTab === 'catalog'}
                    onClick={() => {
                      setActiveTab('catalog');
                      scrollToSection('component-gallery');
                    }}
                    className="w-full justify-start"
                  >
                    <span>Catalog</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="azure"
                    size="sm"
                    isActive={activeTab === 'playground'}
                    onClick={() => {
                      setActiveTab('playground');
                      scrollToSection('interactive-stage');
                    }}
                    className="w-full justify-start"
                  >
                    <span>Playground</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="soft-lavender"
                    size="sm"
                    isActive={activeTab === 'blueprint'}
                    onClick={() => {
                      setActiveTab('blueprint');
                      scrollToSection('brand-blueprint');
                    }}
                    className="w-full justify-start"
                  >
                    <span>Brand Colors</span>
                  </GeometricButton>

                  <GeometricButton
                    variant="black"
                    size="sm"
                    isActive={activeTab === 'dual-mode'}
                    onClick={() => {
                      setActiveTab('dual-mode');
                      scrollToSection('dual-mode-system');
                    }}
                    className="w-full justify-start"
                  >
                    <span>Dual Mode UI</span>
                  </GeometricButton>
                </div>

                {/* 12 Core UI Components List */}
                <div className="border-t border-slate-200/80 pt-4">
                  <div className="flex items-center justify-between pb-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
                    <span>12 Core UI Components</span>
                    <span className="text-[#0056FF]">{filteredComponents.length}</span>
                  </div>
                  <div className="space-y-1.5">
                    {filteredComponents.length === 0 ? (
                      <div className="px-3 py-4 text-center font-sans text-xs text-slate-400">
                        No matching components found
                      </div>
                    ) : (
                      filteredComponents.map((comp) => {
                        const isSelected =
                          activeTab === 'playground' && selectedComponentId === comp.id;
                        return (
                          <GeometricButton
                            key={comp.id}
                            variant={isSelected ? 'blue' : 'outline'}
                            size="sm"
                            isActive={isSelected}
                            onClick={() => {
                              setSelectedComponentId(comp.id);
                              setActiveTab('playground');
                              scrollToSection('interactive-stage');
                            }}
                            className="w-full justify-start text-[11px]"
                          >
                            {comp.name}
                          </GeometricButton>
                        );
                      })
                    )}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Documentation & Stage */}
          <main className="space-y-10 lg:col-span-6">
            {/* SECTION 1: Component Catalog (Real Live Interactive Cards) */}
            <section id="component-gallery" className="scroll-mt-24 space-y-4">
              <div className="flex flex-col gap-1 border-b border-slate-200 pb-3">
                <h2 className="font-sans text-xl font-black text-slate-950">Component Catalog</h2>
                <p className="font-sans text-xs text-slate-600">
                  The 12 canonical UI components built strictly with the Royal Blue (#0056FF) and
                  Soft Lavender design standards. Click any card to launch its deep interactive
                  playground.
                </p>
              </div>

              <ComponentGalleryGrid
                onSelectComponent={handleSelectFromGallery}
                selectedId={selectedComponentId}
              />
            </section>

            {/* SECTION 2: Interactive Component Playground (Preview · Usage · Code) */}
            <section
              id="interactive-stage"
              className="scroll-mt-24 space-y-6 border-t border-slate-200 pt-8"
            >
              {/* Stage Header Info */}
              <div className="flex flex-col gap-3 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-sans text-2xl font-black text-slate-950">
                      {activeDoc.name}
                    </h2>
                    <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                      {activeDoc.paradigm}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700 uppercase">
                      {activeDoc.category}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-xs text-slate-600">{activeDoc.description}</p>
                </div>

                <div className="flex items-center gap-2">
                  <GeometricButton
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToSection('component-gallery')}
                  >
                    <span>&larr; Catalog</span>
                  </GeometricButton>
                </div>
              </div>

              {/* Triple Tabs Navigation: Preview | Usage | Code (Matching Image 3 & 4) */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-1">
                <div className="flex items-center gap-1.5">
                  {(['preview', 'usage', 'code'] as const).map((tab) => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setStageTab(tab)}
                      className={cn(
                        'cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-all duration-150 select-none',
                        stageTab === tab
                          ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-xs'
                          : 'border border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900',
                      )}
                    >
                      {tab === 'preview' ? 'Preview' : tab === 'usage' ? 'Usage' : 'Code'}
                    </button>
                  ))}
                </div>

                {/* Right Stage Controls: Live Status & Theme Switcher */}
                <div className="flex items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-medium text-slate-500">
                    <span className="size-1.5 animate-pulse rounded-full bg-[#0056FF]" />
                    Live · keyboard ready
                  </span>

                  <span className="h-3 w-[1px] bg-slate-200" />

                  {/* Stage Theme Switcher */}
                  <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                    <button
                      type="button"
                      onClick={() => setStageTheme('light')}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold transition-colors',
                        stageTheme === 'light'
                          ? 'bg-white text-slate-950 shadow-xs'
                          : 'text-slate-500 hover:text-slate-900',
                      )}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setStageTheme('dark')}
                      className={cn(
                        'rounded-full px-2.5 py-0.5 font-sans text-[10px] font-bold transition-colors',
                        stageTheme === 'dark'
                          ? 'bg-[#000B26] text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-900',
                      )}
                    >
                      Dark
                    </button>
                  </div>
                </div>
              </div>

              {/* TAB 1: PREVIEW */}
              {stageTab === 'preview' && (
                <div className="space-y-6">
                  {/* Interactive Stage Canvas Container */}
                  <div
                    className={cn(
                      'relative overflow-hidden rounded-2xl border shadow-sm transition-colors duration-200',
                      stageTheme === 'dark'
                        ? 'border-slate-800 bg-[#000B26] text-white'
                        : 'border-slate-200/90 bg-[#F8FAFC] text-slate-900',
                    )}
                  >
                    {/* Subtle Dot Grid Background */}
                    <div
                      className="pointer-events-none absolute inset-0 opacity-25"
                      style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, ${
                          stageTheme === 'dark' ? '#2277FF' : '#CAD3F5'
                        } 1px, transparent 0)`,
                        backgroundSize: '16px 16px',
                      }}
                    />

                    {/* Canvas Stage Body */}
                    <div className="relative z-10 flex min-h-[320px] items-center justify-center p-6 sm:p-10">
                      {renderActivePlaygroundComponent({
                        id: activeDoc.id,
                        stageTheme,
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
                        cardPresentationMode,
                        setCardPresentationMode,
                        cardRevealed,
                        setCardRevealed,
                        cardSlidOut,
                        setCardSlidOut,
                        metricsTimeRange,
                        setMetricsTimeRange,
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
                        fabSpeedDialOpen,
                        setFabSpeedDialOpen,
                        tooltipPosition,
                        setTooltipPosition,
                      })}
                    </div>

                    {/* Stage Bottom Controls Bar */}
                    <div
                      className={cn(
                        'flex flex-wrap items-center justify-between border-t px-4 py-3 font-mono text-[11px]',
                        stageTheme === 'dark'
                          ? 'border-slate-800 bg-[#00071A] text-slate-400'
                          : 'border-slate-200/90 bg-white text-slate-500',
                      )}
                    >
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold tracking-wider text-slate-400 uppercase">
                          States:
                        </span>
                        {activeDoc.supportedStates.map((st) => (
                          <span
                            key={st}
                            className={cn(
                              'rounded-full px-2 py-0.5 text-[10px] font-semibold',
                              stageTheme === 'dark'
                                ? 'border border-white/10 bg-white/5 text-slate-300'
                                : 'border border-slate-200 bg-slate-50 text-slate-700',
                            )}
                          >
                            {st}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <span>44×44px hit bounds</span>
                        <span>·</span>
                        <span>Zero dropped shadows</span>
                      </div>
                    </div>
                  </div>

                  {/* Install / CLI Command Banner */}
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-white p-3 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-sans text-xs font-bold text-slate-700">Install:</span>
                      <code className="font-mono text-xs font-semibold text-[#0056FF]">
                        npx @snp/cli add {activeDoc.id}
                      </code>
                    </div>
                    <GeometricButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopyInstall(`npx @snp/cli add ${activeDoc.id}`)}
                      icon={
                        copiedInstall ? (
                          <Check className="size-3 text-[#0056FF]" />
                        ) : (
                          <Copy className="size-3 text-slate-600" />
                        )
                      }
                    >
                      {copiedInstall ? 'Copied' : 'Copy'}
                    </GeometricButton>
                  </div>
                </div>
              )}

              {/* TAB 2: USAGE & GUIDELINES */}
              {stageTab === 'usage' && (
                <div className="space-y-6">
                  {/* 1. Component Explanation */}
                  <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                      <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                        1. Mental Model & Paradigm
                      </h3>
                      <span className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                        {activeDoc.paradigm}
                      </span>
                    </div>
                    <p className="font-sans text-xs leading-relaxed text-slate-700">
                      {activeDoc.explanation}
                    </p>
                  </div>

                  {/* 2. Real-World Product Examples */}
                  <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                      2. Real-World Product Scenarios
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {activeDoc.realWorldExamples.map((ex, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3.5"
                        >
                          <div className="space-y-1.5">
                            <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                              Scenario 0{idx + 1}
                            </span>
                            <h4 className="font-sans text-xs font-bold text-slate-900">
                              {ex.title}
                            </h4>
                            <p className="font-sans text-[11px] leading-relaxed text-slate-600">
                              {ex.scenario}
                            </p>
                          </div>
                          <div className="mt-2.5 border-t border-slate-200/60 pt-2 font-sans text-[11px] font-semibold text-slate-800">
                            {ex.impact}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 3. UX Psychology & Design Principles */}
                  <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                      3. UX Psychology & Design Principles
                    </h3>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {activeDoc.uxPsychology.map((ux, idx) => (
                        <div
                          key={idx}
                          className="space-y-1 rounded-xl border border-slate-200/90 bg-[#F8FAFC] p-3.5"
                        >
                          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                            Principle 0{idx + 1}
                          </span>
                          <h4 className="font-sans text-xs font-bold text-slate-900">
                            {ux.principle}
                          </h4>
                          <p className="font-sans text-[11px] leading-relaxed text-slate-600">
                            {ux.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 4. Usage Guidelines: Do's & Don'ts */}
                  <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                      4. Usage Guidelines
                    </h3>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          DO: Best Practices
                        </span>
                        <ul className="space-y-2 font-sans text-xs text-slate-700">
                          {activeDoc.usageGuidelines.map((g, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-[#0056FF]" />
                              <span>{g.doItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <span className="inline-flex items-center gap-1 rounded-full border border-slate-900 bg-[#000B26] px-2.5 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
                          DON&apos;T: Anti-Patterns
                        </span>
                        <ul className="space-y-2 font-sans text-xs text-slate-700">
                          {activeDoc.usageGuidelines.map((g, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="mt-1 size-1.5 shrink-0 rounded-full bg-slate-400" />
                              <span className="text-slate-600">{g.dontItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* 5. Developer Implementation Notes */}
                  <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
                    <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                      5. Developer Implementation Notes
                    </h3>
                    <ul className="space-y-1.5 font-sans text-xs text-slate-700">
                      {activeDoc.implementationNotes.map((note, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#0056FF]" />
                          <span>{note}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* 6. Props Interface (Card Grid) */}
                  <div className="space-y-2.5">
                    <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                      6. Props Interface
                    </h3>
                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {activeDoc.props.map((p) => (
                        <div
                          key={p.name}
                          className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-white p-3.5 transition-all hover:border-[#0056FF]/40 hover:bg-[#F8FAFC]"
                        >
                          <div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-xs font-bold text-[#0056FF]">
                                {p.name}
                              </span>
                              <span className="rounded-md border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-semibold text-[#0056FF]">
                                {p.type}
                              </span>
                            </div>
                            <p className="mt-2 font-sans text-xs leading-relaxed text-slate-600">
                              {p.description}
                            </p>
                          </div>
                          <div className="mt-2.5 border-t border-slate-100 pt-1.5 font-mono text-[10.5px] text-slate-400">
                            Default:{' '}
                            <span className="font-semibold text-slate-700">{p.default || '-'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SOURCE CODE */}
              {stageTab === 'code' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between rounded-xl border border-slate-200/90 bg-slate-50 px-4 py-2.5">
                    <span className="font-mono text-xs font-bold text-slate-700">
                      TypeScript / React Implementation
                    </span>
                    <GeometricButton
                      size="sm"
                      variant="outline"
                      onClick={() => handleCopy(activeDoc.codeSnippet)}
                      icon={
                        copiedCode ? (
                          <Check className="size-3 text-[#0056FF]" />
                        ) : (
                          <Copy className="size-3 text-slate-600" />
                        )
                      }
                    >
                      {copiedCode ? 'Copied' : 'Copy Code'}
                    </GeometricButton>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-slate-800 bg-[#000B26] p-4 text-white shadow-md">
                    <pre className="max-h-[500px] overflow-auto font-mono text-xs leading-relaxed text-slate-100">
                      <code>{activeDoc.codeSnippet}</code>
                    </pre>
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 3: Brand Colors Blueprint */}
            <section
              id="brand-blueprint"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <BrandConceptBlueprint />
            </section>

            {/* SECTION 4: Dual Mode System UI */}
            <section
              id="dual-mode-system"
              className="scroll-mt-24 space-y-4 border-t border-slate-200/80 pt-8"
            >
              <DualModeSystemUI />
            </section>

            {/* SECTION 5: Design Principles & Accessibility */}
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

          {/* COLUMN 3: Right Sidebar Line Tracker */}
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
 * Helper to render interactive playground components in high-fidelity
 * STRICTLY adhering to the docs brand palette (#0056FF, #2277FF, #000B26, #E3E7FC, #FFFFFF)
 */
function renderActivePlaygroundComponent(props: {
  id: string;
  stageTheme: 'light' | 'dark';
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
  cardPresentationMode: 'folder' | 'metrics';
  setCardPresentationMode: (m: 'folder' | 'metrics') => void;
  cardRevealed: boolean;
  setCardRevealed: (r: boolean) => void;
  cardSlidOut: boolean;
  setCardSlidOut: (s: boolean) => void;
  metricsTimeRange: '30D' | '90D' | '1Y' | 'All';
  setMetricsTimeRange: (r: '30D' | '90D' | '1Y' | 'All') => void;
  inputDemoText: string;
  setInputDemoText: (t: string) => void;
  inputDemoVariant: 'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error';
  setInputDemoVariant: (
    v: 'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error',
  ) => void;
  inputDemoSize: 'sm' | 'md' | 'lg';
  setInputDemoSize: (s: 'sm' | 'md' | 'lg') => void;
  inputDemoLoading: boolean;
  setInputDemoLoading: (l: boolean) => void;
  inputDemoDisabled: boolean;
  setInputDemoDisabled: (d: boolean) => void;
  fabSpeedDialOpen: boolean;
  setFabSpeedDialOpen: (o: boolean) => void;
  tooltipPosition: 'top' | 'bottom';
  setTooltipPosition: (p: 'top' | 'bottom') => void;
}) {
  const isDark = props.stageTheme === 'dark';

  switch (props.id) {
    case 'card':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-5 py-2">
          {/* Presentation Mode Selector: Card Folder (Images 3 & 4) vs Metrics Card (Image 2) */}
          <div className="flex items-center rounded-full border border-slate-200 bg-white p-1 shadow-xs">
            <button
              type="button"
              onClick={() => props.setCardPresentationMode('folder')}
              className={cn(
                'rounded-full px-3 py-1 font-sans text-xs font-bold transition-all',
                props.cardPresentationMode === 'folder'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Card Folder Mode
            </button>
            <button
              type="button"
              onClick={() => props.setCardPresentationMode('metrics')}
              className={cn(
                'rounded-full px-3 py-1 font-sans text-xs font-bold transition-all',
                props.cardPresentationMode === 'metrics'
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              Daily Metrics Mode
            </button>
          </div>

          {/* MODE 1: Interactive Card Folder (Replicating User Images 3 & 4) */}
          {props.cardPresentationMode === 'folder' ? (
            <div className="relative w-full max-w-sm pt-4 select-none">
              {/* Sliding Credit / Student Card */}
              <div
                onClick={() => props.setCardSlidOut(!props.cardSlidOut)}
                className={cn(
                  'relative mx-auto w-[92%] cursor-pointer rounded-2xl p-4 transition-all duration-300 ease-out',
                  'border border-slate-700/60 bg-gradient-to-br from-[#0B0E14] via-[#000B26] to-[#0056FF]',
                  'text-white shadow-lg',
                  props.cardSlidOut ? '-translate-y-8 scale-[1.02]' : 'translate-y-0',
                )}
              >
                {/* Card Top: Chip and Brand */}
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] tracking-widest text-slate-400 uppercase">
                    SNPI STUDENT PASS
                  </span>
                  {/* EMV Chip */}
                  <div className="h-6 w-8 rounded-md border border-amber-300/40 bg-amber-400/20" />
                </div>

                {/* Card Number */}
                <div className="mt-5 font-mono text-base font-bold tracking-widest text-slate-100">
                  {props.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                </div>

                {/* Cardholder & Expiry */}
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
                      {props.cardRevealed ? '742' : '•••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Curved Folder Pocket Base (Images 3 & 4 Style) */}
              <div
                className={cn(
                  'relative z-20 -mt-12 w-full rounded-2xl border p-4 transition-all duration-200',
                  isDark
                    ? 'border-slate-800 bg-[#00071A] text-white shadow-xl'
                    : 'border-slate-200/90 bg-white text-slate-900 shadow-md',
                )}
              >
                {/* Wavy Pocket Seam */}
                <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-3 dark:border-slate-700">
                  <button
                    type="button"
                    onClick={() => props.setCardRevealed(!props.cardRevealed)}
                    className="flex items-center gap-1.5 rounded-full border border-slate-200 px-2.5 py-1 text-xs font-semibold hover:border-[#0056FF]"
                  >
                    {props.cardRevealed ? (
                      <EyeOff className="size-3.5 text-[#0056FF]" />
                    ) : (
                      <Eye className="size-3.5 text-slate-600" />
                    )}
                    <span>{props.cardRevealed ? 'Hide Details' : 'Reveal Details'}</span>
                  </button>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">Expiry</span>
                      <strong className="text-slate-800 dark:text-slate-200">08/29</strong>
                    </div>
                    <div>
                      <span className="block text-[9px] text-slate-400 uppercase">CVV</span>
                      <strong className="text-slate-800 dark:text-slate-200">
                        {props.cardRevealed ? '742' : '•••'}
                      </strong>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <div>
                    <h4 className="font-sans text-xs font-bold">Dara Sok</h4>
                    <p className="font-mono text-[11px] text-slate-500">
                      {props.cardRevealed ? '9420 8124 0092 0891' : '•••• •••• •••• 0891'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => props.setCardSlidOut(!props.cardSlidOut)}
                    className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-sans text-xs font-bold text-[#0056FF]"
                  >
                    {props.cardSlidOut ? 'Insert Card' : 'Pull Card'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* MODE 2: Daily Active Students Metrics Card (Replicating User Image 2) */
            <div
              className={cn(
                'w-full max-w-sm rounded-2xl border p-5 shadow-sm transition-all',
                isDark
                  ? 'border-slate-800 bg-[#00071A] text-white'
                  : 'border-slate-200/90 bg-white text-slate-900',
              )}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-sans text-sm font-bold">Daily active students</h4>
                  <p className="font-sans text-xs text-slate-500">12,340 a day · Term 1 2026</p>
                </div>

                {/* Range Buttons (Image 2 style) */}
                <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 font-mono text-[10px]">
                  {(['30D', '90D', '1Y', 'All'] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => props.setMetricsTimeRange(r)}
                      className={cn(
                        'rounded-full px-2 py-0.5 font-bold transition-colors',
                        props.metricsTimeRange === r
                          ? 'bg-[#0056FF] text-white'
                          : 'text-slate-600 hover:text-slate-950',
                      )}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating Tooltip Callout (Image 2 style) */}
              <div className="mt-4 rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-3">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-500">
                  <span>Saturday, Oct 30, 2026</span>
                  <span className="font-bold text-[#0056FF]">+8.5% growth</span>
                </div>
                <div className="mt-1 font-sans text-2xl font-black text-slate-950 dark:text-white">
                  10,119 students
                </div>
                <p className="mt-0.5 font-sans text-[11px] text-slate-600">
                  14,002 seven day average vs a week earlier
                </p>
              </div>

              {/* Interactive Trend Line Simulation */}
              <div className="mt-4 flex h-14 w-full items-end gap-1.5 pt-2">
                {[38, 45, 42, 58, 64, 60, 72, 68, 85, 92, 88, 100].map((val, i) => (
                  <div
                    key={i}
                    style={{ height: `${val}%` }}
                    className={cn(
                      'flex-1 rounded-t-sm transition-all duration-200 hover:opacity-80',
                      i >= 8 ? 'bg-[#0056FF]' : 'bg-[#E3E7FC] dark:bg-slate-700',
                    )}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      );

    case 'snackbar':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => {
                props.setSnackbarMsg('Student enrollment confirmed for STU-2026-0891.');
                props.setSnackbarOpen(true);
              }}
            >
              <Check className="h-3.5 w-3.5" />
              <span>Trigger Success</span>
            </GeometricButton>
            <GeometricButton
              variant="azure"
              size="sm"
              onClick={() => {
                props.setSnackbarMsg('Batch attendance cloud sync in progress.');
                props.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Info</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                props.setSnackbarMsg('Tuition payment gateway timed out.');
                props.setSnackbarOpen(true);
              }}
            >
              <span>Trigger Error</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => {
                props.setSnackbarOpen(false);
                props.setSnackbarMsg('Notification dismissed.');
              }}
            >
              <span>Reset</span>
            </GeometricButton>
          </div>

          {/* Interactive In-Stage Snackbar Card */}
          <div className="w-full rounded-2xl border border-slate-900 bg-[#000B26] p-4 text-white shadow-lg transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2 animate-pulse rounded-full bg-[#0056FF]" />
                <span className="font-sans text-xs">{props.snackbarMsg}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => props.setSnackbarMsg('Action reverted successfully.')}
                  className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-1 font-mono text-[11px] font-bold text-[#0056FF] transition-transform active:scale-95"
                >
                  Undo
                </button>
                <button
                  type="button"
                  onClick={() => props.setSnackbarOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-white"
                >
                  <span className="font-mono text-xs">Dismiss</span>
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>State: {props.snackbarOpen ? 'ACTIVE (DISPLAYING)' : 'READY'}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Duration: 5000ms</span>
          </div>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 py-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => props.setSheetOpen(true)}>
              <MapPin className="h-3.5 w-3.5" />
              <span>Open Sheet Modal</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setBottomSheetChoice('None Selected')}
            >
              <span>Reset</span>
            </GeometricButton>
          </div>

          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-slate-300" />
            <div className="flex items-center justify-between pb-1">
              <h4 className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase">
                Quick Operations
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
                  onClick={() => props.setBottomSheetChoice(opt)}
                  className={cn(
                    'flex w-full items-center justify-between rounded-xl border p-2.5 text-left font-semibold transition-all select-none',
                    props.bottomSheetChoice === opt
                      ? 'border-[#0056FF] bg-[#E3E7FC] text-[#0056FF]'
                      : 'border-slate-100 bg-slate-50 text-slate-700 hover:border-slate-200 hover:bg-white',
                  )}
                >
                  <span>{opt}</span>
                  {props.bottomSheetChoice === opt && (
                    <span className="size-2 rounded-full bg-[#0056FF]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Selected: {props.bottomSheetChoice}</span>
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-2">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton variant="blue" size="sm" onClick={() => props.setDialogOpen(true)}>
              <span>Open Modal Dialog</span>
            </GeometricButton>
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setDialogDecision('Pending')}
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
                onClick={() => props.setDialogDecision('Cancelled')}
              >
                Cancel
              </GeometricButton>
              <GeometricButton
                size="sm"
                variant="blue"
                onClick={() => props.setDialogDecision('Confirmed (Deferred to 2027)')}
              >
                Confirm Deferral
              </GeometricButton>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Decision: {props.dialogDecision}</span>
          </div>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['top', 'bottom'] as const).map((pos) => (
              <GeometricButton
                key={pos}
                size="sm"
                variant={props.tooltipPosition === pos ? 'blue' : 'outline'}
                isActive={props.tooltipPosition === pos}
                onClick={() => props.setTooltipPosition(pos)}
              >
                Anchor {pos.toUpperCase()}
              </GeometricButton>
            ))}
          </div>

          <div className="flex items-center justify-center gap-3">
            <LibraryTooltip
              content="Move Tool (Select & Transform)"
              shortcut="V"
              position={props.tooltipPosition}
            >
              <button
                type="button"
                onClick={() => props.setActiveTool('Move Tool (V)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition-all select-none',
                  props.activeTool === 'Move Tool (V)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-[#0056FF]',
                )}
              >
                V
              </button>
            </LibraryTooltip>

            <LibraryTooltip content="Save Record" shortcut="⌘S" position={props.tooltipPosition}>
              <button
                type="button"
                onClick={() => props.setActiveTool('Save Record (⌘S)')}
                className={cn(
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold transition-all select-none',
                  props.activeTool === 'Save Record (⌘S)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200 bg-white text-slate-800 hover:border-[#0056FF]',
                )}
              >
                S
              </button>
            </LibraryTooltip>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Active Tool: {props.activeTool}</span>
          </div>
        </div>
      );

    case 'fab':
      return (
        <div className="flex flex-col items-center justify-center gap-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setFabSpeedDialOpen(!props.fabSpeedDialOpen)}
            >
              Toggle Speed Dial
            </GeometricButton>
            <GeometricButton variant="outline" size="sm" onClick={() => props.setFabCount(0)}>
              Reset Counter
            </GeometricButton>
          </div>

          <div className="relative flex items-center justify-center gap-4 py-2">
            {props.fabSpeedDialOpen && (
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
              onClick={() => props.setFabCount((c) => c + 1)}
              className="bg-[#0056FF] text-white hover:bg-[#2277FF]"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <span>Tap Count: {props.fabCount}</span>
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Selected Filter: {props.selectedChip.toUpperCase()}</span>
          </div>
        </div>
      );

    case 'switch':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
            <div className="space-y-0.5">
              <span className="font-sans text-xs font-bold text-slate-900">
                Auto Sync Telemetry
              </span>
              <p className="font-sans text-[11px] text-slate-500">
                Live replica set change streams
              </p>
            </div>
            <LibrarySwitch checked={props.switchState} onCheckedChange={props.setSwitchState} />
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>{props.switchState ? 'STATE: ONLINE' : 'STATE: PAUSED'}</span>
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full max-w-xs flex-col items-center gap-4 py-6">
          <LibraryDropdown
            label="Brand Typography Engine"
            value={props.dropdownValue}
            onChange={(val) => props.setDropdownValue(val)}
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Selected: {props.dropdownValue.toUpperCase()}</span>
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 py-4">
          <div className="w-full overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Active Screen: {props.bottomNavTab.toUpperCase()}</span>
          </div>
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex w-full max-w-lg flex-col items-center gap-4 py-4">
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm">
            <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-4 pt-3 pb-0">
              <div className="flex items-center justify-between pb-2">
                <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Application Header Ceiling
                </span>
                <span className="font-mono text-[10px] text-slate-500">SNPI-SMS v2.4</span>
              </div>
              <div className="-mb-[1px] flex justify-center">
                <HangingTabsNav
                  activeId={props.hangingNavTab}
                  onSelect={props.setHangingNavTab}
                  size={props.hangingNavSize}
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
                <strong className="text-[#0056FF]">{props.hangingNavTab.toUpperCase()}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2">
            {(['sm', 'md', 'lg'] as const).map((sz) => (
              <GeometricButton
                key={sz}
                size="sm"
                variant={props.hangingNavSize === sz ? 'blue' : 'outline'}
                isActive={props.hangingNavSize === sz}
                onClick={() => props.setHangingNavSize(sz)}
              >
                {sz.toUpperCase()}
              </GeometricButton>
            ))}
          </div>
        </div>
      );

    case 'input':
      return (
        <div className="flex w-full max-w-lg flex-col items-center gap-5 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {(['blue', 'azure', 'soft-lavender', 'black', 'outline'] as const).map((v) => (
              <GeometricButton
                key={v}
                variant={props.inputDemoVariant === v ? 'blue' : 'outline'}
                size="sm"
                isActive={props.inputDemoVariant === v}
                onClick={() => props.setInputDemoVariant(v)}
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
              value={props.inputDemoText}
              onChange={(e) => props.setInputDemoText(e.target.value)}
              clearable
              onClear={() => props.setInputDemoText('')}
              icon={<Search className="h-4 w-4" />}
              variant={props.inputDemoVariant}
              inputSize={props.inputDemoSize}
              isLoading={props.inputDemoLoading}
              disabled={props.inputDemoDisabled}
            />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Value: &quot;{props.inputDemoText}&quot;</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Variant: {props.inputDemoVariant.toUpperCase()}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
