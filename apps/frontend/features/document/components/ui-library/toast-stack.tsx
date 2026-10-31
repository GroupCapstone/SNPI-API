'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Check,
  CircleAlert,
  TriangleAlert,
  Info,
  X,
  Layers,
  Sparkles,
  RotateCcw,
  Play,
  Pause,
} from '@/components/icons';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number; // Duration in milliseconds (default 4000)
}

export interface ToastItemData {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration: number;
  createdAt: number;
}

type ToastListener = (toasts: ToastItemData[]) => void;

// ============================================================================
// 08 PROGRAMMATIC API: Singleton Toast Manager & Event Store
// ============================================================================

class ToastManager {
  private toasts: ToastItemData[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 5; // 01 Toast Container: Max 5 toasts with automatic overflow
  private counter = 0;

  private notify() {
    const copy = [...this.toasts];
    this.listeners.forEach((listener) => listener(copy));
  }

  public subscribe(listener: ToastListener): () => void {
    this.listeners.add(listener);
    listener([...this.toasts]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public show(message: string, type: ToastType = 'info', options?: ToastOptions): string {
    const id = `toast-${++this.counter}-${Date.now().toString(36)}`;
    const duration = options?.duration ?? 4000;

    const newToast: ToastItemData = {
      id,
      message,
      title: options?.title,
      type,
      duration,
      createdAt: Date.now(),
    };

    // 01 Overflow management: if at capacity, dismiss oldest first
    if (this.toasts.length >= this.maxToasts) {
      this.toasts = this.toasts.slice(1);
    }

    this.toasts = [...this.toasts, newToast];
    this.notify();
    return id;
  }

  public success(message: string, options?: ToastOptions): string {
    return this.show(message, 'success', options);
  }

  public error(message: string, options?: ToastOptions): string {
    return this.show(message, 'error', options);
  }

  public warning(message: string, options?: ToastOptions): string {
    return this.show(message, 'warning', options);
  }

  public info(message: string, options?: ToastOptions): string {
    return this.show(message, 'info', options);
  }

  public dismiss(id: string): void {
    this.toasts = this.toasts.filter((t) => t.id !== id);
    this.notify();
  }

  public dismissAll(): void {
    this.toasts = [];
    this.notify();
  }

  public getToasts(): ToastItemData[] {
    return [...this.toasts];
  }
}

export const toast = new ToastManager();

export function useToast() {
  const [toasts, setToasts] = React.useState<ToastItemData[]>([]);

  React.useEffect(() => {
    return toast.subscribe(setToasts);
  }, []);

  return {
    toasts,
    toast,
    dismiss: (id: string) => toast.dismiss(id),
    dismissAll: () => toast.dismissAll(),
  };
}

// ============================================================================
// 02 TYPE VARIANTS & 03 ICON SYSTEM
// ============================================================================

const VARIANT_CONFIG: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string; size?: number | string }>;
    label: string;
    light: {
      border: string;
      bg: string;
      text: string;
      badgeBg: string;
      badgeText: string;
      progress: string;
      iconColor: string;
    };
    dark: {
      border: string;
      bg: string;
      text: string;
      badgeBg: string;
      badgeText: string;
      progress: string;
      iconColor: string;
    };
  }
> = {
  success: {
    icon: Check,
    label: 'SUCCESS',
    light: {
      border: 'border-emerald-200 shadow-emerald-500/10',
      bg: 'bg-white',
      text: 'text-slate-900',
      badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
      badgeText: 'text-emerald-700',
      progress: 'bg-emerald-500',
      iconColor: 'text-emerald-600',
    },
    dark: {
      border: 'border-emerald-500/30 shadow-emerald-950/30',
      bg: 'bg-[#000E26]',
      text: 'text-slate-100',
      badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
      badgeText: 'text-emerald-400',
      progress: 'bg-emerald-400',
      iconColor: 'text-emerald-400',
    },
  },
  error: {
    icon: CircleAlert,
    label: 'ERROR',
    light: {
      border: 'border-rose-200 shadow-rose-500/10',
      bg: 'bg-white',
      text: 'text-slate-900',
      badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
      badgeText: 'text-rose-700',
      progress: 'bg-rose-500',
      iconColor: 'text-rose-600',
    },
    dark: {
      border: 'border-rose-500/30 shadow-rose-950/30',
      bg: 'bg-[#000E26]',
      text: 'text-slate-100',
      badgeBg: 'bg-rose-500/15 border-rose-500/30 text-rose-400',
      badgeText: 'text-rose-400',
      progress: 'bg-rose-400',
      iconColor: 'text-rose-400',
    },
  },
  warning: {
    icon: TriangleAlert,
    label: 'WARNING',
    light: {
      border: 'border-amber-200 shadow-amber-500/10',
      bg: 'bg-white',
      text: 'text-slate-900',
      badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
      badgeText: 'text-amber-700',
      progress: 'bg-amber-500',
      iconColor: 'text-amber-600',
    },
    dark: {
      border: 'border-amber-500/30 shadow-amber-950/30',
      bg: 'bg-[#000E26]',
      text: 'text-slate-100',
      badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
      badgeText: 'text-amber-400',
      progress: 'bg-amber-400',
      iconColor: 'text-amber-400',
    },
  },
  info: {
    icon: Info,
    label: 'INFO',
    light: {
      border: 'border-blue-200 shadow-blue-500/10',
      bg: 'bg-white',
      text: 'text-slate-900',
      badgeBg: 'bg-[#E3E7FC] border-[#CAD3F5] text-[#0056FF]',
      badgeText: 'text-[#0056FF]',
      progress: 'bg-[#0056FF]',
      iconColor: 'text-[#0056FF]',
    },
    dark: {
      border: 'border-cyan-500/30 shadow-cyan-950/30',
      bg: 'bg-[#000E26]',
      text: 'text-slate-100',
      badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400',
      badgeText: 'text-cyan-400',
      progress: 'bg-cyan-400',
      iconColor: 'text-cyan-400',
    },
  },
};

// ============================================================================
// TOAST CARD ITEM (04 Progress, 05 Enter, 06 Exit, 07 Hover Pause)
// ============================================================================

interface ToastCardProps {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
  theme?: 'light' | 'dark';
}

function ToastCard({ toast: item, onDismiss, theme = 'light' }: ToastCardProps) {
  const isDark = theme === 'dark';
  const config = VARIANT_CONFIG[item.type];
  const IconComponent = config.icon;
  const colors = isDark ? config.dark : config.light;

  // Animation states: 05 Enter Animation & 06 Two-Phase Exit & Collapse
  // 'entering' -> 'idle' -> 'exiting' (fade-slide) -> 'collapsing' (height collapse)
  const [phase, setPhase] = React.useState<'entering' | 'idle' | 'exiting' | 'collapsing'>(
    'entering',
  );

  // 07 Hover Pause: Tracking remaining time and hover state
  const [isHovered, setIsHovered] = React.useState(false);
  const [remainingTime, setRemainingTime] = React.useState(item.duration);
  const lastTickRef = React.useRef<number>(0);
  const [itemHeight, setItemHeight] = React.useState<number>(84);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Measure initial natural height for smooth Phase 2 collapse
  React.useEffect(() => {
    if (cardRef.current) {
      setItemHeight(cardRef.current.offsetHeight || 84);
    }
  }, []);

  // 05 Enter Animation: Trigger transition from right on mount
  React.useEffect(() => {
    const enterTimer = requestAnimationFrame(() => {
      setPhase('idle');
    });
    return () => cancelAnimationFrame(enterTimer);
  }, []);

  // 06 Exit & Collapse: Two-phase removal sequence
  const triggerExit = React.useCallback(() => {
    if (phase === 'exiting' || phase === 'collapsing') return;
    setPhase('exiting'); // Phase 1: fade-slide out (200ms)

    setTimeout(() => {
      setPhase('collapsing'); // Phase 2: height collapse (200ms)
      setTimeout(() => {
        onDismiss(item.id);
      }, 220);
    }, 200);
  }, [phase, onDismiss, item.id]);

  // 04 Progress Bar & 07 Hover Pause timer loop
  React.useEffect(() => {
    if (phase === 'exiting' || phase === 'collapsing') return;

    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (isHovered) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setRemainingTime((prev) => {
        const next = prev - delta;
        if (next <= 0) {
          triggerExit();
          return 0;
        }
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isHovered, phase, triggerExit]);

  // Percentage for 04 Progress Bar strip
  const progressPercent = Math.max(0, Math.min(100, (remainingTime / item.duration) * 100));

  return (
    <div
      style={{
        maxHeight: phase === 'collapsing' ? '0px' : `${itemHeight + 20}px`,
        opacity: phase === 'exiting' ? 0 : phase === 'entering' ? 0 : 1,
        transform:
          phase === 'entering'
            ? 'translateX(100%) scale(0.92)'
            : phase === 'exiting'
              ? 'translateX(40px) scale(0.96)'
              : 'translateX(0) scale(1)',
        marginBottom: phase === 'collapsing' ? '0px' : '10px',
        paddingTop: phase === 'collapsing' ? '0px' : undefined,
        paddingBottom: phase === 'collapsing' ? '0px' : undefined,
        transition:
          phase === 'collapsing'
            ? 'max-height 220ms cubic-bezier(0.4, 0, 0.2, 1), margin-bottom 220ms ease, opacity 200ms ease'
            : phase === 'entering'
              ? 'all 320ms cubic-bezier(0.175, 0.885, 0.32, 1.15)'
              : 'all 200ms ease-in-out',
      }}
      className="pointer-events-auto w-full overflow-hidden transition-all duration-200"
    >
      <div
        ref={cardRef}
        role="status"
        aria-live="polite"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-[4px] border p-4 shadow-lg backdrop-blur-md transition-all',
          colors.border,
          colors.bg,
          colors.text,
        )}
      >
        <div className="flex items-start gap-3">
          {/* 03 Icon System: Bare icon with zero background container */}
          <div className="mt-0.5 flex shrink-0 items-center justify-center">
            <IconComponent size={18} className={cn('stroke-[2.2]', colors.iconColor)} />
          </div>

          {/* Toast Message & Title */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'rounded-[4px] border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase',
                  colors.badgeBg,
                )}
              >
                {config.label}
              </span>
              {item.title && (
                <h4 className="truncate font-sans text-xs font-bold tracking-tight text-slate-900">
                  {item.title}
                </h4>
              )}
            </div>
            <p className="font-sans text-xs leading-relaxed text-slate-600">
              {item.message}
            </p>
          </div>

          {/* Manual Close Button (>= 32px touch target) */}
          <button
            type="button"
            onClick={triggerExit}
            aria-label="Dismiss notification"
            className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-200 bg-white text-slate-500 hover:text-slate-900 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#0056FF]"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* 07 Hover Pause Badge indicator */}
        {isHovered && (
          <div className="mt-2 flex items-center gap-1.5 font-mono text-[10px] font-bold text-amber-500">
            <Pause className="size-3" />
            <span>PAUSED (HOVER)</span>
          </div>
        )}

        {/* 04 Progress Bar: 2px countdown strip */}
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] w-full bg-slate-200/50 dark:bg-slate-800">
          <div
            className={cn('h-full transition-all duration-75', colors.progress)}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 01 TOAST CONTAINER COMPONENT
// ============================================================================

export interface ToastContainerProps {
  toasts?: ToastItemData[];
  onDismiss?: (id: string) => void;
  theme?: 'light' | 'dark';
  position?: 'fixed' | 'inline';
  className?: string;
}

export function ToastContainer({
  toasts: externalToasts,
  onDismiss: externalDismiss,
  theme = 'light',
  position = 'fixed',
  className,
}: ToastContainerProps) {
  const hook = useToast();
  const activeToasts = externalToasts ?? hook.toasts;
  const handleDismiss = externalDismiss ?? hook.dismiss;

  const positionClasses =
    position === 'fixed'
      ? 'fixed top-4 right-4 z-50 pointer-events-none w-full max-w-sm'
      : 'absolute top-4 right-4 z-30 pointer-events-none w-full max-w-sm';

  return (
    <div aria-label="Notifications" className={cn(positionClasses, 'flex flex-col', className)}>
      {activeToasts.map((t) => (
        <ToastCard key={t.id} toast={t} onDismiss={handleDismiss} theme={theme} />
      ))}
    </div>
  );
}

// ============================================================================
// INTERACTIVE DOCUMENTATION DEMO: ToastStackDemo
// ============================================================================

export function ToastStackDemo() {
  const [containerMode, setContainerMode] = React.useState<'inline' | 'fixed'>('inline');
  const { toasts, dismiss, dismissAll } = useToast();

  const fireSuccess = () => {
    toast.success('Batch transaction TX-9204 committed to MongoDB replica set.', {
      title: 'Ledger Hash Verified',
      duration: 4500,
    });
  };

  const fireError = () => {
    toast.error('Constant-time HMAC signature check failed for gateway request.', {
      title: 'Security Token Rejected',
      duration: 5000,
    });
  };

  const fireWarning = () => {
    toast.warning('Admission query volume at 88% of tenant burst limit.', {
      title: 'Rate Limit Threshold',
      duration: 4000,
    });
  };

  const fireInfo = () => {
    toast.info('Synchronized 47 domain modules with institutional schema contracts.', {
      title: 'Changelog Real-Time Sync',
      duration: 4000,
    });
  };

  const fireRapidBurst = () => {
    toast.success('Student candidate account generated with initial credentials.', {
      title: 'Candidate Created (1/5)',
      duration: 5000,
    });
    setTimeout(() => {
      toast.info('Verification email queued to campus mail routing worker.', {
        title: 'Dispatch Queued (2/5)',
        duration: 5000,
      });
    }, 150);
    setTimeout(() => {
      toast.warning('Guardian phone number requires country prefix normalization.', {
        title: 'Format Alert (3/5)',
        duration: 5000,
      });
    }, 300);
    setTimeout(() => {
      toast.error('Tuition fee concession waiver expired on 2026-10-15.', {
        title: 'Concession Expired (4/5)',
        duration: 5000,
      });
    }, 450);
    setTimeout(() => {
      toast.success('Cryptographic identity passbook minted on branch ledger.', {
        title: 'Passbook Ready (5/5)',
        duration: 5000,
      });
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Control Bar: Position Mode */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-4">
          {/* Container placement mode */}
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
              Placement:
            </span>
            <button
              type="button"
              onClick={() => setContainerMode('inline')}
              className={cn(
                'rounded-[4px] px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
                containerMode === 'inline'
                  ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900',
              )}
            >
              In-Demo Sandbox
            </button>
            <button
              type="button"
              onClick={() => setContainerMode('fixed')}
              className={cn(
                'rounded-[4px] px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
                containerMode === 'fixed'
                  ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900',
              )}
            >
              Screen Viewport Fixed
            </button>
          </div>
        </div>

        {/* Active Queue Status Counter */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="text-slate-400">STACK:</span>
          <span
            className={cn(
              'rounded-[4px] px-2 py-0.5 font-bold',
              toasts.length > 0
                ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                : 'border border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-800 dark:bg-slate-900',
            )}
          >
            {toasts.length} / 5 Active
          </span>
          {toasts.length > 0 && (
            <button
              type="button"
              onClick={dismissAll}
              className="flex items-center gap-1 rounded-[4px] border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400 dark:hover:text-red-400"
            >
              <RotateCcw className="size-3" />
              <span>Dismiss All</span>
            </button>
          )}
        </div>
      </div>

      {/* Interactive Trigger Control Board */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Fire Success */}
        <button
          type="button"
          onClick={fireSuccess}
          className="flex flex-col items-start gap-1 rounded-[4px] border border-emerald-500/30 bg-emerald-500/5 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-[0.98]"
        >
          <Check className="size-5 stroke-[2.5] text-emerald-600" />
          <span className="mt-1 font-mono text-xs font-bold text-emerald-700">
            Success Toast
          </span>
          <span className="font-sans text-[11px] text-slate-500">Form save & commit</span>
        </button>

        {/* Fire Error */}
        <button
          type="button"
          onClick={fireError}
          className="flex flex-col items-start gap-1 rounded-[4px] border border-rose-500/30 bg-rose-500/5 p-4 text-left transition-all hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-[0.98]"
        >
          <CircleAlert className="size-5 stroke-[2.5] text-rose-600" />
          <span className="mt-1 font-mono text-xs font-bold text-rose-700">
            Error Toast
          </span>
          <span className="font-sans text-[11px] text-slate-500">Security failure cue</span>
        </button>

        {/* Fire Warning */}
        <button
          type="button"
          onClick={fireWarning}
          className="flex flex-col items-start gap-1 rounded-[4px] border border-amber-500/30 bg-amber-500/5 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-[0.98]"
        >
          <TriangleAlert className="size-5 stroke-[2.5] text-amber-600" />
          <span className="mt-1 font-mono text-xs font-bold text-amber-700">
            Warning Toast
          </span>
          <span className="font-sans text-[11px] text-slate-500">Rate limit threshold</span>
        </button>

        {/* Fire Info */}
        <button
          type="button"
          onClick={fireInfo}
          className="flex flex-col items-start gap-1 rounded-[4px] border border-blue-500/30 bg-blue-500/5 p-4 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/10 active:scale-[0.98]"
        >
          <Info className="size-5 stroke-[2.5] text-[#0056FF]" />
          <span className="mt-1 font-mono text-xs font-bold text-[#0056FF]">
            Info Toast
          </span>
          <span className="font-sans text-[11px] text-slate-500">Background event sync</span>
        </button>
      </div>

      {/* Rapid Burst Action & Feature Showcase */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-slate-200/80 bg-slate-50/60 p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
            <Sparkles className="size-3.5 text-[#0056FF]" />
            <span>01 Container Overflow Demonstration</span>
          </div>
          <p className="font-sans text-xs text-slate-500">
            Fires 5 sequential notifications with short offsets to test maximum stack bounds, height
            collapse, and auto-dismiss.
          </p>
        </div>

        <button
          type="button"
          onClick={fireRapidBurst}
          className="flex items-center gap-2 rounded-[4px] bg-[#0056FF] px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700"
        >
          <Play className="size-3.5" />
          <span>FIRE RAPID BURST (5 TOASTS)</span>
        </button>
      </div>

      {/* Interactive Preview Canvas with Toast Container */}
      <div className="relative min-h-[360px] w-full overflow-hidden max-sm:rounded-none max-sm:border-y max-sm:border-x-0 sm:rounded-2xl sm:border border-slate-200 bg-slate-50/50 p-6 shadow-inner transition-colors">
        <div className="max-w-md space-y-3">
          <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
            Sandbox Viewport &middot; Hover To Freeze Countdown
          </span>
          <h3 className="font-sans text-base font-bold text-slate-900">
            Live Stacked Notification Canvas
          </h3>
          <p className="font-sans text-xs leading-relaxed text-slate-500">
            Hover any toast to freeze its 2px progress bar strip and countdown timer. Toasts enter
            with a spring-bounce slide from the right and exit via two-phase fade-slide followed by
            height collapse.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px] text-slate-500">
            <span className="rounded-[4px] border border-slate-200 bg-white px-2 py-0.5">
              01 Top-Right Stack
            </span>
            <span className="rounded-[4px] border border-slate-200 bg-white px-2 py-0.5">
              04 Progress Strip
            </span>
            <span className="rounded-[4px] border border-slate-200 bg-white px-2 py-0.5">
              06 Two-Phase Exit
            </span>
            <span className="rounded-[4px] border border-slate-200 bg-white px-2 py-0.5">
              07 Hover Freeze
            </span>
          </div>
        </div>

        {/* The Toast Stack Container (Inline in demo or Fixed viewport) */}
        <ToastContainer
          theme="light"
          position={containerMode}
          toasts={toasts}
          onDismiss={dismiss}
        />
      </div>
    </div>
  );
}
