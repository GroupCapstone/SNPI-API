'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Layers,
  Sparkles,
  Shield,
  CreditCard,
  Bell,
  ArrowRight,
  ExternalLink,
  Code,
  Compass,
} from '@/components/icons';

// ============================================================================
// NAVIGATION MENU COMPOUND COMPONENTS
// ============================================================================

interface NavigationMenuContextValue {
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
  closeTimerRef: React.MutableRefObject<NodeJS.Timeout | null>;
}

const NavigationMenuContext = React.createContext<NavigationMenuContextValue | null>(null);

function useNavigationMenu() {
  const context = React.useContext(NavigationMenuContext);
  if (!context) {
    throw new Error('NavigationMenu components must be used within a NavigationMenu provider');
  }
  return context;
}

export interface NavigationMenuProps extends React.HTMLAttributes<HTMLElement> {
  value?: string | null;
  onValueChange?: (val: string | null) => void;
  viewport?: boolean;
}

export function NavigationMenu({
  className,
  children,
  viewport = true,
  ...props
}: NavigationMenuProps) {
  const [activeItem, setActiveItem] = React.useState<string | null>(null);
  const closeTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  const contextValue = React.useMemo(
    () => ({
      activeItem,
      setActiveItem: (id: string | null) => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setActiveItem(id);
      },
      closeTimerRef,
    }),
    [activeItem],
  );

  return (
    <NavigationMenuContext.Provider value={contextValue}>
      <nav
        className={cn('relative z-50 flex max-w-max flex-1 items-center justify-center', className)}
        onMouseLeave={() => {
          closeTimerRef.current = setTimeout(() => {
            setActiveItem(null);
          }, 200);
        }}
        {...props}
      >
        {children}
      </nav>
    </NavigationMenuContext.Provider>
  );
}

export function NavigationMenuList({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLUListElement>) {
  return (
    <ul
      className={cn('group flex flex-1 list-none items-center justify-center gap-1', className)}
      {...props}
    >
      {children}
    </ul>
  );
}

export function NavigationMenuItem({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) {
  return (
    <li className={cn('relative', className)} {...props}>
      {children}
    </li>
  );
}

export interface NavigationMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string;
}

export function NavigationMenuTrigger({
  value,
  className,
  children,
  ...props
}: NavigationMenuTriggerProps) {
  const { activeItem, setActiveItem, closeTimerRef } = useNavigationMenu();
  const isOpen = activeItem === value;

  return (
    <button
      type="button"
      className={cn(
        'group inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3.5 py-1.5 font-sans text-xs font-semibold transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
        isOpen
          ? 'bg-white/10 text-white shadow-inner'
          : 'text-slate-300 hover:bg-white/5 hover:text-white',
        className,
      )}
      onClick={() => setActiveItem(isOpen ? null : value)}
      onMouseEnter={() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
        setActiveItem(value);
      }}
      aria-expanded={isOpen}
      {...props}
    >
      {children}
      <ChevronDown
        className={cn('ml-1 size-3 transition-transform duration-200', isOpen && 'rotate-180')}
      />
    </button>
  );
}

export interface NavigationMenuLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  asChild?: boolean;
  render?: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => React.ReactNode;
  active?: boolean;
}

export function NavigationMenuLink({
  asChild = false,
  render,
  active = false,
  className,
  children,
  href = '#',
  ...props
}: NavigationMenuLinkProps) {
  const anchorProps = {
    href,
    className: cn(
      'inline-flex h-9 w-max items-center justify-center rounded-[4px] px-3.5 py-1.5 font-sans text-xs font-medium transition-colors hover:text-white focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50',
      active ? 'font-bold text-white' : 'text-slate-400',
      className,
    ),
    ...props,
  };

  if (render) {
    return <>{render(anchorProps)}</>;
  }

  return <a {...anchorProps}>{children}</a>;
}

