'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Layers,
  Sparkles,
  RotateCcw,
  User,
  ShieldCheck,
  Calendar,
  Clock,
  ArrowRight,
  Eye,
  RefreshCw,
  Folder,
  FileText,
} from '@/components/icons';

// ============================================================================
// 05 CSS CUSTOM PROPERTIES & 06 PSEUDO-ELEMENT SHIMMER STYLES
// ============================================================================

const SKELETON_STYLES = `
@keyframes skeleton-shimmer-sweep {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.skeleton-shimmer {
  position: relative;
  overflow: hidden;
  background-color: var(--skeleton-base, #e2e8f0);
}

.skeleton-shimmer::after {
  content: '';
  position: absolute;
  inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--skeleton-highlight, rgba(255, 255, 255, 0.65)) 50%,
    transparent 100%
  );
  animation: skeleton-shimmer-sweep var(--skeleton-speed, 1.8s) infinite ease-in-out;
  pointer-events: none;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer::after {
    animation: none !important;
    display: none !important;
  }
}
`;

// ============================================================================
// 02 PLACEHOLDER SHAPES & 03 ASPECT RATIOS (Skeleton Primitive)
// ============================================================================

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'rect' | 'circle' | 'text';
  width?: string | number;
  height?: string | number;
  theme?: 'light' | 'dark';
}

export function Skeleton({
  variant = 'rect',
  width,
  height,
  className,
  style,
  theme = 'light',
  ...props
}: SkeletonProps) {
  const isDark = theme === 'dark';

  const variantClass =
    variant === 'circle'
      ? 'rounded-full aspect-square shrink-0'
      : variant === 'text'
        ? 'rounded-md h-3.5 my-1'
        : 'rounded-xl';

  const themeVars = isDark
    ? ({
        '--skeleton-base': '#0F172A',
        '--skeleton-highlight': 'rgba(255, 255, 255, 0.09)',
        '--skeleton-speed': '1.8s',
      } as React.CSSProperties)
    : ({
        '--skeleton-base': '#E2E8F0',
        '--skeleton-highlight': 'rgba(255, 255, 255, 0.75)',
        '--skeleton-speed': '1.8s',
      } as React.CSSProperties);

  return (
    <div
      aria-hidden="true"
      className={cn('skeleton-shimmer block', variantClass, className)}
      style={{
        width,
        height,
        ...themeVars,
        ...style,
      }}
      {...props}
    />
  );
}

// ============================================================================
// PATTERN 1: PROFILE HEADER (Loading Skeleton vs Loaded Content)
// ============================================================================

