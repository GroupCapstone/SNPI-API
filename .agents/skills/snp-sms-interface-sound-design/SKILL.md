---
name: snp-sms-interface-sound-design
description: >-
  A Living Manual for Interface Sound Design: Audio Feedback in Web Interfaces.
  Authoritative specification for purposeful, tactile, and accessible interface sound design,
  auditory cortex speed advantage (25ms vs 250ms), Web Audio API procedural synthesis,
  interaction audio matrix, and user preference controls in the SNP-SMS platform.
---

# A Living Manual for Interface Sound Design: Audio Feedback in Web Interfaces

This skill governs the intentional, accessible, and tactile application of audio feedback across user interfaces in SNP-SMS.

---

## 1. Core Principles

1. **Auditory Speed Advantage**: Ears process acoustic signals in ~25ms; eyes require ~250ms. Sound arrives first when feedback immediacy is paramount.
2. **Auditory Dominance in Temporal Processing**: The brain relies on sound to confirm timing and causality when sight and sound operate together.
3. **Cross-Boundary Presence**: Audio feedback enters the physical workspace, notifying users without forcing continuous visual attention.
4. **Emotional Economy**: Harmonic tones communicate state changes (success, warning, error) without visual clutter.

---

## 2. Mandatory Accessibility & Sovereignty Rules

1. **Complementary Only**: Sound must never be the sole indicator of state. Every acoustic cue MUST possess a corresponding visual element.
2. **Zero Functional Loss**: Users in mute mode or with hearing impairments must operate with 100% functional parity.
3. **User Preference Controls**: Provide user-level mute toggles and volume control.
4. **`prefers-reduced-motion` Proxy**: Honor reduced motion preferences as an active hint to silence decorative sound effects.

---

## 3. Interaction Audio Matrix

| Event Category | Audio Timbre | Purpose |
| :--- | :--- | :--- |
| **Major Confirmation** | Ascending harmonic chime (523Hz &rarr; 659Hz) | Confirms finality for batch actions, payments, and publishing |
| **Error / Alert** | Low dampened thunk (140Hz &rarr; 80Hz) | Non-punitive notice of validation or network failure |
| **Micro Click** | Sub-audible air transient (<30ms) | Enhances perceived tactility on primary button presses |
| **Notification** | Gentle two-tone bell | Alerts user to background background completions |
| **Data Entry / Table** | **MUTE (0Hz)** | Routine high-frequency actions remain strictly silent |

---

## 4. Implementation Guidelines

* Favor procedural synthesis via native `AudioContext` (sine/triangle oscillators) to avoid network latency and asset bundle bloat.
* Always enforce a subtle baseline volume ($\le 0.2$).
* Never autoplay background music or unprompted ambient tracks.
