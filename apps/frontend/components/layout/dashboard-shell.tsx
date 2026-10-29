'use client';

import * as React from 'react';
import Link from 'next/link';

import { Award, BookOpen, Calendar, Check, Home, Layers, Plus, Settings, UserPlus, X } from '@/components/icons';
import { BottomNav, type BottomNavItem } from '@/components/ui/bottom-nav';
import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Fab } from '@/components/ui/fab';
import { Snackbar } from '@/components/ui/snackbar';
import { Tooltip } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { AcademicContextProvider } from '../providers/academic-context-provider';
import { AppSidebar } from './app-sidebar';
import { SidebarProvider, useSidebar } from './sidebar-context';
import { Topbar } from './topbar';

interface DashboardShellProps {
  children: React.ReactNode;
}

const BOTTOM_NAV_ITEMS: BottomNavItem[] = [
  { label: 'Home', href: '/dashboard', icon: Home },
  { label: 'Classes', href: '/classes', icon: BookOpen },
  { label: 'Attendance', href: '/attendance', icon: Calendar },
  { label: 'Scores', href: '/scores', icon: Award },
  { label: 'Settings', href: '/settings', icon: Settings },
];

const DashboardLayoutInner = ({ children }: DashboardShellProps) => {
  const { isCollapsed, mobileOpen, setMobileOpen } = useSidebar();
  const [quickActionsOpen, setQuickActionsOpen] = React.useState(false);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');

  const triggerSnackbar = (msg: string) => {
    setSnackbarMessage(msg);
    setSnackbarOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 transition-colors dark:bg-[#0E0E10] dark:text-zinc-100">
      {/* Pinned Desktop Sidebar with dynamic collapsible width */}
      <AppSidebar className="fixed inset-y-0 left-0 z-30 hidden lg:flex" />

      {/* Off-canvas Mobile Drawer */}
      {mobileOpen && (
        <div className="animate-in fade-in fixed inset-0 z-40 flex duration-200 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
            type="button"
          />
          <AppSidebar className="relative z-10" onClose={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main Responsive Content Container responding dynamically to sidebar collapse state */}
      <div
        className={cn(
          'min-w-0 flex-1 transition-[padding] duration-300 ease-in-out pb-20 lg:pb-8',
          isCollapsed ? 'lg:pl-[76px]' : 'lg:pl-[272px]',
        )}
      >
        <Topbar onOpenNavigation={() => setMobileOpen(true)} />
        <main className="mx-auto w-full max-w-[1500px] p-4 transition-all duration-300 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

      {/* Floating Action Button (FAB) for Quick School Operations */}
      <Tooltip content="Quick School Actions" position="left">
        <Fab
          icon={<Plus className="size-6" />}
          label="Quick Actions"
          onClick={() => setQuickActionsOpen(true)}
          className="bottom-20 right-4 lg:bottom-6 lg:right-6"
        />
      </Tooltip>

      {/* Quick Actions Bottom Sheet (Slides up from bottom edge) */}
      <BottomSheet
        open={quickActionsOpen}
        onClose={() => setQuickActionsOpen(false)}
        title="Quick School Actions"
      >
        <div className="grid grid-cols-2 gap-3 py-2 sm:grid-cols-3">
          <Link
            href="/attendance"
            onClick={() => {
              setQuickActionsOpen(false);
              triggerSnackbar('Navigating to Attendance Roll-Call');
            }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-[#161619] dark:hover:bg-[#202024]"
          >
            <Calendar className="size-6 text-emerald-500" />
            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">Take Attendance</span>
          </Link>

          <Link
            href="/scores"
            onClick={() => {
              setQuickActionsOpen(false);
              triggerSnackbar('Navigating to Grade Entry');
            }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-[#161619] dark:hover:bg-[#202024]"
          >
            <Award className="size-6 text-amber-500" />
            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">Enter Scores</span>
          </Link>

          <Link
            href="/students/new"
            onClick={() => {
              setQuickActionsOpen(false);
              triggerSnackbar('Opening Student Registration');
            }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-[#161619] dark:hover:bg-[#202024]"
          >
            <UserPlus className="size-6 text-sky-500" />
            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">New Student</span>
          </Link>

          <Link
            href="/classes"
            onClick={() => {
              setQuickActionsOpen(false);
              triggerSnackbar('Navigating to Classes');
            }}
            className="flex flex-col items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center transition-all hover:bg-slate-100 dark:border-white/10 dark:bg-[#161619] dark:hover:bg-[#202024]"
          >
            <BookOpen className="size-6 text-indigo-500" />
            <span className="text-xs font-medium text-slate-800 dark:text-zinc-200">Manage Classes</span>
          </Link>

          <Link
            href="/settings/components"
            onClick={() => {
              setQuickActionsOpen(false);
              triggerSnackbar('Opening 10 Core UI Components Guide');
            }}
            className="col-span-2 flex items-center justify-center gap-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/5 p-4 text-center transition-all hover:bg-emerald-500/10 sm:col-span-2 dark:border-emerald-500/30 dark:bg-emerald-500/10"
          >
            <Layers className="size-5 text-emerald-500" />
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">10 UI Components Guide</span>
          </Link>
        </div>
      </BottomSheet>

      {/* Global Snackbar Toast Confirmation */}
      <Snackbar
        open={snackbarOpen}
        message={snackbarMessage}
        actionLabel="Dismiss"
        onAction={() => setSnackbarOpen(false)}
        onClose={() => setSnackbarOpen(false)}
        duration={4000}
      />

      {/* Bottom Navigation for Mobile Viewports (Thumbs zone) */}
      <BottomNav items={BOTTOM_NAV_ITEMS} />
    </div>
  );
};

export const DashboardShell = ({ children }: DashboardShellProps) => {
  return (
    <AcademicContextProvider>
      <SidebarProvider>
        <DashboardLayoutInner>{children}</DashboardLayoutInner>
      </SidebarProvider>
    </AcademicContextProvider>
  );
};
