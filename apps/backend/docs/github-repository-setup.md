# GitHub Repository Setup

This guide applies when the standalone backend repository is created or connected to GitHub. Files in the repository cannot grant collaborator access or change GitHub Settings by themselves.

## Maintainer identities

The workflow allowlist is keyed only by immutable GitHub numeric account ID:

| Account ID  | Intended access                |
| ----------- | ------------------------------ |
| `70220432`  | Repository owner / maintainer  |
| `216975960` | Maintainer / code collaborator |

The ID-based PR check is defense in depth. GitHub's collaborator invitation screen still requires selecting the account; verify the selected profile before sending an invitation.

For a personal-account repository, GitHub gives the owner full control and collaborators write access. Write access permits code CRUD and normal pull-request/issue work. GitHub does not give a second account full owner/admin control on a personal repository. If both developers need repository settings, security settings, and access-management rights, transfer the repository to an organization and grant both appropriate admin roles.

If the repository is public, anyone can read its source even though only approved accounts receive write access. Make it private if source visibility must also be limited.

## Access and main-branch rules

In the target backend repository's **Settings**:

1. Under **Collaborators**, keep write access limited to the two intended accounts. Remove any unapproved write collaborators and teams. Check deploy keys and GitHub App access separately.
2. Add a ruleset or branch protection rule for `main`:
   - Require a pull request before merge.
   - Require one approval and dismiss stale approvals after new commits.
   - Require approval of the latest reviewable push by someone other than its author.
   - Require conversation resolution and the `approved-maintainer` and backend `verify` status checks. Require the CodeQL analysis check when code scanning is available for the repository plan.
   - Block force pushes and branch deletion; do not allow bypass where the selected ruleset supports it.
3. For organization-owned repositories, restrict direct pushes to the two approved maintainer accounts. For a personal repository, rely on its owner/collaborator write-access list and protect `main` with pull-request rules.
4. Set the default GitHub Actions token permission to read-only. Give deployment credentials only to the protected deployment environment and branches.
5. Enable Dependabot alerts and security updates. Enable secret scanning and push protection when available for the repository's visibility and plan.

The `approved-maintainer` workflow reads IDs from `.github/maintainers.json` and checks the pull-request author ID. It checks out only the trusted base commit and does not run pull-request code. Branch protection must require that check; otherwise it is informative only and does not block a merge. Collaborator permissions are still required to prevent unauthorized direct pushes.

## Deployment checks

- Deploy only from the protected backend branch or an approved release.
- Keep production credentials in the deployment provider's secret store, never in GitHub variables, source, or workflow logs.
- Use a narrowly scoped deployment credential and rotate it after suspected exposure or personnel changes.
- Keep backend and frontend deployment permissions separate; the frontend repository has its own access and deployment settings.
