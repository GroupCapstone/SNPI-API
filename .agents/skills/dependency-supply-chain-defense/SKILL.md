---
name: dependency-supply-chain-defense
description: >-
  Authoritative Dependency Supply Chain Defense Standard (Ken Muse & Josh Johanning).
  Governs layered defenses across 6 core pillars: Package Lifecycle Script Disabling,
  Dev Container Isolation, Signed Commits with User Interaction, Repository Rulesets,
  OIDC Trusted Publishing with Provenance Attestations, and Automated Dependabot/Dependency Review.
---

# Authoritative Dependency Supply Chain Defense Standard

> **Status**: Primary Architectural & Security Standard  
> **Authors**: Ken Muse & Josh Johanning (October 2, 2026)  
> **Authoritative Scope**: Dependency Security, Supply Chain Integrity & DevSecOps Architecture  
> **Primary Safe Folder**: `.agents/skills/dependency-supply-chain-defense/`  
> **Unabridged Reference**: `references/dependency-supply-chain-attacks.md`  
> **Plaintext Reference**: `references/dependency-supply-chain-attacks.txt`  
> **Enterprise Knowledge Base**: `.github/knowledge/security/dependency-supply-chain-defense.md`  
> **Architecture Reference**: `docs/architecture/dependency-supply-chain-defense.md`  

---

## 1. Executive Summary & Attack Context

Modern software systems depend on third-party libraries and open-source modules. Attackers exploit this reliance through sophisticated supply chain attack vectors:
- **Malicious Lifecycle Scripts**: Exploiting `preinstall`, `install`, and `postinstall` hooks to run arbitrary commands with host user privileges (e.g., the *Shai-Hulud* self-replicating worm).
- **Typosquatting & Package Confusion**: Registering lookalike names or exploiting internal namespace resolution.
- **Maintainer Account Takeovers**: Pushing compromised patch releases to bypass security scrutiny.
- **Credential & Key Harvesters**: Crawling `~/.ssh`, `~/.aws`, and environment variables during package installation.

Managing dependency risk requires **defense-in-depth**: multiple overlapping security controls such that the failure of any single barrier is caught by the next layer.

---

## 2. The 6 Layers of Defense-in-Depth

```
+---------------------------------------------------------------------------------------------------+
|                        6 LAYERS OF DEPENDENCY SUPPLY CHAIN DEFENSE                                |
+---------------------------------------------------------------------------------------------------+
| Layer 1: Disable Lifecycle Scripts : ignore-scripts=true and save-exact=true in .npmrc            |
| Layer 2: Dev Container Isolation   : Isolated workspace; non-root user prevents host file access  |
| Layer 3: Signed Commits with Human : Biometric/passphrase verification blocks automated commits   |
| Layer 4: Enforce Repo Rulesets     : Mandatory PRs, 2 reviewers, required security status checks  |
| Layer 5: Trusted Publishing & OIDC : SLSA Level 3 provenance, npm audit signatures verification   |
| Layer 6: Continuous Monitoring     : Dependabot, dependency review action, and push protection    |
+---------------------------------------------------------------------------------------------------+
```

---

## 3. Concrete Architectural Implementations

### Layer 1: Disable Package Lifecycle Scripts by Default
Package lifecycle scripts run with full user permissions. Disabling automatic execution stops malicious post-install payloads from executing:

1. **Repository Root `.npmrc` Configuration**:
   ```ini
   # Enforce Layer 1 Dependency Supply Chain Defense (Ken Muse & Josh Johanning)
   ignore-scripts=true
   save-exact=true
   ```
2. **CI/CD Workflow Enforcement**:
   ```bash
   npm ci --ignore-scripts
   ```
3. **Selective Whitelisting**:
   When legitimate native compilation is required (e.g., `node-gyp`), run selective rebuilds after inspecting the source:
   ```bash
   npm rebuild <package-name>
   ```

### Layer 2: Dev Container Isolation
Isolates development environments from the host system, protecting developer SSH keys, cloud tokens, and root directories:
- **Configuration**: `.devcontainer/devcontainer.json`
- **Execution User**: Non-root user (`node` or `vscode`) with restricted sudo rights.
- **Port Auditing**: Host network isolation with explicit port forwarding.

### Layer 3: Signed Commits with User Interaction
Blocks automated malware from modifying code and creating commits on the developer's behalf:
- Commits must be cryptographically signed using GPG, SSH, or S/MIME keys.
- **Mandatory User Interaction**: Signing keys must require passphrase, biometric Touch ID, or hardware security keys (YubiKey).

### Layer 4: Enforce Repository Rulesets
Guarantees no code enters protected branches without automated inspection and human verification:
- Require pull requests before merging.
- Require status checks to pass (`npm run typecheck`, `npm run lint`, `npm run audit:appsec`, `npm run verify:supply-chain`).
- Require dual-control approval on critical branches.
- Require re-review when new commits are pushed.

### Layer 5: Trusted Publishing & Provenance Attestations
Eliminates long-lived registry tokens and guarantees package origin:
- **OIDC Publishing**: Package registries authenticate GitHub Actions via OpenID Connect (OIDC).
- **SLSA Level 3 Provenance**: Packages published with `npm publish --provenance`.
- **Consumer Verification**: Verify package provenance in CI with `npm audit signatures`.

### Layer 6: Continuous Vulnerability Monitoring & Triage
- **Dependabot**: Automated security updates with scheduled scans and auto-triage rules.
- **Dependency Review Action**: `.github/workflows/dependency-review.yml` blocks PRs introducing high/critical CVEs.
- **Secret Scanning & Push Protection**: Blocks secrets from entering the git commit stream.
- **Human Review**: Never rely on SemVer for security decisions; inspect diffs for all dependency bumps.

---

## 4. Architectural Invariants & Verification

Every CI workflow and local audit evaluates compliance against these primary invariants:

1. **INVARIANT-1 (Lifecycle Scripts)**: `.npmrc` must exist at repository root containing `ignore-scripts=true` and `save-exact=true`.
2. **INVARIANT-2 (Container Isolation)**: `.devcontainer/devcontainer.json` must be present and configure a non-root user.
3. **INVARIANT-3 (Deterministic Builds)**: `package-lock.json` must be tracked and valid with sha512 integrity hashes.
4. **INVARIANT-4 (Automated Review Action)**: `.github/workflows/dependency-review.yml` must execute on pull requests targeting `main`.
5. **INVARIANT-5 (Audit Tooling)**: `npm run verify:supply-chain` must pass with 100% compliance before releases.
6. **INVARIANT-6 (Zero Emojis)**: All reports, logs, and commit messages must use textual status badges (`[PASSED]`, `[FAILED]`, `[WARNING]`, `[P0]`, `[P1]`).

---

## 5. Verification Commands

```bash
# Run the 6-layer Dependency Supply Chain Defense Auditor
npm run verify:supply-chain

# Audit application security SDLC checklist
npm run audit:appsec

# Run full deployment quality gate
npm run deploy:verify
```
