'use client';

import * as React from 'react';
import {
  Check,
  Copy,
  ChevronDown,
  ChevronRight,
  Sliders,
  ShieldKey,
  Layers,
} from '@/components/icons';
import { cn } from '@/lib/utils';

// ---------------------------------------------------------------------------
// M3 Dynamic Color Schemes & Role Specifications
// ---------------------------------------------------------------------------
const M3_DYNAMIC_SCHEMES = {
  brand: {
    id: 'brand',
    name: 'Primary Brand (Fallback)',
    seed: '#0056FF',
    description:
      'Calibrated institutional standard; fallback when device dynamic color is disabled.',
    primary: { fill: '#0056FF', on: '#FFFFFF', container: '#EFF5FF', onContainer: '#0038B3' },
    secondary: { fill: '#2277FF', on: '#FFFFFF', container: '#E0F2FE', onContainer: '#0369A1' },
    tertiary: { fill: '#D97706', on: '#FFFFFF', container: '#FEF3C7', onContainer: '#78350F' },
    neutral: {
      surface: '#FFFFFF',
      onSurface: '#0A1A4A',
      background: '#F8FAFC',
      onBackground: '#0A1A4A',
    },
    neutralVariant: {
      surfaceVariant: '#EFF5FF',
      onSurfaceVariant: '#475569',
      outline: '#CAD3F5',
      outlineVariant: '#E2E8F0',
    },
  },
  teal: {
    id: 'teal',
    name: 'Botanical Teal (Wallpaper Seed)',
    seed: '#00875A',
    description:
      'Organic vegetation extraction; soothing green tone with calibrated WCAG AAA contrast.',
    primary: { fill: '#00875A', on: '#FFFFFF', container: '#E6F9F0', onContainer: '#004B32' },
    secondary: { fill: '#0E7490', on: '#FFFFFF', container: '#E0F2FE', onContainer: '#155E75' },
    tertiary: { fill: '#B45309', on: '#FFFFFF', container: '#FEF3C7', onContainer: '#78350F' },
    neutral: {
      surface: '#FDFEFE',
      onSurface: '#0F172A',
      background: '#F0FDF4',
      onBackground: '#0F172A',
    },
    neutralVariant: {
      surfaceVariant: '#E2E8F0',
      onSurfaceVariant: '#475569',
      outline: '#CBD5E1',
      outlineVariant: '#E2E8F0',
    },
  },
  amber: {
    id: 'amber',
    name: 'Warm Sunset (Wallpaper Seed)',
    seed: '#D97706',
    description:
      'High-warmth earth palette; vibrant contrast across daylight and ambient light conditions.',
    primary: { fill: '#D97706', on: '#FFFFFF', container: '#FFFBEB', onContainer: '#78350F' },
    secondary: { fill: '#B45309', on: '#FFFFFF', container: '#FEF3C7', onContainer: '#78350F' },
    tertiary: { fill: '#0056FF', on: '#FFFFFF', container: '#EFF5FF', onContainer: '#0038B3' },
    neutral: {
      surface: '#FFFDF9',
      onSurface: '#1E1B18',
      background: '#FFFBEB',
      onBackground: '#1E1B18',
    },
    neutralVariant: {
      surfaceVariant: '#F5EBE1',
      onSurfaceVariant: '#574D43',
      outline: '#D6C8B8',
      outlineVariant: '#EBE2D7',
    },
  },
  indigo: {
    id: 'indigo',
    name: 'Deep Obsidian (Wallpaper Seed)',
    seed: '#4338CA',
    description: 'Nocturnal deep indigo extraction; low glare with sharp semantic readability.',
    primary: { fill: '#4338CA', on: '#FFFFFF', container: '#EEF2FF', onContainer: '#312E81' },
    secondary: { fill: '#4F46E5', on: '#FFFFFF', container: '#E0E7FF', onContainer: '#3730A3' },
    tertiary: { fill: '#D97706', on: '#FFFFFF', container: '#FEF3C7', onContainer: '#78350F' },
    neutral: {
      surface: '#FFFFFF',
      onSurface: '#0F172A',
      background: '#F8FAFC',
      onBackground: '#0F172A',
    },
    neutralVariant: {
      surfaceVariant: '#E2E8F0',
      onSurfaceVariant: '#475569',
      outline: '#CAD3F5',
      outlineVariant: '#E2E8F0',
    },
  },
} as const;

// ---------------------------------------------------------------------------
// 1. Color Ramp Definitions (11 calibrated steps: 50 -> 950)
// ---------------------------------------------------------------------------
export interface ColorRampStep {
  step: string;
  hex: string;
  isBase?: boolean;
  contrastWhite: string;
  contrastBlack: string;
}

export interface ColorRampGroup {
  id: string;
  label: string;
  category: 'brand' | 'accents' | 'neutral' | 'status';
  steps: ColorRampStep[];
}

