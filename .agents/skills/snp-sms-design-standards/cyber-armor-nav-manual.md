# Cyber Armor Modular Navigation & Aerospace Mecha HUD Console Manual

> **Authoritative Specification**: SNP-SMS Full-Stack Monorepo Architectural Design Standards  
> **Skill Identifier**: `SKILL-CYBER-NAV`  
> **Brand Color System**: Royal Blue (`#0056FF`), Azure Blue (`#2277FF`), Soft Lavender (`#E3E7FC`), Border (`#CAD3F5`), White (`#FFFFFF`), Black (`#000000`)  
> **Design Philosophy**: High-Tech Aerospace Mechanical Chassis, 45° Stepped Chamfers, Milled Double-Seams, Royal Blue Luminous Glow, Zero Dots

---

## 1. Architectural Philosophy & Origin

The **Cyber Armor Modular Navigation Bar** (`CyberArmorNav`) replaces legacy hanging trapezoid tabs with an aerospace-grade mecha command console. Inspired by modular sci-fi consoles, avionics HUD switchboards, and military vehicle cockpits, it delivers tactile physical presence inside a responsive, modern web interface.

### The 5 Architectural Pillars

1. **Stepped Armor Chassis**: Chamfered 45° corner ear caps, dual elevated top armor wings (`/‾‾\`), and a central bottom drop bracket (`\___/`).
2. **Physical Double-Seam Dividers**: Each modular button cell is separated by a 1px dark seam line (`#CBD5E1`) paired with an adjacent 1px white milled highlight line (`#FFFFFF`), mimicking laser-cut aluminum panels.
3. **Luminous Royal Blue Glow Indicator**: Active tabs receive a high-intensity Royal Blue (`#0056FF`) to Azure Blue (`#2277FF`) gradient underline bar with ambient box-shadow glow (`0 0 10px rgba(0,86,255,0.7)`).
4. **Light Day First Metallic Aesthetic**: Pure white (`#FFFFFF`) with subtle metallic drop gradient (`#F8FAFC` to `#EEF2F8`), Soft Lavender accents (`#E3E7FC`), and crisp `#CAD3F5` perimeter stroke.
5. **Zero-Dot Strict Compliance**: Underline glow bars, milled panel seams, and kinetic micro-icons only. Circular dot styles are permanently forbidden.

---

## 2. Mathematical Chassis Geometry

The underlying vector chassis is drawn using an SVG contour (`viewBox="0 0 1000 68"` with `preserveAspectRatio="none"`):

```
(0,28)────(18,10)──────(220,10)───────────(380,10)──────(620,10)───────────(780,10)──────(982,10)────(1000,28)
  │                      /    \               │            /    \               │                      │
  │                   (240,0)(360,0)          │         (640,0)(760,0)          │                      │
  │                    [Wing 1 Slot]          │          [Wing 2 Slot]          │                      │
(0,40)────(18,58)──────(240,58)───────────────┼──────────────────────────────(760,58)──────(982,58)────(1000,40)
                         \                    │                               /
                       (260,68)───────────────┴────────────────────────────(740,68)
                                        [Drop Bracket]
```

### SVG Path Definition

```svg
<path
  d="M 18,10 
     L 220,10 L 240,0 L 360,0 L 380,10 
     L 620,10 L 640,0 L 760,0 L 780,10 
     L 982,10 L 1000,28 L 1000,40 L 982,58 
     L 760,58 L 740,68 L 260,68 L 240,58 
     L 18,58 L 0,40 L 0,28 Z"
  fill="url(#cyberChassisLightGrad)"
  stroke="#CAD3F5"
  strokeWidth="1.75"
  vectorEffect="non-scaling-stroke"
/>
```

---

## 3. Brand Color Mapping

| Token Element | Brand Hex Code | Role & Applied Feature |
| :--- | :--- | :--- |
| **Primary Base** | `#0056FF` (Royal Blue) | Active underline glow bar, tech slot LED accents |
| **Secondary Surge** | `#2277FF` (Azure Blue) | Active bar center gradient stop, hover glint |
| **Chassis Surface** | `#FFFFFF` $\to$ `#EEF2F8` | Multi-stop metallic linear gradient chassis body |
| **Soft Lavender** | `#E3E7FC` | Button hover background wash, wing deboss base |
| **Perimeter Border** | `#CAD3F5` | 1.75px outer chassis contour, tech slot borders |
| **Active Text** | `#000000` / `#020617` | High-contrast bold Sora typography |
| **Inactive Text** | `#475569` (Slate-600) | Secondary readable label color, hover to `#0056FF` |

---

## 4. Component Interface Contract

```typescript
export interface CyberTabItem {
  id: string;
  label: string;
  icon?: IconComponent | React.ComponentType<{ className?: string }>;
  href?: string;
  badge?: number | string;
  onClick?: () => void;
}

export interface CyberArmorNavProps {
  items: CyberTabItem[];
  activeId: string;
  onSelect?: (id: string) => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showIcons?: boolean;
}
```

### Sizing Scale

- **`sm` (Compact Console)**: Container height `44px`, button height `32px`, padding `px-3.5`, font `text-[11px]`.
- **`md` (Standard Aerospace)**: Container height `50px`, button height `36px`, padding `px-5 sm:px-6`, font `text-xs sm:text-[13px]`.
- **`lg` (Hero Command Bar)**: Container height `56px`, button height `42px`, padding `px-6 sm:px-8`, font `text-sm sm:text-base`.

---

## 5. Usage Guidelines

### Do
- Use `CyberArmorNav` in primary header navigation hubs, sticky toolbars, and operational module switchboards.
- Use uppercase Sora typography with `tracking-wider font-black`.
- Rely on the Royal Blue (`#0056FF`) glow bar for the active state indicator.
- Separate button segments with the 1px dark + 1px white double-seam pattern.

### Do Not
- Never use circular dot styles (e.g. blue pulse dots, notification pings).
- Never render flat, borderless rectangles without the stepped armor chassis.
- Never use dark gray or dark mode backgrounds for primary light day components.
- Never truncate button text abruptly; ensure labels remain concise and readable.
