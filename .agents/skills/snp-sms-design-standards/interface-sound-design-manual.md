# A Living Manual for Interface Sound Design: Audio Feedback in Web Interfaces

Authoritative engineering and design specification for intentional, accessible, and tactile audio feedback across the SNP-SMS platform.

---

## 1. Core Audio Philosophy: Why the Web Shouldn't Be Mute

The web's historical silence is a cultural accident resulting from early abuses—autoplaying MIDI tracks, blaring error alerts, and uninvited noise—rather than an intentional design principle. Native operating systems, mobile devices, and interactive media utilize audio feedback continuously to confirm actions, signal errors, and deliver notifications without sacrificing professionalism.

### Foundational Principles
1. **Auditory Velocity (<25ms vs ~250ms)**: The human auditory cortex processes sound signals in approximately 25ms, whereas visual cognitive processing requires nearly ten times longer (~250ms). When an interface demands immediate feedback, auditory cues arrive first.
2. **Auditory Dominance in Temporal Processing**: When sight and sound present simultaneous information, human perception instinctively trusts hearing for timing, causality, and state completion.
3. **Cross-Boundary Presence**: Audio transcends physical display glass. While pixels remain bound to screen coordinates, acoustic feedback enters the room, providing environmental presence without requiring continuous visual gaze.
4. **Emotional Economy**: A single harmonic tone communicates success, warning, failure, or playfulness instantaneously, bypassing the need for complex, attention-draining visual choreography.

---

## 2. Accessibility & User Preferences (Mandatory Rules)

Audio must never become an obstacle or a point of failure:

### 2.1 The Complementary Principle (Strict Accessibility)
* **Never Audio-Only**: Sound must strictly **complement** visual cues, never replace them. Every acoustic notification or confirmation MUST possess an identical visual equivalent (e.g. snackbar, border highlight, badge, or text banner).
* **Zero Functional Loss**: Users who are deaf, hard of hearing, muted, or working in quiet environments must experience zero loss of functionality.

### 2.2 User Preference & Sovereignty
* **User Settings Toggle**: Provide an explicit audio toggle in user preferences:
  * Master Audio Enable/Disable.
  * Independent UI Audio Volume Slider (independent of OS master volume).
* **`prefers-reduced-motion` Proxy**: In the absence of a standardized `prefers-reduced-audio` media query, treat `prefers-reduced-motion: reduce` as an active signal to silence decorative audio cues, honoring the user's desire for reduced cognitive stimulation.

---

## 3. When to Use Sound: The Interaction Matrix

Not every interaction warrants sound. Overusing audio replicates the errors of the early web. Audio earns its place only where it clarifies state, confirms critical operations, or prevents catastrophic errors.

| Category | UI Trigger | Audio Character | Purpose & Justification |
| :--- | :--- | :--- | :--- |
| **Confirmations** | Payment completed, grade sheet published, batch imported | Warm, ascending harmonic chime (440Hz &rarr; 880Hz) | Solidifies finality and reassurance on irreversible or high-stakes operations |
| **Errors & Alerts** | Form validation failed, network connection dropped, permission denied | Soft, low-frequency dampened thunk (120Hz &rarr; 80Hz) | Signals stoppage without punishing or startling the user; avoids piercing beeps |
| **State Changes** | Sheet expanded, tab switched, camera scanner initialized | Subtle, sub-audible air click (high-pass filtered, <30ms) | Enhances perceived mechanical responsiveness and tactile engagement |
| **Background Notifications** | Incoming message, background export job finished | Crisp, melodic two-tone bell (520Hz + 659Hz) | Captures attention without demanding immediate eye focus on the active browser tab |
| **Excluded (Mute)** | Keystroke entry, scrolling, routine table hover, fast pagination | **MUTE (Zero Audio)** | High-frequency interactions become noise pollution when paired with audio |

---

## 4. Technical Implementation Patterns

Web audio feedback must remain lightweight, low-latency, and zero-dependency.

### 4.1 Lightweight Web Audio API Synthesizer (Zero Network Asset Latency)
Synthesizing pure sine and triangle waveforms in memory eliminates asset network requests and decode latencies:

```typescript
// apps/frontend/shared/audio/interface-audio.ts

class InterfaceAudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.2; // Gentle default volume

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  public playSuccess(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    // Ascending major third (C5 -> E5)
    osc.frequency.setValueAtTime(523.25, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(this.volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.25);
  }

  public playError(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    // Low, soft downward thunk (140Hz -> 80Hz)
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.14);

    gain.gain.setValueAtTime(this.volume * 0.9, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  public playClick(): void {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(this.volume * 0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
  }
}

export const interfaceAudio = new InterfaceAudioService();
```

---

## 5. Addressing Common Misconceptions

1. **"Users will find it annoying"**: Users dislike intrusive, loud, unexpected background music. Gentle, low-volume, contextual audio confirmations (e.g. Apple Pay chime, Slack knock) provide satisfaction and clarity.
2. **"It is inaccessible"**: Sound is exclusively an additive enhancement layer. Visual equivalents are always rendered.
3. **"It introduces heavy dependencies"**: As demonstrated above, the Web Audio API enables zero-asset, procedural sound in less than 50 lines of code.
4. **"It is unprofessional"**: Native desktop environments (macOS, Windows, iOS) utilize audio feedback across system events. Enterprise applications benefit from clear acoustic confirmations.

---

## 6. Implementation Roadmap: Starting Small

1. **Phase 1 (Single Interaction)**: Implement audio exclusively for primary form confirmations (e.g., student enrollment or fee invoice creation).
2. **Phase 2 (Settings Integration)**: Provide user-facing sound preference controls with persistent local storage state.
3. **Phase 3 (Subtle Tactility)**: Selectively introduce soft clicks on primary action buttons and floating action buttons (FABs).
4. **Phase 4 (System Alerts)**: Pair background notification popups with melodic two-tone chimes.
