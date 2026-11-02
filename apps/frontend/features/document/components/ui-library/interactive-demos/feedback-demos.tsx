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
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-none">
      <div className="flex items-center justify-end border-b border-slate-100 pb-2.5">
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

// 3. Notification Bell with Interactive Notification Center
export function NotificationBellDemo() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState<'all' | 'academic' | 'security'>('all');
  const [items, setItems] = React.useState([
    {
      id: 1,
      title: 'New Attendance Roster submitted',
      desc: 'Section CS-2026-A submitted morning biometric roster for review.',
      time: '10m ago',
      branch: 'PP-02',
      category: 'academic',
      read: false,
    },
    {
      id: 2,
      title: 'Cryptographic Signature Key Rotated',
      desc: 'Automatic HMAC rotation completed for campus gateway cluster.',
      time: '1h ago',
      branch: 'SR-01',
      category: 'security',
      read: false,
    },
    {
      id: 3,
      title: 'Tuition Fee invoice dispatched',
      desc: 'Consolidated batch invoices issued for Term 1 Semester fees.',
      time: '3h ago',
      branch: 'BT-03',
      category: 'academic',
      read: false,
    },
  ]);

  const unreadCount = items.filter((n) => !n.read).length;

  const toggleRead = (id: number) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, read: !item.read } : item)));
  };

  const markAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, read: true })));
  };

  const triggerNewNotification = () => {
    const newItem = {
      id: Date.now(),
      title: 'Campus Gateway Telemetry Synced',
      desc: 'Real-time heartbeat packet received from Phnom Penh Innovation Hub.',
      time: 'Just now',
      branch: 'PP-02',
      category: 'security' as const,
      read: false,
    };
    setItems((prev) => [newItem, ...prev]);
  };

  const filteredItems = items.filter((item) =>
    filter === 'all' ? true : item.category === filter,
  );

  return (
    <div className="relative flex w-full max-w-xl flex-col items-center rounded-2xl border border-[#CAD3F5] bg-white p-5 text-center shadow-xs sm:p-6">
      {/* Top Controls Bar */}
      <div className="mb-4 flex w-full items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold text-[#0A1A4A]">
            Campus Notification Center
          </span>
          <span className="rounded-md border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
            {unreadCount} Unread
          </span>
        </div>
        <button
          type="button"
          onClick={triggerNewNotification}
          title="Simulate incoming campus alert notification"
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-slate-200 bg-white px-2.5 py-1 font-mono text-[11px] font-bold text-slate-700 transition-all hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF] active:scale-95"
        >
          <Sparkles className="size-3 text-[#0056FF]" />
          <span>Simulate Alert</span>
        </button>
      </div>

      {/* Bell Action Hub */}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle notifications"
          title={isOpen ? 'Close Notification Center' : 'Open Notification Center'}
          className={cn(
            'relative flex size-12 cursor-pointer items-center justify-center rounded-2xl border transition-all active:scale-95',
            isOpen
              ? 'border-[#0056FF] bg-[#EFF5FF] text-[#0056FF] shadow-xs'
              : 'border-[#CAD3F5] bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF]',
          )}
        >
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#0056FF] font-mono text-[10px] font-black text-white ring-2 ring-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Floating Notification Popover Dropdown */}
        {isOpen && (
          <div className="animate-in fade-in slide-in-from-top-2 absolute top-14 left-1/2 z-50 w-[calc(100vw-48px)] max-w-sm -translate-x-1/2 rounded-2xl border border-[#CAD3F5] bg-white p-3.5 text-left shadow-[0_16px_40px_rgba(0,86,255,0.12)] sm:w-96">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <span className="font-sans text-xs font-bold text-[#0A1A4A]">Institutional Feed</span>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="font-mono text-[10px] font-bold text-[#0056FF] hover:underline"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="mt-2.5 flex items-center gap-1">
              {(['all', 'academic', 'security'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFilter(cat)}
                  className={cn(
                    'cursor-pointer rounded-md px-2 py-0.5 font-mono text-[10px] font-bold uppercase transition-all',
                    filter === cat
                      ? 'bg-[#0056FF] text-white'
                      : 'border border-slate-200 bg-slate-50 text-slate-500 hover:text-slate-800',
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Notification Item Cards */}
            <div className="no-scrollbar mt-3 max-h-64 space-y-2 overflow-y-auto pr-1">
              {filteredItems.length === 0 ? (
                <div className="py-6 text-center font-mono text-xs text-slate-400">
                  No notifications matching filter.
                </div>
              ) : (
                filteredItems.map((n) => (
                  <div
                    key={n.id}
                    onClick={() => toggleRead(n.id)}
                    className={cn(
                      'cursor-pointer rounded-xl border p-2.5 transition-all select-none',
                      n.read
                        ? 'border-slate-100 bg-slate-50/50 opacity-70'
                        : 'border-[#CAD3F5] bg-[#EFF5FF]/40 hover:bg-[#EFF5FF]',
                    )}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="rounded border border-slate-200/80 bg-white px-1.5 py-0.5 font-bold text-[#0056FF]">
                        {n.branch}
                      </span>
                      <span className="text-slate-400">{n.time}</span>
                    </div>
                    <p className="mt-1 font-sans text-xs font-bold text-[#0A1A4A]">{n.title}</p>
                    <p className="mt-0.5 font-sans text-[11px] leading-snug text-slate-500">
                      {n.desc}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <p className="pt-3 font-sans text-xs text-slate-500">
        Click bell to reveal the floating popover feed. Tap cards to toggle read status.
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
      id: 'noise',
      label: '03 CRT Phosphor',
      desc: 'Synthesized procedural SVG noise texture, CRT scanlines, chromatic glitch split, and decibels.',
      tag: 'GLITCH CRT',
    },
    {
      id: 'gravity',
      label: '04 Gravity Blocks',
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
    <div className="w-full max-w-4xl space-y-4 rounded-2xl border border-[#CAD3F5] bg-white p-5 shadow-xs sm:p-6">
      {/* HTTP Status Code Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <span className="font-sans text-xs font-bold text-[#0A1A4A]">
            Status Archetype Engine
          </span>
          <span className="font-mono text-[10px] text-slate-400">Select Code:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {statusCodes.map((sc) => (
            <button
              key={sc.code}
              type="button"
              onClick={() => setSelectedCode(sc.code)}
              title={`Simulate HTTP ${sc.code} error state`}
              className={cn(
                'cursor-pointer rounded-md px-2.5 py-1 font-mono text-xs font-bold transition-all select-none active:scale-95',
                selectedCode === sc.code
                  ? 'border border-[#0056FF] bg-[#0056FF] text-white shadow-2xs'
                  : 'border border-slate-200 bg-white text-slate-600 hover:border-[#CAD3F5] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              {sc.code}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Mode Picker Strip */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {archetypes.map((arch) => {
          const isSelected = selectedMode === arch.id;
          return (
            <button
              key={arch.id}
              type="button"
              onClick={() => setSelectedMode(arch.id)}
              title={`Switch archetype to ${arch.label}: ${arch.desc}`}
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
      <div className="overflow-hidden rounded-xl border border-slate-200/90 bg-white shadow-none">
        <StatusPage404 mode={selectedMode} statusCode={selectedCode} showControls={false} />
      </div>
    </div>
  );
}
