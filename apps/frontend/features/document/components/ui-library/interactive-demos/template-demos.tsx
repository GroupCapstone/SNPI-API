'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { SpotlightBentoGrid } from '../spotlight-bento-grid';
import { MultiStepWizardInteractiveDemo } from '../multi-step-wizard';
import { CommandPaletteInteractiveDemo } from '../command-palette';
import {
  Sparkles,
  Search,
  Check,
  Copy,
  Plus,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Eye,
  EyeOff,
  Command,
  Upload,
  FileText,
  CreditCard,
  Layers,
  Zap,
  Shield,
  Star,
  Sun,
  Moon,
  ExternalLink,
  Sliders,
  X,
  Newspaper,
  Pin,
  FilePlus,
  Users,
} from '@/components/icons';

import { RareUiNavigationMenu } from '../navigation-menu';
import { HangingTabsNav } from '../hanging-tabs-nav';

// ==========================================
// 0. HANGING TABS NAV (Trapezoid Ceiling Navigation)
// ==========================================
export function HangingTabsNavDemo() {
  const [activeTab, setActiveTab] = React.useState('newswire');
  const [size, setSize] = React.useState<'sm' | 'md' | 'lg'>('md');

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="flex items-center justify-center gap-2">
        {(['sm', 'md', 'lg'] as const).map((sz) => (
          <button
            key={sz}
            type="button"
            onClick={() => setSize(sz)}
            className={cn(
              'rounded-[4px] px-3 py-1 font-sans text-xs font-bold transition-all',
              size === sz
                ? 'bg-[#0056FF] text-white'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
            )}
          >
            Size {sz.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="w-full max-w-xl rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs">
        <div className="rounded-t-xl border-b border-slate-200 bg-slate-50 px-6 pt-4 pb-0">
          <div className="flex items-center justify-between pb-3">
            <span className="font-sans text-xs font-bold tracking-wider text-slate-700 uppercase">
              Header Navigation Ceiling
            </span>
            <span className="font-mono text-[10px] text-slate-500">
              SNPI-SMS Hanging Tabs Standard
            </span>
          </div>
          <div className="-mb-[1px] flex justify-center">
            <HangingTabsNav
              activeId={activeTab}
              onSelect={setActiveTab}
              size={size}
              items={[
                { id: 'map', label: 'Map', icon: Pin },
                { id: 'newswire', label: 'Newswire', icon: Newspaper },
                { id: 'post', label: 'Post', icon: FilePlus },
                { id: 'friends', label: 'Friends', icon: Users },
              ]}
            />
          </div>
        </div>
        <div className="p-5 text-center">
          <span className="font-mono text-xs text-slate-600">
            Active Tab: <strong className="text-[#0056FF]">{activeTab.toUpperCase()}</strong>
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 1. BACKGROUNDS
// ==========================================

// 1.1 Precision Grid Background (Zero-Dot Linear Lattice Standard)
export function DotPatternDemo() {
  const [lineWidth, setLineWidth] = React.useState(1);
  const [spacing, setSpacing] = React.useState(24);

  return (
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage: `linear-gradient(to right, #0056FF ${lineWidth}px, transparent ${lineWidth}px), linear-gradient(to bottom, #0056FF ${lineWidth}px, transparent ${lineWidth}px)`,
          backgroundSize: `${spacing}px ${spacing}px`,
        }}
      />
      <div className="relative z-10 space-y-2 rounded-xl border border-[#CAD3F5] bg-white/95 p-4 text-center shadow-lg backdrop-blur-md">
        <h4 className="font-sans text-sm font-bold text-slate-900">Precision Linear Grid</h4>
        <p className="font-sans text-xs text-slate-500">
          Pure geometric linear lattice (Zero-Dot Design Standard) with customizable pitch.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setSpacing((prev) => (prev === 24 ? 16 : 24))}
            className="rounded-[4px] border border-slate-200 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 hover:bg-slate-50"
          >
            Grid Pitch: {spacing}px
          </button>
          <button
            type="button"
            onClick={() => setLineWidth((prev) => (prev === 1 ? 2 : 1))}
            className="rounded-[4px] border border-[#0056FF] bg-[#E3E7FC] px-3 py-1 font-mono text-[10px] font-bold text-[#0056FF] hover:bg-blue-50"
          >
            Line: {lineWidth}px
          </button>
        </div>
      </div>
    </div>
  );
}

// 1.2 Retro Grid Background
export function RetroGridDemo() {
  const [perspective, setPerspective] = React.useState(true);

  return (
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#05070E] p-6 shadow-inner">
      {/* 3D Grid Plane */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-40 transition-all duration-500',
          perspective && '[transform:rotateX(60deg)_translateY(-20%)]',
        )}
        style={{
          backgroundImage: `linear-gradient(to right, #0056FF 1px, transparent 1px), linear-gradient(to bottom, #0056FF 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Horizon Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0056FF]/30 via-transparent to-transparent" />

      <div className="relative z-10 space-y-2 rounded-xl border border-blue-500/30 bg-[#0B1120]/90 p-4 text-center text-white shadow-xl backdrop-blur-md">
        <h4 className="font-sans text-sm font-bold text-white">Retro Cyber Grid</h4>
        <p className="font-sans text-xs text-blue-200/70">
          CSS 3D perspective plane with gradient horizon falloff.
        </p>
        <button
          type="button"
          onClick={() => setPerspective(!perspective)}
          className="mt-2 rounded-full border border-blue-500/40 bg-blue-600/20 px-3 py-1 font-mono text-[10px] font-bold text-blue-400 hover:bg-blue-600/30"
        >
          Perspective: {perspective ? '3D Active' : '2D Flat'}
        </button>
      </div>
    </div>
  );
}

// 1.3 Aurora Waves Background
export function AuroraWavesDemo() {
  const [pulse, setPulse] = React.useState(true);

  return (
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-800 bg-[#020617] p-6">
      {/* Ambient Aurora Glow Blobs */}
      <div
        className={cn(
          'pointer-events-none absolute -top-12 -left-12 size-56 rounded-full bg-blue-600/30 blur-3xl transition-all duration-1000',
          pulse && 'scale-125 bg-blue-500/40',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-12 -bottom-12 size-56 rounded-full bg-indigo-600/30 blur-3xl transition-all duration-1000',
          pulse && 'scale-125 bg-indigo-500/40',
        )}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#FF5500]/20 blur-2xl" />

      <div className="relative z-10 space-y-2 rounded-xl border border-slate-700 bg-slate-900/80 p-4 text-center text-white shadow-xl backdrop-blur-lg">
        <h4 className="font-sans text-sm font-bold text-white">Aurora Ambient Waves</h4>
        <p className="font-sans text-xs text-slate-400">
          High-performance CSS blurred radial gradients for modern hero cards.
        </p>
        <button
          type="button"
          onClick={() => setPulse(!pulse)}
          className="mt-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-[10px] font-bold text-slate-300 hover:text-white"
        >
          {pulse ? 'Pulse Fast' : 'Calm State'}
        </button>
      </div>
    </div>
  );
}

// 1.4 Interactive Particles Background
export function InteractiveParticlesDemo() {
  const [count, setCount] = React.useState(16);

  return (
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-950 p-6">
      {/* Simulated Particle Grid */}
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="absolute size-1.5 rounded-[1px] bg-[#0056FF]"
            style={{
              top: `${((i * 19) % 90) + 5}%`,
              left: `${((i * 31) % 90) + 5}%`,
              opacity: (i % 5) * 0.2 + 0.2,
              animationDuration: `${(i % 3) + 2}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-2 rounded-xl border border-slate-800 bg-slate-900/90 p-4 text-center text-white backdrop-blur-sm">
        <h4 className="font-sans text-sm font-bold">Particle Constellation</h4>
        <p className="font-sans text-xs text-slate-400">
          Zero-overhead CSS keyframe floating nodes for technical dashboards.
        </p>
        <button
          type="button"
          onClick={() => setCount((prev) => (prev === 16 ? 32 : 16))}
          className="mt-2 rounded-full border border-blue-500/40 bg-blue-600/20 px-3 py-1 font-mono text-[10px] font-bold text-blue-400"
        >
          Nodes: {count} Active
        </button>
      </div>
    </div>
  );
}

// ==========================================
// 2. TEXT EFFECTS
// ==========================================

// 2.1 Text Shimmer Effect
export function TextShimmerDemo() {
  const [speed, setSpeed] = React.useState<'normal' | 'fast'>('normal');

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <div className="relative inline-block overflow-hidden font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
        <span
          className={cn(
            'animate-shimmer inline-block bg-gradient-to-r from-slate-900 via-[#0056FF] to-slate-900 bg-[length:200%_auto] bg-clip-text text-transparent',
            speed === 'fast' && 'animate-shimmer-fast',
          )}
          style={{
            animation:
              speed === 'fast' ? 'shimmer 1.5s linear infinite' : 'shimmer 3s linear infinite',
          }}
        >
          SNPI Autonomous Campus
        </span>
      </div>
      <p className="font-sans text-xs text-slate-500">
        Gradient-clipped typography shimmer with dynamic linear keyframes.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setSpeed(speed === 'normal' ? 'fast' : 'normal')}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 hover:border-[#0056FF]"
        >
          Speed: {speed.toUpperCase()}
        </button>
      </div>
    </div>
  );
}

// 2.2 Kinetic Number Ticker
export function NumberTickerDemo() {
  const [val, setVal] = React.useState(98420);

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <span className="font-mono text-xs font-bold tracking-wider text-slate-400 uppercase">
        Daily Processed Requests
      </span>
      <div className="font-mono text-4xl font-black tracking-tight text-[#0056FF] sm:text-5xl">
        {val.toLocaleString()}
      </div>
      <p className="font-sans text-xs text-slate-500">
        High-precision tabular digit odometer ticker for telemetry readouts.
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setVal((v) => v + 1250)}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 hover:border-[#0056FF]"
        >
          +1,250
        </button>
        <button
          type="button"
          onClick={() => setVal((v) => Math.max(1000, v - 800))}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 hover:border-[#0056FF]"
        >
          -800
        </button>
        <button
          type="button"
          onClick={() => setVal(98420)}
          className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[10px] font-bold text-slate-500 hover:text-slate-900"
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// 2.3 Glitch Text Effect
export function GlitchTextDemo() {
  const [active, setActive] = React.useState(false);

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-slate-800 bg-[#090D16] p-6 text-center text-white shadow-xl">
      <div
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        className="cursor-pointer font-mono text-3xl font-black tracking-widest text-[#FF5500] transition-all select-none"
        style={{
          textShadow: active ? '2px 0 #0056FF, -2px 0 #FF0055, 0 2px #00FFCC' : '1px 1px 0 #0056FF',
        }}
      >
        CYBER_TERMINAL_2026
      </div>
      <p className="font-sans text-xs text-slate-400">
        Hover to trigger chromatic RGB split aberration with zero script overhead.
      </p>
      <button
        type="button"
        onClick={() => setActive(!active)}
        className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 font-mono text-[10px] font-bold text-slate-300 hover:text-white"
      >
        {active ? 'Glitch Active' : 'Hover or Click to Glitch'}
      </button>
    </div>
  );
}

// 2.4 Blur In Typography
export function BlurInDemo() {
  const [key, setKey] = React.useState(0);

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <div
        key={key}
        className="animate-in fade-in-0 blur-in-sm transition-all duration-700 ease-out"
      >
        <h3 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
          Zero-Lag Fluid Interface
        </h3>
      </div>
      <p className="font-sans text-xs text-slate-500">
        Cinematic Gaussian blur to sharp focus entrance for hero statements.
      </p>
      <button
        type="button"
        onClick={() => setKey((k) => k + 1)}
        className="rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3.5 py-1 font-mono text-[10px] font-bold text-[#0056FF] hover:bg-blue-100"
      >
        Replay Blur Entrance
      </button>
    </div>
  );
}

// ==========================================
// 3. CARDS
// ==========================================

// 3.1 Spotlight Card
export function SpotlightCardDemo() {
  const cardRef = React.useRef<HTMLDivElement>(null);
  const [pos, setPos] = React.useState({ x: 0, y: 0, opacity: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPos((p) => ({ ...p, opacity: 0 }))}
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-800 bg-[#0F172A] p-6 text-white shadow-xl"
    >
      {/* Mouse Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(0, 86, 255, 0.25), transparent 80%)`,
        }}
      />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-0.5 font-mono text-[10px] font-bold text-blue-400 uppercase">
            Spotlight Ray
          </span>
          <Sparkles className="size-4 text-blue-400" />
        </div>
        <h4 className="font-sans text-lg font-black text-white">Dynamic Cursor Illumination</h4>
        <p className="font-sans text-xs text-slate-400">
          Mouse-following radial gradient layer illuminating mathematical borders and surfaces.
        </p>
        <div className="flex items-center justify-between border-t border-slate-800 pt-3 font-mono text-xs text-slate-500">
          <span>X: {Math.round(pos.x)}px</span>
          <span>Y: {Math.round(pos.y)}px</span>
        </div>
      </div>
    </div>
  );
}

// 3.2 Bento Grid Card
export function BentoCardDemo() {
  return (
    <div className="grid w-full max-w-lg grid-cols-1 gap-3 sm:grid-cols-2">
      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-xl border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]">
          <Shield className="size-5" />
        </div>
        <div className="mt-4 space-y-1">
          <h5 className="font-sans text-sm font-bold text-slate-900">Zero Trust RBAC</h5>
          <p className="font-sans text-xs text-slate-500">
            Implied scopes with tenant segregation.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
        <div className="flex size-9 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-600">
          <Zap className="size-5" />
        </div>
        <div className="mt-4 space-y-1">
          <h5 className="font-sans text-sm font-bold text-slate-900">42ms Sub-Query</h5>
          <p className="font-sans text-xs text-slate-500">MongoDB replica set index routing.</p>
        </div>
      </div>
    </div>
  );
}

// 3.3 3D Tilt Card
export function TiltCardDemo() {
  const [rotate, setRotate] = React.useState({ x: 0, y: 0 });

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotate({ x: -y / 10, y: x / 10 });
  };

  return (
    <div
      onMouseMove={handleMove}
      onMouseLeave={() => setRotate({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
        transition: 'transform 0.1s ease-out',
      }}
      className="w-full max-w-sm rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-6 shadow-xl"
    >
      <div className="space-y-3">
        <span className="rounded-full border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase shadow-xs">
          Gyro Tilt 3D
        </span>
        <h4 className="font-sans text-lg font-black text-slate-950">Spatial Perspective</h4>
        <p className="font-sans text-xs text-slate-600">
          Smooth CSS 3D pitch and yaw rotation driven by mouse vector coordinates.
        </p>
        <div className="flex items-center gap-3 border-t border-slate-100 pt-3 font-mono text-xs text-slate-400">
          <span>Pitch: {Math.round(rotate.x)}°</span>
          <span>Yaw: {Math.round(rotate.y)}°</span>
        </div>
      </div>
    </div>
  );
}

import { BorderBeamInteractiveShowcase } from '../border-beam-card';

// 3.4 Border Beam Card (Official Native Instrument Panel & 4-Dash SVG Physics)
export function BorderBeamDemo() {
  return <BorderBeamInteractiveShowcase />;
}

// ==========================================
// 4. SECTIONS
// ==========================================

// 4.1 Hero Section Template
export function HeroSectionDemo() {
  return (
    <div className="w-full max-w-2xl space-y-4 rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 text-center shadow-xs sm:p-10">
      <div className="inline-flex items-center gap-2 rounded-full border border-[#CAD3F5] bg-[#E3E7FC] px-3 py-1 font-mono text-xs font-bold text-[#0056FF]">
        <Sparkles className="size-3.5" />
        <span>CAMPUS RELEASE 2026.4</span>
      </div>
      <h2 className="font-sans text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
        Next-Generation School Management System
      </h2>
      <p className="mx-auto max-w-md font-sans text-xs text-slate-600 sm:text-sm">
        47 modular monolith domains, sub-second telemetry, and unified attendance workflows.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          type="button"
          className="rounded-full bg-[#0056FF] px-5 py-2 font-sans text-xs font-bold text-white shadow-md hover:bg-blue-700"
        >
          Launch Portal
        </button>
        <button
          type="button"
          className="rounded-full border border-slate-300 bg-white px-5 py-2 font-sans text-xs font-bold text-slate-700 hover:bg-slate-50"
        >
          View API Specs
        </button>
      </div>
    </div>
  );
}

// 4.2 Feature Bento Section (Admin Audit & Health Spotlight Bento Grid)
export function FeatureBentoDemo() {
  return (
    <div className="w-full space-y-4">
      <SpotlightBentoGrid />
    </div>
  );
}

// 4.3 Pricing Matrix Section
export function PricingMatrixDemo() {
  const [period, setPeriod] = React.useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="w-full max-w-2xl space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h4 className="font-sans text-base font-bold text-slate-900">Campus License Tier</h4>
          <p className="font-sans text-xs text-slate-500">Deployable on VPS or enterprise cloud</p>
        </div>
        <div className="flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
          <button
            type="button"
            onClick={() => setPeriod('monthly')}
            className={cn(
              'rounded-full px-3 py-1 font-sans text-xs font-bold',
              period === 'monthly' ? 'bg-[#0056FF] text-white' : 'text-slate-600',
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setPeriod('yearly')}
            className={cn(
              'rounded-full px-3 py-1 font-sans text-xs font-bold',
              period === 'yearly' ? 'bg-[#0056FF] text-white' : 'text-slate-600',
            )}
          >
            Yearly (-20%)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
          <span className="font-mono text-xs font-bold text-slate-500">STANDARD</span>
          <div className="mt-1 font-sans text-2xl font-black text-slate-900">
            {period === 'monthly' ? '$49' : '$39'}{' '}
            <span className="font-mono text-xs text-slate-400">/mo</span>
          </div>
          <p className="mt-1 font-sans text-xs text-slate-600">Up to 2,000 active students.</p>
        </div>
        <div className="rounded-xl border border-[#CAD3F5] bg-[#E3E7FC]/40 p-4">
          <span className="font-mono text-xs font-bold text-[#0056FF]">ENTERPRISE</span>
          <div className="mt-1 font-sans text-2xl font-black text-slate-900">
            {period === 'monthly' ? '$189' : '$149'}{' '}
            <span className="font-mono text-xs text-slate-400">/mo</span>
          </div>
          <p className="mt-1 font-sans text-xs text-slate-600">
            Unlimited campuses & replica sets.
          </p>
        </div>
      </div>
    </div>
  );
}

// 4.4 Marquee Section
export function MarqueeSectionDemo() {
  const partners = [
    'Siem Reap Campus',
    'Phnom Penh Main',
    'Battambang Wing',
    'Kampot Academy',
    'Kandal Science',
  ];

  return (
    <div className="w-full max-w-lg space-y-3 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
      <span className="font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
        Active Institutional Campuses
      </span>
      <div className="flex scrollbar-none items-center gap-3 overflow-x-auto py-2">
        {partners.concat(partners).map((name, i) => (
          <span
            key={i}
            className="shrink-0 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-sans text-xs font-bold text-slate-700"
          >
            {name}
          </span>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 5. FORMS
// ==========================================

// 5.1 Floating Label Form
export function FloatingLabelFormDemo() {
  const [focused, setFocused] = React.useState(false);
  const [val, setVal] = React.useState('');

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <h4 className="font-sans text-sm font-bold text-slate-900">Floating Label Field</h4>
      <div className="relative">
        <input
          type="text"
          id="student-id-field"
          value={val}
          onChange={(e) => setVal(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="peer w-full rounded-full border-2 border-slate-200 px-4 pt-5 pb-2 font-sans text-xs font-semibold text-slate-900 transition-colors outline-none focus:border-[#0056FF]"
        />
        <label
          htmlFor="student-id-field"
          className={cn(
            'pointer-events-none absolute left-4 font-sans text-xs font-semibold text-slate-400 transition-all',
            focused || val
              ? 'top-1.5 font-mono text-[9px] font-bold text-[#0056FF]'
              : 'top-3.5 text-xs text-slate-400',
          )}
        >
          National Student ID (e.g. STU-2026)
        </label>
      </div>
      <p className="font-sans text-xs text-slate-500">
        Material-style animated label transition adhering to 44px hit standards.
      </p>
    </div>
  );
}

// 5.2 Multi-Step Wizard
export function MultiStepWizardDemo() {
  return <MultiStepWizardInteractiveDemo />;
}

// 5.3 File Dropzone
export function FileDropzoneDemo() {
  const [uploaded, setUploaded] = React.useState<string[]>(['National_Birth_Certificate.pdf']);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70 p-6 text-center hover:border-[#0056FF]">
        <Upload className="size-6 text-[#0056FF]" />
        <span className="mt-2 font-sans text-xs font-bold text-slate-800">
          Drag & Drop Student Dossier
        </span>
        <span className="font-mono text-[10px] text-slate-400">PDF, PNG, DOCX up to 15MB</span>
        <button
          type="button"
          onClick={() => setUploaded((prev) => [...prev, `Medical_Record_${prev.length + 1}.pdf`])}
          className="mt-3 rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] font-bold text-slate-700 shadow-xs hover:bg-slate-50"
        >
          Browse Files
        </button>
      </div>

      <div className="space-y-1.5">
        {uploaded.map((f, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
          >
            <span className="font-sans font-semibold text-slate-700">{f}</span>
            <span className="font-mono text-[10px] font-bold text-emerald-600">READY</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// 5.4 Payment Card Form
export function PaymentCardDemo() {
  const [num, setNum] = React.useState('4532 •••• •••• 8891');

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xs">
      {/* Holographic Card Preview */}
      <div className="relative overflow-hidden rounded-2xl border border-blue-900 bg-gradient-to-tr from-[#000B26] via-[#0056FF] to-blue-900 p-5 text-white shadow-xl">
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold tracking-widest uppercase">
            SNPI TUITION CARD
          </span>
          <CreditCard className="size-5" />
        </div>
        <div className="my-4 font-mono text-lg font-bold tracking-widest">{num}</div>
        <div className="flex items-center justify-between font-mono text-[11px] text-blue-200">
          <span>DARA SOK</span>
          <span>EXP: 09/28</span>
        </div>
      </div>

      <div className="space-y-2">
        <input
          type="text"
          placeholder="Card Number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          className="w-full rounded-full border border-slate-200 px-4 py-2 font-mono text-xs outline-none focus:border-[#0056FF]"
        />
      </div>
    </div>
  );
}

// ==========================================
// 6. OVERLAYS
// ==========================================

// 6.1 Command Palette KBD
export function CommandPaletteDemo() {
  return <CommandPaletteInteractiveDemo />;
}

// 6.2 Confetti Cannon
export function ConfettiCannonDemo() {
  const [burst, setBurst] = React.useState(false);

  const triggerBurst = () => {
    setBurst(true);
    setTimeout(() => setBurst(false), 2000);
  };

  return (
    <div className="relative flex w-full max-w-md flex-col items-center justify-center gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <span className="font-sans text-sm font-bold text-slate-900">
        Celebration Confetti Cannon
      </span>
      <button
        type="button"
        onClick={triggerBurst}
        className="rounded-full bg-[#0056FF] px-5 py-2 font-sans text-xs font-bold text-white shadow-md transition-all hover:bg-blue-700 active:scale-95"
      >
        Trigger Confetti Cannon
      </button>

      {burst && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute size-2 animate-ping rounded-full"
              style={{
                backgroundColor: ['#0056FF', '#FF5500', '#10B981', '#F59E0B', '#8B5CF6'][i % 5],
                top: `${((i * 17) % 80) + 10}%`,
                left: `${((i * 29) % 80) + 10}%`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// 6.3 Drawer Sheet
export function DrawerSheetDemo() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 font-sans text-xs font-bold text-slate-700 hover:border-[#0056FF]"
      >
        {open ? 'Close Right Drawer' : 'Open Slide Drawer Sheet'}
      </button>

      {open && (
        <div className="rounded-2xl border border-[#CAD3F5] bg-[#E3E7FC]/60 p-4 text-left shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="font-sans text-xs font-bold text-slate-900">Student Inspector</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="mt-2 space-y-1 font-sans text-xs text-slate-600">
            <p>ID: STU-2026-0891</p>
            <p>Status: Active Full-time</p>
            <p>Grade: Grade 12 - Science Wing</p>
          </div>
        </div>
      )}
    </div>
  );
}

// 6.4 Image Lightbox
export function ImageLightboxDemo() {
  const [zoom, setZoom] = React.useState(false);

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-xs">
      <div
        onClick={() => setZoom(!zoom)}
        className={cn(
          'cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 transition-all duration-300',
          zoom ? 'scale-105 shadow-2xl ring-4 ring-[#0056FF]/30' : 'hover:scale-102',
        )}
      >
        <div className="flex h-32 w-56 items-center justify-center bg-gradient-to-tr from-[#0056FF] to-indigo-600 font-sans text-xs font-bold text-white">
          Click To Expand Lightbox
        </div>
      </div>
      <span className="font-mono text-[10px] text-slate-400">
        {zoom ? 'Lightbox Expanded (Click again to close)' : 'Thumbnail View'}
      </span>
    </div>
  );
}
