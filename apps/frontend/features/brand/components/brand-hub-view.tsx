'use client';

import * as React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/shared/brand-mark';
import { BrandColorsPalette } from './brand-colors-palette';
import { BrandAssetPlaceholder } from './brand-asset-placeholder';
import { BrandJumpNav } from './brand-jump-nav';
import { Sparkles, Bookmark, Layers, Download, ArrowRight } from '@/components/icons';

export function BrandHubView() {
  return (
    <div className="w-full bg-white pb-24 text-slate-900">
      {/* 1. Hero Section with Midnight Surge / Royal Blue theme */}
      <section
        className="relative overflow-hidden border-b border-[#CAD3F5] text-white"
        style={{ background: 'linear-gradient(135deg, #000B26 0%, #001F6B 50%, #0056FF 100%)' }}
      >
        <div className="relative mx-auto max-w-[1560px] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 rounded-[4px] border border-white/20 bg-white/10 px-3 py-1 font-mono text-xs font-bold tracking-wider uppercase backdrop-blur-md">
              <Sparkles className="size-3.5 text-[#AEC2FF]" />
              <span>Official Brand Standards &amp; Identity System</span>
            </div>
            <h1 className="font-sans text-3xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              SNPI-SMS Brand Hub
            </h1>
            <p className="font-sans text-base leading-relaxed text-blue-100 sm:text-lg">
              The single source of truth for the SNPI-SMS brand identity. Explore foundational
              rules, the Royal Blue palette, typography, logo lockups, marketing templates, and
              handbooks.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/brand/standards"
                className="inline-flex items-center gap-2 rounded-[4px] bg-white px-5 py-2.5 font-sans text-xs font-black tracking-wider text-[#0056FF] uppercase transition-all duration-150 hover:bg-[#E3E7FC] active:scale-[0.98]"
              >
                <Bookmark className="size-4" />
                <span>Explore Standards</span>
              </Link>
              <Link
                href="/brand/resources"
                className="inline-flex items-center gap-2 rounded-[4px] border border-white/30 bg-white/10 px-5 py-2.5 font-sans text-xs font-black tracking-wider text-white uppercase backdrop-blur-md transition-all duration-150 hover:bg-white/20 active:scale-[0.98]"
              >
                <Download className="size-4" />
                <span>Brand Resources &amp; Downloads</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Jump to Section Bar */}
      <BrandJumpNav />

      {/* 3. Main Content Grid */}
      <div className="mx-auto max-w-[1560px] space-y-20 px-4 pt-12 sm:px-6 lg:px-8">
        {/* SECTION: Featured */}
        <section id="featured" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Curated Highlights
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Featured Brand Stories
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrandAssetPlaceholder
              title="2026 Aerospace Mecha Design Wave"
              category="FEATURED"
              aspectRatio="16:9"
              description="A futuristic design language defined by 45-degree chamfers, double-seam dividers, and Royal Blue luminous glows."
              guidelines={['Brand Mark', 'Royal Blue #0056FF', 'Sora Bold']}
            />
            <BrandAssetPlaceholder
              title="Unified Modular Monolith Brand Portal"
              category="FEATURED"
              aspectRatio="16:9"
              description="Unifying all 47 academic domain modules under a coherent visual architecture and zero-shadow elevation ladder."
              guidelines={['System Portal', 'Flat Design', 'Zero Shadows']}
            />
            <BrandAssetPlaceholder
              title="Next-Generation Academic Credentials"
              category="FEATURED"
              aspectRatio="16:9"
              description="Cryptographically signed transcripts, student identity cards, and tamper-resistant digital badges."
              guidelines={['Digital Credentials', 'Tamper-Proof', 'Vector Standard']}
            />
          </div>
        </section>

        {/* SECTION: Events */}
        <section id="events" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Milestones &amp; Gatherings
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Events &amp; Summits
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BrandAssetPlaceholder
              title="SNPI Annual Developer Summit"
              category="EVENTS"
              aspectRatio="16:9"
              description="Stage backdrops, keynote decks, lanyard cards, and motion reels following strict Royal Blue standards."
              guidelines={['Stage LED 16:9', 'Clear Space 48px', 'Pure White #FFFFFF']}
            />
            <BrandAssetPlaceholder
              title="EdTech Architecture Hackathon"
              category="EVENTS"
              aspectRatio="16:9"
              description="Digital hackathon banners, certificates, badge ribbons, and live streaming overlay standards."
              guidelines={['Stream 1080p', 'Midnight Surge Gradient', 'Zero Emojis']}
            />
          </div>
        </section>

        {/* SECTION: Templates */}
        <section id="templates" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Turnkey Collateral
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Brand Templates
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BrandAssetPlaceholder
              title="Executive Slide Deck"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="16:9 widescreen presentation slides in Royal Blue, Soft Lavender, and Sora typography."
              guidelines={['16:9 Widescreen', '20+ Master Layouts']}
            />
            <BrandAssetPlaceholder
              title="Official Letterhead &amp; Memo"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="Print-ready A4 formal correspondence with authenticated header mark and tamper-proof footer."
              guidelines={['A4 / US Letter', 'Vector Print PDF']}
            />
            <BrandAssetPlaceholder
              title="Social Announcement Cards"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="High-contrast 1200x630px social cards for LinkedIn, Twitter, and news releases."
              guidelines={['1200x630px', 'Safe Margin 64px']}
            />
            <BrandAssetPlaceholder
              title="Academic Certificates"
              category="TEMPLATES"
              aspectRatio="4:3"
              description="Official completion diplomas featuring guilloche security borders and embossed seal."
              guidelines={['Landscape A4', 'High Resolution 300DPI']}
            />
          </div>
        </section>

        {/* SECTION: Ads & marketing */}
        <section id="ads-marketing" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Commercial Visibility
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Ads &amp; Marketing
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrandAssetPlaceholder
              title="Display Banner Ads (IAB Standards)"
              category="MARKETING"
              aspectRatio="16:9"
              description="Leaderboard (728x90), Medium Rectangle (300x250), and Half Page (300x600) ad formats."
              guidelines={['IAB Verified', 'Under 150KB', 'Royal Blue CTA']}
            />
            <BrandAssetPlaceholder
              title="Campus Outdoor Billboards"
              category="MARKETING"
              aspectRatio="16:9"
              description="Ultra-high contrast typography, minimal copy, and oversized logo placement for highway viewing."
              guidelines={['CMYK Print Spec', 'Minimum 150DPI Scale']}
            />
            <BrandAssetPlaceholder
              title="Digital Video Pre-Rolls (6s &amp; 15s)"
              category="MARKETING"
              aspectRatio="16:9"
              description="Vertical and horizontal short-form video bumpers with sonic audio brand watermark."
              guidelines={['1080x1920 & 1920x1080', 'Clean Outro Tag']}
            />
          </div>
        </section>

        {/* SECTION: Writing */}
        <section id="writing" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Editorial &amp; Tone
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Brand Voice &amp; Writing Guidelines
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-3 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-6">
              <h4 className="font-sans text-base font-bold text-slate-950 uppercase">
                Authoritative &amp; Direct
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Write concise, clear sentences. Avoid buzzwords, fluff, and filler. Speak with
                technical confidence and rigorous accuracy.
              </p>
              <div className="rounded-[2px] border border-[#CAD3F5] bg-white p-2.5 font-mono text-[11px] text-slate-700">
                Do: &quot;Deploy API endpoints with tenant-scoped JWT auth.&quot;
              </div>
            </div>

            <div className="space-y-3 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-6">
              <h4 className="font-sans text-base font-bold text-slate-950 uppercase">
                Zero Emojis Standard
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Under no circumstances are emojis permitted in documentation, copy, code, or
                interfaces. Use textual badges like [PASSED], [ACTIVE], or [OFFICIAL].
              </p>
              <div className="rounded-[2px] border border-[#CAD3F5] bg-white p-2.5 font-mono text-[11px] text-slate-700">
                Standard: &quot;[VERIFIED] Production Readiness Gate&quot;
              </div>
            </div>

            <div className="space-y-3 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-6">
              <h4 className="font-sans text-base font-bold text-slate-950 uppercase">
                Proper Naming &amp; Capitalization
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Always write SNPI-SMS with a hyphen and all-caps. Write &quot;Open API&quot; and
                &quot;UI Library&quot; with exact casing.
              </p>
              <div className="rounded-[2px] border border-[#CAD3F5] bg-white p-2.5 font-mono text-[11px] text-slate-700">
                Rule: &quot;SNPI-SMS Monorepo (never snpi_sms or SnpiSms)&quot;
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: For Red Hatters / SNPI Team */}
        <section id="for-red-hatters" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Internal Culture
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              For Red Hatters &amp; SNPI Team Members
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrandAssetPlaceholder
              title="Standard Staff Email Signature"
              category="INTERNAL"
              aspectRatio="16:9"
              description="Consistent corporate email signature with authorized brand mark, title, department, and contact info."
              guidelines={['System Font', 'Royal Blue #0056FF Accent']}
            />
            <BrandAssetPlaceholder
              title="Virtual Meeting Backgrounds"
              category="INTERNAL"
              aspectRatio="16:9"
              description="High-definition virtual webcam wallpapers featuring subtle chamfered armor contours in midnight surge."
              guidelines={['1920x1080 HD', 'Subtle Logo Safe Area']}
            />
            <BrandAssetPlaceholder
              title="Internal Presentation Toolkits"
              category="INTERNAL"
              aspectRatio="16:9"
              description="Pre-formatted PowerPoint and Google Slides templates for all-hands meetings, sprint demos, and town halls."
              guidelines={['Sora Typography', 'Strict Palette Only']}
            />
          </div>
        </section>

        {/* SECTION: For Creatives */}
        <section id="for-creatives" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Production Specs
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              For Creatives &amp; Designers
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-4 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <h4 className="font-sans text-lg font-bold text-slate-950 uppercase">
                Grid &amp; Mathematical Tokens
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                All layouts are anchored to an 8px base rhythm (8, 16, 24, 32, 48, 64px). Component
                corner radii are mathematically standardized to rounded-[4px] across all desktop and
                mobile web screens.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">4px Corners</span>
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">8px Grid</span>
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">1px Borders</span>
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">Zero Shadows</span>
              </div>
            </div>

            <div className="space-y-4 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <h4 className="font-sans text-lg font-bold text-slate-950 uppercase">
                Vector Asset Export Pipeline
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Primary design files must remain live editable vector objects. Export digital
                graphics strictly in PDF (print), SVG (web code), and lossless PNG. Never export
                flattened raster layers as primary masters.
              </p>
              <div className="flex flex-wrap gap-2 font-mono text-[11px]">
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">SVG 1.1</span>
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">PDF/X-1a</span>
                <span className="rounded bg-[#E3E7FC] px-2 py-1 text-slate-800">Lossless PNG</span>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: For The Press */}
        <section id="for-press" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Media Inquiries
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              For The Press &amp; Media Outlets
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <BrandAssetPlaceholder
              title="Official Media Press Kit (.ZIP)"
              category="PRESS"
              aspectRatio="16:9"
              description="High-resolution EPS, SVG, and PNG master logos in monochrome, full color, and reverse lockups."
              guidelines={['Vector Master Pack', 'Press Release Boileplate']}
            />
            <BrandAssetPlaceholder
              title="Official Executive Portraits"
              category="PRESS"
              aspectRatio="16:9"
              description="Studio-grade leadership headshots color-graded to the official soft lavender / neutral tint standard."
              guidelines={['High-Res 300DPI', 'Editorial License']}
            />
            <BrandAssetPlaceholder
              title="Institutional Fact Sheet"
              category="PRESS"
              aspectRatio="16:9"
              description="Standard 1-page overview of SNPI-SMS architecture, accreditation, student population, and leadership."
              guidelines={['A4 PDF Format', 'Updated Quarterly']}
            />
          </div>
        </section>

        {/* SECTION: Foundations */}
        <section id="foundations" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Core DNA</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Brand Foundations
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 01
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">History</h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Founded as an institutional school management system, SNPI-SMS evolved into a
                high-concurrency, modular monolith orchestrating 47 academic and administrative
                operational domains.
              </p>
            </div>

            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 02
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">Brand Platform</h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Mission: Empower educational institutions with mission-critical software
                reliability, zero-shadow ergonomic clarity, and military-grade data governance.
              </p>
            </div>

            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 03
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">Brand Personality</h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Bold, authoritative, precise, and human-centric. Expressed through deep Royal Blue
                (#0056FF), geometric Sora typography, and mecha cyber contours.
              </p>
            </div>

            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 04
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">The Hat / Brand Mark</h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                The authoritative emblem. Must always maintain minimum clear space equal to 50% of
                the mark&apos;s height, and never appear smaller than 24x24px on screens.
              </p>
            </div>

            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 05
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">Brand Architecture</h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                A monolithic master brand framework. All sub-domains (Attendance, Finance, Exams,
                Admissions) inherit the primary identity and visual markers.
              </p>
            </div>

            <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Foundational Pillar 06
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">
                Naming &amp; Trademarks
              </h4>
              <p className="font-sans text-xs leading-relaxed text-slate-600">
                Protected trademarks and canonical naming rules: SNPI-SMS, SNP International School,
                and SNP Modular Monolith.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: Logos */}
        <section id="logos" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Visual Identity Assets
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Official Logo System
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <BrandAssetPlaceholder
              title="Red Hat / SNPI Primary Logo"
              category="LOGOS"
              aspectRatio="16:9"
              description="The primary horizontal lockup with emblem and custom bold wordmark. Default for light surfaces."
              guidelines={['Primary Mark', 'Minimum Clear Space 32px']}
            />
            <BrandAssetPlaceholder
              title="Product Logos &amp; Module Emblems"
              category="LOGOS"
              aspectRatio="16:9"
              description="Iconographic marks representing core modules: Attendance, Finance, Timetable, Grading, and Security."
              guidelines={['24x24 Grid', 'Stroke Width 2.0']}
            />
            <BrandAssetPlaceholder
              title="Universal Logos &amp; App Icons"
              category="LOGOS"
              aspectRatio="16:9"
              description="Standalone circular and squircle app icons for mobile, browser favicons, and PWA manifest."
              guidelines={['512x512 PNG', 'SVG Vector Master']}
            />
            <BrandAssetPlaceholder
              title="Initiative &amp; Community Logos"
              category="LOGOS"
              aspectRatio="16:9"
              description="Sub-brands for student hackathons, robotics labs, and academic research initiatives."
              guidelines={['Sub-Brand Lockup', 'Royal Blue #0056FF']}
            />
            <BrandAssetPlaceholder
              title="Event &amp; Summit Logos"
              category="LOGOS"
              aspectRatio="16:9"
              description="Commemorative badges and event branding for annual convocations and technical showcases."
              guidelines={['Dated Lockup', 'Year Stamped']}
            />
            <BrandAssetPlaceholder
              title="Endorsement &amp; Partner Badges"
              category="LOGOS"
              aspectRatio="16:9"
              description="Co-branded endorsement seals for educational accreditations and governmental partnerships."
              guidelines={['Dual Clear Zone', 'Equal Visual Weight']}
            />
          </div>
        </section>

        {/* SECTION: Design language (with live BrandColorsPalette) */}
        <section id="design-language" className="scroll-mt-32 space-y-8">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Visual Vocabulary
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Design Language
            </h2>
          </div>

          {/* Color: Interactive reproduction of the user's reference image */}
          <div id="color" className="space-y-4">
            <BrandColorsPalette />
          </div>

          {/* Fonts & Typography */}
          <div
            id="typography"
            className="space-y-6 rounded-[4px] border border-[#CAD3F5] bg-white p-6"
          >
            <div className="border-b border-[#CAD3F5] pb-3">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Type System
              </span>
              <h3 className="font-sans text-xl font-bold text-slate-950">
                Fonts &amp; Typography &middot; Google Sora
              </h3>
              <p className="font-sans text-xs text-slate-600">
                Sora is a geometric sans-serif typeface designed for clarity on high-density
                displays.
              </p>
            </div>

            <div className="space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-[10px] text-slate-400">
                  Heading 1 &middot; Sora 800 ExtraBold &middot; 36-48px
                </span>
                <p className="font-sans text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                  Enterprise Academic Infrastructure
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-[10px] text-slate-400">
                  Heading 2 &middot; Sora 700 Bold &middot; 24-30px
                </span>
                <p className="font-sans text-2xl font-bold tracking-tight text-slate-900">
                  Mission-Critical Modular Architecture
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3">
                <span className="font-mono text-[10px] text-slate-400">
                  Body &middot; Sora 400 Regular &middot; 15-16px
                </span>
                <p className="font-sans text-sm leading-relaxed text-slate-700">
                  Every student record, cryptographic exam assessment, and financial invoice is
                  enforced through the multi-tenant isolation layers and strict RBAC permission
                  models.
                </p>
              </div>

              <div>
                <span className="font-mono text-[10px] text-slate-400">
                  Code &amp; Monospace &middot; JetBrains Mono / SF Mono &middot; 12-13px
                </span>
                <p className="font-mono text-xs font-semibold text-[#0056FF]">
                  const API_GATEWAY_URL = &quot;https://api.snpi.edu.kh/v1&quot;;
                </p>
              </div>
            </div>
          </div>

          {/* Photography & 3D Illustration */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <BrandAssetPlaceholder
              title="Authentic Photography Standards"
              category="PHOTOGRAPHY"
              aspectRatio="16:9"
              description="High-clarity campus scenes featuring real students and faculty in action. Candid, natural lighting with royal blue ambient highlights."
              guidelines={['Real Subjects Only', 'Natural Daylight', 'Zero Stock Clichés']}
            />
            <BrandAssetPlaceholder
              title="3D Illustration &amp; Mecha Geometry"
              category="3D ART"
              aspectRatio="16:9"
              description="Isometric mecha hardware abstractions, chamfered server blocks, and luminous Royal Blue glow vectors."
              guidelines={['45-Degree Chamfers', 'Clean Lighting', 'Vector Rendered']}
            />
          </div>

          {/* Iconography: Icons, Technology Icons, UI Icons */}
          <div className="space-y-6 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
            <div className="border-b border-[#CAD3F5] pb-3">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Symbol Standards
              </span>
              <h3 className="font-sans text-xl font-bold text-slate-950">
                Iconography &middot; Icons, Technology Icons, UI Icons
              </h3>
              <p className="font-sans text-xs text-slate-600">
                Geometric 24x24px stroke system with 2.0px stroke-width, rounded caps, and zero
                emoji integration.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-4">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  UI Icons
                </span>
                <h4 className="font-sans text-sm font-bold text-slate-900">Interface Navigation</h4>
                <p className="font-sans text-xs text-slate-600">
                  Layers, FileText, Code, Bookmark, Search, User, Shield, Calendar, and Terminal.
                </p>
              </div>

              <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-4">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  Technology Icons
                </span>
                <h4 className="font-sans text-sm font-bold text-slate-900">Infrastructure Stack</h4>
                <p className="font-sans text-xs text-slate-600">
                  MongoDB, Next.js, Express, Docker, Kubernetes, Vercel, and TypeScript badges.
                </p>
              </div>

              <div className="space-y-2 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/20 p-4">
                <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                  Bare Icons Standard
                </span>
                <h4 className="font-sans text-sm font-bold text-slate-900">
                  Zero Background Color
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Icons sit bare on cards without colorful square background boxes for clean
                  elegance.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: Handbooks */}
        <section id="handbooks" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Operational Manuals
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Brand Handbooks &amp; Sub-Guides
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <BrandAssetPlaceholder
              title="Digital Badges Handbook"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Standards for digital skills verification, achievement badges, and micro-credential cards."
              guidelines={['Vector Scalable', 'OpenBadges 2.0 Standard']}
            />
            <BrandAssetPlaceholder
              title="Employee Resource Groups"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Guidelines for forming internal clubs, interest groups, and community insignia."
              guidelines={['Sub-Brand Rules', 'Parent Lockup Required']}
            />
            <BrandAssetPlaceholder
              title="Hybrid Style Co-Branding"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Rules for co-branding with national education ministries, universities, and enterprise sponsors."
              guidelines={['50/50 Visual Weight', 'Divider Line Standard']}
            />
            <BrandAssetPlaceholder
              title="Partner Marketing Guide"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Marketing assets, press release templates, and website lockups for certified partners."
              guidelines={['Approved Messaging', 'Authorized Badge']}
            />
            <BrandAssetPlaceholder
              title="Product Branding Handbook"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Naming, badging, and visual positioning for new platform modules and services."
              guidelines={['Modular Monolith', 'Zero Redundancy']}
            />
            <BrandAssetPlaceholder
              title="Red Hat &amp; SNPI Developer Branding"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Developer documentation standards, CLI terminal branding, SDK logos, and GitHub repo assets."
              guidelines={['Dark Terminal Mode', 'Sora & JetBrains Mono']}
            />
            <BrandAssetPlaceholder
              title="Official Swag &amp; Merchandise"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Physical merchandise guidelines: hoodies, tees, metal pens, backpacks, and lanyard tags."
              guidelines={['Royal Blue #0056FF Dye', 'White Vector Embroidery']}
            />
            <BrandAssetPlaceholder
              title="E-Resources &amp; Digital Library"
              category="HANDBOOK"
              aspectRatio="4:3"
              description="Digital catalog access, licensing agreements, and font distribution rights."
              guidelines={['Open Source Sora', 'MIT License Documentation']}
            />
          </div>
        </section>

        {/* SECTION: Resources & What's new */}
        <section id="resources" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">Asset Hub</span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              Brand Resources &amp; Downloads
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <div className="space-y-4 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Resource 01
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">Master Logo Package</h4>
              <p className="font-sans text-xs text-slate-600">
                Vector SVG, EPS, high-resolution PNG, and monochrome marks for print and digital
                applications.
              </p>
              <Link
                href="/brand/resources"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#0056FF] hover:underline"
              >
                <span>View Downloads</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="space-y-4 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Resource 02
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">
                Design Token Specification
              </h4>
              <p className="font-sans text-xs text-slate-600">
                Mathematical color tokens, elevation curves, typography scales, and CSS
                pseudo-element mixins.
              </p>
              <Link
                href="/brand/standards"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#0056FF] hover:underline"
              >
                <span>View Standards</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="space-y-4 rounded-[4px] border border-[#CAD3F5] bg-white p-6">
              <span className="font-mono text-[10px] font-bold text-[#0056FF] uppercase">
                Resource 03
              </span>
              <h4 className="font-sans text-lg font-bold text-slate-950">Presentation Templates</h4>
              <p className="font-sans text-xs text-slate-600">
                Pre-built 16:9 widescreen Google Slides and PowerPoint master decks in official
                Royal Blue styling.
              </p>
              <Link
                href="/brand/resources"
                className="inline-flex items-center gap-1.5 font-sans text-xs font-bold text-[#0056FF] hover:underline"
              >
                <span>Access Templates</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* SECTION: What's new */}
        <section id="whats-new" className="scroll-mt-32 space-y-6">
          <div className="border-b border-[#CAD3F5] pb-3">
            <span className="font-mono text-xs font-bold text-[#0056FF] uppercase">
              Release Tracker
            </span>
            <h2 className="font-sans text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">
              What&apos;s New in Brand Standards
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#CAD3F5] bg-white p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#0056FF]">
                    RELEASE v0.2.11
                  </span>
                  <span className="font-mono text-xs text-slate-500">October 31, 2026</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-slate-950">
                  Cyber Armor Modular Navigation &amp; Royal Blue Active Glow Standard
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Established the 3-tab Cyber Armor dock with 45° chamfers, double-seam dividers,
                  and Royal Blue glow bar.
                </p>
              </div>
              <Link
                href="/document/changelog"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/40 px-3 py-1.5 font-sans text-xs font-bold text-slate-800 transition-colors hover:border-[#0056FF] hover:text-[#0056FF]"
              >
                <span>View Full Changelog</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[#CAD3F5] bg-white p-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="rounded bg-[#EFF5FF] px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#0056FF]">
                    STANDARDS v1.0
                  </span>
                  <span className="font-mono text-xs text-slate-500">October 30, 2026</span>
                </div>
                <h4 className="font-sans text-sm font-bold text-slate-950">
                  Authoritative Brand Colors &amp; Gradients Specification
                </h4>
                <p className="font-sans text-xs text-slate-600">
                  Locked the 5-color palette (#0056FF, #2277FF, #000000, #E3E7FC, #FFFFFF) and dual
                  gradients (Futurewave &amp; Midnight Surge).
                </p>
              </div>
              <Link
                href="/brand/standards"
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[#CAD3F5] bg-[#E3E7FC]/40 px-3 py-1.5 font-sans text-xs font-bold text-slate-800 transition-colors hover:border-[#0056FF] hover:text-[#0056FF]"
              >
                <span>Read Standards</span>
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
