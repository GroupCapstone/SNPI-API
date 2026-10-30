'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { Code, ExternalLink } from '@/components/icons';
import { cn } from '@/lib/utils';

export function DocsFooter() {
  const [selectedLang, setSelectedLang] = React.useState('EN');

  // Timeline ruler seconds 0 to 14s matching the reference image
  const timelineSeconds = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

  const primaryLinks = [
    { label: 'Workflows', href: '/document' },
    { label: 'Showcase', href: '/document/design-system#component-gallery' },
    { label: 'Use cases', href: '/document#quickstart-guide' },
    { label: 'About', href: '/document#institutional-overview' },
    { label: 'Blog', href: '/document#core-modules-summary' },
    { label: 'Manifesto', href: '/document/design-system#design-principles' },
    { label: 'Brand', href: '/document/design-system#brand-blueprint' },
  ];

  const secondaryLinks = [
    { label: 'Help Center', href: '/document#available-endpoints' },
    { label: 'Contact us', href: 'mailto:support@snpi.edu.kh' },
    { label: 'Privacy Policy', href: '/document#security-specifications' },
    { label: 'Terms of Use', href: '/document#authentication-sessions' },
  ];

  return (
    <footer className="relative w-full overflow-hidden border-t border-slate-900 bg-[#000000] text-white selection:bg-[#0056FF] selection:text-white">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pt-12 pb-8 sm:px-6 lg:px-8">
        {/* Top: Brand Identity Header */}
        <div className="flex items-center gap-3">
          <BrandMark compact size={32} />
          <div className="flex items-center gap-2">
            <span className="font-sans text-lg font-black tracking-tight text-white sm:text-xl">
              SNPI-SMS
            </span>
            <span className="h-4 w-[2px] bg-[#0056FF]" />
            <span className="font-sans text-xs font-bold tracking-wider text-slate-400 uppercase">
              Docs
            </span>
          </div>
        </div>

        {/* Middle Section 1: Filmstrip / Audio Timeline Ruler */}
        <div className="relative mt-10 w-full pt-4">
          {/* Subtle baseline track line */}
          <div className="relative h-6 w-full border-b border-white/15">
            {/* Ticks and Seconds Markers */}
            <div className="flex h-full w-full items-end justify-between px-1">
              {timelineSeconds.map((sec) => (
                <div key={sec} className="relative flex flex-col items-center">
                  {/* Seconds Label */}
                  <span className="font-mono text-[10px] font-medium text-slate-400 select-none">
                    {sec === 0 ? '0' : `${sec}s`}
                  </span>
                  {/* Major Tick Mark */}
                  <div className="mt-1 h-2 w-[1px] bg-white/30" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Section 2: Centered Navigation Capsule Pills (2 Rows) */}
        <div className="mt-8 flex flex-col items-center gap-3">
          {/* Row 1: Primary Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {primaryLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                prefetch={true}
                className={cn(
                  'rounded-full border border-white/10 bg-[#000B26] px-4 py-1.5 font-sans text-xs font-semibold text-slate-300 transition-all duration-150 select-none',
                  'hover:border-[#2277FF] hover:bg-[#2277FF] hover:text-white hover:shadow-[0_0_16px_rgba(34,119,255,0.4)]',
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
                  'rounded-full border border-white/10 bg-[#000B26] px-4 py-1.5 font-sans text-xs font-semibold text-slate-300 transition-all duration-150 select-none',
                  'hover:border-[#2277FF] hover:bg-[#2277FF] hover:text-white hover:shadow-[0_0_16px_rgba(34,119,255,0.4)]',
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Section 3: Monumental Outlined Watermark (Exact Morphic Reference Style) */}
        <div className="relative mt-8 flex w-full justify-center overflow-hidden py-4 select-none">
          <span
            className="font-sans text-[16vw] font-black tracking-tighter text-transparent select-none"
            style={{
              WebkitTextStroke: '1.5px rgba(255, 255, 255, 0.08)',
              lineHeight: 0.9,
            }}
          >
            SNPI-SMS
          </span>
        </div>

        {/* Bottom Bar: Copyright & Compliance Left | Language & Links Right */}
        <div className="mt-4 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Copyright and Compliance */}
          <div className="flex flex-wrap items-center gap-2 font-sans font-medium">
            <span>&copy; SNPI-SMS 2026. All rights reserved</span>
            <span className="text-white/20">|</span>
            <span className="inline-flex items-center gap-1.5 text-slate-300">
              <span className="size-1.5 rounded-full bg-[#0056FF]" />
              <span>AICPA SOC 2 Type 1 certified</span>
            </span>
          </div>

          {/* Right: Language Selector and Links */}
          <div className="flex items-center gap-5">
            {/* Language Selector */}
            <div className="flex items-center gap-1 font-sans text-xs font-bold text-slate-300">
              <span>{selectedLang}</span>
              <span className="text-[10px] text-slate-500">&darr;</span>
            </div>

            {/* Social / Developer Links */}
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://github.com/shiliaiwei/SNP-SMS"
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs font-semibold text-slate-300 transition-colors hover:text-white"
              >
                GitHub
              </a>
              <span className="text-white/20">/</span>
              <Link
                href="/document"
                className="font-sans text-xs font-semibold text-slate-300 transition-colors hover:text-white"
              >
                API
              </Link>
              <span className="text-white/20">/</span>
              <Link
                href="/document/design-system"
                className="font-sans text-xs font-semibold text-slate-300 transition-colors hover:text-white"
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
