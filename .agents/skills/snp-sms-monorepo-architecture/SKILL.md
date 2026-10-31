---
name: snp-sms-monorepo-architecture
description: >-
  Authoritative standard and architectural specification for the SNP-SMS Full-Stack TypeScript
  Monorepo (npm workspaces), Modular Monolith backend API (Express 5 / MongoDB rs0), and Hybrid
  Serverless / Container deployment model. Read before making any code, package, or configuration changes.
---

# SNP-SMS Monorepo & Modular Monolith Architecture Standard

This skill establishes the production standards, directory organization, application boundaries, shared packages, and workflows for the SNP Integrated Multi-Branch School Management System (SNP-SMS).

---

## 1. High-Level Architecture Overview

* **Private Repository**: `https://github.com/shiliaiwei/SNPI-SMS.git` *(Provisional owner: planned for future institutional transfer)*
* **Release Checkpoint**: `v0.1.0` (Tag: `v0.1.0`, Commit: `28ef01b`)
* **Live Document Portal**: `/document` (Publicly accessible technical specification)
* **Future Ownership Transfer**: Decoupled from personal account; maintainer verification via `.github/maintainers.json` numeric IDs.

```text
SNP-SMS/
├── apps/
│   ├── backend/                 # Express 5, TypeScript, MongoDB (Modular Monolith API)
│   │   ├── src/modules/         # Domain-driven 7-layer modules (47 domains)
│   │   ├── Dockerfile           # Multi-stage production container build
│   │   └── docker-compose.yml   # Local MongoDB replica set (rs0) & API stack
│   └── frontend/                # Next.js App Router (Serverless / Edge deployable)
│       ├── app/                 # Routes, layouts, and components (67 routes)
│       ├── features/            # Feature-sliced UI modules
│       └── vercel.json          # Serverless routing and edge configuration
├── packages/
│   ├── shared/                  # @snp/shared: Canonical Permissions, Roles, DTOs, Zod Schemas
│   ├── tsconfig/                # @snp/tsconfig: Standardized TypeScript compiler presets
│   └── eslint-config/           # @snp/eslint-config: Shared flat ESLint presets
├── scripts/
│   ├── monorepo-smoke.ts        # Automated smoke test (npm run smoke)
│   └── test-all-apis.ts         # Live end-to-end API test suite (npm run test:api)
├── .github/workflows/
│   └── ci.yml                   # Unified CI pipeline (lint, typecheck, test, build)
├── docker-compose.yml           # Root-level MongoDB replica set orchestration
├── package.json                 # Monorepo workspaces manifest
├── package-lock.json            # Unified single lockfile
├── .editorconfig
└── .prettierrc.json
```

---

## 2. Architectural Boundaries & Responsibilities

### `apps/backend` (Modular Monolith)
* **Framework**: Express 5 on Node.js `>=22.13.0` with TypeScript.
* **Internal Pattern**: 7-layer architecture per domain:
  `route -> controller -> service -> repository -> model -> validation -> types`
* **Port**: `4000` (`http://localhost:4000/api/v1`).
* **Root Route**: `GET /` returns API metadata, version, and health endpoint pointers.
* **Database**: MongoDB 7.0+ Replica Set (`rs0`) for multi-document ACID transactions.

### `apps/frontend` (Serverless Edge UI)
* **Framework**: Next.js (App Router), React 19, TypeScript, Tailwind CSS, Radix UI.
* **Port**: `3000` (`http://localhost:3000`).
* **Proxy Architecture**: Proxies `/api/v1/*` server-side via `next.config.ts` rewrites to `BACKEND_INTERNAL_URL` (zero CORS issues in production).
* **Workspace Transpilation**: Configured with `transpilePackages: ['@snp/shared']`.

### `packages/shared` (`@snp/shared`)
* **Canonical Role**: Single source of truth across frontend and backend.
* **Contents**:
  * `SYSTEM_PERMISSIONS` (356 granular permissions)
  * `DEFAULT_CORE_ROLES` (13 core roles)
  * `IMPLIED_SCOPES` & `checkUserPermission` (Scope inheritance & RBAC utilities)
  * `loginPayloadSchema` & Zod DTO contracts
  * `ApiSuccessResponse<T>`, `ApiPaginatedResponse<T>`, `PaginationMeta`

### `packages/tsconfig` (`@snp/tsconfig`)
* Standardized TSConfig presets: `base.json`, `node.json`, `nextjs.json`.

### `packages/eslint-config` (`@snp/eslint-config`)
* Shared flat ESLint rules and conventions.

---

## 3. Hybrid Deployment Strategy

| Layer | Runtime / Target | Deployment Strategy | Rationale |
| :--- | :--- | :--- | :--- |
| **`apps/frontend`** | **Serverless (Vercel)** | Edge / Serverless functions | Fast global CDN caching, automated preview deployments, zero server maintenance. Proxies `/api/v1` server-side. |
| **`apps/backend`** | **Container (Docker)** | Long-running container (Render, Railway, ECS, VPS) | Persistent MongoDB connection pools (replica set `rs0`), reliable ACID transactions, rate limiting, and PDF exports. |
| **Database** | **Managed MongoDB** | Stateful replica set | Multi-document ACID transactions across classes, students, and payments. |

---

## 4. Standard Operational Commands

```bash
# Install all dependencies across all workspaces
npm install

# Run automated smoke test
npm run smoke

# Run live end-to-end API test suite (all 47 modules / 56 routes)
npm run test:api

# Start backend dev server (:4000)
npm run dev:backend

# Start frontend dev server (:3000)
npm run dev:frontend

# Start both servers concurrently
npm run dev

# Synchronize real-time changelog to live /document portal and CHANGELOG.md
npm run changelog:sync

# Quality gates
npm run typecheck
npm run test
npm run build
npm run format:check
```
