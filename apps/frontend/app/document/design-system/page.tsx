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
  COMPONENT_LIBRARY_REGISTRY,
  COMPONENT_CATEGORIES,
} from '@/features/document/components/ui-library';
import {
  Home,
  Search,
  Folder,
  Plus,
  Star,
  MapPin,
  Calendar,
  Sparkles,
  Tag,
  Mail,
  Check,
  Code,
  Copy,
  Layers,
  ChevronRight,
  Palette,
  ExternalLink,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function DesignSystemPage() {
  // Main View Mode: 'catalog' (Image 1 Schematic Grid), 'playground' (Interactive Stage), 'blueprint' (Brand Colors)
  const [activeTab, setActiveTab] = React.useState<'catalog' | 'playground' | 'blueprint'>(
    'catalog',
  );

  // Selected Component for playground inspection
  const [selectedComponentId, setSelectedComponentId] = React.useState<string>('snackbar');

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Active TOC section
  const [activeSectionId, setActiveSectionId] = React.useState<string>('how-it-works');

  // Preview Stage Background
  const [stageBg, setStageBg] = React.useState<'midnight' | 'lavender' | 'white'>('midnight');
  const [showCode, setShowCode] = React.useState<boolean>(false);
  const [copiedCode, setCopiedCode] = React.useState<boolean>(false);

  // Interactive Component States
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState('Student enrollment confirmed.');
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [bottomNavTab, setBottomNavTab] = React.useState('home');
  const [switchState, setSwitchState] = React.useState(true);
  const [selectedChip, setSelectedChip] = React.useState('Academics');
  const [fabCount, setFabCount] = React.useState(0);
  const [cardEnrolled, setCardEnrolled] = React.useState(false);

  const bottomNavItems: LibraryBottomNavItem[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'academics', label: 'Academics', icon: Folder },
  ];

  // Cloudflare Docs-style TOC Headings for Right Sidebar Line Tracker (Image 2)
  const tocHeadings: TocHeadingItem[] = [
    { id: 'how-it-works', title: 'SNP-SMS Design System: how it works', level: 1 },
    { id: 'architecture-flow', title: 'Architectural token flow', level: 2 },
    { id: 'component-gallery', title: 'Component Catalog & Variants', level: 1 },
    { id: 'interactive-stage', title: 'Interactive Component Playground', level: 1 },
    { id: 'brand-blueprint', title: 'Royal Blue (#0056FF) Brand Blueprint', level: 1 },
    { id: 'design-principles', title: 'Flat Design & Zero Shadows Policy', level: 1 },
    { id: 'wcag-contrast', title: 'Luminance Hierarchy & WCAG AA', level: 2 },
  ];

  const handleSelectFromGallery = (id: string) => {
    setSelectedComponentId(id);
    setActiveTab('playground');
    setActiveSectionId('interactive-stage');
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
    <div className="flex min-h-screen flex-col bg-[#000B26] font-sans text-white antialiased selection:bg-[#0056FF] selection:text-white">
      {/* Top Header Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-[#0F357D] bg-[#000B26]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-white">
                Open API
              </span>
              <span className="text-[#0F357D]">|</span>
              <span className="rounded-md border border-[#0056FF]/50 bg-[#0056FF]/20 px-2 py-0.5 font-mono text-xs font-semibold text-[#E3E7FC]">
                Design System & Component Catalog
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/document"
              className="inline-flex h-8 items-center rounded-lg border border-[#0F357D] bg-[#001338] px-3 font-mono text-xs font-medium text-[#C4CEF8] transition-colors hover:border-[#0056FF] hover:text-white"
            >
              &larr; API Documentation
            </Link>
          </div>
        </div>
      </header>

      {/* 3-Column Documentation Grid (Cloudflare Docs Layout from Image 2) */}
      <div className="mx-auto flex w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <div className="grid w-full grid-cols-1 gap-8 lg:grid-cols-12">
          {/* COLUMN 1: Left Navigation Sidebar Menu (Image 2 Left Sidebar) */}
          <aside className="lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              {/* Search Bar with Shortcut Badge */}
              <div className="relative">
                <Search className="absolute top-2.5 left-2.5 h-4 w-4 text-[#A3B4F0]" />
                <input
                  type="text"
                  placeholder="Filter components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 w-full rounded-xl border border-[#0F357D] bg-[#001338] pr-8 pl-8 font-mono text-xs text-white placeholder-[#5D72B0] focus:border-[#0056FF] focus:outline-none"
                />
                <span className="absolute top-2 right-2 rounded-md border border-white/10 bg-white/5 px-1.5 py-0.5 font-mono text-[9px] text-[#A3B4F0]">
                  /
                </span>
              </div>

              {/* Navigation Hierarchy */}
              <div className="space-y-4 font-sans text-xs">
                {/* Section A: Views */}
                <div>
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#A3B4F0] uppercase">
                    NAVIGATION VIEWS
                  </span>
                  <div className="mt-2 space-y-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('catalog');
                        setActiveSectionId('component-gallery');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-colors',
                        activeTab === 'catalog'
                          ? 'bg-[#0056FF] font-bold text-white'
                          : 'text-[#C4CEF8] hover:bg-[#001744] hover:text-white',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Layers className="h-4 w-4" />
                        <span>Component Gallery</span>
                      </div>
                      <span className="py-0.2 rounded-full bg-white/20 px-1.5 font-mono text-[10px]">
                        19
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('playground');
                        setActiveSectionId('interactive-stage');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-colors',
                        activeTab === 'playground'
                          ? 'bg-[#0056FF] font-bold text-white'
                          : 'text-[#C4CEF8] hover:bg-[#001744] hover:text-white',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        <span>Interactive Playground</span>
                      </div>
                      <span className="py-0.2 rounded-full bg-white/20 px-1.5 font-mono text-[10px]">
                        Live
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('blueprint');
                        setActiveSectionId('brand-blueprint');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-medium transition-colors',
                        activeTab === 'blueprint'
                          ? 'bg-[#0056FF] font-bold text-white'
                          : 'text-[#C4CEF8] hover:bg-[#001744] hover:text-white',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Palette className="h-4 w-4" />
                        <span>Royal Blue Blueprint</span>
                      </div>
                      <span className="py-0.2 rounded-full bg-white/20 px-1.5 font-mono text-[10px]">
                        #0056FF
                      </span>
                    </button>
                  </div>
                </div>

                {/* Section B: 10 Core Components Shortcut List */}
                <div>
                  <span className="font-mono text-[10px] font-bold tracking-wider text-[#A3B4F0] uppercase">
                    10 CORE UI COMPONENTS
                  </span>
                  <div className="mt-2 space-y-0.5">
                    {COMPONENT_LIBRARY_REGISTRY.map((comp) => {
                      const isSelected =
                        activeTab === 'playground' && selectedComponentId === comp.id;
                      return (
                        <button
                          key={comp.id}
                          type="button"
                          onClick={() => {
                            setSelectedComponentId(comp.id);
                            setActiveTab('playground');
                            setActiveSectionId('interactive-stage');
                          }}
                          className={cn(
                            'flex w-full items-center justify-between rounded-lg px-2.5 py-1 text-left text-xs transition-colors',
                            isSelected
                              ? 'bg-[#0056FF]/30 font-bold text-[#E3E7FC]'
                              : 'text-[#C4CEF8] hover:bg-[#001744] hover:text-white',
                          )}
                        >
                          <span className="truncate">{comp.name}</span>
                          <span className="font-mono text-[10px] text-[#A3B4F0]">
                            {comp.paradigm.split(' ')[0]}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Section C: Authoritative Standards */}
                <div className="rounded-xl border border-[#0F357D] bg-[#001338] p-3 text-xs">
                  <div className="font-mono text-[10px] font-bold text-[#A3B4F0] uppercase">
                    STANDARDS GATES
                  </div>
                  <ul className="mt-1.5 space-y-1 font-mono text-[11px] text-[#C4CEF8]">
                    <li>• Flat UI · Zero Blur Shadows</li>
                    <li>• 44×44px Hit Targets</li>
                    <li>• WCAG AA Contrast (&ge; 4.5:1)</li>
                    <li>• Sora Typography</li>
                  </ul>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Documentation & Stage (Cloudflare Docs Center Pane) */}
          <main className="space-y-10 lg:col-span-6">
            {/* Cloudflare-style Anchor Heading (Image 2: "🔗 Access on Workers: how it works") */}
            <div id="how-it-works" className="space-y-4">
              <div className="flex items-center gap-2">
                <a
                  href="#how-it-works"
                  className="font-mono text-xl text-[#0056FF] transition-colors hover:text-[#2277FF]"
                  title="Direct Section Link"
                >
                  🔗
                </a>
                <h1 className="font-sans text-2xl font-black tracking-tight text-white sm:text-3xl">
                  SNP-SMS UI Design System: how it works
                </h1>
              </div>

              <p className="font-sans text-sm leading-relaxed text-[#C4CEF8]">
                When you build or extend interfaces in SNP-SMS, the Design System enforces visual
                cohesion, strict flat aesthetics, and luminance-based depth before any code reaches
                production. It does not matter whether the view is an institutional dashboard, a
                public verification portal, or a mobile portal. If it runs on SNP-SMS, it follows
                the Royal Blue and Sora standards.
              </p>

              {/* Cloudflare Docs-style Architecture Diagram Card (Matching Image 2 Diagram) */}
              <div
                id="architecture-flow"
                className="overflow-hidden rounded-2xl border border-[#0F357D] bg-[#001338] p-6 shadow-sm"
              >
                <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
                  {/* Node 1: User / Dev */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2277FF]/40 bg-[#000B26] text-[#2277FF] shadow-inner">
                      <span className="font-mono text-xl font-bold">DEV</span>
                    </div>
                    <span className="font-sans text-xs font-bold text-white">Developer</span>
                  </div>

                  {/* Arrow 1 */}
                  <div className="flex items-center gap-1 font-mono text-[#0056FF]">
                    <span className="h-0.5 w-8 bg-[#0056FF]" />
                    <span>&rarr;</span>
                  </div>

                  {/* Node 2: Tokens / Royal Blue */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#0056FF] bg-[#0056FF] text-white shadow-md">
                      <span className="font-mono text-base font-black">#0056FF</span>
                    </div>
                    <span className="font-sans text-xs font-bold text-[#E3E7FC]">Royal Blue</span>
                  </div>

                  {/* Arrow 2 */}
                  <div className="flex items-center gap-1 font-mono text-[#0056FF]">
                    <span className="h-0.5 w-8 bg-[#0056FF]" />
                    <span>&rarr;</span>
                  </div>

                  {/* Node 3: 10 Components */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2277FF]/40 bg-[#000B26] text-[#2277FF] shadow-inner">
                      <span className="font-mono text-xl font-bold">UI 10</span>
                    </div>
                    <span className="font-sans text-xs font-bold text-white">Flat Component</span>
                  </div>
                </div>

                <div className="mt-4 border-t border-[#0F357D]/40 pt-3 text-center font-mono text-xs text-[#A3B4F0]">
                  Single source of truth: mathematical tokens &rarr; zero dropped shadows &rarr;
                  44px hit targets
                </div>
              </div>
            </div>

            {/* TAB CONTENT 1: Component Catalog (Image 1 Style) */}
            {activeTab === 'catalog' && (
              <section id="component-gallery" className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#0F357D] pb-3">
                  <div>
                    <h2 className="font-sans text-lg font-bold text-white">
                      Component Catalog & Variants
                    </h2>
                    <p className="text-xs text-[#C4CEF8]">
                      Inspired by modern schematic design libraries. Click any card to inspect its
                      interactive playground and documentation.
                    </p>
                  </div>
                </div>

                <ComponentGalleryGrid
                  onSelectComponent={handleSelectFromGallery}
                  selectedId={selectedComponentId}
                />
              </section>
            )}

            {/* TAB CONTENT 2: Interactive Component Playground */}
            {activeTab === 'playground' && (
              <section id="interactive-stage" className="space-y-6">
                <div className="flex items-center justify-between border-b border-[#0F357D] pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-xs font-bold text-white">
                        {activeDoc.category}
                      </span>
                      <span className="font-mono text-xs text-[#C4CEF8]">{activeDoc.paradigm}</span>
                    </div>
                    <h2 className="mt-1 font-sans text-2xl font-black text-white">
                      {activeDoc.name}
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab('catalog')}
                    className="font-mono text-xs text-[#2277FF] hover:underline"
                  >
                    &larr; Back to Catalog
                  </button>
                </div>

                <p className="text-sm leading-relaxed text-[#C4CEF8]">{activeDoc.description}</p>

                {/* Interactive Stage Card */}
                <div className="overflow-hidden rounded-2xl border border-[#0F357D] bg-[#001338]">
                  {/* Canvas Switcher Header */}
                  <div className="flex items-center justify-between border-b border-[#0F357D] bg-[#000B26] px-4 py-2">
                    <span className="font-mono text-[11px] font-semibold text-[#A3B4F0]">
                      STAGE CANVAS
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setStageBg('midnight')}
                        className={cn(
                          'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                          stageBg === 'midnight'
                            ? 'bg-[#0056FF] font-bold text-white'
                            : 'text-[#A3B4F0] hover:text-white',
                        )}
                      >
                        Midnight
                      </button>
                      <button
                        type="button"
                        onClick={() => setStageBg('lavender')}
                        className={cn(
                          'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                          stageBg === 'lavender'
                            ? 'bg-[#0056FF] font-bold text-white'
                            : 'text-[#A3B4F0] hover:text-white',
                        )}
                      >
                        Soft Lavender
                      </button>
                      <button
                        type="button"
                        onClick={() => setStageBg('white')}
                        className={cn(
                          'rounded-md px-2 py-0.5 font-mono text-[11px] transition-colors',
                          stageBg === 'white'
                            ? 'bg-[#0056FF] font-bold text-white'
                            : 'text-[#A3B4F0] hover:text-white',
                        )}
                      >
                        White
                      </button>
                    </div>
                  </div>

                  {/* Stage Body */}
                  <div
                    className={cn(
                      'flex min-h-[220px] items-center justify-center p-8 transition-colors',
                      stageBg === 'midnight' && 'bg-[#000B26] text-white',
                      stageBg === 'lavender' && 'bg-[#E3E7FC] text-[#000B26]',
                      stageBg === 'white' && 'bg-[#FFFFFF] text-slate-900',
                    )}
                  >
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
                    })}
                  </div>

                  {/* Action Ribbon: Code Toggle & Copy */}
                  <div className="flex items-center justify-between border-t border-[#0F357D] bg-[#000B26] px-4 py-2.5">
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#2277FF] hover:text-white"
                    >
                      <Code className="h-4 w-4" />
                      <span>{showCode ? 'Hide Code' : 'View Component Code'}</span>
                    </button>

                    {showCode && (
                      <button
                        type="button"
                        onClick={() => handleCopy(activeDoc.codeSnippet)}
                        className="inline-flex items-center gap-1 rounded-md border border-[#0F357D] bg-[#001338] px-2.5 py-1 font-mono text-[11px] text-[#2277FF] hover:bg-[#002266] hover:text-white"
                      >
                        {copiedCode ? (
                          <Check className="h-3.5 w-3.5 text-white" />
                        ) : (
                          <Copy className="h-3.5 w-3.5" />
                        )}
                        <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>

                  {/* Collapsible Source Code View */}
                  {showCode && (
                    <div className="border-t border-[#0F357D] bg-[#00081C] p-4">
                      <pre className="overflow-x-auto font-mono text-xs text-[#E3E7FC]">
                        <code>{activeDoc.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Component Props Table */}
                <div className="space-y-2">
                  <h3 className="font-mono text-xs font-bold text-[#A3B4F0] uppercase">
                    PROPS INTERFACE
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-[#0F357D] bg-[#001338]">
                    <table className="w-full text-left font-mono text-xs">
                      <thead className="border-b border-[#0F357D] bg-[#000B26] text-[#A3B4F0]">
                        <tr>
                          <th className="px-4 py-2.5">Prop</th>
                          <th className="px-4 py-2.5">Type</th>
                          <th className="px-4 py-2.5">Default</th>
                          <th className="px-4 py-2.5">Description</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#0F357D]/50 text-[#C4CEF8]">
                        {activeDoc.props.map((p) => (
                          <tr key={p.name}>
                            <td className="px-4 py-2 font-bold text-white">{p.name}</td>
                            <td className="px-4 py-2 text-[#2277FF]">{p.type}</td>
                            <td className="px-4 py-2 text-[#A3B4F0]">{p.default || '-'}</td>
                            <td className="px-4 py-2 font-sans text-xs text-[#E3E7FC]">
                              {p.description}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* TAB CONTENT 3: Brand Concept Blueprint */}
            {activeTab === 'blueprint' && (
              <section id="brand-blueprint" className="space-y-4">
                <BrandConceptBlueprint />
              </section>
            )}

            {/* Cloudflare-style Design Principles Section */}
            <section id="design-principles" className="space-y-4 border-t border-[#0F357D] pt-8">
              <div className="flex items-center gap-2">
                <a
                  href="#design-principles"
                  className="font-mono text-lg text-[#0056FF]"
                  title="Direct Section Link"
                >
                  🔗
                </a>
                <h2 className="font-sans text-xl font-bold text-white">
                  Flat Design & Zero Shadows Policy
                </h2>
              </div>

              <p className="font-sans text-sm leading-relaxed text-[#C4CEF8]">
                Every component adheres to strict flat design principles without dropped blur
                shadows (`box-shadow: none`). Spatial depth is established strictly through 1px
                border luminance and background elevation hierarchy.
              </p>

              <div id="wcag-contrast" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-[#0F357D] bg-[#001338] p-4">
                  <span className="font-mono text-[11px] font-bold text-[#A3B4F0] uppercase">
                    TOUCH TARGET MANDATE
                  </span>
                  <p className="mt-1 text-xs text-[#C4CEF8]">
                    Minimum 44×44px interactive area for all buttons, chips, switches, and
                    dropdowns.
                  </p>
                </div>

                <div className="rounded-xl border border-[#0F357D] bg-[#001338] p-4">
                  <span className="font-mono text-[11px] font-bold text-[#A3B4F0] uppercase">
                    WCAG AA CONTRAST (&ge; 4.5:1)
                  </span>
                  <p className="mt-1 text-xs text-[#C4CEF8]">
                    All text on Royal Blue (`#0056FF`) or Midnight surfaces exceeds WCAG AA
                    standards.
                  </p>
                </div>
              </div>
            </section>
          </main>

          {/* COLUMN 3: Right Sidebar "ON THIS PAGE" Line Tracker (Image 2 Right Sidebar) */}
          <aside className="hidden lg:col-span-3 lg:block">
            <LineTrackerToc
              items={tocHeadings}
              activeId={activeSectionId}
              onSelect={(id) => {
                setActiveSectionId(id);
                if (id === 'component-gallery') setActiveTab('catalog');
                if (id === 'interactive-stage') setActiveTab('playground');
                if (id === 'brand-blueprint') setActiveTab('blueprint');

                const el = document.getElementById(id);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
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
          <p className="text-sm text-[#C4CEF8]">
            Siem Reap Science Wing B · Telemetry labs active with Gigabit Ethernet connectivity.
          </p>
          <button
            type="button"
            onClick={() => setSheetOpen(false)}
            className="flex h-10 w-full items-center justify-center rounded-xl bg-[#0056FF] text-xs font-bold text-white transition-colors hover:bg-[#2277FF]"
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
      <footer className="mt-auto border-t border-[#0F357D] bg-[#00071A] py-8 text-center font-mono text-xs text-[#A3B4F0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0056FF]" />
            <span>
              SNP-SMS Design Standards & Component Catalog · Royal Blue (#0056FF) & Sora Font
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/document" className="text-[#C4CEF8] transition-colors hover:text-white">
              API Docs
            </Link>
            <Link href="/dashboard" className="text-[#C4CEF8] transition-colors hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/**
 * Helper to render interactive component playground demo
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
}) {
  switch (props.id) {
    case 'snackbar':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-6">
          <button
            type="button"
            onClick={() => {
              props.setSnackbarMsg('Student profile updated.');
              props.setSnackbarOpen(true);
            }}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
          >
            <Check className="h-4 w-4" />
            <span>Trigger Confirmation Snackbar</span>
          </button>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex items-center justify-center py-6">
          <button
            type="button"
            onClick={() => props.setSheetOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
          >
            <MapPin className="h-4 w-4" />
            <span>Open Bottom Sheet</span>
          </button>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex items-center justify-center py-6">
          <button
            type="button"
            onClick={() => props.setDialogOpen(true)}
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-[#0056FF] px-4 text-xs font-bold text-white shadow-xs transition-colors hover:bg-[#2277FF]"
          >
            <span>Trigger Decision Dialog</span>
          </button>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="w-full max-w-sm py-4">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#001338] p-2">
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
                      'flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-colors',
                      isActive ? 'bg-[#0056FF] font-bold text-white' : 'text-[#C4CEF8]',
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="font-mono text-[11px]">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center gap-3 py-6">
          <span className="text-xs font-medium">System Telemetry Probe</span>
          <LibrarySwitch checked={props.switchState} onCheckedChange={props.setSwitchState} />
        </div>
      );

    case 'chip':
      return (
        <div className="flex flex-wrap items-center justify-center gap-2 py-6">
          {['All', 'Academics', 'Students', 'Finance', 'Attendance'].map((label) => (
            <LibraryChip
              key={label}
              active={props.selectedChip === label}
              onClick={() => props.setSelectedChip(label)}
            >
              {label}
            </LibraryChip>
          ))}
        </div>
      );

    case 'fab':
      return (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <LibraryFab
            label="Quick Action"
            icon={<Plus className="h-5 w-5" />}
            onClick={() => props.setFabCount((c) => c + 1)}
            className="bg-[#0056FF] text-white hover:bg-[#2277FF]"
          />
          <span className="font-mono text-xs">Clicks: {props.fabCount}</span>
        </div>
      );

    case 'card':
      return (
        <div className="w-full max-w-xs py-4">
          <LibraryCard className="border border-[#0F357D] bg-[#001338] text-white">
            <LibraryCardMedia className="relative flex h-24 w-full items-start justify-between bg-gradient-to-r from-[#000B26] via-[#002D8A] to-[#0056FF] p-3">
              <span className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                STEM
              </span>
            </LibraryCardMedia>
            <LibraryCardHeader>
              <LibraryCardTitle className="text-base font-bold text-white">
                Autonomous Robotics
              </LibraryCardTitle>
              <LibraryCardDescription className="text-xs text-[#C4CEF8]">
                Sensors, telemetry & embedded systems.
              </LibraryCardDescription>
            </LibraryCardHeader>
            <LibraryCardFooter className="flex items-center justify-between border-t border-white/10 pt-3">
              <span className="font-mono text-xs text-[#E3E7FC]">3 Credits</span>
              <button
                type="button"
                onClick={() => props.setCardEnrolled(!props.cardEnrolled)}
                className={cn(
                  'inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-semibold',
                  props.cardEnrolled
                    ? 'bg-[#0056FF] text-white'
                    : 'bg-white/10 text-white hover:bg-white/20',
                )}
              >
                <Star className="h-3.5 w-3.5" />
                <span>{props.cardEnrolled ? 'Enrolled' : 'Enroll'}</span>
              </button>
            </LibraryCardFooter>
          </LibraryCard>
        </div>
      );

    case 'dropdown':
      return (
        <div className="w-full max-w-xs py-6">
          <select className="h-10 w-full rounded-xl border border-white/20 bg-[#001338] px-3 font-mono text-xs text-white focus:border-[#0056FF] focus:outline-none">
            <option value="sora">Sora — Primary Brand Typography</option>
            <option value="inter">Inter — UI Sans</option>
            <option value="roboto">Roboto — M3 Material</option>
          </select>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex items-center justify-center gap-2 py-6">
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#001338] text-sm font-bold text-white hover:border-[#0056FF] hover:text-[#2277FF]"
            title="Move Tool (Shortcut: V)"
          >
            V
          </button>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#001338] text-sm font-bold text-white hover:border-[#0056FF] hover:text-[#2277FF]"
            title="Hand Tool (Shortcut: H)"
          >
            H
          </button>
        </div>
      );

    default:
      return null;
  }
}
