# SNP-SMS Color Theory Standards & Visual Semantics

This specification governs the systemic application of color theory, semantic palette distribution, contrast boundaries, and state feedback across all web and mobile interfaces in the SNP-SMS platform.

---

## 1. The 60-30-10 Rule of Interface Balance

All views, panels, and layouts must maintain visual harmony by enforcing the 60-30-10 ratio:

* **60% Base / Neutrals (Backgrounds & Canvas Surfaces)**:
  - Establishes the canvas foundation.
  - Light Mode: `#FFFFFF` (Canvas), `#F8FAFC` (Surface Secondary), `#F1F5F9` (Subtle Borders/Dividers).
  - Dark Mode: `#121212` (Base Canvas), `#1E1E1E` (Card Surface), `#272727` (App Bar/Containers).
* **30% Secondary / Structural Elements (Cards, Sidebars, Headers, Typography)**:
  - Provides visual architecture and content hierarchy without competing with primary actions.
  - Slate scales (`#0F172A`, `#334155`, `#64748B`, `#94A3B8`), neutral cards, table headers, and structural dividers.
* **10% Accent / High-Impact Actions (CTAs, Badges, Highlights)**:
  - Reserved strictly for elements requiring immediate user attention or interaction.
  - Primary Brand Royal Blue (`#0056FF`), high-priority submission buttons, active tabs, and notification badges.

---

## 2. Color Hierarchy & Attentional Weight

Visual hierarchy dictates where user attention flows first:
1. **High Luminance / Saturated Accents**: Direct eye movement to the single primary action on a screen (e.g., "Confirm Enrollment", "Process Tuition Payment").
2. **Medium Weight / Neutrals**: Hold reading attention for body text, table content, and metadata.
3. **Muted / Low Contrast Neutrals**: Fade into the background for inactive dividers, placeholder texts, and secondary timestamps.

---

## 3. Semantic Feedback Colors (Universal System Meaning)

Semantic colors provide unambiguous cognitive feedback. Never invert or alter semantic mappings:

| Semantic Role | Primary Tone | Background Tint | Border Contrast | Semantic Meaning |
| :--- | :--- | :--- | :--- | :--- |
| **Success** | `#16A34A` (Green-600) | `#DCFCE7` (Green-50) | `#86EFAC` (Green-300) | Successful database commit, valid payment receipt, active enrollment. |
| **Error / Critical** | `#DC2626` (Red-600) | `#FEE2E2` (Red-50) | `#FCA5A5` (Red-300) | Form validation failure, security alert, deletion confirmation, 403 Forbidden. |
| **Warning** | `#D97706` (Amber-600) | `#FEF3C7` (Amber-50) | `#FCD34D` (Amber-300) | Pending approval, expiring session, invoice overdue alert, system warning. |
| **Info / Notice** | `#0056FF` (Royal Blue) | `#E3E7FC` (Soft Lavender) | `#CAD3F5` (Blue-200) | Non-blocking telemetry notice, sync update, informational banner. |

---

## 4. UI Interaction States Matrix

Colors must clearly communicate whether an element is actionable, active, or disabled:

1. **Default State**: Clean, balanced contrast adhering to WCAG AA 4.5:1 ratio.
2. **Hover State**: 4-8% luminance shift (e.g., `#0056FF` -> `#0047D4` on dark/primary, or white -> `#F8FAFC` on neutral buttons).
3. **Active / Pressed State**: Highest saturation or solid color fill, accompanied by a subtle 0.98 scale compression.
4. **Focused State**: High-contrast 2px outline with 2px offset (`outline: 2px solid #0056FF; outline-offset: 2px;`) for keyboard accessibility.
5. **Disabled State**: Reduced contrast with muted opacity (38% white on dark, slate-400 on light), `cursor: not-allowed`, and pointer-events disabled.

---

## 5. Dark Mode Considerations

* **Avoid Pure Inversion**: Never invert light backgrounds to pure `#000000`. Use `#121212` or `#1A1A1A`.
* **Reduce White Contrast**: Pure `#FFFFFF` text on dark backgrounds causes halation and eye fatigue. Use `#E0E0E0` (87% white) for primary text and `#A0A0A0` (60% white) for secondary text.
* **Desaturate Accent Colors**: Highly saturated colors vibrate uncomfortably against dark surfaces. Mute primary accents to 200-500 tone levels.
