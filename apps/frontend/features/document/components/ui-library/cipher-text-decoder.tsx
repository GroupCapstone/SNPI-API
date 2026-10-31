'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Terminal, Activity, Play, Pause, RotateCw, Check, ShieldCheck } from '@/components/icons';

export const CIPHER_GLYPHS = 'ABCDEF0123456789!@#$%^&*<>/-_+=~?';

export interface CipherCharState {
  char: string;
  isLocked: boolean;
  isSpace: boolean;
}

export interface UseCipherDecoderOptions {
  text: string;
  staggerMs?: number; // 01: Wave stagger per character
  jitterMs?: number; // 01: Random jitter to prevent mechanical feel
  durationMs?: number; // Total resolution time per character
  throttleMs?: number; // 02: Resolving characters re-roll at most every 50ms
  autoStart?: boolean;
  prefersReducedMotion?: boolean;
  onLockedCountChange?: (locked: number, total: number) => void;
  onComplete?: () => void;
}

/**
 * useCipherDecoder
 *
 * Implements the 8-pillar per-character cipher decode engine:
 * 01 Per-Character Timeline: Each char has a staggered start/end time + jitter.
 * 02 Throttled Glyphs: Re-rolls every 50ms for shimmer rather than strobe.
 * 03 Monospace Lock: Fixed width per character avoids layout shift.
 * 04 Stable Lines: Container preserves height during decoding.
 * 05 Space-Aware: Spaces resolve to spaces immediately.
 * 06 No HTML Strings: Produces pure React state items, zero HTML parsing.
 * 07 Quiet for Screen Readers: Plain aria attributes & sr-only labels.
 * 08 Pause & Fallback: Visibility listener & prefers-reduced-motion guard.
 */
export function useCipherDecoder({
  text,
  staggerMs = 24,
  jitterMs = 40,
  durationMs = 450,
  throttleMs = 50,
  autoStart = true,
  prefersReducedMotion = false,
  onLockedCountChange,
  onComplete,
}: UseCipherDecoderOptions) {
  const [chars, setChars] = React.useState<CipherCharState[]>(() =>
    text.split('').map((c) => ({
      char: c,
      isLocked: true,
      isSpace: c === ' ',
    })),
  );

  const [lockedCount, setLockedCount] = React.useState<number>(text.length);
  const [isDecoding, setIsDecoding] = React.useState<boolean>(false);
  const rafIdRef = React.useRef<number | null>(null);

  const startDecode = React.useCallback(() => {
    if (prefersReducedMotion) {
      setChars(
        text.split('').map((c) => ({
          char: c,
          isLocked: true,
          isSpace: c === ' ',
        })),
      );
      setLockedCount(text.length);
      setIsDecoding(false);
      onLockedCountChange?.(text.length, text.length);
      onComplete?.();
      return;
    }

    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }

    const characters = text.split('');
    const totalChars = characters.length;

    // Build timeline descriptors per character
    const timelines = characters.map((targetChar, index) => {
      const isSpace = targetChar === ' ';
      if (isSpace) {
        return {
          targetChar: ' ',
          isSpace: true,
          startTime: 0,
          endTime: 0,
          lastReroll: 0,
          currentGlyph: ' ',
          locked: true,
        };
      }

      // 01 Per-Character Timeline: Stagger + Random Jitter
      const startTime = index * staggerMs + Math.random() * jitterMs;
      const endTime = startTime + durationMs;
      const initialGlyph = CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];

      return {
        targetChar,
        isSpace: false,
        startTime,
        endTime,
        lastReroll: 0,
        currentGlyph: initialGlyph,
        locked: false,
      };
    });

    const startTime = performance.now();
    setIsDecoding(true);

    const updateFrame = (now: number) => {
      const elapsed = now - startTime;
      let newlyLocked = 0;

      const nextChars: CipherCharState[] = timelines.map((item) => {
        if (item.isSpace) {
          newlyLocked++;
          return { char: ' ', isLocked: true, isSpace: true };
        }

        if (elapsed >= item.endTime) {
          // Character is fully locked
          item.locked = true;
          newlyLocked++;
          return { char: item.targetChar, isLocked: true, isSpace: false };
        }

        if (elapsed >= item.startTime) {
          // 02 Throttled Glyphs: Re-roll at most every 50ms
          if (now - item.lastReroll >= throttleMs) {
            item.currentGlyph = CIPHER_GLYPHS[Math.floor(Math.random() * CIPHER_GLYPHS.length)];
            item.lastReroll = now;
          }
          return { char: item.currentGlyph, isLocked: false, isSpace: false };
        }

        // Before start time (pending wave)
        return { char: item.currentGlyph, isLocked: false, isSpace: false };
      });

      setChars(nextChars);
      setLockedCount(newlyLocked);
      onLockedCountChange?.(newlyLocked, totalChars);

      if (newlyLocked >= totalChars) {
        setIsDecoding(false);
        rafIdRef.current = null;
        onComplete?.();
      } else {
        rafIdRef.current = requestAnimationFrame(updateFrame);
      }
    };

    rafIdRef.current = requestAnimationFrame(updateFrame);
  }, [
    text,
    staggerMs,
    jitterMs,
    durationMs,
    throttleMs,
    prefersReducedMotion,
    onLockedCountChange,
    onComplete,
  ]);

  React.useEffect(() => {
    if (autoStart) {
      startDecode();
    }
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
    };
  }, [text, autoStart, startDecode]);

  return {
    chars,
    lockedCount,
    totalChars: text.length,
    isDecoding,
    startDecode,
  };
}

