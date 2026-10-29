'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export function BottomSheet({
  open,
  onClose,
  title,
  children,
  className,
}: BottomSheetProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Panel */}
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          'relative z-50 flex max-h-[85vh] w-full flex-col rounded-t-2xl border-t border-slate-200 bg-white p-5 transition-transform duration-300 dark:border-white/10 dark:bg-[#202024]',
          className,
        )}
      >
        {/* Grab Handle */}
        <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-slate-300 dark:bg-zinc-600" />

        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          {title && (
            <h3 className="text-base font-medium tracking-tight text-slate-900 dark:text-zinc-100">
              {title}
            </h3>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close sheet"
            className="ml-auto flex min-h-[44px] min-w-[44px] items-center justify-center text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
