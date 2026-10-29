# Contributing to SNP-SMS

Thank you for your interest in contributing to the SNP Integrated Multi-Branch School Management System (SNP-SMS). This monorepo is a full-stack, enterprise-grade educational platform built with an Express 5 modular monolith backend, Next.js 16 App Router frontend, and shared TypeScript contracts.

All contributors must review and adhere to these guidelines to ensure architectural consistency, data security, and maintainability.

---

## 1. Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md). Please read it before contributing.

---

## 2. Monorepo Architecture & Boundaries

The repository is structured as an npm workspaces monorepo:

| Directory                             | Role                       | Technology Stack                                                 |
| :------------------------------------ | :------------------------- | :--------------------------------------------------------------- |
| `apps/backend`                        | Modular Monolith API       | Express 5, TypeScript, MongoDB 7.0 (Replica Set `rs0`), Mongoose |
| `apps/frontend`                       | Serverless Web Application | Next.js 16 (App Router), React 19, Tailwind CSS, Radix UI        |
| `packages/shared` (`@snp/shared`)     | Canonical Contracts        | Permissions, Roles, DTOs, Enums, Zod Schemas                     |
| `packages/tsconfig` (`@snp/tsconfig`) | Compiler Configurations    | Shared `base.json`, `node.json`, `nextjs.json`                   |
| `packages/eslint-config`              | Linting Standards          | Shared ESLint configurations                                     |

### Key Boundaries:

- **Preserve Contracts**: Never alter existing REST API paths, query parameters, HTTP status codes, or payload formats unless explicitly commanded.
- **Single Source of Truth**: All permissions (`SYSTEM_PERMISSIONS`), role definitions (`DEFAULT_CORE_ROLES`), and implied scopes must be imported from `@snp/shared`. Do not duplicate permission strings or role enums.
- **Multi-Tenant Isolation**: Every backend query and mutation must enforce `schoolId`, `branchId`, and user RBAC permissions server-side. Never trust client-supplied scopes.
- **Zero Emojis**: Under no circumstances should emojis be used in code, comments, docstrings, commit messages, PR descriptions, or documentation. Use clean textual badges: `[PASSED]`, `[FAILED]`, `[WARNING]`, `[COMPLETED]`.

---

## 3. Getting Started

### 3.1 Prerequisites

- **Node.js**: `>=22.13.0` (Node 25 LTS recommended)
- **npm**: `>=10.8.0`
- **Docker**: For local MongoDB Replica Set (`rs0`) orchestration

### 3.2 Local Setup

```bash
# 1. Clone the repository
git clone https://github.com/shiliaiwei/SNP-SMS.git
cd SNP-SMS

# 2. Install dependencies across all workspaces
npm install

# 3. Configure local environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# 4. Start local MongoDB container (ReplicaSet rs0)
docker compose up -d mongodb

# 5. Seed sample development data
npm run seed --workspace=apps/backend
```

### 3.3 Running Applications

```bash
# Start backend API (http://localhost:4000)
npm run dev:backend

# Start frontend UI (http://localhost:3000)
npm run dev:frontend

# Start both applications concurrently
npm run dev
```

---

## 4. Development Standards

### 4.1 7-Layer Backend Architecture

Every domain module in `apps/backend/src/modules/<domain>/` must adhere strictly to the 7-layer modular monolith pattern:

1. `*.route.ts`: Express router definitions, rate limits, and authentication/authorization middleware.
2. `*.controller.ts`: Request parsing, DTO extraction, HTTP response envelopes.
3. `*.service.ts`: Core business logic, validation orchestration, event dispatching.
4. `*.repository.ts`: Database query construction, transaction handling, filtering.
5. `*.model.ts`: Mongoose schema, indexing, and validation constraints.
6. `*.validation.ts`: Zod request schemas.
7. `*.types.ts`: Domain-specific TypeScript interfaces and types.

### 4.2 Frontend Architecture

- **App Router**: Follow Next.js App Router conventions with server components by default and `'use client'` for interactive islands.
- **Feature Slices**: Co-locate API clients, components, hooks, and schemas inside `apps/frontend/features/<domain>/`.
- **100% Light Mode Standard**: All application pages and technical documentation portals must render on pure white (`#FFFFFF`) or slate-50/100 canvases. Dark mode canvas backgrounds are strictly prohibited.

---

## 5. Development Workflow & Git Standards

### 5.1 Branching Strategy

- Main development branch: `main`
- Feature branches: `feat/<feature-name>`
- Bugfix branches: `fix/<issue-name>`
- Documentation branches: `docs/<doc-name>`

### 5.2 Conventional Commits

All commit messages must follow the Conventional Commits specification:

```text
<type>(<scope>): <short description in imperative mood>

[optional body]

[optional footer]
```

Allowed types:

- `feat`: New feature or domain capability
- `fix`: Bug fix
- `docs`: Documentation updates
- `style`: Formatting, whitespace, or visual presentation changes
- `refactor`: Code refactoring without behavior modification
- `test`: Adding or updating test suites
- `chore`: Tooling, dependencies, or configuration adjustments

### 5.3 Real-Time Changelog Synchronization

Prior to submitting any pull request or committing architectural updates, run the automated changelog synchronization script:

```bash
npm run changelog:sync
```

This synchronizes git history in real time to both `CHANGELOG.md` and the live developer documentation portal at `apps/frontend/features/document/changelog-data.ts`.

---

## 6. Pre-Submission Quality Gates

Before opening a pull request, run the complete verification suite locally:

```bash
# 1. Verify code formatting with Prettier
npm run format:check

# 2. Run TypeScript compiler across all workspaces
npm run typecheck

# 3. Verify workspace resolution and database health
npm run smoke

# 4. Verify live HTTP responses across all 47 domain modules
npm run test:api

# 5. Run full test suites across backend and frontend
npm run test

# 6. Verify production builds
npm run build
```

---

## 7. Submitting Pull Requests

1. Push your branch to GitHub.
2. Open a Pull Request targeting `main`.
3. Complete the pull request template checklist with verification evidence.
4. Ensure all GitHub Actions CI checks pass (`Code Quality & Lint`, `TypeScript Static Analysis`, `Automated Test Suites`, `Production Build Verification`).
5. Await code review and approval from repository maintainers.
