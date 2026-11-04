'use client';

import * as React from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'motion/react';
import {
  Building2,
  Search,
  Star,
  MapPin,
  Users,
  Check,
  GraduationCap,
  Sparkles,
  Terminal,
  Globe,
  ArrowRight,
  ChevronRight,
  BookOpen,
} from '@/components/icons';
import { cn } from '@/lib/utils';

export interface BentoHeroGridProps {
  className?: string;
  onExploreCampus?: () => void;
  onSelectProgram?: (query: string) => void;
  onBulletinClick?: () => void;
}

/**
 * BentoHeroGrid
 *
 * Authoritative editorial bento grid homepage hero matching the reference layout:
 * - Card 1 (Top Left): 3 vector mascots with organic shapes (Gum, Hexagon, Flower) and micro-expressions.
 * - Card 2 (Top Middle): Tactile Emerald Calendar card with date "17" and red notification pill "2".
 * - Card 3 (Middle Left): Academic campus architecture photography with frosted glass pill button.
 * - Card 4 (Center): Solid Royal Blue card with organic flower mask cutout framing student portrait.
 * - Card 5 (Bottom Left): Scalloped wavy program search card with metadata pills and interactive input.
 * - Card 6 (Bottom Middle): Azure Blue bulletin card with line-art dialogue/pencil graphic.
 * - Card 7 (Right Column): Full-height discovery card with golden radar disc, bold headline,
 *   app store download badges, and giant peeking Royal Blue mascot with interactive cutout eyes.
 *
 * Enforces strict zero-emoji policy and SNPI primary brand tokens:
 * #0056FF (Royal Blue), #2277FF (Azure Blue), #E3E7FC (Soft Lavender), #FFFFFF (White), #EFF5FF (Ice Tint).
 */
