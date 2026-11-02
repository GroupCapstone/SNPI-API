# Material Design 3 (M3) A-Z Lexicon & Architectural Standard

Authoritative engineering and design reference covering all foundational principles, component patterns, HCT color science, motion tokens, adaptive window classes, and design token hierarchies in Material Design 3.

---

### A
- **Adaptive Design**: Interface methodology where layouts, components, and navigation structures dynamically reconfigure based on window size classes, device form factors, and postures.
- **Anchor**: The target reference element to which transient surfaces like tooltips, menus, and popovers attach in coordinate space.
- **App Bar (Top)**: Persistent header surface displaying screen title, navigation icons, and contextual actions in Center-aligned, Small, Medium, or Large configurations.
- **App Bar (Bottom)**: Ergonomic bottom navigation container hosting primary actions, FAB dock, and overflow menus on handheld mobile viewports.
- **Asymmetry**: Purposeful visual balance differentiation used in cards and editorial layouts to create natural reading hierarchy without rigid grid constraints.

### B
- **Badge**: Compact dot or numerical pill affixed to icons or navigation tabs communicating unread counts or system alerts.
- **Banner**: Prominent messaging container displayed below top app bars communicating urgent system status with optional contextual actions.
- **Baseline Scheme**: The default group of 13-tone palettes and mappings establishing light and dark theme colors prior to dynamic color derivation.
- **Bottom Sheet**: Supplementary surface anchored to the bottom of the viewport; available as Standard (coexists with content) or Modal (scrim-occluded).
- **Button**: Primary trigger component across five structural hierarchy tiers: Elevated, Filled, Filled Tonal, Outlined, and Text.

### C
- **Card**: Contained surface unit grouping related information, media, and actions in Elevated, Filled, or Outlined styles.
- **Checkbox**: Selection control enabling binary or multi-item selection within a set, supporting checked, unchecked, and indeterminate states.
- **Chip**: Compact interactive pill for filtering, input entry, contextual actions, and suggestions across Assist, Filter, Input, and Suggestion types.
- **Color Roles**: Semantic color assignments across Primary, Secondary, Tertiary, Error, Surface, Surface Variant, and their On-color counterparts.
- **Color Scheme**: Mathematical mapping of color roles to specific tonal values derived from tonal palettes for light, dark, and high-contrast modes.
- **Compact Window Class**: Window width breakpoint below 600dp representing smartphones in portrait orientation and single-column ergonomics.
- **Condition**: Environmental, user preference, or device signal (viewport width, orientation, high-contrast mode) driving adaptive layout re-rendering.
- **Container**: The physical bounding shape, fill color, and elevation level defining the structural surface of a component.
- **Container Transform**: Seamless spatial motion transition smoothly morphing one container boundary into another (e.g., list item expanding into full detail screen).
- **Contrast**: Tone lightness delta; Tone delta >= 40 guarantees WCAG AA (3.0:1) and Tone delta >= 50 guarantees WCAG AAA (4.5:1) accessibility.
- **Color: User-Generated Schemes**: Aspect of dynamic color describing colors derived and applied from an individual user wallpaper selection or Android system presets.
- **Customization**: Targeted token or component overrides expressing product brand preferences without breaking system accessibility and contrast guarantees.

### D
- **Dark Theme**: Low-luminance user interface displaying primarily dark surfaces to reduce eye fatigue and minimize display power consumption.
- **Data Table**: Tabular grid component presenting structured rows and columns with sorting, pagination, and multi-row selection controls.
- **Date Picker**: Modal or docked surface allowing users to select single calendar dates or date ranges via calendar grid or manual text inputs.
- **Design Attribute**: The specific visual property governed by a design token (color, font family, font size, tracking, line height, corner radius, elevation).
- **Design Guidelines**: Descriptive written and illustrated docs demonstrating usage and behavior through examples; long-form specs guiding decision-making.
- **Design Specs**: Annotated designs and engineering specifications defining values, tokens, and coded capabilities of components.
- **Design System Package (DSP)**: Open-format folder structure enabling multi-brand design tokens to sync between design tools, repositories, and build pipelines.
- **Design Tokens**: Standardized named parameters replacing hardcoded values; organized hierarchically into Reference, System, and Component tokens.
- **Dialog**: Modal interrupt container requiring immediate user acknowledgment or action in Basic, Confirmation, or Full-screen formats.
- **Divider**: Thin 1px visual rule separating groups of content within lists, cards, and navigation panels without adding structural z-axis elevation.
- **Drag State**: Transient interaction state applied when an element is actively moved by touch or cursor (16% state layer opacity overlay).
- **Dynamic Color**: Algorithmic color engine (Monet) deriving personalized, contrast-safe 5-key palettes directly from user wallpaper or custom brand seeds.

