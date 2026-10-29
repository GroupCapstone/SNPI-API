---
name: snp-sms-backend-ai-standard
description: >-
  Mandatory shared engineering rules for every agent and contributor working on the
  standalone SNP-SMS backend. Read before backend code, API, security, dependency,
  deployment, or documentation changes.
---

# SNP-SMS AI Development Standard (Full Master Rules)

**Project:** SNP Integrated Multi-Branch School Management System  
**Short Name:** SNP-SMS  
**Single Source of Truth**

**Applicability:** These rules are mandatory for every AI coding agent and human contributor. They are not tied to one agent vendor, model, IDE, or prompt system. `AGENTS.md` requires all agents to read and follow this shared file.

---

# 1. Purpose

This document defines the mandatory development rules for all AI-assisted engineering work on SNP-SMS. Whenever AI creates a module, fixes a bug, adds a page/API, changes UI, designs database models, adds permissions, or refactors code, it MUST strictly follow these rules.

---

# 2. Core Project Principle

```text
One School
    ↓
Multiple Branches
    ↓
Connected Departments
    ↓
One Integrated System
    ↓
One Central Database
    ↓
Controlled Access
```

Every module must take into account: `School`, `Branch`, `User`, `Role`, `Permission`, `Data Scope`, and `Audit`.

---

# 3. Technology Stack

- **Frontend**: Next.js, TypeScript, App Router, React, Tailwind CSS, shadcn/ui, TanStack Query, React Hook Form, Zod, Lucide Icons
- **Backend**: Node.js, Express.js, TypeScript, REST API, Mongoose, Zod
- **Database**: MongoDB
- **Security**: JWT Access Token, Refresh Token (HttpOnly Cookie), RBAC, Permission-Based Access, Branch-Based Access Control, Audit Logging, Helmet, CORS, Rate Limiting

---

# 4. Version Roadmap & Scope Protection

Roadmap stages:

- **V0.1** — System Foundation
- **V1.0** — Core School Management
- **V1.1** — Reporting & Communication
- **V1.2** — Advanced Academic
- **V1.3** — Advanced Finance
- **V2.0** — HR & Staff
- **V2.1** — Payroll
- **V2.2** — Student Affairs
- **V2.3** — Admission & CRM
- **V2.4** — Library
- **V2.5** — Inventory & Assets
- **V3.0** — Parent & Student Portal
- **V3.1** — LMS
- **V3.2** — Analytics & Risk
- **V3.3** — Advanced Multi-Branch
- **V4.0** — Mobile & External Integration

**Scope Rule:** Before implementing anything, verify which version it belongs to. Do not implement future version features without explicit user directive. Avoid scope creep.

---

# 5. V0.1 Scope

- School, Branch, Department, Position
- Basic Employee Master
- User, Role, Permission, Branch Access, Authentication
- Academic Year, Classroom, System Settings
- Sequence Generator, Audit Log, Backup Configuration

_(Do NOT add Student, Enrollment, Attendance, Finance, Scores, Payroll, Library, LMS into V0.1)_

---

# 6. Backend 7-Layer Module Standard

Every backend module directory must follow:

```text
module/
├── module.model.ts       → Mongoose schema & compound indexes
├── module.types.ts       → DTOs & filter interfaces
├── module.validation.ts  → Zod schemas
├── module.repository.ts  → Database queries & population
├── module.service.ts     → Business logic & audit logging
├── module.controller.ts  → HTTP handling & status codes
└── module.route.ts       → Express router, auth, rbac, validation
```

---

# 7. Frontend Feature Architecture

Every frontend feature must follow:

```text
features/module-name/
├── api/          → Typed fetch client calls
├── components/   → UI components, tables, dialogs, forms
├── hooks/        → TanStack Query hooks (queries, mutations)
├── schemas/      → Zod form schemas
├── types/        → Interfaces & filter types
└── utils/        → Formatters & helpers
```

---

# 8. Strict Multi-Branch & Relational Rules

1. **Hierarchy Integrity:**
   $$\text{School} \longrightarrow \text{Branch} \longrightarrow \text{Department} \longrightarrow \text{Position}$$
2. **Never Trust Frontend IDs:** Always validate that `branch.schoolId === schoolId` and `department.branchId === branchId`.
3. **Compound Unique Indexes:** Enforce compound unique indexes in Mongoose for every hierarchical level.
4. **Soft Delete Protection:** Deleting parent entities with active child records is strictly forbidden.
5. **Branch Query Scoping:** Always apply `user.branchAccess` filter on backend queries (`getAuthorizedBranchFilter`).

---

# 9. Definition of Done

A task is done only when:

1. Backend 7-layer architecture implemented.
2. Zod validation active on both backend and frontend.
3. Strict permissions and branch access enforced.
4. Frontend feature integrated with TanStack Query.
5. Loading skeletons and empty states implemented.
6. Automated tests pass (`npm run test`).
7. Pipeline passes: `format:check`, `lint`, `typecheck`, `test`, `build`.
8. Documentation files updated.
9. Final response formatted with standard `IMPLEMENTATION SUMMARY`.

# 10. Standalone Backend Repository and Shared Agent Workflow

The `snp-sms-backend` repository contains the Express, TypeScript, and MongoDB API only. The Next.js frontend is maintained and deployed from the separate `snp-sms-frontend` repository. These repositories communicate through the versioned REST API; frontend source and frontend deployment configuration do not belong in the backend repository.

Every agent follows the same workflow recorded in the backend root `AGENTS.md`: read `VERSION.md` and this skill, inspect the existing API/module/tests/configuration, map the full request flow, make the smallest contract-preserving change, validate it, review the diff, and report implementation and verification. Do not rely on one agent's private memory or vendor-specific instructions as the only record of project rules.

For backend-only setup and maintenance, use Node.js `>=22.13.0`, npm, and `npm ci` against the committed lockfile. Database-backed local work requires the MongoDB replica set from `docker-compose.yml`. Review package engine/peer requirements before updates; change `package.json` and `package-lock.json` together and run the required verification pipeline. Full folder layout, API flow, package update steps, and safe deletion criteria are in `docs/architecture/product-folder-structure.md`.

Do not delete files solely because they have no imports. Check CLI scripts, tests, dynamic framework loading, CI, deployment manifests, and operator documentation first. Preserve API contracts and behavior-bearing modules unless an explicit change is authorized.

# 11. GitHub Maintainer Identity and Repository Security

The only approved developer account identifiers are the numeric GitHub IDs in `.github/maintainers.json`. GitHub Actions must compare numeric account IDs rather than usernames. Do not change the allowlist or add an account without explicit repository-owner direction. Do not create a username-based `CODEOWNERS` policy for these two identities.

The pull-request author check is only a CI gate. Actual write access, protected-branch rules, deployment permissions, secret scanning, and push protection are GitHub repository settings; verify them separately and follow `docs/github-repository-setup.md`. Never report a setting as active based only on a repository file.
