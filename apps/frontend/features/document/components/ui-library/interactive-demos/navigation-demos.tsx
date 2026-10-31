'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Compass,
  Layers,
  FileText,
  Settings,
  ChevronRight,
  BookOpen,
  Code,
  Sparkles,
  ChevronLeft,
  Menu,
} from '@/components/icons';
import { RailToc, type RailTocItem } from '../rail-toc';
import { IconBar } from '../icon-bar';
import { CyberArmorNav, type HangingTabItem } from '../hanging-tabs-nav';

// 1. Primary Component: Rail TOC (Paper Plane Flying Along Indented Track)
export function RailTocDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = React.useState('installation');

  const tocItems: RailTocItem[] = [
    { id: 'installation', label: 'Installation', depth: 0 },
    { id: 'prerequisites', label: 'Prerequisites', depth: 1 },
    { id: 'installation-steps', label: 'Installation Steps', depth: 1 },
    { id: 'configuration', label: 'Configuration', depth: 1 },
    { id: 'usage', label: 'Usage', depth: 0 },
    { id: 'customizing-content', label: 'Customizing Content', depth: 1 },
    { id: 'submenu-content', label: 'Submenu Content', depth: 2 },
    { id: 'features', label: 'Features', depth: 0 },
  ];

  const sectionDetails: Record<string, { summary: string; note: string }> = {
    installation: {
      summary: 'Get started with package installation and repository cloning.',
      note: 'Run npm install to bootstrap monorepo workspaces and shared packages.',
    },
    prerequisites: {
      summary: 'Verify runtime environments before initiating builds.',
      note: 'Requires Node.js >= 22.13.0, npm >= 10.8, and MongoDB Replica Set (rs0).',
    },
    'installation-steps': {
      summary: 'Execute the five-stage local development orchestration.',
      note: 'Step 1: npm run build:shared. Step 2: npm run dev:backend. Step 3: npm run dev:frontend.',
    },
    configuration: {
      summary: 'Define environment configurations across workspaces.',
      note: 'Populate .env with BACKEND_INTERNAL_URL, MONGO_URI, and JWT secrets.',
    },
    usage: {
      summary: 'Explore interactive components in the Developer Documentation Library.',
      note: 'Navigate to /document/design-system to review live components, states, and prompt skills.',
    },
    'customizing-content': {
      summary: 'Tailor component tokens and theme variables.',
      note: 'Override CSS variables or pass custom variant props without touching global CSS.',
    },
    'submenu-content': {
      summary: 'Configure nested navigation hierarchies and subcategories.',
      note: 'Support multi-tier navigation trees with indented SVG rail paths and filleted bends.',
    },
    features: {
      summary: 'Production enterprise pillars for the SNP-SMS platform.',
      note: '7-layer modular monolith, constant-time crypto, and WCAG AA/AAA compliance.',
    },
  };

  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-2.5">
          <svg
            viewBox="0 0 24 24"
            className="size-5 -rotate-90 fill-[#0056FF]"
            aria-hidden="true"
          >
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
          </svg>
          <div>
            <h3 className="font-sans text-xs font-bold text-slate-950">
              Rail TOC · Paper Plane Flight Navigator
            </h3>
            <p className="font-sans text-[11px] text-slate-500">
              Plane flies along rail bends, turns around on scroll-up, and fills passed track.
            </p>
          </div>
        </div>

        {/* Quick Jump Buttons with 0px border and 4px radius standard */}
        <div className="flex flex-wrap items-center gap-1.5">
          {tocItems.slice(0, 4).map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => {
                setActiveSection(it.id);
                const el = document.getElementById(it.id);
                if (el && containerRef.current) {
                  const cRect = containerRef.current.getBoundingClientRect();
                  const elRect = el.getBoundingClientRect();
                  containerRef.current.scrollTo({
                    top: containerRef.current.scrollTop + elRect.top - cRect.top - 20,
                    behavior: 'smooth',
                  });
                }
              }}
              className={cn(
                'cursor-pointer rounded-[4px] border-0 px-2.5 py-1 font-sans text-[11px] font-semibold transition-all',
                activeSection === it.id
                  ? 'bg-[#0056FF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {it.label}
            </button>
          ))}
        </div>
      </div>

      {/* Interactive Two-Column Playground */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Scrollable Document Content Container (Tracks Scroll in Real Time) */}
        <div
          ref={containerRef}
          className="no-scrollbar h-80 space-y-6 overflow-y-auto rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 select-text md:col-span-7"
        >
          {tocItems.map((item) => (
            <section
              key={item.id}
              id={item.id}
              className={cn(
                'rounded-lg border p-3.5 transition-all',
                activeSection === item.id
                  ? 'border-[#0056FF]/40 bg-white shadow-2xs'
                  : 'border-slate-200/80 bg-white/60',
              )}
            >
              <div className="flex items-center justify-between">
                <h4 className="font-sans text-xs font-bold text-slate-900">
                  {item.label}
                </h4>
                <span className="font-mono text-[9px] font-bold text-[#0056FF]">
                  DEPTH {item.depth || 0}
                </span>
              </div>
              <p className="mt-1 font-sans text-[11px] text-slate-600">
                {sectionDetails[item.id]?.summary}
              </p>
              <div className="mt-2 rounded-[4px] border-0 bg-slate-100/90 p-2 font-mono text-[10px] text-slate-700">
                {sectionDetails[item.id]?.note}
              </div>
            </section>
          ))}
        </div>

        {/* Right: The Paper Plane Rail TOC (Matches User Attachment Exact Style) */}
        <div className="flex flex-col justify-start rounded-xl border border-slate-100 bg-white p-4 md:col-span-5">
          <RailToc
            items={tocItems}
            containerRef={containerRef}
            offset={20}
            indent={16}
            activeId={activeSection}
            onSelect={(id) => setActiveSection(id)}
            title="On this page"
          />
        </div>
      </div>
    </div>
  );
}

