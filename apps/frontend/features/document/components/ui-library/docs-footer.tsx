'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { CHANGE_LOGS } from '../../changelog-data';

export interface DocsFooterProps {
  theme?: 'light' | 'dark';
  className?: string;
}

// 4-point Star Mark (✦)
function StarMarkIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor">
      <path d="M12 0C12 6.627 6.627 12 0 12C6.627 12 12 17.373 12 24C12 17.373 17.373 12 24 12C17.373 12 12 6.627 12 0Z" />
    </svg>
  );
}

// Globe Icon (Wireframe Sphere)
function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}

// Chevron Down Icon
function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

// Social Icons (SVG Vectors, Zero Emojis)
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
    </svg>
  );
}

function BlueskyIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 568 501" fill="currentColor" className={className}>
      <path d="M123.12 35.77c59.41 44.78 125.17 135.53 160.88 190.58 35.71-55.05 101.47-145.8 160.88-190.58C489.3-2.53 568-28.7 568 66.7c0 19.06-10.96 160.36-17.4 183.39-22.37 80.05-103.73 100.5-176.2 88.13 126.68 21.6 158.98 92.42 89.28 163.85-83.32 85.39-161.74-21.41-179.76-74.88-1.54-4.57-2.31-7.07-2.31-7.07s-.77 2.5-2.31 7.07c-18.02 53.47-96.44 160.27-179.76 74.88-69.7-71.43-37.4-142.25 89.28-163.85-72.47 12.37-153.83-8.08-176.2-88.13C10.96 227.06 0 85.76 0 66.7 0-28.7 78.7-2.53 123.12 35.77Z" />
    </svg>
  );
}

function RssIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" fill="currentColor" />
    </svg>
  );
}

