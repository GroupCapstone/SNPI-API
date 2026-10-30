# SNP-SMS Interactive Motion & Visual Effects Catalog

This manual defines the design parameters, animation curves, and behavioral rules for the 18+ primary interactive visual effect styles used across video generators, educational media reels, and advanced interactive interfaces in the SNP-SMS platform.

---

## The 18 Core Effect Styles Matrix

| # | Effect Style Name | Category | Motion Curve & Physics | Primary Use Case |
|---|---|---|---|---|
| **01** | **Kinetic Hook** | Text & Motion | Snap overshoot spring (`stiffness: 450, damping: 25`) | First 1.5 seconds opening attention grabber |
| **02** | **Gravity Drop** | Physics Simulation | Exponential downward acceleration with ground bounce | Badges, pills, cards falling into place |
| **03** | **Giant Captions** | Kinetic Typography | Step-synchronized word-by-word highlight | Audio/TTS synchronized subtitle text |
| **04** | **Prompt Bar** | UI Simulation | Smooth width expansion (`useMeasure`) with caret blink | Interactive AI query input simulation |
| **05** | **Storyboard Deck** | 3D Spatial Layout | Cascading perspective offset (`rotateX: 12deg, z: -40px`)| Multi-scene preview and sequence arrangement |
| **06** | **Icon Strike** | Vector Transform | Fast 3-line vector morph with scale punch (`1.15 -> 1.0`)| Verification stamp, completion check, strikeout |
| **07** | **File Drop** | Interface Interaction| Dashed border pulse with floating asset suction | Drag-and-drop document upload feedback |
| **08** | **NLE Timeline** | Media Tooling | Horizontal playhead scrub with multi-track alignment | Non-linear video/audio editing interfaces |
| **09** | **Jiggle Delete** | Micro-interaction | High-frequency sinusoidal oscillation (`+-2.5deg, 12Hz`)| Edit mode, removable items, danger confirmation |
| **10** | **Grade Slider** | Control Element | Tactile thumb drag with real-time color lut interpolation | Hue/saturation/luminance color adjustments |
| **11** | **Eyedropper Grade**| Inspection Tool | Magnified 8x8 pixel grid loupe with hex/RGB readout | Live color sampling and palette selection |
| **12** | **Film Look** | Post-Processing | Subtle 35mm grain overlay, halation, contrast lift | Cinematic educational video polish |
| **13** | **Title Card** | Stage Presentation | Center letterbox reveal with subtitle fade-up | Topic introduction, module lesson title |
| **14** | **Playing Grid** | Media Layout | Responsive 2x2 or 3x3 video matrix with active border | Multi-camera feeds, student participant grid |
| **15** | **Reel Feed** | Vertical Navigation | Fluid swipe snap (`scroll-snap-type: y mandatory`) | 9:16 vertical TikTok/Reels educational video feed |
| **16** | **Video Card** | Media Container | Flat bordered surface with hover play preview | Video lesson catalog item, preview thumbnail |
| **17** | **Comment CTA** | Engagement Trigger | Subtle heartbeat pulsing outline with icon bounce | Encouraging student discussion or answers |
| **18** | **Comment Drop** | Social Interaction | Cascading physics card slide-down with blur entry | Live question comments, feedback ticker |

---

## 1. Kinetic & Attention Triggers (01 - 04)
* **Kinetic Hook**: Designed to arrest user attention within the first 400ms. Utilizes quick scale explosion (`0.85 -> 1.05 -> 1.0`) accompanied by high-velocity text reveal.
* **Gravity Drop**: Simulates Newtonian gravitational pull ($y = \frac{1}{2}gt^2$). Elements drop from $-60\text{px}$ offscreen, bounce once with coefficient of restitution $e = 0.35$, and settle at resting baseline.
* **Giant Captions**: High-contrast, large-format typography (36px to 54px bold). Current spoken syllable or word lights up in Signal Gold or Information Blue while background words maintain 40% opacity.

---

## 2. Interactive Controls & Tooling (05 - 12)
* **Jiggle Delete**: When user enters edit/reorder state, elements shake with continuous keyframe animation (`rotate: [-2deg, 2deg, -1deg, 1deg, 0]`) until dismissed or tapped.
* **Grade Slider & Eyedropper**: Provides immediate visual and audio tactile feedback (3ms bandpass click) as values update across the hue spectrum.
* **NLE Timeline**: Features a high-contrast vertical red/white playhead marker with frame-accurate timestamp readout and waveform visualization.

---

## 3. Media Layout & Social Engagement (13 - 18)
* **Playing Grid**: Grid container maintains fixed aspect ratios (16:9 or 9:16). Active speaker or selected video receives a 2px Emerald Green or Information Blue outline ring.
* **Reel Feed**: Full-screen 9:16 vertical snap container with smooth physics deceleration. Audio automatically pauses when card scrolls $>50\%$ out of viewport.
* **Comment Drop**: New incoming comments or quiz responses animate in with vertical slide (`translateY: -20px -> 0px`), opacity fade (`0 -> 1`), and light surface luminance tint.
