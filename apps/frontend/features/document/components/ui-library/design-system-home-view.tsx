'use client';

import * as React from 'react';
import { BrandConceptBlueprint } from './brand-concept-blueprint';
import { ColorRampsTokens } from './color-ramps-tokens';
import { AccessibleDesignPrinciples } from './accessible-design-principles';
import { MaterialGlossarySection } from './material-glossary-section';
import { ScaffoldArchitectureSection } from './scaffold-architecture-section';
import {
  Search,
  ChevronDown,
  ChevronRight,
  ShieldKey,
  Sliders,
  Accessibility,
  BookOpen,
  AppWindow,
} from '@/components/icons';
import { cn } from '@/lib/utils';

interface NavTreeItem {
  id: string;
  label: string;
  href?: string;
  badge?: string;
  isExternal?: boolean;
  children?: { id: string; label: string; href?: string; badge?: string; index?: string }[];
}

// MANDATORY INVARIANT: Sections 01 (Brand Blueprint & Assets / Brand Colors)
// and 02 (Color Ramps & Semantic Tokens) MUST ALWAYS REMAIN PRIMARY AND
// IMMUTABLE AT THE TOP OF THE BLUEPRINT MENU. NEVER REMOVE, REORDER, OR ALTER.
const SIDEBAR_TREE: NavTreeItem[] = [
  {
    id: 'blueprint',
    label: 'Brand Blueprint',
    children: [
      { id: 'brand-blueprint', label: 'Brand Blueprint & Assets', index: '01' },
      { id: 'color-ramps-tokens', label: 'Color Ramps & Semantic Tokens', index: '02' },
      {
        id: 'accessible-design-principles',
        label: 'Principles for Accessible Design',
        index: '03',
      },
      { id: 'material-a-z-glossary', label: 'Material A-Z Lexicon', index: '04' },
      { id: 'layout-scaffold-architecture', label: 'Layout Scaffold Architecture', index: '05' },
    ],
  },
];

