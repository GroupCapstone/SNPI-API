'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandAssetPlaceholder } from './brand-asset-placeholder';

export function BrandResourcesView() {
  return (
    <div className="w-full bg-white pb-24 text-slate-900">
      {/* Top Breadcrumb & Header Banner */}
      <section className="border-b border-[#CAD3F5] bg-[#E3E7FC]/40 py-10">
        <div className="mx-auto max-w-[1560px] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-500">
            <Link href="/brand" className="hover:text-[#0056FF]">
              Brand Hub
            </Link>
            <span>/</span>
            <span className="font-bold text-slate-900">Resources</span>
          </div>

          <div className="mt-4 max-w-3xl space-y-2">
            <h1 className="font-sans text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Brand Resources &amp; Downloads
            </h1>
            <p className="font-sans text-sm text-slate-600 sm:text-base">
              Download official brand assets, turnkey presentation decks, print templates, digital badge vectors,
              and design token JSONs.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-[1560px] space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Master Asset Packs */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Official Vectors</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              Master Asset Downloads
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrandAssetPlaceholder
              title="Official Master Logos Archive (.ZIP)"
              category="DOWNLOAD"
              aspectRatio="16:9"
              description="Includes SVG, EPS, PDF, and high-resolution PNG lockups in Royal Blue, Black, White, and Monochrome."
              guidelines={['Vector Scalable', 'Print & Digital Masters']}
            />
            <BrandAssetPlaceholder
              title="Design Tokens &amp; Color Specifications (.JSON)"
              category="DOWNLOAD"
              aspectRatio="16:9"
              description="Complete token dictionary containing HEX, RGB, HSL, and CSS variables for Tailwind CSS v4."
              guidelines={['Mathematical Tokens', 'Tailwind Config']}
            />
            <BrandAssetPlaceholder
              title="Google Sora Font Package"
              category="DOWNLOAD"
              aspectRatio="16:9"
              description="Open-source variable typography files (TTF/WOFF2) with full Latin and extended glyph support."
              guidelines={['Variable Weights 100-800', 'Web & Desktop']}
            />
          </div>
        </section>

        {/* Turnkey Templates */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Turnkey Collateral</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              Templates &amp; Presentations
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BrandAssetPlaceholder
              title="16:9 Keynote &amp; PowerPoint"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="Master slide decks with 25+ layout designs, data charts, and cyber armor title slides."
              guidelines={['Widescreen 16:9', 'PPTX / Keynote']}
            />
            <BrandAssetPlaceholder
              title="A4 Formal Letterhead &amp; Memo"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="Administrative correspondence templates for institutional announcements and official notices."
              guidelines={['Print Ready A4', 'DOCX / Vector PDF']}
            />
            <BrandAssetPlaceholder
              title="Certificate of Completion"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="Academic achievement and graduation certificate templates with cryptographic seal spaces."
              guidelines={['High-Res 300DPI', 'Embossed Standard']}
            />
            <BrandAssetPlaceholder
              title="Social Card Announcement Kit"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="1200x630px social media card templates for LinkedIn, Twitter, and Facebook posts."
              guidelines={['Figma Component', 'PNG Export']}
            />
          </div>
        </section>

        {/* E-Resources & Swag */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Swag &amp; Merchandise</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              Merchandise Specs &amp; E-Resources
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BrandAssetPlaceholder
              title="Official Team Hoodie &amp; Apparel"
              category="SWAG"
              aspectRatio="16:9"
              description="Heavyweight organic cotton hoodie in Royal Blue (#0056FF) with precision white chest embroidery."
              guidelines={['Embroidery Spec', 'Pantone Royal Blue']}
            />
            <BrandAssetPlaceholder
              title="Laser-Engraved Metal Tumbler"
              category="SWAG"
              aspectRatio="16:9"
              description="Matte black stainless steel thermal tumbler with subtle etched brand insignia and serial stamp."
              guidelines={['Laser Etched', 'Food-Grade Steel']}
            />
            <BrandAssetPlaceholder
              title="Die-Cut Vinyl Stickers Pack"
              category="SWAG"
              aspectRatio="16:9"
              description="Weatherproof matte vinyl stickers of the brand mark, mecha armor console, and API ready badges."
              guidelines={['UV-Resistant', 'Matte Finish']}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
