'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { X, Check, CircleAlert, ShieldAlert, Layers, ArrowRight } from '@/components/icons';

// 08 Open Stack: Global reference-counted modal stack
const openModalStack: string[] = [];
let originalBodyOverflow = '';
let originalBodyPaddingRight = '';

function pushModalToStack(id: string) {
  if (openModalStack.length === 0) {
    // 05 Scroll Lock: Calculate scrollbar width to prevent layout shift
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    originalBodyOverflow = document.body.style.overflow;
    originalBodyPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }
  openModalStack.push(id);
}

function popModalFromStack(id: string) {
  const index = openModalStack.lastIndexOf(id);
  if (index !== -1) {
    openModalStack.splice(index, 1);
  }
  if (openModalStack.length === 0) {
    // Restore original body styles
    document.body.style.overflow = originalBodyOverflow;
    document.body.style.paddingRight = originalBodyPaddingRight;
  }
}

function isTopmostModal(id: string): boolean {
  return openModalStack.length > 0 && openModalStack[openModalStack.length - 1] === id;
}

export interface ModalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm?: () => void;
  isDestructive?: boolean;
  theme?: 'light' | 'dark';
  className?: string;
}

/**
 * ModalDialog
 *
 * Implements the 8-pillar accessible modal dialog architecture:
 * 01 Trigger Button: Focus restored to opener stored as document.activeElement on open.
 * 02 Backdrop Overlay: Dimmed, blurred layer; direct backdrop clicks dismiss.
 * 03 Dialog Container: role="dialog" with aria-modal="true", labelledby & describedby.
 * 04 Focus Trap: Tab & Shift+Tab cycle exclusively among dialog's focusable elements.
 * 05 Scroll Lock: Background scrolling disabled with scrollbar-width compensation.
 * 06 Close Affordances: Header × button, any [data-md-close] element, Escape, and backdrop.
 * 07 Focus Restoration: On close, focus() called on opener so user returns to previous place.
 * 08 Open Stack: Stacked dialogs reference-counted so Escape closes only topmost.
 */
