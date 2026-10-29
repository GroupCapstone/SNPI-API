# SNP-SMS Monorepo

[![Monorepo CI](https://github.com/shiliaiwei/SNP-SMS/actions/workflows/ci.yml/badge.svg)](https://github.com/shiliaiwei/SNP-SMS/actions/workflows/ci.yml)
[![CodeQL Analysis](https://github.com/shiliaiwei/SNP-SMS/actions/workflows/codeql.yml/badge.svg)](https://github.com/shiliaiwei/SNP-SMS/actions/workflows/codeql.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node: >=22.13.0](https://img.shields.io/badge/Node-%3E%3D22.13.0-green.svg)](package.json)
[![UI: Strict Light Mode](https://img.shields.io/badge/UI-Strict_Light_Mode-white.svg)](#)
[![Security: Audited](https://img.shields.io/badge/Security-Audited-brightgreen.svg)](SECURITY.md)

Integrated Multi-Branch School Management System (SNP-SMS) monorepo powered by npm workspaces, an Express 5 modular monolith backend, a Next.js 16 App Router frontend, and a hybrid container/serverless deployment model.

---

## 1. Executive Summary

SNP-SMS is an institutional school management platform engineered to support multi-branch campus operations across Cambodia. The platform consolidates student admissions, academic progression, class scheduling, attendance tracking, tuition billing, exam scoring, and multi-tenant human resources into a unified, secure system.

### Key Capabilities

- **47 Domain Modules**: 7-layer modular monolith architecture covering all campus operations.
- **193 REST Endpoints**: Standardized API with unified response envelopes and RFC draft-8 rate limiting.
- **356 Granular Permissions & 13 Core Roles**: Strict Role-Based Access Control (RBAC) defined in `@snp/shared`.
- **Multi-Branch Isolation**: Strict campus boundaries enforced server-side via `X-Branch-Id` validation.
- **Developer Documentation Portal**: Real-time interactive technical reference at `/document` in 100% Light Mode.

---

## 2. Monorepo Architecture

The repository uses npm workspaces with unified dependencies and compiler configurations:

```text
SNP-SMS/
├── apps/
│   ├── backend/                 # Express 5, TypeScript, MongoDB 7.0 (Modular Monolith API)
│   │   ├── src/modules/         # 47 domain modules (Students, Finance, Attendance, etc.)
│   │   ├── Dockerfile           # Multi-stage production container build
│   │   └── docker-compose.yml   # Local MongoDB replica set (rs0) & API stack
│   └── frontend/                # Next.js 16 App Router (Serverless / Edge deployable)
│       ├── app/                 # Routes, layouts, and public document portal (/document)
│       ├── features/            # Feature slices (Students, Attendance, Payments, etc.)
│       └── vercel.json          # Serverless routing and edge configuration
├── packages/
│   ├── shared/                  # @snp/shared: Canonical Permissions, Roles, DTOs, Enums
│   ├── tsconfig/                # @snp/tsconfig: Standardized TypeScript presets
│   └── eslint-config/           # @snp/eslint-config: Shared linting standards
├── docker-compose.yml           # Root-level MongoDB replica set development orchestration
├── package.json                 # Monorepo npm workspaces manifest
├── package-lock.json            # Unified single source of truth for dependencies
├── .editorconfig
├── .prettierrc.json
└── .prettierignore
```

---

## 3. Workspaces & Ownership Boundaries

| Layer / Workspace            | Type                 | Ownership & Boundary                                                                            |
| :--------------------------- | :------------------- | :---------------------------------------------------------------------------------------------- |
| **`apps/backend`**           | Modular Monolith API | Express 5 HTTP endpoints, Mongoose models, transactions, RBAC middleware, Docker orchestration. |
| **`apps/frontend`**          | Serverless Web UI    | Next.js App Router, React 19 UI, TanStack Query hooks, edge proxy to `/api/v1`.                 |
| **`packages/shared`**        | Canonical Core       | Single source of truth for permissions, roles, implied scopes, and DTO contracts.               |
| **`packages/tsconfig`**      | Compiler Presets     | Shared TypeScript configurations (`base.json`, `node.json`, `nextjs.json`).                     |
| **`packages/eslint-config`** | Linting Presets      | Standardized flat ESLint rules.                                                                 |

---

## 4. Hybrid Deployment Strategy

- **Frontend (`apps/frontend`)**: Deployable to **Vercel** serverless edge infrastructure. Static assets are globally edge-cached, SSR functions scale on demand, and `/api/v1` traffic is proxied server-side to the backend internal URL (eliminating CORS complications).
- **Backend (`apps/backend`)**: Runs as a long-running **Docker Container** (AWS ECS, Render, Railway, or private VPS). Maintains persistent MongoDB connection pools, executes multi-document ACID transactions, enforces login rate-limiting, and processes PDF exports reliably.
- **Database**: MongoDB 7.0+ Replica Set (`rs0`) for multi-document ACID transaction support.

---

## 5. Local Development Workflows

### 5.1 Prerequisites

- **Node.js**: `>=22.13.0` (Node 25 LTS recommended)
- **npm**: `>=10.8.0`
- **Docker**: For local MongoDB replica set (`rs0`) orchestration

### 5.2 Initial Setup

```bash
# 1. Install all dependencies across all workspaces
npm install

# 2. Configure local environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# 3. Start local MongoDB container (ReplicaSet rs0)
docker compose up -d mongodb

# 4. Seed sample development data
npm run seed --workspace=apps/backend
```

### 5.3 Running Applications

```bash
# Start backend API (http://localhost:4000)
npm run dev:backend

# Start frontend UI (http://localhost:3000)
npm run dev:frontend

# Start all workspaces concurrently
npm run dev
```

---

## 6. Developer Documentation Portal

The official interactive technical documentation is accessible at:

**`http://localhost:3000/document`**

Key features:

- **100% Light Mode**: Pure white (`#FFFFFF`) canvas, slate borders, and high-contrast typography.
- **Nextra Typography & Bakong Specification Flow**: Purpose, Scope, Overall API, and On-This-Page navigation.
- **Access Tiers**: Explicit 6-tier RBAC matrix defining who can access each resource.
- **Integration Catalog**: Standardized query endpoints available for external developer integrations.
- **Mutation Defense Guardrails**: Security controls protecting high-impact transactions.
- **Interactive Request Explorer**: Live in-browser API testing with millisecond latency measurement and copyable cURL / TypeScript snippets.

---

## 7. Quality Gates & Verification Pipeline

Always verify changes using the standard verification suite:

```bash
# 1. Verify code formatting across all files
npm run format:check

# 2. Typecheck all workspaces
npm run typecheck

# 3. Verify workspace resolution, database health, and API smoke tests
npm run smoke

# 4. Verify live HTTP responses across all 47 domain modules
npm run test:api

# 5. Run full test suite across backend and frontend
npm run test

# 6. Verify production builds
npm run build

# 7. Synchronize real-time changelog to live document portal and CHANGELOG.md
npm run changelog:sync
```

---

## 8. Governance & Project Policies

- **[Code of Conduct](CODE_OF_CONDUCT.md)**: Standards of respectful collaboration and student/staff data protection.
- **[Contributing Guide](CONTRIBUTING.md)**: Step-by-step instructions for pull requests, commit conventions, and development patterns.
- **[Security Policy](SECURITY.md)**: Vulnerability disclosure guidelines, DevSecOps controls, and response commitments.
- **[License](LICENSE)**: MIT License details.