### E
- **Easing**: Cubic Bézier velocity curves assigned to motion tokens: Emphasized (spatial), Standard (small adjustments), Decelerate (enter), and Accelerate (exit).
- **Element**: Granular sub-part of a component governed by tokens (container, leading icon, trailing icon, label text, supporting text, state layer).
- **Elevation**: Relative z-axis surface depth rendered primarily through surface tint shifts and soft ambient shadows across Levels 0 (0dp) through 5 (12dp).
- **Expanded Window Class**: Window width breakpoint at 840dp or higher representing desktop monitors, large tablets, and multi-pane spatial workflows.
- **Extended Color**: Harmonized custom color roles mapped alongside standard key colors to support domain-specific semantic statuses or unique brand accents.
- **Extended FAB**: Wider floating action button pairing an icon with an explicit text label for maximum affordance on primary screen workflows.

### F
- **Floating Action Button (FAB)**: Prominent high-elevation button hovering over interface content representing the single most critical or constructive action on a screen.
- **Focus Ring**: High-visibility dual-layer outline (3px stroke with 2px offset) surrounding active keyboard-navigated components for accessibility.
- **Focus State**: Interaction state indicating an element is selected via keyboard Tab navigation (10% state layer opacity overlay).

### G
- **Gesture Navigation**: Touch swipe patterns (predictive back, edge drag) directly synchronizing component translations with finger movement before commit.
- **Grid (Layout Grid)**: Adaptive column system (4 columns mobile, 8 columns tablet, 12 columns desktop) with standardized 16dp / 24dp gutters and margins.
- **Grouping**: Visual clustering of logically related controls, fields, or metadata into discrete cards and sections to optimize cognitive scanning.

### H
- **HCT (Hue, Chroma, Tone)**: Perceptually uniform color space enabling automated accessible color palette generation while mathematically preserving contrast ratios.
- **Hover State**: Interaction state triggered when a pointing cursor hovers over an interactive container (8% state layer opacity overlay).

### I
- **Icon Button**: Compact 40-48dp interactive boundary framing a vector icon across Standard, Filled, Filled Tonal, and Outlined variants.
- **Image List**: Organized grid collection of image items rendered in Standard (uniform square), Woven (rhythmic cadence), or Masonry (variable aspect) layouts.
- **Interaction States**: Standardized interaction layers covering Enabled, Hovered, Focused, Pressed, Dragged, and Disabled states via state layer overlays.

### J
- **Jetpack Compose M3**: Modern declarative Android UI toolkit natively implementing Material Design 3 tokens, components, and dynamic color integrations.

### K
- **Key Color**: Color extracted and mathematically adjusted in hue and chroma from a source seed to establish the basis of a 13-tone tonal palette.

### L
- **Libraries**: Official engineering implementations supporting M3 across Web (MDC Web), Android (Jetpack Compose), Flutter, and React/Next.js.
- **List**: Continuous vertical sequence of items arranged with single-line, two-line, or three-line text with optional leading avatars and trailing controls.

### M
- **Material Components (MDC)**: Production-ready UI components created by Google engineers implementing Material Design guidelines with enterprise reliability.
- **Material Design 3 (M3)**: The third major evolution of Google Material Design, featuring dynamic personalization, HCT color science, and adaptive window classes.
- **Material Theme Builder (MTB)**: Tooling ecosystem generating custom color tokens, JSON specs, and CSS variables from user-provided hex codes or brand logos.
- **Material Theming**: The systematic customization of Material Design to express product branding across color, elevation, shape, and typography for varying user contexts.
- **Mode**: Binary system setting assisting device utilization, including Focus mode, airplane mode, and battery saver mode.
- **Medium Window Class**: Window width breakpoint between 600dp and 839dp (tablets in portrait, foldable devices, and split-screen browser panes).
- **Menu**: Transient surface anchored to a trigger displaying a vertical list of actionable choices on an elevated card surface.
- **Modal**: Focused interaction mode that disables interaction with underlying parent surfaces via a semi-transparent scrim until explicitly dismissed.
- **Motion Tokens**: Systematic animation timing values (50ms to 1000ms) paired with standardized easing curves to guarantee harmonic transitions.

### N
- **Navigation Bar**: Bottom-docked persistent bar with 3 to 5 destinations designed for handheld mobile viewports under 600dp.
- **Navigation Drawer**: Side-sliding panel providing deep multi-level destination routing; configured as Standard (permanent desktop) or Modal (mobile overlay).
- **Navigation Rail**: Vertical left-docked bar displaying primary destinations and optional FAB on medium (tablet) and expanded (desktop) screen sizes.

### O
- **On-Colors**: High-contrast foreground colors engineered specifically to render legible text and icons atop corresponding container colors.
- **Opacity**: Relative transparency values assigned to scrims (32%), disabled elements (38%), and state layers (hover 8%, focus 10%, press 10%, drag 16%).
- **Orbiter**: Floating controls hovering around 3D spatial window panels in XR and vision environments to manipulate content without blocking canvas space.