// 2. Bounce Sidebar (Collapsible with Bouncy Spring Physics)
export function BounceSidebarDemo() {
  const [isOpen, setIsOpen] = React.useState(true);
  const [activeItem, setActiveItem] = React.useState('dashboard');

  const items = [
    { id: 'dashboard', label: 'Academics', icon: BookOpen },
    { id: 'modules', label: 'Curriculum', icon: Layers },
    { id: 'apis', label: 'Endpoints', icon: Code },
    { id: 'settings', label: 'Preferences', icon: Settings },
  ];

  return (
    <div className="flex h-64 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-xs">
      {/* Sidebar Panel */}
      <div
        className={cn(
          'flex h-full flex-col justify-between border-r border-slate-200 bg-white p-3 transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]',
          isOpen ? 'w-44' : 'w-14',
        )}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2">
            {isOpen && (
              <span className="font-sans text-xs font-black text-slate-900">WORKSPACE</span>
            )}
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-1 text-slate-500 hover:bg-slate-100"
            >
              <Menu className="size-4" />
            </button>
          </div>

          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveItem(item.id)}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 font-sans text-xs font-semibold transition-all',
                    isActive
                      ? 'bg-[#0056FF] text-white shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {isOpen && <span className="truncate">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {isOpen && (
          <div className="rounded-xl border border-slate-200 bg-[#E3E7FC]/40 p-2 text-center font-sans text-[10px] font-bold text-[#0056FF]">
            Spring Physics Active
          </div>
        )}
      </div>

      {/* Simulated Main Content */}
      <div className="flex flex-1 items-center justify-center p-4 text-center">
        <span className="font-sans text-xs text-slate-500">
          Current View: <strong className="text-slate-800 uppercase">{activeItem}</strong>
        </span>
      </div>
    </div>
  );
}

