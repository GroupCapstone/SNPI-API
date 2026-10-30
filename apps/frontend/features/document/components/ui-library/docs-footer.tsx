'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { cn } from '@/lib/utils';

export interface DocsFooterProps {
  theme?: 'light' | 'dark';
  className?: string;
}

export function DocsFooter({ theme = 'light', className }: DocsFooterProps) {
  const [selectedLang] = React.useState('EN');
  const isDark = theme === 'dark';

  // Timeline ruler seconds 0 to 14s
  const timelineSeconds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const primaryLinks = [
    { label: 'Workflows', href: '/document' },
    { label: 'Showcase', href: '/document/design-system#component-gallery' },
    { label: 'Use cases', href: '/document#quickstart-guide' },
    { label: 'About', href: '/document#purpose' },
    { label: 'Blog', href: '/document#overall-api' },
    { label: 'Manifesto', href: '/document/design-system#design-principles' },
    { label: 'Brand', href: '/document/design-system#brand-blueprint' },
  ];

  const secondaryLinks = [
    { label: 'Help Center', href: '/document#endpoints-available' },
    { label: 'Contact us', href: 'mailto:support@snpi.edu.kh' },
    { label: 'Privacy Policy', href: '/document#protected-endpoints' },
    { label: 'Terms of Use', href: '/document#status-codes' },
  ];

  return (
    <footer
      className={cn(
        'relative w-full overflow-hidden border-t transition-colors duration-150 select-none',
        isDark
          ? 'border-slate-900 bg-[#000000] text-white selection:bg-[#0056FF] selection:text-white'
          : 'border-slate-200/90 bg-[#F8FAFC] text-slate-900 selection:bg-[#0056FF] selection:text-white',
        className,
      )}
    >
      <div className="mx-auto flex max-w-[1560px] flex-col px-4 pt-8 pb-6 sm:px-6 lg:px-8">
        {/* Top: Brand Identity Header */}
        <div className="flex items-center gap-3">
          <BrandMark compact size={28} />
          <div className="flex items-center gap-2">
            <span
              className={cn(
                'font-sans text-base font-black tracking-tight sm:text-lg',
                isDark ? 'text-white' : 'text-slate-950',
              )}
            >
              SNPI-SMS
            </span>
            <span className="h-3.5 w-[2px] bg-[#0056FF]" />
            <span
              className={cn(
                'font-sans text-[11px] font-bold tracking-wider uppercase',
                isDark ? 'text-slate-400' : 'text-slate-500',
              )}
            >
              Docs
            </span>
          </div>
        </div>

        {/* Middle Section 1: Filmstrip / Audio Timeline Ruler (Compact) */}
        <div className="relative mt-6 w-full pt-2">
          <div
            className={cn(
              'relative h-5 w-full border-b',
              isDark ? 'border-white/15' : 'border-slate-200',
            )}
          >
            {/* Ticks and Seconds Markers */}
            <div className="flex h-full w-full items-end justify-between px-1">
              {timelineSeconds.map((sec) => (
                <div key={sec} className="relative flex flex-col items-center">
                  <span
                    className={cn(
                      'font-mono text-[9px] font-medium select-none',
                      isDark ? 'text-slate-400' : 'text-slate-500',
                    )}
                  >
                    {sec === 0 ? '0' : `${sec}s`}
                  </span>
                  <div
                    className={cn('mt-1 h-1.5 w-[1px]', isDark ? 'bg-white/30' : 'bg-slate-300')}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section 2: Centered Navigation Capsule Pills (2 Rows) */}
        <div className="mt-6 flex flex-col items-center gap-2.5">
          {/* Row 1: Primary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                className={cn(
                  'rounded-full px-3.5 py-1 font-sans text-xs font-semibold transition-all duration-150 select-none',
                  isDark
                    ? 'border border-white/10 bg-[#000B26] text-slate-300 hover:border-[#2277FF] hover:bg-[#2277FF] hover:text-white'
                    : 'border border-slate-200/90 bg-[#E3E7FC]/60 text-slate-800 hover:border-[#0056FF] hover:bg-[#0056FF] hover:text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Row 2: Secondary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {secondaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                className={cn(
                  'rounded-full px-3.5 py-1 font-sans text-xs font-semibold transition-all duration-150 select-none',
                  isDark
                    ? 'border border-white/10 bg-[#000B26] text-slate-300 hover:border-[#2277FF] hover:bg-[#2277FF] hover:text-white'
                    : 'border border-slate-200/90 bg-white text-slate-600 hover:border-[#2277FF] hover:bg-[#2277FF] hover:text-white',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Section 3: Monumental Outlined Watermark (Compact & Subtle) */}
        <div className="relative mt-5 flex w-full justify-center overflow-hidden py-1 select-none">
          <span
            className="font-sans text-4xl font-black tracking-tighter text-transparent select-none sm:text-6xl md:text-7xl"
            style={{
              WebkitTextStroke: isDark
                ? '1.5px rgba(255, 255, 255, 0.07)'
                : '1.5px rgba(0, 86, 255, 0.08)',
              lineHeight: 1,
            }}
          >
            SNPI-SMS
          </span>
        </div>

        {/* Bottom Bar: Copyright Left | Language & Links Right */}
        <div
          className={cn(
            'mt-4 flex flex-col gap-3 border-t pt-4 text-xs sm:flex-row sm:items-center sm:justify-between',
            isDark ? 'border-white/10 text-slate-400' : 'border-slate-200/90 text-slate-500',
          )}
        >
          {/* Left: Copyright */}
          <div className="flex flex-wrap items-center gap-2 font-sans font-medium">
            <span>&copy; SNPI-SMS 2026. All rights reserved</span>
          </div>

          {/* Right: Language Selector and Links */}
          <div className="flex items-center gap-5">
            {/* Language Selector */}
            <div
              className={cn(
                'flex items-center gap-1 font-sans text-xs font-bold',
                isDark ? 'text-slate-300' : 'text-slate-700',
              )}
            >
              <span>{selectedLang}</span>
              <span className="text-[10px] text-slate-400">&darr;</span>
            </div>

            {/* Social / Developer Links */}
            <div
              className={cn(
                'flex items-center gap-4',
                isDark ? 'text-slate-400' : 'text-slate-500',
              )}
            >
              <a
                href="https://github.com/shiliaiwei/SNP-SMS"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  'font-sans text-xs font-semibold transition-colors',
                  isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-[#0056FF]',
                )}
              >
                GitHub
              </a>
              <span className={isDark ? 'text-white/20' : 'text-slate-300'}>/</span>
              <Link
                href="/document"
                className={cn(
                  'font-sans text-xs font-semibold transition-colors',
                  isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-[#0056FF]',
                )}
              >
                API
              </Link>
              <span className={isDark ? 'text-white/20' : 'text-slate-300'}>/</span>
              <Link
                href="/document/design-system"
                className={cn(
                  'font-sans text-xs font-semibold transition-colors',
                  isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-700 hover:text-[#0056FF]',
                )}
              >
                Library
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
