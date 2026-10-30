'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Bell, Check, Alert, Info, X, FaceSmile, Sparkles } from '@/components/icons';

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
            className="rounded-full bg-emerald-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700 hover:bg-emerald-100"
          >
            + Success
          </button>
          <button
            type="button"
            onClick={() => addToast('warning', 'Session expires in 5m')}
            className="rounded-full bg-amber-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-amber-700 hover:bg-amber-100"
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

// 2. Emoji Reaction Picker
export function EmojiReactionDemo() {
  const [reactions, setReactions] = React.useState([
    { emoji: '👍', count: 18, reacted: true },
    { emoji: '❤️', count: 9, reacted: false },
    { emoji: '🔥', count: 24, reacted: true },
    { emoji: '🎉', count: 12, reacted: false },
    { emoji: '🚀', count: 15, reacted: false },
  ]);

  const toggleReaction = (idx: number) => {
    setReactions(
      reactions.map((r, i) =>
        i === idx ? { ...r, reacted: !r.reacted, count: r.reacted ? r.count - 1 : r.count + 1 } : r,
      ),
    );
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <span className="font-sans text-xs font-bold tracking-wider text-slate-800 uppercase">
        Social & Lesson Emoji Reactions
      </span>

      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
        {reactions.map((r, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => toggleReaction(idx)}
            className={cn(
              'flex items-center gap-1.5 rounded-full border px-3 py-1 font-sans text-xs font-bold transition-transform hover:scale-105 active:scale-95',
              r.reacted
                ? 'border-[#0056FF] bg-[#E3E7FC] text-[#0056FF] shadow-xs'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300',
            )}
          >
            <span className="text-sm">{r.emoji}</span>
            <span className="font-mono text-[11px]">{r.count}</span>
          </button>
        ))}

        <div className="flex size-7 items-center justify-center rounded-full border border-dashed border-slate-300 text-slate-400 hover:border-[#0056FF] hover:text-[#0056FF]">
          <FaceSmile className="size-3.5" />
        </div>
      </div>

      <p className="font-sans text-xs text-slate-500">
        Instant visual feedback for collaborative student & teacher engagement.
      </p>
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