// 3. Hook Sidebar (Kinetic Pull Hook Drawer)
export function HookSidebarDemo() {
  const [isHooked, setIsHooked] = React.useState(false);

  return (
    <div className="relative flex h-60 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      {/* Sliding Drawer */}
      <div
        className={cn(
          'absolute top-0 bottom-0 left-0 z-10 flex w-48 flex-col justify-between border-r border-slate-200 bg-white p-4 shadow-md transition-transform duration-300 ease-out',
          isHooked ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="space-y-2">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
            Hook Panel
          </span>
          <div className="space-y-1 font-sans text-xs font-medium text-slate-700">
            <div className="rounded-lg bg-slate-100 p-2">Direct Ledger #09</div>
            <div className="rounded-lg bg-slate-100 p-2">Batch Transfer Gate</div>
            <div className="rounded-lg bg-slate-100 p-2">Audit Checkpoints</div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsHooked(false)}
          className="rounded-lg border border-slate-200 py-1 font-sans text-xs text-slate-600 hover:bg-slate-100"
        >
          Close Drawer
        </button>
      </div>

      {/* Kinetic Hook Anchor Tab */}
      <button
        type="button"
        onClick={() => setIsHooked(!isHooked)}
        className={cn(
          'absolute top-1/2 z-20 flex -translate-y-1/2 items-center gap-1 rounded-r-xl border border-l-0 border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-3 font-sans text-xs font-bold text-[#0056FF] shadow-xs transition-all duration-300',
          isHooked ? 'left-48' : 'left-0',
        )}
      >
        <Compass className="animate-spin-slow size-4" />
        <span>HOOK</span>
      </button>

      <div className="flex flex-1 items-center justify-center pl-16 text-center font-sans text-xs text-slate-500">
        Tap the kinetic hook tab to pull out the drawer
      </div>
    </div>
  );
}

// 4. Proximity Sidebar (Expands on Hover Proximity)
export function ProximitySidebarDemo() {
  const [isNearby, setIsNearby] = React.useState(false);

  return (
    <div
      onMouseEnter={() => setIsNearby(true)}
      onMouseLeave={() => setIsNearby(false)}
      className="flex h-56 w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs"
    >
      <div
        className={cn(
          'flex h-full flex-col justify-between border-r border-slate-100 bg-[#F8FAFC] p-2.5 transition-all duration-200',
          isNearby ? 'w-40' : 'w-12',
        )}
      >
        <div className="space-y-3">
          <Sparkles className="size-5 text-[#0056FF]" />
          <div className="space-y-2">
            {[
              { icon: BookOpen, label: 'Courses' },
              { icon: FileText, label: 'Reports' },
              { icon: Settings, label: 'System' },
            ].map((m, idx) => {
              const Icon = m.icon;
              return (
                <div key={idx} className="flex items-center gap-2.5 text-slate-700">
                  <Icon className="size-4 shrink-0" />
                  {isNearby && <span className="font-sans text-xs font-semibold">{m.label}</span>}
                </div>
              );
            })}
          </div>
        </div>

        {isNearby && (
          <span className="font-mono text-[9px] font-bold text-slate-400">PROXIMITY ACTIVE</span>
        )}
      </div>

      <div className="flex flex-1 items-center justify-center p-4 text-center font-sans text-xs text-slate-500">
        Hover near left edge to trigger proximity expansion
      </div>
    </div>
  );
}

// 5. Scroll Progress Bar with Chapter Milestones
export function ScrollProgressDemo() {
  const [progress, setProgress] = React.useState(68);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between font-sans">
        <div>
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
            Scroll Progress
          </span>
          <h4 className="text-sm font-bold text-slate-900">Term 1 Assessment Syllabus</h4>
        </div>
        <span className="rounded-full bg-[#E3E7FC] px-2.5 py-0.5 font-mono text-xs font-bold text-[#0056FF]">
          {progress}%
        </span>
      </div>

      {/* Progress Track */}
      <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-[#0056FF] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
        {/* Milestone Tick Lines */}
        <div className="pointer-events-none absolute inset-0 flex justify-between px-6">
          <span className="h-full w-[1px] bg-white/70" />
          <span className="h-full w-[1px] bg-white/70" />
          <span className="h-full w-[1px] bg-white/70" />
        </div>
      </div>

      {/* Interactive Drag/Step Simulator */}
      <div className="flex items-center justify-between gap-2 pt-1 font-sans text-xs">
        <button
          type="button"
          onClick={() => setProgress(Math.max(0, progress - 15))}
          className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
        >
          -15% Prev
        </button>
        <span className="font-mono text-[11px] text-slate-400">Estimated ~3m remaining</span>
        <button
          type="button"
          onClick={() => setProgress(Math.min(100, progress + 15))}
          className="rounded-lg border border-slate-200 px-3 py-1 font-semibold text-slate-700 hover:bg-slate-50"
        >
          +15% Next
        </button>
      </div>
    </div>
  );
}

import { RareUiNavigationMenu } from '../navigation-menu';

// 6. Gooey Navigation (Fluid Sliding Capsule Pill)
export function GooeyNavDemo() {
  const [selected, setSelected] = React.useState('day');
  const tabs = [
    { id: 'day', label: 'Day' },
    { id: 'week', label: 'Week' },
    { id: 'month', label: 'Month' },
    { id: 'quarter', label: 'Quarter' },
  ];

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
        Fluid Gooey Pill Switcher
      </span>
      <div className="relative mt-3 inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
        {tabs.map((tab) => {
          const isActive = selected === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setSelected(tab.id)}
              className={cn(
                'relative z-10 cursor-pointer rounded-full px-4 py-1.5 font-sans text-xs font-bold transition-all duration-200',
                isActive
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900',
              )}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 font-sans text-xs text-slate-500">
        Selected Timeline: <strong className="text-slate-800 uppercase">{selected}</strong>
      </div>
    </div>
  );
}

// 7. Navigation Menu (Rare UI Floating 3-Island Header & Mega Menu)
export function NavigationMenuDemo() {
  return <RareUiNavigationMenu />;
}

// 8. Icon Bar (Horizontal Toolbar with Bloom Label Reveal & Roving Tabindex)
export function IconBarDemo() {
  const [selectedTool, setSelectedTool] = React.useState('pen');

  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 py-6">
      <IconBar selectedId={selectedTool} onSelect={setSelectedTool} />

      <div className="flex items-center gap-3 rounded-full border border-slate-200/90 bg-white px-4 py-1.5 shadow-2xs">
        <span className="font-mono text-[11px] text-slate-500">Active Tool:</span>
        <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
          {selectedTool || 'None (Cleared)'}
        </span>
      </div>
    </div>
  );
}

// 9. Cyber Armor Modular Nav (Aerospace / Mecha HUD Console)
export function CyberArmorNavDemo() {
  const [activeConsoleTab, setActiveConsoleTab] = React.useState('portfolio');
  const [activeDocsTab, setActiveDocsTab] = React.useState('library');

  // Full 8-Tab Mecha Console matching the reference image
  const fullMechaTabs: HangingTabItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'blog', label: 'Blog' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Services' },
    { id: 'team', label: 'Team' },
    { id: 'clients', label: 'Clients' },
    { id: 'shop', label: 'Shop' },
    { id: 'contact', label: 'Contact Us' },
  ];

  // 3-Tab System Documentation Navigation
  const systemDocTabs: HangingTabItem[] = [
    { id: 'library', label: 'UI Library', icon: Layers },
    { id: 'openapi', label: 'Open API', icon: FileText },
    { id: 'changelog', label: 'Changelog', icon: Code },
  ];

  return (
    <div className="w-full space-y-8">
      {/* Description Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
              Aerospace HUD Console Standard
            </span>
          </div>
          <h3 className="font-sans text-sm font-bold text-slate-900">
            Cyber Armor Modular Navigation Bar
          </h3>
          <p className="font-sans text-xs text-slate-500">
            Chamfered 45° stepped armor plates, physical double-seam divider lines, and luminous
            Royal Blue (#0056FF) active glow indicator.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5">
            45° Chamfered Wings
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5">
            Double-Seam Milled
          </span>
          <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 font-bold text-[#0056FF]">
            Royal Blue Glow
          </span>
        </div>
      </div>

      {/* Instance 1: Full 8-Tab Mecha Console (Matching Reference Image) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Instance 01 &middot; 8-Segment Command Console (Full Reference Style)
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            Active: <strong className="text-slate-900 uppercase">{activeConsoleTab}</strong>
          </span>
        </div>

        <div className="flex w-full items-center justify-center overflow-x-auto py-4">
          <CyberArmorNav
            items={fullMechaTabs}
            activeId={activeConsoleTab}
            onSelect={setActiveConsoleTab}
            showIcons={false}
            size="md"
          />
        </div>
      </div>

      {/* Instance 2: 3-Tab System Documentation Navigation Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Instance 02 &middot; 3-Segment System Docs Console
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            Active: <strong className="text-slate-900 uppercase">{activeDocsTab}</strong>
          </span>
        </div>

        <div className="flex w-full items-center justify-center overflow-x-auto py-4">
          <CyberArmorNav
            items={systemDocTabs}
            activeId={activeDocsTab}
            onSelect={setActiveDocsTab}
            showIcons={true}
            size="md"
          />
        </div>
      </div>
    </div>
  );
}
