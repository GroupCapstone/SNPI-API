# Core Components Design System Manual

This document is the authoritative design system specification for the 27 Core Components across the SNP-SMS platform, documenting their definitions, categories, invariant verification checklists, responsive adaptations, and accessibility standards.

---

## Architecture & Hierarchy

Components are the primary atomic building blocks for user interfaces. Building a reusable component library enhances product development workflow by eliminating technical debt, enforcing accessibility invariants, and accelerating delivery velocity. Core components cannot be broken down into granular pieces without losing their distinct semantic meaning.

* **Total Registered Core Primitives**: 29
* **Total Verification Checkpoints**: 166
* **Category Taxonomy**: Structure, Feedback, Media, Action, Navigation, Form

---

## 1. Structure Components

### C1. Accordion (0/4)
* **Definition**: Accordion toggles the visibility of content regions when the trigger element gets pressed.
* **Verification Checkpoints**:
  1. `Active state`: Comes in two states for toggling its content visibility. Distinct trigger icon between open and closed.
  2. `Composition`: Content area flexible enough to support various types of content, including other components.
  3. `Toggle transition`: Subtle height and opacity animation to help users understand component behavior.
  4. `Content and trigger relation`: Focusing content area with assistive technologies announces additional context from trigger element.

### C8. Card (0/5)
* **Definition**: Container to group information about subjects and their related actions.
* **Verification Checkpoints**:
  1. `Content composition`: Flexible body container supporting arbitrary text, metrics, and nested controls.
  2. `Media sections`: Top full-width media banner or horizontal side thumbnail integration.
  3. `Supplementary actions`: Footer action buttons or full-surface clickable card with hover elevation.
  4. `Responsiveness`: Adapts cleanly to full-width mobile viewports and responsive desktop grids.
  5. `Card groups`: Consistent gutter and height alignment in multi-column collections.

### C11. Divider (0/2)
* **Definition**: Element for visual content separation.
* **Verification Checkpoints**:
  1. `Direction`: Supports both horizontal rules and vertical inline dividers with flex parents.
  2. `Accessibility role`: Announced with `role="separator"` and `aria-orientation` if non-decorative.

### C16. List (0/3)
* **Definition**: Used to display a sequence of items.
* **Verification Checkpoints**:
  1. `Order`: Bulleted, numbered, unstyled, and nested styles and types of ordering.
  2. `Content composition`: Flexible content slot supporting text, badges, secondary actions, and nested components.
  3. `Accessibility role`: Assistive technologies announce lists with `role="list"` and item count.

### C18. Modal (0/8)
* **Definition**: Container appearing in front of main content to provide critical information or actionable content.
* **Verification Checkpoints**:
  1. `Content composition`: Main content area flexible enough to host forms, data summaries, and nested components.
  2. `Supplementary actions`: Dedicated bottom action row for primary confirmation, secondary cancel, and tertiary actions.
  3. `Close action`: Straightforward dismiss via top-right close button, backdrop click, or cancel action.
  4. `Positioning`: Supports centered viewport modal dialogs or sliding drawer sheets on screen edges.
  5. `Sizes display`: Supports responsive width tiers (sm 400px, md 600px, lg 840px) and max-height scrolling.
  6. `Focus trapping`: Focus moves into first focusable modal element on open and stays trapped until closed.
  7. `Keyboard navigation`: Escape key closes modal, Tab traverses internal elements, and focus returns to trigger on close.
  8. `Title and subtitle labeling`: Uses `role="dialog"` or `role="alertdialog"` with `aria-labelledby` and `aria-describedby` linkage.

---

## 2. Feedback Components

### C2. Alert (0/6)
* **Definition**: Alert displays a prominent message about the whole page or its specific area.
* **Verification Checkpoints**:
  1. `Colors`: Differentiate visual appearance based on role (info, success, warning, error) with AA standard contrast.
  2. `Title support`: Supporting a title helps users understand the context faster for longer alert messages.
  3. `Icon support`: Icon illustrates the role and provides an additional visual hint for colorblind users.
  4. `Supplementary actions`: Actions relate to text and provide a way to react to the message sent to the user.
  5. `Responsiveness`: Adapts to viewport size, becoming full-width on mobile to save space.
  6. `Accessibility roles`: Announces accessibility roles correctly via `role="alert"` or `role="status"`.

