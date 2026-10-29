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
      'bg-[#0056FF] text-white hover:bg-[#0040C0] border-2 border-[#0056FF] rounded-xl [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)] shadow-md active:scale-95',
    secondary:
      'bg-slate-900 text-white hover:bg-black border-2 border-slate-900 rounded-xl [clip-path:polygon(0_0,calc(100%-10px)_0,100%_10px,100%_100%,0_100%)] shadow-md active:scale-95',
    surface:
      'bg-white text-slate-800 hover:bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-[#0056FF] shadow-xs active:scale-95',
  };

  const sizeStyles = {
    default: isExtended
      ? 'h-12 px-5 text-sm font-semibold gap-2.5 rounded-full'
      : 'h-12 w-12 rounded-full',
    small: isExtended
      ? 'h-10 px-4 text-xs font-semibold gap-2 rounded-full'
      : 'h-10 w-10 rounded-full',
  };

  return (
    <button
      type="button"
      className={cn(
        'inline-flex items-center justify-center shadow-xs transition-all duration-150 select-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:outline-none',
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