export function DesignSystemHomeView() {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [expandedNodes, setExpandedNodes] = React.useState<Record<string, boolean>>({
    blueprint: true,
  });
  const [selectedNode, setSelectedNode] = React.useState<string>('brand-blueprint');

  const toggleNode = (nodeId: string) => {
    setExpandedNodes((prev) => ({
      ...prev,
      [nodeId]: !prev[nodeId],
    }));
  };

  const filteredTree = React.useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return SIDEBAR_TREE;

    return SIDEBAR_TREE.map((node) => {
      const parentMatches = node.label.toLowerCase().includes(q);
      const matchingChildren = node.children?.filter((child) =>
        child.label.toLowerCase().includes(q),
      );
      if (parentMatches || (matchingChildren && matchingChildren.length > 0)) {
        return {
          ...node,
          children: matchingChildren || node.children,
        };
      }
      return null;
    }).filter(Boolean) as NavTreeItem[];
  }, [searchQuery]);

  const scrollToSection = (id: string) => {
    setSelectedNode(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-68px)] bg-white text-slate-900">
      {/* 2-COLUMN SLDS 2 ARCHITECTURE: LEFT SIDEBAR + RIGHT MAIN CONTENT */}
      <div className="mx-auto flex max-w-[1560px] flex-col lg:flex-row">
        {/* ========================================================= */}
        {/* LEFT COLUMN: STICKY NAVIGATION SIDEBAR                    */}
        {/* ========================================================= */}
        <aside
          aria-label="Design System Navigation"
          className="w-full shrink-0 border-b border-[#CAD3F5] bg-white lg:sticky lg:top-[68px] lg:h-[calc(100vh-68px)] lg:w-[280px] lg:overflow-y-auto lg:border-r lg:border-b-0"
        >
          <div className="space-y-4 p-4 lg:p-5">
            {/* Header Identity: Brand Title with version badge */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <span className="font-sans text-sm font-extrabold tracking-tight text-[#0A1A4A]">
                SNPI Design System
              </span>
              <span className="flex size-5 items-center justify-center rounded-md bg-[#0056FF] font-sans text-xs font-black text-white">
                2
              </span>
            </div>

            {/* Quick Search Input */}
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-full border border-slate-200 bg-slate-50/70 py-1.5 pr-8 pl-9 font-sans text-xs text-slate-900 placeholder:text-slate-400 focus:border-[#0056FF] focus:bg-white focus:outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute top-1/2 right-2.5 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Navigation Tree */}
            <nav aria-label="Foundations Outline" className="space-y-1 pt-1">
              {filteredTree.map((item) => {
                const hasChildren = Boolean(item.children && item.children.length > 0);
                const isExpanded = expandedNodes[item.id] || searchQuery.length > 0;
                const isSelected = selectedNode === item.id;

                return (
                  <div key={item.id} className="space-y-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        if (hasChildren) {
                          toggleNode(item.id);
                        } else {
                          scrollToSection(item.id);
                        }
                      }}
                      className={cn(
                        'group flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-left font-sans text-xs font-bold transition-colors',
                        isSelected
                          ? 'bg-[#EFF5FF] text-[#0056FF]'
                          : 'text-[#0A1A4A] hover:bg-slate-100',
                      )}
                    >
                      <span>{item.label}</span>
                      {hasChildren ? (
                        isExpanded ? (
                          <ChevronDown className="size-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="size-3.5 text-slate-400" />
                        )
                      ) : null}
                    </button>

                    {/* Submenu Children */}
                    {hasChildren && isExpanded && (
                      <div className="ml-3 space-y-0.5 border-l border-slate-200 pl-2">
                        {item.children?.map((child) => {
                          const isChildSelected = selectedNode === child.id;
                          return (
                            <button
                              key={child.id}
                              type="button"
                              onClick={() => scrollToSection(child.id)}
                              className={cn(
                                'flex w-full items-center justify-between rounded-md px-2 py-1 text-left font-sans text-xs transition-colors',
                                isChildSelected
                                  ? 'bg-[#EFF5FF] font-bold text-[#0056FF]'
                                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
                              )}
                            >
                              <div className="flex items-center gap-2">
                                {child.index && (
                                  <span className="font-mono text-[10px] text-slate-400">
                                    {child.index}
                                  </span>
                                )}
                                <span className="truncate">{child.label}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: FOCUSED MAIN CONTENT                        */}
        {/* ========================================================= */}
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 sm:py-10 lg:px-12">
          <div className="mx-auto max-w-[1080px] space-y-12">
            {/* ------------------------------------------------------- */}
            {/* BRAND BLUEPRINT & ASSETS                                */}
            {/* ------------------------------------------------------- */}
            <section
              id="brand-blueprint"
              className="scroll-mt-24 space-y-8 rounded-2xl border border-[#CAD3F5] bg-white p-6 sm:p-8 lg:p-10"
            >
              {/* Section Header Title */}
              <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <ShieldKey className="size-6 shrink-0 text-[#0056FF]" />
                <h1 className="font-sans text-2xl font-black tracking-tight text-[#0A1A4A] sm:text-3xl">
                  Brand Blueprint &amp; Assets
                </h1>
              </div>

              {/* Core Brand Blueprint Components */}
              <BrandConceptBlueprint />
            </section>

            {/* ------------------------------------------------------- */}
            {/* COLOR RAMPS & SEMANTIC TOKENS                           */}
            {/* ------------------------------------------------------- */}
            <section
              id="color-ramps-tokens"
              className="scroll-mt-24 space-y-6 rounded-2xl border border-[#CAD3F5] bg-white p-6 sm:p-8 lg:p-10"
            >
              {/* Section Header */}
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Sliders className="size-6 shrink-0 text-[#0056FF]" />
                  <h2 className="font-sans text-2xl font-black tracking-tight text-[#0A1A4A] sm:text-3xl">
                    Color Ramps &amp; Semantic Tokens
                  </h2>
                </div>
                <p className="max-w-3xl font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Contrast-checked color ramps and semantic tokens, built to start a project and
                  hand to your agent.
                </p>
              </div>

              {/* Color Ramps & Semantic Tokens Engine */}
              <ColorRampsTokens />
            </section>

            {/* ------------------------------------------------------- */}
            {/* PRINCIPLES FOR ACCESSIBLE DESIGN                        */}
            {/* ------------------------------------------------------- */}
            <section
              id="accessible-design-principles"
              className="scroll-mt-24 space-y-6 rounded-2xl border border-[#CAD3F5] bg-white p-6 sm:p-8 lg:p-10"
            >
              {/* Section Header */}
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <Accessibility className="size-6 shrink-0 text-[#0056FF]" />
                  <h2 className="font-sans text-2xl font-black tracking-tight text-[#0A1A4A] sm:text-3xl">
                    Principles for Accessible Design
                  </h2>
                </div>
                <p className="max-w-3xl font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Anticipate, include, and respond to the needs of individuals across visual, motor,
                  and cognitive domains for inclusive, equitable outcomes.
                </p>
              </div>

              {/* Accessible Design Principles Engine */}
              <AccessibleDesignPrinciples />
            </section>

            {/* ------------------------------------------------------- */}
            {/* MATERIAL DESIGN 3 A-Z ARCHITECTURAL LEXICON             */}
            {/* ------------------------------------------------------- */}
            <section
              id="material-a-z-glossary"
              className="scroll-mt-24 space-y-6 rounded-2xl border border-[#CAD3F5] bg-white p-6 sm:p-8 lg:p-10"
            >
              {/* Section Header */}
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <BookOpen className="size-6 shrink-0 text-[#0056FF]" />
                  <h2 className="font-sans text-2xl font-black tracking-tight text-[#0A1A4A] sm:text-3xl">
                    Material Design A-Z Lexicon
                  </h2>
                </div>
                <p className="max-w-3xl font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                  Authoritative engineering reference covering all core Material Design 3 concepts,
                  components, HCT color science, and design token hierarchies.
                </p>
              </div>

              {/* Material A-Z Interactive Glossary Engine */}
              <MaterialGlossarySection />
            </section>

            {/* ------------------------------------------------------- */}
            {/* MATERIAL DESIGN 3 LAYOUT SCAFFOLD ARCHITECTURE          */}
            {/* ------------------------------------------------------- */}
            <section
              id="layout-scaffold-architecture"
              className="scroll-mt-24 space-y-6 rounded-2xl border border-[#CAD3F5] bg-white p-6 sm:p-8 lg:p-10"
            >
              {/* Section Header */}
              <div className="space-y-1 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <AppWindow className="size-6 shrink-0 text-[#0056FF]" />
                  <h2 className="font-sans text-2xl font-black tracking-tight text-[#0A1A4A] sm:text-3xl">
                    Layout Scaffold Architecture
                  </h2>
                </div>
                <p className="max-w-3xl font-sans text-xs leading-relaxed text-slate-500 sm:text-sm">
                  A fundamental UI design structure that provides a standard platform for assembling
                  key components into Bars, Rails, Panes, and Safety Regions.
                </p>
              </div>

              {/* Layout Scaffold Interactive Engine */}
              <ScaffoldArchitectureSection />
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
