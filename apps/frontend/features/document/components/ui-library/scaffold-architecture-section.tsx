'use client';

import * as React from 'react';
import {
  AppWindow,
  Columns3,
  Grid2x2,
  Maximize2,
  Minimize,
  Monitor,
  Smartphone,
  Tablet,
  Check,
  Copy,
  Layers,
  Sliders,
  Shield,
  Eye,
  Activity,
  Menu,
  Search,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export type ScaffoldElementFocus = 'all' | 'bars' | 'rails' | 'panes' | 'safety';
export type ScaffoldBreakpoint = 'compact' | 'medium' | 'expanded' | 'large' | 'extra-large';

export function ScaffoldArchitectureSection() {
  const [activeElement, setActiveElement] = React.useState<ScaffoldElementFocus>('all');
  const [activeBreakpoint, setActiveBreakpoint] = React.useState<ScaffoldBreakpoint>('expanded');
  const [showRulers, setShowRulers] = React.useState<boolean>(true);
  const [showSafetyInsets, setShowSafetyInsets] = React.useState<boolean>(true);
  const [topBarVariant, setTopBarVariant] = React.useState<'small' | 'center' | 'medium' | 'large'>(
    'small',
  );
  const [copiedToken, setCopiedToken] = React.useState<string | null>(null);

  const handleCopy = async (text: string, id: string) => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedToken(id);
        setTimeout(() => setCopiedToken(null), 1800);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#CAD3F5] bg-white p-5">
        <div className="space-y-0.5">
          <span className="font-sans text-xs font-bold tracking-wide text-[#0A1A4A] uppercase">
            Material 3 Layout Scaffold Architecture
          </span>
          <div className="font-mono text-[10px] text-slate-500">
            Bars &middot; Rails &middot; Panes &middot; Safety Regions &middot; Jetpack Compose
            Rulers &middot; Breakpoint Reflow
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
            FOCUS: {activeElement.toUpperCase()}
          </span>
          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[11px] text-slate-600">
            VIEWPORT: {activeBreakpoint.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Interactive Controls Bar */}
      <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#CAD3F5] bg-[#F8FAFC] p-4 text-xs md:grid-cols-2">
        {/* Element Focus Selector */}
        <div className="space-y-1.5">
          <span className="font-sans font-bold text-[#0A1A4A]">
            Scaffold Structural Anatomy Focus
          </span>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'all', label: 'Overview' },
              { id: 'bars', label: 'Bars' },
              { id: 'rails', label: 'Rails' },
              { id: 'panes', label: 'Panes' },
              { id: 'safety', label: 'Safety' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveElement(item.id as ScaffoldElementFocus)}
                className={cn(
                  'rounded-lg border px-2 py-1.5 text-center font-mono text-[11px] font-bold transition-all',
                  activeElement === item.id
                    ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                    : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Breakpoint Viewport Switcher */}
        <div className="space-y-1.5">
          <span className="font-sans font-bold text-[#0A1A4A]">Adaptive Breakpoint Simulator</span>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { id: 'compact', label: '<600dp' },
              { id: 'medium', label: '600-839' },
              { id: 'expanded', label: '840-1199' },
              { id: 'large', label: '1200-1599' },
              { id: 'extra-large', label: '≥1600dp' },
            ].map((bp) => (
              <button
                key={bp.id}
                type="button"
                onClick={() => setActiveBreakpoint(bp.id as ScaffoldBreakpoint)}
                className={cn(
                  'rounded-lg border px-1.5 py-1.5 text-center font-mono text-[10px] font-bold transition-all',
                  activeBreakpoint === bp.id
                    ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                    : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                )}
              >
                {bp.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Auxiliary Settings Bar: Toggles & Rulers */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[#CAD3F5] bg-white p-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowRulers(!showRulers)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold transition-all',
              showRulers
                ? 'border-[#0056FF] bg-[#EFF5FF] text-[#0056FF]'
                : 'border-[#CAD3F5] bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            <Eye className="h-3.5 w-3.5" />
            {showRulers ? 'Hide Compose Rulers' : 'Show Compose Rulers'}
          </button>

          <button
            type="button"
            onClick={() => setShowSafetyInsets(!showSafetyInsets)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-bold transition-all',
              showSafetyInsets
                ? 'border-[#0056FF] bg-[#EFF5FF] text-[#0056FF]'
                : 'border-[#CAD3F5] bg-white text-slate-600 hover:bg-slate-50',
            )}
          >
            <Shield className="h-3.5 w-3.5" />
            {showSafetyInsets ? 'Safety Insets: Visible' : 'Safety Insets: Hidden'}
          </button>
        </div>

        {/* Top App Bar Variant Selector */}
        <div className="flex items-center gap-1">
          <span className="mr-1 font-mono text-[10px] text-slate-500">TOP BAR:</span>
          {(['small', 'center', 'medium', 'large'] as const).map((variant) => (
            <button
              key={variant}
              type="button"
              onClick={() => setTopBarVariant(variant)}
              className={cn(
                'rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition-all',
                topBarVariant === variant
                  ? 'bg-[#0056FF] text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {variant}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Interactive Scaffold Canvas */}
      <div className="relative min-h-[500px] overflow-hidden rounded-2xl border-2 border-[#CAD3F5] bg-[#F8FAFC] p-4">
        {/* Optional Global Jetpack Compose Rulers Guidelines */}
        {showRulers && (
          <div className="pointer-events-none absolute inset-0 z-30">
            {/* Left Margin Ruler */}
            <div className="absolute top-0 bottom-0 left-6 border-l border-dashed border-red-400 opacity-60">
              <span className="absolute top-2 left-1 rounded bg-white/80 px-1 font-mono text-[9px] text-red-500">
                Margin Ruler (24dp)
              </span>
            </div>
            {/* Title Baseline Ruler */}
            <div className="absolute top-18 right-0 left-0 border-t border-dashed border-blue-400 opacity-60">
              <span className="absolute top-1 right-3 rounded bg-white/80 px-1 font-mono text-[9px] text-[#0056FF]">
                Title Baseline Ruler (56dp)
              </span>
            </div>
            {/* Split Anchor Ruler (Multi-pane mode) */}
            {activeBreakpoint !== 'compact' && (
              <div className="absolute top-0 bottom-0 left-[38%] border-l border-dashed border-emerald-400 opacity-60">
                <span className="absolute bottom-6 left-1 rounded bg-white/80 px-1 font-mono text-[9px] text-emerald-600">
                  Split Anchor Ruler (40% / 60%)
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-[#CAD3F5] bg-white shadow-sm">
          {/* 1. TOP SYSTEM SAFETY REGION */}
          {showSafetyInsets && (
            <div
              className={cn(
                'flex w-full items-center justify-between bg-slate-900 px-4 font-mono text-[10px] text-white transition-all',
                activeElement === 'safety'
                  ? 'bg-slate-950 py-2 ring-2 ring-amber-400'
                  : 'py-1 opacity-90',
              )}
            >
              <span>9:41 AM</span>
              <div className="flex h-3 w-20 items-center justify-center rounded-full bg-black/60 text-[8px] text-slate-300">
                CAMERA CUTOUT
              </div>
              <span>100% [LTE]</span>
            </div>
          )}

          {/* 2. TOP APP BAR */}
          <div
            className={cn(
              'flex items-center justify-between border-b border-slate-200 bg-white px-4 transition-all',
              topBarVariant === 'small' && 'h-14',
              topBarVariant === 'center' && 'h-14 justify-center',
              topBarVariant === 'medium' && 'h-20 flex-col items-start justify-center py-2',
              topBarVariant === 'large' && 'h-28 flex-col items-start justify-end pb-3',
              activeElement === 'bars' ? 'bg-[#EFF5FF] ring-2 ring-[#0056FF]' : '',
            )}
          >
            <div className="flex w-full items-center gap-3">
              <button
                type="button"
                className="rounded-lg p-1 text-[#0A1A4A] hover:bg-slate-100"
                title="Navigation Menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className={cn('flex-1', topBarVariant === 'center' && 'text-center')}>
                <span className="font-sans text-sm font-bold text-[#0A1A4A]">
                  Academic Scaffold Hub
                </span>
                {(topBarVariant === 'medium' || topBarVariant === 'large') && (
                  <div className="font-sans text-xs text-slate-500">
                    Comprehensive student enrollment &amp; curriculum platform
                  </div>
                )}
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="rounded-lg p-1.5 text-[#0056FF] hover:bg-slate-100"
                  title="Search Catalog"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* 3. CORE SCAFFOLD BODY: RAILS & PANES */}
          <div className="flex min-h-[340px] flex-1 overflow-hidden">
            {/* LEADING NAVIGATION RAIL (Active on Medium+) */}
            {activeBreakpoint !== 'compact' && (
              <div
                className={cn(
                  'flex flex-col items-center border-r border-slate-200 bg-[#F8FAFC] px-2 py-3 transition-all',
                  activeBreakpoint === 'large' || activeBreakpoint === 'extra-large'
                    ? 'w-48 items-start px-3'
                    : 'w-18',
                  activeElement === 'rails' ? 'bg-[#EFF5FF] ring-2 ring-[#0056FF]' : '',
                )}
              >
                <span className="mb-2 font-mono text-[9px] font-bold text-slate-400 uppercase">
                  {activeBreakpoint === 'large' || activeBreakpoint === 'extra-large'
                    ? 'Nav Drawer'
                    : 'Rail'}
                </span>
                <div className="w-full space-y-2">
                  {[
                    { id: 'home', label: 'Home', active: true },
                    { id: 'students', label: 'Students', active: false },
                    { id: 'courses', label: 'Courses', active: false },
                    { id: 'settings', label: 'Settings', active: false },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      className={cn(
                        'flex w-full items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-bold transition-all',
                        tab.active
                          ? 'bg-[#0056FF] text-white shadow-none'
                          : 'text-slate-700 hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                      )}
                    >
                      <AppWindow className="h-4 w-4 shrink-0" />
                      {(activeBreakpoint === 'large' || activeBreakpoint === 'extra-large') && (
                        <span>{tab.label}</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* PRIMARY CONTENT PANE */}
            <div
              className={cn(
                'flex-1 space-y-3 overflow-y-auto p-4 transition-all',
                activeElement === 'panes' ? 'bg-emerald-50/20 ring-2 ring-emerald-500' : 'bg-white',
              )}
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  PRIMARY PANE ({activeBreakpoint === 'compact' ? 'SINGLE PANE' : 'CO-PLANAR 1'})
                </span>
                <span className="font-mono text-[10px] text-slate-400">Content Stream</span>
              </div>

              {/* Sample Content Cards */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                {[
                  { title: 'CS401 Distributed Systems', code: 'SEC-A', enrolled: '42/45' },
                  { title: 'MATH302 Linear Algebra', code: 'SEC-B', enrolled: '38/40' },
                  { title: 'ENG201 Technical Writing', code: 'SEC-C', enrolled: '29/30' },
                  { title: 'PHY101 Applied Physics', code: 'SEC-D', enrolled: '50/50' },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="space-y-1 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF]/40 p-3 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-sans text-xs font-bold text-[#0A1A4A]">
                        {item.title}
                      </span>
                      <span className="rounded border border-[#CAD3F5] bg-white px-1.5 py-0.5 font-mono text-[9px] text-[#0056FF]">
                        {item.code}
                      </span>
                    </div>
                    <div className="font-mono text-[10px] text-slate-500">
                      Capacity: {item.enrolled}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECONDARY SUPPORTING PANE (Active on Expanded+) */}
            {activeBreakpoint !== 'compact' && activeBreakpoint !== 'medium' && (
              <div
                className={cn(
                  'w-64 space-y-3 border-l border-slate-200 p-4 transition-all',
                  activeElement === 'panes'
                    ? 'bg-emerald-50/20 ring-2 ring-emerald-500'
                    : 'bg-[#F8FAFC]',
                )}
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span className="font-mono text-[10px] font-bold text-slate-600 uppercase">
                    SUPPORTING PANE
                  </span>
                  <span className="font-mono text-[9px] text-[#0056FF]">360dp</span>
                </div>
                <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                  <span className="font-mono text-[10px] font-bold text-slate-500 uppercase">
                    Contextual Tools
                  </span>
                  <div className="space-y-1.5 text-xs text-[#0A1A4A]">
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span>Room Assignment</span>
                      <span className="font-mono font-bold text-[#0056FF]">Lab 402</span>
                    </div>
                    <div className="flex justify-between border-b border-slate-100 py-1">
                      <span>Faculty Lead</span>
                      <span className="font-mono font-bold text-[#0056FF]">Dr. S. Chen</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Live Telemetry</span>
                      <span className="font-mono font-bold text-emerald-600">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 4. BOTTOM NAVIGATION BAR (Compact Only) */}
          {activeBreakpoint === 'compact' && (
            <div
              className={cn(
                'flex h-16 items-center justify-around border-t border-slate-200 bg-white px-2 transition-all',
                activeElement === 'bars' ? 'bg-[#EFF5FF] ring-2 ring-[#0056FF]' : '',
              )}
            >
              {['Home', 'Courses', 'Schedule', 'Profile'].map((item, i) => (
                <button
                  key={item}
                  type="button"
                  className={cn(
                    'flex flex-col items-center justify-center text-[10px] font-bold',
                    i === 0 ? 'text-[#0056FF]' : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  <AppWindow className="h-4 w-4" />
                  <span>{item}</span>
                </button>
              ))}
            </div>
          )}

          {/* 5. BOTTOM SYSTEM SAFETY REGION (Home Indicator) */}
          {showSafetyInsets && (
            <div
              className={cn(
                'flex w-full items-center justify-center bg-slate-900 py-1 text-white transition-all',
                activeElement === 'safety' ? 'bg-slate-950 py-2 ring-2 ring-amber-400' : '',
              )}
            >
              <div className="h-1 w-32 rounded-full bg-white/70" />
            </div>
          )}
        </div>
      </div>

      {/* Section B: Scaffold Elements Architectural Breakdown */}
      <div className="grid grid-cols-1 gap-3 text-xs md:grid-cols-4">
        <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">1. Bars</span>
          <p className="text-slate-600">
            Frame top &amp; bottom perimeters. Top App Bar provides context and key actions; Bottom
            Navigation provides primary tab switching on mobile.
          </p>
          <div className="font-mono text-[10px] text-[#0056FF]">Height: 56–152dp</div>
        </div>

        <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">2. Rails</span>
          <p className="text-slate-600">
            Perimeter space bordering panes. Accommodates 80dp vertical navigation rails, editing
            toolbars, FABs, and XR spatial orbiters.
          </p>
          <div className="font-mono text-[10px] text-[#0056FF]">Width: 80–360dp</div>
        </div>

        <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">3. Panes</span>
          <p className="text-slate-600">
            Hold product primary content. Adapts from 1 pane (&lt;600dp) to 2 co-planar panes
            (840dp+) up to 3 panes (≥1600dp).
          </p>
          <div className="font-mono text-[10px] text-[#0056FF]">Panes: 1 to 3 Panes</div>
        </div>

        <div className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
          <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
            4. Safety Region
          </span>
          <p className="text-slate-600">
            Protective bounds safeguarding layout against camera cutouts, system gesture bars, and
            foldable physical hinges.
          </p>
          <div className="font-mono text-[10px] text-[#0056FF]">Insets: env(safe-area-*)</div>
        </div>
      </div>

      {/* Section C: Jetpack Compose Rulers & Spacing Tokens Reference */}
      <div className="space-y-3 rounded-xl border border-[#CAD3F5] bg-white p-4 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-sans font-bold tracking-wide text-[#0A1A4A] uppercase">
            Implementation Standards: Jetpack Compose Rulers &amp; Spacing Tokens
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            M3 Standard Spacing Grid (8dp)
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 md:grid-cols-6">
          {[
            { token: 'spacing.1', val: '4dp', role: 'Micro spacing, icon gap' },
            { token: 'spacing.2', val: '8dp', role: 'Component internal padding' },
            { token: 'spacing.4', val: '16dp', role: 'Standard card & mobile margin' },
            { token: 'spacing.5', val: '24dp', role: 'Section gap & tablet margin' },
            { token: 'spacing.6', val: '32dp', role: 'Desktop canvas margin' },
            { token: 'spacing.8', val: '48dp', role: 'Touch target minimum' },
          ].map((sp) => (
            <div
              key={sp.token}
              className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF]/50 p-2 text-left"
            >
              <div className="font-mono text-[10px] font-bold text-[#0056FF]">{sp.token}</div>
              <div className="font-sans text-sm font-bold text-[#0A1A4A]">{sp.val}</div>
              <div className="line-clamp-1 font-mono text-[9px] text-slate-500">{sp.role}</div>
            </div>
          ))}
        </div>

        {/* Jetpack Compose Rulers Snippet */}
        <div className="space-y-1 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-3 text-left font-mono text-[11px] text-slate-100">
          <div className="text-slate-400">
            {'// Jetpack Compose: Defining Alignment Rulers across Panes'}
          </div>
          <div>val MarginRuler = Ruler(&quot;margin_ruler&quot;)</div>
          <div>val TitleBaselineRuler = Ruler(&quot;title_baseline&quot;)</div>
          <div>val SplitAnchorRuler = Ruler(&quot;split_anchor&quot;)</div>
        </div>
      </div>
    </div>
  );
}
