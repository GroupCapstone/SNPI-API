'use client';

import * as React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export interface GeometricButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | 'primary'
    | 'outline'
    | 'blue'
    | 'green'
    | 'purple'
    | 'orange'
    | 'navy'
    | 'cyan'
    | 'ghost'
    | 'tab'
    | 'ticket'
    | 'speech';
  isActive?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showAsterisk?: boolean;
  attachedTag?: string;
  icon?: React.ReactNode;
  iconTileClassName?: string;
  notchPosition?: 'top-right' | 'bottom-right' | 'none';
  href?: string;
  target?: string;
  rel?: string;
}

/**
 * Capsule Pill Button with Squircle Icon Tile
 * Inspired by reference design (Digital, Finance, Simple, Fast, Secure, Fluid)
 * Features 2px continuous colored stroke, pastel surface tint, and left icon tile.
 */
export const GeometricButton = React.forwardRef<HTMLButtonElement, GeometricButtonProps>(
  (
    {
      children,
      className,
      variant = 'primary',
      isActive = false,
      size = 'md',
      attachedTag,
      icon,
      iconTileClassName,
      href,
      target,
      rel,
      disabled,
      ...props
    },
    ref,
  ) => {
    // Size tokens
    const sizeClasses = {
      sm: 'h-8 px-2.5 text-xs font-bold gap-2 rounded-full',
      md: 'h-10 px-3.5 text-xs font-bold gap-2.5 rounded-full',
      lg: 'h-12 px-4 text-sm font-bold gap-3 rounded-full',
    }[size];

    const iconTileSizes = {
      sm: 'size-5 rounded-md text-[10px]',
      md: 'size-6 rounded-lg text-xs',
      lg: 'size-7 rounded-lg text-sm',
    }[size];

    // Normalize variant aliases
    const resolvedVariant =
      variant === 'primary' || variant === 'tab' || variant === 'ticket' || variant === 'speech'
        ? 'blue'
        : variant;

    // Variant style configurations
    const variantStyles = {
      blue: {
        button: isActive
          ? 'border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-none'
          : 'border-2 border-[#0056FF] bg-blue-50/70 text-[#0056FF] hover:bg-blue-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-[#0056FF]/15 text-[#0056FF]',
      },
      green: {
        button: isActive
          ? 'border-2 border-emerald-600 bg-emerald-600 text-white shadow-none'
          : 'border-2 border-emerald-600 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-emerald-200/60 text-emerald-700',
      },
      purple: {
        button: isActive
          ? 'border-2 border-purple-600 bg-purple-600 text-white shadow-none'
          : 'border-2 border-purple-600 bg-purple-50/70 text-purple-800 hover:bg-purple-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-purple-200/60 text-purple-700',
      },
      orange: {
        button: isActive
          ? 'border-2 border-orange-500 bg-orange-500 text-white shadow-none'
          : 'border-2 border-orange-500 bg-orange-50/70 text-orange-800 hover:bg-orange-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-orange-200/60 text-orange-700',
      },
      navy: {
        button: isActive
          ? 'border-2 border-blue-900 bg-blue-900 text-white shadow-none'
          : 'border-2 border-blue-900 bg-blue-50/70 text-blue-950 hover:bg-blue-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-blue-200/70 text-blue-950',
      },
      cyan: {
        button: isActive
          ? 'border-2 border-cyan-500 bg-cyan-500 text-white shadow-none'
          : 'border-2 border-cyan-500 bg-cyan-50/70 text-cyan-800 hover:bg-cyan-100/70',
        tile: isActive ? 'bg-white/20 text-white' : 'bg-cyan-200/60 text-cyan-700',
      },
      outline: {
        button: isActive
          ? 'border-2 border-slate-900 bg-slate-900 text-white shadow-none'
          : 'border-2 border-slate-300 bg-slate-50/80 text-slate-700 hover:border-[#0056FF] hover:bg-blue-50/40 hover:text-[#0056FF]',
        tile: isActive
          ? 'bg-white/20 text-white'
          : 'bg-slate-200/70 text-slate-700 group-hover:bg-[#0056FF]/15 group-hover:text-[#0056FF]',
      },
      ghost: {
        button: isActive
          ? 'border-2 border-transparent bg-slate-100 text-slate-900'
          : 'border-2 border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
        tile: isActive
          ? 'bg-slate-200 text-slate-900'
          : 'bg-slate-100 text-slate-700 group-hover:bg-slate-200',
      },
    }[
      resolvedVariant as
        'blue' | 'green' | 'purple' | 'orange' | 'navy' | 'cyan' | 'outline' | 'ghost'
    ] || {
      button: 'border-2 border-slate-300 bg-slate-50 text-slate-700',
      tile: 'bg-slate-200 text-slate-700',
    };

    // Separate leading icon child from text children if present
    const childArray = React.Children.toArray(children);
    let leadingIcon = icon;
    let labelChildren: React.ReactNode = children;

    if (
      !leadingIcon &&
      !attachedTag &&
      childArray.length > 1 &&
      React.isValidElement(childArray[0])
    ) {
      leadingIcon = childArray[0];
      labelChildren = childArray.slice(1);
    }

    const tileContent =
      leadingIcon ||
      (attachedTag ? <span className="font-mono font-black">{attachedTag}</span> : null);

    const buttonBody = (
      <>
        {tileContent && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center transition-colors',
              iconTileSizes,
              variantStyles.tile,
              iconTileClassName,
            )}
          >
            {tileContent}
          </span>
        )}
        <span className="truncate tracking-tight">{labelChildren}</span>
      </>
    );

    const commonClasses = cn(
      'group relative inline-flex items-center justify-center font-sans tracking-tight transition-all duration-200 select-none cursor-pointer',
      sizeClasses,
      variantStyles.button,
      disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      className,
    );

    if (href) {
      return (
        <Link href={href} target={target} rel={rel} className={commonClasses}>
          {buttonBody}
        </Link>
      );
    }

    return (
      <button ref={ref} disabled={disabled} className={commonClasses} {...props}>
        {buttonBody}
      </button>
    );
  },
);