export interface ScrambleNavLinkProps {
  label: string;
  href?: string;
  isActive?: boolean;
  theme?: 'light' | 'dark';
}

/**
 * ScrambleNavLink
 *
 * Interactive Nav Link that decodes its characters in-place on hover or keyboard tab focus.
 * 07 Quiet for Screen Readers: Clean aria-label, characters are aria-hidden.
 */
export function ScrambleNavLink({
  label,
  href = '#',
  isActive = false,
  theme = 'light',
}: ScrambleNavLinkProps) {
  const isDark = theme === 'dark';
  const { chars, startDecode, isDecoding } = useCipherDecoder({
    text: label,
    staggerMs: 14,
    jitterMs: 25,
    durationMs: 220,
    throttleMs: 45,
    autoStart: false,
  });

  return (
    <a
      href={href}
      aria-label={label}
      onMouseEnter={() => startDecode()}
      onFocus={() => startDecode()}
      className={cn(
        'group relative inline-flex items-center justify-center rounded-[4px] px-3 py-1.5 font-mono text-xs font-semibold tracking-wider transition-all duration-150 outline-none',
        'focus-visible:ring-2 focus-visible:ring-[#0056FF]',
        isActive
          ? isDark
            ? 'bg-slate-800 text-[#38BDF8]'
            : 'bg-[#E3E7FC] text-[#0056FF]'
          : isDark
            ? 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950',
      )}
    >
      {/* 07 Quiet for Screen Readers: Animated layer is aria-hidden */}
      <span aria-hidden="true" className="inline-flex select-none">
        {chars.map((item, idx) => (
          <span
            key={idx}
            className={cn(
              'inline-block w-[0.62em] text-center transition-colors duration-100',
              item.isLocked
                ? isActive
                  ? isDark
                    ? 'text-[#38BDF8]'
                    : 'text-[#0056FF]'
                  : isDark
                    ? 'text-slate-200 group-hover:text-white'
                    : 'text-slate-800 group-hover:text-slate-950'
                : 'text-[#0056FF] opacity-90 dark:text-[#38BDF8]',
            )}
          >
            {item.isSpace ? '\u00A0' : item.char}
          </span>
        ))}
      </span>
    </a>
  );
}

export interface CipherTextDecoderProps {
  theme?: 'light' | 'dark';
  className?: string;
}

const DEFAULT_PHRASES = [
  'NEXT-GEN MULTI-CAMPUS INTELLIGENCE',
  'ACID-COMPLIANT DISTRIBUTED MONOLITH',
  'CRYPTOGRAPHIC IDENTITY VERIFICATION',
  'REAL-TIME TELEMETRY & ATTENDANCE',
];

const NAV_ITEMS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'modules', label: 'MODULES' },
  { id: 'security', label: 'SECURITY' },
  { id: 'documents', label: 'DOCUMENTS' },
  { id: 'telemetry', label: 'TELEMETRY' },
];

/**
 * CipherTextDecoder
 *
 * Full-scale instrument panel demo incorporating:
 * - Hover / tab through nav links to decode in-place
 * - Headline cycling 4 phrases with per-character stagger & jitter
 * - Footer live character lock telemetry counter
 * - Full 8-pillar specification adherence
 */
