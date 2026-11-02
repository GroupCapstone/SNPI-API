---
name: snp-sms-accessible-design
description: >-
  Authoritative enterprise design standard and architectural specification for
  Material 3 and WCAG 2.1 AAA accessible product experiences across SNP-SMS.
  Enforces inclusive co-design (13 dimensions of lived experience), keyboard
  navigation, contrast standards, touch targets, screen reader Alt Text (≤140 chars),
  notification and SMS architecture, UX writing & punctuation, M3 custom color
  roles, multi-modal inputs, selection architecture, layout scaffold, 5 breakpoints,
  and 6 canonical interaction states with state layers.
---

# Material 3 & WCAG 2.1 AAA Accessible Design Architecture Manual

Enterprise specification and authoritative standard for inclusive, equitable, keyboard-navigable, text-scalable, and WCAG 2.1 AAA accessible product experiences for AI agents and developers across the SNP-SMS platform.

---

## Authoritative 19-Section Standard Architecture Index

| Section | Domain Specification | Core Architectural Invariant |
| :--- | :--- | :--- |
| **01** | Co-Design & 13 Dimensions | 13 lived experience dimensions &middot; AI bias parity &middot; Participatory loop |
| **02** | WCAG 2.1 AAA Foundations | 7:1 normal / 4.5:1 large text &middot; Native HTML controls &middot; ARIA parity |
| **03** | Keyboard Navigation & Tab Order | Logical L-to-R traversal &middot; 2px focus ring &middot; Modal focus trapping &middot; Undo |
| **04** | Color Contrast & Scalability | 3:1 graphical objects &middot; 200% zoom without truncation &middot; Semantic tokens |
| **05** | Visual Hierarchy & Spacing | 8dp grid spacing &middot; Proximity grouping &middot; Distinct typographic scales |
| **06** | Touch Targets & Bounds | Minimum 44&times;44px targets &middot; 8dp spacing bounds &middot; Fitts's law thumb reach |
| **07** | Screen Reader Alt Text | &le;140 chars &middot; Contextual verbs &middot; Decorative `alt=""` &middot; No file names |
| **08** | Global UX Writing & Tone | Plain language &middot; Active voice &middot; Direct actionable CTAs &middot; Zero fluff |
| **09** | Notification & SMS Architecture | Title &lt;29 chars &middot; Body &lt;80 chars &middot; Latin &lt;160 / Non-Latin &lt;134 &middot; Explicit weekdays |
| **10** | System UI Writing & Punctuation | Sentence case &middot; Second-person ("you") &middot; Oxford commas &middot; No Latin abbr |
| **11** | Customizing M3 Color Roles | 5 color role groups &middot; Tone pairing (40 on 100 / 80 on 20) &middot; Scoped personalization |
| **12** | Multi-Modal Input Architecture | Mouse, trackpad, keyboard, stylus, touch &middot; Semantic cursor morphology &middot; Shortcut mapping |
| **13** | Selection Architecture | 3 visual indicators &middot; Single-select nav active pills &middot; Touch CAB &middot; Desktop hover reveal |
| **14** | Layout Scaffold & Breakpoints | 5 breakpoints (<600dp to &ge;1600dp) &middot; 1–3 Panes &middot; Show/Hide, Levitate, Reflow &middot; RTL |
| **15** | Interaction States & Layers | 6 states (Enabled, Disabled, Hover, Focused, Pressed, Dragged) &middot; State layers &middot; Exclusivity |
| **16** | Grids, Spacing & Density | Placement order &middot; Global rulers &middot; Component density (0 to -3) &middot; &ge;48dp targets |
| **17** | Breakpoints & 5 Adaptation Vectors | 5 Breakpoints &middot; 5 Questions (Reveal, Divide, Resize, Reposition, Swap) &middot; 40–60 CPL |
| **18** | Canonical Layout Archetypes | Feed (1 to 4 cols) &middot; List-Detail (Parent-Child) &middot; Supporting Pane (2/3 + 1/3) &middot; Layering |
| **19** | Usability & M3 Expressive | 5 Nielsen Norman pillars &middot; Goal hierarchy (1st, 2nd, 3rd) &middot; Expressive tactics &middot; Aura case study |

---

## 1. Co-Design & The 13 Dimensions of Lived Experience

### 1.1 The 13 Dimensions Matrix
When architecting features, user flows, and conversational agent prompts, evaluate all 13 dimensions of lived experience:

1. **Age**: Accommodate youth through senior users; adjust tap targets and reading density.
2. **Culture**: Audit cultural color connotations, date/time layouts, and regional metaphors.
3. **Disability**: Ensure screen reader, keyboard, switch-device, and high-contrast interoperability.
4. **Education & Literacy**: Use plain language, clear instructional hierarchy, and multi-modal cues.
5. **Ethnicity**: Ensure authentic representation and eliminate cultural stereotypes.
6. **Gender**: Support diverse identity options and gender-neutral copy.
7. **Geography & Global Relevance**: Optimize for metered networks, low-bandwidth CDN edge nodes, and RTL scripts.
8. **Physical Attributes**: Account for one-handed thumb reachability, tremors, and varying hand sizes.
9. **Race**: Audit imagery, training datasets, and automated responses for demographic parity.
10. **Religion**: Respect calendar sensitivities, religious holidays, and dietary codes.
11. **Sexual Orientation**: Provide strict privacy safeguards and non-assumptive relationship models.
12. **Socioeconomic Status**: Support legacy mobile devices, low-cost hardware, and offline states.
13. **Technology Proficiency**: Design intuitive mental models with clear action feedback and instant undo.

### 1.2 Participatory Co-Design Innovation Loop
* **Phase 1 (Partner)**: Collaborate early and continuously with historically overlooked community members and accessibility researchers.
* **Phase 2 (Co-Create)**: Involve community members directly in wireframing, feature scoping, and vocabulary design.
* **Phase 3 (Validate)**: Conduct empirical usability testing across diverse assistive technology user cohorts.
* **Phase 4 (Iterate)**: Continually refine features, agent rules, and messaging based on live feedback.

### 1.3 ML / AI Agent Bias Mitigation Protocol
* **Dataset Representation Parity**: Audit LLM prompts and training contexts to prevent demographic exclusion.
* **Algorithmic Fairness Testing**: Routinely evaluate agent task outcomes against edge cases across literacy levels.
* **Harm Prevention & Non-Exclusion**: Autonomous agents must never generate discriminatory copy, assume user identity, or generate inaccessible UI patterns.

---

## 2. Text Resizing & Reflow Specification (&ge; 200%)

### 2.1 Proportional Scaling & Constant Padding Invariant
* **Minimum 200% Text Scaling**: All user interfaces MUST support scaling text by at least 200% (`2x` multiplier) without loss of content, understandability, or functionality.
* **Proportional Scaling Formula**:
  $$\text{Rendered Size} = \text{Base Size} \times \text{Multiplier} \quad (\text{e.g. } 14\text{pt} \times 2 = 28\text{pt})$$
* **Constant 1x Spacing & Padding**:
  * Button and card padding MUST remain constant at 1x default (`8dp` vertical, `24dp` horizontal).
  * Margins and gutters between elements remain fixed at 1x default (`8dp`, `16dp`).
* **Non-Text Elements Prohibition**:
  * Checkboxes, radio buttons, progress indicators, and standalone icon graphics MUST NOT scale with text resizing.

### 2.2 Layout Reflow & Stacking
* **Horizontal to Vertical Stacking**: Components positioned side-by-side at 1x (e.g. action button clusters) must reflow into a vertical stack at 2x to accommodate enlarged text without clipping or horizontal overflow.
* **Single-Direction Vertical Scrolling**: Scrolling must only ever occur vertically. Never force the user into dual horizontal and vertical scroll cycles.
* **Fixed Chrome Tooltip Magnification**:
  * Spaces with rigid height constraints (Top App Bar, Bottom Navigation, Navigation Rail, Fixed Tabs) remain displayed at 1x.
  * Touching & holding (or hovering) reveals the enlarged `2x` text label inside an accessible floating tooltip.

