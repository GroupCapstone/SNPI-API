'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandColorsPalette } from './brand-colors-palette';
import { BrandAssetPlaceholder } from './brand-asset-placeholder';
import { Check } from '@/components/icons';

export function BrandStandardsView() {
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
            <span className="font-bold text-slate-900">Standards</span>
          </div>

          <div className="mt-4 max-w-3xl space-y-2">
            <h1 className="font-sans text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Brand Standards Specification
            </h1>
            <p className="font-sans text-sm text-slate-600 sm:text-base">
              The authoritative technical manual governing Foundations, Logos, Design Language, and Handbooks.
              Strictly restricted to the Royal Blue palette and Sora typography.
            </p>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-[1560px] space-y-16 px-4 pt-12 sm:px-6 lg:px-8">
        {/* 1. FOUNDATIONS */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Core Architecture</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              1. Foundations
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {/* History */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.1 HISTORY
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">System Lineage</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                SNPI-SMS emerged from institutional requirements for high-availability student tracking.
                Evolved into a 7-layer modular monolith coordinating 47 domains with MongoDB replica sets.
              </p>
            </div>

            {/* Brand platform */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.2 BRAND PLATFORM
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">Mission &amp; Vision</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                To build unbreakable educational software infrastructure. Zero downtime, zero shadow clutter,
                strict multi-tenant scoping, and cryptographic auditability for every transaction.
              </p>
            </div>

            {/* Brand personality */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.3 BRAND PERSONALITY
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">Aerospace Precision</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                Technical, disciplined, and modern. Chamfered 45-degree cyber armor plates, double-seam dividers,
                and luminous Royal Blue feedback create an interface that feels like high-tech avionics.
              </p>
            </div>

            {/* The hat / Brand mark */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.4 THE HAT / BRAND MARK
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">Official Mark Standards</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                The circular insignia is the primary graphic identifier. Clear space must equal at least 50%
                of the mark&apos;s diameter on all sides. Never alter, rotate, skew, or outline the mark.
              </p>
            </div>

            {/* Brand architecture */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.5 BRAND ARCHITECTURE
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">Monolithic Master Brand</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                All 47 domains (Attendance, Admissions, Finance, Exams) sit directly under the SNPI-SMS parent
                brand banner. Sub-products do not carry isolated visual identities.
              </p>
            </div>

            {/* Naming & trademarks */}
            <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-3">
              <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10px] font-bold text-[#0056FF]">
                1.6 NAMING &amp; TRADEMARKS
              </span>
              <h3 className="font-sans text-lg font-bold text-slate-950">Nomenclature Rules</h3>
              <p className="font-sans text-xs text-slate-600 leading-relaxed">
                Official name: &quot;SNPI-SMS&quot; (hyphenated, uppercase). Short form: &quot;SNPI&quot;. Academic institution:
                &quot;SNP International School&quot;. Never write &quot;SnpiSms&quot;, &quot;snp-sms&quot; in user-facing copy.
              </p>
            </div>
          </div>
        </section>

        {/* 2. LOGOS */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Asset Hierarchy</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              2. Official Logo Family
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <BrandAssetPlaceholder
              title="Red Hat / SNPI Primary Logo"
              category="LOGOS"
              aspectRatio="16:9"
              description="Master brand horizontal lockup combining circular insignia with bold uppercase wordmark. Ideal for desktop headers and print stationery."
              guidelines={['Primary Lockup', 'Clear Space 32px', 'Royal Blue #0056FF']}
            />

            <BrandAssetPlaceholder
              title="Product Logos &amp; Module Emblems"
              category="LOGOS"
              aspectRatio="16:9"
              description="Dedicated geometric vector emblems for core systems: Attendance, Gradebook, Financial Tuition, and Timetable."
              guidelines={['24x24px Stroke', 'Bare Icon Standard', 'Zero Colored Box']}
            />

            <BrandAssetPlaceholder
              title="Universal Logos &amp; App Icons"
              category="LOGOS"
              aspectRatio="16:9"
              description="Compact app launcher icons, browser favicons, and PWA manifest assets optimized for 16px to 512px raster outputs."
              guidelines={['Vector Master', 'Pixel-Aligned', 'White Background']}
            />

            <BrandAssetPlaceholder
              title="Initiative &amp; Research Logos"
              category="LOGOS"
              aspectRatio="16:9"
              description="Specialized sub-marks for student open-source software clubs, AI research labs, and academic hackathons."
              guidelines={['Parent Endorsement', 'High Contrast']}
            />

            <BrandAssetPlaceholder
              title="Event &amp; Conference Logos"
              category="LOGOS"
              aspectRatio="16:9"
              description="Commemorative annual badges, speaker stage passes, and event credential lockups with stamped year identifiers."
              guidelines={['Event Lockup', 'Strict Palette Only']}
            />

            <BrandAssetPlaceholder
              title="Endorsement &amp; Accreditation Logos"
              category="LOGOS"
              aspectRatio="16:9"
              description="Co-branded certification marks for government education ministries, academic accreditors, and enterprise sponsors."
              guidelines={['Equal Clearance', 'Center Divider']}
            />
          </div>
        </section>

        {/* 3. DESIGN LANGUAGE */}
        <section className="space-y-8">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Visual DNA</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              3. Design Language
            </h2>
          </div>

          {/* Color Palette from Image */}
          <BrandColorsPalette />

          {/* Fonts & Typography */}
          <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-6">
            <div className="border-b border-[#CAD3F5] pb-3">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">Typography</span>
              <h3 className="font-sans text-xl font-bold text-slate-950">
                Google Sora Geometric Typography
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <h4 className="font-sans text-sm font-bold text-slate-900 uppercase">Hierarchical Rules</h4>
                <ul className="space-y-2 font-sans text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>H1: Sora 800 ExtraBold, letter-spacing -0.025em</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>H2: Sora 800 ExtraBold, letter-spacing -0.02em</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>H3 &amp; H4: Sora 700 Bold, line-height 1.3</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>Body: Sora 400 Regular, 15-16px, line-height 1.65</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="size-3.5 text-[#0056FF]" />
                    <span>Buttons &amp; Badges: Sora 700 Bold, uppercase tracking +0.025em</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="font-sans text-sm font-bold text-slate-900 uppercase">KaTeX Math &amp; Code Syntax</h4>
                <p className="font-sans text-xs text-slate-600 leading-relaxed">
                  Monospace text must use JetBrains Mono or SF Mono with Royal Blue (#0056FF) syntax highlights.
                  Mathematical equations use KaTeX standard notation with dollar-escaping protocols.
                </p>
                <div className="rounded-[4px] bg-[#E3E7FC]/40 p-3 font-mono text-xs text-slate-900 border border-[#CAD3F5]">
                  E = mc^2 &middot; f(x) = \int_0^\infty e^(-x) dx
                </div>
              </div>
            </div>
          </div>

          {/* Photography & 3D Illustration */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BrandAssetPlaceholder
              title="Authentic Educational Photography"
              category="PHOTOGRAPHY"
              aspectRatio="16:9"
              description="Real faculty and students working in classrooms, computer laboratories, and collaborative workspaces. No posed models or exaggerated smiles."
              guidelines={['Authentic Subjects', 'Soft Natural Lighting', 'Royal Blue Ambient']}
            />
            <BrandAssetPlaceholder
              title="3D Cyber Mecha Illustration"
              category="3D ART"
              aspectRatio="16:9"
              description="Low-poly and chamfered mecha hardware representations. Strict compliance with the 5 approved brand colors with subtle blue glow highlights."
              guidelines={['45-Degree Chamfers', 'Clean Metallic Finish', 'Zero Shadow Clutter']}
            />
          </div>

          {/* Iconography */}
          <div className="rounded-[4px] border border-[#CAD3F5] bg-white p-6 space-y-4">
            <div className="border-b border-[#CAD3F5] pb-3">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">Symbol Systems</span>
              <h3 className="font-sans text-xl font-bold text-slate-950">
                Iconography &middot; Icons, Technology Icons, UI Icons
              </h3>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-[4px] border border-[#CAD3F5] p-4 bg-[#E3E7FC]/20">
                <h4 className="font-sans text-sm font-bold text-slate-900">Bare UI Icons</h4>
                <p className="font-sans text-xs text-slate-600 mt-1">
                  Icons sit bare on cards without colorful square background boxes for maximum clean elegance.
                </p>
              </div>
              <div className="rounded-[4px] border border-[#CAD3F5] p-4 bg-[#E3E7FC]/20">
                <h4 className="font-sans text-sm font-bold text-slate-900">Technology Icons</h4>
                <p className="font-sans text-xs text-slate-600 mt-1">
                  Approved monochrome stack emblems for MongoDB, TypeScript, Next.js, Docker, and Express.
                </p>
              </div>
              <div className="rounded-[4px] border border-[#CAD3F5] p-4 bg-[#E3E7FC]/20">
                <h4 className="font-sans text-sm font-bold text-slate-900">Zero Emoji Mandate</h4>
                <p className="font-sans text-xs text-slate-600 mt-1">
                  All status badges use crisp textual codes ([PASSED], [FAILED], [WARNING]) rather than emojis.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. HANDBOOKS */}
        <section className="space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Operational Guidelines</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950">
              4. Brand Handbooks
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BrandAssetPlaceholder
              title="Digital Badges Handbook"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Micro-credential badge geometries, cryptographic SHA-256 signatures, and role level colors."
              guidelines={['OpenBadges 2.0', 'Vector SVG']}
            />
            <BrandAssetPlaceholder
              title="Employee Resource Groups"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Guidelines for establishing internal clubs, sports associations, and technical interest groups."
              guidelines={['Approved Sub-Mark', 'Official Lockup']}
            />
            <BrandAssetPlaceholder
              title="Hybrid Style Co-Branding"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Standards for joint initiatives with the Ministry of Education, university partners, and NGO donors."
              guidelines={['Co-Branding Ratio', 'Neutral Divider']}
            />
            <BrandAssetPlaceholder
              title="Partner Marketing Guide"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Press release formats, website badges, and conference sponsorship collateral rules."
              guidelines={['Partner Tier Badges', 'Clear Zone 48px']}
            />
            <BrandAssetPlaceholder
              title="Product Branding Handbook"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Rules for naming features, allocating sub-routes, and formatting dashboard breadcrumbs."
              guidelines={['Feature Naming', 'Zero Jargon']}
            />
            <BrandAssetPlaceholder
              title="Red Hat &amp; SNPI Developer Branding"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Developer documentation UI standards, CLI outputs, and GitHub repository card guidelines."
              guidelines={['Code Snippets', 'Cyber Armor Dock']}
            />
            <BrandAssetPlaceholder
              title="Swag &amp; Merchandise Guide"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Physical merchandise standards: apparel, stainless steel tumblers, stationery, and backpacks."
              guidelines={['Pantone Royal Blue', 'Durable Print Spec']}
            />
            <BrandAssetPlaceholder
              title="E-Resources &amp; Digital Assets"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Token dictionaries, Figma component libraries, and downloadable vector resource archives."
              guidelines={['Figma Tokens', 'JSON Data Contracts']}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
