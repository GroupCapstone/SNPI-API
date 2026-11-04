# Contributing

## Before changing code

Read [AGENTS.md](AGENTS.md), [.agents/skills/VERSION.md](.agents/skills/VERSION.md), and the shared [.agents/skills/SKILL.md](.agents/skills/SKILL.md). Keep changes within the active milestone and this backend repository. The frontend is maintained separately.

## Local setup

Use Node.js `>=22.13.0`, npm, and the committed lockfile. Copy `.env.example` to `.env`, add private local values, then run:

```bash
npm ci
docker compose up -d mongodb
npm run dev
```

Never commit `.env`, real credentials, customer data, or production logs.

## Changes and review

- Preserve existing REST paths, methods, payloads, response shapes, and status codes unless an API change is explicitly requested.
- Follow the backend seven-layer module pattern and existing authentication, RBAC, tenant, branch, and audit rules.
- Add or update tests for changed endpoint behavior. Keep migrations and seed scripts safe for their intended environment.
- Open a pull request to `main` with a short summary, risk notes, and verification results. Do not include secrets in the pull request.
- Run the checks listed in [README.md](README.md). Do not claim a check passed unless it was run successfully.

Pull requests from maintainer accounts are verified by numeric GitHub account ID. Repository access and required reviews are managed separately in GitHub Settings; see [GitHub repository setup](docs/github-repository-setup.md).
