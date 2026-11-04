# SNP-SMS Production Deploy & Pre-Launch Quality Gate Checklist

This manual codifies the authoritative 20-point pre-flight verification checklist that must be audited and verified before any deployment, release checkpoint, or production rollout in the SNP-SMS platform.

---

## The 20-Point Production Release Matrix

| # | Inspection Domain | Verification Criteria | SNP-SMS Standard |
|---|---|---|---|
| **01** | **Mobile Responsive** | Fluid breakpoints across mobile (375px+), tablet (768px+), desktop (1280px+) | Zero horizontal overflow, touch target padding >=44px, adaptive layout |
| **02** | **Clear CTAs** | Unambiguous primary visual hierarchy per screen | Maximum one primary button per card, clear action verbs, no ambiguity |
| **03** | **SEO Setup** | Canonical URLs, dynamic sitemaps, robots.txt | Next.js Metadata API, automated robots.txt generation, JSON-LD schema |
| **04** | **Meta Tags** | Open Graph, Twitter Cards, localized titles/descriptions | OpenGraph images (1200x630), multi-tenant metadata resolution |
| **05** | **Fast Loading** | Time to First Byte (TTFB) < 200ms, first paint < 1.0s | Edge caching, ISR/SSG where applicable, compression enabled |
| **06** | **Image Optimization** | Modern responsive formats (WebP/AVIF), exact dimensions | Next.js `next/image` with responsive `sizes`, zero unoptimized layouts |
| **07** | **Alt Text** | Semantic descriptions on all non-decorative visual assets | Informative `alt` attributes, empty `alt=""` only for decorative graphics |
| **08** | **Broken Links** | Zero 404 or dead href targets across navigation and docs | Automated link crawlers, verified internal anchors, external target guards |
| **09** | **404 Page** | Branded, helpful, self-recovering error routing | Friendly message, search input, return home CTA, zero unstyled fallbacks |
| **10** | **Favicon & Icons** | Complete PWA icon suite (SVG, 32x32, 180x180 Apple touch) | Webmanifest linkage, dark/light dynamic SVG favicon support |
| **11** | **Form Validation** | Dual client and server input sanitization | Zod schemas, inline error boundaries, immediate field feedback |
| **12** | **Error States** | Graceful component degradation and API outage handling | ErrorBoundary fallbacks, toast alerts, retry buttons, no white screens |
| **13** | **Accessibility (a11y)** | WCAG 2.1 AA keyboard navigation, ARIA semantics | Radix UI primitives, focus indicators (`focus-visible:ring-2`), screen reader labels |
| **14** | **Color Contrast** | Mathematical contrast ratio `(L1 + 0.05) / (L2 + 0.05)` | >=4.5:1 normal text, >=3.0:1 large text and UI components |
| **15** | **Analytics & Telemetry** | Privacy-conscious user event tracking and APM | Client error telemetry, server request metrics, opt-in analytics |
| **16** | **Privacy Policy & Terms** | Compliant legal documentation, data disclosures | Up-to-date privacy policy, cookie/session disclosures, GDPR/local compliance |
| **17** | **Secure APIs** | Constant-time auth checks, RBAC scoping, rate limiting | JWT verification, `schoolId` multi-tenant filters, `strictQuery: true` |
| **18** | **Core Web Vitals (CWV)** | LCP <= 2.5s, INP <= 200ms, CLS <= 0.1 | Font preloading, layout dimension reservation, minimal main-thread blocking |
| **19** | **Cross-Browser Testing** | Parity across Chromium, WebKit (Safari), and Gecko (Firefox) | Safari CSS prefix verification, WebKit touch compatibility, flexbox checks |
| **20** | **Final Q&A Verification** | End-to-end smoke verification across primary user flows | Verification table reporting, zero regressions, all checks green |
