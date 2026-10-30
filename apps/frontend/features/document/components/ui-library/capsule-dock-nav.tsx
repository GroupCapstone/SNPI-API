'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useDocsNav } from './docs-nav-context';

export interface CapsuleDockNavProps {
  className?: string;
  version?: string;
}

/**
 * CapsuleDockNav (Floating 3-Island Header Navigation)
 *
 * Implements the floating capsule dock design:
 * - Island 1 (Left): Official project logo (/images/logo.png) + Brand name ("SNPI-SMS Docs")
 * - Island 2 (Center): Two direct links [ UI Library | Open API ] (zero dropdown)
 * - Island 3 (Right): Version display badge [ • v0.2.8 ] (replacing GitHub)
 * - Scroll Resize Animation: Shrinks smaller on scroll-down, expands bigger on scroll-up
 * - High Contrast: Dark obsidian surfaces with vivid Royal Blue & white text
 */
export function CapsuleDockNav({ className, version = 'v0.2.8' }: CapsuleDockNavProps) {
  const pathname = usePathname();
  const { activeTab, setActiveTab } = useDocsNav();

  // Scroll tracking state for scroll-resize animation
  const [isCompact, setIsCompact] = React.useState(false);
  const lastScrollYRef = React.useRef(0);

  const isLibrary = pathname?.startsWith('/document/design-system') || activeTab === 'library';
  const isOpenApi =
    (pathname === '/document' ||
      pathname?.startsWith('/document/open-api') ||
      activeTab === 'openapi') &&
    !isLibrary;

  // Real-time scroll listener: smaller on scroll-down, bigger on scroll-up
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const lastScrollY = lastScrollYRef.current;

      if (currentScrollY > 50 && currentScrollY > lastScrollY) {
        // Scrolling down -> make smaller
        setIsCompact(true);
      } else if (currentScrollY < lastScrollY || currentScrollY <= 30) {
        // Scrolling up or near top -> make bigger
        setIsCompact(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      data-slot="capsule-dock-nav"
      className={cn(
        'pointer-events-none sticky top-0 z-50 flex w-full flex-col items-center justify-center transition-all duration-300 ease-out select-none',
        isCompact ? 'pt-2 pb-1.5' : 'pt-3.5 pb-2.5',
        className,
      )}
    >
      {/* 3-Island Floating Dock Row with Scroll Resize Animation */}
      <div
        className={cn(
          'pointer-events-auto mx-auto flex flex-wrap items-center justify-center gap-2 px-4 transition-all duration-300 ease-out sm:gap-3',
          isCompact ? 'scale-[0.93] shadow-md sm:scale-95' : 'scale-100 shadow-2xl',
        )}
      >
        {/* ======================================================== */}
        {/* ISLAND 1 (Left): Official Project Logo & Name */}
        {/* ======================================================== */}
        <Link
          href="/document"
          data-dock-pill="true"
          onClick={() => setActiveTab('openapi', false)}
          className={cn(
            'group flex items-center gap-2.5 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300 hover:border-slate-700 hover:ring-white/20 active:scale-95',
            isCompact ? 'h-9 px-3 py-1' : 'h-11 px-4 py-2',
          )}
          title="SNPI-SMS Developer Documentation Portal"
        >
          {/* Official Project Logo Image */}
          <div
            className={cn(
              'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-white transition-all duration-300',
              isCompact ? 'size-5 p-0.5' : 'size-6.5 p-0.5',
            )}
          >
            <Image
              src="/images/logo.png"
              alt="SNP Logo"
              width={26}
              height={26}
              className="size-full object-contain"
              priority
            />
          </div>

          {/* Project Name & Category Label */}
          <div className="flex items-center gap-1.5 font-sans">
            <span
              className={cn(
                'font-black tracking-tight text-white transition-all duration-300 group-hover:text-slate-100',
                isCompact ? 'text-xs' : 'text-sm',
              )}
            >
              SNPI-SMS
            </span>
            <span className="font-mono text-[10px] font-bold text-[#38BDF8]">Docs</span>
          </div>
        </Link>

        {/* ======================================================== */}
        {/* ISLAND 2 (Center): Two Direct Links [ UI Library | Open API ] */}
        {/* ======================================================== */}
        <nav
          data-dock-pill="true"
          aria-label="Document Navigation"
          className={cn(
            'flex items-center gap-1 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300',
            isCompact ? 'h-9 px-2.5' : 'h-11 px-3.5',
          )}
        >
          {/* Link 1: UI Library */}
          <Link
            href="/document/design-system"
            onClick={() => setActiveTab('library', false)}
            className={cn(
              'rounded-full font-sans font-bold transition-all duration-200 select-none',
              isCompact ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs',
              isLibrary
                ? 'bg-[#0056FF] text-white shadow-[0_0_14px_rgba(0,86,255,0.6)] ring-1 ring-white/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white',
            )}
          >
            UI Library
          </Link>

          {/* Divider */}
          <span className="font-mono text-xs text-slate-700 select-none">|</span>

          {/* Link 2: Open API */}
          <Link
            href="/document"
            onClick={() => setActiveTab('openapi', false)}
            className={cn(
              'rounded-full font-sans font-bold transition-all duration-200 select-none',
              isCompact ? 'px-3 py-1 text-xs' : 'px-3.5 py-1.5 text-xs',
              isOpenApi
                ? 'bg-[#0056FF] text-white shadow-[0_0_14px_rgba(0,86,255,0.6)] ring-1 ring-white/20'
                : 'text-slate-300 hover:bg-white/10 hover:text-white',
            )}
          >
            Open API
          </Link>
        </nav>

        {/* ======================================================== */}
        {/* ISLAND 3 (Right): Version Display Badge (Replacing GitHub) */}
        {/* ======================================================== */}
        <div
          data-dock-pill="true"
          className={cn(
            'flex items-center gap-2 rounded-full border border-slate-800/90 bg-[#0A0D14]/95 text-white shadow-[0_12px_36px_rgba(0,0,0,0.45)] ring-1 ring-white/10 backdrop-blur-2xl transition-all duration-300 select-none',
            isCompact ? 'h-9 px-3 py-1' : 'h-11 px-3.5 py-2',
          )}
          title={`SNPI-SMS Platform Release ${version}`}
        >
          {/* Active Status Pulse Dot */}
          <span className="relative flex size-2 items-center justify-center">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#0056FF] opacity-75" />
            <span className="relative inline-flex size-1.5 rounded-full bg-[#0056FF]" />
          </span>

          <span
            className={cn(
              'font-mono font-bold tracking-wider text-slate-200',
              isCompact ? 'text-[11px]' : 'text-xs',
            )}
          >
            {version}
          </span>
        </div>
      </div>
    </header>
  );
}