---

## 3. Text Truncation & Reveal Standards

* **Text Wrapping First**: Critical text must wrap onto subsequent lines, expanding the container height dynamically.
* **No Blind Ellipsis**: Replacing truncated text with an ellipsis (`...`) without an interaction mechanism to reveal the full text is strictly prohibited.
* **Approved Truncation Reveal Mechanisms**:
  1. Accessible tooltips on hover / focus.
  2. Clickable expandable card containers (`[Read Full Message]` / `[Show Less]`).
  3. Linked details view / modal sheets.

---

## 4. Alt Text Architecture, Media Formulas & Global Writing

### 4.1 Alt Text Architecture & Character Boundary (≤ 140 Characters)
* **Character Boundary**: Concise informative phrases up to `140 characters` (maximum).
* **Formula**: `[Essential Meaning] + [Key Takeaway / Action]`.
* **Zero Fluff**: Never prefix alt text with "image of" or "picture of". Screen readers automatically announce the image element type.
* **Zero Raw Filenames**: Never leave default filenames (e.g. `jpg-0223939-330.png`) in alt attributes.

### 4.2 Alt Text by Media Type
* **Photos & Realistic Imagery**: Focus on the core subject/product; omit irrelevant background clutter.
  * `[PASS]`: `alt="A Scandinavian-style copper-handled cream watering can."` (56 chars)
  * `[FAIL]`: `alt="Image of child hands pouring from watering can on window sill beside a blue book on shelf..."` (152 chars)
* **Charts & Visualizations**:
  * **Editorial Charts**: Highlight the central takeaway metric rather than dumping raw numbers.
    * `[PASS]`: `alt="Weekly step count was 55% higher vs last week, peaking at 4,106 additional steps."`
    * `[FAIL]`: `alt="Mon=2000, Tue=4500, Wed=8000, Thu=3000..."`
  * **Analytical Charts**: Describe chart type, axis range, and link to accessible data table.
* **Motion & Animated GIFs**: Summarize functional state changes and user reactions, not cursor mechanics.
  * `[PASS]`: `alt="A tooltip labeled 'star' appears when cursor hovers over star icon."`
  * `[FAIL]`: `alt="A hand-shaped cursor lands on a star-shaped icon and then a tooltip appears..."`
* **Decorative Art & Ornaments**: Mark with null alt `alt=""` or `aria-hidden="true"`.
  * If removing the image loses zero information, it is decorative and must not be announced by screen readers.

### 4.3 Adjacent Text, Captions & Embedded Text
* **Captions Below Imagery**: Place visible captions beneath diagrams to assist sighted and screen-reader readers simultaneously. Never duplicate caption text verbatim inside `alt`.
* **Zero Baked Text in Pixels**: Never embed essential instructional text inside raster image pixels. If unavoidable, the entire text string MUST be fully transcribed into the `alt` attribute.
* **Essential vs Non-Essential Elements**:
  * **Essential Content**: Must achieve `≥ 4.5:1` contrast (small text) or `≥ 3.0:1` (large text/diagrams).
  * **Non-Essential Decorative Elements**: Background ornaments, textures, and non-informative shapes must carry `aria-hidden="true"`.

### 4.4 8 Global Writing & Plain Language Rules
1. **Global Examples**: Use universal terms over country-specific references, sports, or regional holidays.
2. **Short Sentences (1.5x Translation Buffer)**: Keep copy concise. Translated text averages 1.5x longer than English (e.g. German, French).
3. **Zero Abbreviations**: Spell out acronyms and shorten words to prevent localization errors.
4. **Noun Repetition**: Repeat nouns rather than ambiguous pronouns ("it") to assist gendered and inflected languages.
5. **Pair "This / That" With Nouns**: Always specify the object ("this document", "that setting"), never leave "this" standing alone.
6. **Zero Polite Filler**: Drop "Please", "Sorry", and "Thank you" in system error states for direct operational clarity.
7. **Plain Language**: Eliminate technical jargon and idioms. Use literal descriptions for critical actions.
8. **Disambiguate Words**: Avoid dual-meaning words (e.g. "filter", "traffic", "home", "post") without contextual clarification.

---

## 5. Keyboard Navigation & Focus Order Protocol

### 5.1 Focus Return on Dismissal (Mandatory Invariant)
* When a dialog, modal, drawer, or dropdown closes (via `Escape`, cancel button, or backdrop), focus MUST return to the initiating trigger element (`triggerRef.current?.focus()`).

### 5.2 Composite Component Traversal & Roving Tabindex
* Toolbars (`role="toolbar"`), tab lists (`role="tablist"`), and menus (`role="menu"`) must act as a single tab stop.
* Arrow keys (`ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`) navigate sub-elements with circular wrap-around.
* `Home` jumps to the first element; `End` jumps to the last element.

### 5.3 Custom Keyboard Shortcuts & Single-Key Protection
* Custom shortcuts require combinations of two or more keys (`Cmd+K`, `Shift+?`).
* Single-key shortcuts (e.g. `J`/`K`) must be disabled by default or feature an explicit user opt-in remap toggle.

---

## 6. Accessible Labels & ARIA Role Standards

* **Action-Only Labels**: Never include element names (`button`, `link`, `icon`) or roles in `aria-label`:
  * `[PASS]`: `aria-label="Discard calendar event"`
  * `[FAIL]`: `aria-label="Close dialog button"`
* **Visual Cue Translation**: Progress bars and meters must carry `role="progressbar"` with `aria-valuenow`, `aria-valuemin`, and `aria-valuemax`.
* **Decorative Media Annotation**: Purely decorative illustrations must carry `aria-hidden="true"`.

---

## 7. Contrast Ratios & Clustering Invariants

| Standard | Ratio Threshold | Target UI Elements | Rule / Exemption |
| :--- | :--- | :--- | :--- |
| **Peak Max** | `21:1` | Black on White reference | Theoretical maximum luminance difference |
| **SNPI Brand Base** | `16.5:1` | Deep Navy `#0A1A4A` on White `#FFFFFF` | Mandatory body text contrast (WCAG AAA) |
| **WCAG AAA** | `&ge; 7.0:1` | Small & normal body text | High-contrast readable content |
| **WCAG AA** | `&ge; 4.5:1` | Standard text baseline | General interface text |
| **UI Containers** | `&ge; 3.0:1` | Clustered buttons, inputs, icons (&ge; 14pt bold) | Delineates grouped elements from canvas |
| **Standalone FAB** | `Exempt` | Isolated floating action buttons | Distinguished by spatial prominence |
| **Disabled States** | `Exempt` | Inactive controls | No contrast ratio required |

---

## 8. Touch, Pointer & Spacing Dimensions

* **Touch Targets (Mobile/Tablet)**: `&ge; 48x48dp` (7–10mm physical area). 24dp icons padded out to 48dp hitbox.
* **Pointer Targets (Mouse/Stylus)**: `&ge; 44x44px` (iOS standard bounding box).
* **Target Spacing**: `&ge; 8dp` minimum clear spacing between adjacent targets to prevent accidental taps.

---

## 9. Notification & SMS Architecture Invariants

### 9.1 Character Boundary & Structural Hierarchy
* **Title Boundary**: `< 29 characters`.
  * **Front-Load Value**: Place critical information in the first 3 words (F-pattern skimming).
  * **Zero Product Duplication**: Never include app name or logo in title (OS header handles branding).
  * **Zero Dynamic Titles**: Never place dynamic variables in title (breaks translation & truncates irrevocably). Place variables in body only.