export function CipherTextDecoder({ theme = 'light', className }: CipherTextDecoderProps) {
  const isDark = theme === 'dark';

  // 08 Pause & Fallback: Reduced Motion Detection
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false);
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      setPrefersReducedMotion(mq.matches);
      const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
      mq.addEventListener?.('change', handler);
      return () => mq.removeEventListener?.('change', handler);
    }
  }, []);

  // 08 Pause & Fallback: Visibility Detection (Pauses when tab hidden)
  const [isDocumentHidden, setIsDocumentHidden] = React.useState(false);
  React.useEffect(() => {
    const handleVisibility = () => {
      setIsDocumentHidden(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const [activeNav, setActiveNav] = React.useState('overview');
  const [phraseIndex, setPhraseIndex] = React.useState(0);
  const [isPaused, setIsPaused] = React.useState(false);
  const currentPhrase = DEFAULT_PHRASES[phraseIndex];

  // Scramble engine for the main headline
  const { chars, lockedCount, totalChars, isDecoding, startDecode } = useCipherDecoder({
    text: currentPhrase,
    staggerMs: 22,
    jitterMs: 35,
    durationMs: 400,
    throttleMs: 50, // 02: Resolving characters re-roll at most every 50ms
    autoStart: true,
    prefersReducedMotion,
  });

  // Cycle through four phrases automatically
  React.useEffect(() => {
    if (isPaused || isDocumentHidden || prefersReducedMotion) return;

    if (!isDecoding) {
      // Pause 3.5 seconds on the resolved phrase before advancing
      const timer = setTimeout(() => {
        setPhraseIndex((prev) => (prev + 1) % DEFAULT_PHRASES.length);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [isDecoding, isPaused, isDocumentHidden, prefersReducedMotion]);

  const lockPercentage = totalChars > 0 ? Math.round((lockedCount / totalChars) * 100) : 100;

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden transition-colors duration-150 max-sm:rounded-none max-sm:border-x-0 max-sm:border-y sm:rounded-2xl sm:border',
        isDark
          ? 'border-slate-800 bg-[#000B26] text-slate-100'
          : 'border-slate-200/90 bg-white text-slate-900',
        className,
      )}
    >
      {/* ======================================================== */}
      {/* 1. TOP NAV BAR: Hover or tab to decode in-place           */}
      {/* ======================================================== */}
      <header
        className={cn(
          'flex flex-wrap items-center justify-between gap-3 border-b px-5 py-3.5',
          isDark ? 'border-slate-800 bg-slate-900/60' : 'border-slate-100 bg-slate-50/70',
        )}
      >
        <div className="flex items-center gap-2.5">
          <Terminal className="size-5 text-[#0056FF]" />
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold tracking-tight">
            <span className={isDark ? 'text-white' : 'text-slate-950'}>CIPHER.IO</span>
            <span className="text-slate-400">/</span>
            <span className="text-[#0056FF] dark:text-[#38BDF8]">SYS_V2</span>
          </div>
        </div>

        {/* Navigation Links with in-place scramble */}
        <nav aria-label="Cipher Navigation" className="flex flex-wrap items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.id} onClick={() => setActiveNav(item.id)}>
              <ScrambleNavLink label={item.label} isActive={activeNav === item.id} theme={theme} />
            </div>
          ))}
        </nav>
      </header>

      {/* ======================================================== */}
      {/* 2. CENTER HEADLINE: Cycles 4 phrases with stable lines    */}
      {/* ======================================================== */}
      <div className="relative p-6 sm:p-10">
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <span className="inline-flex items-center gap-1.5 font-mono text-[11px] font-bold tracking-wider text-[#0056FF] uppercase dark:text-[#38BDF8]">
              <ShieldCheck className="size-3.5" />
              <span>Cryptographic Typographic Stream</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-400">
                PHRASE {phraseIndex + 1} / {DEFAULT_PHRASES.length}
              </span>
            </div>
          </div>

          {/* 07 Quiet for Screen Readers: Semantic h1 with screen-reader only text */}
          <h1 className="relative">
            <span className="sr-only">{currentPhrase}</span>

            {/* 04 Stable Lines: Minimum height block prevents layout collapse mid-decode */}
            <div
              aria-hidden="true"
              className={cn(
                'flex min-h-[72px] flex-wrap items-center font-mono text-2xl font-black tracking-tight sm:min-h-[88px] sm:text-3xl md:text-4xl',
                'leading-tight transition-colors duration-150 select-none',
              )}
            >
              {/* 06 No HTML Strings: Pure React spans in virtual DOM */}
              {chars.map((item, index) => {
                // 05 Space-Aware: Immediate whitespace preservation
                if (item.isSpace) {
                  return (
                    <span key={index} className="inline-block w-[0.45em] text-transparent">
                      &nbsp;
                    </span>
                  );
                }

                return (
                  // 03 Monospace Lock: Exact width font-mono span prevents displacement
                  <span
                    key={index}
                    className={cn(
                      'inline-block w-[0.62em] text-center transition-colors duration-75',
                      item.isLocked
                        ? isDark
                          ? 'text-white'
                          : 'text-slate-950'
                        : 'text-[#0056FF] opacity-90 dark:text-[#38BDF8]',
                    )}
                  >
                    {item.char}
                  </span>
                );
              })}
            </div>
          </h1>

          <p
            className={cn(
              'max-w-xl font-sans text-xs leading-relaxed',
              isDark ? 'text-slate-400' : 'text-slate-600',
            )}
          >
            Hover or tab through the nav links above to decode them in place. The headline wave
            resolves left-to-right with per-character stagger and pseudo-random jitter, while spaces
            resolve instantly.
          </p>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 3. FOOTER: Counts characters as they lock & controls      */}
      {/* ======================================================== */}
      <footer
        className={cn(
          'flex flex-col justify-between gap-4 border-t px-5 py-3.5 sm:flex-row sm:items-center',
          isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50/70',
        )}
      >
        {/* Character Lock Telemetry Counter */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'flex size-2 rounded-full',
                isDecoding ? 'animate-ping bg-amber-500' : 'bg-emerald-500',
              )}
            />
            <span className="font-mono text-xs font-bold tracking-tight">
              {isDecoding ? (
                <span className="text-amber-600 dark:text-amber-400">DECODING...</span>
              ) : (
                <span className="text-emerald-600 dark:text-emerald-400">LOCKED</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className="text-slate-400">CHARS:</span>
            <span
              className={cn('font-bold tabular-nums', isDark ? 'text-white' : 'text-slate-950')}
            >
              {lockedCount}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-500">{totalChars}</span>
            <span className="text-slate-400">({lockPercentage}%)</span>
          </div>

          {/* Mini Progress Bar */}
          <div
            className={cn(
              'h-1.5 w-24 overflow-hidden rounded-full border',
              isDark ? 'border-slate-700 bg-slate-800' : 'border-slate-200 bg-slate-200/60',
            )}
          >
            <div
              className="h-full bg-[#0056FF] transition-all duration-100 ease-out dark:bg-[#38BDF8]"
              style={{ width: `${lockPercentage}%` }}
            />
          </div>

          {/* Engine Parameters Stamp */}
          <div className="hidden items-center gap-2 font-mono text-[10px] text-slate-400 md:flex">
            <span>[RATE: 50ms]</span>
            <span>[STAGGER: 22ms]</span>
            <span>[JITTER: ±35ms]</span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Re-roll trigger */}
          <button
            type="button"
            onClick={() => startDecode()}
            disabled={isDecoding}
            aria-label="Re-roll cipher"
            className={cn(
              'flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors',
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white disabled:opacity-50'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF] hover:text-[#0056FF] disabled:opacity-50',
            )}
          >
            <RotateCw className={cn('size-3', isDecoding && 'animate-spin')} />
            <span>RE-ROLL</span>
          </button>

          {/* Pause / Play */}
          <button
            type="button"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? 'Resume cycle' : 'Pause cycle'}
            className={cn(
              'flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors',
              isPaused
                ? 'border-amber-500/50 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : isDark
                  ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF]',
            )}
          >
            {isPaused ? (
              <>
                <Play className="size-3" />
                <span>RESUME</span>
              </>
            ) : (
              <>
                <Pause className="size-3" />
                <span>PAUSE</span>
              </>
            )}
          </button>

          {/* Next phrase */}
          <button
            type="button"
            onClick={() => {
              setPhraseIndex((prev) => (prev + 1) % DEFAULT_PHRASES.length);
            }}
            aria-label="Next headline phrase"
            className={cn(
              'rounded-[4px] border px-2.5 py-1 font-mono text-[11px] font-bold transition-colors',
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-700 hover:border-[#0056FF]',
            )}
          >
            NEXT
          </button>
        </div>
      </footer>
    </div>
  );
}

/**
 * CipherTextDecoderDemo
 *
 * Interactive documentation library preview wrapper.
 */
export function CipherTextDecoderDemo() {
  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2 font-mono text-xs font-bold text-slate-500 uppercase">
          <span>Cryptographic Decryption Surface</span>
        </div>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500">
          <Activity className="size-3 text-emerald-500" />
          <span>Interactive Nav & Live Lock Counter</span>
        </div>
      </div>

      <CipherTextDecoder theme="light" />
    </div>
  );
}
