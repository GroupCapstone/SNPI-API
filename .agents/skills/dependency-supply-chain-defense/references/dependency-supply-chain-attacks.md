# Defending Against Dependency Supply Chain Attacks

**Authors**: [Ken Muse](https://github.com/kenmuse) and [Josh Johanning](https://github.com/joshjohanning)  
**Published**: December 10, 2025  
**Updated**: October 2, 2026  
**Source**: GitHub Well-Architected Framework & Application Security Recommendations  

---

## Scenario Overview

Modern software development relies heavily on dependencies — third-party packages, libraries, and modules that accelerate development but also introduce security risks. Supply chain attacks targeting dependencies have become increasingly sophisticated, with malicious actors using techniques like typosquatting, package confusion, package hijacking, account takeovers, and injecting malicious code into legitimate packages.

One notable example is [Shai-Hulud](https://socket.dev/blog/ongoing-supply-chain-attack-targets-crowdstrike-npm-packages), a self-replicating worm that infiltrated the npm ecosystem via compromised maintainer accounts, injecting malicious post-install scripts into popular JavaScript packages. The malware also stole credentials, injected backdoors, and attempted to destroy the user's home directory.

Managing dependency threats requires a defense-in-depth strategy. No single control is perfect. Even registry-level protections like package cooldown periods (waiting periods after unpublishing before names can be re-registered) aren't sufficient against determined attackers. Layering multiple defenses creates a more robust security posture. This article provides opinionated guidance on implementing practical security measures that have been field-tested against real-world attacks like Shai-Hulud.

---

## Key Design Strategies

Layered defenses reduce single points of failure by using multiple controls that reinforce each other — each covers gaps the others leave, so together they form a complete defense. Implement these core strategies:

1. **Disable package lifecycle scripts by default**: Package managers execute scripts automatically during installation (`preinstall`, `postinstall`, etc.). These scripts can run arbitrary code on your system before you've reviewed the package contents. Disabling them by default prevents the most common attack vector.
2. **Use dev containers for isolation**: Development containers provide strong isolation between host machine and project environment. Even if malicious code executes, it can't access the actual home directory, SSH keys, or cloud credentials. GitHub Codespaces and Windows 365 provide managed environments with isolation built in.
3. **Require signed commits with user interaction**: Cryptographic commit signing with biometric or password authentication prevents malicious scripts from creating commits without your knowledge. This blocks multi-stage attacks that modify your codebase.
4. **Enforce repository rulesets**: Require pull requests and status checks for all changes to protected branches. This creates a checkpoint where automated security scans catch malicious code before it reaches your default branch.
5. **Establish trusted publishing and verification**: Implement OIDC-based trusted publishing to eliminate long-lived tokens, and validate package attestations when consuming dependencies to verify they come from trusted sources.
6. **Monitor and respond continuously**: Automate vulnerability detection with Dependabot, dependency review, code scanning, and secret scanning. Tune alerts to reduce fatigue and establish response runbooks.

---

## Implementation Checklist

- [x] Configure package managers to disable lifecycle scripts by default.
- [x] Always use lockfiles for ecosystems that support them to ensure deterministic builds.
- [x] Use dev containers for development, especially for untrusted code.
- [x] Enable commit signing with user interaction (passphrase, biometric, or hardware key).
- [x] Configure repository rulesets requiring pull requests and status checks.
- [x] Enable Dependabot alerts and security updates for all repositories.
- [x] Configure dependency review action as a required status check on pull requests.
- [x] Enable code scanning with CodeQL or third-party tools; block merges on high-severity findings using rulesets.
- [x] Enable secret scanning with push protection; verify partner patterns are enabled and custom patterns are defined for organization-specific secrets.
- [x] Use trusted publishing with OIDC for any packages you maintain.
- [x] Publish packages with provenance attestations (e.g., `npm publish --provenance`).
- [x] Verify package attestations for dependencies using `npm audit signatures` in CI/CD.
- [x] Configure Dependabot auto-triage rules to reduce alert fatigue.
- [x] Create incident response runbooks for different alert severity levels.
- [x] Document security exceptions and keep lockfiles current.

---

## Assumptions and Preconditions

This guidance assumes:
- **Package ecosystem**: This guidance uses npm or Yarn for JavaScript/TypeScript projects as examples. Similar principles apply to other ecosystems (pip, Maven, NuGet), but specific configurations differ.
- **GitHub repository**: You have administrative access to configure repository settings, rulesets, and GitHub Actions workflows.
- **Dependabot and GitHub Advanced Security features**: This guidance uses Dependabot, dependency review, code scanning, and secret protection. Feature availability varies by GitHub plan.
- **Development environment**: You can configure your local development environment or are using GitHub Codespaces/dev containers.
- **CI/CD with GitHub Actions**: Your build and deployment pipelines use GitHub Actions. Adapt the workflow examples if using other CI/CD systems.

---

## Recommended Deployment: The 6 Layers of Defense

### Layer 1: Disable Package Lifecycle Scripts

The most effective defense against supply chain attacks is to disable automatic execution of package lifecycle scripts. Since these attacks exploit lifecycle scripts to gain initial access, this configuration blocks them completely.

> [!WARNING]
> Package lifecycle scripts run with the same permissions as your user account. They have access to your files, environment variables, SSH keys, cloud credentials, and more. A compromised package can do serious damage before you even realize something is wrong.

#### For npm
Create or update your `.npmrc` file in your project root:
```ini
ignore-scripts=true
save-exact=true
```

- `ignore-scripts=true`: Tells npm to skip all lifecycle scripts (`preinstall`, `install`, `postinstall`) during installation.
- `save-exact=true`: Ensures npm saves exact versions (not version ranges `^` or `~`) in your `package.json`, preventing unexpected updates to newer versions that might contain malicious code.

> [!NOTE]
> **Project root vs. home directory**: Placing `.npmrc` in the project root (committed to the repository) ensures all contributors and CI systems use the same secure configuration. This provides consistent protection across the team without relying on individual developer setups.

For one-off commands or environments where you cannot modify the config, pass `--ignore-scripts` directly:
```bash
npm ci --ignore-scripts
npm install --ignore-scripts
```

When you need to run scripts for a specific, vetted package:
```bash
npm rebuild <package-name>
```

#### For Yarn (v2+)
Create or update your `.yarnrc.yml` file:
```yaml
enableScripts: false
enableImmutableInstalls: true
defaultSemverRangePrefix: ""
```

Opt-in explicitly for legitimate packages requiring lifecycle scripts:
```json
{
  "dependenciesMeta": {
    "esbuild": {
      "built": true
    }
  }
}
```

#### For GitHub Actions Workflows
Configure your workflows to install dependencies with lifecycle scripts disabled:
```yaml
- name: Install dependencies
  run: npm ci --ignore-scripts

- name: Build application
  run: npm run build
```

#### When to Allow Lifecycle Scripts
When legitimate packages require lifecycle scripts (e.g., native compilation via node-gyp):
1. Review package source code to understand what the scripts do.
2. Verify the package publisher is trustworthy.
3. Document the exception in your security policy.
4. Enable scripts selectively using `npm rebuild <package-name>` after installation.
5. Monitor for changes in subsequent versions.

---

### Layer 2: Use Dev Containers for Isolation

Even with package scripts disabled, dev containers provide an additional security boundary. You can run dev containers locally with Docker, or use GitHub Codespaces for a fully managed dev container environment. Cloud PCs like Windows 365 can also provide isolation from your primary machine.

By isolating development in a separate environment, malicious scripts can only access the environment's ephemeral home directory, not your actual host files, credentials, or SSH keys. This blocks damage from attacks like Shai-Hulud, which attempted to destroy home directories when secrets were not found.

#### Dev Container Security Benefits
- **Limited host access**: The container only accesses directories explicitly mounted.
- **Port visibility**: Any attempts to open network ports surface as notifications.
- **Credential scoping**: In Codespaces, Git credentials are automatically scoped to defined repositories.
- **Ephemeral environment**: Destroying the container home directory has zero lasting impact on the host.

#### Configure Non-Root Users in VS Code
Ensure your dev container runs as a non-root user:
```json
{
  "image": "mcr.microsoft.com/devcontainers/base:noble",
  "containerUser": "vscode"
}
```
For additional hardening, remove sudo privileges from the container user.

---

### Layer 3: Require Signed Commits with User Interaction

One subtle risk in supply chain attacks is that malicious code might commit changes to your repository as part of a multi-stage attack. Requiring signed commits with user interaction blocks attempts to create commits without developer knowledge.

#### Configure Commit Signing
Configure commit signing using a GPG, SSH, or S/MIME key requiring user interaction (passphrase-protected key, biometric authentication via Touch ID, or hardware security key like YubiKey).

> [!NOTE]
> **Why user interaction matters**: The key defense isn't just the cryptographic signature — it's the human verification step. A malicious script running on your machine can access your signing key if unlocked, but it cannot press your fingerprint to the sensor or type your passphrase. This human-in-the-loop requirement blocks automated attacks from creating commits on your behalf.

---

### Layer 4: Enforce Repository Rulesets

This defense layer operates at the repository level. Rulesets ensure that no code reaches your default branch without going through review and automated security checks.

#### Protection Rules Configuration:
1. Require pull requests before merging.
2. Require signed commits.
3. Require status checks to pass (including security scans and dependency review).
4. Require at least one approver (preferably two for critical repositories).
5. Require re-review when new commits are pushed.
6. Require review from someone other than the last pusher.
7. Require code scanning results (zero high/critical alerts).
8. Do not allow bypassing of pull request requirements.

---

### Layer 5: Establish Trusted Publishing and Verification

Build trust across the supply chain by establishing cryptographic provenance for packages. This layer operates in both directions: publishers create trustworthy artifacts, and consumers verify them.

#### For Package Publishers: Configure Trusted Publishing
Trusted publishing removes the need to manage long-lived API tokens in build systems. CI/CD pipelines attest build artifacts and use OpenID Connect (OIDC) to authenticate directly with package registries. This achieves **SLSA Build Level 3** security and code-to-cloud traceability, eliminating token theft risks.

- Link your GitHub repository as a trusted publisher in package registry settings (npm, PyPI, RubyGems, NuGet, crates.io).
- Update release workflows to use OIDC authentication instead of long-lived tokens.
- Publish with provenance attestations (`npm publish --provenance`) to create cryptographic proof on the specific commit of the source repository.
- Create linked artifact storage records with the `actions/attest` action.

#### For Package Consumers: Validate Package Attestations
Package attestations provide cryptographic proof of a package's provenance, verifying it was built from specific source code through a verified build process.

- Use `npm audit signatures` to verify packages have valid attestations and signatures, identifying the source repository and commit.
- Integrate attestation validation into CI/CD pipelines for continuous verification.
- Prioritize dependencies published with attestations in dependency selection decisions.

---

### Layer 6: Monitor and Respond Continuously

Automate vulnerability detection and establish processes for responding to security alerts, maintaining visibility into dependency risk without overwhelming teams with alert fatigue.

#### Configure Automated Scanning
- **Dependabot security updates**: Automatically detect vulnerabilities and create PRs. Group patch updates and schedule daily/weekly scans. Use auto-triage rules to reduce noise.
- **Dependency review action**: Add `actions/dependency-review-action` to PR workflows as a required status check. Fail on high/critical vulnerabilities, block problematic licenses, and warn on low OpenSSF Scorecard scores.
- **Code scanning**: Run CodeQL or third-party SAST tools on pull requests and block merges on vulnerabilities.
- **Secret scanning with push protection**: Prevent secrets from being committed, backed by clear response runbooks.
- **Prioritize alerts with production context**: Filter alerts using deployment context (`has:deployment`, runtime risk, EPSS, CVSS) to remediate vulnerabilities affecting production code first.

#### Review Dependency Updates Systematically
Avoid auto-merging dependency updates without human review. Compromised maintainer accounts often push malicious code as patch releases because they receive less scrutiny.

- **Review changelogs and release notes**: Inspect breaking changes, security fixes, and new features.
- **Verify maintainer identity**: Watch for recent ownership transfers, new maintainers, or changes in publishing cadence.
- **Inspect the diff**: Review actual code changes between versions, especially for packages with elevated system access.
- **Do not trust SemVer for security decisions**: SemVer reflects intended API compatibility, not security posture. A patch release can introduce backdoors.
- **Group updates for review**: Batch dependency updates into scheduled review sessions.
- **Document decisions**: Maintain an audit trail of approved and rejected versions.

---

## Trade-offs and Considerations

### Balancing Security with Development Velocity
- **For high-security environments**:
  - Disable lifecycle scripts with zero exceptions except explicitly approved packages.
  - Require manual review of all dependency updates.
  - Validate package attestations and block on missing attestations.
  - Use allow-lists of approved dependencies.
  - Mirror packages through private registries (GitHub Packages, Artifactory, Nexus).
- **For balanced environments**:
  - Disable lifecycle scripts by default with documented exceptions.
  - Require human review for all dependency updates (batched for efficiency).
  - Validate attestations when available.
  - Use dependency review action and code scanning as automated safety nets.

### Common Challenges & Solutions
1. **Packages requiring lifecycle scripts**: Document exceptions and execute `npm rebuild <package>` selectively after installation.
2. **Alert fatigue**: Implement auto-triage rules for Dependabot.
3. **Transitive dependencies**: Gain visibility through `npm audit`, Dependabot, and dependency review; replace dependencies that pull in risky transitives.
4. **Keeping lockfiles current**: Regularly update dependencies to prevent stale lockfiles while ensuring deterministic builds.
5. **Workflow security risks**: Prefer `pull_request` over `pull_request_target`, enforce least-privilege permissions, and apply action SHA pinning.