export function BentoHeroGrid({
  className,
  onExploreCampus,
  onSelectProgram,
  onBulletinClick,
}: BentoHeroGridProps) {
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeMascotIndex, setActiveMascotIndex] = React.useState<number | null>(null);

  // Right card interactive peeking mascot eye tracking
  const rightCardRef = React.useRef<HTMLDivElement>(null);
  const [eyeOffset, setEyeOffset] = React.useState({ x: 0, y: 0 });

  const handleRightCardMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduceMotion || !rightCardRef.current) return;
    const rect = rightCardRef.current.getBoundingClientRect();
    const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
    const relY = (e.clientY - rect.top) / rect.height - 0.5;
    setEyeOffset({
      x: Math.max(-8, Math.min(8, relX * 18)),
      y: Math.max(-6, Math.min(6, relY * 14)),
    });
  };

  const handleRightCardMouseLeave = () => {
    setEyeOffset({ x: 0, y: 0 });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSelectProgram) {
      onSelectProgram(searchQuery);
    }
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
        {/* LEFT COLUMN: Mascots (Card 1) + Campus Photo (Card 3) + Search (Card 5)   */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-4 lg:gap-4.5">
          {/* CARD 1: Mascots Trio (Gum, Hexagon, Flower shapes with cute faces) */}
          <div className="group relative flex h-36 items-center justify-around overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-white px-4 py-3 shadow-xs transition-shadow hover:shadow-sm sm:h-40">
            {/* Mascot 1: Orange Gum Wavy Shape (Sleepy Face) */}
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.12, rotate: -4 }}
              onHoverStart={() => setActiveMascotIndex(0)}
              onHoverEnd={() => setActiveMascotIndex(null)}
              className="relative flex size-20 cursor-pointer items-center justify-center sm:size-22"
              title="SNPI Kinetic Mascot · Coral Gum"
            >
              <svg viewBox="0 0 249 247" className="size-full drop-shadow-xs">
                {/* gum.svg Path */}
                <path
                  d="M245.7,56.1l0-9.9c0-22.7-18.4-41-41-41l-160.2,0c-22.7,0-41,18.4-41,41l0,9.9c0,11,4.3,21,11.4,28.4 c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4l0,9.9c0,11,4.3,21,11.4,28.4c1.5,1.5,1.5,4,0,5.5c-7.1,7.4-11.4,17.4-11.4,28.4 l0,10.1c0,22.7,18.4,41,41,41l160.2,0c22.7,0,41-18.4,41-41l0-10.1c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5 c7.1-7.4,11.4-17.4,11.4-28.4l0-9.9c0-11-4.3-21-11.4-28.4c-1.5-1.5-1.5-4,0-5.5C241.3,77.1,245.7,67.1,245.7,56.1z"
                  fill="#F97316"
                />
                {/* Sleepy Eyes: Curved arches */}
                <path
                  d="M75 110 Q90 126 105 110"
                  stroke="#0A1A4A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M145 110 Q160 126 175 110"
                  stroke="#0A1A4A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
                {/* Cute Open Mouth Circle */}
                <circle cx="125" cy="148" r="10" fill="#0A1A4A" />
              </svg>
            </motion.div>

            {/* Mascot 2: Azure Squircle Shape (Friendly Inquisitive Face) */}
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.12, rotate: 3 }}
              onHoverStart={() => setActiveMascotIndex(1)}
              onHoverEnd={() => setActiveMascotIndex(null)}
              className="relative flex size-20 cursor-pointer items-center justify-center sm:size-22"
              title="SNPI Kinetic Mascot · Azure Hexagon"
            >
              <svg viewBox="0 0 277 301" className="size-full drop-shadow-xs">
                {/* hexagon.svg Path */}
                <path
                  d="M108.103 8.24078C126.954 -2.64276 150.179 -2.64276 169.03 8.24078L246.169 52.7773C265.02 63.6609 276.633 83.7745 276.633 105.542V194.615C276.633 216.382 265.02 236.495 246.169 247.379L169.03 291.915C150.179 302.799 126.954 302.799 108.103 291.915L30.9635 247.379C12.1126 236.495 0.5 216.382 0.5 194.615V105.542C0.5 83.7745 12.1126 63.6609 30.9635 52.7773L108.103 8.24078Z"
                  fill="#7DD3FC"
                />
                {/* Eye 1 */}
                <circle cx="108" cy="140" r="12" fill="#0A1A4A" />
                <circle cx="112" cy="136" r="4" fill="#FFFFFF" />
                {/* Eye 2 */}
                <circle cx="168" cy="140" r="12" fill="#0A1A4A" />
                <circle cx="172" cy="136" r="4" fill="#FFFFFF" />
                {/* Smile */}
                <path
                  d="M128 174 Q138 184 148 174"
                  stroke="#0A1A4A"
                  strokeWidth="6"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </motion.div>

            {/* Mascot 3: Golden Flower / Sunburst (Joyful Wink Face) */}
            <motion.div
              whileHover={shouldReduceMotion ? undefined : { scale: 1.12, rotate: 6 }}
              onHoverStart={() => setActiveMascotIndex(2)}
              onHoverEnd={() => setActiveMascotIndex(null)}
              className="relative flex size-20 cursor-pointer items-center justify-center sm:size-22"
              title="SNPI Kinetic Mascot · Amber Blossom"
            >
              <svg viewBox="0 0 282 281" className="size-full drop-shadow-xs">
                {/* flower.svg Path */}
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                  fill="#F59E0B"
                />
                {/* Joyful Eyes: > < */}
                <path
                  d="M96 134 L114 144 L96 154"
                  stroke="#0A1A4A"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                <path
                  d="M186 134 L168 144 L186 154"
                  stroke="#0A1A4A"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                />
                {/* Smile */}
                <path
                  d="M130 178 Q141 192 152 178"
                  stroke="#0A1A4A"
                  strokeWidth="8"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>
            </motion.div>
          </div>

          {/* CARD 3: Campus Architecture Landscape Photography Card */}
          <div className="group relative h-52 overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-slate-900 shadow-xs transition-shadow hover:shadow-sm sm:h-56">
            {/* High-Resolution Academic Campus Photography */}
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80"
              alt="SNPI Central Campus Grounds and Innovation Wing"
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Subtle Gradient Shadow for High-Contrast Overlaid Pill */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Overlaid Frosted Pill Badge (Image 3 Reference) */}
            <div className="absolute right-3.5 bottom-3.5 left-3.5 flex justify-center sm:justify-start">
              <button
                type="button"
                onClick={onExploreCampus}
                className="flex items-center gap-2 rounded-full border border-white/50 bg-white/25 px-4 py-2 text-xs font-medium text-white shadow-sm backdrop-blur-md transition-all hover:bg-white/35 active:scale-95 sm:text-sm"
              >
                <Building2 className="size-4 shrink-0 text-white" />
                <span className="truncate">Explore SNPI Central Campus</span>
              </button>
            </div>
          </div>

          {/* CARD 5: Scalloped Wavy Program Search Card (Image 5 Reference) */}
          <div className="flex flex-col justify-between rounded-[20px] border border-[#CAD3F5]/80 bg-white p-4 shadow-xs transition-shadow hover:shadow-sm sm:p-5">
            {/* Top Metadata Tag Pills */}
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 text-[11px] font-bold text-[#0A1A4A]">
                <Star className="size-3 fill-[#F59E0B] text-[#F59E0B]" />
                4.9
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 text-[11px] font-bold text-[#0A1A4A]">
                <MapPin className="size-3 text-[#0056FF]" />
                12 km Radius
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1 text-[11px] font-bold text-[#0A1A4A]">
                <Users className="size-3 text-[#0056FF]" />2 Campuses
              </span>
            </div>

            {/* Center Scalloped Wavy Container (Golden Accent Container) */}
            <div className="relative mb-3 overflow-hidden rounded-2xl bg-[#FACC15] p-3.5 text-center sm:p-4">
              {/* Organic Scalloped Decorative Background Accents */}
              <div className="pointer-events-none absolute -right-6 -bottom-6 size-24 opacity-25">
                <svg viewBox="0 0 282 281" className="size-full fill-white">
                  <path d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z" />
                </svg>
              </div>

              <p className="mb-2 text-xs font-bold tracking-tight text-[#0A1A4A] sm:text-sm">
                Where do you want to study next?
              </p>

              {/* Interactive Search Bar Input Capsule */}
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <div className="flex items-center rounded-full border border-slate-200/80 bg-white px-3 py-1.5 shadow-xs transition-all focus-within:border-[#0056FF] focus-within:ring-2 focus-within:ring-[#0056FF]/20">
                  <Search className="size-4 shrink-0 text-[#0056FF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search degree programs or campus..."
                    className="w-full bg-transparent px-2 text-xs font-medium text-[#0A1A4A] placeholder:text-slate-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-slate-400 hover:text-slate-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Bottom Metadata Tag Pills */}
            <div className="flex items-center justify-between gap-2 text-[11px] font-bold text-[#0A1A4A]">
              <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1">
                <Check className="size-3 text-[#059669]" />
                Accredited MOEYS
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-[#CAD3F5] bg-[#EFF5FF] px-2.5 py-1">
                <GraduationCap className="size-3 text-[#0056FF]" />
                100+ Programs
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* CENTER COLUMN: Calendar (Card 2) + Flower Mask (Card 4) + Blog (Card 6)    */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3.5 sm:gap-4 lg:col-span-4 lg:gap-4.5">
          {/* CARD 2: Green Calendar Card with "17" and Red Notification Badge "2" */}
          <div className="group relative flex h-36 items-center justify-center overflow-hidden rounded-[20px] bg-gradient-to-br from-[#10B981] to-[#059669] p-4 text-white shadow-xs transition-transform duration-300 hover:scale-[1.01] sm:h-40">
            {/* Red Notification Badge (Upper Right Corner) */}
            <div className="absolute top-3 right-3 flex size-6 items-center justify-center rounded-full border-2 border-white bg-rose-500 font-sans text-xs font-black text-white shadow-xs sm:size-7">
              2
            </div>

            {/* Tactile Calendar Icon (Image 2 Reference) */}
            <div className="flex flex-col items-center">
              <svg
                width="60"
                height="60"
                viewBox="0 0 60 60"
                fill="none"
                className="drop-shadow-xs"
              >
                {/* Calendar Body Box */}
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
                {/* Top Binder Line */}
                <line x1="8" y1="23" x2="52" y2="23" stroke="white" strokeWidth="3" />
                {/* Top Left Hook */}
                <circle cx="18" cy="8" r="3" fill="white" />
                {/* Top Right Hook */}
                <circle cx="42" cy="8" r="3" fill="white" />
                {/* Day Number: "17" */}
                <text
                  x="30"
                  y="43"
                  textAnchor="middle"
                  fill="white"
                  fontSize="18"
                  fontWeight="900"
                  fontFamily="system-ui, -apple-system, sans-serif"
                >
                  17
                </text>
              </svg>
              <span className="mt-1 text-[11px] font-bold tracking-wider text-emerald-100 uppercase">
                Fall Admissions
              </span>
            </div>
          </div>

          {/* CARD 4: Center Brand Royal Blue Card with Flower Organic Cutout Mask */}
          <div className="group relative flex h-64 items-center justify-center overflow-hidden rounded-[20px] bg-[#0056FF] p-4 shadow-xs transition-shadow hover:shadow-sm sm:h-72">
            {/* Background Radial Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.18)_0%,transparent_75%)]" />

            {/* Organic Flower Mask SVG framing the Student Image */}
            <div className="relative size-48 transition-transform duration-500 ease-out group-hover:scale-105 sm:size-56">
              <svg
                viewBox="0 0 282 281"
                className="size-full overflow-visible drop-shadow-[0_12px_24px_rgba(0,0,0,0.25)]"
              >
                <defs>
                  {/* Organic ClipPath using flower.svg Path */}
                  <clipPath id="snpi-flower-mask">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                    />
                  </clipPath>
                </defs>

                {/* White Contour Outline Stroke */}
                <path
                  d="M75.9469 280.078C91.5033 280.078 105.96 275.398 117.97 267.376C130.585 258.951 151.308 258.951 163.924 267.376C175.934 275.398 190.39 280.078 205.947 280.078C247.615 280.078 281.394 246.499 281.394 205.078C281.394 189.768 276.779 175.529 268.856 163.661C260.282 150.817 260.282 129.339 268.856 116.496C276.779 104.628 281.394 90.3887 281.394 75.0781C281.394 33.6568 247.615 0.078125 205.947 0.078125C190.39 0.078125 175.934 4.75843 163.924 12.7798C151.308 21.2056 130.585 21.2056 117.97 12.7798C105.96 4.75843 91.5033 0.078125 75.9469 0.078125C34.2787 0.078125 0.5 33.6568 0.5 75.0781C0.5 90.3887 5.11505 104.628 13.0377 116.496C21.6119 129.339 21.6119 150.817 13.0377 163.661C5.11505 175.529 0.5 189.768 0.5 205.078C0.5 246.499 34.2787 280.078 75.9469 280.078Z"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="8"
                />

                {/* Cropped Smiling Student Photo */}
                <image
                  href="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80"
                  width="282"
                  height="281"
                  preserveAspectRatio="xMidYMid slice"
                  clipPath="url(#snpi-flower-mask)"
                />
              </svg>
            </div>
          </div>

          {/* CARD 6: Azure Blue Bulletin / Blog Card with Speech Bubble Line Art */}
          <div
            onClick={onBulletinClick}
            className="group relative flex h-44 cursor-pointer flex-col justify-between overflow-hidden rounded-[20px] bg-gradient-to-br from-[#2277FF] to-[#0056FF] p-5 text-white shadow-xs transition-shadow hover:shadow-sm sm:h-48"
          >
            <div>
              <h3 className="font-sans text-2xl font-black tracking-tight text-white">Bulletin</h3>
              <p className="mt-1 max-w-[200px] text-xs leading-relaxed text-blue-100/90 sm:max-w-[220px]">
                The latest institutional news, curriculum updates, research papers and guidelines.
              </p>
            </div>

            {/* Bottom-Right Line-Art Speech Bubble with Pencil Icon */}
            <div className="absolute -right-2 -bottom-2 p-3 text-white/80 transition-transform duration-300 group-hover:scale-110">
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
                {/* Speech Bubble Contour */}
                <path d="M14 34C14 22.9543 22.9543 14 34 14C45.0457 14 54 22.9543 54 34C54 45.0457 45.0457 54 34 54H24L14 59V49C14 44 14 38 14 34Z" />
                {/* Diagonal Pencil / Write Line */}
                <path d="M28 35L41 22L45 26L32 39H28V35Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: Full-Height Vertical Discovery Card (Card 7)                */}
        {/* ========================================================================= */}
        <div
          ref={rightCardRef}
          onMouseMove={handleRightCardMouseMove}
          onMouseLeave={handleRightCardMouseLeave}
          className="group relative flex flex-col justify-between overflow-hidden rounded-[20px] border border-[#CAD3F5]/80 bg-white p-6 shadow-xs transition-shadow hover:shadow-sm lg:col-span-4"
        >
          {/* Top Section: Golden Disc with Radar Rings & Academic Stamps */}
          <div className="relative mx-auto flex size-20 items-center justify-center rounded-full bg-[#F59E0B] shadow-md sm:size-24">
            {/* Concentric Disc Radar Graphic from disc.svg */}
            <svg
              viewBox="0 0 484 484"
              className="pointer-events-none absolute inset-0 size-full opacity-35"
            >
              <circle cx="241.7" cy="241.7" r="240.2" stroke="white" strokeWidth="8" fill="none" />
              <circle cx="242.2" cy="241.2" r="62.5" stroke="white" strokeWidth="8" fill="none" />
              <circle cx="241.7" cy="241.7" r="29.4" stroke="white" strokeWidth="8" fill="none" />
              <line x1="70" y1="410" x2="195" y2="284" stroke="white" strokeWidth="8" />
              <line x1="287" y1="195" x2="413" y2="70" stroke="white" strokeWidth="8" />
            </svg>

            {/* Academic Center Stickers */}
            <div className="relative z-10 flex flex-wrap items-center justify-center gap-1 text-white">
              <GraduationCap className="size-6 text-white drop-shadow-xs" />
              <Sparkles className="size-4 text-amber-100" />
            </div>
          </div>

          {/* Middle Section: Monumental Headline & Download Badges */}
          <div className="my-6 text-center">
            <h2 className="font-sans text-3xl leading-[1.08] font-black tracking-tight text-[#0A1A4A] sm:text-4xl lg:text-[40px]">
              Find your <br />
              academic future
            </h2>
            <p className="mt-2 text-xs font-medium text-slate-500 sm:text-sm">
              State Network Polytechnic Institute · Official Student & Faculty Cloud Experience
            </p>

            {/* App Store & Google Play Download Badges */}
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
              {/* Apple App Store Badge */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-[#0A1A4A] px-3.5 py-2 text-white shadow-xs transition-all hover:bg-[#0056FF] active:scale-95"
              >
                {/* Apple Vector Logo */}
                <svg viewBox="0 0 170 170" width="16" height="16" fill="currentColor">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.6-7.85-11.7-14.43-6-9.68-10.46-20.2-13.39-31.57-2.93-11.37-4.4-22.37-4.4-33 0-14.04 3.49-25.96 10.46-35.75 6.98-9.8 15.86-14.8 26.65-15.02 4.12 0 9.04 1.14 14.76 3.44 5.72 2.3 9.42 3.5 11.11 3.61 2.22-.22 6.08-1.5 11.58-3.83 5.5-2.34 10.15-3.41 13.94-3.23 10.46.66 18.99 4.34 25.59 11.05-9.35 5.67-13.88 13.73-13.6 24.18.28 8.05 3.26 14.86 8.94 20.43 5.68 5.57 12.39 8.78 20.14 9.64-2.12 6.53-4.7 13.06-7.73 19.59zM119.22 33.15c0-4.9.89-9.76 2.68-14.58 1.78-4.82 4.29-9.03 7.52-12.63 4.29-4.8 9.5-7.63 15.63-8.5 0 1.07.08 2.07.24 3 .15.93.15 1.77 0 2.52-.77 6.32-3.15 12.38-7.14 18.18-3.99 5.8-8.9 9.38-14.74 10.74-1.28.31-2.67.57-4.19.78-.14-.72-.21-1.39-.21-2.01z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase">
                    Download on the
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-white">App Store</div>
                </div>
              </button>

              {/* Google Play Badge */}
              <button
                type="button"
                className="flex items-center gap-2 rounded-xl bg-[#0A1A4A] px-3.5 py-2 text-white shadow-xs transition-all hover:bg-[#0056FF] active:scale-95"
              >
                {/* Google Play Vector Triangle */}
                <svg viewBox="0 0 512 512" width="15" height="15" fill="currentColor">
                  <path d="M325.3 234.3L104.6 13l280.8 161.2-60.1 59.9zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z" />
                </svg>
                <div className="text-left leading-none">
                  <div className="text-[9px] font-semibold tracking-wider text-slate-300 uppercase">
                    GET IT ON
                  </div>
                  <div className="mt-0.5 text-xs font-bold text-white">Google Play</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bottom Section: Giant Peeking Mascot Dome with Dynamic Cutout Eyes */}
          <div className="relative mt-auto w-full pt-4">
            {/* Mascot Arch Dome in Brand Royal Blue */}
            <div className="relative mx-auto flex h-36 w-full max-w-[280px] items-center justify-center gap-3 rounded-t-[120px] bg-[#0056FF] pt-4 shadow-inner sm:h-44">
              {/* Eye 1 (Left) */}
              <div className="relative flex h-24 w-20 items-center justify-center rounded-full bg-white shadow-md sm:h-28 sm:w-24">
                {/* Pupil with Interactive Eye Tracking */}
                <div
                  className="relative flex h-16 w-14 items-center justify-center rounded-full bg-[#0A1A4A] transition-transform duration-100 ease-out sm:h-20 sm:w-16"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  }}
                >
                  {/* Triangular Cutout Light Reflection Notch (Upper Right 1 o'clock) */}
                  <div
                    className="absolute top-1.5 right-2 size-4 bg-white sm:top-2 sm:right-2.5 sm:size-5"
                    style={{
                      clipPath: 'polygon(100% 0, 0 45%, 100% 90%)',
                    }}
                  />
                </div>
              </div>

              {/* Eye 2 (Right) */}
              <div className="relative flex h-24 w-20 items-center justify-center rounded-full bg-white shadow-md sm:h-28 sm:w-24">
                {/* Pupil with Interactive Eye Tracking */}
                <div
                  className="relative flex h-16 w-14 items-center justify-center rounded-full bg-[#0A1A4A] transition-transform duration-100 ease-out sm:h-20 sm:w-16"
                  style={{
                    transform: `translate(${eyeOffset.x}px, ${eyeOffset.y}px)`,
                  }}
                >
                  {/* Triangular Cutout Light Reflection Notch (Upper Right 1 o'clock) */}
                  <div
                    className="absolute top-1.5 right-2 size-4 bg-white sm:top-2 sm:right-2.5 sm:size-5"
                    style={{
                      clipPath: 'polygon(100% 0, 0 45%, 100% 90%)',
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
