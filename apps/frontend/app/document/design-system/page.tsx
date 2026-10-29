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
  GeometricButton,
  GeometricAsterisk,
  GeometricHeaderStamp,
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
  Sparkles,
  Palette,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export default function DesignSystemPage() {
  // Main View: 'catalog' (Image 1 Schematic Grid), 'playground' (Interactive Stage), 'blueprint' (Brand Colors)
  const [activeTab, setActiveTab] = React.useState<'catalog' | 'playground' | 'blueprint'>(
    'catalog',
  );

  // Selected Component for playground inspection
  const [selectedComponentId, setSelectedComponentId] = React.useState<string>('snackbar');

  // Search filter
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  // Active TOC section for Line Tracker
  const [activeSectionId, setActiveSectionId] = React.useState<string>('how-it-works');

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

  // Headings for Right Sidebar Line Tracker (Image 2)
  const tocHeadings: TocHeadingItem[] = [
    { id: 'how-it-works', title: 'SNP-SMS Design System: how it works', level: 1 },
    { id: 'architecture-flow', title: 'Architectural token flow', level: 2 },
    { id: 'component-gallery', title: 'Component Catalog & Variants', level: 1 },
    { id: 'interactive-stage', title: 'Interactive Component Playground', level: 1 },
    { id: 'brand-blueprint', title: 'Royal Blue (#0056FF) Brand Blueprint', level: 1 },
    { id: 'design-principles', title: 'Flat Design & Zero Shadows Policy', level: 1 },
    { id: 'touch-targets', title: 'Touch Targets & Accessibility', level: 2 },
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
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased selection:bg-[#0056FF] selection:text-white">
      {/* Top Header - Strictly Logo and Open API | Library (Zero extra clutter) */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2 font-sans">
              <span className="text-base font-extrabold tracking-tight text-slate-950">
                Open API
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-base font-medium text-slate-600">Library</span>
            </div>
          </div>
        </div>
      </header>

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
                        setActiveSectionId('component-gallery');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'catalog'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-sm [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'catalog'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          01
                        </span>
                        <span className="tracking-wider uppercase">Catalog</span>
                      </div>
                      {activeTab === 'catalog' && (
                        <GeometricAsterisk className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('playground');
                        setActiveSectionId('interactive-stage');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'playground'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-sm [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'playground'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          02
                        </span>
                        <span className="tracking-wider uppercase">Playground</span>
                      </div>
                      {activeTab === 'playground' && (
                        <GeometricAsterisk className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('blueprint');
                        setActiveSectionId('brand-blueprint');
                      }}
                      className={cn(
                        'flex w-full items-center justify-between rounded-lg border-2 px-3 py-2 text-left font-medium transition-all select-none',
                        activeTab === 'blueprint'
                          ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-sm [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            'px-1.5 py-0.5 font-mono text-[10px] font-black',
                            activeTab === 'blueprint'
                              ? 'bg-[#000B26] text-white'
                              : 'bg-slate-100 text-slate-600',
                          )}
                        >
                          03
                        </span>
                        <span className="tracking-wider uppercase">Brand Colors</span>
                      </div>
                      {activeTab === 'blueprint' && (
                        <GeometricAsterisk className="h-3.5 w-3.5 text-white" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 10 Core UI Components List */}
                <div className="border-t-2 border-slate-200 pt-4">
                  <div className="space-y-1">
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
                            'flex w-full items-center justify-between rounded-md border-2 px-2.5 py-1.5 text-left text-xs transition-all select-none',
                            isSelected
                              ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-sm [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]'
                              : 'border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-950',
                          )}
                        >
                          <span className="truncate">{comp.name}</span>
                          {isSelected && <GeometricAsterisk className="h-3 w-3 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* COLUMN 2: Center Main Documentation & Stage (Cloudflare Docs Style) */}
          <main className="space-y-10 lg:col-span-6">
            {/* Header Anchor Section (Matching Image 2: "🔗 Access on Workers: how it works") */}
            <div id="how-it-works" className="space-y-4">
              <div className="flex flex-col gap-4 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <a
                    href="#how-it-works"
                    className="font-mono text-xl text-[#0056FF] hover:underline"
                    title="Direct Section Link"
                  >
                    🔗
                  </a>
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

              {/* Architectural Token Flow Diagram Card (Matching Image 2 Diagram with 2px lines & chamfer cut) */}
              <div
                id="architecture-flow"
                className="overflow-hidden border-2 border-slate-200 bg-white p-6 shadow-xs transition-all duration-300 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)] hover:border-[#0056FF]"
              >
                <div className="flex flex-col items-center justify-around gap-4 sm:flex-row">
                  {/* Node 1: Developer */}
                  <div className="flex flex-col items-center gap-2 text-center">
                    <div className="flex h-14 w-14 items-center justify-center border-2 border-slate-300 bg-slate-50 text-slate-800 [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]">
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
                    <div className="relative flex h-14 w-14 items-center justify-center border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-md [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]">
                      <span className="font-mono text-[11px] font-bold">#0056FF</span>
                      <GeometricAsterisk className="absolute -top-1 -right-1 h-3.5 w-3.5 text-white" />
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
                    <div className="flex h-14 w-14 items-center justify-center border-2 border-slate-300 bg-slate-50 text-slate-800 [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)]">
                      <span className="font-mono text-base font-bold">UI 10</span>
                    </div>
                    <span className="font-sans text-xs font-semibold tracking-wider text-slate-800 uppercase">
                      Component
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* TAB CONTENT 1: Component Catalog (Image 1 Style Grid with Hover Animations) */}
            {activeTab === 'catalog' && (
              <section id="component-gallery" className="space-y-4">
                <ComponentGalleryGrid
                  onSelectComponent={handleSelectFromGallery}
                  selectedId={selectedComponentId}
                />
              </section>
            )}

            {/* TAB CONTENT 2: Interactive Component Playground */}
            {activeTab === 'playground' && (
              <section id="interactive-stage" className="space-y-6">
                <div className="flex items-center justify-between border-b-2 border-slate-200 pb-3">
                  <div>
                    <h2 className="font-sans text-2xl font-black text-slate-950">
                      {activeDoc.name}
                    </h2>
                    <p className="mt-1 text-sm text-slate-600">{activeDoc.description}</p>
                  </div>

                  <GeometricButton
                    variant="outline"
                    size="sm"
                    onClick={() => setActiveTab('catalog')}
                  >
                    <span>&larr; Catalog</span>
                  </GeometricButton>
                </div>

                {/* Interactive Stage Card (Geometric 2px lines & chamfer cut) */}
                <div className="overflow-hidden border-2 border-slate-200 bg-white shadow-xs transition-all duration-300 [clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)] hover:border-[#0056FF]">
                  {/* Stage Body */}
                  <div className="flex min-h-[220px] items-center justify-center bg-slate-50/70 p-8">
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

                  {/* Action Ribbon: Code Toggle & Copy (Geometric Buttons) */}
                  <div className="flex items-center justify-between border-t-2 border-slate-200 bg-white px-4 py-2.5">
                    <GeometricButton
                      size="sm"
                      variant={showCode ? 'primary' : 'outline'}
                      isActive={showCode}
                      showAsterisk
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
                    <div className="border-t-2 border-slate-200 bg-slate-900 p-4">
                      <pre className="overflow-x-auto font-mono text-xs text-slate-100">
                        <code>{activeDoc.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>

                {/* Component Props Table (Geometric 2px lines & chamfer cut) */}
                <div className="space-y-2">
                  <h3 className="font-sans text-sm font-bold tracking-wider text-slate-900 uppercase">
                    Props Interface
                  </h3>
                  <div className="overflow-x-auto border-2 border-slate-200 bg-white [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
                    <table className="w-full text-left font-sans text-xs">
                      <thead className="border-b-2 border-slate-200 bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-4 py-2.5 font-bold tracking-wider uppercase">Prop</th>
                          <th className="px-4 py-2.5 font-bold tracking-wider uppercase">Type</th>
                          <th className="px-4 py-2.5 font-bold tracking-wider uppercase">
                            Default
                          </th>
                          <th className="px-4 py-2.5 font-bold tracking-wider uppercase">
                            Description
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {activeDoc.props.map((p) => (
                          <tr key={p.name}>
                            <td className="px-4 py-2 font-mono font-bold text-[#0056FF]">
                              {p.name}
                            </td>
                            <td className="px-4 py-2 font-mono text-slate-600">{p.type}</td>
                            <td className="px-4 py-2 font-mono text-slate-400">
                              {p.default || '-'}
                            </td>
                            <td className="px-4 py-2 text-slate-600">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </section>
            )}

            {/* TAB CONTENT 3: Brand Colors */}
            {activeTab === 'blueprint' && (
              <section id="brand-blueprint" className="space-y-4">
                <BrandConceptBlueprint />
              </section>
            )}

            {/* Design Principles Section */}
            <section id="design-principles" className="space-y-4 border-t border-slate-200 pt-8">
              <div className="flex items-center gap-2">
                <a
                  href="#design-principles"
                  className="font-mono text-lg text-[#0056FF] hover:underline"
                  title="Direct Section Link"
                >
                  🔗
                </a>
                <h2 className="font-sans text-xl font-bold text-slate-950">
                  Flat Design & Zero Shadows Policy
                </h2>
              </div>

              <p className="font-sans text-sm leading-relaxed text-slate-600">
                Every component adheres to strict flat design principles without dropped blur
                shadows (`box-shadow: none`). Spatial depth is established strictly through 1px
                border contrast and background elevation hierarchy.
              </p>

              <div id="touch-targets" className="space-y-2 pt-2">
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
}) {
  switch (props.id) {
    case 'snackbar':
      return (
        <div className="flex flex-wrap items-center justify-center gap-3 py-6">
          <GeometricButton
            variant="primary"
            showAsterisk
            onClick={() => {
              props.setSnackbarMsg('Student profile updated.');
              props.setSnackbarOpen(true);
            }}
          >
            <Check className="h-4 w-4" />
            <span>Trigger Confirmation Snackbar</span>
          </GeometricButton>
        </div>
      );

    case 'bottom-sheet':
      return (
        <div className="flex items-center justify-center py-6">
          <GeometricButton variant="outline" showAsterisk onClick={() => props.setSheetOpen(true)}>
            <MapPin className="h-4 w-4" />
            <span>Open Bottom Sheet</span>
          </GeometricButton>
        </div>
      );

    case 'dialog':
      return (
        <div className="flex items-center justify-center py-6">
          <GeometricButton variant="outline" showAsterisk onClick={() => props.setDialogOpen(true)}>
            <span>Trigger Decision Dialog</span>
          </GeometricButton>
        </div>
      );

    case 'bottom-nav':
      return (
        <div className="w-full max-w-sm py-4">
          <div className="overflow-hidden border-2 border-slate-200 bg-white p-2 shadow-xs [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
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
                      'flex flex-col items-center gap-1 rounded-md border-2 px-4 py-2 transition-all select-none',
                      isActive
                        ? 'border-[#0056FF] bg-[#0056FF] font-bold text-white shadow-sm [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]'
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
        </div>
      );

    case 'switch':
      return (
        <div className="flex items-center gap-3 py-6">
          <span className="text-xs font-medium text-slate-800">System Telemetry Probe</span>
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
            className="bg-[#0056FF] text-white hover:bg-[#0040C0]"
          />
          <span className="font-sans text-xs text-slate-500">Clicks: {props.fabCount}</span>
        </div>
      );

    case 'card':
      return (
        <div className="w-full max-w-xs py-4">
          <LibraryCard className="border-2 border-slate-200 bg-white shadow-xs [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
            <LibraryCardMedia className="relative flex h-24 w-full items-start justify-between rounded-lg bg-gradient-to-r from-blue-100 to-[#0056FF] p-3">
              <span className="border-2 border-[#0056FF] bg-[#0056FF] px-2 py-0.5 font-sans text-[10px] font-bold text-white [clip-path:polygon(0_0,calc(100%-6px)_0,100%_6px,100%_100%,0_100%)]">
                STEM
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
            <LibraryCardFooter className="flex items-center justify-between border-t-2 border-slate-100 pt-3">
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
        <div className="w-full max-w-xs py-6">
          <select className="h-10 w-full border-2 border-slate-200 bg-white px-3 font-sans text-xs text-slate-800 [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)] focus:border-[#0056FF] focus:outline-none">
            <option value="sora">Sora — Primary Brand Typography</option>
            <option value="inter">Inter — UI Sans</option>
            <option value="roboto">Roboto — M3 Material</option>
          </select>
        </div>
      );

    case 'tooltip':
      return (
        <div className="flex items-center justify-center gap-3 py-6">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border-2 border-slate-300 bg-white text-sm font-bold text-slate-800 shadow-xs transition-all [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)] hover:border-[#0056FF] hover:bg-[#0056FF] hover:text-white"
            title="Move Tool (Shortcut: V)"
          >
            V
          </button>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center border-2 border-slate-300 bg-white text-sm font-bold text-slate-800 shadow-xs transition-all [clip-path:polygon(0_0,calc(100%-8px)_0,100%_8px,100%_100%,0_100%)] hover:border-[#0056FF] hover:bg-[#0056FF] hover:text-white"
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