* **Collapsed Body**: `< 40 characters`. High-density actionable summary.
* **Expanded Body**: `< 80 characters`. Starts with collapsed text and reveals secondary context.
* **Action Buttons**: `1–2 buttons` maximum, `1–2 words` per button (e.g. `[Pay Now]`, `[Review]`, `[Confirm]`).

### 9.2 SMS Messaging Limits & Cost Control
* **Latin Scripts**: `< 160 characters` per payload.
* **Non-Latin Scripts**: `< 134 characters` per payload.
* **Reserved For Urgent Needs**: SMS is strictly for critical account, safety, or authentication alerts.
* **Zero Raw Links**: Never paste full email addresses or raw URLs that bloat payload length.

### 9.3 Temporal Accuracy & Onboarding Flow
* **Day-Specific Timing**: Always use explicit weekdays (e.g. "Tuesday, Nov 4"). Never use relative terms ("today", "tomorrow", "tonight") as ~20% of users read notifications with multi-hour or next-day latency.
  * *Exception*: Auto-dismissing alerts with fixed timestamp expiration.
* **Zero Onboarding Interruption**: Never fire notifications, push alerts, or welcome emails while the user is actively navigating onboarding steps.

### 9.4 Content Hygiene & Delivery Ethics
* **User-Centric Only**: Notifications must serve user goals, never product vanity or unsolicited ads.
* **No Jokes or False Delight**: Prioritize utility over humor; jokes do not translate and fail under stress.
* **Zero Emoji Clutter**: Strictly no emoji clutter. Emojis fail cultural translation and undermine professional alerts.
* **Contextual Opt-Out**: Provide 1-click in-situ notification preference toggles disclosing explicit trade-offs.

---

## 10. UX Writing, Pronouns & Punctuation Invariants

### 10.1 Consequence Clarity & Neutral Tone
* **Objective Explanations**: Describe the tangible operational consequences of an action in direct, neutral, non-judgmental language.
* **No Intimidation**: Avoid alarming, condescending, or coercive phrasing ("Are you SURE?", "WARNING: DANGER!").
* **Mandatory Recovery Path**: Always specify how the user can undo or reverse the action (e.g. "You can restore this class section within 30 days from Settings").
* **No Manipulative Friction**: Never misrepresent consequences or induce guilt to alter user decisions.

### 10.2 Pronoun Architecture & Perspective
* **Second Person Baseline ("You / Your")**: Address the user directly from their perspective ("Your timetable", "Check your Wi-Fi").
* **Zero Perspective Mixing**: Never mix first-person ("My account") and second-person ("Your settings") within the same screen or user journey.
* **Corporate Voice Prohibition**: Avoid using corporate "We" or "I" ("We are glad you are our customer"). It sounds robotic and disingenuous in functional software.
* **Legal Consent Exception**: First-person "I" is reserved exclusively for explicit user ownership agreements (e.g. "I agree to the terms of service").

### 10.3 Capitalization & Sentence Case Invariant
* **Universal Sentence Case**: Capitalize only the first letter of the first word across all UI elements:
  * Page titles & section headers (`Course registration`)
  * Navigation items & sidebar links (`Exam timetable`)
  * Buttons & action pills (`Download report`)
  * Table headers & column labels (`Enrollment status`)
  * Form labels & placeholder hints (`Student identification number`)
* **Proper Nouns Only**: Capitalize only official brand names, registered products, or recognized acronyms (`SNP Portal`, `JSON`, `HTML`).
* **Strict Title Case & All-Caps Ban**: Never use Title Case (`Download Report`) or ALL-CAPS blocks (`DOWNLOAD REPORT`). All-caps blocks harm readability and break screen reader prosody.

### 10.4 Punctuation Economy & Typographical Standards
* **Skip Terminal Periods**: Omit periods at the end of single-sentence strings in:
  * Form labels, tooltips, and badges
  * Bulleted lists
  * Dialog headers and single-sentence modal body text
  * Standalone action buttons and links
  * *Rule*: Use periods only for multi-sentence paragraphs or complex compound clauses.
* **Natural Contractions**: Use standard contractions (`don't`, `isn't`, `can't`, `you'll`) to keep interfaces friendly and scannable. Reserve uncontracted forms (`do not`) strictly for high-severity caution.
* **Oxford Serial Comma**: Always use the serial comma before the conjunction in lists of 3 or more items (`math, science, and history`). Place commas inside quotation marks.
* **Number Formatting**:
  * Use commas for numbers between 1,000 and 1,000,000 (`1,420 students`).
  * Exclude commas from street addresses, radio frequencies, system ports, and calendar years (`year 2026`, `port 3000`).
  * Abbreviate large numbers with "M" for volume estimates (`12M records`).
* **Colon Economy**: Skip colons in headings above lists. Use colons only inside continuous body text introducing an inline list.
* **Exclamation Mark Restriction**: Strictly avoid exclamation points in error states, empty states, and standard workflows. Reserve them exclusively for major celebratory milestones.
* **Ellipsis Protocol**: Use ellipses (`...`) without leading spaces only to indicate active async progress (`Exporting...`). Never append ellipses to buttons or menu items simply because they trigger a dialog.
* **Parentheses Rule**: Use parentheses strictly to define acronyms (`SMS (Short Message Service)`) or cite technical standards. Never use parentheses for conversational afterthoughts.
* **Ampersand Restriction**: The `&` symbol is permitted only in space-constrained column headers, nav badges, and tight table cells. In body copy, paragraphs, and list items, spell out `and`.

### 10.5 Dashes, Hyphens & Grammatical Rules
* **Em Dash (—) Ban**: Avoid em dashes in UX writing; replace them with concise sentence breaks or commas.
* **En Dash (–) for Ranges**: Use an en dash without spaces to indicate numeric or time ranges (`9 AM–Noon`, `pages 12–18`).
* **Hyphenation Precision**:
  * **Hyphenate Adjective Phrases**: When multiple words act as a unified pre-nominal modifier (`best-in-class performance`, `case-by-case basis`). Exclude proper nouns and common phrases (`cell phone number`).
  * **Hyphenate Noun Phrases**: Hyphenate compound nouns formed by a verb + adverb/preposition (`sign-off`, `check-in`, `drive-through`, `higher-up`).
  * **Never Hyphenate Verb Phrases**: Do NOT hyphenate verbs followed by a preposition (`Please check in before entering`, `drop off your assignment`).
* **Italics Sparingly**: Never italicize whole sentences. Use bold weight for emphasis; reserve italics strictly for isolated foreign terms or publication titles.
* **Zero Latin Abbreviations**: Ban Latin abbreviations (`e.g.`, `etc.`, `i.e.`). Always write out `for example`, `and more`, or `that is`.

---

## 11. Customizing Material, Dynamic Color & M3 Color Roles System

### 11.1 Dynamic Color, Contrast Levels & The Paint-by-Number Model
* **Connective Tissue**: Color roles act as semantic numbers in a paint-by-number canvas, mapping brand and dynamic palettes directly to component elements.
* **Three Levels of Contrast**:
  * **Standard Contrast**: Baseline contrast pairing (3.0:1 graphical, 4.5:1 text).
  * **Medium Contrast**: Intermediate contrast level optimized for ambient lighting variations.
  * **High Contrast**: WCAG AAA standard (>= 7.0:1) with enhanced boundary definition.
* **Technical Calibrations**:
  * **Tone 98 Default Surface**: Light theme surface updated from legacy tone 99 to tone 98.
  * **Chroma 6 Neutral Palette**: Neutral palette chroma increased from 4 to 6 for enriched subtle tinting.
  * **Dark Theme Surfaces**: Surface roles slightly darkened in dark theme for punchier accent contrast.
  * **Tone-Based Surface System**: Surface container elevation overlays are completely replaced by distinct tone steps (`surface-container-lowest` up to `highest`).

