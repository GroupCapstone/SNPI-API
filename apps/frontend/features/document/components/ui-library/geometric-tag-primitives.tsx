'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * Geometric 8-Point Asterisk Starburst Icon (Minimal Tags motif)
 */
export function GeometricAsterisk({
  className = 'h-4 w-4',
  strokeWidth = 2.5,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={cn('inline-block shrink-0', className)}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      aria-hidden="true"
    >
      {/* Orthogonal rays */}
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      {/* Diagonal rays */}
      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
      <line x1="4.93" y1="19.07" x2="19.07" y2="4.93" />
    </svg>
  );
}

/**
 * Geometric Downward Triangular Pointer for speech bubble tags
 */
export function GeometricSpeechTriangle({ className = 'text-[#0056FF]' }: { className?: string }) {
  return (
    <span
      className={cn(
        'absolute -bottom-2 left-6 h-0 w-0 border-x-[6px] border-t-[8px] border-b-0 border-x-transparent border-t-current',
        className,
      )}
      aria-hidden="true"
    />
  );
}

export interface GeometricButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'tab' | 'ticket' | 'speech' | 'ghost';
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showAsterisk?: boolean;
  attachedTag?: string;
  notchPosition?: 'top-right' | 'bottom-right' | 'none';
}

/**
 * Reusable Geometric Tag Button with chamfered notch, ticket cuts, or speech callouts
 */
export const GeometricButton = React.forwardRef<HTMLButtonElement, GeometricButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      isActive = false,
      size = 'md',
      showAsterisk = false,
      attachedTag,
      notchPosition = 'top-right',
      disabled,
      ...props
    },
    ref,
  ) => {
    // Size tokens
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5',
      md: 'h-10 px-4 text-xs font-bold gap-2',
      lg: 'h-12 px-5 text-sm font-bold gap-2.5',
    }[size];

    // Chamfer notch clip paths
    const notchClip =
      notchPosition === 'top-right'
        ? '[clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)]'
        : notchPosition === 'bottom-right'
          ? '[clip-path:polygon(0_0,100%_0,100%_calc(100%-10px),calc(100%-10px)_100%,0_100%)]'
          : '';

    // Primary or Active state style (Electric Cobalt Blue #0056FF)
    const isSolidActive = isActive || variant === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'group relative inline-flex items-center justify-center font-sans tracking-wider uppercase transition-all duration-200 select-none',
          sizeClasses,
          notchClip,
          // Active or Primary State
          isSolidActive &&
            'border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-sm hover:border-[#0044D6] hover:bg-[#0044D6]',
          // Outline Inactive State
          !isSolidActive &&
            variant === 'outline' &&
            'border-2 border-slate-300 bg-white text-slate-800 hover:border-[#0056FF] hover:text-[#0056FF]',
          // Tab Inactive State
          !isSolidActive &&
            variant === 'tab' &&
            'border-2 border-slate-200 bg-white text-slate-600 hover:border-[#0056FF] hover:text-slate-950',
          // Ticket Inactive State
          !isSolidActive &&
            variant === 'ticket' &&
            'border-2 border-dashed border-slate-300 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
          // Ghost Inactive State
          !isSolidActive &&
            variant === 'ghost' &&
            'border-2 border-transparent text-slate-600 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900',
          // Speech Bubble Variant
          variant === 'speech' && 'relative pb-1',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        {/* Attached Tag (e.g. "2026", "01", "NEW") */}
        {attachedTag && (
          <span
            className={cn(
              'mr-1 -ml-2 inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] font-black',
              isSolidActive
                ? 'bg-[#000B26] text-white'
                : 'bg-slate-100 text-slate-700 group-hover:bg-[#0056FF] group-hover:text-white',
            )}
          >
            {attachedTag}
          </span>
        )}

        {/* Content */}
        <span>{children}</span>

        {/* Asterisk Accent */}
        {showAsterisk && (
          <GeometricAsterisk
            className={cn(
              'h-3.5 w-3.5 transition-transform group-hover:rotate-45',
              isSolidActive ? 'text-white' : 'text-[#0056FF]',
            )}
          />
        )}

        {/* Speech Bubble Downward Caret */}
        {variant === 'speech' && isSolidActive && (
          <span className="absolute -bottom-2 left-1/2 h-0 w-0 -translate-x-1/2 border-x-[5px] border-t-[7px] border-b-0 border-x-transparent border-t-[#0056FF]" />
        )}
      </button>
    );
  },
);

GeometricButton.displayName = 'GeometricButton';

/**
 * Geometric Header Stamp (e.g. "20 | BRAND / 22 | NEW")
 */
export function GeometricHeaderStamp({
  codeA = '20',
  titleA = 'BRAND',
  codeB = '26',
  titleB = 'DESIGN',
  className,
}: {
  codeA?: string;
  titleA?: string;
  codeB?: string;
  titleB?: string;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex flex-col font-sans select-none', className)}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
          {codeA}
        </span>
        <span className="h-5 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleA}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
          {codeB}
        </span>
        <span className="h-5 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleB}
        </span>
      </div>
    </div>
  );
}

/**
 * Geometric Card Container with 2px crisp lines, notched corner, or ticket scallop edges
 */
export function GeometricCard({
  children,
  className,
  variant = 'chamfer',
  isActive = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'chamfer' | 'ticket' | 'speech' | 'stepped' | 'pinnacle';
  isActive?: boolean;
}) {
  const chamferClass =
    variant === 'chamfer'
      ? '[clip-path:polygon(0_0,calc(100%-16px)_0,100%_16px,100%_100%,0_100%)]'
      : '';

  const pinnacleClass =
    variant === 'pinnacle' ? '[clip-path:polygon(0_20px,100%_0,100%_100%,0_100%)]' : '';

  return (
    <div
      className={cn(
        'group relative overflow-hidden bg-white transition-all duration-300 ease-out',
        // 2px border line
        'border-2',
        isActive
          ? 'border-[#0056FF] shadow-md ring-2 ring-[#0056FF]/20'
          : 'border-slate-200 hover:-translate-y-1 hover:border-[#0056FF] hover:shadow-xl',
        chamferClass,
        pinnacleClass,
        className,
      )}
    >
      {/* Ticket Scallops (Left & Right half-circle cutouts) */}
      {variant === 'ticket' && (
        <>
          <span className="absolute top-1/2 -left-2.5 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-slate-200 bg-white group-hover:border-[#0056FF]" />
          <span className="absolute top-1/2 -right-2.5 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-slate-200 bg-white group-hover:border-[#0056FF]" />
        </>
      )}

      {children}
    </div>
  );
}

/**
 * Geometric Stepped Gradient Layer Tabs (cascading 4-layer stacked tabs)
 */
export function GeometricSteppedLayers({
  label = 'BRAND NEW',
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div className={cn('relative flex flex-col items-start font-sans', className)}>
      <div className="h-3 w-44 translate-x-6 rounded-t-sm bg-[#5C93FF]/40" />
      <div className="h-3 w-44 translate-x-4 rounded-t-sm bg-[#2277FF]/60" />
      <div className="h-3 w-44 translate-x-2 rounded-t-sm bg-[#0056FF]/80" />
      <div className="flex h-11 w-48 items-center justify-between border-2 border-[#0056FF] bg-[#0056FF] px-4 font-bold text-white shadow-md [clip-path:polygon(0_0,calc(100%-12px)_0,100%_12px,100%_100%,0_100%)]">
        <span className="text-xs tracking-wider uppercase">{label}</span>
        <GeometricAsterisk className="h-4 w-4 text-white" />
      </div>
    </div>
  );
}
