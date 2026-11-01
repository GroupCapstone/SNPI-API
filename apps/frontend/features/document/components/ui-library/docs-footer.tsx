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

// Social & Developer Icons (SVG Vectors, Zero Emojis)
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function TerminalIcon({ className }: { className?: string }) {
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
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
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
  const currentVersion = CHANGE_LOGS[0]?.version || '0.2.14';

  // 1. Real UI Library Primitives & Sections
  const uiLibraryLinks = [
    { label: 'Navigation & Cyber Armor', href: '/document/design-system#cat-navigation' },
    { label: 'Rich Text Editor & Forms', href: '/document/design-system#cat-forms' },
    { label: 'Feedback & Toast Stack', href: '/document/design-system#cat-feedback' },
    { label: 'Data Tables & Display', href: '/document/design-system#cat-display' },
    { label: 'AI Agent Prompt Primitives', href: '/document/design-system#cat-ai-kit' },
    { label: 'Design Standards & Tokens', href: '/document/design-system#design-principles' },
    { label: '44px Touch Targets (a11y)', href: '/document/design-system#touch-targets' },
  ];

  // 2. Real Open API Gateway Feeds & Services
  const openApiLinks = [
    { label: 'Public Syndication Gateway', href: '/document#public-feeds' },
    { label: 'RSS 2.0 Campus Notices', href: '/document#public-feeds' },
    { label: 'Emergency Alerts (JSON)', href: '/document#public-feeds' },
    { label: 'Academic Term Calendar', href: '/document#public-feeds' },
    { label: '47 Modular Monolith Services', href: '/document#available-services' },
    { label: 'Edge Caching & Zero Auth', href: '/document#open-api-head' },
    { label: 'Release Changelog Checkpoints', href: '/document/changelog' },
  ];

  // 3. Real School Management System (SMS) Routes
  const platformLinks = [
    { label: 'Executive Dashboard', href: '/dashboard' },
    { label: 'Student Admissions & Records', href: '/students' },
    { label: 'Classes & Curriculum', href: '/classes' },
    { label: 'Campus Timetable', href: '/timetable' },
    { label: 'Attendance & Leave Tracking', href: '/attendance' },
    { label: 'Tuition & Fee Accounting', href: '/finance/tuition' },
    { label: 'Academic Performance Reports', href: '/reports' },
  ];

  // Authentic Footer Legal / Anchors (Zero Fake Boilerplate)
  const bottomNavLinks = [
    { label: 'UI Library', href: '/document/design-system' },
    { label: 'Open API', href: '/document' },
    { label: 'Changelog', href: '/document/changelog' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'GitHub Monorepo', href: 'https://github.com/Tan-Saphea/SNPI-SMS' },
  ];

  return (
    <footer className={cn('relative w-full pt-12 select-none sm:pt-16', className)}>
      {/* Main Curved Top Footer Capsule Container */}
      <div className="relative mx-auto w-full max-w-[1560px] overflow-hidden rounded-t-[36px] border-x border-t border-slate-200/90 bg-[#F8FAFC] px-6 pt-12 pb-8 shadow-xs sm:rounded-t-[44px] sm:px-10 md:rounded-t-[48px] lg:px-14">
        {/* Upper Navigation Section */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 lg:gap-12">
          {/* Brand Sparkle Mark ✦ */}
          <div className="md:col-span-1 lg:col-span-1">
            <Link
              href="/document"
              title="SNPI-SMS Developer Portal"
              className="flex size-10 items-center justify-center rounded-xl border border-[#CAD3F5] bg-[#E3E7FC] transition-transform hover:scale-105"
            >
              <StarMarkIcon className="size-6 text-[#0056FF]" />
            </Link>
          </div>

          {/* Column 1: UI LIBRARY */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-[#0056FF] uppercase">
              UI Library
            </h4>
            <ul className="space-y-2.5">
              {uiLibraryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-600 transition-colors hover:text-[#0056FF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2: OPEN API */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-[#0056FF] uppercase">
              Open API
            </h4>
            <ul className="space-y-2.5">
              {openApiLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-600 transition-colors hover:text-[#0056FF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: SMS PLATFORM */}
          <div className="space-y-4 md:col-span-3 lg:col-span-3">
            <h4 className="font-mono text-xs font-bold tracking-widest text-[#0056FF] uppercase">
              SMS Platform
            </h4>
            <ul className="space-y-2.5">
              {platformLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-sans text-xs text-slate-600 transition-colors hover:text-[#0056FF]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Right Section: Language Selector & Real Social/Code Links */}
          <div className="flex flex-col items-start gap-6 md:col-span-2 md:items-end lg:col-span-2">
            {/* Language Selector Dropdown Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-slate-800 transition-colors hover:border-[#0056FF] hover:text-[#0056FF]"
              >
                <GlobeIcon className="size-3.5 text-slate-500" />
                <span>{selectedLang === 'en' ? 'English (US)' : 'Khmer (KH)'}</span>
                <ChevronDownIcon
                  className={cn(
                    'size-3.5 text-slate-500 transition-transform duration-150',
                    langDropdownOpen && 'rotate-180',
                  )}
                />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-[#CAD3F5] bg-white p-1 shadow-none">
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
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
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
                        : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900',
                    )}
                  >
                    <span>Khmer (KH)</span>
                    <span className="font-mono text-[10px] opacity-70">KH</span>
                  </button>
                </div>
              )}
            </div>

            {/* Authentic Developer Links: GitHub Monorepo, RSS Feed, Open API Gateway */}
            <div className="flex items-center gap-3.5 text-slate-500">
              <a
                href="https://github.com/Tan-Saphea/SNPI-SMS"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub Repository"
                title="SNPI-SMS Monorepo on GitHub"
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]"
              >
                <GitHubIcon className="size-4" />
              </a>

              <Link
                href="/document#public-feeds"
                aria-label="RSS 2.0 Syndication Feed"
                title="Public Feeds & RSS 2.0"
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]"
              >
                <RssIcon className="size-4" />
              </Link>

              <Link
                href="/document"
                aria-label="Open API Gateway"
                title="Open API Gateway"
                className="flex size-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]"
              >
                <TerminalIcon className="size-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Thin Horizontal Divider Line */}
        <div className="my-8 w-full border-t border-slate-200" />

        {/* Bottom Bar: Copyright Left | Real Working Navigation Links Right */}
        <div className="flex flex-col gap-4 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-sans font-medium">
            <span>&copy; 2026 SNPI-SMS Platform</span>
            <span className="text-slate-400">&middot;</span>
            <span className="inline-flex items-center rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
              v{currentVersion}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-sans text-xs">
            {bottomNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-[#0056FF]"
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
