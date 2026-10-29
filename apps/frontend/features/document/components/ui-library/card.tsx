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
        'rounded-2xl border border-white/10 bg-[#161619] p-4 text-zinc-100 shadow-none transition-colors duration-150',
        interactive && 'cursor-pointer hover:bg-[#1C1C20] hover:border-white/20 active:bg-[#202024]',
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
    <h3 className={cn('text-base font-medium tracking-tight text-zinc-100', className)} {...props}>
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
    <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props}>
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
      className={cn('relative mb-3 aspect-video w-full overflow-hidden rounded-xl bg-[#202024] border border-white/5', className)}
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
    <div className={cn('mt-4 flex items-center justify-between border-t border-white/5 pt-3', className)} {...props}>
      {children}
    </div>
  );
}