### 11.2 The 26 Standard Color Roles in Six Groups
1. **Primary Group**: Core brand prominence and high-emphasis CTAs.
   * `primary`: High-emphasis fills, texts, and icons against surface.
   * `on-primary`: Text and icons placed on top of `primary` (>= 4.5:1 contrast).
   * `primary-container`: Standout fill color against surface for key components like extended FABs.
   * `on-primary-container`: Colorful, high-contrast text and icons on `primary-container`.
2. **Secondary Group**: Less prominent components providing tonal balance.
   * `secondary`: Filter chips, secondary buttons, subtle active indicators.
   * `on-secondary`: Text and icons displayed on top of `secondary`.
   * `secondary-container`: Recessive container fill color against surface (tonal buttons, selected chips).
   * `on-secondary-container`: Colorful text and icons on `secondary-container`.
3. **Tertiary Group**: Contrasting accents used to highlight distinct actions or balance primary/secondary colors.
   * `tertiary`: Accent badges, special feature callouts, creative tags.
   * `on-tertiary`: Text and icons on `tertiary`.
   * `tertiary-container`: Complementary container color against surface (input fields, notifications).
   * `on-tertiary-container`: Colorful text and icons on `tertiary-container`.
4. **Error Group**: Attention-grabbing static alerts and form validation failures.
   * `error`: Urgent attention-grabbing color against surface.
   * `on-error`: Text and icons on `error`.
   * `error-container`: Attention-grabbing fill against surface.
   * `on-error-container`: Text and icons on `error-container`.
   * *Static Invariant*: Error colors remain static across dynamic wallpaper schemes while adapting between light and dark themes.
5. **Surface Group**: Neutral backgrounds and 5 tone-based container levels.
   * `surface`: Default color for large low-emphasis canvas backgrounds (tone 98 light / tone 6 dark).
   * `on-surface`: Primary text and icons against any surface or surface container.
   * `on-surface-variant`: Lower-emphasis secondary text, captions, and inactive icons.
   * `surface-container-lowest`: Lowest-emphasis container (recessed into canvas).
   * `surface-container-low`: Low-emphasis container for surface card foundations.
   * `surface-container`: Default container color for cards, sheets, and dialogs.
   * `surface-container-high`: High-emphasis container for raised popovers and menus.
   * `surface-container-highest`: Highest-emphasis container for floating dialogs and toolbars.
   * `inverse-surface`: High-contrast background fill for contrasting elements (snackbars).
   * `inverse-on-surface`: Text and icons against inverse surface.
   * `inverse-primary`: Actionable text buttons displayed against inverse surface.
6. **Outline Group**: Structural boundaries and decorative dividers.
   * `outline`: Important visual boundaries (text field borders, card borders requiring 3.0:1 contrast).
   * `outline-variant`: Decorative elements, list dividers, and chip borders where internal text provides contrast.

### 11.3 Add-On Color Roles: Fixed Accents & Surface Extenders
* **Fixed Accent Colors**: `primary-fixed`, `primary-fixed-dim`, `on-primary-fixed`, `on-primary-fixed-variant` (and secondary/tertiary equivalents) maintain identical tone across light and dark themes. Used strictly for persistent FABs and branded banners.
* **Surface Dim & Bright**: `surface-dim` (dimmest surface) and `surface-bright` (brightest surface) preserve relative brightness across themes.

### 11.4 Fourteen Affected Components & System Mappings
* **Badges**: `error` or `tertiary` with `on-error` or `on-tertiary`.
* **Buttons**: Filled (`primary` / `on-primary`), Tonal (`secondary-container` / `on-secondary-container`), Outlined (`surface` / `primary` / `outline`).
* **FAB & Extended FAB**: `primary-container` fill with `on-primary-container` icon and label.
* **Icon Buttons**: `surface-container-low` with `on-surface-variant`.
* **Segmented Buttons**: `surface-container` (selected: `secondary-container` / `on-secondary-container`).
* **Chips**: `surface-container-low` (selected: `secondary-container` / `on-secondary-container`).
* **Lists**: `surface` container with `outline-variant` dividers.
* **Menus**: `surface-container-high` container with `on-surface` text.
* **Navigation Bar & Drawer**: `surface-container` / `surface-container-low` with active indicator `secondary-container` / `on-secondary-container`.
* **Navigation Rail**: `surface` background with active pill `secondary-container`.
* **Switches**: `surface-container-highest` track (active: `primary`), `on-primary` thumb.
* **Toolbars**: `surface-container-highest` with `on-surface` actions.

### 11.5 Tonal Palette Generation & Automatic Contrast
* **Seed Color Input**: Single source brand color generates 13 mathematical tones: `[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 98, 100]`.
* **Automated Contrast Guarantee**:
  * **Light Theme**: Elements use tone `40` paired with on-color tone `100` (>= 4.5:1 contrast). Containers use tone `90` paired with on-container tone `10`.
  * **Dark Theme**: Elements use tone `80` paired with on-color tone `20` (>= 4.5:1 contrast). Containers use tone `30` paired with on-container tone `90`.
* **Custom Component Mapping**: Custom components must map directly to semantic role tokens (`var(--md-sys-color-primary)`), inheriting dynamic adaptations automatically.

### 11.6 Token Architecture & DSP Export Standard
* **Design System Package (DSP)**: Tokens export to DSP cross-platform schema for real-time synchronization between Figma, Flutter, Jetpack Compose, and Web CSS Custom Properties.
* **Token Export Standard**: Maintain two-tier token separation:
  * **Reference Tokens**: Global palette definitions (`md.ref.palette.primary.40`).
  * **System Tokens**: Contextual semantic roles (`md.sys.color.primary`).

---

## 12. Multi-Modal Inputs: Mouse, Trackpad, Stylus & Physical Keyboard

### 12.1 Multi-Modal Input Device Architecture
* **Universal Input Independence**: Support mouse, trackpad, physical keyboard, stylus, and touch simultaneously across all screen sizes (phones, tablets, foldables, laptops, and desktops).
* **No Touch-Only or Mouse-Only Assumptions**:
  * When a mouse or trackpad is connected, show a visible mouse cursor immediately regardless of device form factor.
  * When interacting via touch on hybrid devices, show native touch handles; when using mouse/trackpad, use standard text selection and right-click context menus without touch handles.

### 12.2 Cursor Semantics & Text Selection
* **Cursor Morphology Standards**:
  * **Default Pointer (`default`)**: Visible external indicator for general application surface control.
  * **Hand Pointer (`pointer`)**: Used exclusively for links, clickable buttons, and interactive cards.
  * **I-Beam (`text`)**: Rendered when hovering on selectable or editable text fields.
  * **Resize Arrows (`col-resize`, `row-resize`)**: Displayed on boundaries of resizable panels or table columns.
  * **Stylus Circle Tool**: Indicates stylus tool shape and brush radius without standard pointer clutter.
* **Text Selection Hierarchy**:
  * **Single Click**: Positions insertion cursor.
  * **Double Click**: Selects the entire clicked word.
  * **Triple Click**: Selects the entire paragraph.
  * **Single Click (outside)**: Deselects text and repositions cursor.

### 12.3 Input Device Behaviors & Tactile Feedback
* **Primary Click**: Triggers pressed state feedback (e.g. ripple or surface depression) identical to touch tap.
* **Secondary Click (Right-Click / 2-Finger Tap)**: Activates contextual menu for the clicked element.
* **Hover Cues**: Resting cursor changes component states and triggers informational tooltips.
* **Scroll & Gestures**:
  * Mouse wheel and 2-finger trackpad drag vertically scroll lists under the cursor.
  * Horizontal carousels scroll smoothly with horizontal trackpad gestures or shift-wheel.
  * Pinch-to-zoom scales canvas elements smoothly.
