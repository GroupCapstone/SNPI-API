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
          'inline-flex h-8 min-h-[44px] items-center gap-1.5 rounded-full border px-3 text-xs font-normal transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500/50',
          active
            ? 'border-zinc-500 bg-[#2E2E33] font-medium text-zinc-100'
            : 'border-white/5 bg-[#202024] text-zinc-300 hover:bg-[#2E2E33]',
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
          className="ml-1 flex min-h-[44px] min-w-[28px] items-center justify-center text-zinc-400 hover:text-zinc-100"
        >
          <X className="size-3.5" />
        </button>
      )}
    </span>
  );
}