### C17. Loading Indicator (0/5)
* **Definition**: Animated element that communicates progress without telling how long the process will take.
* **Verification Checkpoints**:
  1. `Colors`: Supports multiple semantic roles and adapts to parent surface color schemes (brand blue, white on dark).
  2. `Sizes`: Predefined sizes (16dp inline, 24dp button, 48dp page center) matching rendered area.
  3. `Loading duration`: Displays continuously until completion or error, or displays elapsed/estimated progress when determinable.
  4. `Reduced motion`: Honors `prefers-reduced-motion` settings by slowing down or replacing spin with static opacity pulse.
  5. `Accessibility label`: Provides `aria-label` and `role="status"` describing the content area being loaded.

### C20. Progress Bar (0/4)
* **Definition**: Bar displaying progress for a task that takes a long time or consists of several steps.
* **Verification Checkpoints**:
  1. `Label`: Provide support for visually displaying a label explaining what a progress bar is responsible for.
  2. `Sizes`: Loading indicators might provide multiple sizes, depending on the size of the areas where the loading indicator is rendered.
  3. `Duration`: In some cases, the wait time cannot be determined. The loading indicator should be shown until loading finishes or an error happens. In other cases, it is better to indicate the time left until loading is complete.
  4. `Accessibility label`: Provide support for adding an accessibility label in case a visible text label is omitted.

### C23. Skeleton (0/4)
* **Definition**: Placeholder replacing page elements while their data is loading.
* **Verification Checkpoints**:
  1. `Sizes`: Skeleton should be able to match components of various sizes available in your design system to avoid unnecessary layout shifts once data is loaded.
  2. `Shapes`: Skeleton should be able to match components of various shapes available in your design system to keep the loading state aligned with the actual components' layout.
  3. `Composition`: You can compose simple skeletons into more advanced layouts. You don't have to 1:1 map your application interface with skeletons.
  4. `Reduced motion`: Reduce or altogether remove the animation for the reduced motion user preference.

### C28. Toast (0/8)
* **Definition**: Notification message or a piece of information displayed above the page content.
* **Verification Checkpoints**:
  1. `Content composition`: Content area should be flexible enough to support various types of content, including other components.
  2. `Colors`: Depending on the role of the notification displayed in the toast, it can come in multiple colors (e.g. red for error notifications, emerald for success).
  3. `Icon support`: Add an area for displaying an icon at the start of the toast to communicate the purpose of the notification.
  4. `Timeout`: Toasts are usually dismissed after a timeout. Make sure to provide a long enough timeout to let users read the message, or provide a close button when persistent.
  5. `Stacking`: When multiple toasts have been triggered, stack them on top of each other to avoid cluttering the screen.
  6. `Supplementary action`: Actions in the notifications should be contextual to the notification purpose (e.g. undo operation when deleting content).
  7. `Focus management`: When toasts have actions, they should be focusable from the keyboard to trigger them. While focus is inside the toast container, timeout should get disabled.
  8. `Reduced motion`: Reduce or altogether remove the animation for the reduced motion user preference.

### C29. Tooltip (0/3)
* **Definition**: Contextual text information display on element hover or focus.
* **Verification Checkpoints**:
  1. `Positioning`: When the tooltip default position doesn't let it fit into the viewport, dynamically switch its position to an alternate side (top, bottom, left, right).
  2. `Timeout`: Wait briefly before opening the tooltip to ensure it doesn't open while the user moves their cursor across the screen.
  3. `Keyboard support`: Tooltips should be accessible not only on mouse hover but also on the trigger element keyboard focus.

---

## 3. Media Components

### C3. Avatar (0/7)
* **Definition**: Thumbnail of a user photo, organization, or visual representation of content.
* **Verification Checkpoints**:
  1. `Image`: Masks image into shape and handles arbitrary source image aspect ratios safely.
  2. `Image fallback`: Shows fallback image, icon, or initials when image is missing or errors during load.
  3. `Sizes`: Supports at least 3 distinct sizes (e.g. 24px, 36px, 48px) with small size for dense tables.
  4. `Colors`: Applies background color to shape with WCAG AA contrast ratio for initials and icons.
  5. `Shape`: Supports circle and rounded square variants based on surface and branding requirements.
  6. `Avatar groups`: Stacks multiple avatars with negative margin and overflow badge (+N).
  7. `Accessibility label`: Provides accessible name for non-decorative avatars without visible text.

