'use client';

import * as React from 'react';
import { Moon, Sun } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface ThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export function ThemeToggle({ className, ...props }: ThemeToggleProps) {
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const currentTheme =
      document.documentElement.getAttribute('data-theme') === 'dark' ||
      document.documentElement.classList.contains('dark')
        ? 'dark'
        : 'light';
    setTheme(currentTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);

    document.documentElement.setAttribute('data-theme', nextTheme);
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    try {
      localStorage.setItem('snp-theme', nextTheme);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'inline-flex h-9 w-9 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 disabled:pointer-events-none disabled:opacity-50 dark:border-white/10 dark:bg-[#161619] dark:text-zinc-300 dark:hover:bg-[#202024] dark:hover:text-zinc-100',
        className,
      )}
      {...props}
    >
      {mounted && theme === 'dark' ? (
        <Sun className="size-4 shrink-0 text-amber-400" />
      ) : (
        <Moon className="size-4 shrink-0 text-slate-600 dark:text-zinc-300" />
      )}
    </button>
  );
}