export interface NavigationMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function NavigationMenuContent({
  value,
  className,
  children,
  ...props
}: NavigationMenuContentProps) {
  const { activeItem, setActiveItem, closeTimerRef } = useNavigationMenu();
  const isOpen = activeItem === value;

  if (!isOpen) return null;

  return (
    <div
      onMouseEnter={() => {
        if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
      }}
      onMouseLeave={() => {
        closeTimerRef.current = setTimeout(() => {
          setActiveItem(null);
        }, 200);
      }}
      className={cn(
        'animate-in fade-in zoom-in-95 absolute top-full left-1/2 z-50 mt-3 -translate-x-1/2 overflow-hidden rounded-2xl border border-slate-800 bg-[#0A0D14]/95 p-4 text-white shadow-2xl backdrop-blur-2xl transition-all duration-200',
        'w-[min(calc(100vw-2rem),520px)]',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// ============================================================================
// OFFICIAL RARE UI FLOATING 3-ISLAND HEADER COMPONENT
// ============================================================================

/**
 * RareUiNavigationMenu
 *
 * Implements the exact 3-island floating dark pill navigation dock from the reference:
 * - Island 1 (Left): [ 🌸 Rare UI ] Brand Pill with coral flower logo
 * - Island 2 (Center): [ Home | Components (Mega Menu) | Sponsors ] Links Pill
 * - Island 3 (Right): [ 🐙 1866 ] GitHub stars pill + [ 🌓 ] Theme toggle circle
 *
 * Fully adheres to the Navigation Menu usage policy:
 * - Top-level items open mega menu panels laid out with summaries in columns, glyphs, and a CTA card.
 * - Header rows mix panel triggers with plain links styled seamlessly.
 * - Hash placeholders ready for real router routes.
 */
export function RareUiNavigationMenu({ className }: { className?: string }) {
  const [activeTab, setActiveTab] = React.useState('components');
  const [stars, setStars] = React.useState(1866);
  const [isStarred, setIsStarred] = React.useState(false);
  const [isDark, setIsDark] = React.useState(true);

  return (
    <div
      className={cn(
        'relative flex w-full flex-col items-center justify-center py-6 select-none',
        className,
      )}
    >
      {/* Floating 3-Island Header Row */}
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
        {/* ISLAND 1: Brand Capsule Pill [ 🌸 Rare UI ] */}
        <div className="flex h-11 items-center gap-2 rounded-full border border-slate-800/90 bg-[#0A0D14] px-4 py-2 text-white shadow-2xl backdrop-blur-xl transition-transform hover:scale-[1.02]">
          {/* Rare UI Coral Flower Mark */}
          <svg
            className="size-4.5 fill-[#FF5500] text-[#FF5500]"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2a3 3 0 0 0-3 3c0 .54.14 1.05.39 1.49C8.07 6.18 6.7 6.64 5.76 7.76A3 3 0 0 0 5 12a3 3 0 0 0 2.24 2.89c-.66.86-.96 1.95-.76 3.03.35 1.83 1.96 3.1 3.82 2.98 1.03-.07 1.96-.58 2.55-1.37.59.79 1.52 1.3 2.55 1.37 1.86.12 3.47-1.15 3.82-2.98.2-1.08-.1-2.17-.76-3.03A3 3 0 0 0 21 12a3 3 0 0 0-.76-4.24c-.94-1.12-2.31-1.58-3.63-1.27.25-.44.39-.95.39-1.49a3 3 0 0 0-5-2z" />
          </svg>
          <span className="font-sans text-sm font-black tracking-tight text-white">Rare UI</span>
        </div>

        {/* ISLAND 2: Center Navigation Menu Pill [ Home | Components | Sponsors ] */}
        <NavigationMenu className="h-11 rounded-full border border-slate-800/90 bg-[#0A0D14] px-3 shadow-2xl backdrop-blur-xl">
          <NavigationMenuList className="gap-1.5">
            {/* Plain Link: Home */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#home"
                active={activeTab === 'home'}
                onClick={() => setActiveTab('home')}
                className="hover:text-white"
              >
                Home
              </NavigationMenuLink>
            </NavigationMenuItem>

            <span className="font-mono text-xs text-slate-800">|</span>

            {/* Mega Menu Trigger: Components */}
            <NavigationMenuItem>
              <NavigationMenuTrigger
                value="components"
                onClick={() => setActiveTab('components')}
                className={cn(activeTab === 'components' && 'font-bold text-white')}
              >
                Components
              </NavigationMenuTrigger>

              {/* Mega Menu Panel (Columns with Summaries, Glyphs & CTA) */}
              <NavigationMenuContent value="components">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
                  {/* Left Column: Featured Component Showcase Card */}
                  <div className="flex flex-col justify-between rounded-xl border border-slate-800 bg-gradient-to-br from-[#111622] to-[#0A0D14] p-4 sm:col-span-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="size-2 animate-pulse rounded-full bg-amber-400" />
                        <span className="font-mono text-[10px] font-bold text-amber-400 uppercase">
                          Featured
                        </span>
                      </div>
                      <h4 className="mt-2 font-sans text-sm font-extrabold text-white">
                        Border Beam Card
                      </h4>
                      <p className="mt-1 font-sans text-[11px] leading-relaxed text-slate-400">
                        Matte instrument login card with continuous constant-velocity 4-dash amber
                        ray.
                      </p>
                    </div>

                    <a
                      href="#comp-border-beam"
                      className="group/cta mt-4 inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#38BDF8] hover:text-white"
                    >
                      <span>Explore Beam</span>
                      <ArrowRight className="size-3 transition-transform group-hover/cta:translate-x-1" />
                    </a>
                  </div>

                  {/* Right Column: Key Navigation Panels with Glyphs & Summaries */}
                  <div className="flex flex-col justify-between gap-2.5 sm:col-span-7">
                    <a
                      href="#comp-snackbar"
                      className="group/item flex items-start gap-3 rounded-[4px] p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-800 bg-[#161B26] text-[#38BDF8]">
                        <Bell className="size-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                            Native Snackbar
                          </span>
                          <span className="py-0.2 rounded bg-emerald-500/20 px-1 font-mono text-[9px] text-emerald-400">
                            v2
                          </span>
                        </div>
                        <p className="font-sans text-[11px] text-slate-400">
                          Bottom-anchored obsidian surface with live countdown progress.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#comp-hanging-tabs-nav"
                      className="group/item flex items-start gap-3 rounded-[4px] p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-800 bg-[#161B26] text-amber-400">
                        <Compass className="size-3.5" />
                      </div>
                      <div>
                        <span className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                          Hanging Tabs Nav
                        </span>
                        <p className="font-sans text-[11px] text-slate-400">
                          Inverted trapezoid folder tabs suspended from the ceiling baseline.
                        </p>
                      </div>
                    </a>

                    <a
                      href="#interactive-feed"
                      className="group/item flex items-start gap-3 rounded-[4px] p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-[4px] border border-slate-800 bg-[#161B26] text-purple-400">
                        <Layers className="size-3.5" />
                      </div>
                      <div>
                        <span className="font-sans text-xs font-bold text-slate-100 group-hover/item:text-white">
                          65 Core Components
                        </span>
                        <p className="font-sans text-[11px] text-slate-400">
                          Single-feed component catalog and mathematical design tokens.
                        </p>
                      </div>
                    </a>
                  </div>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <span className="font-mono text-xs text-slate-800">|</span>

            {/* Plain Link: Sponsors */}
            <NavigationMenuItem>
              <NavigationMenuLink
                href="#sponsors"
                active={activeTab === 'sponsors'}
                onClick={() => setActiveTab('sponsors')}
                className="hover:text-white"
              >
                Sponsors
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        {/* ISLAND 3: GitHub Stars Pill [ 🐙 1866 ] */}
        <button
          type="button"
          onClick={() => {
            setIsStarred(!isStarred);
            setStars((prev) => (isStarred ? prev - 1 : prev + 1));
          }}
          className={cn(
            'flex h-11 items-center gap-2 rounded-[4px] border px-4 py-2 font-mono text-xs font-bold shadow-2xl backdrop-blur-xl transition-all active:scale-95',
            isStarred
              ? 'border-amber-500/50 bg-amber-500/10 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
              : 'border-slate-800/90 bg-[#0A0D14] text-white hover:border-slate-700',
          )}
        >
          {/* GitHub Octocat Mark */}
          <svg className="size-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.53 1.03 1.53 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.137 20.164 22 16.42 22 12c0-5.523-4.477-10-10-10z" />
          </svg>
          <span className="tabular-nums">{stars}</span>
        </button>

        {/* ISLAND 4: Theme Toggle Circle Button [ 🌓 ] */}
        <button
          type="button"
          onClick={() => setIsDark(!isDark)}
          title={isDark ? 'Switch to Light' : 'Switch to Dark'}
          className="flex size-11 items-center justify-center rounded-[4px] border border-slate-800/90 bg-[#0A0D14] text-white shadow-2xl backdrop-blur-xl transition-all hover:scale-105 hover:border-slate-700 active:scale-95"
        >
          {/* Half-circle contrast icon */}
          <svg className="size-4 fill-current" viewBox="0 0 24 24">
            <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 0 1 0-16v16z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
