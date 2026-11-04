'use client';

import * as React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Sliders, Sparkles, Layers, Activity, Copy } from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BentoHeroGridProps {
  className?: string;
  onExploreCampus?: () => void;
  onSelectProgram?: (query: string) => void;
  onBulletinClick?: () => void;
}

type MascotMood = 'curious' | 'focus' | 'joyful' | 'sleepy';
type CampusNodeKey = 'pp' | 'sr' | 'bt';
type RadiusOption = '0px' | '8px' | '16px' | '9999px';
type ElevationOption = 'flat' | 'bordered' | 'raised';

interface CampusNode {
  key: CampusNodeKey;
  code: string;
  name: string;
  location: string;
  latency: string;
  status: string;
  x: number; // percentage
  y: number; // percentage
}

const CAMPUS_NODES: CampusNode[] = [
  {
    key: 'pp',
    code: 'PP-01',
    name: 'SNPI Central HQ',
    location: 'Phnom Penh Hub',
    latency: '2.4ms',
    status: 'Operational',
    x: 42,
    y: 44,
  },
  {
    key: 'sr',
    code: 'SR-02',
    name: 'Siem Reap Edge',
    location: 'Angkor Tech Lab',
    latency: '4.8ms',
    status: 'Synchronized',
    x: 74,
    y: 30,
  },
  {
    key: 'bt',
    code: 'BT-03',
    name: 'Battambang Node',
    location: 'West Campus Relay',
    latency: '5.2ms',
    status: 'Synchronized',
    x: 26,
    y: 68,
  },
];

interface KidQuestion {
  label: string;
  reply: string;
  mood: MascotMood;
}

const KID_QUESTIONS: KidQuestion[] = [
  {
    label: 'Who are you?',
    reply: "I'm Snappy, your SNPI campus mascot!",
    mood: 'joyful',
  },
  {
    label: 'Favorite color?',
    reply: 'Royal Blue #0056FF & Soft Lavender!',
    mood: 'focus',
  },
  {
    label: 'Tell a joke!',
    reply: 'Why do robots like coding? Because it has zero bugs!',
    mood: 'joyful',
  },
  {
    label: 'Secret power?',
    reply: 'I can do a backflip and compile code instantly!',
    mood: 'curious',
  },
];

const POKE_REPLIES = [
  'Hehe, that tickles!',
  'Boing! High five!',
  'Ready to build cool apps!',
  'Beep boop, let us code!',
];

/**
 * BentoHeroGrid
 *
 * Clean, editorial, highly interactive bento grid hero:
 * - Card 1 (Top Left): 3 vector brand mascots in pure brand tokens.
 * - Card 2 (Top Middle): Tactile Academic Semester Tracker in Royal & Azure Blue.
 * - Card 3 (Middle Left): Clean Vector Radar with interactive campus nodes and latency.
 * - Card 4 (Center): Kinetic Gyroscopic Harmonic Core inside organic flower mask cutout.
 * - Card 5 (Bottom Left): Design Token Laboratory with live radius & elevation controls.
 * - Card 6 (Bottom Middle): Clean Azure Blue Bulletin with architectural summary.
 * - Card 7 (Right Column): Interactive Kid-Friendly Mascot Lab with "Ask Kid" questions, poke physics, and reactive eyes.
 *
 * Enforces strict zero-emoji policy and SNPI primary brand tokens:
 * #0056FF (Royal Blue), #2277FF (Azure Blue), #E3E7FC (Soft Lavender), #FFFFFF (White), #EFF5FF (Ice Tint), #0A1A4A (Deep Navy).
 */