GeometricButton.displayName = 'GeometricButton';

/**
 * Apple-style Liquid Glass Card Container
 */
export function GeometricCard({
  children,
  className,
  isActive = false,
}: {
  children: React.ReactNode;
  className?: string;
  variant?: 'chamfer' | 'ticket' | 'speech' | 'stepped' | 'pinnacle';
  isActive?: boolean;
}) {
  return (
    <div
      className={cn(
        'group relative overflow-hidden rounded-2xl transition-all duration-300 ease-out',
        'border border-slate-200/80 bg-white/90 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md',
        isActive
          ? 'border-[#0056FF] shadow-md ring-2 ring-[#0056FF]/20'
          : 'hover:-translate-y-1 hover:border-[#0056FF]/40 hover:shadow-[0_12px_28px_rgba(0,86,255,0.08)]',
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Clean Typographic Stamp (No emoji, no symbol)
 */
export function GeometricHeaderStamp({
  codeA = '20',
  titleA = 'BRAND',
  codeB = '26',
  titleB = 'DESIGN',
  className,
}: {
  codeA?: string;
  titleA?: string;
  codeB?: string;
  titleB?: string;
  className?: string;
}) {
  return (
    <div className={cn('inline-flex flex-col font-sans select-none', className)}>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
          {codeA}
        </span>
        <span className="h-4 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleA}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="font-mono text-xl font-black tracking-tighter text-slate-950 sm:text-2xl">
          {codeB}
        </span>
        <span className="h-4 w-[2px] bg-[#0056FF]" />
        <span className="text-base font-black tracking-tight text-slate-950 uppercase sm:text-lg">
          {titleB}
        </span>
      </div>
    </div>
  );
}
