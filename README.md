# SNP-SMS Monorepo

Integrated Multi-Branch School Management System (SNP-SMS) monorepo powered by npm workspaces, modular monolith backend architecture, and a hybrid container/serverless deployment strategy.

---

## 1. Monorepo Architecture

```text
SNP-SMS/
├── apps/
│   ├── backend/                 # Express 5, TypeScript, MongoDB (Modular Monolith API)
│   │   ├── src/modules/         # Domain-driven 7-layer modules (Students, Finance, etc.)
│   │   ├── Dockerfile           # Multi-stage production container build
│   │   └── docker-compose.yml   # Local MongoDB replica set (rs0) & API stack
│   └── frontend/                # Next.js App Router (Serverless / Edge deployable)
│       ├── app/                 # Next.js routes, layouts, and pages
│       ├── features/            # Feature slices (Students, Attendance, Payments, etc.)
│       └── vercel.json          # Serverless routing and edge configuration
├── packages/
│   ├── shared/                  # @snp/shared: Canonical Permissions, Roles, DTOs, Enums
│   ├── tsconfig/                # @snp/tsconfig: Standardized TypeScript compiler presets
│   └── eslint-config/           # @snp/eslint-config: Shared flat ESLint rules
├── docker-compose.yml           # Root-level MongoDB replica set development orchestration
├── package.json                 # Monorepo npm workspaces manifest
├── package-lock.json            # Unified single source of truth for dependencies
├── .editorconfig
└── .prettierrc.json
```

---

## 2. Architectural Boundaries

| Layer / Workspace            | Type                 | Ownership & Boundary                                                                               |
| :--------------------------- | :------------------- | :------------------------------------------------------------------------------------------------- |
| **`apps/backend`**           | Modular Monolith API | Express 5 HTTP endpoints, Mongoose models, transactions, RBAC middleware, Docker orchestration.    |
| **`apps/frontend`**          | Serverless Web UI    | Next.js App Router, React 19 UI, TanStack Query hooks, edge proxy to `/api/v1`.                    |
| **`packages/shared`**        | Shared Core Package  | Canonical permissions catalog, role definitions, scope hierarchies, shared API response envelopes. |
| **`packages/tsconfig`**      | Shared Presets       | TypeScript configurations (`base.json`, `node.json`, `nextjs.json`).                               |
| **`packages/eslint-config`** | Shared Presets       | Shared linting rules.                                                                              |

---

## 3. Hybrid Deployment Strategy

- **Frontend (`apps/frontend`)**: Deployable to **Vercel** serverless edge infrastructure. Static assets are globally edge-cached, SSR functions scale on demand, and `/api/v1` traffic is proxied server-side to the backend internal URL.
- **Backend (`apps/backend`)**: Deployable as a continuous **Docker Container** (Render, Railway, AWS ECS, or private VPS). Maintains persistent MongoDB connection pools, executes multi-document ACID transactions, enforces login rate-limiting, and processes PDF exports reliably.
- **Database**: MongoDB 7.0+ Replica Set (`rs0`) for multi-branch transaction support.

---

## 4. Local Development Workflows

### Prerequisites

- Node.js `>=22.13.0` (Node 25 tested)
- Docker Desktop (for local MongoDB replica set)

### Initial Setup

```bash
# 1. Install all dependencies across all workspaces
npm install

# 2. Configure local environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env.local

# 3. Start local MongoDB container (ReplicaSet rs0)
docker compose up -d mongodb

# 4. Seed the database with sample data
npm run seed --workspace=apps/backend
```

### Running Applications

```bash
# Start backend API (http://localhost:4000)
npm run dev:backend

# Start frontend UI (http://localhost:3000)
npm run dev:frontend

# Or start all workspaces concurrently
npm run dev
```

### Validation & Quality Gates

```bash
# Run type checking across all workspaces
npm run typecheck

# Run tests across all workspaces (Vitest)
npm run test

# Check code formatting
npm run format:check
```
