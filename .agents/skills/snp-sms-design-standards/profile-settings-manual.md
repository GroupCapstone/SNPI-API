# SNP-SMS Profile Settings UX & Architecture Manual

This manual establishes the UX patterns, visual hierarchy, categorizations, and information architecture for user profile settings, security preferences, and workspace configuration across the SNP-SMS platform.

---

## The 8 Principles of Settings Design

```
+--------------------------------------------------------------------------+
| 01. Group Categories       | Organize settings into logical labeled cards.|
| 02. Add Universal Icons    | Prepend recognized icons for rapid scanning. |
| 03. Functional Naming      | Use plain language indicating user intent.   |
| 04. Optimal Defaults       | Set frictionless defaults in onboarding.     |
| 05. Personalization        | Greet user, custom avatars, localized data.  |
| 06. Secondary Subpages     | Isolate deep/rare actions to avoid clutter.  |
| 07. Expected Placement     | Anchor on top-right avatar and main tab bar. |
| 08. Instant Search Filter  | Provide real-time filter for lists >6 items. |
+--------------------------------------------------------------------------+
```

---

## 1. Group Categories & Card Hierarchy
* When an enterprise platform contains dozens of configuration options, grouping them into cohesive categories drastically reduces cognitive load.
* Standard SNP-SMS Setting Categories:
  1. **Account & Profile**: Name, email, staff ID, avatar image, phone number.
  2. **Security & Authentication**: Password rotation, biometric passkeys, active sessions, 2FA.
  3. **Campus & Academics**: Assigned school branch, default academic term, role scopes.
  4. **Notifications & Alerts**: SMS alerts, Telegram dispatch, daily digest preferences.
  5. **Preferences & Appearance**: Dual-theme switcher (Light / Dark mode), interface sounds, language (Khmer / English).

---

## 2. Universal Iconography for Fast Scanning
* Every settings item must feature a recognizable leading icon inside a 32x32px circular or rounded-lg container (`bg-[#E3E7FC] text-[#0056FF]`).
* Standard Icon Mappings:
  - Account: `User`
  - Security / Passwords: `Lock` / `Shield`
  - Biometrics: `Fingerprint`
  - Notifications: `Bell`
  - Billing / Payments: `CreditCard`
  - Language: `Globe`
  - Theme: `Moon` / `Sun`
  - Audit Logs: `Clock` / `History`

---

## 3. Plain Functional Labeling (Zero Technical Jargon)
* Avoid developer or internal engineering names:
  - BAD: `POST /api/v1/auth/mfa/totp-provision`
  - GOOD: `Two-Factor Authentication` (Subtitle: `Add an extra security layer to protect your staff account`).
  - BAD: `Sync Daemon Polling Threshold`
  - GOOD: `Automatic Campus Sync` (Subtitle: `Synchronize attendance and grades every 5 minutes`).

---

## 4. Optimal Onboarding Defaults
* Provide sensible, secure defaults so users can start working without navigating complex configuration screens.
* Security-first defaults: Auto-sync enabled (`true`), biometric quick-sign enabled (`true`), audit log recording enabled (`true`).

---

## 5. Personalization & Identity
* Greet the user by their full localized name.
* Display active avatar with live image upload and instant preview.
* Display authorized tenant badge (e.g. `Siem Reap Central Campus · Academic Staff`).

---

## 6. Two-Tier Secondary Subpages
* Frequently altered settings (language, notifications, theme) sit directly on the main settings screen.
* High-impact or rarely changed configurations (active API tokens, export academic archive, delete account) are tucked into subpages or modal drawers to protect against accidental edits.

---

## 7. Contextual Placement
* Desktop: Top navigation right header, attached to the user avatar dropdown menu.
* Mobile: Dedicated "Profile / Settings" tab on the bottom navigation bar (`LibraryBottomNav`).

---

## 8. Instant Search Filtering
* Whenever a settings panel contains more than 6-8 options, an instant filter input (`GeometricInput` sm) must be pinned at the top.
* As the user types (e.g., "password", "theme", "branch"), non-matching settings dynamically fade or collapse, immediately surfacing the target control.
