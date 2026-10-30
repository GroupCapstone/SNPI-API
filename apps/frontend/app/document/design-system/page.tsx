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
  Monitor,
  Briefcase,
  Wind,
  Zap,
  ShieldCheck,
  Droplets,
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

  // Input & Search interactive states (Capsule Pill with primary brand colors)
  const [inputDemoText, setInputDemoText] = React.useState<string>('hello');
  const [inputDemoVariant, setInputDemoVariant] = React.useState<
    'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error'
  >('blue');
  const [inputDemoSize, setInputDemoSize] = React.useState<'sm' | 'md' | 'lg'>('md');
  const [inputDemoLoading, setInputDemoLoading] = React.useState<boolean>(false);
  const [inputDemoDisabled, setInputDemoDisabled] = React.useState<boolean>(false);

  // Additional component state controls
  const [cardTheme, setCardTheme] = React.useState<'light' | 'dark' | 'futurewave'>('light');
  const [fabSpeedDialOpen, setFabSpeedDialOpen] = React.useState<boolean>(false);
  const [tooltipPosition, setTooltipPosition] = React.useState<'top' | 'bottom'>('top');

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
  ];

  // Headings for Right Sidebar Line Tracker
  const tocHeadings: TocHeadingItem[] = React.useMemo(
    () => [
      { id: 'how-it-works', title: 'SNPI-SMS Design System: how it works', level: 1 },
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
      {/* 3-Column Documentation Grid (Cloudflare Docs Layout from Image 2) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-12">
          {/* COLUMN 1: Left Navigation Sidebar Menu */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Filter Input using GeometricInput */}
              <GeometricInput
                inputSize="sm"
                placeholder="Filter components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                icon={<Search className="h-3.5 w-3.5" />}
              />

              {/* Navigation Links */}
              <div className="space-y-4 font-sans text-xs">
                <div>
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
                      variant="green"
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
                      variant="purple"
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
                      variant="orange"
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

                    <GeometricButton
                      variant="cyan"
                      size="sm"
                      isActive={activeTab === 'top-nav'}
                      onClick={() => {
                        setActiveTab('top-nav');
                        scrollToSection('top-nav-style');
                      }}
                      className="w-full justify-start"
                    >
                      <span>Top Nav</span>
                    </GeometricButton>
                  </div>
                </div>

                {/* 10 Core UI Components List */}
                <div className="border-t border-slate-200/80 pt-4">
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

          {/* COLUMN 2: Center Main Documentation & Stage (Cloudflare Docs Style) */}
          <main className="space-y-10 lg:col-span-6">
            {/* Header Anchor Section */}
            <div id="how-it-works" className="space-y-4">
              <div className="flex flex-col gap-4 border-b border-slate-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
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
                      SNPI-SMS Design Standard
                    </span>
                  </div>

                  {/* Hanging Tabs Suspended from Ceiling (Centered on Page, Zero Number Labels) */}
                  <div className="-mb-[1px] flex justify-center">
                    <HangingTabsNav
                      activeId={hangingNavTab}
                      onSelect={setHangingNavTab}
                      size={hangingNavSize}
                      items={[
                        { id: 'map', label: 'Map', icon: Pin },
                        { id: 'newswire', label: 'Newswire', icon: Newspaper },
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
                    <span className="rounded-full border-2 border-[#0056FF] bg-blue-50/80 px-3 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
                      {hangingNavTab.toUpperCase()}
                    </span>
                  </div>

                  {/* Size Switcher Using Image 2 Pill Button Style */}
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

              {/* Image 2 Inspired: Six Capsule Pill Buttons System */}
              <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                <div className="flex flex-col gap-1 border-b border-slate-100 pb-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="font-sans text-sm font-bold text-slate-900">
                      Capsule Pill Buttons Palette
                    </h3>
                    <p className="font-sans text-xs text-slate-500">
                      2px colored stroke, soft pastel surface tint, and squircle icon tiles
                    </p>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                    SNPI-SMS Pill Standard
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
                  {/* 1. Digital - Blue */}
                  <GeometricButton
                    variant="blue"
                    size="md"
                    icon={<Monitor className="size-4" />}
                    className="w-full"
                  >
                    Digital
                  </GeometricButton>

                  {/* 2. Finance - Green */}
                  <GeometricButton
                    variant="green"
                    size="md"
                    icon={<Briefcase className="size-4" />}
                    className="w-full"
                  >
                    Finance
                  </GeometricButton>

                  {/* 3. Simple - Purple */}
                  <GeometricButton
                    variant="purple"
                    size="md"
                    icon={<Wind className="size-4" />}
                    className="w-full"
                  >
                    Simple
                  </GeometricButton>

                  {/* 4. Fast - Orange */}
                  <GeometricButton
                    variant="orange"
                    size="md"
                    icon={<Zap className="size-4" />}
                    className="w-full"
                  >
                    Fast
                  </GeometricButton>

                  {/* 5. Secure - Navy */}
                  <GeometricButton
                    variant="navy"
                    size="md"
                    icon={<ShieldCheck className="size-4" />}
                    className="w-full"
                  >
                    Secure
                  </GeometricButton>

                  {/* 6. Fluid - Cyan */}
                  <GeometricButton
                    variant="cyan"
                    size="md"
                    icon={<Droplets className="size-4" />}
                    className="w-full"
                  >
                    Fluid
                  </GeometricButton>
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
                  <h4 className="text-xs font-bold text-slate-900 uppercase">
                    Zero Badge & Label Box
                  </h4>
                  <p className="mt-1 font-mono text-[11px] text-slate-500">
                    Pure flat typography and bare vector icons with zero background patches
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
              <div className="flex flex-col gap-3 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-sans text-2xl font-black text-slate-950">
                      {activeDoc.name}
                    </h2>
                    <span className="rounded-full border border-[#0056FF]/30 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                      {activeDoc.paradigm}
                    </span>
                    <span className="rounded-full border border-slate-200 bg-slate-100 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-600 uppercase">
                      {activeDoc.category}
                    </span>
                  </div>
                  <p className="mt-1 font-sans text-sm text-slate-600">{activeDoc.description}</p>
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

              {/* Interactive Stage Card */}
              <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-300 hover:border-[#0056FF]/40">
                {/* Stage Header Info */}
                <div className="flex flex-wrap items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="inline-block size-2 rounded-full bg-emerald-500" />
                    <span className="font-mono text-[11px] font-bold text-slate-700 uppercase">
                      Interactive Live Demo & State Testing
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono text-[10px] text-slate-500">
                    <span>Target: 44×44px hit bounds</span>
                    <span>·</span>
                    <span>Zero shadows</span>
                  </div>
                </div>

                {/* Stage Body */}
                <div className="flex min-h-[260px] items-center justify-center bg-slate-50/50 p-6 sm:p-8">
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
                    cardTheme,
                    setCardTheme,
                    fabSpeedDialOpen,
                    setFabSpeedDialOpen,
                    tooltipPosition,
                    setTooltipPosition,
                  })}
                </div>

                {/* Action Ribbon: Supported States & Code Controls */}
                <div className="flex flex-col gap-3 border-t border-slate-200/80 bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
                      Supported States:
                    </span>
                    {activeDoc.supportedStates.map((st) => (
                      <span
                        key={st}
                        className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-slate-700"
                      >
                        {st}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
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

              {/* 1. Component Explanation */}
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                    1. Component Explanation & Mental Model
                  </h3>
                  <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                    {activeDoc.paradigm}
                  </span>
                </div>
                <p className="font-sans text-xs leading-relaxed text-slate-700">
                  {activeDoc.explanation}
                </p>
              </div>

              {/* 2. Real-World Product Examples */}
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                  2. Real-World Product Examples
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {activeDoc.realWorldExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col justify-between rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5"
                    >
                      <div className="space-y-1.5">
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          Example 0{idx + 1}
                        </span>
                        <h4 className="font-sans text-xs font-bold text-slate-900">{ex.title}</h4>
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
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                  3. UX Psychology & Design Principles
                </h3>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {activeDoc.uxPsychology.map((ux, idx) => (
                    <div
                      key={idx}
                      className="space-y-1.5 rounded-xl border border-blue-100 bg-blue-50/40 p-3.5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="size-2 rounded-full bg-[#0056FF]" />
                        <h4 className="font-sans text-xs font-bold text-[#0056FF]">
                          {ux.principle}
                        </h4>
                      </div>
                      <p className="font-sans text-[11px] leading-relaxed text-slate-700">
                        {ux.detail}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. Usage Guidelines & Best Practices */}
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
                <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                  4. Usage Guidelines & Best Practices
                </h3>
                <div className="space-y-2">
                  {activeDoc.usageGuidelines.map((g, idx) => (
                    <div key={idx} className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3">
                        <span className="font-mono text-[10px] font-bold text-emerald-800 uppercase">
                          [DO]
                        </span>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-emerald-950">
                          {g.doItem}
                        </p>
                      </div>
                      <div className="rounded-xl border border-rose-200 bg-rose-50/50 p-3">
                        <span className="font-mono text-[10px] font-bold text-rose-800 uppercase">
                          [DON&apos;T]
                        </span>
                        <p className="mt-1 font-sans text-xs leading-relaxed text-rose-950">
                          {g.dontItem}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. Developer Implementation Notes */}
              <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
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

              {/* 6. Component Props Table */}
              <div className="space-y-2">
                <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                  6. Props Interface
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
              onActiveChange={(id) => {
                setActiveSectionId(id);
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
        onConfirm={() => setDialogOpen(false)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8 text-center font-sans text-xs text-slate-500">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0056FF]" />
            <span>SNPI-SMS Design Standards & Component Catalog · Sora Typography</span>
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
  cardTheme: 'light' | 'dark' | 'futurewave';
  setCardTheme: (t: 'light' | 'dark' | 'futurewave') => void;
  fabSpeedDialOpen: boolean;
  setFabSpeedDialOpen: (o: boolean) => void;
  tooltipPosition: 'top' | 'bottom';
  setTooltipPosition: (p: 'top' | 'bottom') => void;
}) {
  switch (props.id) {
    case 'snackbar':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-4">
          {/* Controls Bar for State Testing */}
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
              variant="orange"
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
                props.setSnackbarMsg('Payment gateway connection timed out.');
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
          <div className="w-full rounded-2xl border border-slate-200/90 bg-slate-900 p-4 text-white shadow-lg transition-all">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="font-sans text-xs">{props.snackbarMsg}</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => props.setSnackbarMsg('Action reverted successfully.')}
                  className="rounded-full px-2.5 py-1 font-mono text-[11px] font-bold text-[#60A5FA] uppercase transition-colors hover:bg-white/10"
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
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Role: status</span>
          </div>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 py-2">
          {/* Controls Bar for State Testing */}
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

          {/* In-Stage Interactive Action Sheet Mock */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
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
                      ? 'border-[#0056FF] bg-blue-50/70 text-[#0056FF]'
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
            <span>State: {props.sheetOpen ? 'OPEN (OVERLAY)' : 'IN-STAGE'}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Selected: {props.bottomSheetChoice}</span>
          </div>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex w-full max-w-md flex-col items-center gap-4 py-2">
          {/* Controls Bar for State Testing */}
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

          {/* In-Stage Interactive Decision Dialog Container */}
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-5 text-left shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h4 className="font-sans text-sm font-bold text-slate-900">
                Confirm Enrollment Deferral
              </h4>
              <span className="rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 font-mono text-[10px] font-bold text-amber-800 uppercase">
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
                onClick={() => props.setDialogDecision('Cancelled / Preserved')}
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
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Role: dialog (aria-modal)</span>
          </div>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="flex w-full max-w-sm flex-col items-center gap-4 py-4">
          {/* Controls Bar for State Testing */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setHangingNavBadge((b) => (b > 0 ? 0 : 8))}
            >
              Toggle Badge ({props.hangingNavBadge > 0 ? 'Clear' : '8'})
            </GeometricButton>
          </div>

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
                      'relative flex flex-col items-center gap-1 rounded-xl border px-4 py-2 transition-all select-none',
                      isActive
                        ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),0_2px_8px_rgba(0,86,255,0.2)]'
                        : 'border-transparent text-slate-600 hover:border-slate-200 hover:text-slate-950',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-sans text-[11px] tracking-wider uppercase">
                      {item.label}
                    </span>
                    {item.id === 'academics' && props.hangingNavBadge > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-rose-500 font-mono text-[10px] font-bold text-white ring-2 ring-white">
                        {props.hangingNavBadge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Active Screen: {props.bottomNavTab.toUpperCase()}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Badge Count: {props.hangingNavBadge}</span>
          </div>
        </div>
      );

    case 'switch':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="blue"
              size="sm"
              onClick={() => props.setSwitchState(!props.switchState)}
            >
              Toggle State
            </GeometricButton>
            <GeometricButton variant="outline" size="sm" onClick={() => props.setSwitchState(true)}>
              Reset to Online
            </GeometricButton>
          </div>

          <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white px-6 py-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)]">
            <div className="space-y-0.5">
              <span className="font-sans text-xs font-bold text-slate-900">
                System Telemetry Probe
              </span>
              <p className="font-sans text-[11px] text-slate-500">
                Live replica set change streams
              </p>
            </div>
            <LibrarySwitch checked={props.switchState} onCheckedChange={props.setSwitchState} />
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>
              {props.switchState ? 'STATE: ONLINE (STREAMING 120 FPS)' : 'STATE: OFFLINE (PAUSED)'}
            </span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Role: switch (aria-checked)</span>
          </div>
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-col items-center gap-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setSelectedChip('All')}
            >
              Reset Filter
            </GeometricButton>
          </div>

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
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Radius: 9999px (Pill)</span>
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
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Add Student
                </span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Attendance
                </span>
                <span className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold text-[#0056FF]">
                  Invoice
                </span>
              </div>
            )}

            <LibraryFab
              label="Quick Action"
              icon={<Plus className="h-5 w-5" />}
              onClick={() => props.setFabCount((c) => c + 1)}
              className="bg-[#0056FF] text-white hover:bg-[#0040C0]"
            />
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-slate-600">
            <span>Tap Events Recorded: {props.fabCount}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Dimensions: 56×56px</span>
          </div>
        </div>
      );

    case 'card':
      return (
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant={props.cardEnrolled ? 'blue' : 'outline'}
              size="sm"
              onClick={() => props.setCardEnrolled(!props.cardEnrolled)}
            >
              Toggle Enrollment
            </GeometricButton>
            {(['light', 'dark', 'futurewave'] as const).map((t) => (
              <GeometricButton
                key={t}
                variant={props.cardTheme === t ? 'blue' : 'outline'}
                size="sm"
                isActive={props.cardTheme === t}
                onClick={() => props.setCardTheme(t)}
              >
                {t.toUpperCase()}
              </GeometricButton>
            ))}
          </div>

          <div
            className={cn(
              'w-full max-w-xs transition-all duration-200',
              props.cardTheme === 'dark' && 'rounded-2xl bg-slate-900 p-2 text-white',
              props.cardTheme === 'futurewave' &&
                'rounded-2xl bg-gradient-to-br from-[#2277FF]/20 to-[#AEC2FF]/30 p-2',
            )}
          >
            <LibraryCard
              className={cn(
                'rounded-2xl border bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md',
                props.cardTheme === 'dark'
                  ? 'border-slate-800 bg-slate-900 text-white'
                  : 'border-slate-200/80',
              )}
            >
              <LibraryCardMedia className="relative flex h-24 w-full items-start justify-between rounded-lg bg-gradient-to-r from-blue-100 to-[#0056FF] p-3">
                <span className="rounded-full border border-white/40 bg-[#0056FF] px-2.5 py-0.5 font-sans text-[10px] font-bold text-white shadow-xs">
                  {props.cardEnrolled ? 'ENROLLED' : 'AVAILABLE'}
                </span>
                <span className="font-mono text-[10px] font-semibold text-white/90">TERM 1</span>
              </LibraryCardMedia>
              <LibraryCardHeader>
                <LibraryCardTitle
                  className={cn(
                    'text-base font-bold',
                    props.cardTheme === 'dark' ? 'text-white' : 'text-slate-900',
                  )}
                >
                  Autonomous Robotics
                </LibraryCardTitle>
                <LibraryCardDescription
                  className={cn(
                    'text-xs',
                    props.cardTheme === 'dark' ? 'text-slate-400' : 'text-slate-500',
                  )}
                >
                  Sensors, telemetry & embedded micro-controllers.
                </LibraryCardDescription>
              </LibraryCardHeader>
              <LibraryCardFooter className="flex items-center justify-between border-t border-slate-100 pt-3">
                <span className="font-sans text-xs font-bold text-slate-500">3 CREDITS</span>
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Status: {props.cardEnrolled ? 'ENROLLED' : 'AVAILABLE'}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Theme: {props.cardTheme.toUpperCase()}</span>
          </div>
        </div>
      );

    case 'dropdown':
      return (
        <div className="flex w-full max-w-xs flex-col items-center gap-4 py-6">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <GeometricButton
              variant="outline"
              size="sm"
              onClick={() => props.setDropdownValue('sora')}
            >
              Reset to Sora
            </GeometricButton>
          </div>

          <LibraryDropdown
            label="Brand Typography Engine"
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Selected Token: {props.dropdownValue.toUpperCase()}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Options: 4</span>
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
                  'flex h-11 w-11 items-center justify-center rounded-xl border text-sm font-bold shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_1px_2px_rgba(0,0,0,0.03)] transition-all select-none',
                  props.activeTool === 'Move Tool (V)'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white'
                    : 'border-slate-200/80 bg-white/90 text-slate-800 hover:border-[#0056FF] hover:bg-slate-50',
                )}
              >
                V
              </button>
            </LibraryTooltip>

            <LibraryTooltip
              content="Hand Tool (Pan Canvas)"
              shortcut="H"
              position={props.tooltipPosition}
            >
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

            <LibraryTooltip
              content="Inspect Element"
              shortcut="Cmd+I"
              position={props.tooltipPosition}
            >
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

            <LibraryTooltip
              content="Quick Enroll Student"
              shortcut="E"
              position={props.tooltipPosition}
            >
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

          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Active Tool: {props.activeTool}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Anchor: {props.tooltipPosition.toUpperCase()}</span>
          </div>
        </div>
      );

    case 'hanging-tabs-nav':
      return (
        <div className="flex w-full max-w-lg flex-col items-center gap-4 py-4">
          <div className="w-full rounded-2xl border border-slate-200/90 bg-white p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),0_2px_8px_rgba(0,0,0,0.03)]">
            <div className="rounded-t-xl border-b border-slate-300 bg-slate-100/80 px-4 pt-3 pb-0">
              <div className="flex items-center justify-between pb-2">
                <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
                  Application Header
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
          {/* Controls Bar for State Testing */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-sans text-xs font-semibold text-slate-600">Theme:</span>
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

          <div className="flex flex-wrap items-center justify-center gap-2">
            <span className="font-sans text-xs font-semibold text-slate-600">Size:</span>
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <GeometricButton
                key={s}
                variant={props.inputDemoSize === s ? 'blue' : 'outline'}
                size="sm"
                isActive={props.inputDemoSize === s}
                onClick={() => props.setInputDemoSize(s)}
              >
                {s.toUpperCase()}
              </GeometricButton>
            ))}

            <GeometricButton
              variant={props.inputDemoLoading ? 'blue' : 'outline'}
              size="sm"
              isActive={props.inputDemoLoading}
              onClick={() => props.setInputDemoLoading(!props.inputDemoLoading)}
            >
              Loading Spinner
            </GeometricButton>

            <GeometricButton
              variant={props.inputDemoDisabled ? 'blue' : 'outline'}
              size="sm"
              isActive={props.inputDemoDisabled}
              onClick={() => props.setInputDemoDisabled(!props.inputDemoDisabled)}
            >
              Disabled Mode
            </GeometricButton>
          </div>

          {/* Interactive Live Pill Input Field (Image 2 style with primary brand colors) */}
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

          {/* Real-time State Feedback Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-[11px] text-slate-500">
            <span>Value: &quot;{props.inputDemoText}&quot;</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Variant: {props.inputDemoVariant.toUpperCase()}</span>
            <span className="h-3 w-[1px] bg-slate-300" />
            <span>Size: {props.inputDemoSize.toUpperCase()}</span>
          </div>
        </div>
      );

    default:
      return null;
  }
}
