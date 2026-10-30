---
name: snp-sms-laws-of-ux
description: >-
  Laws of UX: Cognitive Psychology in Interface Design.
  Authoritative specification for Fitts's Law (touch targets >=44x44px, coyote time),
  Hick's Law (progressive disclosure), Miller's Law (data chunking 7+-2),
  Doherty Threshold (<400ms flow state, optimistic UI), and Postel's Law (liberal input parsing).
---

# Laws of UX: Cognitive Psychology in Interface Design

This skill governs the application of foundational cognitive psychology principles across all views, forms, dialogs, and components in the SNP-SMS platform.

---

## 1. The 5 Core Cognitive Laws

1. **Fitts's Law (Target Accessibility)**:
   - Expand compact button hit areas to $\ge 44 \times 44\text{px}$ using CSS `::before`.
   - Incorporate temporal tolerance ("coyote time") on hover menus to prevent premature dismissal.
2. **Hick's Law (Choice Fatigue)**:
   - Structure dense options with progressive disclosure.
   - Limit default visible choices to $3$ to $5$ items; defer secondary items behind curated filters.
3. **Miller's Law (Information Chunking)**:
   - Chunk all structured data (student codes, phone numbers, currency, dates) into $3$ to $4$ character segments.
   - Never display raw continuous strings of numeric records.
4. **Doherty Threshold (Latency & Perceived Speed)**:
   - All interactive button feedback must trigger in $<100\text{ms}$.
   - Ensure entire transaction workflows complete or signal optimistic state within $\le 400\text{ms}$.
   - Deploy skeleton loading shimmers on network-bound views.
5. **Postel's Law (Robustness Principle)**:
   - Accept diverse human input formats (dates, phone numbers, currency symbols) and normalize internally to standard schema DTOs.
   - Validate generously without rejecting or erasing valid user intent.

---

## 2. Verification Checklist

When building or reviewing UI screens:
* [ ] Are interactive tap targets at least $44 \times 44\text{px}$?
* [ ] Are form fields grouped into cards of $\le 5$ fields per section?
* [ ] Does the UI provide immediate optimistic feedback on button press?
* [ ] Are dates and serial identifiers segmented with visual chunking?
* [ ] Do text inputs accept multiple standard date/phone formats?