* **Drag Disambiguation**: Touch-drag in a text area scrolls the viewport; mouse-drag in a text area highlights text.

### 12.4 Physical Keyboard Invariants
* **Virtual Keyboard Management**:
  * Automatically suppress/hide the on-screen virtual keyboard when a physical keyboard is attached.
  * Re-enable the virtual keyboard immediately upon physical keyboard detachment.
* **Primary Key Conventions**:
  * **`Enter`**: Submits active form, sends message, or executes primary dialog action.
  * **`Spacebar`**: Toggles switches/checkboxes and pauses/plays media.
  * **`Tab`**: Advances focus in strict logical order (L-to-R, top-to-bottom) with a prominent 2px high-contrast focus indicator.
  * **`Escape`**: Dismisses visible modal sheets, dialogs, and dropdowns; clears focus without deleting typed input.

---

## 13. Selection Architecture: Indicators, Active Pills & Batch Modes

### 13.1 Visual Selection Indicators & Component Inheritance
* **Three Canonical Selection Modalities**:
  1. **Surface Color Tint**: Background shifts to primary container (`#EFF5FF`) with active border (`#0056FF`).
  2. **Checkmark Glyphs & Checkboxes**: Visible `Check` icon or interactive checkbox component.
  3. **Combination**: Surface tint paired with checked badge for high-contrast accessibility.
* **Component Inheritance**: Cards, Checkboxes, Chips, Data tables, Icon buttons, List items, Menu items, Pickers, Radio buttons, Segmented buttons, Sliders, and Switches.
* **Active Pill Indicators (Single Selection Only)**: Navigation bars, Navigation drawers, Navigation rails, and Tabs use a dedicated active pill indicator. Exactly one item may be selected at any given time.

### 13.2 Touch Selection Protocol & Contextual Action Bar
* **Selection Mode Ingestion**:
  * Long-press (500ms) or two-finger tap triggers selection mode.
  * Shortcut trigger: Direct tap on item avatar or leading thumbnail initiates selection mode immediately.
* **Contextual Action Bar (CAB)**:
  * Replacing standard app bar with selection toolbar displaying `[N Selected]`, select-all toggle, and contextual actions (`Archive`, `Export`, `Delete`).
* **Batch Drag Gesture**:
  * Long-press followed by continuous drag across adjacent items selects batches in a single fluid gesture.
  * *Exemption*: If long-press and drag is already bound to item reordering/drag-and-drop cards, batch drag selection is strictly prohibited to prevent interaction conflict.
* **Mode Dismissal**: Tapping `Done`, `Close`, or unchecking all items immediately dismisses selection mode and restores the standard header.

### 13.3 Desktop / Pointer Checkbox Visibility Rules
* **Primary Activity (Data Tables / Batch Queues)**:
  * Checkboxes are **always visible by default** in the leading column.
* **Secondary Activity (Content Feeds / File Lists)**:
  * Checkboxes remain hidden by default to keep the interface clean.
  * Hovering an item reveals its single checkbox trigger.
  * Once the first item is selected, checkboxes **reveal permanently across all list items** until selection mode is dismissed.

---

## 14. Layout Architecture: Scaffold, Breakpoints & Adaptive Design

### 14.1 Layout Scaffold & Fundamental Building Blocks
* **Windows**: Frames and contains the app. Supports full-screen (default mobile), split-screen (tablets/foldables), floating bubbles, and desktop free-form resizable multi-window modes.
* **Layout Grid**: Foundation organizing components, content, and actions. Column count, width, and gaps dynamically scale across breakpoints.
* **Bars**: Frame navigation across the product. Top App Bar provides context and 1–2 essential actions; Bottom Navigation Bar provides top-level destination switching. Bars can span one or multiple panes.
* **Rails**: Perimeter space surrounding panes or floating above them. Accommodates navigation rails (desktop), toolbars (mobile), chat inputs, and Floating Action Buttons (FABs).
* **Panes**: Primary layout containers housing destinations and workflows (1–3 panes).
  * **Co-Planar**: Panes displayed side by side on wide viewports (e.g. list-detail).
  * **Floating**: Panes elevated above content (e.g. modal dialogs).
  * **Docked**: Panes anchored to one edge extending outwards (e.g. bottom sheets, side sheets).
  * **Grouping**: Implicit grouping (blends with background) vs explicit grouping (distinct surface colors and contrast borders).
* **Drag Handles**: Resizing components that adjust flexible pane widths or toggle full collapse/expansion between 1-pane and 2-pane modes.
* **Rulers**: Global alignment lines enforcing margin consistency across all layers and nested panes.

### 14.2 Adaptive Breakpoints & Multi-Device Experiences
* **Breakpoint Classification (formerly Window Size Classes)**:
  * **Compact (<600dp)**: Mobile phones in portrait. Single pane layout, full-screen windows, bottom navigation bar.
  * **Medium (600–839dp)**: Tablets in portrait, foldables unfolded. 1–2 panes, navigation rail or bar.
  * **Expanded (840–1199dp)**: Tablets in landscape, small laptops. 2 panes co-planar, navigation rail.
  * **Large (1200–1599dp)**: Desktop monitors. 2–3 panes, persistent navigation drawer or rail.
  * **Extra-Large (≥1600dp)**: Ultra-wide desktop and spatial viewports. Up to 3 panes with side utility rails and centered max-width content containers.
* **Three Primary Experience Types**:
  1. **Mobile**: Defaults to full-screen; supports split-screen and floating multitasking bubbles.
  2. **Desktop**: Free-form resizable multi-window environment with mouse/keyboard primary interactions.
  3. **Spatial (XR / Extended Reality)**: Limitless 3D space with high-contrast pane containers separating content from passthrough/virtual environments; navigation rails transform into floating orbiters.

### 14.3 Adaptive Strategies for Panes & Components
* **Pane Adaptive Strategies**:
  * **Show and Hide**: Reveal supplementary panes (e.g. detail pane, side inspector) as screen width expands; collapse to single pane with stack navigation on compact screens.
  * **Levitate**: Elevate secondary workflows into floating dialogs or bottom sheets when co-planar space is insufficient.
  * **Reflow**: Rearrange multi-column layouts (3 columns -> 2 columns -> 1 column) dynamically to match available window bounds.
* **Component Adaptive Transformations**:
  * **Resizing**: Buttons and containers hug content or span fluidly based on available container width.
  * **Progressive Disclosure**: List items and cards reveal secondary metadata (e.g. descriptions, timestamps) as pane width expands.
  * **Presentation Changes**: Floating Action Button (FAB) transforms into Extended FAB with text label on wide screens; navigation rail expands into full drawer.

### 14.4 Bidirectionality (LTR & RTL) & Safety Regions
* **RTL Mirroring**: Complete layout inversion for right-to-left languages (Arabic, Hebrew, Farsi). Navigation components, back buttons, and pane hierarchies mirror to the right perimeter.
* **System Safety Regions**: Reserve inviolable padding for system bars, gesture insets, camera cutouts, and hardware hinges (foldables).

---

## 15. Interaction States Architecture: State Layers & Component Inheritance

### 15.1 The Six Canonical Interaction States
* **1. Enabled**: Communicates interactive capability. Standard baseline component styling, full color fidelity, and standard elevation.
* **2. Disabled**: Communicates non-interactive status via lowered opacity (38%), reduced elevation (0dp), and pointer-events suppression.
  * *Contrast Exemption*: Disabled elements are legally exempt from WCAG 4.5:1 contrast requirements.
  * *FAB Exception*: Floating Action Buttons (FABs) must **never display as disabled**; if the represented action is unavailable, the FAB must hide completely.