### C4. Badge (0/7)
* **Definition**: Compact element that represents the status of an object or user input.
* **Verification Checkpoints**:
  1. `Colors`: Predefined colors per role with WCAG AA standard contrast ratio.
  2. `Variants`: Multiple variants including filled, outlined, and subtle/faded background.
  3. `Sizes`: Multiple sizes: micro 18px for dense tables up to large 28px for marketing banners.
  4. `Icon support`: Recognizable leading or trailing icon illustrating badge context.
  5. `Dismissible action`: Close/dismiss trigger button for dynamic filter and tag selections.
  6. `Empty state`: Pill or circular dot without text preserving geometric proportions.
  7. `Positioning`: Supports absolute anchor positioning relative to icons or container corners.

### C9. Carousel (0/6)
* **Definition**: Horizontal scrollable areas used for displaying grouped content.
* **Verification Checkpoints**:
  1. `Navigation controls`: Accessible previous/next buttons for mouse users.
  2. `Item composition`: Flexible item slots supporting cards, banners, or mixed components.
  3. `Item sizes`: Displays peek of next item on mobile to visually cue horizontal scrollability.
  4. `Touch navigation`: Hardware-accelerated touch swipe gestures with momentum snap.
  5. `Responsiveness`: Dynamically adjusts visible slide count based on container breakpoint.
  6. `Keyboard navigation`: Focusable slides and arrow-key navigation without mouse dependency.

### C13. Icon (0/3)
* **Definition**: Wrapper for SVG assets to control their appearance.
* **Verification Checkpoints**:
  1. `Colors`: Supports color values available in design system tokens; supports color inheritance from parent element.
  2. `Sizes`: Several predefined sizes (16dp, 20dp, 24dp, 32dp) paired with typography scale for visual alignment.
  3. `Interactivity`: Decorative default; interactive functionality encapsulated inside buttons, links, or action controls.

### C14. Image (0/4)
* **Definition**: Utility for displaying images and controlling their behavior.
* **Verification Checkpoints**:
  1. `Sizes`: Flexible width and height with CSS aspect-ratio support to scale proportions dynamically based on parent container.
  2. `Image fallback`: Displays an empty box with background, icon, or static placeholder image when URL is incorrect or undefined.
  3. `Screen density support`: Supports responsive `srcset` loading of 1x, 2x, and 3x assets to serve the optimal resolution.
  4. `Alt text`: Provides concise, meaningful alt text describing picture contents when non-decorative (or empty `alt=""` for decorative).

---

## 4. Action Components

### C5. Button (0/10)
* **Definition**: Interactive element used for single-step actions.
* **Verification Checkpoints**:
  1. `Colors`: Role-based colors (primary blue, neutral slate, destructive red) with WCAG AA contrast.
  2. `Variants`: Five tiers: Filled, Filled Tonal, Elevated, Outlined, and Text.
  3. `Sizes`: Multiple sizes (sm 32px, md 40px, lg 48px) adhering to min 44px touch targets on mobile.
  4. `Icon support`: Icon + label, label-only, and icon-only with mandatory aria-label.
  5. `Hover state`: Clear visual cue and background tint transition on pointer hover.
  6. `Active state`: Subtle scale-down or elevation drop on press.
  7. `Loading state`: Embedded spinner replacing content without altering button dimensions.
  8. `Disabled state`: Visually non-interactive with disabled attributes and `pointer-events: none`.
  9. `Accessibility role`: Resolves button or anchor link role automatically based on `href`.
  10. `Focus indicator`: Visible 2-3px focus ring on keyboard Tab navigation.

### C12. Dropdown (0/6)
* **Definition**: List of contextual actions that users can trigger.
* **Verification Checkpoints**:
  1. `Content composition`: Flexible menu surface supporting action items, subheaders, and dividers.
  2. `Hover trigger`: Optional hover trigger with focus synchronization for keyboard users.
  3. `Dynamic positioning`: Floating collision detection keeping menu visible within viewport.
  4. `Responsiveness`: Floating popover on desktop, converts to bottom sheet on mobile.
  5. `Focus trapping`: Focus moves into menu on open and returns to trigger upon dismiss.
  6. `Keyboard navigation`: Arrow keys navigate items, Escape or Tab out closes menu.

---

## 5. Navigation Components

