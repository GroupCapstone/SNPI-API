'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface LibrarySnackbarProps {
  open: boolean;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onClose: () => void;
  duration?: number;
  className?: string;
}

export function LibrarySnackbar({
  open,
  message,
  actionLabel,
  onAction,
  onClose,
  duration = 5000,
  className,
}: LibrarySnackbarProps) {
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
        'fixed bottom-6 left-1/2 z-50 flex w-full max-w-md -translate-x-1/2 items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-lg transition-all sm:right-6 sm:left-auto sm:translate-x-0',
        className,
      )}
    >
      <span className="flex-1 truncate text-sm font-medium text-slate-800">{message}</span>
      {actionLabel && (
        <button
          type="button"
          onClick={() => {
            onAction?.();
            onClose();
          }}
          className="min-h-[44px] min-w-[44px] px-2 text-xs font-bold tracking-wider text-[#0056FF] uppercase hover:text-[#0040C0] focus-visible:underline focus-visible:outline-none"
        >
          {actionLabel}
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        aria-label="Dismiss message"
        className="flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-700"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
