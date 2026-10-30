# SNP-SMS Linear Blur & Glassmorphism Engineering Manual

This manual provides the step-by-step mathematical construction and CSS/Tailwind implementation standard for progressive linear blur overlays and frosted glass cards across the SNP-SMS platform.

---

## 1. The 7-Step Progressive Linear Blur Construction

```
Step 1: Frame Container        -> Bound container with explicit aspect ratio & overflow-hidden.
Step 2: Base Background Media  -> High-resolution image, video canvas, or graphic texture.
Step 3: Foreground Text Box    -> Bottom-anchored rectangular container for titles & metrics.
Step 4: Dual Layer Separation  -> Layer A: linear gradient scrim; Layer B: backdrop-filter blur.
Step 5: Alpha Mask Overlay     -> Mask blur layer with linear alpha gradient (feathered transition).
Step 6: Pinned Bottom Stage    -> Position composite overlay at card footer with high-contrast text.
Step 7: Parameter Tuning       -> Fine-tune blur radius (12-24px), opacity stops, and WCAG contrast.
```

---

## 2. The Core Problem with Standard Gradients vs. Linear Blur

* **Regular Linear Gradient**: A simple black-to-transparent gradient creates muddy colors and dulls vibrant background details without softening visual sharpness.
* **Progressive Linear Blur (Frosted Glass)**: Gradually increases the blur radius from `0px` (clear view of imagery) to `24px` (creamy frosted base) at the bottom. This achieves maximum text legibility while preserving the rich, atmospheric color frequencies of the background media.

---

## 3. Production CSS & Tailwind Implementation

```html
<!-- Main Image / Media Frame -->
<div className="relative overflow-hidden rounded-3xl border border-slate-200/80 bg-slate-100 shadow-xs">
  <!-- Base Background Image -->
  <img
    src="/images/campus-laboratory.jpg"
    alt="Siem Reap Campus Laboratory"
    className="h-80 w-full object-cover"
  />

  <!-- Progressive Linear Blur & Scrim Overlay -->
  <div
    className="absolute inset-x-0 bottom-0 flex flex-col justify-end p-6 pt-16 text-white"
    style={{
      background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, rgba(15, 23, 42, 0.4) 60%, transparent 100%)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      WebkitMaskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
      maskImage: 'linear-gradient(to top, black 60%, transparent 100%)',
    }}
  >
    <!-- High-Legibility Typography -->
    <span className="font-mono text-[11px] font-bold text-[#E3E7FC] uppercase tracking-wider">
      Science Wing Telemetry
    </span>
    <h3 className="mt-1 font-sans text-xl font-black text-white">
      Robotics & IoT Laboratory
    </h3>
    <p className="mt-1 font-sans text-xs text-slate-200 line-clamp-2">
      Live active student sensor telemetry stream connected to central replica set.
    </p>
  </div>
</div>
```

---

## 4. Parameter Tuning & Contrast Guardrails

* **Backdrop Filter Blur**: Optimal radius is between `12px` and `24px`. Going above `32px` causes GPU rasterization spikes on low-end mobile devices.
* **Mask Gradient Feathering**: Always feather the mask over at least `40px` (or `30%` of container height) to avoid harsh geometric cut-off lines.
* **Text Legibility**: White text placed over the linear blur overlay must maintain a minimum `4.5:1` contrast ratio against the darkest point of the gradient.
