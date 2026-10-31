'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
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
  X,
} from '@/components/icons';

import { RareUiNavigationMenu } from '../navigation-menu';

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
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-inner">
      {/* 3D Grid Plane */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 opacity-40 transition-all duration-500',
          perspective && '[transform:rotateX(60deg)_translateY(-20%)]',
        )}
        style={{
          backgroundImage: `linear-gradient(to right, #CAD3F5 1px, transparent 1px), linear-gradient(to bottom, #CAD3F5 1px, transparent 1px)`,
          backgroundSize: '36px 36px',
        }}
      />
      {/* Horizon Glow */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#0056FF]/15 via-transparent to-transparent" />

      <div className="relative z-10 space-y-2 rounded-xl border border-slate-200 bg-white/95 p-4 text-center text-[#09172B] shadow-md backdrop-blur-md">
        <h4 className="font-sans text-sm font-bold text-[#09172B]">Retro Cyber Grid</h4>
        <p className="font-sans text-xs text-slate-600">
          CSS 3D perspective plane with gradient horizon falloff.
        </p>
        <button
          type="button"
          onClick={() => setPerspective(!perspective)}
          className="mt-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-[10px] font-bold text-[#0056FF] hover:bg-blue-100"
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
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-inner">
      {/* Ambient Aurora Glow Blobs */}
      <div
        className={cn(
          'pointer-events-none absolute -top-12 -left-12 size-56 rounded-full bg-blue-300/30 blur-3xl transition-all duration-1000',
          pulse && 'scale-125 bg-blue-400/40',
        )}
      />
      <div
        className={cn(
          'pointer-events-none absolute -right-12 -bottom-12 size-56 rounded-full bg-indigo-300/30 blur-3xl transition-all duration-1000',
          pulse && 'scale-125 bg-indigo-400/40',
        )}
      />
      <div className="pointer-events-none absolute top-1/2 left-1/2 size-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0056FF]/15 blur-2xl" />

      <div className="relative z-10 space-y-2 rounded-xl border border-slate-200 bg-white/90 p-4 text-center text-[#09172B] shadow-md backdrop-blur-lg">
        <h4 className="font-sans text-sm font-bold text-[#09172B]">Aurora Ambient Waves</h4>
        <p className="font-sans text-xs text-slate-600">
          High-performance CSS blurred radial gradients for modern hero cards.
        </p>
        <button
          type="button"
          onClick={() => setPulse(!pulse)}
          className="mt-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 font-mono text-[10px] font-bold text-slate-700 hover:bg-slate-200"
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
    <div className="relative flex h-72 w-full max-w-lg flex-col items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-[#F8FAFC] p-6 shadow-inner">
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

      <div className="relative z-10 space-y-2 rounded-xl border border-slate-200 bg-white/95 p-4 text-center text-[#09172B] shadow-md backdrop-blur-sm">
        <h4 className="font-sans text-sm font-bold text-[#09172B]">Particle Constellation</h4>
        <p className="font-sans text-xs text-slate-600">
          Zero-overhead CSS keyframe floating nodes for technical dashboards.
        </p>
        <button
          type="button"
          onClick={() => setCount((prev) => (prev === 16 ? 32 : 16))}
          className="mt-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 font-mono text-[10px] font-bold text-[#0056FF] hover:bg-blue-100"
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
      className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 text-[#09172B] shadow-xl"
    >
      {/* Mouse Spotlight */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: pos.opacity,
          background: `radial-gradient(400px circle at ${pos.x}px ${pos.y}px, rgba(0, 86, 255, 0.12), transparent 80%)`,
        }}
      />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#0056FF] uppercase">
            Spotlight Ray
          </span>
          <Sparkles className="size-4 text-[#0056FF]" />
        </div>
        <h4 className="font-sans text-lg font-black text-[#09172B]">Dynamic Cursor Illumination</h4>
        <p className="font-sans text-xs text-slate-600">
          Mouse-following radial gradient layer illuminating mathematical borders and surfaces.
        </p>
        <div className="flex items-center justify-between border-t border-slate-100 pt-3 font-mono text-xs text-slate-500">
          <span>X: {Math.round(pos.x)}px</span>
          <span>Y: {Math.round(pos.y)}px</span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. SECTIONS
// ==========================================

// 4.1 Marquee Section
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
          className="peer w-full rounded-[4px] border border-slate-200 px-4 pt-5 pb-2 font-sans text-xs font-semibold text-slate-900 transition-colors outline-none focus:border-[#0056FF]"
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
          className="mt-3 rounded-[4px] border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] font-bold text-slate-700 shadow-xs hover:bg-slate-50"
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
