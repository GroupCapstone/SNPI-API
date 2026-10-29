# SNP-SMS Backend

Standalone Express 5, TypeScript, and MongoDB API for SNP-SMS. The Next.js frontend is maintained in a separate repository and communicates through `/api/v1`.

## Start locally

Requirements: Node.js `>=22.13.0`, npm, and Docker for local MongoDB.

```bash
cp .env.example .env
npm ci
docker compose up -d mongodb
npm run dev
```

The API runs at `http://localhost:4000`. Set private development values in `.env`; never commit secrets. For a full container setup, use `docker compose up -d --build`.

## Verify changes

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=high
```

GitHub Actions also runs CI, CodeQL, Dependabot updates, and a pull-request maintainer-ID check. Repository settings still need the access and branch rules in [GitHub repository setup](docs/github-repository-setup.md).

## Security and project standards

- [Security policy and security checks](SECURITY.md)
- [GitHub maintainer access and branch rules](docs/github-repository-setup.md)
- [Production security checklist](docs/production-checklist.md)
- [API security reference](docs/api/api-security-dictionary.md)
- [Architecture and request flow](docs/architecture/product-folder-structure.md)
- [Contributing](CONTRIBUTING.md) | [Code of Conduct](CODE_OF_CONDUCT.md) | [MIT License](LICENSE)
- All AI agents and contributors follow [AGENTS.md](AGENTS.md) and the shared [.agents/skills/SKILL.md](.agents/skills/SKILL.md).
