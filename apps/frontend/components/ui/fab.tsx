'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface FabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
}

export function Fab({
  icon,
  label,
  position = 'bottom-right',
  className,
  ...props
}: FabProps) {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6',
    'bottom-center': 'fixed bottom-6 left-1/2 -translate-x-1/2',
  };

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      className={cn(
        'z-40 flex h-14 w-14 items-center justify-center rounded-full border border-white/15 bg-sky-500 text-white shadow-none transition-transform duration-200 hover:scale-105 hover:bg-sky-400 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:bg-sky-500 dark:hover:bg-sky-400 dark:focus-visible:ring-offset-[#0E0E10]',
        positionClasses[position],
        className,
      )}
      {...props}
    >
      <span className="flex items-center justify-center">{icon}</span>
    </button>
  );
}
