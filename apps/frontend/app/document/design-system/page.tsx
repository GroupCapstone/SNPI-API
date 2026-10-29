'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { DesignSystemShowcase } from '@/features/document/components/ui-library/design-system-showcase';

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#000B26] font-sans text-white antialiased selection:bg-[#0056FF] selection:text-white">
      {/* Top Navigation Bar - Midnight Surge & Royal Blue */}
      <header className="sticky top-0 z-40 w-full border-b border-[#0F357D] bg-[#000B26]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-white">
                Open API
              </span>
              <span className="text-[#0F357D]">|</span>
              <span className="rounded-md border border-[#0056FF]/50 bg-[#0056FF]/20 px-2 py-0.5 font-mono text-xs font-semibold text-[#E3E7FC]">
                Royal Blue & Sora Blueprint · UI Library
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/document"
              className="inline-flex h-8 items-center rounded-lg border border-[#0F357D] bg-[#001338] px-3 font-mono text-xs font-medium text-[#C4CEF8] transition-colors hover:border-[#0056FF] hover:text-white"
            >
              &larr; API Documentation
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Container */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6">
        <DesignSystemShowcase />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#0F357D] bg-[#00071A] py-8 text-center font-mono text-xs text-[#A3B4F0]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#0056FF]" />
            <span>SNP-SMS Design Standards & 10 UI Components · Royal Blue (#0056FF) & Sora</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/document" className="text-[#C4CEF8] transition-colors hover:text-white">
              API Docs
            </Link>
            <Link href="/dashboard" className="text-[#C4CEF8] transition-colors hover:text-white">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