* **3. Hover**: Triggered when a cursor pauses over an interactive target. Applies a low-emphasis surface overlay (8% opacity) with a subtle fade animation.
* **4. Focused**: Communicates that an element is highlighted via keyboard navigation (Tab key) or voice control. Emits a high-emphasis surface overlay (12% opacity) paired with a high-contrast ring-like focus indicator (2px solid `#0056FF` with 2px offset).
* **5. Pressed**: Indicates physical or pointer actuation (tap, click, Spacebar, Enter). Employs an immediate ripple overlay (12% opacity) and tactile surface elevation change.
* **6. Dragged**: Initiated when an element is pressed and held while moving across screen coordinates. Displays a low-emphasis surface overlay (16% opacity) with elevated drop-shadow (4dp–8dp) to communicate lift.

### 15.2 State Exclusivity & Compound State Invariants
* **Layout Exclusivity Rules**:
  * **Hover Exclusivity**: Exactly **one** hover state can be active across the layout at any given moment, strictly governed by cursor coordinates.
  * **Focus Exclusivity**: Exactly **one** element can possess keyboard focus at any time in the window hierarchy.
  * **Pressed Exclusivity**: Exactly **one** element can be actively pressed simultaneously.
  * **Dragged Exclusivity**: Only a single item may occupy a dragged state at a time.
* **Valid Compound States**:
  * `Hover + Focused`: Cursor hovers over an element that currently possesses keyboard focus.
  * `Selected + Hover`: A selected filter chip or toggle button being hovered by a mouse cursor.
  * `Selected + Focused`: A selected item receiving keyboard focus indicator.
  * `Selected + Pressed`: A selected item being tapped to toggle or activate.
  * `Disabled Immunity`: Disabled elements **never** inherit hover, focused, pressed, or dragged states under any circumstances.

### 15.3 Component Inheritance & Exclusion Matrix
* **Inherited By (Action, Selection, Input & Containment)**:
  * Buttons, Cards, Checkboxes, Chips, Date/Time Pickers, List Items, Radio Buttons, Segmented Buttons, Sliders, Switches, Text Fields.
* **Excluded From (Communication, Containment, Navigation Containers)**:
  * App bars, Badges, Banners, Dialogs, Menus, Navigation bars, Navigation drawers, Navigation rails, Sheets, Tabs, Tooltips.
  * *Container Rule*: The parent container (e.g. App Bar or Navigation Drawer) does not inherit states. Only the individual interactive components housed within it (e.g. icon buttons, menu items) inherit hover, focus, and press states.

---

## 16. Grids, Expressive Spacing & Density Scaling Architecture

### 16.1 Adaptive Grid Scaffold & Placement Order
* **Layout Grid Foundation**: Structural framework organizing components, content, and actions across breakpoints. Column count, width, and gutters scale dynamically with screen width.
* **Three-Step Placement Sequence**:
  1. **Place Grid Columns**: Determine active column count (4 cols on compact, 8 on medium/expanded, 12 on large/extra-large).
  2. **Place Edge Bars & Rails**: Populate perimeter regions closest to screen boundaries (top app bar, bottom navigation bar, leading navigation rail).
  3. **Place Content Panes**: Populate the primary screen region with 1–3 content and component panes according to canonical layout patterns.

### 16.2 Rulers & Global Alignment Guidelines
* **Global Alignment Rulers**: Opinionated horizontal and vertical alignment lines enforcing consistent focal points and visual rhythm:
  * **Bar & Safety Rulers**: Align to the inner boundaries of system UI elements (status bar, gesture navigation bar) to guarantee no interactive controls are obscured.
  * **Title Ruler**: Creates rigid baseline alignment for screen titles, leading icons, and primary actions in top app bars.
  * **Content Rulers**:
    * *First Content Ruler*: Anchors major focal blocks (hero banners, primary headlines, primary filter bars).
    * *Secondary Content Rulers*: Anchor supplementary metadata, auxiliary text, and secondary action clusters.
  * **Margin Rulers with Wiggle Room**: Flexible margin bounds allowing expansion or contraction of negative space to create focused or spacious expressive moments.

### 16.3 Spacing Principles: Grouping, Attention & Expression
* **Grouping Content**:
  * **Implicit Grouping**: Relies on close proximity and surrounding white space (e.g. carousel cards, captions under images) without rigid borders.
  * **Explicit Grouping**: Employs keyline borders, dividers, or elevated cards to delineate actionable or distinct content clusters.
* **Directing Attention**:
  * **Rhythm**: Uniform horizontal and vertical spacing across cards and list items guides eye movement predictably.
  * **Similarity**: Identical dimensions, paddings, and styles for repeating elements (e.g. leading avatars, thumbnails) establish visual parity.
  * **Proximity**: Positioning actionable buttons adjacent to the content they modify signals immediate causal relationship.
  * **Continuity**: Arranging related controls in a horizontal row or vertical column (e.g. filter chips) communicates a single unified toolset.
* **Spacing as Expression**:
  * Use generous negative space and bright surfaces to elevate the most critical institutional actions and focal points.

### 16.4 Information Density & Component Density Scale
* **Information Density Definition**: The volume of content (text, data, actions) visible within a given viewport area.
  * *High Density Scenarios*: Data tables, audit logs, grade rosters, financial ledgers, and complex forms.
  * *Comfortable / Low Density Scenarios*: Onboarding workflows, marketing pages, focus modes, and critical user alerts.
* **Component Density Scale**:
  * **Scale 0 (Default)**: Baseline standard component height and padding (48dp height for inputs/buttons).
  * **Scale -1 (Compact)**: Decreases vertical padding or overall height by 4dp (44dp height).
  * **Scale -2 (Dense)**: Decreases height by 8dp (40dp height).
  * **Scale -3 (Ultra-Dense)**: Decreases height by 12dp (36dp height).
* **Density Invariants**:
  * **Font Size Preservation**: Text font size and line height must **never shrink** when applying component density.
  * **Centering Invariant**: All labels, icons, and input text must remain vertically centered within their reduced containers.
  * **User Opt-In Mandate**: High density must **never be applied by default**. Users must be provided an accessible toggle in settings to choose dense modes.
  * **Prohibited Components**: Never apply component scaling to focused selection menus, dialogs, or snackbar alerts.

### 16.5 Accessible Target Bounds & Pixel Density Formulas
* **Touch Target Invariant**:
  * Interactive elements must preserve a minimum touch hit target of **48&times;48dp** (minimum 44&times;44px CSS per WCAG AAA), even if the visual element (e.g. 24dp icon or dense button) is smaller. Use `::before` or `::after` pseudo-elements to expand invisible hit boundaries.
* **Pixel Density & dp Formulation**:
  * Density-independent pixels (`dp`) guarantee uniform physical sizing across varying screen DPIs:
    * `dp = (width in pixels * 160) / screen density (DPI)`
    * `Pixel Density = screen dimension (pixels) / physical dimension (inches)`

---

## 17. Adaptive Breakpoints & The 5 Transformation Vectors

### 17.1 Five Breakpoint Classes & Device Topology
* **Breakpoint Concept**: Opinionated window sizes where layouts adapt to match available physical space, user interaction modes, and device conventions.
* **The 5 Universal Breakpoints**:
  1. **Compact (<600dp)**: Phones in portrait. 1 Pane layout. Stack navigation, bottom navigation bar, full-screen dialogs, bottom sheets.
  2. **Medium (600–839dp)**: Tablets in portrait, unfolded foldables in portrait. 1 pane recommended (2 panes permitted only for low-density/quick-action views). Collapsed navigation rail, modal expanded rail, simple dialogs, menus.
  3. **Expanded (840–1199dp)**: Phones in landscape, tablets in landscape, unfolded foldables in landscape, desktop. 2 panes recommended. Standard expanded navigation rail, simple dialogs, menus.
  4. **Large (1200–1599dp)**: Desktop monitors, laptops. 1 or 2 panes recommended. Standard expanded navigation rail, simple dialogs, menus.
  5. **Extra-Large (≥1600dp)**: Ultrawide desktop monitors, multi-window displays. 1 to 3 panes recommended (using standard side sheet as 3rd pane). Expanded navigation rail.