export const COLOR_RAMPS: ColorRampGroup[] = [
  // BRAND
  {
    id: 'primary',
    label: 'primary',
    category: 'brand',
    steps: [
      { step: '50', hex: '#EFF5FF', contrastWhite: '1.1:1', contrastBlack: '19.2:1' },
      { step: '100', hex: '#DBEAFE', contrastWhite: '1.3:1', contrastBlack: '16.5:1' },
      { step: '200', hex: '#BFDBFE', contrastWhite: '1.7:1', contrastBlack: '12.8:1' },
      { step: '300', hex: '#93C5FD', contrastWhite: '2.4:1', contrastBlack: '9.1:1' },
      { step: '400', hex: '#60A5FA', contrastWhite: '3.3:1', contrastBlack: '6.4:1' },
      { step: '500', hex: '#0056FF', isBase: true, contrastWhite: '4.7:1', contrastBlack: '4.5:1' },
      { step: '600', hex: '#0048D9', contrastWhite: '5.6:1', contrastBlack: '3.7:1' },
      { step: '700', hex: '#0038B3', contrastWhite: '7.4:1', contrastBlack: '2.8:1' },
      { step: '800', hex: '#002A8C', contrastWhite: '9.8:1', contrastBlack: '2.1:1' },
      { step: '900', hex: '#0A1A4A', contrastWhite: '16.5:1', contrastBlack: '1.3:1' },
      { step: '950', hex: '#050E28', contrastWhite: '18.9:1', contrastBlack: '1.1:1' },
    ],
  },
  // ACCENTS
  {
    id: 'accent',
    label: 'accent',
    category: 'accents',
    steps: [
      { step: '50', hex: '#FFFBEB', contrastWhite: '1.1:1', contrastBlack: '19.8:1' },
      { step: '100', hex: '#FEF3C7', contrastWhite: '1.2:1', contrastBlack: '17.4:1' },
      { step: '200', hex: '#FDE68A', contrastWhite: '1.4:1', contrastBlack: '14.9:1' },
      { step: '300', hex: '#FCD34D', contrastWhite: '1.8:1', contrastBlack: '11.8:1' },
      { step: '400', hex: '#FBBF24', contrastWhite: '2.2:1', contrastBlack: '9.5:1' },
      { step: '500', hex: '#D97706', isBase: true, contrastWhite: '3.6:1', contrastBlack: '5.8:1' },
      { step: '600', hex: '#B45309', contrastWhite: '5.1:1', contrastBlack: '4.1:1' },
      { step: '700', hex: '#92400E', contrastWhite: '7.2:1', contrastBlack: '2.9:1' },
      { step: '800', hex: '#78350F', contrastWhite: '9.4:1', contrastBlack: '2.2:1' },
      { step: '900', hex: '#451A03', contrastWhite: '14.8:1', contrastBlack: '1.4:1' },
      { step: '950', hex: '#280E02', contrastWhite: '18.2:1', contrastBlack: '1.1:1' },
    ],
  },
  {
    id: 'accent-2',
    label: 'accent-2',
    category: 'accents',
    steps: [
      { step: '50', hex: '#F0F9FF', contrastWhite: '1.1:1', contrastBlack: '19.5:1' },
      { step: '100', hex: '#E0F2FE', contrastWhite: '1.3:1', contrastBlack: '16.8:1' },
      { step: '200', hex: '#BAE6FD', contrastWhite: '1.6:1', contrastBlack: '13.2:1' },
      { step: '300', hex: '#7DD3FC', contrastWhite: '2.1:1', contrastBlack: '9.8:1' },
      { step: '400', hex: '#38BDF8', contrastWhite: '2.8:1', contrastBlack: '7.5:1' },
      { step: '500', hex: '#2277FF', isBase: true, contrastWhite: '3.2:1', contrastBlack: '6.5:1' },
      { step: '600', hex: '#0284C7', contrastWhite: '4.8:1', contrastBlack: '4.3:1' },
      { step: '700', hex: '#0369A1', contrastWhite: '6.5:1', contrastBlack: '3.2:1' },
      { step: '800', hex: '#075985', contrastWhite: '8.8:1', contrastBlack: '2.4:1' },
      { step: '900', hex: '#0C4A6E', contrastWhite: '12.4:1', contrastBlack: '1.7:1' },
      { step: '950', hex: '#082F49', contrastWhite: '16.1:1', contrastBlack: '1.3:1' },
    ],
  },
  // NEUTRAL
  {
    id: 'neutral',
    label: 'neutral',
    category: 'neutral',
    steps: [
      { step: '50', hex: '#F8FAFC', contrastWhite: '1.1:1', contrastBlack: '19.4:1' },
      { step: '100', hex: '#F1F5F9', contrastWhite: '1.2:1', contrastBlack: '17.8:1' },
      { step: '200', hex: '#E2E8F0', contrastWhite: '1.4:1', contrastBlack: '15.1:1' },
      { step: '300', hex: '#CBD5E1', contrastWhite: '1.9:1', contrastBlack: '11.2:1' },
      { step: '400', hex: '#94A3B8', contrastWhite: '3.1:1', contrastBlack: '6.8:1' },
      { step: '500', hex: '#64748B', isBase: true, contrastWhite: '4.6:1', contrastBlack: '4.5:1' },
      { step: '600', hex: '#475569', contrastWhite: '7.1:1', contrastBlack: '2.9:1' },
      { step: '700', hex: '#334155', contrastWhite: '10.2:1', contrastBlack: '2.1:1' },
      { step: '800', hex: '#1E293B', contrastWhite: '14.5:1', contrastBlack: '1.4:1' },
      { step: '900', hex: '#0F172A', contrastWhite: '17.8:1', contrastBlack: '1.2:1' },
      { step: '950', hex: '#0A1A4A', contrastWhite: '16.5:1', contrastBlack: '1.3:1' },
    ],
  },
  // STATUS
  {
    id: 'success',
    label: 'success',
    category: 'status',
    steps: [
      { step: '50', hex: '#ECFDF5', contrastWhite: '1.1:1', contrastBlack: '19.5:1' },
      { step: '100', hex: '#D1FAE5', contrastWhite: '1.3:1', contrastBlack: '16.9:1' },
      { step: '200', hex: '#A7F3D0', contrastWhite: '1.6:1', contrastBlack: '13.5:1' },
      { step: '300', hex: '#6EE7B7', contrastWhite: '2.2:1', contrastBlack: '9.6:1' },
      { step: '400', hex: '#34D399', contrastWhite: '2.9:1', contrastBlack: '7.2:1' },
      { step: '500', hex: '#10B981', isBase: true, contrastWhite: '4.8:1', contrastBlack: '4.4:1' },
      { step: '600', hex: '#059669', contrastWhite: '6.2:1', contrastBlack: '3.4:1' },
      { step: '700', hex: '#047857', contrastWhite: '8.3:1', contrastBlack: '2.5:1' },
      { step: '800', hex: '#065F46', contrastWhite: '11.1:1', contrastBlack: '1.9:1' },
      { step: '900', hex: '#064E3B', contrastWhite: '13.9:1', contrastBlack: '1.5:1' },
      { step: '950', hex: '#022C22', contrastWhite: '18.4:1', contrastBlack: '1.1:1' },
    ],
  },
  {
    id: 'warning',
    label: 'warning',
    category: 'status',
    steps: [
      { step: '50', hex: '#FFFBEB', contrastWhite: '1.1:1', contrastBlack: '19.8:1' },
      { step: '100', hex: '#FEF3C7', contrastWhite: '1.2:1', contrastBlack: '17.4:1' },
      { step: '200', hex: '#FDE68A', contrastWhite: '1.4:1', contrastBlack: '14.9:1' },
      { step: '300', hex: '#FCD34D', contrastWhite: '1.8:1', contrastBlack: '11.8:1' },
      { step: '400', hex: '#FBBF24', contrastWhite: '2.2:1', contrastBlack: '9.5:1' },
      { step: '500', hex: '#F59E0B', isBase: true, contrastWhite: '3.5:1', contrastBlack: '6.0:1' },
      { step: '600', hex: '#D97706', contrastWhite: '4.9:1', contrastBlack: '4.3:1' },
      { step: '700', hex: '#B45309', contrastWhite: '6.8:1', contrastBlack: '3.1:1' },
      { step: '800', hex: '#92400E', contrastWhite: '9.2:1', contrastBlack: '2.3:1' },
      { step: '900', hex: '#78350F', contrastWhite: '12.1:1', contrastBlack: '1.7:1' },
      { step: '950', hex: '#451A03', contrastWhite: '16.8:1', contrastBlack: '1.2:1' },
    ],
  },
  {
    id: 'error',
    label: 'error',
    category: 'status',
    steps: [
      { step: '50', hex: '#FEF2F2', contrastWhite: '1.1:1', contrastBlack: '19.6:1' },
      { step: '100', hex: '#FEE2E2', contrastWhite: '1.3:1', contrastBlack: '16.7:1' },
      { step: '200', hex: '#FECACA', contrastWhite: '1.6:1', contrastBlack: '13.3:1' },
      { step: '300', hex: '#FCA5A5', contrastWhite: '2.3:1', contrastBlack: '9.2:1' },
      { step: '400', hex: '#F87171', contrastWhite: '3.2:1', contrastBlack: '6.6:1' },
      { step: '500', hex: '#EF4444', isBase: true, contrastWhite: '4.6:1', contrastBlack: '4.6:1' },
      { step: '600', hex: '#DC2626', contrastWhite: '5.9:1', contrastBlack: '3.5:1' },
      { step: '700', hex: '#B91C1C', contrastWhite: '8.1:1', contrastBlack: '2.6:1' },
      { step: '800', hex: '#991B1B', contrastWhite: '10.8:1', contrastBlack: '1.9:1' },
      { step: '900', hex: '#7F1D1D', contrastWhite: '13.5:1', contrastBlack: '1.5:1' },
      { step: '950', hex: '#450A0A', contrastWhite: '18.1:1', contrastBlack: '1.1:1' },
    ],
  },
  {
    id: 'info',
    label: 'info',
    category: 'status',
    steps: [
      { step: '50', hex: '#F0F9FF', contrastWhite: '1.1:1', contrastBlack: '19.5:1' },
      { step: '100', hex: '#E0F2FE', contrastWhite: '1.3:1', contrastBlack: '16.8:1' },
      { step: '200', hex: '#BAE6FD', contrastWhite: '1.6:1', contrastBlack: '13.2:1' },
      { step: '300', hex: '#7DD3FC', contrastWhite: '2.1:1', contrastBlack: '9.8:1' },
      { step: '400', hex: '#38BDF8', contrastWhite: '2.8:1', contrastBlack: '7.5:1' },
      { step: '500', hex: '#0284C7', isBase: true, contrastWhite: '4.5:1', contrastBlack: '4.7:1' },
      { step: '600', hex: '#0369A1', contrastWhite: '6.1:1', contrastBlack: '3.4:1' },
      { step: '700', hex: '#075985', contrastWhite: '8.4:1', contrastBlack: '2.5:1' },
      { step: '800', hex: '#0C4A6E', contrastWhite: '11.8:1', contrastBlack: '1.8:1' },
      { step: '900', hex: '#082F49', contrastWhite: '15.4:1', contrastBlack: '1.4:1' },
      { step: '950', hex: '#041C2D', contrastWhite: '18.7:1', contrastBlack: '1.1:1' },
    ],
  },
];

