# A Living Manual for the Laws of UX: Cognitive Psychology in Interface Design

Authoritative engineering and design manual for applying foundational cognitive psychology principles—Fitts's Law, Hick's Law, Miller's Law, the Doherty Threshold, and Postel's Law—across the SNP-SMS platform.

---

## 1. Core Human-Computer Interaction Philosophy

Interfaces feel intuitive not because they follow arbitrary design trends, but because they align with human cognitive architecture and biological perception:
1. **Perceptual Realism**: Design for how the human brain actually processes sensory stimuli, not how an engineering specification assumes a user thinks.
2. **Forgiveness Over Precision**: Maximize spatial and temporal target tolerance so interaction feels effortless.
3. **Cognitive Load Minimization**: Ruthlessly chunk information and curate options to respect working memory limitations.
4. **Velocity Parity**: Maintain sub-400ms feedback loops to sustain flow state.

---

## 2. The 5 Foundational Laws of UX

### 2.1 Fitts's Law: Spatial & Temporal Target Acquisition
* **Mathematical Formulation**:
  $$T = a + b \log_2\left(\frac{2D}{W}\right)$$
  Where $T$ is movement time, $D$ is distance to target, and $W$ is target width along the motion axis.
* **Spatial Target Expansion**:
  * The smaller a target, the more fine motor control and visual correction are required.
  * **Hit-Area Expansion via `::before`**: Compact icons ($\le 24\text{px}$) must expand their interactive touch target to $\ge 44 \times 44\text{px}$ using invisible pseudo-elements:
    ```css
    .icon-button {
      position: relative;
    }
    .icon-button::before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      min-width: 44px;
      min-height: 44px;
    }
    ```
* **Temporal Target Expansion ("Coyote Time")**:
  * Borrowed from precision platforming (e.g. *Celeste*), where a jump input remains valid for a few frames after walking off an edge.
  * In web forms and dropdowns, preserve input validity for $100\text{ms}$ after a cursor leaves a hover boundary, preventing accidental menu closure.

---

### 2.2 Hick's Law: Decision Time & Cognitive Load
* **Mathematical Formulation**:
  $$T = b \log_2(n + 1)$$
  Where $T$ is reaction time and $n$ is the number of equiprobable choices.
* **The Logarithmic Trap**: Choice fatigue escalates logarithmically. Jumping from 2 to 4 options is manageable; jumping from 8 to 16 causes noticeable cognitive stalling.
* **Implementation Principle — Progressive Disclosure**:
  * Never overwhelm users with 50 options simultaneously.
  * Surface primary actions first ($3$ to $5$ high-frequency defaults).
  * Defer advanced configurations behind curated filters, expandable sheets, or secondary search inputs.

---

### 2.3 Miller's Law: Working Memory & Information Chunking
* **Psychological Baseline**: The human working memory can hold approximately $7 \pm 2$ discrete chunks of information simultaneously (George A. Miller, 1956).
* **The Necessity of Chunking**: Unstructured blobs of characters overwhelm short-term retention. Segmenting identical data into semantic groups transforms unreadable noise into immediate comprehension:
  * **Phone Numbers**: `4158675309` &rarr; `(415) 867-5309`
  * **Payment Cards**: `4532015112830366` &rarr; `4532 0151 1283 0366`
  * **National Identifiers / Serial Numbers**: `AX7B2K9M4R` &rarr; `AX7B-2K9M-4R`
  * **Currency / Financial Ledgers**: `1234567890.00` &rarr; `$1,234,567,890.00`
* **Form Layout Rule**: Group dense student registration forms into clear, titled visual cards of $\le 5$ fields per section.

---

### 2.4 Doherty Threshold: Perceived Speed & Flow State
* **The 400ms Boundary (IBM Research, 1979)**:
  * Productivity soars when a computer and user interact at a pace where neither waits on the other ($\le 400\text{ms}$).
  * **$<100\text{ms}$**: Perceived as instantaneous physical response; the button feels like an extension of the user's hand.
  * **$100\text{ms}$ to $400\text{ms}$**: Fluid system acknowledgment; flow state is preserved.
  * **$>400\text{ms}$**: User detects cognitive lag; rhythm is broken.
  * **$>2000\text{ms}$**: System is perceived as unresponsive or broken.
* **Architectural Remedies for High-Latency Operations**:
  1. **Optimistic UI Updates**: Immediately render the intended outcome on client state before the server response returns.
  2. **Skeleton Shimmers**: Replace blank screens with pulsing luminance surfaces during network hydration.
  3. **Instant Interactive Feedback**: Trigger active press scales (`scale(0.96)`) and sound transients on `pointerdown` rather than waiting for `pointerup`.

---

### 2.5 Postel's Law: The Robustness Principle in Inputs
* **The Principle (Jon Postel, RFC 761)**:
  > *"Be conservative in what you send, be liberal in what you accept."*
* **Application to Interface Inputs**:
  * Users think in human language, not SQL or ISO strings.
  * **Date Normalization**: An input field should accept `"jan 15 2026"`, `"1/15/26"`, `"15-01-2026"`, or `"tomorrow"` and normalize internally to `2026-01-15T00:00:00.000Z`.
  * **Phone Normalization**: Accept `+855 12 345 678`, `012345678`, or `012-345-678` and format strictly for storage.
  * **Sanitization Rule**: Validate generously without wiping valid user intent; format strictly before network dispatch.

---

## 3. Engineering Decision Matrix

| Law | Design Implementation in SNP-SMS | Technical Standard |
| :--- | :--- | :--- |
| **Fitts's Law** | `::before` hit-target expansion for all icon buttons | Touch targets $\ge 44 \times 44\text{px}$ |
| **Hick's Law** | Progressive disclosure on multi-step forms | $\le 5$ options visible per primary tier |
| **Miller's Law** | Visual grouping of financial ledgers & student IDs | Segment data into 3–4 character chunks |
| **Doherty Threshold** | Optimistic UI mutations and sub-300ms micro-interactions | Feedback within $\le 100\text{ms}$, completions $\le 400\text{ms}$ |
| **Postel's Law** | Multi-format input normalization parsers | Flexible user input parsed into ISO DTOs |

---

## 4. Architectural References

1. **Fitts, P. M. (1954)**: *The information capacity of the human motor system in controlling the amplitude of movement*.
2. **Hick, W. E. (1952)**: *On the rate of gain of information*.
3. **Miller, G. A. (1956)**: *The magical number seven, plus or minus two: Some limits on our capacity for processing information*.
4. **Doherty, W. J., & Kelisky, R. P. (1979)**: *Managing VM/CMS systems for user effectiveness* (IBM Systems Journal).
5. **Postel, Jon (1981)**: *RFC 761: Transmission Control Protocol Robustness Principle*.
6. **Yablonski, Jon**: *Laws of UX: Using Psychology to Design Better Products & Services*.
