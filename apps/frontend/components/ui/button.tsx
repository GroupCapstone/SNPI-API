import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-slate-900 text-white shadow-none hover:bg-slate-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200',
        outline:
          'border border-slate-200 bg-white text-slate-700 shadow-none hover:bg-slate-50 dark:border-white/10 dark:bg-[#161619] dark:text-zinc-200 dark:hover:bg-[#202024]',
        ghost:
          'text-slate-700 shadow-none hover:bg-slate-100 dark:text-zinc-300 dark:hover:bg-[#202024] dark:hover:text-zinc-100',
        destructive:
          'bg-rose-600 text-white shadow-none hover:bg-rose-700 dark:bg-rose-600 dark:hover:bg-rose-500',
        secondary:
          'bg-slate-100 text-slate-900 shadow-none hover:bg-slate-200 dark:bg-[#202024] dark:text-zinc-100 dark:hover:bg-[#2E2E33]',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
