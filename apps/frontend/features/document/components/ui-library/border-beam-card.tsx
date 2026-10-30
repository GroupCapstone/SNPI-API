'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Lock,
  Eye,
  EyeOff,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Terminal,
  Activity,
  Sliders,
  Sparkles,
} from '@/components/icons';

export type BorderBeamColor = 'amber' | 'blue' | 'emerald' | 'rose';

export interface BorderBeamSvgProps {
  color?: BorderBeamColor;
  duration?: number; // seconds for full perimeter loop
  rx?: number;
  ry?: number;
  className?: string;
  forceBright?: boolean;
}

/**
 * BorderBeamSvg
 *
 * Implements the mathematical specification:
 * - Four stacked SVG dashes traversing a single continuous <rect> path with pathLength="100".
 * - Mathematically uniform arc-length speed: the head always leads the tail and the speed
 *   never distorts at rounded corners.
 * - Dash 1: Sharp incandescent core tip (2% arc, high luminance)
 * - Dash 2: Leading body beam (6% arc, saturated amber/accent)
 * - Dash 3: Trailing tail glow (12% arc, deep amber falloff)
 * - Dash 4: Diffuse ambient aura (20% arc, gaussian-blurred halo)
 * - Hover / Focus: Smooth transition from "quiet" (35% opacity) to "bright" (100% opacity).
 */