export function DocsFooter({ className }: DocsFooterProps) {
  const [selectedLang, setSelectedLang] = React.useState<'en' | 'kh'>('en');
  const [langDropdownOpen, setLangDropdownOpen] = React.useState(false);
  const currentVersion = CHANGE_LOGS[0]?.version || '0.2.7';

  const platformLinks = [
    { label: 'Student Lifecycle', href: '/document#endpoints-available' },
    { label: 'Academic Operations', href: '/document#overall-api' },
    { label: 'Examination & Grading', href: '/document#endpoints-available' },
    { label: 'Finance & Fee Ledger', href: '/document#endpoints-available' },
    { label: 'Modular Monolith API', href: '/document#quickstart-guide' },
    { label: 'Security & Access Control', href: '/document#security-policies' },
    { label: 'Developer Documentation', href: '/document' },
  ];

  const learnLinks = [
    { label: 'Architecture Standards', href: '/document/design-system#design-principles' },
    { label: 'Design System Manual', href: '/document/design-system' },
    { label: 'Monorepo Security Policy', href: '/document#security-policies' },
    { label: '10 UI Core Components', href: '/document/design-system#component-gallery' },
    { label: 'Verification Pipeline', href: '/document#verification-suite' },
    { label: 'Changelog Portal', href: '/document/changelog' },
    { label: 'Quickstart Guide', href: '/document#quickstart-guide' },
  ];

  const companyLinks = [
    { label: 'About SNPI-SMS', href: '/document#purpose' },
    { label: 'Engineering Team', href: '/document#developer-workflow' },
    { label: 'Institutional Governance', href: '/document#system-roles' },
    { label: 'Campus Life & Events', href: '/document#endpoints-available' },
    { label: 'Contact Administration', href: 'mailto:support@snpi.edu.kh' },
    { label: 'Trust & Compliance', href: '/document#privacy-policy' },
    { label: 'Partner Network', href: '/document#institution-types' },
  ];

  const legalLinks = [
    { label: 'Status', href: '/document#realtime-status' },
    { label: 'Privacy Policy', href: '/document#privacy-policy' },
    { label: 'Terms of Use', href: '/document#terms-of-service' },
    { label: 'Modern Slavery Statement', href: '/document#modern-slavery' },
    { label: 'Cookie Preferences', href: '/document#cookie-preferences' },
  ];

  return (
    <footer className={cn('relative w-full pt-16 select-none sm:pt-24', className)}>
      {/* Top Atmospheric Radiant Blue Horizon Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 overflow-hidden">
        <div className="absolute top-0 left-1/2 h-56 w-[130%] max-w-[1600px] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-[#0056FF]/25 via-[#2277FF]/15 to-transparent blur-3xl" />
      </div>

      {/* Main Curved Top Footer Capsule Container (Wiz-Style Architectural Layout) */}
      <div className="relative mx-auto w-full max-w-[1560px] overflow-hidden rounded-t-[36px] border-t border-x border-slate-700/50 bg-[#101423] px-6 pt-12 pb-8 shadow-2xl sm:rounded-t-[44px] sm:px-10 md:rounded-t-[48px] lg:px-14">
        {/* Upper Navigation Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          {/* Brand Sparkle Mark ✦ */}
          <div className="md:col-span-1 lg:col-span-1">
            <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition-transform hover:scale-105">
              <StarMarkIcon className="size-6 text-white" />
            </div>
          </div>

          {/* Column 1: PLATFORM */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
              Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: LEARN */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
              Learn
            </h4>
            <ul className="space-y-2.5">
              {learnLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: COMPANY */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-slate-400 uppercase">
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section: Language Selector & Social Icons */}
          <div className="flex flex-col items-start gap-6 md:col-span-2 md:items-end lg:col-span-2">
            {/* Language Selector Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700/60 bg-white/5 px-3 py-1.5 font-sans text-xs font-semibold text-slate-200 transition-colors hover:border-slate-600 hover:bg-white/10 hover:text-white"
              >
                <GlobeIcon className="size-3.5 text-slate-400" />
                <span>{selectedLang === 'en' ? 'English (US)' : 'Khmer (KH)'}</span>
                <ChevronDownIcon
                  className={cn(
                    'size-3.5 text-slate-400 transition-transform duration-150',
                    langDropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-slate-700 bg-[#161B2E] p-1 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLang('en');
                      setLangDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-sans text-xs font-medium transition-colors',
                      selectedLang === 'en'
                        ? 'bg-[#0056FF] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <span>English (US)</span>
                    <span className="font-mono text-[10px] opacity-70">EN</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedLang('kh');
                      setLangDropdownOpen(false);
                    }}
                    className={cn(
                      'flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-sans text-xs font-medium transition-colors',
                      selectedLang === 'kh'
                        ? 'bg-[#0056FF] text-white'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white',
                    )}
                  >
                    <span>Khmer (KH)</span>
                    <span className="font-mono text-[10px] opacity-70">KH</span>
                  </button>
                </div>
              )}
            </div>

            {/* Social Icons Row: X, LinkedIn, Bluesky, RSS */}
            <div className="flex items-center gap-4 text-slate-400">
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="X (Twitter)"
                className="transition-colors hover:text-white"
              >
                <XIcon className="size-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn"
                className="transition-colors hover:text-white"
              >
                <LinkedInIcon className="size-4" />
              </a>
              <a
                href="https://bsky.app"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="Bluesky"
                className="transition-colors hover:text-white"
              >
                <BlueskyIcon className="size-4" />
              </a>
              <Link
                href="/document/changelog.rss"
                aria-label="RSS Feed"
                className="transition-colors hover:text-white"
              >
                <RssIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Thin Horizontal Divider Line */}
        <div className="my-8 w-full border-t border-slate-800/80" />

        {/* Bottom Bar: Copyright Left | Legal Links Right */}
        <div className="flex flex-col gap-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-sans font-medium">
            <span>&copy; 2026 SNPI-SMS, Inc.</span>
            <span className="text-slate-600">&middot;</span>
            <span className="inline-flex items-center rounded-md border border-slate-700 bg-white/5 px-2 py-0.5 font-mono text-[10px] font-bold text-[#AEC2FF]">
              v{currentVersion}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs">
            {legalLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-slate-200"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
