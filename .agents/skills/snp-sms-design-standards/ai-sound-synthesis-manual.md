# Procedural Audio Synthesis: Generating UI Sounds with Web Audio API & AI

Authoritative engineering guide and mathematical specification for procedural audio synthesis, waveform modeling, filtered noise, exponential envelopes, and zero-asset UI sound libraries across the SNP-SMS platform.

---

## 1. The Procedural Audio Paradigm

Traditional web applications rely on sampled audio files (`.mp3`, `.wav`), introducing HTTP network latency, decoding overhead, and rigid, immutable sound effects. The modern standard utilizes the **Web Audio API** (available cross-browser since April 2021) to synthesize audio programmatically in real time:
1. **Zero Asset Weight**: Complete sound libraries are generated using fewer than 150 lines of pure TypeScript with zero external asset requests.
2. **Instantaneous Execution (<5ms latency)**: Audio graphs compute directly in memory, bypassing HTTP network roundtrips.
3. **Parametric Dynamic Tuning**: Sounds adapt dynamically to user actions—modulating pitch, duration, or filter cutoffs based on velocity, drag distance, or progress.

---

## 2. Core Synthesis Components

Every procedural UI sound is assembled from three foundational primitives:

### 2.1 Waveforms & Oscillators
* **Sine (`osc.type = "sine"`)**: Pure single-frequency fundamental without harmonics. Smooth, gentle, and warm. Ideal for subtle pops, drops, and soft chimes.
* **Triangle (`osc.type = "triangle"`)**: Odd harmonics falling off rapidly ($1/f^2$). Slightly crisper than sine, warmer than square. Excellent for melodic notifications and alerts.
* **Square (`osc.type = "square"`)**: Rich odd harmonics ($1/f$). Hollow, buzzing, vintage digital timbre. Best suited for retro cues and assertive chimes.
* **Sawtooth (`osc.type = "sawtooth"`)**: Complete harmonic series ($1/f$). Bright, sharp, and aggressive. Ideal for dissonant error buzzes and attention-demanding warnings.

### 2.2 Filtered Noise (The Anatomy of a Click)
Pure white noise consists of completely random amplitude values across all frequencies. Unfiltered, it sounds harsh and static. When shaped with filters, noise forms the realistic basis of mechanical tactile clicks, whooshes, and paper rustles:
* **Lowpass (`filter.type = "lowpass"`)**: Attenuates frequencies above the cutoff. Yields muffled thuds and gentle mechanical taps.
* **Highpass (`filter.type = "highpass"`)**: Attenuates frequencies below the cutoff. Produces thin, brittle ticks and crisp clock needles.
* **Bandpass (`filter.type = "bandpass"`)**: Passes only a narrow frequency band around a central frequency, rejecting both highs and lows. **This is the mathematical foundation of an authentic UI click.**

### 2.3 Envelopes (Attack & Exponential Decay)
Natural acoustic phenomena do not stop instantaneously; their energy dissipates over time according to exponential decay:
* **Attack**: How rapidly the sound achieves peak amplitude. Linear or rapid ramp (`0.005s` to `0.01s`).
* **Decay**: The dissipation curve. Physical sounds **must decay exponentially** (`exponentialRampToValueAtTime`) rather than linearly. Linear decay produces unnatural, robotic cutoffs.

---

## 3. The Core UI Sound Synthesis Engine

The complete zero-asset algorithmic library for SNP-SMS interface components:

