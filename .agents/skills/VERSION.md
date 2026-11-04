# SNP-SMS Version Status

**Current Version:** V1.2 (Advanced Academic — PASSED QUALITY GATE)
**Completed Milestones:**

- V0.1 — System Foundation (PASSED QUALITY GATE)
- V1.0 — Core School Management (PASSED QUALITY GATE)
- V1.1A — Official Reports & Documents (PASSED QUALITY GATE)
- V1.1B — Communication & Notification Integrations (PASSED QUALITY GATE)
- V1.2 — Advanced Academic (PASSED QUALITY GATE)

**Next Focus Milestone:** V1.3 — Advanced Student Finance (Fee Structures, Invoices, Payment Plans, Scholarships, Discounts, Student Debt, Voids/Reversals, Finance Reports)

---

## Roadmap

- [x] **V0.1 — System Foundation** _(PASSED QUALITY GATE: 13 Core System Roles, Multi-Branch Isolation, Granular RBAC, Audit Logging, Dynamic System Settings, Sequence Engine)_
- [x] **V1.0 — Core School Management** _(PASSED QUALITY GATE: Student Master, Guardians, Registrations, Placement Tests, Enrollments, Teacher Assignments, Attendance, Internal Progression, Assessments, Score Matrix, Term Results & Promotion, Tuition Fees, Payments COMPLETE)_
- [x] **V1.1A — Official Reports & Documents** _(PASSED QUALITY GATE: Student Report Cards, Academic Transcripts, Printable Payment Receipts, Tuition Invoices, 12-Month Attendance Roll-up, Monthly Class Ranking, Tuition Status Matrix, Executive Trends, Management Pulse Dashboard, Centralized Report Center, PDFKit A4 rendering, Teacher Assigned-Class Scoping, Branch Isolation)_
- [x] **Cross-Cutting RBAC Hardening** _(Deny-by-default permission engine, safe multi-role scope merging, complete `/auth/me` context, branch/department/resource query isolation, teacher class-subject enforcement, privilege-escalation protection, permission-driven UI, and sensitive-change auditing)_
- [x] **V1.1B — Communication & Notifications** _(Telegram Notifications, SMS Gateway, Announcement Board, Parent Contact Log)_
- [x] **V1.2 — Advanced Academic** _(Exam Schedules, Timetable Management, Conflict Detection, Result State Machine, Certificate Management, 31-Day Attendance Matrix)_
- [ ] **V1.3 — Advanced Student Finance** _(Fee Structures, Invoices, Payment Plans, Scholarships, Discounts, Student Debt, Voids/Reversals, Finance Reports)_
- [ ] **V2.0 — HR & Staff Management**
- [ ] **V2.1 — Payroll Management**
- [ ] **V2.2 — Student Affairs & Discipline**
- [ ] **V2.3 — Admissions & CRM**
- [ ] **V2.4 — Library Management**
- [ ] **V2.5 — Inventory & Assets**
- [ ] **V2.6 — Accounting & Financial Management** _(Chart of Accounts, Journal Entries, General Ledger, Accounts Payable, Cash/Bank Reconciliation, Balance Sheet, Income Statement, Cash Flow)_
- [ ] **V3.0 — Parent & Student Portal**
- [ ] **V3.1 — LMS (Learning Management System)**
- [ ] **V3.2 — Analytics & Early Warning System**
- [ ] **V3.3 — Advanced Multi-Branch Operations** _(Cross-Branch Student Transfer Implemented Ahead of Roadmap)_
- [ ] **V4.0 — Mobile Apps & External Integrations**

---

## 13 Canonical Core System Roles

1. `super_admin` — Global system administrator with full cross-branch administrative access
2. `director` — Campus/School director overseeing academic and operational policy
3. `branch_manager` — Branch head managing branch-scoped operations, staff, and classes
4. `administrator` — Campus administrative officer managing registrar, admissions, and schedules
5. `academic_officer` — Academic affairs manager overseeing curriculum delivery, grading, and term results
6. `teacher` — Instructor with class-scoped score entry, attendance roll-call, and report card views
7. `finance_officer` — Bursar/accountant managing tuition fee structures, receipts, invoices, and payments
8. `student_affairs_officer` — Student discipline, counseling, and extracurricular coordinator
9. `hr_officer` — Human resources and staff management officer
10. `librarian` — Library inventory, book lending, and resource manager
11. `inventory_officer` — Campus equipment, assets, and classroom supply manager
12. `staff` — General operations and support staff
13. `department_head` — Academic or administrative department leader

---

## Test & Build Verification

- Backend Vitest: **429 passing tests** (73 test suites)
- Frontend Vitest: **170 passing tests** (41 test suites)
- Total Automated Tests: **599 passing tests (114 test suites)**
- TypeCheck: **0 errors** (Backend + Frontend)
- Lint: **0 errors** (Backend + Frontend; 251 frontend warnings remain)
- Prettier: **100% compliant**
- Next.js Production Build: **Pass (67 pages generated)**

## Full-stack stabilization verification — 2026-09-13

The format, lint, typecheck, test, and production-build pipeline passed. Real replica-set smoke tests verified authentication, module reads, installment payment/completion/reversal/cancellation, debt recalculation, invoice idempotency, audit persistence, and rollback. Browser login and installment recording were verified against isolated demo data. See `docs/rebuild-verification.md` for the evidence and limits. V1.3 remains in progress; this verification does not mark later roadmap modules or production acceptance complete.
