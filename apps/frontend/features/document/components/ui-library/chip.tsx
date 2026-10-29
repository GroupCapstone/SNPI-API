'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface LibraryChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function LibraryChip({
  active = false,
  onDismiss,
  icon,
  children,
  className,
  onClick,
  ...props
}: LibraryChipProps) {
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex h-8 min-h-[44px] items-center gap-1.5 rounded-full border px-3.5 text-xs font-semibold transition-all select-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none',
          active
            ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.3),_0_2px_8px_rgba(0,86,255,0.25)]'
            : 'border-slate-200/90 bg-white/80 text-slate-700 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8)] hover:border-[#0056FF]/40 hover:text-[#0056FF]',
          className,
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </button>
      {onDismiss && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDismiss();
          }}
          aria-label="Remove filter"
          className="ml-1 flex min-h-[44px] min-w-[28px] items-center justify-center text-slate-400 hover:text-slate-700"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  );
}
