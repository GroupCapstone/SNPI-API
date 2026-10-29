import * as React from 'react';

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: 'neutral' | 'success' | 'warning' | 'danger';
}

const tones = {
  neutral:
    'border-slate-200 bg-slate-50 text-slate-600 dark:border-white/10 dark:bg-[#202024] dark:text-zinc-300',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400',
  warning:
    'border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-400',
  danger:
    'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400',
};

export const Badge = ({ className, tone = 'neutral', ...props }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium',
      tones[tone],
      className,
    )}
    {...props}
  />
);
