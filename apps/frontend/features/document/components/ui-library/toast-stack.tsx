'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Undo2,
} from '@/components/icons';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface ToastOptions {
  title?: string;
  duration?: number; // Duration in milliseconds (default 5000)
  action?: ToastAction;
}

export interface ToastItemData {
  id: string;
  message: string;
  title?: string;
  type: ToastType;
  duration: number;
  createdAt: number;
  action?: ToastAction;
}

type ToastListener = (toasts: ToastItemData[]) => void;

// ============================================================================
// PROGRAMMATIC API: Singleton Toast Manager & Event Store
// ============================================================================

class ToastManager {
  private toasts: ToastItemData[] = [];
  private listeners: Set<ToastListener> = new Set();
  private maxToasts = 5; // Stack capacity: Max 5 toasts with automatic overflow
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
    const duration = options?.duration ?? 5000;

    const newToast: ToastItemData = {
      id,
      message,
      title: options?.title,
      type,
      duration,
      createdAt: Date.now(),
      action: options?.action,
    };

    // Overflow management: if at capacity, dismiss oldest first
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
// BRAND PALETTE TYPE CONFIGURATION (STRICT LIGHT DAY MODE)
// ============================================================================

const VARIANT_CONFIG: Record<
  ToastType,
  {
    icon: React.ComponentType<{ className?: string; size?: number | string }>;
    label: string;
    badgeBg: string;
    badgeText: string;
    progressBar: string;
    iconColor: string;
    accentBorder: string;
  }
> = {
  success: {
    icon: Check,
    label: 'SUCCESS',
    badgeBg: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    badgeText: 'text-emerald-700',
    progressBar: 'bg-emerald-500',
    iconColor: 'text-emerald-600',
    accentBorder: 'border-emerald-200',
  },
  error: {
    icon: CircleAlert,
    label: 'ERROR',
    badgeBg: 'bg-rose-50 border-rose-200 text-rose-700',
    badgeText: 'text-rose-700',
    progressBar: 'bg-rose-500',
    iconColor: 'text-rose-600',
    accentBorder: 'border-rose-200',
  },
  warning: {
    icon: TriangleAlert,
    label: 'WARNING',
    badgeBg: 'bg-amber-50 border-amber-200 text-amber-700',
    badgeText: 'text-amber-700',
    progressBar: 'bg-amber-500',
    iconColor: 'text-amber-600',
    accentBorder: 'border-amber-200',
  },
  info: {
    icon: Info,
    label: 'INFO',
    badgeBg: 'bg-[#E3E7FC] border-[#CAD3F5] text-[#0056FF]',
    badgeText: 'text-[#0056FF]',
    progressBar: 'bg-[#0056FF]',
    iconColor: 'text-[#0056FF]',
    accentBorder: 'border-[#CAD3F5]',
  },
};

// ============================================================================
// TOAST CARD (With Linear Countdown Bar, Undo Action & Auto-Dismissal)
// ============================================================================

interface ToastCardProps {
  toast: ToastItemData;
  onDismiss: (id: string) => void;
  index: number;
  total: number;
  isExpanded: boolean;
  containerHovered: boolean;
}

function ToastCard({
  toast: item,
  onDismiss,
  index,
  total,
  isExpanded,
  containerHovered,
}: ToastCardProps) {
  const config = VARIANT_CONFIG[item.type];
  const IconComponent = config.icon;

  // Countdown timer state
  const [remainingTime, setRemainingTime] = React.useState(item.duration);
  const [isSelfHovered, setIsSelfHovered] = React.useState(false);
  const lastTickRef = React.useRef<number>(0);

  // Freeze countdown when hovered individually OR when the stack is hovered/expanded
  const isPaused = isSelfHovered || containerHovered;

  React.useEffect(() => {
    lastTickRef.current = Date.now();
    const interval = setInterval(() => {
      if (isPaused) {
        lastTickRef.current = Date.now();
        return;
      }

      const now = Date.now();
      const delta = now - lastTickRef.current;
      lastTickRef.current = now;

      setRemainingTime((prev) => {
        const next = prev - delta;
        if (next <= 0) {
          onDismiss(item.id);
          return 0;
        }
        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [isPaused, onDismiss, item.id]);

  const progressPercent = Math.max(0, Math.min(100, (remainingTime / item.duration) * 100));

  // Stack calculation (Sonner / iOS notification stack physics)
  // When collapsed: front card is at y=0, older cards peek out above with negative Y offsets
  const stackOffset = -index * 12;
  const stackScale = 1 - index * 0.04;
  const stackOpacity = index > 3 ? 0 : 1 - index * 0.12;
  const stackZIndex = 50 - index;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30, scale: 0.92 }}
      animate={{
        opacity: isExpanded ? 1 : stackOpacity,
        y: isExpanded ? 0 : stackOffset,
        scale: isExpanded ? 1 : stackScale,
        zIndex: stackZIndex,
      }}
      exit={{ opacity: 0, y: -20, scale: 0.9, transition: { duration: 0.18 } }}
      transition={{
        type: 'spring',
        stiffness: 420,
        damping: 32,
        mass: 0.8,
      }}
      style={{
        position: isExpanded ? 'relative' : index === 0 ? 'relative' : 'absolute',
        bottom: isExpanded ? undefined : 0,
        left: isExpanded ? undefined : 0,
        right: isExpanded ? undefined : 0,
      }}
      onMouseEnter={() => setIsSelfHovered(true)}
      onMouseLeave={() => setIsSelfHovered(false)}
      className="pointer-events-auto w-full select-none"
    >
      <div
        role="status"
        aria-live="polite"
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-2xl border border-[#CAD3F5] bg-white p-4',
          'shadow-[0_10px_25px_-5px_rgba(0,86,255,0.08),_0_8px_10px_-6px_rgba(0,0,0,0.04)]',
          'transition-shadow duration-200 hover:shadow-[0_16px_32px_-6px_rgba(0,86,255,0.14)]',
        )}
      >
        {/* Card Header & Content */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            {/* Visual Icon */}
            <div className="mt-0.5 flex size-5 shrink-0 items-center justify-center">
              <IconComponent size={18} className={cn('stroke-[2.4]', config.iconColor)} />
            </div>

            {/* Message Body */}
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center gap-2">
                <h4 className="truncate font-sans text-sm font-bold tracking-tight text-slate-900">
                  {item.title || (item.type === 'info' ? 'Notification' : config.label)}
                </h4>
                <span
                  className={cn(
                    'rounded-md border px-1.5 py-0.2 font-mono text-[9px] font-bold tracking-wider uppercase',
                    config.badgeBg,
                  )}
                >
                  {config.label}
                </span>
              </div>
              <p className="font-sans text-xs leading-relaxed text-slate-600">{item.message}</p>
            </div>
          </div>

          {/* Close Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss(item.id);
            }}
            aria-label="Dismiss notification"
            className="flex size-6 shrink-0 items-center justify-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-800 focus-visible:ring-2 focus-visible:ring-[#0056FF]"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* Action Button & Status Bar */}
        {(item.action || isPaused) && (
          <div className="mt-3 flex items-center justify-between pt-1">
            {item.action ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  item.action?.onClick();
                  onDismiss(item.id);
                }}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] px-3.5 py-1.5 font-sans text-xs font-bold text-[#0056FF] transition-all hover:border-[#0056FF] hover:bg-[#E3E7FC] active:scale-[0.97]"
              >
                <Undo2 className="size-3.5" />
                <span>{item.action.label}</span>
              </button>
            ) : (
              <div />
            )}

            {isPaused && (
              <div className="flex items-center gap-1 font-mono text-[10px] font-bold text-amber-600">
                <Pause className="size-3" />
                <span>PAUSED</span>
              </div>
            )}
          </div>
        )}

        {/* Linear Countdown Progress Bar */}
        <div className="absolute inset-x-0 bottom-0 h-[2.5px] w-full bg-slate-100">
          <div
            className={cn('h-full transition-all duration-75', config.progressBar)}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </motion.div>
  );
}

