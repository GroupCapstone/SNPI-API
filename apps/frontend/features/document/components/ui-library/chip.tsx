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
          'inline-flex h-8 min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none',
          active
            ? 'border-blue-300 bg-blue-50 text-[#023e8a]'
            : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200',
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
