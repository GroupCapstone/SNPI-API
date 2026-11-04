'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export type StatusCode = 404 | 403 | 500 | 503 | 401;
export type StatusMode = 'radar' | 'barcode' | 'noise' | 'gravity';

export interface StatusMeta {
  code: StatusCode;
  title: string;
  tagline: string;
  description: string;
  remediation: string;
  badge: string;
}

export const STATUS_DIRECTORY: Record<StatusCode, StatusMeta> = {
  404: {
    code: 404,
    title: 'Page Not Found',
    tagline: 'HTTP 404',
    description: '',
    remediation: '',
    badge: 'HTTP 404 · NOT FOUND',
  },
  403: {
    code: 403,
    title: 'Access Forbidden',
    tagline: 'HTTP 403',
    description: '',
    remediation: '',
    badge: 'HTTP 403 · FORBIDDEN',
  },
  500: {
    code: 500,
    title: 'Internal Server Error',
    tagline: 'HTTP 500',
    description: '',
    remediation: '',
    badge: 'HTTP 500 · SERVER ERROR',
  },
  503: {
    code: 503,
    title: 'Service Unavailable',
    tagline: 'HTTP 503',
    description: '',
    remediation: '',
    badge: 'HTTP 503 · UNAVAILABLE',
  },
  401: {
    code: 401,
    title: 'Unauthorized Access',
    tagline: 'HTTP 401',
    description: '',
    remediation: '',
    badge: 'HTTP 401 · UNAUTHORIZED',
  },
};

export interface StatusPage404Props {
  /** Visual presentation mode archetype (preserved for contract compatibility) */
  mode?: StatusMode;
  /** HTTP Status Code. Default: 404 */
  statusCode?: StatusCode;
  /** Custom heading title override */
  title?: string;
  /** Custom description override (preserved for contract compatibility) */
  description?: string;
  /** Primary action button link href. Default: '/dashboard' */
  homeHref?: string;
  /** Primary action button label */
  homeLabel?: string;
  /** Container className */
  className?: string;
  /** Allow inline status code switching controls. Default: false */
  showControls?: boolean;
}

export function StatusPage404({
  mode: _mode,
  statusCode: initialCode = 404,
  title: customTitle,
  description: _customDesc,
  homeHref = '/dashboard',
  homeLabel,
  className,
  showControls = false,
}: StatusPage404Props) {
  const [activeCode, setActiveCode] = React.useState<StatusCode>(initialCode);

  React.useEffect(() => {
    setActiveCode(initialCode);
  }, [initialCode]);

  const meta = STATUS_DIRECTORY[activeCode] || STATUS_DIRECTORY[404];
  const resolvedTitle = customTitle || meta.title;

  return (
    <div
      data-slot="status-page-404"
      className={cn(
        'relative flex w-full flex-col overflow-hidden rounded-[4px] border border-[#CAD3F5] bg-white p-8 text-center sm:p-14',
        className,
      )}
    >
      {/* Optional inline status code switcher */}
      {showControls && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-1.5 border-b border-[#CAD3F5]/60 pb-4">
          <span className="mr-2 font-mono text-[10px] font-bold text-slate-400 uppercase">
            Status Code:
          </span>
          {([404, 403, 500, 503, 401] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setActiveCode(code)}
              className={cn(
                'cursor-pointer rounded-[2px] border px-2.5 py-1 font-mono text-xs font-bold transition-colors select-none',
                activeCode === code
                  ? 'border-[#0056FF] bg-[#0056FF] text-white'
                  : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              {code}
            </button>
          ))}
        </div>
      )}

      {/* Main Status Display: Code and Title Only */}
      <div className="flex flex-col items-center justify-center space-y-3">
        {/* Status Badge */}
        <span className="rounded-[2px] border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[11px] font-bold text-[#0056FF]">
          {meta.badge}
        </span>

        {/* Large Prominent Status Code */}
        <h1 className="font-sans text-7xl font-black tracking-tight text-[#0056FF] sm:text-8xl">
          {activeCode}
        </h1>

        {/* Title */}
        <h2 className="font-sans text-xl font-bold tracking-tight text-[#0A1A4A] sm:text-2xl">
          {resolvedTitle}
        </h2>

        {/* Optional Action Button */}
        {homeLabel && (
          <div className="pt-4">
            <Link
              href={homeHref}
              className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-[4px] bg-[#0056FF] px-5 py-2 font-sans text-xs font-semibold text-white transition-colors hover:bg-[#2277FF] active:bg-[#0047D4]"
            >
              <span>{homeLabel}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
