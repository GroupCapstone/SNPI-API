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

// 1. Primary Component: Rail TOC (Vertical Rail with Active Indicator & Milestone Pips)
export function RailTocDemo() {
  const [activeSection, setActiveSection] = React.useState('architecture');
  const sections = [
    { id: 'overview', number: '01', title: 'System Overview', duration: '2 min read' },
    { id: 'architecture', number: '02', title: 'Modular Monolith Architecture', duration: '5 min read' },
    { id: 'database', number: '03', title: 'Relational MongoDB Schema', duration: '4 min read' },
    { id: 'security', number: '04', title: 'Cryptographic Security & RBAC', duration: '3 min read' },
    { id: 'deployment', number: '05', title: 'Vercel Serverless Gateway', duration: '2 min read' },
  ];

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const progressPercent = Math.round(((activeIndex + 1) / sections.length) * 100);

  return (
    <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-[#0056FF]" />
          <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
            Rail TOC · Primary
          </span>
        </div>
        <span className="font-mono text-[11px] font-bold text-[#0056FF]">{progressPercent}% Read</span>
      </div>

      <div className="relative mt-4 pl-4">
        {/* Continuous Background Rail Track */}
        <div className="absolute top-2 bottom-2 left-6 w-[2px] bg-slate-200" />
        {/* Dynamic Active Fill Track */}
        <div
          className="absolute top-2 left-6 w-[2px] bg-[#0056FF] transition-all duration-300"
          style={{ height: `${(activeIndex / (sections.length - 1)) * 82}%` }}
        />

        <div className="space-y-3.5">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                type="button"
                onClick={() => setActiveSection(sec.id)}
                className="group relative flex w-full cursor-pointer items-start gap-4 text-left focus:outline-none"
              >
                {/* Milestone Pip Pip */}
                <div
                  className={cn(
                    'relative z-10 flex size-5 shrink-0 items-center justify-center rounded-full border-2 bg-white transition-all duration-200',
                    isActive
                      ? 'border-[#0056FF] bg-[#0056FF] shadow-xs'
                      : 'border-slate-300 group-hover:border-slate-400',
                  )}
                >
                  <span
                    className={cn(
                      'size-1.5 rounded-full transition-colors',
                      isActive ? 'bg-white' : 'bg-transparent',
                    )}
                  />
                </div>

                {/* Section Content */}
                <div
                  className={cn(
                    'flex flex-1 items-center justify-between rounded-xl px-3 py-1.5 transition-colors',
                    isActive ? 'bg-[#E3E7FC]/60 text-[#0056FF]' : 'hover:bg-slate-50',
                  )}
                >
                  <div>
                    <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                      <span className={isActive ? 'text-[#0056FF]' : 'text-slate-400'}>
                        {sec.number}
                      </span>
                      <span className={cn('font-sans text-xs font-semibold', isActive ? 'text-[#0056FF]' : 'text-slate-800')}>
                        {sec.title}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-slate-400">{sec.duration}</span>
                  </div>
                  {isActive && <ChevronRight className="size-3.5 text-[#0056FF]" />}
                </div>
              </button>
            );
          })}
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
            {isOpen && <span className="font-sans text-xs font-black text-slate-900">WORKSPACE</span>}
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
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">Hook Panel</span>
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
          'absolute top-1/2 -translate-y-1/2 z-20 flex items-center gap-1 rounded-r-xl border border-l-0 border-[#CAD3F5] bg-[#E3E7FC] px-2.5 py-3 font-sans text-xs font-bold text-[#0056FF] shadow-xs transition-all duration-300',
          isHooked ? 'left-48' : 'left-0',
        )}
      >
        <Compass className="size-4 animate-spin-slow" />
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
          <div className="flex size-7 items-center justify-center rounded-lg bg-[#0056FF] text-white">
            <Sparkles className="size-4" />
          </div>
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
                isActive ? 'bg-[#0056FF] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900',
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