// ============================================================================
// TOAST STACK CONTAINER (Stacked Resting Deck + Hover / Tap Expansion)
// ============================================================================

export interface ToastContainerProps {
  toasts?: ToastItemData[];
  onDismiss?: (id: string) => void;
  position?: 'fixed' | 'inline';
  className?: string;
}

export function ToastContainer({
  toasts: externalToasts,
  onDismiss: externalDismiss,
  position = 'fixed',
  className,
}: ToastContainerProps) {
  const hook = useToast();
  const activeToasts = externalToasts ?? hook.toasts;
  const handleDismiss = externalDismiss ?? hook.dismiss;

  // Stacking interaction: hover or tap expands the queue
  const [isHovered, setIsHovered] = React.useState(false);
  const [isTapped, setIsTapped] = React.useState(false);
  const isExpanded = isHovered || isTapped;

  // Newest toast first (index 0 is front card)
  const reversedToasts = React.useMemo(() => {
    return [...activeToasts].reverse();
  }, [activeToasts]);

  if (reversedToasts.length === 0) return null;

  const positionClasses =
    position === 'fixed'
      ? 'fixed bottom-6 right-6 z-50 pointer-events-none w-full max-w-sm'
      : 'relative z-20 pointer-events-none w-full max-w-sm mx-auto';

  // Calculate stack top padding so overlapping card tabs don't get clipped
  const stackPaddingTop = isExpanded ? 0 : Math.min(reversedToasts.length - 1, 3) * 12;

  return (
    <div
      aria-label="Notification Stack"
      className={cn(positionClasses, 'transition-all duration-300', className)}
    >
      {/* Interactive Floating Expansion Indicator Badge */}
      {reversedToasts.length > 1 && (
        <div className="pointer-events-auto mb-2 flex items-center justify-between px-1">
          <button
            type="button"
            onClick={() => setIsTapped((prev) => !prev)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-[#CAD3F5] bg-white/95 px-3 py-1 font-mono text-[11px] font-bold text-[#0056FF] shadow-xs backdrop-blur-md transition-all hover:bg-[#EFF5FF]"
          >
            <Layers className="size-3.5" />
            <span>
              {isExpanded
                ? `Expanded (${reversedToasts.length}) · Tap to collapse`
                : `${reversedToasts.length} Notifications · Tap/Hover to expand`}
            </span>
          </button>

          <span className="font-mono text-[10px] text-slate-400">
            {isExpanded ? 'Full Queue' : 'Stacked Deck'}
          </span>
        </div>
      )}

      {/* Toast Cards Container */}
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsTapped((prev) => !prev)}
        style={{ paddingTop: `${stackPaddingTop}px` }}
        className={cn(
          'pointer-events-auto relative flex w-full transition-all duration-300',
          isExpanded ? 'flex-col gap-3' : 'h-[140px] items-end',
        )}
      >
        <AnimatePresence mode="popLayout">
          {reversedToasts.map((t, idx) => (
            <ToastCard
              key={t.id}
              toast={t}
              index={idx}
              total={reversedToasts.length}
              isExpanded={isExpanded}
              containerHovered={isHovered || isTapped}
              onDismiss={handleDismiss}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ============================================================================
// INTERACTIVE DOCUMENTATION DEMO: ToastStackDemo
// ============================================================================

export function ToastStackDemo() {
  const [containerMode, setContainerMode] = React.useState<'inline' | 'fixed'>('inline');
  const { toasts, dismiss, dismissAll } = useToast();

  // Fire "Conversation Archived" matching the user's exact uploaded screenshot
  const fireConversationArchived = () => {
    toast.info('View archived in the sidebar (≡ menu).', {
      title: 'Conversation Archived',
      duration: 5500,
      action: {
        label: 'Undo',
        onClick: () => {
          toast.success('Conversation restored to active workspace.', {
            title: 'Action Reversed',
            duration: 3500,
          });
        },
      },
    });
  };

  const fireSuccess = () => {
    toast.success('Batch transaction TX-9204 committed to MongoDB replica set.', {
      title: 'Ledger Hash Verified',
      duration: 5000,
      action: {
        label: 'View TX',
        onClick: () => {},
      },
    });
  };

  const fireError = () => {
    toast.error('Constant-time HMAC signature check failed for gateway request.', {
      title: 'Security Token Rejected',
      duration: 5500,
      action: {
        label: 'Retry Auth',
        onClick: () => fireSuccess(),
      },
    });
  };

  const fireWarning = () => {
    toast.warning('Admission query volume at 88% of tenant burst limit.', {
      title: 'Rate Limit Threshold',
      duration: 4500,
    });
  };

  const fireInfo = () => {
    toast.info('Synchronized 47 domain modules with institutional schema contracts.', {
      title: 'Changelog Real-Time Sync',
      duration: 4500,
    });
  };

  // Rapid Burst: Generates 5 stacked notifications immediately like Image 2
  const fireRapidBurst = () => {
    toast.info('View archived in the sidebar (≡ menu).', {
      title: 'Conversation Archived',
      duration: 7000,
      action: {
        label: 'Undo',
        onClick: () => {},
      },
    });
    setTimeout(() => {
      toast.success('Student candidate account generated with initial credentials.', {
        title: 'Candidate Created (2/5)',
        duration: 7000,
        action: {
          label: 'View Profile',
          onClick: () => {},
        },
      });
    }, 150);
    setTimeout(() => {
      toast.warning('Guardian phone number requires country prefix normalization.', {
        title: 'Format Alert (3/5)',
        duration: 7000,
      });
    }, 300);
    setTimeout(() => {
      toast.error('Tuition fee concession waiver expired on 2026-10-15.', {
        title: 'Concession Expired (4/5)',
        duration: 7000,
      });
    }, 450);
    setTimeout(() => {
      toast.success('Cryptographic identity passbook minted on branch ledger.', {
        title: 'Passbook Ready (5/5)',
        duration: 7000,
      });
    }, 600);
  };

  return (
    <div className="w-full space-y-6">
      {/* Placement & Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
              Placement:
            </span>
            <button
              type="button"
              onClick={() => setContainerMode('inline')}
              className={cn(
                'cursor-pointer rounded-[4px] px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
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
                'cursor-pointer rounded-[4px] px-2.5 py-0.5 font-mono text-[11px] font-bold transition-colors',
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
                ? 'border border-emerald-500/30 bg-emerald-50 text-emerald-700'
                : 'border border-slate-200 bg-slate-100 text-slate-500',
            )}
          >
            {toasts.length} / 5 Active
          </span>
          {toasts.length > 0 && (
            <button
              type="button"
              onClick={dismissAll}
              className="flex cursor-pointer items-center gap-1 rounded-[4px] border border-slate-200 bg-slate-50 px-2 py-0.5 text-[11px] font-bold text-slate-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
            >
              <RotateCcw className="size-3" />
              <span>Dismiss All</span>
            </button>
          )}
        </div>
      </div>

      {/* Primary Action Button (Matches Screenshot: Conversation Archived with Undo) */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#CAD3F5] bg-[#EFF5FF]/60 p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="font-sans text-sm font-bold text-slate-900">
              Reference Archetype: Conversation Archived
            </span>
            <span className="rounded-md bg-[#0056FF] px-2 py-0.5 font-mono text-[10px] font-bold text-white uppercase">
              Brand Light Day
            </span>
          </div>
          <p className="font-sans text-xs text-slate-600">
            Fires notifications with timed auto-dismissal, linear countdown bars, Undo action pill,
            and stacked deck layers.
          </p>
        </div>

        <button
          type="button"
          onClick={fireConversationArchived}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#0056FF] px-4 py-2 font-sans text-xs font-bold text-white shadow-sm transition-all hover:bg-[#2277FF] active:scale-[0.98]"
        >
          <Undo2 className="size-3.5" />
          <span>Trigger Archived Toast</span>
        </button>
      </div>

      {/* Interactive Trigger Control Board */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Fire Success */}
        <button
          type="button"
          onClick={fireSuccess}
          className="flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 text-left transition-all hover:border-emerald-500/50 hover:bg-emerald-500/10 active:scale-[0.98]"
        >
          <Check className="size-5 stroke-[2.5] text-emerald-600" />
          <span className="mt-1 font-mono text-xs font-bold text-emerald-700">Success Toast</span>
          <span className="font-sans text-[11px] text-slate-500">Form save & commit</span>
        </button>

        {/* Fire Error */}
        <button
          type="button"
          onClick={fireError}
          className="flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-rose-500/30 bg-rose-500/5 p-4 text-left transition-all hover:border-rose-500/50 hover:bg-rose-500/10 active:scale-[0.98]"
        >
          <CircleAlert className="size-5 stroke-[2.5] text-rose-600" />
          <span className="mt-1 font-mono text-xs font-bold text-rose-700">Error Toast</span>
          <span className="font-sans text-[11px] text-slate-500">Security failure cue</span>
        </button>

        {/* Fire Warning */}
        <button
          type="button"
          onClick={fireWarning}
          className="flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 text-left transition-all hover:border-amber-500/50 hover:bg-amber-500/10 active:scale-[0.98]"
        >
          <TriangleAlert className="size-5 stroke-[2.5] text-amber-600" />
          <span className="mt-1 font-mono text-xs font-bold text-amber-700">Warning Toast</span>
          <span className="font-sans text-[11px] text-slate-500">Rate limit threshold</span>
        </button>

        {/* Fire Info */}
        <button
          type="button"
          onClick={fireInfo}
          className="flex cursor-pointer flex-col items-start gap-1 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4 text-left transition-all hover:border-blue-500/50 hover:bg-blue-500/10 active:scale-[0.98]"
        >
          <Info className="size-5 stroke-[2.5] text-[#0056FF]" />
          <span className="mt-1 font-mono text-xs font-bold text-[#0056FF]">Info Toast</span>
          <span className="font-sans text-[11px] text-slate-500">Background event sync</span>
        </button>
      </div>

      {/* Rapid Burst Action & Stack Demonstration */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-slate-900">
            <Sparkles className="size-3.5 text-[#0056FF]" />
            <span>01 Stacked Deck Physics Demonstration</span>
          </div>
          <p className="font-sans text-xs text-slate-500">
            Fires 5 sequential notifications into the stack. In resting state they stay stacked
            above each other; hover or tap to expand into the full vertical queue.
          </p>
        </div>

        <button
          type="button"
          onClick={fireRapidBurst}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-[#0056FF] px-4 py-2 font-mono text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700 active:scale-[0.98]"
        >
          <Play className="size-3.5" />
          <span>FIRE STACK (5 NOTIFICATIONS)</span>
        </button>
      </div>

      {/* Interactive Preview Canvas with Toast Container */}
      <div className="relative min-h-[380px] w-full overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-inner transition-colors">
        <div className="max-w-md space-y-3">
          <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
            Interactive Stack Viewport · Hover or Tap To Expand
          </span>
          <h3 className="font-sans text-base font-bold text-slate-900">
            Stacked Notification Queue
          </h3>
          <p className="font-sans text-xs leading-relaxed text-slate-600">
            Toasts layer directly on top of each other in a clean stacked deck with peeking tabs.
            Hovering or tapping anywhere on the stack expands all notifications simultaneously.
          </p>

          <div className="flex flex-wrap gap-2 pt-2 font-mono text-[11px] text-slate-500">
            <span className="rounded-md border border-[#CAD3F5] bg-white px-2 py-0.5 font-bold text-[#0056FF]">
              Stacked Resting Deck
            </span>
            <span className="rounded-md border border-[#CAD3F5] bg-white px-2 py-0.5 font-bold text-[#0056FF]">
              Hover/Tap Full Expansion
            </span>
            <span className="rounded-md border border-[#CAD3F5] bg-white px-2 py-0.5 font-bold text-[#0056FF]">
              Linear Progress Countdown
            </span>
            <span className="rounded-md border border-[#CAD3F5] bg-white px-2 py-0.5 font-bold text-[#0056FF]">
              Undo Action Pill
            </span>
          </div>
        </div>

        {/* The Toast Stack Container (Inline in demo or Fixed viewport) */}
        <div className="mt-6 flex w-full justify-center sm:justify-end">
          <ToastContainer
            position={containerMode}
            toasts={toasts}
            onDismiss={dismiss}
          />
        </div>
      </div>
    </div>
  );
}