* **Height Breakpoints**: Vertical window size classes (compact, medium, expanded height). Primarily used to adjust fixed vertical headers when available vertical height is unusually constrained (e.g. landscape phone or multi-window split).

### 17.2 The Five Transformation Questions Across Breakpoints
When transitioning an interface across breakpoints, evaluate these 5 core transformation vectors:

1. **What should be revealed?**
   * Expose secondary features, actions, and panes hidden on smaller viewports.
   * *Example*: Navigation rail opens from collapsed icons to expanded drawer with labels; secondary detail pane reveals conversation or grading roster side-by-side.
2. **How should a screen be divided?**
   * Partition the screen into 1, 2, or 3 panes based on available width:
     * Compact & Medium: 1 pane recommended to maintain focus and prevent visual crowding.
     * Expanded & Large: 2 panes co-planar (master-detail).
     * Extra-Large: Up to 3 panes (master list + detail workspace + utility side sheet).
   * *Immersive Single-Pane Exemption*: Distraction-free workflows (video calls, assessments, exams, media players) should remain single-pane regardless of breakpoint.
3. **What should be resized?**
   * UI elements (cards, feeds, lists, containers) grow proportionally to fill container bounds.
   * *Line-Length Invariant*: Always adjust margins, columns, and type scales to maintain optimal body reading length between **40–60 characters per line (CPL)**. Never allow lines to span excessively across wide viewports.
4. **What should be repositioned?**
   * Reflow components to match device ergonomics and input modalities.
   * *Ergonomic Reachability*: Shift primary actions from bottom bars (mobile thumb zone) to leading edge rails (desktop cursor/mouse zone).
   * *Centered Anchoring*: When button or card containers stretch horizontally, keep internal icons and text labels centered and anchored together.
5. **What should be swapped?**
   * Exchange components with functionally equivalent alternatives tailored to the ergonomic reality of the target breakpoint:
     * *Navigation*: Bottom Navigation Bar (Compact) &rarr; Collapsed Navigation Rail (Medium) &rarr; Expanded Navigation Rail / Drawer (Expanded/Large).
     * *Communication*: Full-screen Dialog (Compact) &rarr; Basic Centered Modal Dialog (Medium/Expanded).
     * *Selection & Tools*: Bottom Sheet (Compact) &rarr; Dropdown Menu or Side Sheet (Medium/Expanded/Large).
   * *Prohibition on Invalid Swaps*: Never swap components that are not functionally equivalent (e.g. never swap a Button for a Chip, or a Button for a Menu).

### 17.3 Component Swapping Matrix Across Breakpoints

| Component Function | Compact (<600dp) | Medium (600–839dp) | Expanded & Large (840–1599dp) | Extra-Large (≥1600dp) |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Navigation** | Bottom Navigation Bar | Collapsed Navigation Rail | Standard Expanded Nav Rail / Drawer | Expanded Drawer + Utility Rail |
| **Secondary Nav Rail** | Modal Expanded Rail | Modal Expanded Rail | Standard Persistent Rail | Persistent 240px Drawer |
| **Modal Communication** | Full-Screen Dialog | Basic Centered Dialog | Basic Centered Dialog | Centered Dialog / Palette |
| **Contextual Menus** | Bottom Sheet | Dropdown Menu | Dropdown Menu / Context Menu | Cascading Context Menu |
| **Auxiliary Sheets** | Modal Bottom Sheet | Floating Modal Sheet | Side Sheet (Co-planar or Floating) | Standard Side Sheet (3rd Pane) |

---

## 18. Canonical Layout Archetypes Architecture: Feed, List-Detail & Supporting Pane

### 18.1 Feed Layout Architecture & Multi-Column Grid Reflow
* **Architectural Purpose**: Provides rapid scanning, continuous browsing, and discovery across large collections of cards, media assets, and institutional activity feeds.
* **Component Composition**: Uses flexible card containers with varied sizing (compact cards, banner cards, and media blocks) arranged on an adaptive column grid.
* **Breakpoint Scaling Rules**:
  * **Compact (<600dp)**: 1-column vertical stack; all cards stretch to fill 100% of the pane width.
  * **Medium (600–839dp)**: Reflows into a 2-column or 3-column grid; supports asymmetric card widths.
  * **Expanded & Above (≥840dp)**: Expands to 3 to 4+ columns with generous gutters; column count and widths increase dynamically.
* **Reflow Invariant**: Content order follows natural DOM reading order (top-to-bottom, left-to-right). Reflowing must never orphan actions or disrupt logical card groupings.

### 18.2 List-Detail Layout Architecture & State Persistence
* **Architectural Purpose**: Facilitates deep exploration of parent-child information hierarchies (conversations + message thread, file directories + file preview, student roster + academic profile, course list + syllabus).
* **Two-Pane Structural Split**:
  * **List Pane (Master)**: Houses selectable collection items with clear selection indicators (`#EFF5FF` fill, `#0056FF` border).
  * **Detail Pane (Child)**: Displays full contextual payload for the selected item, or a helpful placeholder empty state when no item is selected.
* **Breakpoint Behavior**:
  * **Compact (<600dp)**: Single pane visible at a time. Navigating into a detail view pushes a new stack view with a prominent Top App Bar **Back button**. The Back button must **never** appear in the list view.
  * **Medium (600–839dp)**: Single pane recommended for high information density; 2 panes co-planar permitted for lightweight browsing. Use bottom navigation or modal rails to conserve horizontal width.
  * **Expanded & Above (≥840dp)**: Permanent 2-pane co-planar layout. Selected list item displays active highlight; detail pane updates immediately without page transition. Back button is suppressed.
* **State Persistence Invariants**:
  * **Scroll Memory**: Navigating between list items must preserve the scroll position of the list pane and previously viewed detail states.
  * **Fold / Unfold Resilience**: When a foldable device unfolds or window expands, both panes display immediately with the active selection. When folding to compact, the active detail pane remains visible with an App Bar back button.

### 18.3 Supporting Pane Layout Architecture
* **Architectural Purpose**: Organizes workspaces where secondary content is meaningful **only in direct relation to primary content** (document editor + comments/version history, video lecture + live chat/telemetry, code editor + terminal output).
* **Asymmetric 2/3 and 1/3 Spatial Distribution**:
  * **Focus Area (Primary Pane)**: Occupies approximately two-thirds (~65–70%) of the window width for focused work.
  * **Supporting Area (Secondary Pane)**: Occupies the remaining space (fixed 360dp on desktop) for auxiliary contextual tools.
* **Breakpoint Placement Rules**:
  * **Compact & Medium (<840dp)**: Supporting pane stacks **below** the primary focus pane, or appears as a docked modal bottom sheet.
  * **Expanded & Above (≥840dp)**: Supporting pane sits **beside** the focus pane on the leading or trailing perimeter (typically trailing 360dp).

### 18.4 Advanced Layering & Levitate Strategy
* **Levitate Pattern**: When horizontal space is restricted or deep modal focus is required, auxiliary workflows elevate above the canvas as floating sheets or centered dialogs.
* **Task Focus**: Ideal for temporary focused tasks (comment submission, assignment grading popup, event scheduler).

### 18.5 Canonical Layout Selection & Invariants Matrix

| Canonical Archetype | Core Data Model | Compact (<600dp) | Medium (600–839dp) | Expanded & Large (≥840dp) | Primary Invariant |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Feed** | Content discovery & cards | 1-column stack | 2–3 column grid | 3–4+ column grid | Order follows DOM position & reflow |
| **List-Detail** | Parent-child pairings | 1-pane drill-down | 1-pane (rec) / 2-pane | 2-pane co-planar | Back button in 1-pane; selected highlight in 2-pane |
| **Supporting Pane** | Focus area + contextual tool | Stacked below / sheet | Stacked below / sheet | Beside (360dp fixed) | 2/3 focus + 1/3 tool; contextual dependency |

