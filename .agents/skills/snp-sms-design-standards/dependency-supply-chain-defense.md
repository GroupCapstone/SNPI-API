# Dependency Supply Chain Defense Standard (Agent Mirror)

This mirror document provides autonomous agents with quick operational access to the 6-layer dependency defense specification.

## Core Rules for Autonomous Agents

1. **Never Enable Lifecycle Scripts Globally**: Always preserve `ignore-scripts=true` in `.npmrc`.
2. **Deterministic Version Pinning**: New dependencies in `package.json` must use exact versions (no `^` or `~`), guaranteed by `save-exact=true`.
3. **Lockfile Integrity**: Always commit clean, untampered `package-lock.json` with valid sha512 integrity hashes.
4. **Dev Container Compliance**: Ensure local development configurations run inside dev containers with non-root user permissions.
5. **Zero Emojis**: All audit outputs, commit messages, and logs must use textual status badges (`[PASSED]`, `[FAILED]`, `[WARNING]`).
6. **Automated Verification**: Run `npm run verify:supply-chain` before marking any dependency update complete.