export function ModalDialog({
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  onConfirm,
  isDestructive = false,
  theme = 'light',
  className,
}: ModalDialogProps) {
  const isDark = theme === 'dark';
  const modalId = React.useId();
  const titleId = `dialog-title-${modalId}`;
  const descId = `dialog-desc-${modalId}`;

  const dialogRef = React.useRef<HTMLDivElement>(null);
  // 01 Trigger Button: Store opener element for 07 Focus Restoration
  const openerRef = React.useRef<HTMLElement | null>(null);

  // Manage Open Stack, Scroll Lock, and Opener element
  React.useEffect(() => {
    if (open) {
      openerRef.current = document.activeElement as HTMLElement;
      pushModalToStack(modalId);
    } else {
      popModalFromStack(modalId);
      // 07 Focus Restoration
      openerRef.current?.focus();
    }

    return () => {
      if (open) {
        popModalFromStack(modalId);
      }
    };
  }, [open, modalId]);

  // 04 Focus Trap: Initial focus on first focusable element
  React.useEffect(() => {
    if (!open) return;

    const timer = setTimeout(() => {
      if (!dialogRef.current) return;
      const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusables.length > 0) {
        focusables[0].focus();
      } else {
        dialogRef.current.focus();
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [open]);

  // 04 Focus Trap Keydown (Tab cycling & Escape to close topmost)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // 06 Escape key dismisses only if topmost modal in stack
    if (e.key === 'Escape') {
      if (isTopmostModal(modalId)) {
        e.preventDefault();
        e.stopPropagation();
        onOpenChange(false);
      }
      return;
    }

    // 04 Focus Trap wrapping
    if (e.key === 'Tab') {
      if (!dialogRef.current) return;
      const focusables = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );

      if (focusables.length === 0) {
        e.preventDefault();
        return;
      }

      const firstElement = focusables[0];
      const lastElement = focusables[focusables.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  // 06 Close Affordances: Event delegation for any [data-md-close] click
  const handleDialogContentClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('[data-md-close]')) {
      onOpenChange(false);
    }
  };

  // 02 Backdrop Overlay click (dismiss only if clicking directly on backdrop)
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && isTopmostModal(modalId)) {
      onOpenChange(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm transition-opacity duration-200"
    >
      {/* ======================================================== */}
      {/* 03 DIALOG CONTAINER: role="dialog", aria-modal="true"     */}
      {/* ======================================================== */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        tabIndex={-1}
        onClick={handleDialogContentClick}
        className={cn(
          'relative w-full max-w-lg overflow-hidden rounded-2xl border p-6 shadow-2xl transition-all duration-200 outline-none',
          isDark
            ? 'border-slate-800 bg-[#000B26] text-slate-100 shadow-cyan-950/20'
            : 'border-slate-200/90 bg-white text-slate-900 shadow-slate-900/15',
          className,
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4 dark:border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex size-6 items-center justify-center rounded-lg border text-xs',
                  isDestructive
                    ? 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                    : 'border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF] dark:border-cyan-500/30 dark:bg-cyan-500/15 dark:text-cyan-400',
                )}
              >
                {isDestructive ? (
                  <CircleAlert className="size-3.5" />
                ) : (
                  <Layers className="size-3.5" />
                )}
              </span>
              <h3
                id={titleId}
                className="font-sans text-base font-bold tracking-tight text-slate-950 sm:text-lg dark:text-white"
              >
                {title}
              </h3>
            </div>

            {description && (
              <p
                id={descId}
                className="font-sans text-xs leading-relaxed text-slate-500 dark:text-slate-400"
              >
                {description}
              </p>
            )}
          </div>

          {/* 06 Close Affordance: Header × button */}
          <button
            type="button"
            data-md-close
            aria-label="Close dialog"
            className={cn(
              'flex size-8 shrink-0 items-center justify-center rounded-lg border transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-[#0056FF]',
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-400 hover:text-white'
                : 'border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-900',
            )}
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Dialog Body Content */}
        {children && <div className="py-4 font-sans text-xs">{children}</div>}

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4 dark:border-slate-800">
          {/* Cancel button with data-md-close */}
          <button
            type="button"
            data-md-close
            className={cn(
              'rounded-xl border px-3.5 py-2 font-mono text-xs font-bold transition-colors outline-none',
              'focus-visible:ring-2 focus-visible:ring-[#0056FF]',
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50',
            )}
          >
            {cancelLabel}
          </button>

          {/* Confirm button */}
          <button
            type="button"
            onClick={() => {
              onConfirm?.();
              onOpenChange(false);
            }}
            className={cn(
              'flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-all outline-none',
              'focus-visible:ring-2 focus-visible:ring-offset-2',
              isDestructive
                ? 'bg-red-600 hover:bg-red-700 focus-visible:ring-red-500'
                : 'bg-[#0056FF] hover:bg-blue-700 focus-visible:ring-[#0056FF]',
            )}
          >
            <Check className="size-3.5 stroke-[2.5]" />
            <span>{confirmLabel}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ModalDialogDemo
 *
 * Interactive documentation library preview showcasing two dialog instances:
 * 1. Primary Action Confirmation Dialog
 * 2. Nested / Stacked Sub-Dialog demonstrating Open Stack reference-counting & focus trap.
 */
export function ModalDialogDemo() {
  const [parentOpen, setParentOpen] = React.useState<boolean>(false);
  const [nestedOpen, setNestedOpen] = React.useState<boolean>(false);
  const [lastAction, setLastAction] = React.useState<string | null>(null);

  return (
    <div className="w-full space-y-6">

      {/* Live In-Stage Modal Dialog Surface (Say Less Show More Result - Never Hidden) */}
      <div className="w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-6 text-left shadow-md">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="font-sans text-sm font-bold text-slate-900">
              Commit ACID Ledger Transaction
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Verify cryptographic hash commitments for candidate term enrollment batch TX-842910.
            </p>
          </div>
          <span className="rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
            ACTIVE
          </span>
        </div>
        <div className="mt-4 space-y-3">
          <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">BATCH TX:</span>
              <span className="font-bold text-[#0056FF]">sha256:7f8a92e4b102</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ENROLLED CANDIDATES:</span>
              <span className="font-bold text-slate-900">48 Students</span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setLastAction('Ledger Commit Cancelled')}
              className="rounded-[4px] border border-slate-200 bg-white px-3 py-1.5 font-sans text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => setLastAction('ACID Ledger TX-842910 Committed')}
              className="rounded-[4px] bg-[#0056FF] px-3.5 py-1.5 font-sans text-xs font-bold text-white hover:bg-blue-700"
            >
              Commit Batch
            </button>
          </div>
        </div>
      </div>

      {/* Two Instances Trigger Showcase */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Instance 1: Primary Confirmation Dialog */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
              Instance 01 &middot; Primary Dialog
            </span>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              Commit Ledger Transaction
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Open the dialog, press Tab to test the circular focus trap, Esc to close, or click
              backdrop.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setParentOpen(true)}
            className="flex items-center gap-2 rounded-xl bg-[#0056FF] px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
          >
            <span>OPEN LEDGER CONFIRMATION</span>
            <ArrowRight className="size-3.5" />
          </button>
        </div>

        {/* Instance 2: Direct Authorization Dialog */}
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-colors">
          <div className="space-y-1">
            <span className="font-mono text-[10px] font-bold tracking-wider text-amber-600 uppercase">
              Instance 02 &middot; Security Override
            </span>
            <h4 className="font-sans text-xs font-bold text-slate-900">
              Root Authority Key Rotation
            </h4>
            <p className="font-sans text-xs text-slate-500">
              Directly tests destructive action handling, scrollbar-width compensation, and focus
              return.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setNestedOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 font-mono text-xs font-bold text-red-600 transition-colors hover:bg-red-500/20"
          >
            <ShieldAlert className="size-3.5" />
            <span>OPEN SECURITY OVERRIDE</span>
          </button>
        </div>
      </div>

      {/* Action Execution Indicator */}
      {lastAction && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center font-mono text-xs font-bold text-emerald-600">
          Action Executed: {lastAction}
        </div>
      )}

      {/* ======================================================== */}
      {/* DIALOG 1: Ledger Confirmation (Can open nested dialog)   */}
      {/* ======================================================== */}
      <ModalDialog
        open={parentOpen}
        onOpenChange={setParentOpen}
        title="Commit ACID Ledger Transaction"
        description="Verify cryptographic hash commitments for candidate term enrollment batch TX-842910."
        confirmLabel="Commit Batch"
        onConfirm={() => setLastAction('ACID Ledger TX-842910 Committed')}
        theme="light"
      >
        <div className="space-y-3">
          <div className="space-y-1 rounded-xl border border-slate-200 bg-slate-50 p-3 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">BATCH TX:</span>
              <span className="font-bold text-[#0056FF]">
                sha256:7f8a92e4b102
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">ENROLLED CANDIDATES:</span>
              <span className="font-bold">48 Students</span>
            </div>
          </div>

          {/* Button to test 08 Open Stack: Opens nested dialog on top */}
          <div className="pt-1">
            <button
              type="button"
              onClick={() => setNestedOpen(true)}
              className="flex items-center gap-1.5 font-mono text-xs font-bold text-[#0056FF] hover:underline"
            >
              <span>Need elevated security authorization? Open sub-dialog</span>
              <ArrowRight className="size-3" />
            </button>
          </div>
        </div>
      </ModalDialog>

      {/* ======================================================== */}
      {/* DIALOG 2: Nested / Stacked Security Override Dialog      */}
      {/* ======================================================== */}
      <ModalDialog
        open={nestedOpen}
        onOpenChange={setNestedOpen}
        title="Elevated Security Authority Override"
        description="This action requires multi-sig cryptographic authorization before commits are finalized."
        confirmLabel="Authorize Override"
        cancelLabel="Dismiss"
        isDestructive={true}
        onConfirm={() => setLastAction('Security Authority Override Approved')}
        theme="light"
      >
        <div className="space-y-3">
          <p className="font-sans text-xs text-slate-500">
            Pressing{' '}
            <kbd className="font-mono font-bold text-slate-800">Escape</kbd>{' '}
            right now will close <em>only this nested dialog</em> while preserving the parent dialog
            beneath it.
          </p>

          <input
            type="password"
            placeholder="Enter supervisor PIN..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 font-mono text-xs text-slate-900 placeholder-slate-400 transition-colors outline-none focus:border-[#0056FF]"
          />
        </div>
      </ModalDialog>
    </div>
  );
}