### C6. Breadcrumbs (0/4)
* **Definition**: Top-level product navigation that helps user understand current page hierarchy and navigate back.
* **Verification Checkpoints**:
  1. `Icon support`: Communicates roles of pages linked in breadcrumbs consistently.
  2. `Disabled state`: Current page item disabled from clicking with `aria-current="page"`.
  3. `Collapsed state`: Truncates long path hierarchies into an ellipsis dropdown.
  4. `Custom separator`: Supports slashes, chevrons, or arrows between path segments.

### C15. Link (0/6)
* **Definition**: Interactive text element used for navigation within text paragraphs.
* **Verification Checkpoints**:
  1. `Icon support`: Leading or trailing icon communicating purpose; icon not used without text label.
  2. `Colors`: Predefined semantic role color; inherits color from parent element automatically.
  3. `Disabled state`: Visually shows non-interactivity and restricts pressing.
  4. `Font inheritance`: Inherits typography styles when used as part of a text element.
  5. `Multiline display`: Supports multiline wrapping inside text paragraphs without breaking layout flow.
  6. `Accessibility role`: Automatically resolves `a` or `button` accessibility role based on properties.

### C19. Pagination (0/6)
* **Definition**: Pagination enables a selection from a range of pages.
* **Verification Checkpoints**:
  1. `Selected page state`: Visually highlights active page number with brand fill and makes it non-interactive (`aria-current="page"`).
  2. `Page display ranges`: Renders bounded range around active page (e.g. 1 ... 4 [5] 6 ... 20) with ellipsis jump buttons.
  3. `Amount of items per page`: Provides dropdown to select 10, 25, 50, or 100 items per page with live recount.
  4. `Indeterminate amount of pages`: Supports cursor-based previous/next mode when total count is unknown beforehand.
  5. `Full page label announcements`: Provides dynamic `aria-label` ("Page 5 of 20", "Go to page 6") instead of bare numbers.
  6. `State announcement`: Screen reader announces active page selection upon focus or page transition.

### C25. Tabs (0/7)
* **Definition**: Navigation between multiple pages or content sections.
* **Verification Checkpoints**:
  1. `Content composition`: Content area should be flexible enough to support various types of content, including other components.
  2. `Variants`: To support different rendering contexts, tabs might support multiple variants. For example, they might be rendered as pills when used directly on the page while using an underlined variant for tabs rendered inside cards.
  3. `Selected state`: Since tabs always display the content from one of their panels, one of the tab triggers should always be selected and highlighted visually.
  4. `Disabled state`: Tab triggers can be disabled to prevent users from switching to a specific tab panel.
  5. `Icon support`: To better illustrate the meaning of each tab, you can display an icon next to the tab trigger text.
  6. `Equal width layout`: When used to take the entire width of the parent container, tab triggers can be stretched to take equal horizontal space.
  7. `Keyboard support`: When interacting with tabs using the keyboard, they should support arrow navigation to switch between the previous and next panels. The Home and End buttons should also move the selection to the first and last panels, respectively.

---

## 6. Form Components

### C7. Calendar (0/7)
* **Definition**: Grid displaying days in one or more months allowing users to select a single date or date range.
* **Verification Checkpoints**:
  1. `Display modes`: Supports single-month card, multi-month grid, and vertical mobile layouts.
  2. `Selected state`: Visually highlights selected single dates and range spans between start/end.
  3. `Month selection`: Fast switching between months and dropdown for jump-to-year.
  4. `Day names`: Compact weekday abbreviations (Mo, Tu, We, Th, Fr, Sa, Su).
  5. `Internationalisation`: Localized date formatting and correct regional first-day-of-week ordering.
  6. `Keyboard navigation`: Full arrow-key grid traversal and month change on boundary exit.
  7. `State announcement`: Selected dates announced by screen reader upon cell focus.

### C10. Checkbox (0/7)
* **Definition**: Form field used to select one or multiple values from a list.
* **Verification Checkpoints**:
  1. `Label`: Clickable text label linked via `htmlFor`, announced properly by screen readers.
  2. `Checked state`: High-contrast checkmark indicator on active brand fill.
  3. `Error state`: Form validation error border with linked error message.
  4. `Disabled state`: Prevents interaction and excludes value from form submission.
  5. `Indeterminate state`: Horizontal dash symbol when child items are partially selected.
  6. `Checkbox group`: Supports multi-select arrays with group-level legend or label.
  7. `Keyboard support`: Spacebar toggle and native Tab focus traversal.

