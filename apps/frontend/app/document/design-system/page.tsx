'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { DesignSystemShowcase } from '@/features/document/components/ui-library/design-system-showcase';

export default function DesignSystemPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased selection:bg-blue-100 selection:text-blue-900">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <BrandMark compact size={32} />
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-extrabold tracking-tight text-slate-950">
                Open API
              </span>
              <span className="text-slate-300">|</span>
              <span className="rounded-md border border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-semibold text-[#023e8a]">
                UI Design System & Component Library
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/document"
              className="inline-flex h-8 items-center rounded-lg border border-slate-200 bg-slate-50 px-3 font-mono text-xs font-medium text-slate-700 hover:bg-slate-100 transition-colors"
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
      <footer className="mt-auto border-t border-slate-200 bg-slate-50 py-8 text-center font-mono text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>UI Design System & Component Library · 10 Core UI Components Standard</div>
          <div className="flex items-center gap-4">
            <Link href="/document" className="hover:text-slate-900">
              API Docs
            </Link>
            <Link href="/dashboard" className="hover:text-slate-900">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
