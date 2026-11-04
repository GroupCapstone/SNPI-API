# Icon Bar & Precision Blueprint Grid Design Manual

This manual establishes the authoritative architectural standard, interaction physics, and geometric tokens for the **Icon Bar** toolbar and the **Blueprint Precision Grid System** in the SNP-SMS enterprise platform.

---

## 1. Icon Bar Toolbar Specification

The **Icon Bar** is a compact, high-efficiency horizontal toolbar component designed for workspace tool selection, action panels, and drawing or editing environments.

### 1.1 Structural Geometry & Dimensions
- **Outer Height**: Fixed `54px` (`h-[54px]`).
- **Internal Padding**: `p-1.5` (`6px`) around all items.
- **Inter-Item Gap**: Strict `4px` (`gap-1`).
- **Outer Frame**: Subtle 1px keyline border (`border border-slate-800/80` in Dark Mode, `border-slate-200/90` in Light Mode) with `rounded-2xl` framing.
- **Background Canvas**:
  - Dark Mode: Surface level 1 obsidian (`bg-[#0A0D14]/95` or `bg-[#121622]`).
  - Light Mode: Crisp white with subtle backdrop blur (`bg-white/95` or `bg-slate-50`).

### 1.2 Interactive States & Micro-Interactions

```
+-------------------------------------------------------------------+
|  [Pen   *]       [  Eraser  ]       [  Fill  ]       [  Select  ] |
|   Selected          Hover            Default          Default     |
|   Fill + Bloom      Bloom Only       Icon Only        Icon Only   |
+-------------------------------------------------------------------+
```

#### A. Selected Fill
- **Active / Pinned State**: When an item is selected, its container background fills with an elevated surface:
  - Dark Mode: `bg-white/10` or `bg-slate-800/90`.
  - Light Mode: `bg-slate-100` or `bg-[#E3E7FC]/60`.
- Text color transitions to full contrast (`text-white` or `text-slate-950`).

#### B. Label Bloom (Horizontal Reveal Animation)
- **Compact Default State**: The item displays only the vector icon (`18px` to `20px`), keeping the toolbar minimal and lightweight.
- **Bloom Trigger**: Triggered on hover, keyboard focus, or active selection.
- **Physics**:
  - Width expands from `0` to `auto` with `overflow-hidden`.
  - Label text smoothly fades in (`opacity: 0 -> 1`) with subtle horizontal slide (`x: -4 -> 0`).
  - Timing: Sub-200ms ease-out curve (`cubic-bezier(0.16, 1, 0.3, 1)` or spring `{ stiffness: 400, damping: 28 }`).
  - Zero Layout Glitch: Non-blooming neighbor items adjust smoothly via flex flow.

#### C. Active Indicator Line (Zero-Dot Standard)
- **Visual Cue**: A clean 2px horizontal indicator bar (`h-0.5 rounded-[1px]`) positioned along the bottom edge of the active item.
- **Color Accent**:
  - Primary / Selection: Royal Blue (`#0056FF` or `#38BDF8`).
  - Active Tool: Indigo / Royal Blue (`#0056FF`).
- **Function**: Distinguishes active/pinned state and displays tool selection with zero circular dot clutter.

### 1.3 Keyboard Accessibility: Roving Tabindex Protocol
The Icon Bar implements the WAI-ARIA Toolbar pattern (`role="toolbar"`) with roving tabindex navigation:
- **Navigation Controls**:
  - `ArrowRight` / `ArrowDown`: Moves focus to the next icon item with circular wrapping.
  - `ArrowLeft` / `ArrowUp`: Moves focus to the previous icon item with circular wrapping.
  - `Home`: Immediately focuses the first icon item.
  - `End`: Immediately focuses the last icon item.
  - `Enter` / `Space`: Pins / selects the focused tool item.
  - `Escape`: Clears / unpins the selection.
- **ARIA Attributes**:
  - Container: `role="toolbar"`, `aria-label="Tool options"`, `aria-orientation="horizontal"`.
  - Items: `role="button"`, `aria-pressed={isSelected}`, `tabIndex={isFocused ? 0 : -1}`, `aria-label={item.label}`.

---

## 2. Blueprint Precision Grid & Geometry Standards

Extracted from the master component blueprints, the following dimensional and radius rules must be strictly respected by all AI agents and contributors:

### 2.1 Universal Corner Radius Rule: `r4`
- **Standard Button & Control Corners**: Strictly `4px` (`rounded-[4px]`).
- **Border Width**: `0px` (`border-0`) on standard solid buttons, or `1px` subtle keylines on outlined cards.
- **Logic**: Consistent subtle rounding matches industrial technical interfaces and prevents bubbly or toy-like aesthetics.

### 2.2 Banner Notice Blueprint Suite (`44px` Standard)