### C21. Input Radio (0/5)
* **Definition**: Radio is a form element used for selecting one option from a list.
* **Verification Checkpoints**:
  1. `Label`: There should be a text label linked with the radio field. Clicking the label should also trigger the checkbox selection. If the label is not rendered on the page, assistive technologies should still announce it.
  2. `Checked state`: Display when the radio gets selected and is used for the form submission.
  3. `Error state`: Use an error state for form validation when the error is related to the radio field. Always use a text error along with a different field color.
  4. `Radio group`: Radio buttons are always used as a group to avoid locking the selection after one of the radio buttons is checked.
  5. `Keyboard support`: Radio selection should be triggered with the keyboard. Using native elements for this should provide this kind of interaction automatically.

### C22. Select (0/8)
* **Definition**: Select lets you choose a single value from a list of options.
* **Verification Checkpoints**:
  1. `Label`: Text labels linked with the Select field can provide users with additional context. Clicking the label should also trigger the select dropdown.
  2. `Error state`: Use an error state for form validation when the error is related to the select only. Display an additional error icon for better accessibility.
  3. `Disabled state`: Use the disabled state to prevent Select interactions and remove its value from the submitted form values.
  4. `Placeholder`: When no value is selected - display a placeholder value. You can use the same placeholder value to let users reset the select value back to the default.
  5. `Helper text`: Provide users with additional context about the select purpose and the requirements for the selection.
  6. `Icon support`: Add an area for displaying an icon at the start of the field to communicate the purpose of the Select as a component or the selected value.
  7. `Prefix`: Add an area for custom content to make the selection more contextual for the user. For example, you can display country flags in your country code selection.
  8. `Accessibility role & keyboard`: Assistive technologies announce expanded/collapsed state, selected value, and provide full keyboard arrow navigation.

### C24. Switch (0/5)
* **Definition**: Toggle for immediately changing the state of a single item.
* **Verification Checkpoints**:
  1. `Label`: There should be a text label linked with the switch. Clicking the label should also trigger the switch selection. If the label is not rendered on the page, assistive technologies should still announce it.
  2. `Checked state`: Display when the switch gets selected and activates the underlying functionality. Often, a switch is used to immediately update the data after it's selected.
  3. `Disabled state`: Use a disabled state to prevent switch interactions.
  4. `Keyboard navigation`: Switch selection should be triggered with the keyboard. Using native elements for this should provide this kind of interaction automatically.
  5. `Accessibility label`: In case you don't provide a visual text label for Switch, make sure to provide an accessibility label still describing the purpose of the component.

### C26. Text Area (0/7)
* **Definition**: Form field to enter and edit multiline text.
* **Verification Checkpoints**:
  1. `Label`: Text labels linked with the text area can provide users with additional context. Clicking the label should move the focus to the field.
  2. `Error state`: Use an error state for form validation when the error is related only to the Text area.
  3. `Disabled state`: Use a disabled state to prevent text area interactions and remove its value from the submitted form values.
  4. `Placeholder`: When the text area value is empty - display a placeholder value. Make sure that it's not used instead of the label.
  5. `Helper text`: Provide users with additional context about the Text area purpose and the requirements for the expected value.
  6. `Sizes`: Depending on where the text area will be used, it can come in multiple sizes. For example, you can use the large size for the forms on marketing pages.
  7. `Accessibility label`: In case you don't provide a visual text label for the text area, make sure to provide an accessibility label still describing the purpose of the component.

### C27. Text Field (0/9)
* **Definition**: Form field to enter and edit single-line text.
* **Verification Checkpoints**:
  1. `Label`: Text labels linked with the text field can provide users with additional context. Clicking the label should move the focus to the field.
  2. `Error state`: Use an error state for form validation when the error is related only to the text field.
  3. `Disabled state`: Use a disabled state to prevent text field interactions and remove its value from the submitted form values.
  4. `Placeholder`: When the text field value is empty - display a placeholder value. Make sure that it's not used instead of the label.
  5. `Helper text`: Provide users with additional context about the text field purpose and the requirements for the expected value.
  6. `Icon support`: Add an area for displaying an icon at the start of the field to communicate the purpose of the text field as a component or the field value.
  7. `Prefix / Suffix`: Add an area for custom content to make the selection more contextual for the user. For example, you can display payment providers in the text field for credit card numbers.
  8. `Sizes`: Depending on where the text field will be used, it can come in multiple sizes. For example, you can use the large size for the forms on marketing pages.
  9. `Accessibility label`: In case you don't provide a visual text label for the text field, make sure to provide an accessibility label still describing the purpose of the component.
