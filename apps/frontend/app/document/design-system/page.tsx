'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { DesignSystemShowcase } from '@/features/document/components/ui-library/design-system-showcase';

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0B2518] font-sans text-[#F7F9F7] antialiased selection:bg-[#92FF5F] selection:text-[#0B2518]">
      {/* Top Navigation Bar - Move Green Theme */}
      <header className="sticky top-0 z-40 w-full border-b border-[#1A4530] bg-[#0B2518]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-white">
                Open API
              </span>
              <span className="text-[#1A4530]">|</span>
              <span className="rounded-md border border-[#92FF5F]/40 bg-[#92FF5F]/10 px-2 py-0.5 font-mono text-xs font-semibold text-[#92FF5F]">
                UI Design System & Brand Blueprint
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/document"
              className="inline-flex h-8 items-center rounded-lg border border-[#1A4530] bg-[#0F3B27] px-3 font-mono text-xs font-medium text-[#C5E3D5] transition-colors hover:border-[#92FF5F] hover:text-[#92FF5F]"
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
      <footer className="mt-auto border-t border-[#1A4530] bg-[#071D13] py-8 text-center font-mono text-xs text-[#7DAF99]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <div className="flex items-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-[#92FF5F]" />
            <span>SNP-SMS Design Standards & 10 UI Components · Brand Concept Blueprint</span>
          </div>
          <div className="flex items-center gap-4">
            <Link
              href="/document"
              className="text-[#C5E3D5] transition-colors hover:text-[#92FF5F]"
            >
              API Docs
            </Link>
            <Link
              href="/dashboard"
              className="text-[#C5E3D5] transition-colors hover:text-[#92FF5F]"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
