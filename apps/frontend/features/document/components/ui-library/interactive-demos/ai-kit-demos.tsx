'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import {
  Sparkles,
  Search,
  Check,
  Globe,
  Database,
  Terminal,
} from '@/components/icons';

// 1. Fluid Orb (Luminescent Morphing Gradient Sphere)
export function FluidOrbDemo() {
  const [pulse, setPulse] = React.useState(false);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
          Fluid AI Orb
        </span>
        <span className="font-mono text-[10px] font-bold text-[#0056FF]">Real-time Pulse</span>
      </div>

      <div className="flex min-h-[160px] items-center justify-center py-4">
        <button
          type="button"
          onClick={() => setPulse(!pulse)}
          className="group relative flex size-28 items-center justify-center rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-none"
        >
          {/* Outer Luminous Glow */}
          <div
            className={cn(
              'absolute inset-0 rounded-full bg-gradient-to-tr from-[#0056FF] via-[#7B2CBF] to-[#00F5D4] opacity-70 blur-xl transition-all duration-700',
              pulse ? 'scale-125 opacity-90' : 'animate-pulse',
            )}
          />

          {/* Morphing Inner Sphere */}
          <div className="relative size-24 rounded-full bg-gradient-to-tr from-[#0056FF] via-[#4361EE] to-[#4CC9F0] shadow-inner flex items-center justify-center">
            <div className="size-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
              <Sparkles className="size-8 text-white drop-shadow-md animate-spin-slow" />
            </div>
          </div>
        </button>
      </div>

      <p className="font-sans text-xs text-slate-500">
        Tap the luminescent orb to simulate real-time agent neural synthesis.
      </p>
    </div>
  );
}

// 2. Grid Reveal (Matrix Cards with Scanning Beam)
export function GridRevealDemo() {
  const [activeCard, setActiveCard] = React.useState<number | null>(0);
  const cards = [
    { title: 'Autonomous Roster Check', tag: 'Agent 01', speed: '12ms' },
    { title: 'Ledger Hash Proofing', tag: 'Agent 02', speed: '28ms' },
    { title: 'Multi-Branch Sync Gate', tag: 'Agent 03', speed: '19ms' },
    { title: 'Dispute Verification', tag: 'Agent 04', speed: '34ms' },
  ];

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
          Grid Matrix Laser Reveal
        </span>
        <span className="font-mono text-[10px] font-bold text-slate-400">4 Active Nodes</span>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        {cards.map((card, idx) => {
          const isActive = activeCard === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveCard(idx)}
              className={cn(
                'relative flex flex-col justify-between overflow-hidden rounded-2xl border p-3.5 text-left transition-all',
                isActive
                  ? 'border-[#0056FF] bg-[#E3E7FC]/40 shadow-xs'
                  : 'border-slate-200 bg-slate-50 hover:border-slate-300',
              )}
            >
              {/* Scanline Beam on Active */}
              {isActive && (
                <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-[#0056FF] to-transparent animate-pulse" />
              )}
              <div className="flex items-center justify-between font-mono text-[10px] text-slate-400">
                <span>{card.tag}</span>
                <span className="text-[#0056FF] font-bold">{card.speed}</span>
              </div>
              <h5 className="mt-2 font-sans text-xs font-bold text-slate-900">{card.title}</h5>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// 3. Matrix Orb (Digital Cybernetic Telemetry Orb)
export function MatrixOrbDemo() {
  const [online, setOnline] = React.useState(true);

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-950 p-5 text-center text-white shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400">
          Cybernetic Telemetry Orb
        </span>
        <span className="font-mono text-[10px] font-bold text-emerald-400">ONLINE 99.8%</span>
      </div>

      <div className="flex min-h-[150px] items-center justify-center py-2">
        <div className="relative flex size-28 items-center justify-center">
          {/* Concentric Rotating Rings */}
          <div className="absolute inset-0 rounded-full border border-dashed border-blue-500/40 animate-spin-slow" />
          <div className="absolute inset-2 rounded-full border border-dotted border-cyan-400/50 animate-reverse-spin" />

          {/* Central Core */}
          <div className="flex size-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_0_20px_rgba(0,180,255,0.6)]">
            <Terminal className="size-6 text-white" />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 font-mono text-[11px] text-slate-300">
        <span>Subsystem: Neural Cluster A</span>
        <button
          type="button"
          onClick={() => setOnline(!online)}
          className="text-cyan-400 hover:underline"
        >
          {online ? 'Active' : 'Standby'}
        </button>
      </div>
    </div>
  );
}

// 4. Web Search (AI Agent Live Search Component)
export function WebSearchDemo() {
  const [query, setQuery] = React.useState('Cambodia National Higher Education curriculum rules');
  const [isSearching, setIsSearching] = React.useState(false);

  const sources = [
    { title: 'MoEYS Official Standards', domain: 'moeys.gov.kh' },
    { title: 'National Qualifications Framework', domain: 'acc.edu.kh' },
    { title: 'SNP Academic Statutes', domain: 'snp.edu.kh' },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 800);
  };

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
      <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
        Agentic Web Search & Synthesis
      </span>

      <form onSubmit={handleSearch} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search institutional standards..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pr-20 pl-9 font-sans text-xs font-semibold text-slate-900 focus:border-[#0056FF] focus:bg-white focus:outline-none"
        />
        <Search className="absolute top-1/2 left-3 -translate-y-1/2 size-4 text-[#0056FF]" />
        <button
          type="submit"
          className="absolute top-1/2 right-1.5 -translate-y-1/2 rounded-lg bg-[#0056FF] px-2.5 py-1 font-sans text-[11px] font-bold text-white hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Cited Sources */}
      <div className="space-y-1.5">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">
          Cited Regulatory Sources
        </span>
        <div className="flex flex-wrap gap-1.5">
          {sources.map((s, idx) => (
            <div
              key={idx}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px]"
            >
              <Globe className="size-3 text-[#0056FF]" />
              <span className="font-sans font-semibold text-slate-800">{s.title}</span>
              <span className="font-mono text-[9px] text-slate-400">({s.domain})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// 5. Inline AI Status Pill
export function InlineAiStatusDemo() {
  const [step, setStep] = React.useState(0);
  const statuses = [
    { text: 'Thinking & analyzing query intent...', color: 'bg-blue-500', icon: Sparkles },
    { text: 'Querying 52 MongoDB collections...', color: 'bg-amber-500', icon: Database },
    { text: 'Synthesizing verified institutional audit...', color: 'bg-purple-500', icon: Globe },
    { text: 'Audit verification complete (Exit Code 0)', color: 'bg-emerald-500', icon: Check },
  ];

  const current = statuses[step] || statuses[0]!;

  return (
    <div className="w-full max-w-md space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-xs">
      <span className="font-sans text-xs font-bold uppercase tracking-wider text-slate-800">
        Streaming Agent Status Pill
      </span>

      <div className="flex justify-center py-2">
        <div className="inline-flex items-center gap-2.5 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 shadow-xs transition-all">
          <span className={cn('size-2 rounded-full animate-ping', current.color)} />
          <span className="font-sans text-xs font-semibold text-slate-800">{current.text}</span>
        </div>
      </div>

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setStep((step + 1) % statuses.length)}
          className="rounded-full bg-[#0056FF] px-3.5 py-1 font-sans text-xs font-bold text-white hover:bg-blue-700"
        >
          Next Agent State
        </button>
      </div>
    </div>
  );
}
