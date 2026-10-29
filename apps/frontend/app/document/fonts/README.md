# Docs & Library Subdomain Custom Fonts

This directory contains custom font assets loaded exclusively for `docs.snpi.edu.kh` (`/document/*`) using Next.js `next/font/local`.

---

## Folder Hierarchy & Placement Guide

```
apps/frontend/
├── app/
│   └── document/
│       ├── fonts/
│       │   ├── inter.ttf          # Primary TrueType font for docs
│       │   └── README.md          # Architecture guide
│       ├── layout.tsx             # Scoped font loader (next/font/local)
│       ├── page.tsx               # API Documentation
│       └── design-system/
│           └── page.tsx           # Design Library & Brand Blueprint
└── public/
    └── fonts/
        └── docs/
            └── inter.ttf          # Static fallback copy
```

---

## How It Works (Strict Route Isolation)

1. **Scoped Loading**: `apps/frontend/app/document/layout.tsx` imports `localFont` from `next/font/local`:

   ```tsx
   import localFont from 'next/font/local';

   const docsInter = localFont({
     src: './fonts/inter.ttf',
     variable: '--font-docs-inter',
     display: 'swap',
   });
   ```

2. **Zero Pollution of Admin Dashboard**:
   - The CSS variable `--font-docs-inter` and scoped `--font-sans` override are attached **strictly to the root container of `DocumentLayout`**.
   - Admin routes (`/(dashboard)/*`) and authentication (`/(auth)/*`) continue using system/Google Sans fonts in `apps/frontend/app/globals.css`.

3. **Adding a New Custom Font for Docs**:
   - Place your `.ttf`, `.woff2`, or `.otf` file in `apps/frontend/app/document/fonts/`.
   - Update `src` in `apps/frontend/app/document/layout.tsx`.
   - Next.js automatically self-hosts, preloads, and eliminates layout shift (CLS = 0).
