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
        'rounded-xl border border-slate-200 bg-white p-5 text-slate-900 shadow-xs transition-all duration-150',
        interactive && 'cursor-pointer hover:border-slate-300 hover:bg-slate-50/50 hover:shadow-sm',
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
    <p className={cn('text-xs text-slate-600 leading-relaxed', className)} {...props}>
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
    <div
      className={cn('relative mb-3 aspect-video w-full overflow-hidden rounded-lg bg-slate-100 border border-slate-200', className)}
      {...props}
    >
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
    <div className={cn('mt-4 flex items-center justify-between border-t border-slate-100 pt-3', className)} {...props}>
      {children}
    </div>
  );
}
