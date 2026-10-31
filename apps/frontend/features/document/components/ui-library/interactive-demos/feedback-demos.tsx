'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Check, Alert, Info, X, Sparkles, RotateCw, Play } from '@/components/icons';
import {
  StatusPage404,
  type StatusCode,
  type StatusMode,
  STATUS_DIRECTORY,
} from '../status-page-404';

// 1. Toast Notification Stack
export function ToastDemo() {
  const [toasts, setToasts] = React.useState<
    { id: number; title: string; type: 'success' | 'info' | 'warning' }[]
  >([
    { id: 1, title: 'Term 1 Exam grades synchronized successfully', type: 'success' },
    { id: 2, title: 'Backup replica completed in 42ms', type: 'info' },
  ]);

  const addToast = (type: 'success' | 'info' | 'warning', text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, title: text, type }]);
    setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
          Toast Notification Stack
        </span>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => addToast('success', 'Student STU-890 verified')}
            className="rounded-[4px] bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
          >
            + Success
          </button>
          <button
            type="button"
            onClick={() => addToast('warning', 'Session expires in 5m')}
            className="rounded-[4px] bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 hover:bg-amber-100"
          >
            + Warning
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {toasts.length === 0 ? (
          <div className="py-6 text-center font-sans text-xs text-slate-400">
            No active toasts. Tap above to trigger.
          </div>
        ) : (
          toasts.map((toast) => (
            <div
              key={toast.id}
              className={cn(
                'animate-in fade-in slide-in-from-top-1 flex items-center justify-between rounded-xl border p-3 font-sans text-xs shadow-xs transition-all',
                toast.type === 'success' && 'border-emerald-200 bg-emerald-50/70 text-emerald-900',
                toast.type === 'info' && 'border-blue-200 bg-blue-50/70 text-blue-900',
                toast.type === 'warning' && 'border-amber-200 bg-amber-50/70 text-amber-900',
              )}
            >
              <div className="flex items-center gap-2">
                {toast.type === 'success' && <Check className="size-4 text-emerald-600" />}
                {toast.type === 'info' && <Info className="size-4 text-blue-600" />}
                {toast.type === 'warning' && <Alert className="size-4 text-amber-600" />}
                <span className="font-semibold">{toast.title}</span>
              </div>
              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="size-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// 3. Notification Bell with Animated Dropdown
export function NotificationBellDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [unreadCount, setUnreadCount] = React.useState(3);

  const notifications = [
    { title: 'New Attendance Roster submitted', time: '10m ago', branch: 'MB-01' },
    { title: 'Grade Revision Approved for STU-492', time: '1h ago', branch: 'TK-02' },
    { title: 'Tuition Fee invoice dispatched', time: '3h ago', branch: 'SS-03' },
  ];

  return (
    <div className="relative flex w-full max-w-md flex-col items-center rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <span className="pb-3 font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
        Notification Bell & Popover
      </span>

      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setUnreadCount(0);
          }}
          className="relative flex size-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700 shadow-xs transition-transform hover:scale-105 hover:border-[#0056FF] hover:text-[#0056FF] active:scale-95"
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#0056FF] font-mono text-[10px] font-black text-white shadow-xs">
              {unreadCount}
            </span>
          )}
        </button>

        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute top-14 left-1/2 z-30 w-72 -translate-x-1/2 rounded-2xl border border-slate-200 bg-white p-3 text-left shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-sans text-xs font-bold text-slate-900">Notifications</span>
              <button
                type="button"
                onClick={() => setUnreadCount(3)}
                className="font-mono text-[10px] text-[#0056FF] hover:underline"
              >
                Reset
              </button>
            </div>
            <div className="mt-2 space-y-2">
              {notifications.map((n, i) => (
                <div key={i} className="rounded-xl border border-slate-100 bg-slate-50 p-2">
                  <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                    <span>{n.branch}</span>
                    <span>{n.time}</span>
                  </div>
                  <p className="mt-1 font-sans text-xs font-semibold text-slate-800">{n.title}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <p className="pt-3 font-sans text-xs text-slate-500">
        Tap the bell to inspect recent institutional activity.
      </p>
    </div>
  );
}

// 3. Status Page 404 & Error Console (5 Brand Archetypes & Multi-Status Engine)
export function StatusPage404Demo() {
  const [selectedMode, setSelectedMode] = React.useState<StatusMode>('radar');
  const [selectedCode, setSelectedCode] = React.useState<StatusCode>(404);

  const archetypes: { id: StatusMode; label: string; desc: string; tag: string }[] = [
    {
      id: 'radar',
      label: '01 Radar Explorer',
      desc: 'Concentric spatial rings, rotating radar beam, floating 3D numbers, and coordinate tracking.',
      tag: 'AEROSPACE',
    },
    {
      id: 'barcode',
      label: '02 Barcode Ledger',
      desc: 'Cryptographic high-density barcode, editorial typography, hairline accents, and error hash.',
      tag: 'EDITORIAL',
    },
    {
      id: 'terminal',
      label: '03 Cyber Terminal',
      desc: 'Interactive CLI command console with constellation lines, glowing apex, and live prompt.',
      tag: 'INTERACTIVE CLI',
    },
    {
      id: 'noise',
      label: '04 CRT Phosphor',
      desc: 'Synthesized procedural SVG noise texture, CRT scanlines, chromatic glitch split, and decibels.',
      tag: 'GLITCH CRT',
    },
    {
      id: 'gravity',
      label: '05 Gravity Blocks',
      desc: 'Kinetic architectural brand cards with spring physics tumbling and interactive re-alignment.',
      tag: 'KINETIC MOTION',
    },
  ];

  const statusCodes: { code: StatusCode; label: string }[] = [
    { code: 404, label: '404 Not Found' },
    { code: 403, label: '403 Forbidden' },
    { code: 500, label: '500 Server Error' },
    { code: 503, label: '503 Unavailable' },
    { code: 401, label: '401 Unauthorized' },
  ];

  const activeMeta = STATUS_DIRECTORY[selectedCode];

  return (
    <div className="w-full max-w-4xl space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
      {/* Header Deck */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-sans text-xs font-bold text-slate-950">
              Status Page 404 & Error Console
            </h3>
            <span className="rounded-[4px] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[9px] font-bold text-[#0056FF]">
              5 ARCHETYPES
            </span>
          </div>
          <p className="font-sans text-[11px] text-slate-500">
            Multi-mode brand status screens supporting 404, 403, 500, 503, and 401 with flat
            geometry.
          </p>
        </div>

        {/* HTTP Status Code Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          {statusCodes.map((sc) => (
            <button
              key={sc.code}
              type="button"
              onClick={() => setSelectedCode(sc.code)}
              className={cn(
                'cursor-pointer rounded-[4px] border-0 px-2.5 py-1 font-mono text-xs font-bold transition-all select-none',
                selectedCode === sc.code
                  ? 'bg-[#0056FF] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
              )}
            >
              {sc.code}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Mode Picker Strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {archetypes.map((arch) => {
          const isSelected = selectedMode === arch.id;
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => setSelectedMode(arch.id)}
              className={cn(
                'flex cursor-pointer flex-col justify-between rounded-xl border p-2.5 text-left transition-all select-none',
                isSelected
                  ? 'border-[#0056FF] bg-[#EFF5FF]/80 ring-1 ring-[#0056FF]/30'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold text-[#0056FF]">{arch.tag}</span>
                {isSelected && <span className="h-1.5 w-1.5 rounded-[1px] bg-[#0056FF]" />}
              </div>
              <div className="mt-1 font-sans text-xs font-bold text-slate-900">{arch.label}</div>
            </button>
          );
        })}
      </div>

      {/* Telemetry Status Strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-100 bg-[#F8FAFC] px-3 py-2 font-mono text-[10px] text-slate-600">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-[1px] bg-[#0056FF]" />
            <span className="font-bold text-slate-900">CODE {selectedCode}</span>
          </div>
          <span className="opacity-30">|</span>
          <span className="font-semibold text-[#0056FF] uppercase">{activeMeta.title}</span>
          <span className="opacity-30">|</span>
          <span>DIAGNOSIS: {activeMeta.tagline}</span>
        </div>
        <div className="text-[9px] text-slate-400">NEXT.JS APP/NOT-FOUND.TSX READY</div>
      </div>

      {/* Live Component Preview */}
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-2xs">
        <StatusPage404
          mode={selectedMode}
          statusCode={selectedCode}
          homeHref="/document/design-system"
          homeLabel="Return to Document Library"
          showControls={false}
        />
      </div>

      {/* Usage Specification Callout */}
      <div className="rounded-lg border border-slate-200/80 bg-[#F8FAFC] p-3.5 font-sans text-xs text-slate-600">
        <div className="font-bold text-slate-900">Drop-in Implementation Pattern:</div>
        <div className="mt-1 font-mono text-[11px] text-[#0056FF]">
          import &#123; StatusPage404 &#125; from
          &apos;@/features/document/components/ui-library&apos;;
        </div>
        <p className="mt-1 text-[11px] leading-relaxed">
          Embed directly inside Next.js <code className="font-mono">app/not-found.tsx</code> or
          error boundary handlers. Pass <code className="font-mono">mode=&quot;radar&quot;</code>,{' '}
          <code className="font-mono">&quot;barcode&quot;</code>,{' '}
          <code className="font-mono">&quot;terminal&quot;</code>,{' '}
          <code className="font-mono">&quot;noise&quot;</code>, or{' '}
          <code className="font-mono">&quot;gravity&quot;</code>.
        </p>
      </div>
    </div>
  );
}
