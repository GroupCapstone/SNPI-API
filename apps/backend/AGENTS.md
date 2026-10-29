# SNP-SMS Backend Agent Rules

These rules apply to every AI coding agent and human contributor working in this repository. They are project rules, not instructions for one vendor, model, IDE, or agent framework.

## Required reading

Before changing code or project structure, read:

1. `.agents/skills/VERSION.md` for the current milestone and scope.
2. `.agents/skills/SKILL.md` for the shared SNP-SMS engineering standard.
3. Any task-specific skill under `.agents/skills/` that applies.
4. The relevant API documentation, route, module, tests, and deployment configuration.
5. `SECURITY.md` and `CONTRIBUTING.md` when the change touches access, CI, release, or contribution policy.

The shared skill is the source of truth for all agents. Do not replace it with personal memory, model-specific prompts, or unrecorded chat instructions.

## Repository boundary

This repository is the standalone Express, TypeScript, and MongoDB backend. The Next.js frontend is in the separate `snp-sms-frontend` repository and is deployed independently. Keep frontend pages, components, package dependencies, Vercel config, and frontend CI out of this repository. Preserve the HTTP API as the integration boundary.

## Required architecture and safety

- Keep domain code in `src/modules/<domain>/` using the established model, types, validation, repository, service, controller, and route layers.
- Preserve existing paths, methods, payloads, response shapes, status codes, auth behavior, and compatibility aliases unless the user explicitly asks for an API change.
- Validate all request input and enforce authentication, RBAC, branch access, tenant relationships, and audit rules server-side. Never trust browser-supplied IDs or permissions.
- Preserve school/branch/department/position relationships and parent-child soft-delete protections.
- Never hardcode credentials or expose them in output, docs, fixtures, logs, tests, Docker arguments, or committed environment files.
- Use `.github/maintainers.json` numeric GitHub account IDs as the only maintainer identity allowlist; do not substitute mutable usernames or modify the allowlist without explicit owner direction.
- Do not remove a file just because it has no import. Check CLI entry points, dynamic loading, package scripts, CI, deployment manifests, tests, docs, and operator workflows first.
- Keep changes minimal and in the backend scope. Do not add future milestone features without explicit direction.

## One workflow for every agent

1. Read the required sources above and state the applicable milestone.
2. Map the request path from `src/app.ts` through route, middleware, controller, service, repository, model, and tests as applicable.
3. Inspect references and existing patterns; identify API and data invariants before editing.
4. Make the smallest change that meets the request, reusing existing code and keeping frontend work in its separate repository.
5. Add/update tests for changed endpoint behavior and update docs when architecture, operation, or contracts change.
6. Run `npm run format:check && npm run lint && npm run typecheck && npm test && npm run build` when implementation work is complete. Report commands that could not be run and why; never claim a pass without output.
7. Review the final diff for secrets, unintended API/business changes, unreferenced leftovers, and scope creep.
8. End with an `IMPLEMENTATION SUMMARY` covering changed files, reuse, assumptions, and verification results.

## Local install and package updates

- Required runtime: Node.js `>=22.13.0` and npm.
- Install the locked dependency tree with `npm ci`; do not commit `node_modules`.
- Local DB-backed development needs the MongoDB replica set in `docker-compose.yml` and private `.env` values based on `.env.example`.
- Review `npm outdated`, package engine/peer requirements, and release notes before updates. Change manifest and lockfile together, avoid forced major upgrades, and run the verification pipeline after updates.

See `docs/architecture/product-folder-structure.md` for the full backend layout, request flow, dependency guidance, and safe removal criteria.

## GitHub access policy

The maintainer identity gate reads `.github/maintainers.json` and checks the pull request author's numeric GitHub account ID. GitHub repository collaborator permissions and protected-branch settings are separate controls and must be configured in the repository settings. Follow `docs/github-repository-setup.md`; do not claim these remote settings are enabled unless verified.
