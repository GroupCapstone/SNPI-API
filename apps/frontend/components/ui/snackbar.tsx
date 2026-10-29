'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface SnackbarProps {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function Snackbar({
  open,
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
  className,
}: SnackbarProps) {
  React.useEffect(() => {
    if (!open || duration <= 0) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [open, duration, onClose]);

  if (!open) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-900 px-4 py-3 text-sm text-white transition-all sm:left-auto sm:right-6 sm:translate-x-0 dark:border-white/10 dark:bg-[#202024] dark:text-zinc-100',
        className,
      )}
    >
      <span className="flex-1 truncate text-sm font-normal text-slate-100 dark:text-zinc-200">
        {message}
      </span>
      {actionLabel && (
        <button
          type="button"
          onClick={() => {
            onAction?.();
            onClose();
          }}
          className="min-h-[44px] min-w-[44px] px-2 text-xs font-semibold uppercase tracking-wider text-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:underline"
        >
          {actionLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-white dark:text-zinc-400 dark:hover:text-zinc-100"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