export function BorderBeamSvg({
  color = 'amber',
  duration = 7,
  rx = 24,
  ry = 24,
  className,
  forceBright = false,
}: BorderBeamSvgProps) {
  // Color configuration profiles
  const colorMap = {
    amber: {
      core: '#FFFBEB',
      head: '#FDE047',
      body: '#F59E0B',
      tail: '#D97706',
      aura: '#F59E0B',
      glowFilter: 'rgba(245, 158, 11, 0.45)',
    },
    blue: {
      core: '#EFF6FF',
      head: '#60A5FA',
      body: '#0056FF',
      tail: '#1D4ED8',
      aura: '#2277FF',
      glowFilter: 'rgba(0, 86, 255, 0.45)',
    },
    emerald: {
      core: '#ECFDF5',
      head: '#6EE7B7',
      body: '#10B981',
      tail: '#047857',
      aura: '#10B981',
      glowFilter: 'rgba(16, 185, 129, 0.45)',
    },
    rose: {
      core: '#FFF1F2',
      head: '#FDA4AF',
      body: '#F43F5E',
      tail: '#BE123C',
      aura: '#F43F5E',
      glowFilter: 'rgba(244, 63, 94, 0.45)',
    },
  }[color];

  const filterId = React.useId();

  return (
    <svg
      className={cn(
        'pointer-events-none absolute inset-0 size-full overflow-visible transition-opacity duration-300',
        forceBright ? 'opacity-100' : 'opacity-35 group-hover:opacity-100 group-focus-within:opacity-100',
        className,
      )}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Diffuse Gaussian Blur for Dash 4 Aura */}
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="auraBlur" />
        </filter>

        {/* Animated Keyframes for constant-speed perimeter tracing */}
        <style>{`
          @keyframes borderBeamTrack_${color} {
            0% {
              stroke-dashoffset: 0;
            }
            100% {
              stroke-dashoffset: -100;
            }
          }
          .beam-dash-animate-${color} {
            animation: borderBeamTrack_${color} ${duration}s linear infinite;
          }
        `}</style>
      </defs>

      {/* DASH 4: Wide Diffuse Aura Glow (20% arc, blurred) */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={rx}
        ry={ry}
        fill="none"
        stroke={colorMap.aura}
        strokeWidth="8"
        strokeDasharray="20 80"
        pathLength="100"
        filter={`url(#${filterId})`}
        className={cn('beam-dash-animate-' + color, 'opacity-40 transition-opacity group-hover:opacity-85')}
        style={{ strokeDashoffset: '4' }}
      />

      {/* DASH 3: Trailing Tail Glow (12% arc, strokeWidth 4) */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={rx}
        ry={ry}
        fill="none"
        stroke={colorMap.tail}
        strokeWidth="4"
        strokeDasharray="12 88"
        pathLength="100"
        strokeLinecap="round"
        className={cn('beam-dash-animate-' + color, 'opacity-65 transition-opacity group-hover:opacity-95')}
        style={{ strokeDashoffset: '2.5' }}
      />

      {/* DASH 2: Leading Body Beam (6% arc, strokeWidth 2.5) */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={rx}
        ry={ry}
        fill="none"
        stroke={colorMap.body}
        strokeWidth="2.5"
        strokeDasharray="6 94"
        pathLength="100"
        strokeLinecap="round"
        className={cn('beam-dash-animate-' + color, 'opacity-90 transition-opacity group-hover:opacity-100')}
        style={{ strokeDashoffset: '1.2' }}
      />

      {/* DASH 1: Sharp Core Incandescent Tip (2% arc, strokeWidth 1.5) */}
      <rect
        x="0.5"
        y="0.5"
        width="calc(100% - 1px)"
        height="calc(100% - 1px)"
        rx={rx}
        ry={ry}
        fill="none"
        stroke={colorMap.core}
        strokeWidth="1.5"
        strokeDasharray="2 98"
        pathLength="100"
        strokeLinecap="round"
        className={cn('beam-dash-animate-' + color, 'opacity-100')}
        style={{ strokeDashoffset: '0' }}
      />
    </svg>
  );
}

/**
 * BorderBeamLoginCard
 *
 * Instrument-panel authentication console:
 * - Matte graphite chassis with hairline border
 * - Tabular numerals clock and live node telemetry
 * - One amber beam tracing perimeter at constant speed
 * - Quiet until hovered/focused, then radiates
 * - Document brand tokens (#0056FF, #E3E7FC, #000B26)
 */
export function BorderBeamLoginCard({
  color = 'amber',
  duration = 7,
  onAuthenticate,
  className,
}: {
  color?: BorderBeamColor;
  duration?: number;
  onAuthenticate?: (role: string, id: string) => void;
  className?: string;
}) {
  const [role, setRole] = React.useState<'student' | 'faculty' | 'root'>('student');
  const [identifier, setIdentifier] = React.useState('STU-2026-0891');
  const [password, setPassword] = React.useState('••••••••••••');
  const [showPassword, setShowPassword] = React.useState(false);
  const [rememberSession, setRememberSession] = React.useState(true);
  const [isAuthenticating, setIsAuthenticating] = React.useState(false);
  const [authSuccess, setAuthSuccess] = React.useState(false);
  const [timeString, setTimeString] = React.useState('20:49:54.82');

  // Live tabular clock for instrument panel feel
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const ms = String(Math.floor(now.getMilliseconds() / 10)).padStart(2, '0');
      setTimeString(`${h}:${m}:${s}.${ms}`);
    }, 70);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);
    setAuthSuccess(false);

    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      onAuthenticate?.(role, identifier);
      setTimeout(() => setAuthSuccess(false), 3000);
    }, 1200);
  };

  return (
    <div
      className={cn(
        'group relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0B0F17] p-6 text-white shadow-2xl transition-all duration-300',
        'hover:border-slate-700/80 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      {/* 4-Dash Constant Speed Border Beam */}
      <BorderBeamSvg color={color} duration={duration} rx={24} ry={24} />

      {/* Background Instrument Telemetry Grid (Subtle Matrix) */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

      {/* Header Telemetry Bar */}
      <div className="relative z-10 mb-5 flex items-center justify-between border-b border-slate-800/80 pb-4">
        {/* Institutional Node Badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex size-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-amber-500" />
          </span>
          <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            SNPI-GATEWAY // NODE-01
          </span>
        </div>

        {/* Tabular Millisecond Clock */}
        <div className="flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-tight text-slate-400 tabular-nums">
          <Activity className="size-3 text-amber-500/80" />
          <span>{timeString}</span>
        </div>
      </div>

      {/* Brand Identity & Instrument Title */}
      <div className="relative z-10 mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#0056FF]/30 bg-[#0056FF]/10 px-3 py-1 text-[#38BDF8]">
            <Shield className="size-3.5 stroke-[2.5]" />
            <span className="font-mono text-[11px] font-bold tracking-wider uppercase">
              Zero Trust Auth
            </span>
          </div>

          <span className="font-mono text-[10px] font-semibold tracking-widest text-slate-500 uppercase">
            TLS 1.3 ARMED
          </span>
        </div>

        <h3 className="mt-3 font-sans text-xl font-extrabold tracking-tight text-white">
          Access Console
        </h3>
        <p className="mt-1 font-sans text-xs text-slate-400">
          Authenticate operator credentials to enter the SNPI-SMS cluster.
        </p>
      </div>

      {/* Role Segmented Controller */}
      <div className="relative z-10 mb-5 grid grid-cols-3 gap-1 rounded-xl border border-slate-800 bg-[#070A0F] p-1">
        {(['student', 'faculty', 'root'] as const).map((r) => (
          <button
            key={r}
            type="button"
            onClick={() => {
              setRole(r);
              if (r === 'student') setIdentifier('STU-2026-0891');
              if (r === 'faculty') setIdentifier('FAC-1042-PROF');
              if (r === 'root') setIdentifier('OPERATOR_ROOT_0');
            }}
            className={cn(
              'rounded-lg py-1.5 font-mono text-[11px] font-bold tracking-wider uppercase transition-all duration-150',
              role === r
                ? 'bg-[#0056FF] text-white shadow-sm'
                : 'text-slate-400 hover:text-white',
            )}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
        {/* Institutional Identifier Field */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Operator Identity</span>
            <span className="text-slate-600">ID / Matricule</span>
          </label>
          <div className="relative">
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#070A0F] px-3.5 py-2.5 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-[#0056FF] focus:outline-none focus:ring-1 focus:ring-[#0056FF]"
              placeholder="e.g. STU-2026-0891"
              required
            />
          </div>
        </div>

        {/* Security Access Passkey Field */}
        <div className="space-y-1.5">
          <label className="flex items-center justify-between font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            <span>Security Passkey</span>
            <span className="text-slate-600">Encrypted</span>
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-[#070A0F] px-3.5 py-2.5 pr-10 font-mono text-xs text-slate-100 placeholder:text-slate-600 focus:border-[#0056FF] focus:outline-none focus:ring-1 focus:ring-[#0056FF]"
              placeholder="Enter secure passkey"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
        </div>

        {/* Tactical Options */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={rememberSession}
              onChange={(e) => setRememberSession(e.target.checked)}
              className="size-3.5 rounded border-slate-800 bg-[#070A0F] text-[#0056FF] focus:ring-0"
            />
            <span className="font-mono text-[11px] text-slate-400">Preserve Session</span>
          </label>

          <button
            type="button"
            className="font-mono text-[11px] text-[#38BDF8] hover:underline"
          >
            Rotate Key
          </button>
        </div>

        {/* Authenticate Action CTA Button */}
        <button
          type="submit"
          disabled={isAuthenticating}
          className={cn(
            'group/btn relative flex w-full min-h-[46px] items-center justify-center gap-2 overflow-hidden rounded-xl border font-sans text-xs font-bold tracking-wide transition-all duration-200 active:scale-[0.98]',
            authSuccess
              ? 'border-emerald-500 bg-emerald-600 text-white'
              : 'border-[#0056FF] bg-gradient-to-r from-[#0056FF] to-[#2277FF] text-white hover:brightness-110 shadow-[0_4px_20px_rgba(0,86,255,0.3)]',
          )}
        >
          {isAuthenticating ? (
            <span className="flex items-center gap-2 font-mono text-xs">
              <span className="size-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
              <span>VERIFYING CRYPTO PROOF...</span>
            </span>
          ) : authSuccess ? (
            <span className="flex items-center gap-1.5 font-mono text-xs">
              <Check className="size-4 stroke-[3]" />
              <span>TERMINAL GRANTED</span>
            </span>
          ) : (
            <>
              <span className="font-mono uppercase tracking-wider">Authenticate Session</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover/btn:translate-x-1" />
            </>
          )}
        </button>
      </form>

      {/* Footer Instrument Spec Footnote */}
      <div className="relative z-10 mt-5 flex items-center justify-between border-t border-slate-800/80 pt-3 font-mono text-[10px] text-slate-500">
        <span>SNPI KESARARAM MONOREPO</span>
        <span className="tabular-nums">PORT 5001 // SECURE</span>
      </div>
    </div>
  );
}

/**
 * BorderBeamPricingCard
 *
 * Instrument-panel pricing card with the continuous amber border beam:
 * - Tabular pricing ($1,240.00 / MO)
 * - 4-dash constant-velocity beam
 * - Hairline telemetry dividers
 */
export function BorderBeamPricingCard({
  color = 'amber',
  duration = 7,
  className,
}: {
  color?: BorderBeamColor;
  duration?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'group relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800/90 bg-[#0B0F17] p-6 text-white shadow-2xl transition-all duration-300',
        'hover:border-slate-700/80 hover:shadow-[0_20px_50px_rgba(0,0,0,0.7)]',
        className,
      )}
    >
      <BorderBeamSvg color={color} duration={duration} rx={24} ry={24} />

      {/* Background Instrument Telemetry Grid */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />

      {/* Header Telemetry */}
      <div className="relative z-10 mb-4 flex items-center justify-between border-b border-slate-800/80 pb-3">
        <span className="font-mono text-[10px] font-bold tracking-wider text-amber-400 uppercase">
          CLUSTER TIER // ENTERPRISE
        </span>
        <span className="font-mono text-[10px] text-slate-500 tabular-nums">99.99% SLA</span>
      </div>

      {/* Pricing Header */}
      <div className="relative z-10 mb-6">
        <div className="flex items-baseline gap-2">
          <span className="font-mono text-4xl font-extrabold tracking-tight text-white tabular-nums">
            $1,240.00
          </span>
          <span className="font-mono text-xs font-semibold text-slate-400 uppercase">
            / Month
          </span>
        </div>
        <p className="mt-1 font-sans text-xs text-slate-400">
          Dedicated MongoDB replica set (rs0), 47 domain modules, zero rate limits.
        </p>
      </div>

      {/* Instrument Spec Matrix */}
      <div className="relative z-10 mb-6 space-y-2 border-y border-slate-800/80 py-4 font-mono text-xs">
        {[
          { label: 'Domain Modules', val: '47 Monolith APIs' },
          { label: 'REST Endpoints', val: '193 Unified Routes' },
          { label: 'Database Cluster', val: 'MongoDB rs0 ACID' },
          { label: 'Campus Branches', val: 'Unlimited Scopes' },
          { label: 'Telemetry Logging', val: 'Real-Time Audit' },
        ].map((item, i) => (
          <div key={i} className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-amber-500" />
              <span>{item.label}</span>
            </div>
            <span className="font-bold text-white tabular-nums">{item.val}</span>
          </div>
        ))}
      </div>

      {/* Deploy Button */}
      <button
        type="button"
        className="group/btn relative z-10 flex w-full min-h-[46px] items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-500 to-amber-600 font-mono text-xs font-bold tracking-wider text-slate-950 uppercase shadow-[0_4px_20px_rgba(245,158,11,0.25)] transition-all hover:brightness-110 active:scale-[0.98]"
      >
        <span>Deploy Cluster Node</span>
        <ArrowRight className="size-3.5 transition-transform group-hover/btn:translate-x-1" />
      </button>

      <div className="relative z-10 mt-4 text-center font-mono text-[10px] text-slate-500">
        NO CREDIT CARD REQUIRED FOR 30-DAY PILOT
      </div>
    </div>
  );
}

/**
 * BorderBeamInteractiveShowcase
 *
 * Full interactive playground allowing developers to test the Border Beam Card:
 * - Mode switch: Login Card vs. Pricing Card
 * - Beam Color: Warm Amber vs. Brand Royal Blue vs. Emerald vs. Rose
 * - Constant Speed: Slow (12s), Normal (7s), Fast (3.5s)
 * - Brightness: Hover to brighten (Quiet 35% -> Bright 100%)
 */
export function BorderBeamInteractiveShowcase() {
  const [mode, setMode] = React.useState<'login' | 'pricing'>('login');
  const [color, setColor] = React.useState<BorderBeamColor>('amber');
  const [duration, setDuration] = React.useState<number>(7);
  const [forceBright, setForceBright] = React.useState(false);

  return (
    <div className="flex w-full flex-col items-center gap-6 py-4">
      {/* Control Ribbon */}
      <div className="flex flex-wrap items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-xs">
        {/* Card Mode Toggle */}
        <div className="flex items-center rounded-xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={cn(
              'rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all',
              mode === 'login'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            Login Card
          </button>
          <button
            type="button"
            onClick={() => setMode('pricing')}
            className={cn(
              'rounded-lg px-3 py-1 font-mono text-xs font-bold transition-all',
              mode === 'pricing'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            Pricing Card
          </button>
        </div>

        <span className="h-4 w-[1px] bg-slate-200" />

        {/* Beam Color Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-semibold text-slate-500">Beam:</span>
          {(['amber', 'blue', 'emerald', 'rose'] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                'flex items-center gap-1 rounded-lg px-2.5 py-1 font-mono text-xs font-bold capitalize transition-all',
                color === c
                  ? 'border border-slate-900 bg-slate-900 text-white'
                  : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100',
              )}
            >
              <span
                className={cn(
                  'size-2 rounded-full',
                  c === 'amber' && 'bg-amber-500',
                  c === 'blue' && 'bg-[#0056FF]',
                  c === 'emerald' && 'bg-emerald-500',
                  c === 'rose' && 'bg-rose-500',
                )}
              />
              <span>{c === 'blue' ? 'Docs Blue' : c}</span>
            </button>
          ))}
        </div>

        <span className="h-4 w-[1px] bg-slate-200" />

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-[11px] font-semibold text-slate-500">Speed:</span>
          {[
            { label: 'Slow (12s)', val: 12 },
            { label: 'Steady (7s)', val: 7 },
            { label: 'Fast (3.5s)', val: 3.5 },
          ].map((s) => (
            <button
              key={s.val}
              type="button"
              onClick={() => setDuration(s.val)}
              className={cn(
                'rounded-lg px-2 py-1 font-mono text-xs font-semibold transition-all',
                duration === s.val
                  ? 'bg-slate-800 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200',
              )}
            >
              {s.label}
            </button>
          ))}
        </div>

        <span className="h-4 w-[1px] bg-slate-200" />

        {/* Force Bright Toggle (Simulate Hover) */}
        <button
          type="button"
          onClick={() => setForceBright(!forceBright)}
          className={cn(
            'flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-xs font-semibold transition-all',
            forceBright
              ? 'border-amber-500 bg-amber-50 text-amber-800'
              : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50',
          )}
        >
          <Sparkles className="size-3.5" />
          <span>{forceBright ? 'Simulated Hover: ON' : 'Hover: AUTO'}</span>
        </button>
      </div>

      {/* Render Selected Card */}
      <div className="flex w-full items-center justify-center p-4">
        {mode === 'login' ? (
          <BorderBeamLoginCard color={color} duration={duration} />
        ) : (
          <BorderBeamPricingCard color={color} duration={duration} />
        )}
      </div>

      {/* Architectural Description Badge */}
      <div className="flex max-w-xl items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-2.5 font-mono text-[11px] text-slate-600 shadow-xs">
        <span className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Architecture: 4 stacked SVG dashes on single pathLength="100"</span>
        </span>
        <span className="h-3 w-[1px] bg-slate-200" />
        <span>Corners: Uniform Velocity</span>
        <span className="h-3 w-[1px] bg-slate-200" />
        <span>Idle: 35% &rarr; Hover: 100%</span>
      </div>
    </div>
  );
}