function ProfileHeaderPattern({ isLoaded, theme }: { isLoaded: boolean; theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';

  if (!isLoaded) {
    return (
      <div
        className={cn(
          'space-y-5 rounded-2xl border p-6 transition-colors',
          isDark ? 'border-slate-800 bg-[#00081C]' : 'border-slate-200 bg-white shadow-xs',
        )}
      >
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          {/* Avatar circle (02 Shape) */}
          <Skeleton variant="circle" className="size-16" theme={theme} />

          <div className="w-full flex-1 space-y-2.5">
            {/* Name bar */}
            <Skeleton className="h-5 w-48 rounded-lg" theme={theme} />
            {/* Title & Badge */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-32 rounded-md" theme={theme} />
              <Skeleton className="h-3.5 w-16 rounded-full" theme={theme} />
            </div>
            {/* Bio lines */}
            <Skeleton className="h-3 w-full max-w-md rounded-md" theme={theme} />
            <Skeleton className="h-3 w-3/4 max-w-sm rounded-md" theme={theme} />
          </div>

          {/* Action buttons */}
          <div className="flex w-full shrink-0 gap-2 pt-2 sm:w-auto sm:flex-col sm:pt-0">
            <Skeleton className="h-8 w-24 rounded-xl" theme={theme} />
            <Skeleton className="h-8 w-24 rounded-xl" theme={theme} />
          </div>
        </div>
      </div>
    );
  }

  // Loaded state
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 transition-colors',
        isDark ? 'border-slate-800 bg-[#00081C]' : 'border-slate-200 bg-white shadow-xs',
      )}
    >
      <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
        <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-400">
          <User className="size-8" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="font-sans text-base font-bold text-slate-900 dark:text-white">
              Dr. Sokha Chann
            </h4>
            <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="size-3" />
              <span>SUPERADMIN VERIFIED</span>
            </span>
          </div>

          <p className="font-mono text-xs text-[#0056FF] dark:text-[#38BDF8]">
            Principal Campus Architect &middot; SNPI Institutional Systems
          </p>
          <p className="max-w-md font-sans text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            Directs the 47 modular monolith domain engines, managing student lifecycles, ledger
            hashes, and accreditation pipelines.
          </p>
        </div>

        <div className="flex w-full shrink-0 gap-2 pt-2 sm:w-auto sm:flex-col sm:pt-0">
          <button
            type="button"
            className="rounded-xl bg-[#0056FF] px-3.5 py-1.5 font-mono text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
          >
            Edit Profile
          </button>
          <button
            type="button"
            className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
          >
            Passbook
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// PATTERN 2: CARD GRID (Loading Skeleton vs Loaded Content)
// ============================================================================

function CardGridPattern({ isLoaded, theme }: { isLoaded: boolean; theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';

  const cardsData = [
    {
      code: 'CS-401',
      title: 'Computer Systems Architecture',
      desc: 'RISC-V microarchitectures, instruction pipelines, and memory hierarchies.',
      author: 'Prof. Virak',
      students: '48 Enrolled',
    },
    {
      code: 'DB-502',
      title: 'Database Internals & Sharding',
      desc: 'MongoDB replica sets, write concerns, WAL journaling, and B-tree indexing.',
      author: 'Eng. Chantrea',
      students: '36 Enrolled',
    },
    {
      code: 'SEC-603',
      title: 'Applied Network Cryptography',
      desc: 'Constant-time HMAC operations, PKI x509 cert chains, and timing side-channel defenses.',
      author: 'Dr. Chann',
      students: '29 Enrolled',
    },
  ];

  if (!isLoaded) {
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {[1, 2, 3].map((key) => (
          <div
            key={key}
            className={cn(
              'space-y-3.5 rounded-2xl border p-4 transition-colors',
              isDark ? 'border-slate-800 bg-[#00081C]' : 'border-slate-200 bg-white shadow-xs',
            )}
          >
            {/* 03 Aspect Ratio: 16/9 media thumbnail */}
            <Skeleton className="aspect-video w-full rounded-xl" theme={theme} />

            {/* Pill & Title */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-16 rounded-full" theme={theme} />
              <Skeleton className="h-4.5 w-3/4 rounded-lg" theme={theme} />
            </div>

            {/* Body copy lines */}
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3 w-full rounded-md" theme={theme} />
              <Skeleton className="h-3 w-5/6 rounded-md" theme={theme} />
            </div>

            {/* Footer row: avatar + text */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-800/80">
              <div className="flex items-center gap-2">
                <Skeleton variant="circle" className="size-6" theme={theme} />
                <Skeleton className="h-3 w-20 rounded-md" theme={theme} />
              </div>
              <Skeleton className="h-3 w-16 rounded-md" theme={theme} />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Loaded state
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      {cardsData.map((c) => (
        <div
          key={c.code}
          className={cn(
            'flex flex-col justify-between rounded-2xl border p-4 transition-colors hover:border-[#0056FF]/40',
            isDark ? 'border-slate-800 bg-[#00081C]' : 'border-slate-200 bg-white shadow-xs',
          )}
        >
          <div className="space-y-3">
            {/* Aspect Video Media Banner */}
            <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-slate-200/80 bg-slate-100 text-slate-400 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-500">
              <Folder className="size-8" />
              <span className="mt-1 font-mono text-[10px] font-bold tracking-wider">
                SYLLABUS MODULE
              </span>
            </div>

            <div className="space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] dark:text-[#38BDF8]">
                {c.code}
              </span>
              <h4 className="font-sans text-xs font-bold text-slate-900 dark:text-white">
                {c.title}
              </h4>
              <p className="font-sans text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                {c.desc}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-[11px] dark:border-slate-800/80">
            <span className="font-bold text-slate-600 dark:text-slate-300">{c.author}</span>
            <span className="font-bold text-[#0056FF] dark:text-cyan-400">{c.students}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// PATTERN 3: CONTENT LIST (Loading Skeleton vs Loaded Content)
// ============================================================================

function ContentListPattern({ isLoaded, theme }: { isLoaded: boolean; theme: 'light' | 'dark' }) {
  const isDark = theme === 'dark';

  const listItems = [
    {
      title: 'ACID Ledger Commitment TX-9204 Finalized',
      tag: 'FINANCIAL LEDGER',
      time: '2 minutes ago',
      status: 'VERIFIED',
    },
    {
      title: 'Branch Authority Key Rotation Executed',
      tag: 'SECURITY AUDIT',
      time: '14 minutes ago',
      status: 'ROTATED',
    },
    {
      title: 'Term 2 Final Exam Schedule Published',
      tag: 'ACADEMICS',
      time: '1 hour ago',
      status: 'ACTIVE',
    },
    {
      title: 'Cryptographic Student Passbook Batch Minted',
      tag: 'ADMISSIONS',
      time: '3 hours ago',
      status: 'COMPLETED',
    },
  ];

  if (!isLoaded) {
    return (
      <div
        className={cn(
          'divide-y rounded-2xl border transition-colors',
          isDark
            ? 'divide-slate-800 border-slate-800 bg-[#00081C]'
            : 'divide-slate-100 border-slate-200 bg-white shadow-xs',
        )}
      >
        {[1, 2, 3, 4].map((key) => (
          <div key={key} className="flex items-center gap-4 p-4">
            {/* Square Icon Thumbnail */}
            <Skeleton className="size-10 shrink-0 rounded-xl" theme={theme} />

            {/* Typography lines */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/5 rounded-md" theme={theme} />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-20 rounded-md" theme={theme} />
                <Skeleton className="h-3 w-16 rounded-md" theme={theme} />
              </div>
            </div>

            {/* Status Pill */}
            <Skeleton className="h-6 w-20 shrink-0 rounded-full" theme={theme} />
          </div>
        ))}
      </div>
    );
  }

  // Loaded state
  return (
    <div
      className={cn(
        'divide-y rounded-2xl border transition-colors',
        isDark
          ? 'divide-slate-800 border-slate-800 bg-[#00081C]'
          : 'divide-slate-100 border-slate-200 bg-white shadow-xs',
      )}
    >
      {listItems.map((item, idx) => (
        <div key={idx} className="flex items-center justify-between gap-4 p-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              <FileText className="size-5" />
            </div>

            <div className="min-w-0 space-y-0.5">
              <h5 className="truncate font-sans text-xs font-bold text-slate-900 dark:text-white">
                {item.title}
              </h5>
              <div className="flex items-center gap-2 font-mono text-[10px] text-slate-400">
                <span className="font-bold text-[#0056FF] dark:text-[#38BDF8]">{item.tag}</span>
                <span>&middot;</span>
                <span className="flex items-center gap-1">
                  <Clock className="size-2.5" />
                  <span>{item.time}</span>
                </span>
              </div>
            </div>
          </div>

          <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// INTERACTIVE DOCUMENTATION DEMO: SkeletonLoadingScreenDemo
// ============================================================================

export function SkeletonLoadingScreenDemo() {
  const [isLoaded, setIsLoaded] = React.useState<boolean>(false);
  const [activeTab, setActiveTab] = React.useState<'all' | 'profile' | 'grid' | 'list'>('all');

  return (
    <div className="w-full space-y-6">
      {/* Inject self-contained pure CSS keyframes & shimmer styles */}
      <style dangerouslySetInnerHTML={{ __html: SKELETON_STYLES }} />

      {/* Control Bar: Active State Toggle, Pattern Switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Pattern filter tabs */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
              Pattern:
            </span>
            {(['all', 'profile', 'grid', 'list'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'rounded-full px-2.5 py-0.5 font-mono text-[11px] font-bold capitalize transition-colors',
                  activeTab === tab
                    ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF] dark:border-cyan-500/40 dark:bg-cyan-500/15 dark:text-cyan-400'
                    : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400',
                )}
              >
                {tab === 'all' ? 'All Patterns' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Primary Interactive Toggle: Loading vs Loaded */}
        <button
          type="button"
          onClick={() => setIsLoaded(!isLoaded)}
          className={cn(
            'flex items-center gap-2 rounded-xl px-4 py-2 font-mono text-xs font-bold shadow-xs transition-all active:scale-[0.98]',
            isLoaded
              ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
              : 'bg-[#0056FF] text-white hover:bg-blue-700',
          )}
        >
          <RefreshCw className={cn('size-3.5', !isLoaded && 'animate-spin')} />
          <span>{isLoaded ? 'STATE: LOADED CONTENT' : 'STATE: SKELETON LOADING'}</span>
        </button>
      </div>

      {/* Feature Description Card */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-slate-900/40">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900 dark:text-white">
            <Sparkles className="size-3.5 text-[#0056FF] dark:text-[#38BDF8]" />
            <span>CSS-Only Shimmer (Zero JavaScript Render Overhead)</span>
          </div>
          <p className="font-sans text-xs text-slate-500">
            Shimmer gradient sweeps left to right via pure CSS <code>::after</code> pseudo-elements,
            disabling automatically under <code>prefers-reduced-motion</code>.
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 dark:border-slate-800 dark:bg-slate-900">
            1.8s Ease Loop
          </span>
          <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 dark:border-slate-800 dark:bg-slate-900">
            CLS = 0 Sizing
          </span>
        </div>
      </div>

      {/* Pattern 1: Profile Header */}
      {(activeTab === 'all' || activeTab === 'profile') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Pattern 01 &middot; Profile Header
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              Avatar Circle + Typography Lines + Action Badges
            </span>
          </div>
          <ProfileHeaderPattern isLoaded={isLoaded} theme="light" />
        </div>
      )}

      {/* Pattern 2: Card Grid */}
      {(activeTab === 'all' || activeTab === 'grid') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Pattern 02 &middot; Responsive Card Grid
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              16:9 Media Aspect Ratio + Title + Author Row
            </span>
          </div>
          <CardGridPattern isLoaded={isLoaded} theme="light" />
        </div>
      )}

      {/* Pattern 3: Content List */}
      {(activeTab === 'all' || activeTab === 'list') && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
              Pattern 03 &middot; Content Audit List
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              40x40 Thumbnail Icon + Two-Line Text + Status Badge
            </span>
          </div>
          <ContentListPattern isLoaded={isLoaded} theme="light" />
        </div>
      )}
    </div>
  );
}