```typescript
// apps/frontend/shared/audio/sound-synth.ts

export type FeelParams = {
  filterFreq: number;
  q: number;
  oscType: OscillatorType;
  decayMult: number;
  gainMult: number;
  pitchMult: number;
};

export const DEFAULT_FEEL: FeelParams = {
  filterFreq: 2400,
  q: 3.5,
  oscType: 'sine',
  decayMult: 1,
  gainMult: 1,
  pitchMult: 1,
};

// 1. Tactile Button Click (Bandpass Noise + Exponential Envelope)
export function playClick(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  const duration = 0.008 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (50 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = params.filterFreq;
  filter.Q.value = params.q;

  const gain = ctx.createGain();
  gain.gain.value = 0.45 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

// 2. Interactive Pop (Downward Pitch Sweep)
export function playPop(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(400 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(150, t + 0.04 * params.decayMult);

  gain.gain.setValueAtTime(0.35 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.05 * params.decayMult);

  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.05 * params.decayMult);
}

// 3. Mechanical Toggle (Noise Transient + Tone Body)
export function playToggle(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  // Layer A: Noise transient
  const duration = 0.012 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (80 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2500;
  filter.Q.value = params.q;

  const noiseGain = ctx.createGain();
  noiseGain.gain.value = 0.4 * params.gainMult;

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(t);

  // Layer B: Subtle pitch anchor
  const osc = ctx.createOscillator();
  const oscGain = ctx.createGain();

  osc.type = params.oscType;
  osc.frequency.setValueAtTime(800 * params.pitchMult, t);
  osc.frequency.exponentialRampToValueAtTime(400, t + 0.03 * params.decayMult);

  oscGain.gain.setValueAtTime(0.15 * params.gainMult, t);
  oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04 * params.decayMult);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);
  osc.start(t);
  osc.stop(t + 0.04 * params.decayMult);
}

// 4. Subtle Tick (Highpass Noise Needle)
export function playTick(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  const duration = 0.004 * params.decayMult;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (20 * params.decayMult));
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.value = 3000 * params.pitchMult;

  const gain = ctx.createGain();
  gain.gain.value = 0.25 * params.gainMult;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}

// 5. Success Arpeggio (Staggered Major Triad: C5 -> E5 -> G5)
export function playSuccess(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  const notes = [523.25, 659.25, 783.99].map((n) => n * params.pitchMult);
  const spacing = 0.08 * params.decayMult;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = params.oscType === 'square' ? 'triangle' : params.oscType;
    osc.frequency.value = freq;

    const start = t + i * spacing;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.22 * params.gainMult, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.15 * params.decayMult);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.15 * params.decayMult);
  });
}

// 6. Dissonant Error (Dual Detuned Oscillators with Lowpass Filter)
export function playError(ctx: AudioContext, t = ctx.currentTime, params = DEFAULT_FEEL): void {
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain = ctx.createGain();

  const baseFreq = 180 * params.pitchMult;
  osc1.type = params.oscType === 'sine' ? 'sawtooth' : params.oscType;
  osc1.frequency.setValueAtTime(baseFreq, t);
  osc1.frequency.exponentialRampToValueAtTime(80, t + 0.25 * params.decayMult);

  osc2.type = params.oscType === 'sine' ? 'square' : params.oscType;
  osc2.frequency.setValueAtTime(baseFreq * 1.05, t); // 5% detuning creates tactile dissonance
  osc2.frequency.exponentialRampToValueAtTime(85, t + 0.25 * params.decayMult);

  gain.gain.setValueAtTime(0.18 * params.gainMult, t);
  gain.gain.exponentialRampToValueAtTime(0.001, t + 0.25 * params.decayMult);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 800;

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(filter);
  filter.connect(ctx.destination);

  osc1.start(t);
  osc2.start(t);
  osc1.stop(t + 0.25 * params.decayMult);
  osc2.stop(t + 0.25 * params.decayMult);
}

// 7. Dynamic Whoosh (Frequency Swept Bandpass Noise)
export function playWhoosh(ctx: AudioContext, t = ctx.currentTime): void {
  const duration = 0.08;
  const buffer = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < data.length; i++) {
    const env = Math.sin((i / data.length) * Math.PI);
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(4000, t);
  filter.frequency.exponentialRampToValueAtTime(1500, t + duration);
  filter.Q.value = 1;

  const gain = ctx.createGain();
  gain.gain.value = 0.15;

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(t);
}
```

---

## 4. Collaborative AI Prompting Protocol

When partnering with AI agents or LLMs to synthesize novel UI sounds:
1. **Describe the Mechanical Metaphor**: State what physical object the sound evokes (e.g. "a vintage metal toggle switch", "a hollow wooden block", "a crisp typewriter key").
2. **Specify Frequency and Filter Bounds**: Direct the agent toward `bandpass` for clicks, `lowpass` for thuds, or `sine sweep` for drops.
3. **Enforce Exponential Decay**: Explicitly request `exponentialRampToValueAtTime` over a strict duration ($\le 150\text{ms}$).
4. **Tune Attack and Decay Separately**: Adjust attack for impact sharpness, and decay for resonant body.