// ---------------------------------------------------------------------------
// 2. Semantic Tokens Table Data with Ramp Step Aliases
// ---------------------------------------------------------------------------
export interface SemanticTokenRow {
  token: string;
  exampleType: 'surface' | 'button' | 'text' | 'border' | 'badge';
  lightHex: string;
  darkHex: string;
  lightRamp: string;
  darkRamp: string;
  contrastRatio: string;
  contrastGrade: 'AAA' | 'AA' | 'UI';
  appliedTo: string;
}

export const SEMANTIC_TOKENS: SemanticTokenRow[] = [
  {
    token: 'bg-canvas',
    exampleType: 'surface',
    lightHex: '#FFFFFF',
    darkHex: '#0A1A4A',
    lightRamp: 'neutral-50',
    darkRamp: 'primary-900',
    contrastRatio: '16.5:1',
    contrastGrade: 'AAA',
    appliedTo: 'Document Root',
  },
  {
    token: 'bg-subsurface',
    exampleType: 'surface',
    lightHex: '#EFF5FF',
    darkHex: '#0F225A',
    lightRamp: 'primary-50',
    darkRamp: 'primary-950',
    contrastRatio: '15.2:1',
    contrastGrade: 'AAA',
    appliedTo: 'Card Containers',
  },
  {
    token: 'bg-elevated',
    exampleType: 'surface',
    lightHex: '#E3E7FC',
    darkHex: '#1A2F6E',
    lightRamp: 'primary-100',
    darkRamp: 'primary-800',
    contrastRatio: '12.8:1',
    contrastGrade: 'AAA',
    appliedTo: 'Pills & Badges',
  },
  {
    token: 'color-primary',
    exampleType: 'button',
    lightHex: '#0056FF',
    darkHex: '#2277FF',
    lightRamp: 'primary-500',
    darkRamp: 'accent-2-500',
    contrastRatio: '4.7:1',
    contrastGrade: 'AA',
    appliedTo: 'Core Actions',
  },
  {
    token: 'color-hover',
    exampleType: 'button',
    lightHex: '#2277FF',
    darkHex: '#4D94FF',
    lightRamp: 'accent-2-500',
    darkRamp: 'primary-400',
    contrastRatio: '3.2:1',
    contrastGrade: 'UI',
    appliedTo: 'Hover States',
  },
  {
    token: 'text-primary',
    exampleType: 'text',
    lightHex: '#0A1A4A',
    darkHex: '#FFFFFF',
    lightRamp: 'primary-900',
    darkRamp: 'neutral-50',
    contrastRatio: '16.5:1',
    contrastGrade: 'AAA',
    appliedTo: 'Headings & Body',
  },
  {
    token: 'text-secondary',
    exampleType: 'text',
    lightHex: '#475569',
    darkHex: '#94A3B8',
    lightRamp: 'neutral-600',
    darkRamp: 'neutral-400',
    contrastRatio: '7.2:1',
    contrastGrade: 'AAA',
    appliedTo: 'Subtitles & Labels',
  },
  {
    token: 'border-subtle',
    exampleType: 'border',
    lightHex: '#CAD3F5',
    darkHex: '#2A3F7E',
    lightRamp: 'primary-200',
    darkRamp: 'primary-800',
    contrastRatio: '3.1:1',
    contrastGrade: 'UI',
    appliedTo: 'Card Dividers',
  },
  {
    token: 'status-success',
    exampleType: 'badge',
    lightHex: '#10B981',
    darkHex: '#34D399',
    lightRamp: 'success-500',
    darkRamp: 'success-400',
    contrastRatio: '4.8:1',
    contrastGrade: 'AA',
    appliedTo: 'Passing Checks',
  },
  {
    token: 'status-error',
    exampleType: 'badge',
    lightHex: '#EF4444',
    darkHex: '#F87171',
    lightRamp: 'error-500',
    darkRamp: 'error-400',
    contrastRatio: '4.6:1',
    contrastGrade: 'AA',
    appliedTo: 'Failed Validations',
  },
  {
    token: 'status-warning',
    exampleType: 'badge',
    lightHex: '#F59E0B',
    darkHex: '#FBBF24',
    lightRamp: 'warning-500',
    darkRamp: 'warning-400',
    contrastRatio: '3.5:1',
    contrastGrade: 'UI',
    appliedTo: 'Attention Triggers',
  },
];