export function BentoHeroGrid({
  className,
  onExploreCampus,
  onSelectProgram: _onSelectProgram,
  onBulletinClick,
}: BentoHeroGridProps) {
  const shouldReduceMotion = useReducedMotion();

  // Card 2: Academic Calendar toggle state
  const [calendarView, setCalendarView] = React.useState<'day' | 'week'>('day');

  // Card 3: Interactive Radar Node Selection
  const [activeNodeKey, setActiveNodeKey] = React.useState<CampusNodeKey>('pp');
  const activeNode = CAMPUS_NODES.find((n) => n.key === activeNodeKey) || CAMPUS_NODES[0];

  // Card 5: Token Sandbox Controls
  const [selectedRadius, setSelectedRadius] = React.useState<RadiusOption>('16px');
  const [selectedElevation, setSelectedElevation] = React.useState<ElevationOption>('raised');
  const [copiedSnippet, setCopiedSnippet] = React.useState<boolean>(false);

  // Card 7: Kid Conversation & Mascot Interaction
  const [activeMood, setActiveMood] = React.useState<MascotMood>('curious');
  const [mascotPoked, setMascotPoked] = React.useState(false);
  const [speechText, setSpeechText] = React.useState<string>('Tap a question or poke me!');
  const [showSpeechBubble, setShowSpeechBubble] = React.useState(true);
  const [pokeIndex, setPokeIndex] = React.useState(0);
  const rightCardRef = React.useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = React.useState({ x: 0, y: 0 });

  const handleRightCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !rightCardRef.current || activeMood !== 'curious') return;
    const rect = rightCardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5;
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setEyeOffset({
      x: Math.max(-9, Math.min(9, relX * 22)),
      y: Math.max(-7, Math.min(7, relY * 16)),
    });
  };

  const handleRightCardMouseLeave = () => {
    setEyeOffset({ x: 0, y: 0 });
  };

  const handleAskKidQuestion = (q: KidQuestion) => {
    setSpeechText(q.reply);
    setActiveMood(q.mood);
    setShowSpeechBubble(true);
    setMascotPoked(true);
    setTimeout(() => setMascotPoked(false), 500);
  };

  const handlePokeMascot = () => {
    const nextReply = POKE_REPLIES[pokeIndex % POKE_REPLIES.length];
    setPokeIndex((i) => i + 1);
    setSpeechText(nextReply);
    setActiveMood(pokeIndex % 2 === 0 ? 'joyful' : 'curious');
    setShowSpeechBubble(true);
    setMascotPoked(true);
    setTimeout(() => setMascotPoked(false), 500);
  };

  const handleCopyToken = () => {
    const snippet = `rounded-[${selectedRadius}] ${
      selectedElevation === 'raised'
        ? 'bg-[#0056FF] text-white shadow-md'
        : selectedElevation === 'bordered'
          ? 'border border-[#CAD3F5] bg-white text-[#0A1A4A]'
          : 'bg-[#EFF5FF] text-[#0056FF]'
    }`;
    navigator.clipboard?.writeText(snippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 1600);
  };

  return (
    <div
      className={cn(
        'w-full overflow-hidden rounded-[26px] border border-[#CAD3F5] bg-[#EFF5FF] p-3 shadow-xs select-none sm:p-5 lg:p-6',
        className,
      )}
    >
      {/* 3-COLUMN ASYMMETRIC BENTO GRID */}
      <div className="grid grid-cols-1 gap-3.5 sm:gap-4 md:grid-cols-2 lg:grid-cols-12 lg:gap-4.5">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: Mascots (Card 1) + Radar Telemetry (Card 3) + Token Lab (Card 5) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-4 lg:gap-4.5">
          {/* CARD 1: Mascots Trio (Clean Visual - Zero Text Clutter at Bottom) */}
          <div className="relative flex h-36 flex-col justify-between overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-white p-3.5 shadow-xs sm:h-40 sm:p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] font-bold tracking-wider text-[#0056FF] uppercase">
                SNPI Brand Companions
              </span>
              <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 text-[9px] font-bold text-[#0A1A4A]">
                Vector Primitives
              </span>
            </div>

            <div className="my-auto flex items-center justify-around py-1">
              {/* Mascot 1: Royal Blue Gum Shape (Sleepy Expression) */}
              <motion.div
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                className="relative flex size-18 cursor-pointer items-center justify-center sm:size-20"
                title="SNPI Kinetic Mascot 01 · Royal Blue"
              >
                <svg viewBox="0 0 249 247" className="size-full drop-shadow-xs">
                  <path
                    d="M245.7,56.1l0-9.9c0-22.7-18.4-41-41-41l-160.2,0c-22.7,0-41,18.4-41,41l0,9.9c0,11,4.3,21,11.4,28.4 c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4l0,9.9c0,11,4.3,21,11.4,28.4c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4 l0,10.1c0,22.7,18.4,41,41,41l160.2,0c22.7,0,41-18.4,41-41l0-10.1c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5 c7.1-7.4,11.4-17.4,11.4-28.4l0-9.9c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5C241.3,77.1,245.7,67.1,245.7,56.1z"
                    fill="#0056FF"
                  />
                  {/* Sleepy Eyes in Crisp White */}
                  <path
                    d="M75 110 Q90 126 105 110"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <path
                    d="M145 110 Q160 126 175 110"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <circle cx="125" cy="148" r="9" fill="#FFFFFF" />
                </svg>
              </motion.div>

              {/* Mascot 2: Soft Lavender Hexagon Shape (Inquisitive Expression) */}
              <motion.div
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                className="relative flex size-18 cursor-pointer items-center justify-center sm:size-20"
                title="SNPI Kinetic Mascot 02 · Soft Lavender"
              >
                <svg viewBox="0 0 277 301" className="size-full drop-shadow-xs">
                  <path
                    d="M108.103 8.24078C126.954 -2.64276 150.179 -2.64276 169.03 8.24078L246.169 52.7773C265.02 63.6609 276.633 83.7745 276.633 105.542V194.615C276.633 216.382 265.02 236.495 246.169 247.379L169.03 291.915C150.179 302.799 126.954 302.799 108.103 291.915L30.9635 247.379C12.1126 236.495 0.5 216.382 0.5 194.615V105.542C0.5 83.7745 12.1126 63.6609 30.9635 52.7773L108.103 8.24078Z"
                    fill="#E3E7FC"
                    stroke="#CAD3F5"
                    strokeWidth="4"
                  />
                  <circle cx="108" cy="140" r="11" fill="#0A1A4A" />
                  <circle cx="112" cy="136" r="4" fill="#FFFFFF" />
                  <circle cx="168" cy="140" r="11" fill="#0A1A4A" />
                  <circle cx="172" cy="136" r="4" fill="#FFFFFF" />
                  <path
                    d="M128 174 Q138 184 148 174"
                    stroke="#0A1A4A"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>

              {/* Mascot 3: Azure Blue Flower Shape (Joyful Wink) */}
              <motion.div
                whileTap={shouldReduceMotion ? undefined : { scale: 0.92 }}
                className="relative flex size-18 cursor-pointer items-center justify-center sm:size-20"
                title="SNPI Kinetic Mascot 03 · Azure Blue"
              >
                <svg viewBox="0 0 282 281" className="size-full drop-shadow-xs">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                    fill="#2277FF"
                  />
                  <path
                    d="M96 134 L114 144 L96 154"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M186 134 L168 144 L186 154"
                    stroke="#FFFFFF"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                  <path
                    d="M130 178 Q141 192 152 178"
                    stroke="#FFFFFF"
                    strokeWidth="7"
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>
              </motion.div>
            </div>
          </div>

          {/* CARD 3: Distributed Campus Telemetry Radar (Clean Visual - Zero Top Text Clutter) */}
          <div className="relative flex h-52 flex-col justify-between overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-white p-3.5 shadow-xs sm:h-56">
            {/* Center: Vector Radar Coordinate Grid with Sweep Beam */}
            <div className="relative mx-auto my-auto flex size-38 items-center justify-center sm:size-42">
              <svg viewBox="0 0 160 160" className="size-full">
                <circle
                  cx="80"
                  cy="80"
                  r="74"
                  stroke="#CAD3F5"
                  strokeWidth="1.5"
                  fill="#EFF5FF"
                  fillOpacity="0.5"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="52"
                  stroke="#CAD3F5"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                  fill="none"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="30"
                  stroke="#CAD3F5"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                  fill="none"
                />
                <circle cx="80" cy="80" r="4" fill="#0056FF" />
                <line x1="6" y1="80" x2="154" y2="80" stroke="#CAD3F5" strokeWidth="1" />
                <line x1="80" y1="6" x2="80" y2="154" stroke="#CAD3F5" strokeWidth="1" />
              </svg>

              {/* Rotating Radar Conical Sweep Beam */}
              {!shouldReduceMotion && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                  className="pointer-events-none absolute inset-0 size-full rounded-full"
                  style={{
                    background:
                      'conic-gradient(from 0deg, rgba(0, 86, 255, 0.28) 0deg, rgba(34, 119, 255, 0.08) 45deg, transparent 90deg)',
                  }}
                />
              )}

              {/* Interactive Campus Nodes on Radar Canvas */}
              {CAMPUS_NODES.map((node) => {
                const isSelected = node.key === activeNodeKey;
                return (
                  <button
                    key={node.key}
                    type="button"
                    onClick={() => {
                      setActiveNodeKey(node.key);
                      onExploreCampus?.();
                    }}
                    style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    className={cn(
                      'absolute -translate-x-1/2 -translate-y-1/2 transition-transform',
                      isSelected ? 'z-20 scale-120' : 'z-10',
                    )}
                    title={`${node.name} · ${node.latency}`}
                  >
                    <div className="relative flex items-center justify-center">
                      <div
                        className={cn(
                          'flex size-5 items-center justify-center rounded-full border text-[8px] font-black shadow-xs',
                          isSelected
                            ? 'border-white bg-[#0056FF] text-white'
                            : 'border-[#CAD3F5] bg-white text-[#0A1A4A]',
                        )}
                      >
                        {node.code.slice(0, 2)}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Bottom Glass Telemetry Strip */}
            <div className="relative z-10 flex items-center justify-between rounded-xl border border-[#CAD3F5] bg-[#EFF5FF]/90 px-3 py-1.5 backdrop-blur-xs">
              <div className="flex flex-col">
                <span className="text-[11px] font-bold text-[#0A1A4A]">
                  {activeNode.name} ({activeNode.code})
                </span>
                <span className="text-[9px] font-medium text-slate-500">
                  {activeNode.location} · {activeNode.status}
                </span>
              </div>
              <div className="flex items-center gap-1.5 font-mono text-[11px] font-black text-[#0056FF]">
                <Activity className="size-3" />
                <span>{activeNode.latency}</span>
              </div>
            </div>
          </div>

          {/* CARD 5: Design Token Laboratory (Zero Footer Text Clutter) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#CAD3F5]/80 bg-white p-4 shadow-xs sm:p-5">
            {/* Header: Title & Version Pill */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Sliders className="size-4 text-[#0056FF]" />
                <span className="font-sans text-xs font-bold text-[#0A1A4A]">
                  Design Token Laboratory
                </span>
              </div>
              <span className="rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2 py-0.5 font-mono text-[9px] font-bold text-[#0056FF]">
                LIVE PREVIEW
              </span>
            </div>

            {/* Interactive Radius Pills */}
            <div className="mb-2.5">
              <div className="mb-1 text-[10px] font-bold text-slate-500">Border Radius:</div>
              <div className="grid grid-cols-4 gap-1">
                {(['0px', '8px', '16px', '9999px'] as RadiusOption[]).map((rad) => (
                  <button
                    key={rad}
                    type="button"
                    onClick={() => setSelectedRadius(rad)}
                    className={cn(
                      'rounded-md px-1.5 py-1 text-center font-mono text-[10px] font-bold transition-all',
                      selectedRadius === rad
                        ? 'border border-[#0056FF] bg-[#0056FF] text-white'
                        : 'border border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]',
                    )}
                  >
                    {rad === '9999px' ? 'Pill' : rad}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Elevation Pills */}
            <div className="mb-3">
              <div className="mb-1 text-[10px] font-bold text-slate-500">Surface Elevation:</div>
              <div className="grid grid-cols-3 gap-1">
                {(['flat', 'bordered', 'raised'] as ElevationOption[]).map((elv) => (
                  <button
                    key={elv}
                    type="button"
                    onClick={() => setSelectedElevation(elv)}
                    className={cn(
                      'rounded-md px-1.5 py-1 text-center text-[10px] font-bold capitalize transition-all',
                      selectedElevation === elv
                        ? 'border border-[#0056FF] bg-[#0056FF] text-white'
                        : 'border border-[#CAD3F5] bg-[#EFF5FF] text-[#0A1A4A]',
                    )}
                  >
                    {elv}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Component Preview Sandbox Capsule */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] p-3 text-center">
              <button
                type="button"
                onClick={handleCopyToken}
                style={{
                  borderRadius:
                    selectedRadius === '9999px'
                      ? '9999px'
                      : selectedRadius === '16px'
                        ? '16px'
                        : selectedRadius === '8px'
                          ? '8px'
                          : '0px',
                }}
                className={cn(
                  'flex items-center gap-2 px-4 py-2 font-sans text-xs font-bold transition-all active:scale-95',
                  selectedElevation === 'raised' &&
                    'border border-transparent bg-[#0056FF] text-white shadow-sm',
                  selectedElevation === 'bordered' &&
                    'border border-[#CAD3F5] bg-white text-[#0A1A4A]',
                  selectedElevation === 'flat' &&
                    'border border-transparent bg-[#E3E7FC] text-[#0056FF]',
                )}
              >
                <Layers className="size-3.5" />
                <span>{copiedSnippet ? 'Copied Token Class!' : 'Interactive SNPI Token'}</span>
                <Copy className="size-3 opacity-70" />
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Calendar (Card 2) + Kinetic Harmonic Core (Card 4) + Bulletin (Card 6) */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-4 lg:gap-4.5">
          {/* CARD 2: Tactile Semester Calendar (Zero TERM 02 Badge - Pure Blue Gradient) */}
          <div
            onClick={() => setCalendarView(calendarView === 'day' ? 'week' : 'day')}
            className="relative flex h-36 cursor-pointer items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#0056FF] to-[#2277FF] p-4 text-white shadow-xs sm:h-40"
          >
            {/* Tactile Calendar Icon Body */}
            <div className="flex flex-col items-center">
              <svg
                width="56"
                height="56"
                viewBox="0 0 60 60"
                fill="none"
                className="drop-shadow-xs"
              >
                <rect
                  x="8"
                  y="12"
                  width="44"
                  height="40"
                  rx="10"
                  stroke="white"
                  strokeWidth="3.5"
                  fill="none"
                />
                <line x1="8" y1="23" x2="52" y2="23" stroke="white" strokeWidth="3" />
                <circle cx="18" cy="8" r="3" fill="white" />
                <circle cx="42" cy="8" r="3" fill="white" />
                <text
                  x="30"
                  y="43"
                  textAnchor="middle"
                  fill="white"
                  fontSize={calendarView === 'day' ? '18' : '15'}
                  fontWeight="900"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  {calendarView === 'day' ? '17' : 'W04'}
                </text>
              </svg>
              <span className="mt-1 font-mono text-[11px] font-bold tracking-wider text-blue-100 uppercase">
                {calendarView === 'day'
                  ? 'Fall Admissions · Day 17'
                  : 'Curriculum Sprint · Week 04'}
              </span>
            </div>
          </div>

          {/* CARD 4: Kinetic Harmonic Brand Core (Zero Hover Triggers / No Acceleration Badge) */}
          <div className="relative flex h-64 items-center justify-center overflow-hidden rounded-[20px] bg-[#0056FF] p-4 shadow-xs sm:h-72">
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.22)_0%,transparent_75%)]" />

            {/* Signature Organic Flower Mask SVG Framing the Harmonic Gyroscope Core */}
            <div className="relative size-52 sm:size-58">
              <svg
                viewBox="0 0 282 281"
                className="size-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
              >
                <defs>
                  <clipPath id="snpi-flower-mask">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                    />
                  </clipPath>
                </defs>

                <rect width="282" height="281" fill="#0A1A4A" clipPath="url(#snpi-flower-mask)" />

                {/* Gyroscopic Harmonic Rings */}
                <g clipPath="url(#snpi-flower-mask)">
                  <circle
                    cx="141"
                    cy="140"
                    r="92"
                    stroke="#2277FF"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    fill="none"
                    opacity="0.8"
                  />
                  <circle
                    cx="141"
                    cy="140"
                    r="68"
                    stroke="#E3E7FC"
                    strokeWidth="2.5"
                    fill="none"
                    opacity="0.9"
                  />
                  <circle
                    cx="141"
                    cy="140"
                    r="44"
                    stroke="#0056FF"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    fill="none"
                  />
                  <line
                    x1="41"
                    y1="140"
                    x2="241"
                    y2="140"
                    stroke="#E3E7FC"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <line
                    x1="141"
                    y1="40"
                    x2="141"
                    y2="240"
                    stroke="#E3E7FC"
                    strokeWidth="1"
                    opacity="0.4"
                  />
                  <circle cx="141" cy="72" r="5" fill="#FFFFFF" />
                  <circle cx="209" cy="140" r="5" fill="#E3E7FC" />
                  <circle cx="141" cy="208" r="5" fill="#2277FF" />
                  <circle cx="73" cy="140" r="5" fill="#FFFFFF" />

                  <circle
                    cx="141"
                    cy="140"
                    r="24"
                    fill="#0056FF"
                    stroke="#FFFFFF"
                    strokeWidth="2.5"
                  />
                  <text
                    x="141"
                    y="145"
                    textAnchor="middle"
                    fill="#FFFFFF"
                    fontSize="11"
                    fontWeight="900"
                    fontFamily="monospace"
                  >
                    SNPI
                  </text>
                </g>

                <path
                  d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                />
              </svg>
            </div>
          </div>

          {/* CARD 6: Azure Blue Bulletin (Clean Architectural Statement - Zero Cycling Clutter) */}
          <div
            onClick={onBulletinClick}
            className="relative flex h-44 cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2277FF] to-[#0056FF] p-5 text-white shadow-xs sm:h-48"
          >
            <div>
              <div className="flex items-center justify-between">
                <h3 className="font-sans text-2xl font-black tracking-tight text-white">
                  Bulletin
                </h3>
                <span className="rounded-full border border-white/30 bg-white/15 px-2.5 py-0.5 font-mono text-[9px] font-bold text-white">
                  Release v2.8
                </span>
              </div>
              <p className="mt-2 font-sans text-xs font-bold text-white">
                SNPI Autonomous Campus Engine
              </p>
              <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-blue-100/90 sm:max-w-[240px]">
                Next.js 15 App Router Edge proxying directly to Express 5 backend services.
              </p>
            </div>

            {/* Bottom-Right Line-Art Speech Bubble with Pencil Icon */}
            <div className="pointer-events-none absolute -right-2 -bottom-2 p-3 text-white/40">
              <svg
                width="64"
                height="64"
                viewBox="0 0 64 64"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 34C14 22.9543 22.9543 14 34 14C45.0457 14 54 22.9543 54 34C54 45.0457 45.0457 54 34 54H24L14 59V49C14 44 14 38 14 34Z" />
                <path d="M28 35L41 22L45 26L32 39H28V35Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Interactive Kid-Friendly Mascot Lab ("Ask Kid" Conversation) */}
        {/* ========================================================================= */}
        <div
          ref={rightCardRef}
          onMouseMove={handleRightCardMouseMove}
          onMouseLeave={handleRightCardMouseLeave}
          className="relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-white p-5 shadow-xs sm:p-6 lg:col-span-4"
        >
          {/* Top Section: Brand Radar Disc */}
          <div className="flex items-center justify-between">
            <div className="relative flex size-14 items-center justify-center rounded-full bg-[#0056FF] shadow-xs sm:size-16">
              <svg
                viewBox="0 0 484 484"
                className="pointer-events-none absolute inset-0 size-full opacity-40"
              >
                <circle
                  cx="241.7"
                  cy="241.7"
                  r="240.2"
                  stroke="white"
                  strokeWidth="8"
                  fill="none"
                />
                <circle cx="242.2" cy="241.2" r="62.5" stroke="white" strokeWidth="8" fill="none" />
                <circle cx="241.7" cy="241.7" r="29.4" stroke="white" strokeWidth="8" fill="none" />
                <line x1="70" y1="410" x2="195" y2="284" stroke="white" strokeWidth="8" />
                <line x1="287" y1="195" x2="413" y2="70" stroke="white" strokeWidth="8" />
              </svg>
              <Sparkles className="relative z-10 size-6 text-white" />
            </div>

            {/* Mood Selector Tabs */}
            <div className="flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] p-1">
              {(['curious', 'focus', 'joyful', 'sleepy'] as MascotMood[]).map((mood) => (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setActiveMood(mood)}
                  className={cn(
                    'rounded-full px-2 py-0.5 text-[10px] font-bold capitalize transition-all select-none',
                    activeMood === mood ? 'bg-[#0056FF] text-white shadow-xs' : 'text-[#0A1A4A]',
                  )}
                >
                  {mood}
                </button>
              ))}
            </div>
          </div>

          {/* Middle Section: "Ask Kid" Interactive Question Lab */}
          <div className="my-3 text-center">
            <h2 className="font-sans text-xl font-black tracking-tight text-[#0A1A4A] sm:text-2xl">
              Kinetic Mascot Lab
            </h2>
            <p className="mt-0.5 text-[11px] font-medium text-slate-500">
              Ask the mascot or tap to poke!
            </p>

            {/* "Ask Kid" Interactive Questions Grid */}
            <div className="mt-2.5 grid grid-cols-2 gap-1.5">
              {KID_QUESTIONS.map((q) => (
                <button
                  key={q.label}
                  type="button"
                  onClick={() => handleAskKidQuestion(q)}
                  className="rounded-xl border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1.5 text-left text-[11px] font-bold text-[#0056FF] active:scale-95"
                >
                  {q.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bottom Section: Giant Peeking Mascot Dome with Expressive Reactive Eyes */}
          <div className="relative mt-auto w-full pt-1">
            {/* Dynamic Kid Speech Bubble */}
            {showSpeechBubble && (
              <motion.div
                key={speechText}
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="absolute -top-10 left-1/2 z-20 w-[92%] -translate-x-1/2 rounded-2xl border border-[#CAD3F5] bg-white px-3 py-1.5 text-center text-xs font-bold text-[#0056FF] shadow-sm"
              >
                {speechText}
              </motion.div>
            )}

            {/* Mascot Arch Dome in Brand Royal Blue (Tap to Poke / Bounce) */}
            <motion.div
              animate={
                mascotPoked
                  ? { y: [-16, 0], rotate: [0, -3, 3, 0] }
                  : activeMood === 'sleepy'
                    ? { y: [0, 4, 0] }
                    : undefined
              }
              transition={{
                duration: activeMood === 'sleepy' ? 3 : 0.35,
                repeat: activeMood === 'sleepy' ? Infinity : 0,
              }}
              onClick={handlePokeMascot}
              className="relative mx-auto flex h-36 w-full max-w-[280px] cursor-pointer items-center justify-center gap-3 rounded-t-[120px] bg-[#0056FF] pt-4 shadow-inner sm:h-44"
              title="Tap mascot to poke!"
            >
              {/* EYE 1 (Left) */}
              <div className="relative flex h-24 w-20 items-center justify-center rounded-full bg-white shadow-md sm:h-28 sm:w-24">
                {activeMood === 'curious' && (
                  <div
                    className="relative flex h-16 w-14 items-center justify-center rounded-full bg-[#0A1A4A] transition-transform duration-100 ease-out sm:h-20 sm:w-16"
                    style={{
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    }}
                  >
                    <div
                      className="absolute top-1.5 right-2 size-4 bg-white sm:top-2 sm:right-2.5 sm:size-5"
                      style={{ clipPath: 'polygon(100% 0, 0 45%, 100% 90%)' }}
                    />
                  </div>
                )}

                {activeMood === 'focus' && (
                  <div className="h-8 w-14 rounded-full bg-[#0A1A4A] sm:h-10 sm:w-16">
                    <div className="mx-auto mt-1 size-2 rounded-full bg-[#7DD3FC]" />
                  </div>
                )}

                {activeMood === 'joyful' && (
                  <svg viewBox="0 0 40 30" className="size-10 sm:size-12">
                    <path
                      d="M6 22 Q20 4 34 22"
                      stroke="#0A1A4A"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}

                {activeMood === 'sleepy' && (
                  <svg viewBox="0 0 40 30" className="size-10 sm:size-12">
                    <path
                      d="M6 10 Q20 24 34 10"
                      stroke="#0A1A4A"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
              </div>

              {/* EYE 2 (Right) */}
              <div className="relative flex h-24 w-20 items-center justify-center rounded-full bg-white shadow-md sm:h-28 sm:w-24">
                {activeMood === 'curious' && (
                  <div
                    className="relative flex h-16 w-14 items-center justify-center rounded-full bg-[#0A1A4A] transition-transform duration-100 ease-out sm:h-20 sm:w-16"
                    style={{
                      transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                    }}
                  >
                    <div
                      className="absolute top-1.5 right-2 size-4 bg-white sm:top-2 sm:right-2.5 sm:size-5"
                      style={{ clipPath: 'polygon(100% 0, 0 45%, 100% 90%)' }}
                    />
                  </div>
                )}

                {activeMood === 'focus' && (
                  <div className="h-8 w-14 rounded-full bg-[#0A1A4A] sm:h-10 sm:w-16">
                    <div className="mx-auto mt-1 size-2 rounded-full bg-[#7DD3FC]" />
                  </div>
                )}

                {activeMood === 'joyful' && (
                  <svg viewBox="0 0 40 30" className="size-10 sm:size-12">
                    <path
                      d="M6 22 Q20 4 34 22"
                      stroke="#0A1A4A"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}

                {activeMood === 'sleepy' && (
                  <svg viewBox="0 0 40 30" className="size-10 sm:size-12">
                    <path
                      d="M6 10 Q20 24 34 10"
                      stroke="#0A1A4A"
                      strokeWidth="6"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
