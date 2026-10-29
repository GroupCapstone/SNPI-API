'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Plus } from '@/components/icons';

export interface LibraryFabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  label?: string;
  variant?: 'primary' | 'secondary' | 'surface';
  size?: 'default' | 'small';
}

export function LibraryFab({
  icon = <Plus className="h-6 w-6" />,
  label,
  variant = 'primary',
  size = 'default',
  className,
  ...props
}: LibraryFabProps) {
  const isExtended = Boolean(label);

  const variantStyles = {
    primary:
      'bg-emerald-600 text-white hover:bg-emerald-500 border border-emerald-400/30 active:scale-95',
    secondary:
      'bg-blue-600 text-white hover:bg-blue-500 border border-blue-400/30 active:scale-95',
    surface:
      'bg-[#28282D] text-zinc-100 hover:bg-[#323238] border border-white/10 active:scale-95',
  };

  const sizeStyles = {
    default: isExtended ? 'h-14 px-5 text-sm font-medium gap-2.5 rounded-full' : 'h-14 w-14 rounded-full',
    small: isExtended ? 'h-11 px-4 text-xs font-medium gap-2 rounded-full' : 'h-11 w-11 rounded-full',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 select-none',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      <span className="shrink-0">{icon}</span>
      {label && <span className="truncate">{label}</span>}
    </button>
  );
}