export function ColorRampsTokens() {
  const [copiedHex, setCopiedHex] = React.useState<string | null>(null);

  // Default interactive states matching user specifications:
  // [ HEX | CSS ]: HEX active
  const [formatMode, setFormatMode] = React.useState<'HEX' | 'CSS'>('HEX');
  // [ CONTRAST | AA | AAA ]: AAA active by default
  const [contrastMode, setContrastMode] = React.useState<'CONTRAST' | 'AA' | 'AAA'>('AAA');
  // [ RAM | RAMP ]: RAMP active by default
  const [tokenViewMode, setTokenViewMode] = React.useState<'RAM' | 'RAMP'>('RAMP');

  // Filter States
  const [activeCategory, setActiveCategory] = React.useState<string>('all');
  const [agentDrawerOpen, setAgentDrawerOpen] = React.useState<boolean>(false);
  const [copiedPalette, setCopiedPalette] = React.useState<boolean>(false);

  // Dynamic Color & M3 Customization States
  const [selectedSeed, setSelectedSeed] = React.useState<'brand' | 'teal' | 'amber' | 'indigo'>(
    'brand',
  );
  const [dynamicScopeMode, setDynamicScopeMode] = React.useState<'selective' | 'fallback'>(
    'selective',
  );
  const [contrastLevel, setContrastLevel] = React.useState<'standard' | 'medium' | 'high'>(
    'standard',
  );
  const [colorSystemTab, setColorSystemTab] = React.useState<
    'roles' | 'surfaces' | 'components' | 'fixed'
  >('roles');
  const [themePreview, setThemePreview] = React.useState<'light' | 'dark'>('light');

  const handleCopy = async (text: string, label: string) => {
    if (typeof window === 'undefined') return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setCopiedHex(label);
        setTimeout(() => setCopiedHex(null), 1800);
      }
    } catch {
      // Fallback
    }
  };

  const handleCopyPaletteJson = async () => {
    if (typeof window === 'undefined') return;
    const agentPalette = {
      system: 'SNPI-SMS Color Ramps & Semantic Tokens',
      specVersion: '2.0',
      derivation: '50-950 Tailwind Standard',
      activeFormat: formatMode,
      activeContrastStandard: contrastMode,
      activeTokenMapping: tokenViewMode,
      ramps: COLOR_RAMPS.reduce<Record<string, Record<string, string>>>((acc, ramp) => {
        acc[ramp.id] = ramp.steps.reduce<Record<string, string>>((sAcc, s) => {
          sAcc[s.step] = s.hex;
          return sAcc;
        }, {});
        return acc;
      }, {}),
      semantic: SEMANTIC_TOKENS.reduce<
        Record<
          string,
          { light: string; dark: string; lightRamp: string; darkRamp: string; contrast: string }
        >
      >((acc, token) => {
        acc[token.token] = {
          light: token.lightHex,
          dark: token.darkHex,
          lightRamp: token.lightRamp,
          darkRamp: token.darkRamp,
          contrast: token.contrastRatio,
        };
        return acc;
      }, {}),
    };

    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(JSON.stringify(agentPalette, null, 2));
        setCopiedPalette(true);
        setTimeout(() => setCopiedPalette(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  const filteredRamps = React.useMemo(() => {
    if (activeCategory === 'all') return COLOR_RAMPS;
    return COLOR_RAMPS.filter((ramp) => ramp.category === activeCategory);
  }, [activeCategory]);

  // Helper renderer for a single ramp row
  const renderRampRow = (ramp: ColorRampGroup) => (
    <div key={ramp.id} className="space-y-1.5">
      <div className="flex items-center gap-1.5 font-mono text-xs text-slate-700">
        <span className="font-bold">{ramp.label}</span>
        <Check className="size-3.5 text-[#0056FF]" />
      </div>
      <div className="grid grid-cols-11 gap-1">
        {ramp.steps.map((step) => {
          const isDark = parseInt(step.step, 10) >= 500;
          const copyValue = formatMode === 'CSS' ? `var(--${ramp.id}-${step.step})` : step.hex;

          const numContrast = parseFloat(step.contrastWhite);
          const isPassing =
            contrastMode === 'AA'
              ? numContrast >= 4.5
              : contrastMode === 'AAA'
                ? numContrast >= 7.0
                : true;

          const badgeText =
            contrastMode === 'CONTRAST'
              ? step.contrastWhite
              : contrastMode === 'AA'
                ? numContrast >= 4.5
                  ? 'AA'
                  : step.contrastWhite
                : numContrast >= 7.0
                  ? 'AAA'
                  : step.contrastWhite;

          return (
            <button
              key={step.step}
              type="button"
              onClick={() => handleCopy(copyValue, `${ramp.id}-${step.step}`)}
              style={{ backgroundColor: step.hex }}
              title={`Click to copy: ${copyValue} (Step ${step.step})`}
              className={cn(
                'group relative flex h-14 flex-col justify-between rounded-md p-1.5 text-left transition-transform active:scale-95',
                isDark ? 'text-white' : 'text-slate-900',
                step.step === '50' && 'border border-[#CAD3F5]',
              )}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] font-bold">{step.step}</span>
                {step.isBase && (
                  <span className="py-0.2 rounded-[3px] border border-white/60 bg-white/20 px-1 font-mono text-[8px] font-black tracking-wider uppercase">
                    BASE
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span
                  className={cn(
                    'font-mono text-[8px] font-bold',
                    isPassing ? 'opacity-90' : 'opacity-40',
                  )}
                >
                  {badgeText}
                </span>
                <span className="truncate font-mono text-[8px] opacity-0 transition-opacity group-hover:opacity-100">
                  {copiedHex === `${ramp.id}-${step.step}`
                    ? 'Copied'
                    : formatMode === 'CSS'
                      ? 'CSS'
                      : step.hex}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* ------------------------------------------------------------- */}
      {/* TOOLBAR CONTROLS: CATEGORIES & BUTTONS                        */}
      {/* ------------------------------------------------------------- */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#CAD3F5] bg-[#F8FAFC] p-3 text-xs">
        {/* Category Filters */}
        <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#CAD3F5] bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveCategory('all')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-sans text-xs font-bold transition-all',
              activeCategory === 'all'
                ? 'bg-[#0056FF] text-white shadow-none'
                : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
            )}
          >
            ALL
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('brand')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-sans text-xs font-bold transition-all',
              activeCategory === 'brand'
                ? 'bg-[#0056FF] text-white shadow-none'
                : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
            )}
          >
            BRAND
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('accents')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-sans text-xs font-bold transition-all',
              activeCategory === 'accents'
                ? 'bg-[#0056FF] text-white shadow-none'
                : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
            )}
          >
            ACCENT
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('neutral')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-sans text-xs font-bold transition-all',
              activeCategory === 'neutral'
                ? 'bg-[#0056FF] text-white shadow-none'
                : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
            )}
          >
            NEUTRAL
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('status')}
            className={cn(
              'rounded-lg px-3 py-1.5 font-sans text-xs font-bold transition-all',
              activeCategory === 'status'
                ? 'bg-[#0056FF] text-white shadow-none'
                : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
            )}
          >
            STATUS
          </button>
        </div>

        {/* Technical Controls: [ HEX | CSS ] and [ CONTRAST | AA | AAA ] */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Format Selector: [ HEX | CSS ] */}
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#CAD3F5] bg-white p-1">
            <button
              type="button"
              onClick={() => setFormatMode('HEX')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                formatMode === 'HEX'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              HEX
            </button>
            <button
              type="button"
              onClick={() => setFormatMode('CSS')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                formatMode === 'CSS'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              CSS
            </button>
          </div>

          {/* Contrast Mode Selector: [ CONTRAST | AA | AAA ] */}
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#CAD3F5] bg-white p-1">
            <button
              type="button"
              onClick={() => setContrastMode('CONTRAST')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                contrastMode === 'CONTRAST'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              CONTRAST
            </button>
            <button
              type="button"
              onClick={() => setContrastMode('AA')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                contrastMode === 'AA'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              AA
            </button>
            <button
              type="button"
              onClick={() => setContrastMode('AAA')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                contrastMode === 'AAA'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              AAA
            </button>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* COLOR RAMPS GROUPS (BRAND, ACCENTS, NEUTRAL, STATUS)          */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-7">
        {/* Brand Group */}
        {(activeCategory === 'all' || activeCategory === 'brand') && (
          <div className="space-y-3">
            <h3 className="font-sans text-base font-bold text-slate-950">Brand</h3>
            {filteredRamps.filter((r) => r.category === 'brand').map((ramp) => renderRampRow(ramp))}
          </div>
        )}

        {/* Accents Group */}
        {(activeCategory === 'all' || activeCategory === 'accents') && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans text-base font-bold text-slate-950">Accents</h3>
              <Check className="size-3.5 text-[#0056FF]" />
            </div>
            {filteredRamps
              .filter((r) => r.category === 'accents')
              .map((ramp) => renderRampRow(ramp))}
          </div>
        )}

        {/* Neutral Group */}
        {(activeCategory === 'all' || activeCategory === 'neutral') && (
          <div className="space-y-3">
            <h3 className="font-sans text-base font-bold text-slate-950">Neutral</h3>
            {filteredRamps
              .filter((r) => r.category === 'neutral')
              .map((ramp) => renderRampRow(ramp))}
          </div>
        )}

        {/* Status Group */}
        {(activeCategory === 'all' || activeCategory === 'status') && (
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              <h3 className="font-sans text-base font-bold text-slate-950">Status</h3>
              <Check className="size-3.5 text-[#0056FF]" />
            </div>
            {filteredRamps
              .filter((r) => r.category === 'status')
              .map((ramp) => renderRampRow(ramp))}
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SEMANTIC TOKENS TABLE                                         */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="font-sans text-xl font-black text-[#0A1A4A]">Semantic tokens</h3>

          {/* [ RAM | RAMP ] Button Group */}
          <div className="inline-flex items-center gap-1 rounded-xl border border-[#CAD3F5] bg-white p-1">
            <button
              type="button"
              onClick={() => setTokenViewMode('RAM')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                tokenViewMode === 'RAM'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              RAM
            </button>
            <button
              type="button"
              onClick={() => setTokenViewMode('RAMP')}
              className={cn(
                'rounded-lg px-3.5 py-1.5 font-sans text-xs font-bold transition-all',
                tokenViewMode === 'RAMP'
                  ? 'bg-[#0056FF] text-white shadow-none'
                  : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
              )}
            >
              RAMP
            </button>
          </div>
        </div>

        {/* Semantic Tokens Specification Table */}
        <div className="overflow-x-auto rounded-xl border border-[#CAD3F5] bg-white">
          <table className="w-full text-left font-mono text-xs">
            <thead>
              <tr className="border-b border-[#CAD3F5] bg-[#F8FAFC] text-[10px] font-bold text-slate-500 uppercase">
                <th className="px-4 py-2.5">TOKEN</th>
                <th className="px-4 py-2.5">EXAMPLE</th>
                <th className="px-4 py-2.5">LIGHT</th>
                <th className="px-4 py-2.5">DARK</th>
                <th className="px-4 py-2.5">
                  {contrastMode === 'CONTRAST' ? 'CONTRAST' : contrastMode === 'AA' ? 'AA' : 'AAA'}
                </th>
                <th className="px-4 py-2.5 text-right">EXPORT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {SEMANTIC_TOKENS.map((token) => {
                const lightVal =
                  tokenViewMode === 'RAMP'
                    ? token.lightRamp
                    : formatMode === 'CSS'
                      ? `var(--${token.token})`
                      : token.lightHex;

                const darkVal =
                  tokenViewMode === 'RAMP'
                    ? token.darkRamp
                    : formatMode === 'CSS'
                      ? `var(--${token.token}-dark)`
                      : token.darkHex;

                const exportPayload =
                  tokenViewMode === 'RAMP'
                    ? `--${token.token}: var(--${token.lightRamp});`
                    : `--${token.token}: ${token.lightHex};`;

                return (
                  <tr key={token.token} className="transition-colors hover:bg-[#EFF5FF]/40">
                    {/* TOKEN */}
                    <td className="px-4 py-3 font-mono font-bold text-[#0056FF]">{token.token}</td>

                    {/* EXAMPLE */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span
                          className="size-4 shrink-0 rounded-[3px] border border-[#CAD3F5]"
                          style={{ backgroundColor: token.lightHex }}
                        />
                        <span className="font-sans text-xs text-slate-700">{token.appliedTo}</span>
                      </div>
                    </td>

                    {/* LIGHT */}
                    <td className="px-4 py-3 font-mono text-xs font-bold text-slate-900">
                      {lightVal}
                    </td>

                    {/* DARK */}
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">{darkVal}</td>

                    {/* CONTRAST / AA / AAA */}
                    <td className="px-4 py-3 font-mono text-xs font-bold text-[#0A1A4A]">
                      <span
                        className={cn(
                          'rounded-[3px] px-1.5 py-0.5 text-[10px] font-bold',
                          token.contrastGrade === 'AAA'
                            ? 'border border-[#CAD3F5] bg-[#E3E7FC] text-[#0056FF]'
                            : 'border border-[#D0E1FD] bg-[#EFF5FF] text-blue-700',
                        )}
                      >
                        {contrastMode === 'CONTRAST'
                          ? token.contrastRatio
                          : `${token.contrastRatio} ${token.contrastGrade}`}
                      </span>
                    </td>

                    {/* EXPORT */}
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleCopy(exportPayload, token.token)}
                        title={`Copy ${exportPayload}`}
                        className="inline-flex size-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition-colors hover:border-[#0056FF] hover:bg-[#EFF5FF] hover:text-[#0056FF]"
                      >
                        {copiedHex === token.token ? (
                          <Check className="size-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MATERIAL 3 COLOR ROLES SYSTEM & 26 SEMANTIC ROLES ARCHITECTURE */}
      {/* ------------------------------------------------------------- */}
      <div className="space-y-5 rounded-2xl border border-[#CAD3F5] bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="space-y-0.5">
            <span className="font-sans text-xs font-bold tracking-wide text-[#0A1A4A] uppercase">
              Material 3 Color Roles System &middot; 26 Standard Roles &amp; Calibrations
            </span>
            <div className="font-mono text-[10px] text-slate-500">
              6 Role Groups &middot; 3 Contrast Levels &middot; Tone Surfaces (98 Light / 6 Dark)
              &middot; 14 Affected Components &middot; Fixed Accents
            </div>
          </div>

          {/* Seed Switcher */}
          <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-[#CAD3F5] bg-[#F8FAFC] p-1">
            {(
              [
                { id: 'brand', label: 'Brand Base', hex: '#0056FF' },
                { id: 'teal', label: 'Botanical Teal', hex: '#00875A' },
                { id: 'amber', label: 'Warm Sunset', hex: '#D97706' },
                { id: 'indigo', label: 'Deep Obsidian', hex: '#4338CA' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSelectedSeed(s.id)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-mono text-xs font-bold uppercase transition-all',
                  selectedSeed === s.id
                    ? 'bg-[#0056FF] text-white shadow-none'
                    : 'text-[#0A1A4A] hover:bg-[#EFF5FF] hover:text-[#0056FF]',
                )}
              >
                <span
                  className="size-2.5 shrink-0 rounded-full border border-white/50"
                  style={{ backgroundColor: s.hex }}
                />
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Global Controls: Contrast Levels, Theme Mode & Sub-views */}
        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#CAD3F5] bg-[#F8FAFC] p-3 text-xs md:grid-cols-3">
          {/* Contrast Levels Switcher */}
          <div className="space-y-1">
            <span className="font-sans font-bold text-[#0A1A4A]">3 Contrast Levels</span>
            <div className="grid grid-cols-3 gap-1">
              {(['standard', 'medium', 'high'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setContrastLevel(lvl)}
                  className={cn(
                    'rounded-lg border px-2 py-1 font-mono text-[10px] font-bold uppercase transition-all',
                    contrastLevel === lvl
                      ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                      : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                  )}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Theme Preview Switcher */}
          <div className="space-y-1">
            <span className="font-sans font-bold text-[#0A1A4A]">Theme &amp; Tone Calibration</span>
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setThemePreview('light')}
                className={cn(
                  'rounded-lg border px-2 py-1 text-center font-mono text-[10px] font-bold transition-all',
                  themePreview === 'light'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                    : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                )}
              >
                Light (Tone 98 / Chroma 6)
              </button>
              <button
                type="button"
                onClick={() => setThemePreview('dark')}
                className={cn(
                  'rounded-lg border px-2 py-1 text-center font-mono text-[10px] font-bold transition-all',
                  themePreview === 'dark'
                    ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                    : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                )}
              >
                Dark (Darkened Surfaces)
              </button>
            </div>
          </div>

          {/* Sub-view Switcher */}
          <div className="space-y-1">
            <span className="font-sans font-bold text-[#0A1A4A]">System Explorer</span>
            <div className="grid grid-cols-4 gap-1">
              {[
                { id: 'roles' as const, label: '26 Roles' },
                { id: 'surfaces' as const, label: 'Surfaces' },
                { id: 'components' as const, label: '14 Comps' },
                { id: 'fixed' as const, label: 'Fixed' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setColorSystemTab(tab.id)}
                  className={cn(
                    'rounded-lg border px-1 py-1 text-center font-mono text-[10px] font-bold transition-all',
                    colorSystemTab === tab.id
                      ? 'border-[#0056FF] bg-[#0056FF] text-white shadow-none'
                      : 'border-[#CAD3F5] bg-white text-[#0A1A4A] hover:bg-[#EFF5FF]',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* VIEW 1: THE 26 STANDARD COLOR ROLES IN 6 GROUPS */}
        {colorSystemTab === 'roles' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-sans text-xs font-bold text-[#0A1A4A] uppercase">
                The 26 Standard Color Roles in Six Groups ({selectedSeed.toUpperCase()} SCHEME)
              </span>
              <span className="font-mono text-[10px] text-[#0056FF]">
                Contrast Level: {contrastLevel.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {/* 1. PRIMARY GROUP */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-[#0056FF] uppercase">
                    1. Primary Group
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">Prominent Actions</span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div
                    className="rounded-lg p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].primary.fill,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].primary.on,
                    }}
                  >
                    <div>primary</div>
                    <div className="text-[9px] opacity-80">on-primary (&ge;4.5:1)</div>
                  </div>
                  <div
                    className="rounded-lg border border-slate-200 p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].primary.container,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].primary.onContainer,
                    }}
                  >
                    <div>primary-container</div>
                    <div className="text-[9px] opacity-80">
                      on-primary-container (colorful text/icons)
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. SECONDARY GROUP */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-[#2277FF] uppercase">
                    2. Secondary Group
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">Tonal Balance</span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div
                    className="rounded-lg p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].secondary.fill,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].secondary.on,
                    }}
                  >
                    <div>secondary</div>
                    <div className="text-[9px] opacity-80">on-secondary (&ge;4.5:1)</div>
                  </div>
                  <div
                    className="rounded-lg border border-slate-200 p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].secondary.container,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].secondary.onContainer,
                    }}
                  >
                    <div>secondary-container</div>
                    <div className="text-[9px] opacity-80">
                      on-secondary-container (colorful text/icons)
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. TERTIARY GROUP */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-amber-600 uppercase">
                    3. Tertiary Group
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">Contrasting Accents</span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div
                    className="rounded-lg p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].tertiary.fill,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].tertiary.on,
                    }}
                  >
                    <div>tertiary</div>
                    <div className="text-[9px] opacity-80">on-tertiary (&ge;4.5:1)</div>
                  </div>
                  <div
                    className="rounded-lg border border-slate-200 p-2 font-bold"
                    style={{
                      backgroundColor: M3_DYNAMIC_SCHEMES[selectedSeed].tertiary.container,
                      color: M3_DYNAMIC_SCHEMES[selectedSeed].tertiary.onContainer,
                    }}
                  >
                    <div>tertiary-container</div>
                    <div className="text-[9px] opacity-80">
                      on-tertiary-container (colorful text/icons)
                    </div>
                  </div>
                </div>
              </div>

              {/* 4. ERROR GROUP */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-red-600 uppercase">
                    4. Error Group
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">
                    Static Critical Alerts
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="rounded-lg bg-[#DC2626] p-2 font-bold text-white">
                    <div>error</div>
                    <div className="text-[9px] opacity-80">on-error (&ge;4.5:1)</div>
                  </div>
                  <div className="rounded-lg border border-red-200 bg-[#FEE2E2] p-2 font-bold text-[#991B1B]">
                    <div>error-container</div>
                    <div className="text-[9px] opacity-80">
                      on-error-container (colorful text/icons)
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. SURFACE GROUP (11 ROLES) */}
              <div className="col-span-1 space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left md:col-span-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-[#0A1A4A] uppercase">
                    5. Surface Group (11 Roles)
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">Tone-Based Containers</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 font-mono text-[10px] sm:grid-cols-3">
                  <div className="rounded-lg border border-[#CAD3F5] bg-white p-2 text-[#0A1A4A]">
                    <div className="font-bold">surface</div>
                    <div className="text-[9px] text-slate-500">Tone 98 (Light) / 6 (Dark)</div>
                  </div>
                  <div className="rounded-lg border border-slate-200 bg-[#F8FAFC] p-2 text-[#0A1A4A]">
                    <div className="font-bold">surface-container-low</div>
                    <div className="text-[9px] text-slate-500">Card Base Foundation</div>
                  </div>
                  <div className="rounded-lg border border-[#CAD3F5] bg-[#EFF5FF] p-2 text-[#0056FF]">
                    <div className="font-bold">surface-container</div>
                    <div className="text-[9px] text-slate-500">Default Container</div>
                  </div>
                  <div className="rounded-lg bg-[#E2E8F0] p-2 text-slate-800">
                    <div className="font-bold">surface-container-high</div>
                    <div className="text-[9px] text-slate-500">Raised Popovers/Menus</div>
                  </div>
                  <div className="rounded-lg bg-[#CBD5E1] p-2 text-slate-900">
                    <div className="font-bold">surface-container-highest</div>
                    <div className="text-[9px] text-slate-600">Floating Dialogs/Toolbars</div>
                  </div>
                  <div className="rounded-lg bg-slate-900 p-2 text-white">
                    <div className="font-bold">inverse-surface</div>
                    <div className="text-[9px] text-slate-300">Inverse Snackbars</div>
                  </div>
                </div>
              </div>

              {/* 6. OUTLINE GROUP */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3 text-left">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-sans text-xs font-bold text-slate-700 uppercase">
                    6. Outline Group
                  </span>
                  <span className="font-mono text-[9px] text-slate-400">
                    Boundaries &amp; Dividers
                  </span>
                </div>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="rounded-lg border-2 border-slate-500 bg-white p-2 font-bold text-slate-800">
                    <div>outline</div>
                    <div className="text-[9px] text-slate-500">3.0:1 Boundary for text inputs</div>
                  </div>
                  <div className="rounded-lg border border-dashed border-[#CAD3F5] bg-white p-2 font-bold text-slate-600">
                    <div>outline-variant</div>
                    <div className="text-[9px] text-slate-500">
                      Decorative dividers &amp; card edges
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TONE SURFACES VS ELEVATION HIERARCHY */}
        {colorSystemTab === 'surfaces' && (
          <div className="space-y-3 text-left">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <span className="font-sans text-xs font-bold text-[#0A1A4A] uppercase">
                  Tone-Based Surface System (Replacing Legacy Elevation Overlays)
                </span>
                <p className="mt-0.5 font-sans text-xs text-slate-500">
                  Surfaces no longer use white semi-transparent elevation overlays; they are
                  distinct tone steps.
                </p>
              </div>
              <span className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold text-emerald-600">
                ACTIVE CALIBRATION: TONE 98 / CHROMA 6
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
              {[
                {
                  name: 'Lowest',
                  role: 'surface-container-lowest',
                  toneL: 'Tone 100',
                  toneD: 'Tone 4',
                  desc: 'Recessed into canvas',
                },
                {
                  name: 'Low',
                  role: 'surface-container-low',
                  toneL: 'Tone 96',
                  toneD: 'Tone 10',
                  desc: 'Card background',
                },
                {
                  name: 'Default',
                  role: 'surface-container',
                  toneL: 'Tone 94',
                  toneD: 'Tone 12',
                  desc: 'Navigation & sheet',
                },
                {
                  name: 'High',
                  role: 'surface-container-high',
                  toneL: 'Tone 92',
                  toneD: 'Tone 17',
                  desc: 'Raised menus',
                },
                {
                  name: 'Highest',
                  role: 'surface-container-highest',
                  toneL: 'Tone 90',
                  toneD: 'Tone 22',
                  desc: 'Floating toolbars',
                },
              ].map((s) => (
                <div
                  key={s.role}
                  className="space-y-1.5 rounded-xl border border-[#CAD3F5] bg-[#EFF5FF]/40 p-3"
                >
                  <div className="font-sans text-xs font-bold text-[#0056FF]">{s.name}</div>
                  <div className="font-mono text-[10px] font-bold text-[#0A1A4A]">{s.role}</div>
                  <div className="font-mono text-[9px] text-slate-500">
                    {s.toneL} / {s.toneD}
                  </div>
                  <div className="font-sans text-[10px] text-slate-600">{s.desc}</div>
                </div>
              ))}
            </div>

            {/* Surface Dim & Surface Bright Extenders */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-slate-100 p-3">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  surface-dim
                </span>
                <p className="text-xs text-slate-700">
                  Dimmest surface in both light and dark themes. Used for recessed peripheral
                  navigation rails.
                </p>
              </div>
              <div className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-3">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  surface-bright
                </span>
                <p className="text-xs text-slate-700">
                  Brightest surface in both light and dark themes. Used for active document canvas.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: 14 AFFECTED COMPONENTS */}
        {colorSystemTab === 'components' && (
          <div className="space-y-3 text-left">
            <div className="border-b border-slate-100 pb-2">
              <span className="font-sans text-xs font-bold text-[#0A1A4A] uppercase">
                The 14 Affected Components in Material 3 Color Roles System
              </span>
              <p className="mt-0.5 font-sans text-xs text-slate-500">
                Updated color roles applied to text, icons, and containers in Light Theme.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {[
                { name: 'Badges', role: 'error / tertiary', on: 'on-error' },
                { name: 'Buttons (Filled)', role: 'primary', on: 'on-primary' },
                {
                  name: 'Buttons (Tonal)',
                  role: 'secondary-container',
                  on: 'on-secondary-container',
                },
                { name: 'Extended FAB', role: 'primary-container', on: 'on-primary-container' },
                { name: 'FAB', role: 'primary-container', on: 'on-primary-container' },
                { name: 'Icon Buttons', role: 'surface-container-low', on: 'on-surface-variant' },
                {
                  name: 'Segmented Buttons',
                  role: 'surface-container',
                  on: 'on-secondary-container',
                },
                { name: 'Chips', role: 'surface-container-low', on: 'on-secondary-container' },
                { name: 'Lists', role: 'surface', on: 'on-surface / outline-variant' },
                { name: 'Menus', role: 'surface-container-high', on: 'on-surface' },
                { name: 'Navigation Bar', role: 'surface-container', on: 'on-secondary-container' },
                {
                  name: 'Navigation Drawer',
                  role: 'surface-container-low',
                  on: 'on-secondary-container',
                },
                { name: 'Navigation Rail', role: 'surface', on: 'on-secondary-container' },
                {
                  name: 'Switches & Toolbars',
                  role: 'surface-container-highest',
                  on: 'primary / on-primary',
                },
              ].map((c) => (
                <div
                  key={c.name}
                  className="space-y-1 rounded-xl border border-[#CAD3F5] bg-white p-2.5"
                >
                  <div className="font-sans text-xs font-bold text-[#0A1A4A]">{c.name}</div>
                  <div className="font-mono text-[10px] text-[#0056FF]">{c.role}</div>
                  <div className="font-mono text-[9px] text-slate-500">Text/Icon: {c.on}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW 4: FIXED ACCENT SUITE */}
        {colorSystemTab === 'fixed' && (
          <div className="space-y-3 text-left">
            <div className="border-b border-slate-100 pb-2">
              <span className="font-sans text-xs font-bold text-[#0A1A4A] uppercase">
                Fixed Accent Color Roles (Theme-Independent Constants)
              </span>
              <p className="mt-0.5 font-sans text-xs text-slate-500">
                Fixed colors maintain the same tone in both light and dark themes (unlike regular
                container colors).
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* PRIMARY FIXED */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3">
                <span className="font-sans text-xs font-bold text-[#0056FF] uppercase">
                  Primary Fixed Suite
                </span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="rounded-lg bg-[#DBEAFE] p-2 font-bold text-[#1E3A8A]">
                    primary-fixed
                  </div>
                  <div className="rounded-lg bg-[#BFDBFE] p-2 font-bold text-[#1E3A8A]">
                    primary-fixed-dim
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-[#1E3A8A]">
                    on-primary-fixed
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-slate-600">
                    on-primary-fixed-variant
                  </div>
                </div>
              </div>

              {/* SECONDARY FIXED */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3">
                <span className="font-sans text-xs font-bold text-[#2277FF] uppercase">
                  Secondary Fixed Suite
                </span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="rounded-lg bg-[#E0E7FF] p-2 font-bold text-[#312E81]">
                    secondary-fixed
                  </div>
                  <div className="rounded-lg bg-[#C7D2FE] p-2 font-bold text-[#312E81]">
                    secondary-fixed-dim
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-[#312E81]">
                    on-secondary-fixed
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-slate-600">
                    on-secondary-fixed-variant
                  </div>
                </div>
              </div>

              {/* TERTIARY FIXED */}
              <div className="space-y-2 rounded-xl border border-[#CAD3F5] bg-white p-3">
                <span className="font-sans text-xs font-bold text-amber-600 uppercase">
                  Tertiary Fixed Suite
                </span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="rounded-lg bg-[#FEF3C7] p-2 font-bold text-[#78350F]">
                    tertiary-fixed
                  </div>
                  <div className="rounded-lg bg-[#FDE68A] p-2 font-bold text-[#78350F]">
                    tertiary-fixed-dim
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-[#78350F]">
                    on-tertiary-fixed
                  </div>
                  <div className="rounded-lg border bg-white p-1.5 text-slate-600">
                    on-tertiary-fixed-variant
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MACHINE-READABLE PALETTE (FOR AGENTS) ACCORDION               */}
      {/* ------------------------------------------------------------- */}
      <div className="overflow-hidden rounded-xl border border-[#CAD3F5] bg-white">
        <button
          type="button"
          onClick={() => setAgentDrawerOpen((prev) => !prev)}
          className="flex w-full items-center justify-between px-5 py-3.5 text-left font-sans text-sm font-bold text-slate-900 transition-colors hover:bg-[#F8FAFC]"
        >
          <div className="flex items-center gap-2">
            {agentDrawerOpen ? (
              <ChevronDown className="size-4 text-[#0056FF]" />
            ) : (
              <ChevronRight className="size-4 text-[#0056FF]" />
            )}
            <span>Machine-readable palette (for agents)</span>
          </div>
          <span className="font-mono text-xs text-slate-400">JSON &middot; Agent Ready</span>
        </button>

        {agentDrawerOpen && (
          <div className="space-y-3 border-t border-[#CAD3F5] bg-[#F8FAFC] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] text-slate-500">
                Machine format ready for system prompts, LLM tool schemas, and agent context
              </span>
              <button
                type="button"
                onClick={handleCopyPaletteJson}
                className="inline-flex items-center gap-1.5 rounded-md border border-[#0056FF] bg-[#0056FF] px-3 py-1 font-mono text-xs font-bold text-white transition-opacity hover:opacity-90 active:scale-95"
              >
                {copiedPalette ? (
                  <>
                    <Check className="size-3 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3 text-white" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <pre className="overflow-x-auto rounded-lg border border-[#CAD3F5] bg-white p-4 font-mono text-xs leading-relaxed text-[#0A1A4A]">
              {JSON.stringify(
                {
                  $schema: 'https://snpi.edu.kh/schemas/color-palette-v2.json',
                  brand: {
                    primary: {
                      base: '#0056FF',
                      steps: COLOR_RAMPS.find((r) => r.id === 'primary')?.steps.map((s) => ({
                        step: s.step,
                        hex: s.hex,
                        contrast: s.contrastWhite,
                      })),
                    },
                  },
                  accents: {
                    accent: '#D97706',
                    accent2: '#2277FF',
                  },
                  neutral: {
                    canvas: '#FFFFFF',
                    subsurface: '#EFF5FF',
                    border: '#CAD3F5',
                    text: '#0A1A4A',
                  },
                  status: {
                    success: '#10B981',
                    warning: '#F59E0B',
                    error: '#EF4444',
                    info: '#0284C7',
                  },
                },
                null,
                2,
              )}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