| Variant | Height | Internal Padding | Elements & Metrics | Role / Semantics |
| :--- | :--- | :--- | :--- | :--- |
| **Banner Filled** | `44px` (`h-11`) | `ps 16 · pe 48 · py 12` | Full-width strip, close button `32px` (`end 8`) | `role="status"` |
| **Banner Outline** | `44px` (`h-11`) | `ps 16 · pe 48 · py 12` | `border-b 1`, dismiss `32px` (`end 8`) | `role="status"` |
| **Banner Tagged** | `44px` (`h-11`) | `ps 16 · pe 48 · py 12` | Tag pill `h20 · px 6 · r4 · gap 8` | `role="region"` |
| **Banner Notice** | `44px` (`h-11`) | `ps 16 · pe 48 · py 12` | Icon `16px · gap 8`, close `32px` (`end 8`) | `role="alert"` / `role="status"` |
| **Banner Cookie** | `152px` | `p 16 · max-w-[448px]` | `r4` radius, buttons `h36 · gap 8` | `role="dialog"` |
| **Banner Subscribe** | Auto | `p 20 · r4` | Input `h40 · gap 8`, error slot `min-h 20` | `role="form"` |

### 2.3 Sidebar Workspace Blueprint
- **Standard Width**: Fixed `256px` (`w-64`).
- **Row Item Height**: Strict `36px` (`h-9` / `rows h36`).
- **Corner Radii**: `r4` (`rounded-[4px]`).
- **Pinned Bottom Section**: Settings row permanently anchored to bottom viewport.
- **Top Bar**: Search input or workspace switcher.

---

## 3. Implementation Blueprint (`IconBar`)

```tsx
import * as React from 'react';
import { cn } from '@/lib/utils';

export interface IconBarItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  hasStatusDot?: boolean;
}

export interface IconBarProps {
  items: IconBarItem[];
  selectedId?: string;
  onSelect?: (id: string) => void;
  className?: string;
}

export function IconBar({ items, selectedId, onSelect, className }: IconBarProps) {
  const [activeId, setActiveId] = React.useState<string>(selectedId || items[0]?.id || '');
  const [focusedIdx, setFocusedIdx] = React.useState<number>(0);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev + 1) % items.length);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setFocusedIdx((prev) => (prev - 1 + items.length) % items.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setFocusedIdx(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setFocusedIdx(items.length - 1);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      const item = items[focusedIdx];
      if (item) {
        setActiveId(item.id);
        onSelect?.(item.id);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setActiveId('');
      onSelect?.('');
    }
  };

  return (
    <div
      role="toolbar"
      aria-label="Tool options"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn(
        'relative flex h-[54px] items-center gap-1 rounded-2xl border border-slate-800/90 bg-[#0A0D14]/95 p-1.5 shadow-2xl backdrop-blur-xl',
        className,
      )}
    >
      {items.map((item, idx) => {
        const isSelected = activeId === item.id;
        const isHovered = hoveredId === item.id;
        const isFocused = focusedIdx === idx;
        const isBloomed = isSelected || isHovered || isFocused;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            role="button"
            aria-pressed={isSelected}
            aria-label={item.label}
            tabIndex={isFocused ? 0 : -1}
            onClick={() => {
              setActiveId(item.id);
              setFocusedIdx(idx);
              onSelect?.(item.id);
            }}
            onMouseEnter={() => setHoveredId(item.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setFocusedIdx(idx)}
            className={cn(
              'group relative flex h-full cursor-pointer items-center gap-2 rounded-xl px-3 transition-all duration-200 select-none outline-none',
              isSelected
                ? 'bg-white/10 text-white shadow-inner ring-1 ring-white/10'
                : 'text-slate-400 hover:bg-white/5 hover:text-white',
              isFocused && 'ring-2 ring-[#0056FF]/70',
            )}
          >
            {/* Status Dot Accent Indicator */}
            {(item.hasStatusDot ?? isSelected) && (
              <span
                aria-hidden="true"
                className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-[#818CF8] shadow-[0_0_6px_rgba(129,140,248,0.8)]"
              />
            )}

            {/* Vector Icon */}
            <Icon className="size-4.5 shrink-0 stroke-[1.8] transition-transform duration-200 group-hover:scale-105" />

            {/* Bloom-Open Label Reveal */}
            <span
              className={cn(
                'overflow-hidden font-sans text-xs font-bold whitespace-nowrap transition-all duration-200 ease-out',
                isBloomed ? 'max-w-[120px] opacity-100 pr-0.5' : 'max-w-0 opacity-0',
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
```

---

## 4. Design & Agent Verification Checklist

When building or updating toolbars and layout blocks, every AI agent must verify:
- [ ] Outer container height is locked to `54px` (`h-[54px]`).
- [ ] Inter-item gap is locked to `4px` (`gap-1`).
- [ ] Label blooms open on hover, keyboard focus, and selection with smooth max-width expansion.
- [ ] Active indicator line appears at bottom edge (`h-0.5 rounded-[1px]`, zero-dot standard).
- [ ] Roving tabindex handles `ArrowLeft`/`ArrowRight`/`Home`/`End`, with `Enter` pinning and `Escape` clearing.
- [ ] All standard buttons and control corners strictly enforce `r4` (`rounded-[4px]`).
- [ ] Banner blocks adhere to the `44px` height standard (`ps 16 · pe 48 · py 12`).
