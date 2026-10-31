# SNP-SMS Monorepo

Integrated Multi-Branch School Management System (SNP-SMS) monorepo powered by npm workspaces, an Express 5 modular monolith backend, a Next.js 16 App Router frontend, and a hybrid container/serverless deployment model.

---

## 1. Executive Summary

SNP-SMS is an institutional school management platform engineered for multi-branch campus operations across Cambodia. The system unifies admissions, academic progression, scheduling, attendance, tuition billing, exam grading, and human resources under a single multi-tenant architecture.

### System Metrics

| Metric          | Specification                                       |
| :-------------- | :-------------------------------------------------- |
| Architecture    | 7-layer modular monolith with npm workspaces        |
| Domain Modules  | 47 operational domains                              |
| REST Endpoints  | 193 standardized HTTP endpoints                     |
| Access Control  | 356 granular permissions and 13 core roles          |
| Multi-Tenancy   | Server-side branch isolation via X-Branch-Id header |
| Design Standard | Strict Light Day UI and zero-dot navigation rails   |

---

## 2. Monorepo Structure

```text
SNP-SMS/
├── apps/
│   ├── backend/          # Express 5, TypeScript, MongoDB 7.0 (Modular Monolith API)
│   └── frontend/         # Next.js 16 App Router (Serverless Web UI & Docs Portal)
├── packages/
│   ├── shared/           # @snp/shared: Canonical Permissions, Roles, DTOs, Enums
│   ├── tsconfig/         # @snp/tsconfig: Standardized TypeScript compiler presets
│   └── eslint-config/    # @snp/eslint-config: Shared flat ESLint configurations
├── docker-compose.yml    # Local MongoDB replica set (rs0) development service
├── package.json          # Monorepo root workspace manifest
└── package-lock.json     # Locked dependency graph
```

### Workspace Boundaries

| Workspace              | Runtime              | Primary Responsibility                                                         |
| :--------------------- | :------------------- | :----------------------------------------------------------------------------- |
| apps/backend           | Node.js (Express 5)  | Domain business logic, MongoDB transactions, RBAC validation, audit logging    |
| apps/frontend          | Node.js (Next.js 16) | Next.js App Router, responsive interfaces, public documentation portal         |
| packages/shared        | TypeScript           | Single source of truth for contracts, permission constants, roles, and schemas |
| packages/tsconfig      | JSON Presets         | Base compiler options for Node, Next.js, and shared libraries                  |
| packages/eslint-config | Flat Config          | Monorepo-wide code quality and linting standards                               |

---

## 3. Technology Stack & Deployment

- Backend API: Express 5, TypeScript, Mongoose, Zod input validation.
- Database: MongoDB 7.0+ Replica Set (rs0) supporting multi-document ACID transactions.
- Frontend Application: Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI.
- Shared Core: Pure TypeScript contracts distributed across backend and frontend workspaces.
- Deployment Model: Hybrid deployment. Frontend runs serverless with edge caching. Backend runs as a persistent container with dedicated MongoDB connection pooling.

---

## 4. Quickstart

### Prerequisites

- Node.js >= 22.13.0
- npm >= 10.8.0
- Docker Desktop (for MongoDB replica set)

### Setup & Execution

```bash
# Install dependencies across all workspaces
npm install

# Configure environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# Start MongoDB replica set (rs0)
docker compose up -d mongodb

# Seed development database
npm run seed --workspace=apps/backend

# Launch both frontend and backend concurrently
npm run dev
```

### Service Endpoints

- Backend API: http://localhost:5001/api/v1 (or port defined in backend env)
- Frontend Web App: http://localhost:3000
- Developer Documentation: http://localhost:3000/document

---

## 5. Verification & Quality Gates

Run the verification suite before committing changes:

| Target                   | Command                | Verification Scope                                  |
| :----------------------- | :--------------------- | :-------------------------------------------------- |
| Code Formatting          | npm run format:check   | Verifies Prettier compliance across all files       |
| Type Safety              | npm run typecheck      | Typechecks shared packages, backend, and frontend   |
| Smoke Tests              | npm run smoke          | Validates package resolution and environment health |
| API Smoke Tests          | npm run test:api       | Executes live HTTP checks across domain modules     |
| Unit & Integration Tests | npm run test           | Runs full Vitest suite (backend and frontend)       |
| Production Build         | npm run build          | Validates production compiler output for all apps   |
| Deployment Verification  | npm run deploy:verify  | Pre-push quality gate checking manifests and builds |
| Changelog Sync           | npm run changelog:sync | Synchronizes changelog data to documentation portal |

---

## 6. Governance & Compliance

- Security Policy: Managed under SECURITY.md
- Contributing Guidelines: Managed under CONTRIBUTING.md
- Code of Conduct: Managed under CODE_OF_CONDUCT.md
- Licensing: Released under the terms of the MIT License (LICENSE)
