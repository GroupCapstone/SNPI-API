'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  onDismiss?: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function Chip({
  active = false,
  onDismiss,
  icon,
  children,
  className,
  onClick,
  ...props
}: ChipProps) {
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'inline-flex h-8 min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50',
          active
            ? 'border-slate-900 bg-slate-900 font-medium text-white dark:border-zinc-500 dark:bg-[#2E2E33] dark:text-zinc-100'
            : 'border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:border-white/5 dark:bg-[#202024] dark:text-zinc-300 dark:hover:bg-[#2E2E33]',
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
          className="ml-1 flex min-h-[44px] min-w-[28px] items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  );
}
