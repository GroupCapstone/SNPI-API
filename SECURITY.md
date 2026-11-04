# Security Policy

## Report a vulnerability

Do not report security vulnerabilities in public issues or pull requests. Use GitHub's private vulnerability reporting for this repository if it is enabled. Otherwise, contact a repository owner privately through GitHub. Include the affected version, impact, and a safe reproduction summary. Do not include real student records, passwords, tokens, or production data.

## Security controls in this repository

- Backend CI runs format, lint, typecheck, tests, build, and an npm high-severity audit gate.
- CodeQL analyzes JavaScript and TypeScript on pushes, pull requests, and a weekly schedule.
- Dependabot checks npm and GitHub Actions dependencies weekly.
- A maintainer workflow checks pull-request authors by immutable GitHub account ID.
- The API uses validated environment settings, HTTPS enforcement in production, TLS MongoDB connections, authentication, RBAC, branch scoping, rate limits, and request validation.

The workflows provide checks; repository access and branch protections must also be enabled in GitHub Settings. Follow [GitHub repository setup](docs/github-repository-setup.md) and [the production security checklist](docs/production-checklist.md). Code scanning, secret scanning, and push protection availability depends on repository visibility and the GitHub plan.

## Supported code

Security fixes target the current maintained backend branch and release. Keep production deployments on a reviewed release and rotate credentials immediately if they may have been exposed.

## Maintainer identity policy

The pull-request check uses these GitHub numeric account IDs, not mutable usernames:

- `70220432`
- `216975960`

The source of truth is [.github/maintainers.json](.github/maintainers.json). This workflow check does not replace repository collaborator permissions or protected-branch settings.
