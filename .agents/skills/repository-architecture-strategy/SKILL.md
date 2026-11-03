---
name: repository-architecture-strategy
description: Authoritative enterprise operational guide and architectural specification for repository architecture strategy (Monorepo vs Polyrepo) based on the GitHub Well-Architected Framework. Covers 10 core design strategies, the 13-step implementation checklist, monorepo modularity and boundary invariants, circular dependency prevention, and resilient alternate deployment invocation paths.
---

# Repository Architecture Strategy: Monorepo vs. Polyrepo Standard

Authoritative enterprise operational guide and architectural specification for selecting, structuring, maintaining, and scaling repository architectures (Monorepo vs. Polyrepo) across their lifecycle, based on the **GitHub Well-Architected Framework**.

---

## 1. Strategy Evaluation: Monorepo vs. Polyrepo

| Dimension | Monorepo Strategy | Polyrepo Strategy |
| :--- | :--- | :--- |
| **Codebase Scope** | Single unified repository housing multiple applications, services, and shared libraries | Multiple dedicated repositories, each containing an isolated service, library, or app |
| **Primary Advantages** | Unified navigation, consistent workflows, simplified dependency management, atomic cross-module commits | Independent horizontal scalability, strict access boundaries, isolated build/test blast radii |
| **Primary Trade-offs** | Scaling CI/CD runtimes, complex access control, risk of undetected circular dependencies, merge contention | Inter-repo dependency coordination, fragmented codebase visibility, complex cross-repo changes |
| **Best Fit For** | Interconnected platforms with shared types, contracts, and synchronized full-stack releases (e.g. SNPI-SMS) | Decoupled organizations with autonomous teams owning isolated independent microservices |

---

## 2. The 10 Core Architectural Design Strategies

```
+---------------------------------------------------------------------------------------------------+
| 10 Enterprise Repository Architecture Design Strategies                                          |
+----+----------------------------------+-----------------------------------------------------------+
| 01 | Project Structure & Modularity   | Modular directory partitioning (apps/, packages/, infra/) |
| 02 | Dependency Management            | Centralized workspaces (npm/pnpm/yarn), lockfile hygiene  |
| 03 | Version Control Practices        | Trunk-based development with short-lived feature branches |
| 04 | Build & CI/CD Optimization       | Incremental builds, change-path filtering, caching gates |
| 05 | Code Quality & Testing           | Shared linter/tsconfig, unified typechecking & unit tests |
| 06 | Documentation & Communication    | Centralized developer portal (/document), ADRs, Markdown  |
| 07 | Access Control & Security        | Least privilege, fine-grained PATs, GitHub CODEOWNERS     |
| 08 | Change & Release Management      | Semantic versioning, atomic commits, changelog sync       |
| 09 | Scalability & Performance        | Monorepo pruning, circular dependency guards, build cache |
| 10 | Tooling & Automation             | Automated verification engines, GitHub Actions workflows  |
+----+----------------------------------+-----------------------------------------------------------+
```

---

## 3. The 13-Point Implementation Checklist

1. **Define Goals and Requirements**: Clarify business domain, team size, deployment topology, and scalability goals.
2. **Choose Repository Structure**: Formally evaluate Monorepo vs. Polyrepo against team collaboration dynamics.
3. **Plan Project Structure**: Establish strict boundary rules (apps never import directly from sibling apps; shared code resides in `packages/shared`).
4. **Implement Dependency Management**: Standardize workspace packages, hoist root devDependencies, pin exact package versions.
5. **Establish Version Control Practices**: Require pull requests for `main`, enforce conventional commit messages, block direct pushes.
6. **Set Up CI/CD Pipelines**: Implement path-filtered testing so changes to `apps/frontend` do not re-run backend integration tests.
7. **Ensure Code Quality and Testing**: Enforce zero-exception compiler strictness (`noImplicitAny`, `strictNullChecks`), ESLint, and security linters.
8. **Develop Documentation & Communication**: Synchronize changelogs with real-time documentation portals (`apps/frontend/features/document/`).
9. **Implement Access Control and Security**: Use `.github/CODEOWNERS` to mandate team reviews on sensitive paths (`infrastructure/`, `.github/`).
10. **Manage Change and Release Strategies**: Automate pre-deployment verification gates (`scripts/verify-deploy-gate.ts`).
11. **Optimize Scalability and Performance**: Eliminate circular dependencies, prevent repository bloat, run automated monorepo audits.
12. **Implement Tooling and Automation**: Build dedicated verification scripts (`scripts/verify-*.ts`) callable via `npm run`.
13. **Review and Iterate**: Regularly audit architecture against the 10 domains and refine boundary policies.

---

## 4. Alternate Deployment Continuity & Resilient Invocation

When primary CI/CD orchestration paths are disrupted, engineering teams must maintain a rehearsed break-glass deployment runbook:

- **Immutable Approved Inputs**: Deploy existing pre-built, cryptographically signed release digests.
- **Independent Identity**: Utilize scoped, temporary credentials outside the primary orchestrator.
- **Portable Deployment Logic**: Ensure deployment scripts run identically from local operator terminals or alternate runners.
- **Reconciliation Audit Trail**: Record release digest, target environment, operator identity, incident ticket reference, and health status for post-incident convergence.

---

## 5. Automated Verification CLI

To audit the repository architecture strategy and ensure strict compliance:

```bash
npm run verify:repo-strategy
```
