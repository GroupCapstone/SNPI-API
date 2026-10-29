'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  name?: string;
  'aria-label'?: string;
  className?: string;
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  id,
  name,
  'aria-label': ariaLabel,
  className,
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      id={id}
      name={name}
      onClick={() => {
        if (!disabled) onCheckedChange(!checked);
      }}
      className={cn(
        'group relative inline-flex min-h-[44px] min-w-[44px] items-center justify-center p-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
    >
      {/* Track: 48px wide, 28px high */}
      <span
        className={cn(
          'inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:ring-2 focus-visible:ring-emerald-500/50',
          checked
            ? 'bg-emerald-500 dark:bg-emerald-500'
            : 'bg-slate-300 dark:bg-[#27272A]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        {/* Thumb: 22px circle */}
        <span
          className={cn(
            'pointer-events-none block h-[22px] w-[22px] rounded-full bg-white shadow-none transition-transform duration-200 ease-in-out',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </span>
    </button>
  );
}
