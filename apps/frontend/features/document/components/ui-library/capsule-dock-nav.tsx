'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Layers,
  Sparkles,
  ExternalLink,
  BookOpen,
  Code,
  Compass,
  ArrowRight,
} from '@/components/icons';
import { useDocsNav } from './docs-nav-context';

export interface CapsuleDockNavProps {
  className?: string;
  repoUrl?: string;
  starsCount?: number;
}

/**
 * CapsuleDockNav (Floating 3-Island Header Navigation)
 *
 * Implements the floating capsule dock design:
 * - Island 1 (Left): Coral flower mark + Brand name ("SNP UI" / "SNPI-SMS")
 * - Island 2 (Center): Segmented links [ Home | Components ⌄ | API Specs | Changelog ]
 * - Island 3 (Right): GitHub icon + Stars counter pill
 * - Center Floating Circle (Underneath): Dark/Light contrast toggle [ ◐ ]
 */
export function CapsuleDockNav({
  className,
  repoUrl = 'https://github.com/shiliaiwei/SNP-SMS',
  starsCount = 1866,
}: CapsuleDockNavProps) {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useDocsNav();

  const [componentsMenuOpen, setComponentsMenuOpen] = React.useState(false);
  const [isDarkTheme, setIsDarkTheme] = React.useState(false);
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const isLibrary = pathname?.startsWith('/document/design-system');
  const isChangelog = pathname?.startsWith('/document/changelog');
  const isOpenApi = pathname === '/document' || pathname?.startsWith('/document/api');

  // Toggle theme callback
  const handleToggleTheme = () => {
    setIsDarkTheme((prev) => !prev);
    const root = document.documentElement;
    if (root.classList.contains('dark')) {
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
    }
  };

  const handleMouseEnterMenu = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    setComponentsMenuOpen(true);
  };

  const handleMouseLeaveMenu = () => {
    closeTimerRef.current = setTimeout(() => {
      setComponentsMenuOpen(false);
    }, 220);
  };

  return (
    <header
      data-slot="capsule-dock-nav"
      className={cn(
        'pointer-events-none sticky top-0 z-50 flex w-full flex-col items-center justify-center pt-3 pb-2 select-none',
        className,
      )}
    >
      {/* 3-Island Floating Dock Row */}
      <div className="pointer-events-auto mx-auto flex max-w-[1560px] flex-wrap items-center justify-center gap-2.5 px-4 sm:gap-4">
        {/* ======================================================== */}
        {/* ISLAND 1: Brand Capsule Pill [ 🌸 SNP UI ] */}
        {/* ======================================================== */}
        <Link
          href="/document"
          className="group flex h-11 items-center gap-2.5 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 px-4 py-2 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-slate-700 active:scale-95"
          title="SNP-SMS Developer Documentation Portal"
        >
          {/* Coral Flower / Brand Spark Mark */}
          <span className="flex size-5 items-center justify-center text-[#FF5500]">
            <svg className="size-4.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 2a3 3 0 0 0-3 3c0 .54.14 1.05.39 1.49C8.07 6.18 6.7 6.64 5.76 7.76A3 3 0 0 0 5 12a3 3 0 0 0 2.24 2.89c-.66.86-.96 1.95-.76 3.03.35 1.83 1.96 3.1 3.82 2.98 1.03-.07 1.96-.58 2.55-1.37.59.79 1.52 1.3 2.55 1.37 1.86.12 3.47-1.15 3.82-2.98.2-1.08-.1-2.17-.76-3.03A3 3 0 0 0 21 12a3 3 0 0 0-.76-4.24c-.94-1.12-2.31-1.58-3.63-1.27.25-.44.39-.95.39-1.49a3 3 0 0 0-5-2z" />
            </svg>
          </span>
          <div className="flex items-center gap-1.5 font-sans">
            <span className="text-sm font-black tracking-tight text-white group-hover:text-slate-100">
              SNP UI
            </span>
            <span className="py-0.2 hidden rounded-full border border-slate-700/80 bg-slate-800/80 px-1.5 font-mono text-[9px] font-bold text-slate-300 sm:inline-block">
              v0.2.8
            </span>
          </div>
        </Link>

        {/* ======================================================== */}
        {/* ISLAND 2: Center Links Dock [ Home | Components ⌄ | API | Changelog ] */}
        {/* ======================================================== */}
        <div
          className="relative flex h-11 items-center gap-1 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 px-3.5 text-white shadow-2xl backdrop-blur-xl"
          onMouseLeave={handleMouseLeaveMenu}
        >
          {/* Link: Home (Overview) */}
          <Link
            href="/document"
            onClick={() => setActiveTab('openapi', false)}
            className={cn(
              'rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition-colors',
              isOpenApi && !isLibrary && !isChangelog
                ? 'font-bold text-white'
                : 'text-slate-400 hover:text-white',
            )}
          >
            Home
          </Link>

          <span className="font-mono text-xs text-slate-800 select-none">|</span>

          {/* Trigger: Components ⌄ (with Interactive Dropdown Mega-Menu) */}
          <div className="relative" onMouseEnter={handleMouseEnterMenu}>
            <button
              type="button"
              onClick={() => setComponentsMenuOpen((prev) => !prev)}
              className={cn(
                'group flex cursor-pointer items-center gap-1 rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition-all',
                isLibrary || componentsMenuOpen
                  ? 'bg-white/10 font-bold text-white shadow-inner'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white',
              )}
              aria-expanded={componentsMenuOpen}
            >
              <span>Components</span>
              <ChevronDown
                className={cn(
                  'size-3 stroke-[2] transition-transform duration-200',
                  componentsMenuOpen && 'rotate-180',
                )}
              />
            </button>

            {/* Dropdown Mega-Menu Panel */}
            {componentsMenuOpen && (
              <div
                className="animate-in fade-in zoom-in-95 absolute top-full left-1/2 z-50 mt-3 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-800 bg-[#0A0D14]/98 p-4 text-white shadow-2xl backdrop-blur-2xl transition-all duration-200 sm:w-[500px]"
                onMouseEnter={handleMouseEnterMenu}
                onMouseLeave={handleMouseLeaveMenu}
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Featured Component Card */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-gradient-to-br from-[#111622] to-[#0A0D14] p-4 sm:col-span-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 animate-pulse rounded-full bg-[#0056FF]" />
                        <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                          New Standard
                        </span>
                      </div>
                      <h4 className="mt-2 font-sans text-xs font-extrabold text-white">
                        Rail TOC · Flight Nav
                      </h4>
                      <p className="mt-1 font-sans text-[11px] leading-relaxed text-slate-400">
                        Paper plane flies along the indented rail, turns at bends, and reverses on
                        scroll-up.
                      </p>
                    </div>

                    <Link
                      href="/document/design-system#comp-rail-toc"
                      onClick={() => {
                        setComponentsMenuOpen(false);
                        setActiveTab('library', false);
                      }}
                      className="group/cta mt-3 inline-flex items-center gap-1.5 font-mono text-[11px] font-bold text-[#38BDF8] hover:text-white"
                    >
                      <span>Explore Rail TOC</span>
                      <ArrowRight className="size-3 transition-transform group-hover/cta:translate-x-1" />
                    </Link>
                  </div>

                  {/* Component Quick Links */}
                  <div className="flex flex-col justify-between gap-1.5 sm:col-span-7">
                    <Link
                      href="/document/design-system#comp-snackbar"
                      onClick={() => {
                        setComponentsMenuOpen(false);
                        setActiveTab('library', false);
                      }}
                      className="group/item flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                    >
                      <div>
                        <div className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                          Native Snackbar & Stack
                        </div>
                        <div className="font-sans text-[10px] text-slate-400">
                          Bottom-anchored feedback with countdown.
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-[#0056FF]">Feedback</span>
                    </Link>

                    <Link
                      href="/document/design-system#comp-modal-dialog"
                      onClick={() => {
                        setComponentsMenuOpen(false);
                        setActiveTab('library', false);
                      }}
                      className="group/item flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                    >
                      <div>
                        <div className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                          Modal & Dialog
                        </div>
                        <div className="font-sans text-[10px] text-slate-400">
                          Focus trap, scroll lock, Esc dismiss.
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-amber-400">Overlays</span>
                    </Link>

                    <Link
                      href="/document/design-system#comp-real-time-chart"
                      onClick={() => {
                        setComponentsMenuOpen(false);
                        setActiveTab('library', false);
                      }}
                      className="group/item flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-white/5"
                    >
                      <div>
                        <div className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                          Real-Time Data Chart
                        </div>
                        <div className="font-sans text-[10px] text-slate-400">
                          60fps Canvas API metrics stream.
                        </div>
                      </div>
                      <span className="font-mono text-[9px] text-emerald-400">Data</span>
                    </Link>

                    <div className="border-t border-slate-800/80 pt-2">
                      <Link
                        href="/document/design-system"
                        onClick={() => {
                          setComponentsMenuOpen(false);
                          setActiveTab('library', false);
                        }}
                        className="flex items-center justify-between rounded-lg px-2 py-1 font-mono text-[11px] font-bold text-[#0056FF] hover:text-white"
                      >
                        <span>View All 65 Components</span>
                        <ArrowRight className="size-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <span className="font-mono text-xs text-slate-800 select-none">|</span>

          {/* Link: Open API Reference */}
          <Link
            href="/document"
            onClick={() => setActiveTab('openapi', false)}
            className={cn(
              'rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition-colors',
              isOpenApi && !isLibrary ? 'font-bold text-white' : 'text-slate-400 hover:text-white',
            )}
          >
            Open API
          </Link>

          <span className="font-mono text-xs text-slate-800 select-none">|</span>

          {/* Link: Changelog */}
          <Link
            href="/document/changelog"
            className={cn(
              'rounded-full px-2.5 py-1 font-sans text-xs font-semibold transition-colors',
              isChangelog ? 'font-bold text-white' : 'text-slate-400 hover:text-white',
            )}
          >
            Changelog
          </Link>
        </div>

        {/* ======================================================== */}
        {/* ISLAND 3: GitHub Star Pill [ 🐙 1866 ] */}
        {/* ======================================================== */}
        <a
          href={repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex h-11 items-center gap-2 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 px-4 py-2 text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-[1.02] hover:border-slate-700 active:scale-95"
          title="SNP-SMS Monorepo GitHub Repository"
        >
          {/* GitHub Mark SVG */}
          <svg
            className="size-4 fill-white transition-transform group-hover:scale-110"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
            />
          </svg>
          <span className="font-mono text-xs font-bold text-slate-100">
            {starsCount.toLocaleString()}
          </span>
        </a>
      </div>

      {/* ======================================================== */}
      {/* FLOATING CIRCLE: Dark / Light Contrast Toggle [ ◐ ] */}
      {/* ======================================================== */}
      <div className="pointer-events-auto mt-2 flex items-center justify-center">
        <button
          type="button"
          onClick={handleToggleTheme}
          title="Toggle Dark / Light Contrast Mode"
          className="flex size-7.5 cursor-pointer items-center justify-center rounded-full border border-slate-800 bg-[#0A0D14]/90 text-white shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:border-slate-700 active:scale-95"
          aria-label="Toggle contrast theme"
        >
          {/* Half-moon / Contrast circle icon [ ◐ ] */}
          <svg viewBox="0 0 24 24" className="size-3.5 fill-current" aria-hidden="true">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16z" />
          </svg>
        </button>
      </div>
    </header>
  );
}
