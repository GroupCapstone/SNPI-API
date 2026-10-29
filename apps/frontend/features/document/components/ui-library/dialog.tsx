'use client';

import * as React from 'react';
import { X } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface LibraryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isDestructive?: boolean;
}

export function LibraryDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  isDestructive = false,
}: LibraryDialogProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => onOpenChange(false)}
        aria-hidden="true"
      />

      {/* Dialog Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className="relative z-50 w-full max-w-lg rounded-2xl border border-white/10 bg-[#202024] p-6 text-zinc-100 shadow-none transition-all"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
            {description && (
              <p className="mt-1 text-xs text-zinc-400">{description}</p>
            )}
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close dialog"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-zinc-400 hover:text-zinc-100"
          >
            <X className="size-4" />
          </button>
        </div>

        {children && <div className="mt-4">{children}</div>}

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="min-h-[44px] rounded-lg border border-white/10 bg-[#161619] px-4 text-xs font-normal text-zinc-300 hover:bg-[#2E2E33]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className={cn(
              'min-h-[44px] rounded-lg px-4 text-xs font-medium text-white transition-colors',
              isDestructive
                ? 'bg-rose-500 hover:bg-rose-600'
                : 'bg-emerald-500 hover:bg-emerald-600',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