---

## 19. Usability & M3 Expressive Architecture: Five Pillars, Design Tactics & Aura Case Study

### 19.1 Usability Foundations & Nielsen Norman Group's Five Pillars
Usability focuses on making products intuitive, effortless, and easy to understand for everyone.
* **The Five Core Usability Pillars (Nielsen Norman Group)**:
  1. **Efficiency**: Experienced users perform high-frequency workflows with minimal steps, zero friction, and rapid keyboard/shortcut paths.
  2. **Error Prevention & Recovery**: Clear affordances, non-destructive defaults, and explicit confirmation dialogs reduce mistakes; contextual undo toasts allow immediate error reversal.
  3. **Learnability**: First-time users navigate interfaces and complete core onboarding flows intuitively without external documentation or formal training.
  4. **Memorability**: Returning users immediately recognize interface patterns, tool locations, and layout structures after periods of inactivity without relearning.
  5. **Satisfaction**: Users experience a calm, pleasant, aesthetically harmonious, and predictable software environment.
* **Usability vs. Accessibility Demarcation**:
  * **Accessibility (WCAG 2.1 AAA)**: Ensures digital products are perceivable, operable, understandable, and robust for individuals with permanent, temporary, or situational disabilities (screen readers, switch controls, keyboard focus, high-contrast ratios).
  * **Usability**: Ensures digital products are intuitive, cognitive-load minimized, scannable, and efficient for all users across general workflows.

### 19.2 The Six M3 Expressive Design Tactics
Research indicates participants locate key UI elements up to **four times faster** in M3 Expressive layouts by leveraging six deliberate design tactics:
1. **Color & Color Contrast**:
   * Use high-contrast primary color roles for core actions and secondary/tertiary roles for supportive controls.
   * Employ contrasting color pairings (e.g. Deep Purple vs Vibrant Yellow accents; Royal Blue `#0056FF` vs Light Ice Blue `#EFF5FF`).
   * Never rely solely on color to communicate state or critical information.
2. **Containment & Grouping**:
   * Encapsulate related controls and data points within subtle container cards (`#FFFFFF`, `#EFF5FF`, `#E3E7FC`) with 1px keyline borders (`#CAD3F5`).
   * Group supportive settings into clean list containers rather than leaving them floating uncontained.
3. **Purposeful Motion**:
   * Reserve expressive motion for hero moments, pacing guidance, and celebration milestones (e.g. rhythmic pulsating flower guides for breathing cycles).
   * Utilize physics-based spring tokens (`damping: 24, stiffness: 220`) for fluid natural movement.
   * Use motion sparingly to avoid distracting users or triggering vestibular discomfort.
4. **Shape & Shape Morph**:
   * Leverage the 35-shape Material library (e.g. "flower", "sunny", "pill", "rounded-rect") to mask imagery, containerize metrics, and set an emotional tone.
   * Apply shape morphing to communicate dynamic interaction states (tap, swipe, selected, long press) and actions in progress.
5. **Size & Scale Hierarchy**:
   * Scale corresponds directly to hierarchy: the primary Call-To-Action (CTA) must be the largest element on the screen.
   * Subordinate actions must scale down proportionally (Extra Large CTA &rarr; Medium Button &rarr; Text Button).
6. **Typography & Scannability**:
   * Large, legible headlines immediately establish primary tasks; smaller, subdued subheads signal secondary metadata.
   * Sentence-case formatting preserves natural reading velocity.

### 19.3 Goal Hierarchy Architecture: Primary, Secondary & Tertiary Workflows
* **Primary Goals (Singular Hero Action)**:
  * Maximum one primary goal per screen (e.g. "Start Session", "Submit Grade", "Record Attendance").
  * Highest visual weight, largest button container, high-contrast primary color role, and easy thumb-reach bottom placement.
* **Secondary Goals (Supportive Configurations)**:
  * Supportive actions required to customize or conclude the primary workflow (e.g. Duration switch, Sound settings, "Finish Report").
  * Packaged into contained list items, medium-sized buttons, or secondary color roles.
* **Tertiary Goals (Historical & Informational Telemetry)**:
  * Informational, non-blocking telemetry (e.g. Daily motivational quote, historical progress calendar, completion badges).
  * Rendered with muted typography, soft container backgrounds, and subtle accent shapes.

### 19.4 Case Study: Aura Holistic Breathing Experience
The Aura application illustrates M3 Expressive usability across 4 distinct user goals:
* **Screen 1: Start Breathing Session (Primary Intent)**:
  * *Primary CTA*: Extra Large "Start Breathing" button placed at the bottom for thumb reach; high-contrast primary fill.
  * *Secondary Settings*: Duration, Sound, and Haptics grouped neatly into a subtle contained card list.
  * *Tertiary Welcome*: Calm daily message positioned at top in a soft blue container with medium typography.
* **Screen 2: Breathing Session Hero Moment (Deep Flow)**:
  * *Hero Visual*: Expanding and contracting organic flower shape with spring motion, guiding inhalation, holding, and exhalation rhythms.
  * *Emphasized Typography*: Massive countdown timer numbers paired with concise instructional cues ("Inhale", "Hold", "Exhale").
  * *Subordinate Controls*: Small, subdued Pause and Stop icon buttons anchored at the bottom edge; navigation bar is hidden to eliminate distraction.
* **Screen 3: Breathing Session Summary (Secondary Goal)**:
  * *Scannable Metrics*: Key achievements (breaths taken, heart rate, minutes completed) enclosed in friendly Material flower containers.
  * *Finish CTA*: Centered medium button at screen bottom providing a definitive closure action.
* **Screen 4: Long-Term Progress (Tertiary Goal)**:
  * *Calendar Visualization*: Monthly calendar grid featuring subtle flower-shaped highlight markers on completed days.
  * *Consistent Rhythm*: Equal vertical spacing between stats, avoiding visual clutter and supporting rapid scanning.

### 19.5 Testing, Iteration & Anti-Clutter Rules
* **Version 1 (Cluttered Anti-Pattern)**:
  * Multiple large controls competing for attention simultaneously.
  * Uncontained settings scattered across canvas.
  * Irregular, overlapping shape sizes and mismatched color roles.
  * Distracting kinetic typography shifting while shapes animate.
* **Version 2 (Calm M3 Expressive Pattern)**:
  * Singular dominant primary CTA with clear visual hierarchy.
  * Neatly grouped settings in a cohesive container card.
  * Uniform shapes, consistent margins, and predictable vertical flow.
  * Steady typography with motion confined exclusively to the hero guidance element.

### 19.6 Usability & M3 Expressive Invariants Matrix

| Usability Vector | Flawed Anti-Pattern (V1) | M3 Expressive Standard (V2) | Architectural Invariant |
| :--- | :--- | :--- | :--- |
| **Focal Point** | Multiple equally large buttons competing | 1 dominant CTA (Extra Large) at bottom | Single primary goal per view |
| **Settings** | Loose, uncontained switches and toggles | Contained list card with 1px border | Contained proximity grouping |
| **Color Roles** | Same primary role used for all items | Primary on CTA; Secondary on settings | Strict semantic role separation |
| **Shapes** | Overlapping, non-uniform random shapes | Consistent 35-shape tokens with padding | Uniform shape grid alignment |
| **Motion** | Competing text shifts & bouncing graphics | Single hero spring motion element | Zero competing animation vectors |
| **Cognitive Load** | Cluttered canvas with >7 focal areas | 1 primary + 1 supportive container | Miller's Law chunking (≤3 groups) |
