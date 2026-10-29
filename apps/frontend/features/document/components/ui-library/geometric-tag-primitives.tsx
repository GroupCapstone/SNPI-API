'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface GeometricButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'tab' | 'ticket' | 'speech' | 'ghost';
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showAsterisk?: boolean;
  attachedTag?: string;
  notchPosition?: 'top-right' | 'bottom-right' | 'none';
}

/**
 * Apple-style Liquid Glass Button
 * Continuous smooth rounded corners, translucent backdrop, specular highlight rim
 */
export const GeometricButton = React.forwardRef<HTMLButtonElement, GeometricButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      isActive = false,
      size = 'md',
      attachedTag,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Size tokens
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
      md: 'h-10 px-4 text-xs font-bold gap-2 rounded-xl',
      lg: 'h-12 px-5 text-sm font-bold gap-2.5 rounded-2xl',
    }[size];

    const isSolidActive = isActive || variant === 'primary';

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'group relative inline-flex items-center justify-center font-sans tracking-wider uppercase transition-all duration-200 select-none',
          sizeClasses,
          // Apple Liquid Glass Active / Primary State
          isSolidActive &&
            'border border-[#0056FF] bg-[#0056FF] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.35),_0_4px_12px_rgba(0,86,255,0.2)] hover:bg-[#0044D6]',
          // Apple Liquid Glass Inactive Outline / Tab State
          !isSolidActive &&
            'border border-slate-200/90 bg-white/80 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_1px_2px_rgba(0,0,0,0.03)] backdrop-blur-md hover:border-[#0056FF]/40 hover:bg-white hover:text-[#0056FF]',
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          className,
        )}
        {...props}
      >
        {attachedTag && (
          <span
            className={cn(
              'mr-1 -ml-1 inline-flex items-center rounded px-1.5 py-0.5 font-mono text-[10px] font-black',
              isSolidActive
                ? 'bg-[#000B26] text-white'
                : 'bg-slate-100 text-slate-700 group-hover:bg-[#0056FF] group-hover:text-white',
            )}
          >
            {attachedTag}
          </span>
        )}

        <span>{children}</span>
      </button>
    );
  },
);

GeometricButton.displayName = 'GeometricButton';

/**
 * Apple-style Liquid Glass Card Container
 */
export function GeometricCard({
  children,
  className,
  isActive = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'chamfer' | 'ticket' | 'speech' | 'stepped' | 'pinnacle';
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out',
        'border border-slate-200/80 bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md',
        isActive
          ? 'border-[#0056FF] shadow-md ring-2 ring-[#0056FF]/20'
          : 'hover:-translate-y-1 hover:border-[#0056FF]/40 hover:shadow-[0_12px_28px_rgba(0,86,255,0.08)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Clean Typographic Stamp (No emoji, no symbol)
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
        <span className="h-4 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleA}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
          {codeB}
        </span>
        <span className="h-4 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleB}
        </span>
      </div>
    </div>
  );
}
