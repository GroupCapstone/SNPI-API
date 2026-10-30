---
name: snp-sms-ai-sound-synthesis
description: >-
  Procedural Audio Synthesis: Generating UI Sounds with Web Audio API & AI.
  Authoritative specification for algorithmic sound synthesis, waveform modeling (sine, triangle, square, sawtooth),
  bandpass-filtered noise clicks, exponential envelopes, and zero-asset interface sound libraries in SNP-SMS.
---

# Procedural Audio Synthesis: Generating UI Sounds with Web Audio API & AI

This skill governs programmatic, zero-asset audio synthesis using the Web Audio API across all frontend components, dialogs, buttons, and system alerts in the SNP-SMS repository.

---

## 1. Core Synthesis Primitives

1. **Oscillators (Harmonic Body)**:
   - `sine`: Smooth, pure, harmonic fundamental without overtone distortion (drops, pops).
   - `triangle`: Mild odd harmonics ($1/f^2$), gentle presence (subtle alerts).
   - `square`: Rich odd harmonics ($1/f$), hollow retro digital presence.
   - `sawtooth`: Complete harmonic series, sharp and biting (dissonant errors).
2. **Filtered Noise (Tactile Transients)**:
   - Noise buffer populated with `Math.random() * 2 - 1`.
   - **Bandpass Filter (`filter.type = "bandpass"`)**: Isolates target frequency bands to construct realistic mechanical button clicks and toggles.
3. **Exponential Envelopes**:
   - Always dissipate acoustic energy with `exponentialRampToValueAtTime`. Never use linear cuts, which produce artificial popping artifacts.

---

## 2. Standard Synthesis Library

* **Click**: Bandpass-filtered noise burst ($2400\text{Hz}, Q = 3.5$) with exponential decay ($8\text{ms}$).
* **Pop**: Downward exponential pitch sweep ($400\text{Hz} \to 150\text{Hz}$) over $50\text{ms}$.
* **Toggle**: Dual-layer transient (noise tick + $800\text{Hz} \to 400\text{Hz}$ tone).
* **Tick**: Ultra-compact highpass noise spike ($3000\text{Hz}$, $4\text{ms}$).
* **Success**: Staggered major triad arpeggio ($523.25\text{Hz}, 659.25\text{Hz}, 783.99\text{Hz}$).
* **Error**: Dissonant dual detuned oscillators ($180\text{Hz}$ and $189\text{Hz}$) into an $800\text{Hz}$ lowpass filter.
* **Whoosh**: Frequency-swept bandpass noise ($4000\text{Hz} \to 1500\text{Hz}$) over $80\text{ms}$.

---

## 3. Engineering Constraints

1. Zero external audio file downloads (`.mp3`, `.wav`) for core UI interactions.
2. All audio operations execute through a lazy-initialized singleton `AudioContext`.
3. Total duration per interactive micro-cue must not exceed $150\text{ms}$ (alerts $\le 300\text{ms}$).
