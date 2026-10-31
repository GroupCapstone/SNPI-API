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
  Play,
  Volume,
  VolumeX,
} from '@/components/icons';
import { RailToc, type RailTocItem } from '../rail-toc';
import { HookSidebar, type HookSidebarItem } from '../hook-sidebar';
import { IconBar } from '../icon-bar';
import { CyberArmorNav, type HangingTabItem } from '../hanging-tabs-nav';

// 1. Primary Component: Rail TOC (Paper Plane Flying Along Indented Track)
export function RailTocDemo() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = React.useState('installation');
  const [isAutopiloting, setIsAutopiloting] = React.useState(false);
  const autopilotTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);

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

  const sectionDetails: Record<
    string,
    { summary: string; note: string; tag: string; code?: string }
  > = {
    installation: {
      summary: 'Get started with package installation and repository cloning.',
      note: 'Run npm install to bootstrap monorepo workspaces and shared packages.',
      tag: 'CORE SETUP',
      code: 'git clone <REPO_URL> && npm install',
    },
    prerequisites: {
      summary: 'Verify runtime environments before initiating builds.',
      note: 'Requires Node.js >= 22.13.0, npm >= 10.8, and MongoDB Replica Set (rs0).',
      tag: 'RUNTIME',
      code: 'node -v && mongod --replSet rs0',
    },
    'installation-steps': {
      summary: 'Execute the five-stage local development orchestration.',
      note: 'Step 1: npm run build:shared. Step 2: npm run dev:backend. Step 3: npm run dev:frontend.',
      tag: 'PIPELINE',
      code: 'npm run build:shared && npm run dev',
    },
    configuration: {
      summary: 'Define environment configurations across workspaces.',
      note: 'Populate .env with BACKEND_INTERNAL_URL, MONGO_URI, and JWT secrets.',
      tag: 'ENVIRONMENT',
      code: 'BACKEND_INTERNAL_URL=http://localhost:5001\nMONGO_URI=mongodb://localhost:27017/snp_sms?replicaSet=rs0',
    },
    usage: {
      summary: 'Explore interactive components in the Developer Documentation Library.',
      note: 'Navigate to /document/design-system to review live components, states, and prompt skills.',
      tag: 'DOCUMENTATION',
      code: 'open http://localhost:3000/document/design-system',
    },
    'customizing-content': {
      summary: 'Tailor component tokens and theme variables.',
      note: 'Override CSS variables or pass custom variant props without touching global CSS.',
      tag: 'DESIGN TOKENS',
      code: '--brand-blue: #0056FF;\n--brand-azure: #2277FF;\n--elevation-1: #FFFFFF;',
    },
    'submenu-content': {
      summary: 'Configure nested navigation hierarchies and subcategories.',
      note: 'Support multi-tier navigation trees with indented SVG rail paths and filleted bends.',
      tag: 'HIERARCHY',
      code: '{ id: "submenu-content", label: "Submenu Content", depth: 2 }',
    },
    features: {
      summary: 'Production enterprise pillars for the SNP-SMS platform.',
      note: '7-layer modular monolith, constant-time crypto, and WCAG AA/AAA compliance.',
      tag: 'ENTERPRISE',
      code: 'npm run smoke && npm run test:api && npm run deploy:verify',
    },
  };

  const handleScrollTo = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el && containerRef.current) {
      const cRect = containerRef.current.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      containerRef.current.scrollTo({
        top: containerRef.current.scrollTop + elRect.top - cRect.top - 20,
        behavior: 'smooth',
      });
    }
  };

  const handleAutopilot = () => {
    if (isAutopiloting) {
      setIsAutopiloting(false);
      if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
      return;
    }

    setIsAutopiloting(true);
    let step = 0;
    const itemsCount = tocItems.length;

    const runStep = () => {
      if (step < itemsCount) {
        handleScrollTo(tocItems[step].id);
        step += 1;
        autopilotTimeoutRef.current = setTimeout(runStep, 800);
      } else if (step === itemsCount) {
        // Pause at bottom, then fly back up to top
        autopilotTimeoutRef.current = setTimeout(() => {
          handleScrollTo(tocItems[0].id);
          autopilotTimeoutRef.current = setTimeout(() => {
            setIsAutopiloting(false);
          }, 850);
        }, 500);
      }
    };

    runStep();
  };

  React.useEffect(() => {
    return () => {
      if (autopilotTimeoutRef.current) clearTimeout(autopilotTimeoutRef.current);
    };
  }, []);

  return (
    <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF5FF]">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden="true">
              <path
                d="M 22 12 L 2 3 L 7 12 Z"
                fill="#2277FF"
                stroke="#0056FF"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
              <path
                d="M 22 12 L 2 21 L 7 12 Z"
                fill="#0056FF"
                stroke="#003ECC"
                strokeWidth="0.5"
                strokeLinejoin="round"
              />
              <line
                x1="2"
                y1="12"
                x2="22"
                y2="12"
                stroke="#FFFFFF"
                strokeWidth="0.75"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div>
            <h3 className="font-sans text-xs font-bold text-slate-950">Rail TOC</h3>
            <p className="font-sans text-[11px] text-slate-500">
              A table of contents with a paper plane that flies to the section you&apos;re reading.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Autopilot Tour Button */}
          <button
            type="button"
            onClick={handleAutopilot}
            className={cn(
              'flex cursor-pointer items-center gap-1.5 rounded-[4px] border-0 px-3 py-1.5 font-sans text-[11px] font-semibold transition-all select-none',
              isAutopiloting
                ? 'bg-[#0056FF] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
            title="Automatically fly through all sections and return to start"
          >
            <Play className="size-3 fill-current" />
            <span>{isAutopiloting ? 'Flying Tour...' : 'Autopilot Tour'}</span>
          </button>
        </div>
      </div>

      {/* Quick Jump Buttons with 4px radius standard */}
      <div className="mt-3.5 flex flex-wrap items-center gap-1.5 border-b border-slate-100 pb-3.5">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
          Quick Jump:
        </span>
        {tocItems.map((it) => {
          const isCurrent = it.id === activeSection;
          return (
            <button
              key={it.id}
              type="button"
              onClick={() => handleScrollTo(it.id)}
              className={cn(
                'cursor-pointer rounded-[4px] border-0 px-2.5 py-1 font-sans text-[11px] font-semibold transition-all select-none',
                isCurrent
                  ? 'bg-[#0056FF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {it.label}
            </button>
          );
        })}
      </div>

      {/* Interactive Two-Column Playground */}
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Left: Scrollable Document Content Container (Tracks Scroll in Real Time) */}
        <div
          ref={containerRef}
          className="no-scrollbar h-96 space-y-4 overflow-y-auto rounded-xl border border-slate-100 bg-[#F8FAFC] p-4 select-text md:col-span-7"
        >
          {tocItems.map((item) => {
            const isCurrent = activeSection === item.id;
            const details = sectionDetails[item.id];
            return (
              <section
                key={item.id}
                id={item.id}
                className={cn(
                  'rounded-lg border p-4 transition-all duration-200',
                  isCurrent
                    ? 'border-[#0056FF]/40 bg-white shadow-2xs ring-1 ring-[#0056FF]/20'
                    : 'border-slate-200/80 bg-white/70',
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-sans text-xs font-bold text-slate-900">{item.label}</h4>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-[3px] bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-600">
                      {details?.tag}
                    </span>
                    <span className="font-mono text-[9px] font-semibold text-[#0056FF]">
                      DEPTH {item.depth || 0}
                    </span>
                  </div>
                </div>

                <p className="mt-2 font-sans text-[11px] leading-relaxed text-slate-600">
                  {details?.summary}
                </p>

                {details?.code && (
                  <div className="mt-2.5 overflow-x-auto rounded-[4px] border border-slate-200/90 bg-slate-50 p-2 font-mono text-[10px] text-slate-800">
                    <pre className="m-0 leading-tight">
                      <code>{details.code}</code>
                    </pre>
                  </div>
                )}

                <div className="mt-2.5 rounded-[4px] border-0 bg-slate-100/90 p-2 font-sans text-[10px] text-slate-600">
                  <strong className="text-slate-800">Implementation Guide:</strong> {details?.note}
                </div>
              </section>
            );
          })}
        </div>

        {/* Right: The Paper Plane Rail TOC (Matches User Attachment Exact Style) */}
        <div className="flex flex-col justify-start rounded-xl border border-slate-100 bg-white p-4.5 md:col-span-5">
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

// 3. Hook Sidebar (A vertical navigation list with a dashed rail that marks the active item)
export function HookSidebarDemo() {
  const [dashed, setDashed] = React.useState(true);
  const [accentColor, setAccentColor] = React.useState('#0056FF');
  const [displayIndex, setDisplayIndex] = React.useState(0);
  const [navIndex, setNavIndex] = React.useState(1);

  const displayItems: HookSidebarItem[] = [
    { label: 'Folder' },
    { label: 'Code block' },
    { label: 'Bento Grid' },
    { label: 'Data Table' },
  ];

  const navigationItems: HookSidebarItem[] = [
    { label: 'Gooey nav' },
    { label: 'Hook Sidebar' },
    { label: 'Rail TOC' },
    { label: 'Bottom Sheet' },
  ];

  const colorPresets = [
    { label: 'Royal Blue', value: '#0056FF' },
    { label: 'Rare Orange', value: '#FC4C01' },
    { label: 'Azure', value: '#2277FF' },
    { label: 'Emerald', value: '#10B981' },
  ];

  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
      {/* Header and Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-sans text-xs font-bold text-slate-950">Hook Sidebar</h3>
          <p className="font-sans text-[11px] text-slate-500">
            Click an item to spring the accent rail down to it. Hovering draws a second, dimmer
            rail.
          </p>
        </div>

        {/* Style Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dashed / Solid Toggle */}
          <button
            type="button"
            onClick={() => setDashed(!dashed)}
            className="cursor-pointer rounded-[4px] border-0 bg-slate-100 px-2.5 py-1 font-sans text-[11px] font-semibold text-slate-700 transition-all select-none hover:bg-slate-200"
          >
            {dashed ? 'Dashed Rail' : 'Solid Rail'}
          </button>

          {/* Color Switcher */}
          <div className="flex items-center gap-1 rounded-[4px] bg-slate-50 p-1">
            {colorPresets.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setAccentColor(preset.value)}
                style={{ backgroundColor: preset.value }}
                className={cn(
                  'size-4 cursor-pointer rounded-full transition-transform select-none',
                  accentColor === preset.value
                    ? 'scale-125 ring-2 ring-slate-900 ring-offset-1'
                    : 'opacity-70 hover:opacity-100',
                )}
                title={preset.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Two-Column Stacked Demo Presentation */}
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {/* Left Column: Display Group */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-5">
          <HookSidebar
            label="Display"
            items={displayItems}
            value={displayIndex}
            onChange={(idx) => setDisplayIndex(idx)}
            color={accentColor}
            dashed={dashed}
          />
        </div>

        {/* Right Column: Navigation Group */}
        <div className="rounded-xl border border-slate-100 bg-[#F8FAFC] p-5">
          <HookSidebar
            label="Navigation"
            items={navigationItems}
            value={navIndex}
            onChange={(idx) => setNavIndex(idx)}
            color={accentColor}
            dashed={dashed}
          />
        </div>
      </div>

      {/* Active State Telemetry Footer */}
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 font-mono text-[11px] text-slate-500">
        <div>
          Active Display:{' '}
          <span className="font-bold text-slate-900">
            {typeof displayItems[displayIndex] === 'string'
              ? displayItems[displayIndex]
              : (displayItems[displayIndex] as { label: string }).label}
          </span>
        </div>
        <div>
          Active Navigation:{' '}
          <span className="font-bold text-slate-900" style={{ color: accentColor }}>
            {typeof navigationItems[navIndex] === 'string'
              ? navigationItems[navIndex]
              : (navigationItems[navIndex] as { label: string }).label}
          </span>
        </div>
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
    { id: 'library', label: 'UI LIBRARY', icon: Layers },
    { id: 'openapi', label: 'OPEN API', icon: FileText },
    { id: 'changelog', label: 'CHANGELOG', icon: Code },
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
