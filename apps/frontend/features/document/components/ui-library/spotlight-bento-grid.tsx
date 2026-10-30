'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { ShieldCheck, Activity, GitBranch, Terminal, Cpu } from '@/components/icons';

export interface SpotlightBentoGridProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function SpotlightBentoGrid({ theme = 'light', className }: SpotlightBentoGridProps) {
  const isDark = theme === 'dark';
  const containerRef = React.useRef<HTMLDivElement>(null);
  const rafIdRef = React.useRef<number | null>(null);

  // 04 rAF-Throttled Pointer Tracker
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (rafIdRef.current) return;

    const target = containerRef.current;
    if (!target) return;

    const clientX = e.clientX;
    const clientY = e.clientY;

    rafIdRef.current = requestAnimationFrame(() => {
      const cards = target.querySelectorAll<HTMLElement>('[data-spotlight-card]');
      cards.forEach((card) => {
        const rect = card.getBoundingClientRect();
        const x = clientX - rect.left;
        const y = clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      });
      rafIdRef.current = null;
    });
  };

  const handlePointerLeave = () => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    const target = containerRef.current;
    if (!target) return;
    const cards = target.querySelectorAll<HTMLElement>('[data-spotlight-card]');
    cards.forEach((card) => {
      card.style.setProperty('--mouse-x', '-999px');
      card.style.setProperty('--mouse-y', '-999px');
    });
  };

  // 08 Final-State Fallback (prefers-reduced-motion)
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mediaQuery.addEventListener?.('change', listener);
      return () => mediaQuery.removeEventListener?.('change', listener);
    }
  }, []);

  // 05 Deploy Log 6-Second Cascading Loop State
  const [logProgress, setLogProgress] = React.useState(0);
  const [activeLogIndex, setActiveLogIndex] = React.useState(0);

  React.useEffect(() => {
    if (prefersReducedMotion) {
      setLogProgress(100);
      setActiveLogIndex(5);
      return;
    }

    const loopDurationMs = 6000;
    const intervalMs = 60;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed = (elapsed + intervalMs) % loopDurationMs;
      const progress = (elapsed / loopDurationMs) * 100;
      setLogProgress(progress);

      // 5 lines cascade sequentially
      if (progress < 20) setActiveLogIndex(1);
      else if (progress < 40) setActiveLogIndex(2);
      else if (progress < 60) setActiveLogIndex(3);
      else if (progress < 85) setActiveLogIndex(4);
      else setActiveLogIndex(5);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  // 06 Self-Drawing Sparkline Animation Mounted State
  const [sparklineDrawn, setSparklineDrawn] = React.useState(false);
  React.useEffect(() => {
    if (prefersReducedMotion) {
      setSparklineDrawn(true);
      return;
    }
    const t = setTimeout(() => setSparklineDrawn(true), 250);
    return () => clearTimeout(t);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={cn(
        'group/bento relative w-full transition-colors duration-150 select-none',
        className,
      )}
    >
      {/* 01 Named Grid Areas: 4 columns desktop, 2 columns tablet, 1 column mobile */}
      <div
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
        style={{
          gridTemplateAreas: undefined, // Controlled via responsive tailwind classes below
        }}
      >
        {/* ======================================================== */}
        {/* TILE 1: Admin Audit Ledger (Desktop: col-span-2)          */}
        {/* ======================================================== */}
        <div
          data-spotlight-card
          className={cn(
            'spotlight-card relative col-span-1 overflow-hidden rounded-2xl border p-5 md:col-span-2',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
          style={{
            ['--mouse-x' as string]: '-999px',
            ['--mouse-y' as string]: '-999px',
          }}
        >
          {/* 02 Border Spotlight & 03 Inner Wash Gradients */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.4), transparent 70%)'
                : 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.35), transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.05), transparent 75%)'
                : 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.04), transparent 75%)',
            }}
          />

          {/* Tile Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-[#38BDF8]'
                    : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]',
                )}
              >
                <ShieldCheck className="size-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                  Admin Audit & Security Vault
                </h4>
                <span className="font-mono text-[10px] text-slate-400">
                  Cryptographic Non-Repudiation Proofs
                </span>
              </div>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              100% IMMUTABLE
            </span>
          </div>

          {/* Concrete Visual: Inline SVG Ledger Proof Block (No images) */}
          <div className="relative z-10 mt-4 rounded-xl border border-slate-200/80 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-[#00081C]">
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-200/60 pb-1.5 dark:border-slate-800">
                <span className="text-slate-400">OPERATION:</span>
                <span className="font-bold text-[#0056FF] dark:text-[#38BDF8]">
                  ACID_TX_COMMIT_VERIFIED
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">CALLER_UUID:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  &lt;SYS_ROOT_SERVICE_ACCOUNT&gt;
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">LEDGER_HASH:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  sha256:7f8a92...e4b102 [PASSED]
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">TENANT_SCOPE:</span>
                <span className="text-slate-700 dark:text-slate-300">
                  schoolId=&quot;SNPI-MAIN&quot; branchId=&quot;HQ-01&quot;
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 2: System Health Probe (Desktop: col-span-1)         */}
        {/* ======================================================== */}
        <div
          data-spotlight-card
          className={cn(
            'spotlight-card relative col-span-1 overflow-hidden rounded-2xl border p-5',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
          style={{
            ['--mouse-x' as string]: '-999px',
            ['--mouse-y' as string]: '-999px',
          }}
        >
          {/* Spotlight Overlays */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.4), transparent 70%)'
                : 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.35), transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.05), transparent 75%)'
                : 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.04), transparent 75%)',
            }}
          />

          {/* Content */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-emerald-400'
                    : 'border-emerald-200 bg-emerald-50 text-emerald-600',
                )}
              >
                <Cpu className="size-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                  Cluster Vitality
                </h4>
                <span className="font-mono text-[10px] text-slate-400">Node Replica Set rs0</span>
              </div>
            </div>
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              HEALTHY
            </span>
          </div>

          {/* SVG Cluster Metric Visual */}
          <div className="relative z-10 mt-3 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-[#00081C]">
              <span className="font-mono text-[10px] text-slate-400">MEMORY_RSS</span>
              <div className="mt-0.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
                142.6 MB
              </div>
            </div>
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 dark:border-slate-800 dark:bg-[#00081C]">
              <span className="font-mono text-[10px] text-slate-400">EVENT_LOOP</span>
              <div className="mt-0.5 font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                0.62 ms
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 3: 07 Git Branch Topology (Desktop: 2 rows tall!)   */}
        {/* ======================================================== */}
        <div
          data-spotlight-card
          className={cn(
            'spotlight-card relative col-span-1 overflow-hidden rounded-2xl border p-5 md:col-span-2 xl:col-span-1 xl:row-span-2',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
          style={{
            ['--mouse-x' as string]: '-999px',
            ['--mouse-y' as string]: '-999px',
          }}
        >
          {/* Spotlight Overlays */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.4), transparent 70%)'
                : 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.35), transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.05), transparent 75%)'
                : 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.04), transparent 75%)',
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-[#38BDF8]'
                    : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]',
                )}
              >
                <GitBranch className="size-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                  Release Topology
                </h4>
                <span className="font-mono text-[10px] text-slate-400">Active Checkpoint Flow</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold text-[#0056FF] dark:text-[#38BDF8]">
              v0.2.7
            </span>
          </div>

          {/* 07 Hand-Placed SVG Git Branch Diagram with Pulsing Live Node */}
          <div className="relative z-10 mt-4 flex flex-col items-center justify-center py-2">
            <svg
              className="h-44 w-full"
              viewBox="0 0 200 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Main Trunk Line */}
              <line
                x1="60"
                y1="10"
                x2="60"
                y2="150"
                stroke={isDark ? '#334155' : '#CBD5E1'}
                strokeWidth="2.5"
                strokeDasharray="4 4"
              />

              {/* Release Branch Curve */}
              <path
                d="M 60 40 C 60 70, 140 60, 140 90 L 140 150"
                stroke={isDark ? '#38BDF8' : '#0056FF'}
                strokeWidth="2.5"
              />

              {/* Base Trunk Commit Nodes (Still) */}
              <circle cx="60" cy="30" r="4.5" fill={isDark ? '#64748B' : '#94A3B8'} />
              <circle cx="60" cy="80" r="4.5" fill={isDark ? '#64748B' : '#94A3B8'} />
              <circle cx="60" cy="130" r="4.5" fill={isDark ? '#64748B' : '#94A3B8'} />

              {/* Live Active Checkpoint Node (Pulsing Glow Beacon) */}
              <g className="origin-center">
                <circle
                  cx="140"
                  cy="90"
                  r="12"
                  fill={isDark ? 'rgba(56, 189, 248, 0.25)' : 'rgba(0, 86, 255, 0.2)'}
                  className="animate-ping"
                />
                <circle
                  cx="140"
                  cy="90"
                  r="6.5"
                  fill={isDark ? '#38BDF8' : '#0056FF'}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </g>

              {/* Node Commit Annotations */}
              <text x="75" y="34" className="fill-slate-400 font-mono text-[9px] font-semibold">
                main: 847e12b
              </text>
              <text x="75" y="84" className="fill-slate-400 font-mono text-[9px] font-semibold">
                merge: 3ff6db3
              </text>
              <text
                x="152"
                y="94"
                className={cn(
                  'font-mono text-[10px] font-bold',
                  isDark ? 'fill-[#38BDF8]' : 'fill-[#0056FF]',
                )}
              >
                v0.2.7 [LIVE]
              </text>
              <text x="75" y="134" className="fill-slate-400 font-mono text-[9px] font-semibold">
                HEAD @ 58dacb7
              </text>
            </svg>
          </div>

          <div className="relative z-10 mt-2 rounded-xl border border-slate-200/80 bg-slate-50/70 p-2.5 font-mono text-[10px] text-slate-500 dark:border-slate-800 dark:bg-[#00081C] dark:text-slate-400">
            <span>BRANCH:</span>{' '}
            <strong className="text-slate-800 dark:text-slate-200">main</strong> &middot; 18 commits
            verified
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 4: 05 Deploy Log (6-Second Cascading Loop)           */}
        {/* ======================================================== */}
        <div
          data-spotlight-card
          className={cn(
            'spotlight-card relative col-span-1 overflow-hidden rounded-2xl border p-5',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
          style={{
            ['--mouse-x' as string]: '-999px',
            ['--mouse-y' as string]: '-999px',
          }}
        >
          {/* Spotlight Overlays */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.4), transparent 70%)'
                : 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.35), transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.05), transparent 75%)'
                : 'radial-gradient(300px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.04), transparent 75%)',
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-amber-400'
                    : 'border-amber-200 bg-amber-50 text-amber-600',
                )}
              >
                <Terminal className="size-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                  Live Deploy Stream
                </h4>
                <span className="font-mono text-[10px] text-slate-400">6s Cascading Preview</span>
              </div>
            </div>
            <span className="font-mono text-[10px] font-bold text-slate-500 tabular-nums">
              {Math.round((logProgress / 100) * 6)}s
            </span>
          </div>

          {/* 5 Cascading Log Lines */}
          <div className="relative z-10 mt-3 space-y-1.5 font-mono text-[10px]">
            <div
              className={cn(
                'transition-opacity duration-200',
                activeLogIndex >= 1
                  ? 'text-slate-700 opacity-100 dark:text-slate-300'
                  : 'opacity-0',
              )}
            >
              <span className="text-[#0056FF] dark:text-[#38BDF8]">&gt; [0.0s]</span> Initiating
              deploy v0.2.7
            </div>
            <div
              className={cn(
                'transition-opacity duration-200',
                activeLogIndex >= 2
                  ? 'text-slate-700 opacity-100 dark:text-slate-300'
                  : 'opacity-0',
              )}
            >
              <span className="text-[#0056FF] dark:text-[#38BDF8]">&gt; [1.2s]</span> rs0 majority
              write locked
            </div>
            <div
              className={cn(
                'transition-opacity duration-200',
                activeLogIndex >= 3
                  ? 'text-slate-700 opacity-100 dark:text-slate-300'
                  : 'opacity-0',
              )}
            >
              <span className="text-[#0056FF] dark:text-[#38BDF8]">&gt; [2.5s]</span> 47 domain
              modules HTTP 200
            </div>
            <div
              className={cn(
                'transition-opacity duration-200',
                activeLogIndex >= 4
                  ? 'text-slate-700 opacity-100 dark:text-slate-300'
                  : 'opacity-0',
              )}
            >
              <span className="text-[#0056FF] dark:text-[#38BDF8]">&gt; [4.1s]</span> Edge CDN
              warmed at 12ms
            </div>
            <div
              className={cn(
                'font-bold transition-opacity duration-200',
                activeLogIndex >= 5
                  ? 'text-emerald-600 opacity-100 dark:text-emerald-400'
                  : 'opacity-0',
              )}
            >
              <span className="text-emerald-500">&gt; [5.8s]</span> [PASSED] Deployed at 99.98%
            </div>
          </div>

          {/* Cascading Progress Bar */}
          <div className="relative z-10 mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-[#0056FF] transition-all duration-75 dark:bg-[#38BDF8]"
              style={{ width: `${logProgress}%` }}
            />
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 5: 06 Self-Drawing Sparkline (Desktop: col-span-2)   */}
        {/* ======================================================== */}
        <div
          data-spotlight-card
          className={cn(
            'spotlight-card relative col-span-1 overflow-hidden rounded-2xl border p-5 md:col-span-2',
            isDark
              ? 'border-slate-800 bg-[#000B26] text-slate-100'
              : 'border-slate-200/90 bg-white text-slate-900',
          )}
          style={{
            ['--mouse-x' as string]: '-999px',
            ['--mouse-y' as string]: '-999px',
          }}
        >
          {/* Spotlight Overlays */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.4), transparent 70%)'
                : 'radial-gradient(400px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.35), transparent 70%)',
              mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              maskComposite: 'exclude',
              WebkitMaskComposite: 'xor',
              padding: '1px',
            }}
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover/bento:opacity-100"
            style={{
              background: isDark
                ? 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(56, 189, 248, 0.05), transparent 75%)'
                : 'radial-gradient(350px circle at var(--mouse-x) var(--mouse-y), rgba(0, 86, 255, 0.04), transparent 75%)',
            }}
          />

          {/* Header */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'flex size-8 items-center justify-center rounded-lg border',
                  isDark
                    ? 'border-slate-700 bg-slate-900 text-[#38BDF8]'
                    : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]',
                )}
              >
                <Activity className="size-4" />
              </div>
              <div>
                <h4 className="font-sans text-xs font-bold tracking-tight text-slate-950 dark:text-white">
                  Real-Time SLA & Latency Telemetry
                </h4>
                <span className="font-mono text-[10px] text-slate-400">
                  Self-Drawing Sparkline (pathLength=&quot;1&quot;)
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                99.98% Uptime
              </span>
              <span className="text-slate-300 dark:text-slate-700">&middot;</span>
              <span className="text-slate-500 dark:text-slate-400">12ms avg</span>
            </div>
          </div>

          {/* 06 Self-Drawing SVG Sparkline */}
          <div className="relative z-10 mt-3 h-20 w-full overflow-hidden">
            <svg
              className="h-full w-full"
              viewBox="0 0 400 80"
              fill="none"
              preserveAspectRatio="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Gradient Definition for Area Fill */}
              <defs>
                <linearGradient id="sparklineAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={isDark ? '#38BDF8' : '#0056FF'} stopOpacity="0.25" />
                  <stop
                    offset="100%"
                    stopColor={isDark ? '#38BDF8' : '#0056FF'}
                    stopOpacity="0.0"
                  />
                </linearGradient>
              </defs>

              {/* Faded Area Fill below Sparkline Curve */}
              <path
                d="M 0 50 Q 50 45, 100 55 T 200 40 T 300 30 T 390 18 L 390 80 L 0 80 Z"
                fill="url(#sparklineAreaGrad)"
                className={cn(
                  'transition-opacity duration-700',
                  sparklineDrawn ? 'opacity-100' : 'opacity-0',
                )}
              />

              {/* 06 Self-Drawing Path with pathLength="1" */}
              <path
                d="M 0 50 Q 50 45, 100 55 T 200 40 T 300 30 T 390 18"
                fill="none"
                stroke={isDark ? '#38BDF8' : '#0056FF'}
                strokeWidth="2.5"
                strokeLinecap="round"
                pathLength={1}
                strokeDasharray={1}
                style={{
                  strokeDashoffset: sparklineDrawn ? 0 : 1,
                  transition: 'stroke-dashoffset 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              />

              {/* Terminal Pulsing Dot at Endpoint */}
              <circle
                cx="390"
                cy="18"
                r="4.5"
                fill={isDark ? '#38BDF8' : '#0056FF'}
                stroke="#FFFFFF"
                strokeWidth="1.5"
                className={cn(
                  'transition-opacity duration-500',
                  sparklineDrawn ? 'opacity-100' : 'opacity-0',
                )}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

// Interactive Demo wrapper export
export function SpotlightBentoGridDemo() {
  return (
    <div className="w-full space-y-4">
      <SpotlightBentoGrid />
    </div>
  );
}
