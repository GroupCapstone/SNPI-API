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

    // Normalize variant aliases
    const resolvedVariant =
      variant === 'primary' || variant === 'tab' || variant === 'ticket' || variant === 'speech'
        ? 'blue'
        : variant;

    // Variant style configurations (Strictly zero color behind icons or numbers)
    const variantStyles = {
      blue: {
        button: isActive
          ? 'border-2 border-[#0056FF] bg-[#0056FF] text-white shadow-none'
          : 'border-2 border-[#0056FF] bg-blue-50/70 text-[#0056FF] hover:bg-blue-100/70',
      },
      green: {
        button: isActive
          ? 'border-2 border-emerald-600 bg-emerald-600 text-white shadow-none'
          : 'border-2 border-emerald-600 bg-emerald-50/70 text-emerald-800 hover:bg-emerald-100/70',
      },
      purple: {
        button: isActive
          ? 'border-2 border-purple-600 bg-purple-600 text-white shadow-none'
          : 'border-2 border-purple-600 bg-purple-50/70 text-purple-800 hover:bg-purple-100/70',
      },
      orange: {
        button: isActive
          ? 'border-2 border-orange-500 bg-orange-500 text-white shadow-none'
          : 'border-2 border-orange-500 bg-orange-50/70 text-orange-800 hover:bg-orange-100/70',
      },
      navy: {
        button: isActive
          ? 'border-2 border-blue-900 bg-blue-900 text-white shadow-none'
          : 'border-2 border-blue-900 bg-blue-50/70 text-blue-950 hover:bg-blue-100/70',
      },
      cyan: {
        button: isActive
          ? 'border-2 border-cyan-500 bg-cyan-500 text-white shadow-none'
          : 'border-2 border-cyan-500 bg-cyan-50/70 text-cyan-800 hover:bg-cyan-100/70',
      },
      outline: {
        button: isActive
          ? 'border-2 border-slate-900 bg-slate-900 text-white shadow-none'
          : 'border-2 border-slate-300 bg-slate-50/80 text-slate-700 hover:border-[#0056FF] hover:bg-blue-50/40 hover:text-[#0056FF]',
      },
      ghost: {
        button: isActive
          ? 'border-2 border-transparent bg-slate-100 text-slate-900'
          : 'border-2 border-transparent bg-transparent text-slate-700 hover:bg-slate-100 hover:text-slate-950',
      },
    }[
      resolvedVariant as
        'blue' | 'green' | 'purple' | 'orange' | 'navy' | 'cyan' | 'outline' | 'ghost'
    ] || {
      button: 'border-2 border-slate-300 bg-slate-50 text-slate-700',
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
      (attachedTag ? (
        <span className="font-mono font-bold tracking-tight">{attachedTag}</span>
      ) : null);

    const buttonBody = (
      <>
        {tileContent && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center bg-transparent transition-colors',
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
      const isExternal = href.startsWith('http') || target === '_blank';
      if (isExternal) {
        return (
          <a
            href={href}
            target={target || '_blank'}
            rel={rel || 'noopener noreferrer'}
            className={commonClasses}
          >
            {buttonBody}
          </a>
        );
      }
      return (
        <Link href={href} prefetch={true} className={commonClasses}>
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
 * Capsule Pill Input with Matching Button Aesthetics
 * Shares the same 2px continuous border, rounded-full pill geometry,
 * clean inline icon with zero color behind it, and focused states.
 * Incorporates Primary Brand Colors: Royal Blue (#0056FF), Azure Blue (#2277FF),
 * Soft Lavender (#E3E7FC), Black (#000000), and White (#FFFFFF).
 */
export interface GeometricInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'size'
> {
  variant?: 'outline' | 'blue' | 'azure' | 'soft-lavender' | 'black' | 'error';
  inputSize?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
  isLoading?: boolean;
}

export const GeometricInput = React.forwardRef<HTMLInputElement, GeometricInputProps>(
  (
    {
      className,
      variant = 'outline',
      inputSize = 'md',
      icon,
      clearable = false,
      onClear,
      isLoading = false,
      disabled,
      value,
      ...props
    },
    ref,
  ) => {
    const sizeClasses = {
      sm: 'h-8 px-3 text-xs gap-2 rounded-full',
      md: 'h-10 px-3.5 text-xs gap-2.5 rounded-full',
      lg: 'h-12 px-4 text-sm gap-3 rounded-full',
    }[inputSize];

    const variantStyles = {
      outline:
        'border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus-within:border-[#0056FF] hover:border-slate-300',
      blue: 'border-2 border-[#0056FF] bg-blue-50/40 text-slate-900 placeholder-slate-400 focus-within:border-[#0056FF] focus-within:bg-white',
      azure:
        'border-2 border-[#2277FF] bg-[#2277FF]/5 text-slate-900 placeholder-slate-400 focus-within:border-[#2277FF] focus-within:bg-white',
      'soft-lavender':
        'border-2 border-[#CAD3F5] bg-[#E3E7FC] text-[#000B26] placeholder-[#000B26]/50 focus-within:border-[#0056FF] focus-within:bg-white',
      black:
        'border-2 border-slate-900 bg-slate-100/80 text-slate-900 placeholder-slate-400 focus-within:border-black focus-within:bg-white',
      error:
        'border-2 border-rose-500 bg-rose-50/50 text-rose-950 placeholder-rose-300 focus-within:border-rose-600 focus-within:bg-white',
    }[variant];

    const iconColor = {
      outline: 'text-slate-400 group-focus-within:text-[#0056FF]',
      blue: 'text-[#0056FF]',
      azure: 'text-[#2277FF]',
      'soft-lavender': 'text-[#0056FF]',
      black: 'text-slate-900',
      error: 'text-rose-500',
    }[variant];

    const hasValue = value !== undefined && value !== null && String(value).length > 0;

    return (
      <div
        className={cn(
          'group relative flex w-full items-center font-sans tracking-tight transition-all duration-150 select-none',
          sizeClasses,
          variantStyles,
          disabled && 'pointer-events-none cursor-not-allowed opacity-50',
          className,
        )}
      >
        {icon && (
          <span
            className={cn(
              'flex shrink-0 items-center justify-center bg-transparent transition-colors',
              iconColor,
            )}
          >
            {icon}
          </span>
        )}
        <input
          ref={ref}
          disabled={disabled}
          value={value}
          data-geometric="true"
          style={{ outline: 'none', border: 'none', boxShadow: 'none' }}
          className="geometric-input-field w-full min-w-0 border-0 bg-transparent font-sans text-xs font-semibold text-slate-900 placeholder-slate-400 ring-0 outline-none focus:border-0 focus:ring-0 focus:outline-none focus-visible:border-0 focus-visible:ring-0 focus-visible:outline-none"
          {...props}
        />
        {isLoading && (
          <span className="flex shrink-0 items-center justify-center">
            <span className="size-3.5 animate-spin rounded-full border-2 border-slate-300 border-t-[#0056FF]" />
          </span>
        )}
        {clearable && hasValue && !disabled && !isLoading && (
          <button
            type="button"
            onClick={onClear}
            className="flex size-4 shrink-0 items-center justify-center rounded-full bg-slate-200/80 text-[10px] font-bold text-slate-600 transition-colors hover:bg-slate-300 hover:text-slate-900"
            aria-label="Clear text"
          >
            x
          </button>
        )}
      </div>
    );
  },
);

GeometricInput.displayName = 'GeometricInput';

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
