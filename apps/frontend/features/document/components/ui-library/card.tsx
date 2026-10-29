'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LibraryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  interactive?: boolean;
}

export function LibraryCard({
  interactive = false,
  className,
  children,
  ...props
}: LibraryCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white/90 p-5 text-slate-900 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.8),_0_2px_8px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all duration-200',
        interactive &&
          'cursor-pointer hover:-translate-y-1 hover:border-[#0056FF]/40 hover:bg-white hover:shadow-[0_12px_28px_rgba(0,86,255,0.08)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function LibraryCardHeader({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-3 flex items-start justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
}

export function LibraryCardTitle({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('text-base font-bold tracking-tight text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function LibraryCardDescription({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs leading-relaxed text-slate-600', className)} {...props}>
      {children}
    </p>
  );
}

export function LibraryCardMedia({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mb-4 overflow-hidden rounded-xl', className)} {...props}>
      {children}
    </div>
  );
}

export function LibraryCardFooter({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-4 flex items-center justify-between gap-3', className)} {...props}>
      {children}
    </div>
  );
}