### P
- **Pane**: Modular surface block holding related content and actions that rearranges dynamically into canonical multi-pane layouts.
- **Predictive Back**: Interactive gesture transition providing real-time visual previews of previous destinations during swipe gestures before releasing.
- **Pressed State**: Physical activation feedback state triggered during touch or mouse press, combining a 10% state layer overlay with expanding radial ink ripple.
- **Progress Indicator**: Visual feedback element indicating active system processing; rendered as Circular spinners or Linear track bars in determinate or indeterminate modes.

### Q
- **Quick Controls**: High-priority interactive toggle cards and micro-switches providing instant access to frequent hardware and network states.

### R
- **Radio Button**: Circular selection control allowing users to select exactly one mutually exclusive option from a defined set.
- **Reference Token**: Base token in the token hierarchy mapping directly to physical values (hex codes, pixel dimensions, millisecond durations).
- **Ripple**: Fluid radial ink expansion animation originating from the exact touch contact point to provide instant physical feedback.
- **Role (Design Token Slot)**: Semantic identifier defining the specific purpose of a token within a design system rather than its raw literal color.

### S
- **Scrim**: Semi-transparent dark backdrop overlay (32% opacity) rendered behind modal dialogs, drawers, and bottom sheets to occlude background interaction.
- **Search Bar & Search View**: Docked text field transforming seamlessly into a full-screen search results view with recent query history upon focus.
- **Segmented Button**: Conjoined linear row of buttons enabling users to toggle views, sort tables, or filter options in single or multi-select modes.
- **Shape Tokens**: Systematic corner radius scale: None (0px), Extra-Small (4px), Small (8px), Medium (12px), Large (16px), Extra-Large (28px), and Full (Pill/Circle).
- **Side Sheet**: Supplementary surface anchored to the right or left edge of the viewport containing secondary tools, properties, or detail views.
- **Slider**: Interactive track control allowing users to pick numerical values across a continuous or discrete range using a sliding thumb.
- **Snackbar**: Compact, low-elevation message container appearing temporarily at the screen bottom to confirm an operation with an optional single action.
- **Source Color**: Initial input seed color extracted from brand imagery or wallpaper that initiates the entire HCT dynamic color palette generation algorithm.
- **Spatial & XR**: Design standards and depth coordinates governing the placement of Material cards, panels, and orbiters in 3D mixed and virtual reality spaces.
- **State Layer**: Semi-transparent color overlay rendered over an element container to communicate user interaction states without altering container tokens.
- **Style**: One or more customizable visual properties defining an aspect of an interface appearance, such as color, typography, or shape.
- **Surface**: The foundational background canvas hosting UI components, differentiated through tonal elevation rather than harsh black drop shadows.
- **Switch**: Binary toggle control shifting system states between on and off with an animated gliding thumb and optional icon indicator.

### T
- **Tab**: Navigation control organizing content across screens, datasets, and categorical views in Primary (underline indicator) or Secondary (pill) styles.
- **Text Field**: Input component capturing user text entry via Filled (solid container with bottom line) or Outlined (bordered perimeter) architectures.
- **Theme**: Unified global collection of color roles, typography tokens, elevation levels, and shape scales applied consistently across an app.
- **Time Picker**: Interactive clock dial or numeric entry modal facilitating hour, minute, and AM/PM time configuration.
- **Tonal Palette**: 13-step lightness gradation (tones 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100) generated for each of the five key colors.
- **Tone**: Perceptual measure of lightness within HCT color space ranging from absolute black (0) to pure white (100).
- **Toolbar**: Ergonomic horizontal container displaying navigation and primary actions along the bottom of mobile viewports.
- **Tooltip**: Brief informative label appearing on hover, focus, or long-press; formatted as Plain (short text) or Rich (with title and actions).
- **Typography**: 15-token hierarchical type scale divided across Display, Headline, Title, Body, and Label styles in Large, Medium, and Small.

### U
- **User-Generated Scheme**: Dynamic color scheme derived in real time from an individual user device wallpaper selection or OS preset accent colors.

### V
- **Variable Font**: Single font file containing continuous design axes (weight, width, optical size) enabling fluid micro-adjustments without multiple file downloads.
- **Visual Hierarchy**: Deliberate spatial and tonal ordering of elements through contrast, elevation, scale, and placement to guide attention naturally.

### W
- **Window Size Classes**: Standardized viewport width breakpoints: Compact (<600dp), Medium (600-839dp), and Expanded (>=840dp) governing responsive ergonomics.

### X
- **XR (Extended Reality)**: Spatial interface paradigm blending physical environments with virtual floating Material panels, depth shadows, and orbiters.

### Z
- **Z-Axis (Elevation Mapping)**: Perpendicular depth dimension along which elevation levels (0dp to 12dp), modal scrims, shadows, and z-index layering are structured.
