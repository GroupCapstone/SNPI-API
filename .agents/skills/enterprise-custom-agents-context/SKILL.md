---
name: enterprise-custom-agents-context
description: "Architect, provision, and maintain GitHub Enterprise Custom Agents with expanded context via Model Context Protocol (MCP) and GitHub's built-in MCP server, bypassing the 30,000-character single-file limitation through dynamic knowledge retrieval."
---

# Enterprise Custom Agents: Expanded Context via Model Context Protocol (MCP)

> [!NOTE]
> **Authoritative Reference Article**: The complete, unabridged source article is safely archived in [`references/enterprise-custom-agents-article.md`](references/enterprise-custom-agents-article.md).

This skill provides an authoritative, enterprise-grade architecture for overcoming the **30,000 character limit** of GitHub Enterprise Custom Agents by dynamically loading modular knowledge files through GitHub's built-in Model Context Protocol (MCP) server.

---

## 1. Problem Statement & Architecture

### 1.1 The 30,000-Character Barrier
GitHub Enterprise Custom Agents provide tailored instructions to Copilot Coding Agents via markdown files stored in `.github-private/` or `.github/`. However:
1. **Single-File Isolation**: When an agent executes, only the singular agent definition markdown file is passed in-context. All sibling repository files remain inaccessible by default.
2. **Strict Size Budget**: The agent definition file cannot exceed **30,000 characters**, preventing organizations from bundling comprehensive enterprise security, architecture, CI/CD, and UI guidelines into a single prompt.

### 1.2 The MCP Dynamic Loading Solution
By integrating GitHub's built-in MCP server, custom agents dynamically fetch modular, topic-specific knowledge files at runtime using the `get_file_contents` tool.

```
+-----------------------------------------------------------------------------------+
| GitHub Enterprise Custom Agent Runtime                                            |
|                                                                                   |
|  1. Agent invoked via UI / PR comment / Issue                                     |
|  2. Agent parses "Critical Startup Procedures" in definition markdown             |
|  3. Agent calls GitHub MCP Server: get_file_contents(repo, path, ref)             |
|  4. MCP authenticates using COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN secret        |
|  5. Agent ingests modular knowledge files into dynamic working memory             |
|  6. Agent executes task strictly guided by organizational standards               |
+-----------------------------------------------------------------------------------+
```

---

## 2. The 4 Core Design Strategies

1. **Centralized Knowledge Management**:
   - Store all organizational guidance in a structured `knowledge/` hierarchy within the central private repository (`.github-private` or target root `.github/knowledge/`).
   - Managed via standard Git pull requests, code reviews, and `CODEOWNERS` policies.
2. **Dynamic Context Loading**:
   - The agent definition file remains lightweight (<10,000 characters), containing only role identity, tool bindings, and startup fetching instructions.
   - Domain knowledge updates take effect immediately across all agents without modifying agent definition files.
3. **Per-Repository Authentication**:
   - Secure access to private repositories using repository-scoped `copilot` environments with secret `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`.
   - Supports GitHub Enterprise Cloud with Managed Users (EMU) and Data Residency.
4. **Modular Domain Organization**:
   - Deconstruct complex policies into focused, single-concern markdown documents (under 10,000 characters each):
     * `knowledge/security/`: Secure coding, authentication, OWASP mitigations.
     * `knowledge/architecture/`: Modular monolith, database ACID transactions, API contracts.
     * `knowledge/ci-cd/`: GitHub Actions workflows, push checkpoints, container hardening.
     * `knowledge/design-standards/`: Component taxonomies, design tokens, psychological UI rules.

---

## 3. Implementation Checklist

| Step | Action Item | Verification Target |
| :---: | :--- | :--- |
| **01** | Create `knowledge/` directory structure | Partitioned by `security/`, `architecture/`, `ci-cd/`, `design-standards/` |
| **02** | Author modular knowledge files | Single-concern markdown files (<10,000 chars) with metadata headers |
| **03** | Create or update agent markdown definitions | Include mandatory "Critical Startup Procedures" with MCP file fetch list |
| **04** | Generate GitHub PAT (Service Account) | Fine-grained PAT scoped to repository contents (`read`) or classic `repo` |
| **05** | Configure `copilot` repository environment | Repository Settings > Environments > `copilot` |
| **06** | Add MCP environment secret | `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` populated with PAT |
| **07** | Assign domain ownership | Configure `CODEOWNERS` mapping knowledge subdirectories to teams |
| **08** | Verify execution in test environment | Monitor Copilot Agent panel for `get_file_contents` tool calls |

---

## 4. Directory Hierarchy Standard

```text
.github/ (or .github-private/)
├── agents/
│   ├── ci-cd-expert.md
│   ├── security-reviewer.md
│   ├── architecture-advisor.md
│   └── design-system-lead.md
├── knowledge/
│   ├── README.md
│   ├── security/
│   │   ├── secure-coding-standards.md
│   │   ├── authentication-patterns.md
│   │   └── vulnerability-remediation.md
│   ├── architecture/
│   │   ├── modular-monolith-patterns.md
│   │   ├── api-design-guidelines.md
│   │   └── database-standards.md
│   ├── ci-cd/
│   │   ├── github-actions-best-practices.md
│   │   ├── deployment-workflows.md
│   │   └── container-security.md
│   └── design-standards/
│       ├── psychological-design-rules.md
│       ├── culinary-component-taxonomy.md
│       └── open-source-checklist-macro-phases.md
```

---

## 5. Agent Definition Template with MCP Startup Procedures

Every enterprise custom agent definition file must follow this exact structure:

```markdown
# [Agent Role Name]

You are a specialized enterprise coding agent tailored to the workflows, coding standards, and architectural policies of this organization.

## Critical Startup Procedures

Before formulating recommendations, analyzing code, or writing implementation files, you MUST fetch all mandatory knowledge resources from the organizational knowledge base.

### Required Knowledge Resources

Invoke the GitHub MCP server tool `get_file_contents` to fetch the following files:

**Target Repository Configuration:**
- Owner: `[organization-or-owner]`
- Repository: `[repository-name]`
- Branch / Ref: `main`

**Required Files (fetch in parallel or sequence before proceeding):**
1. `knowledge/[domain]/[file-1].md`
2. `knowledge/[domain]/[file-2].md`
3. `knowledge/[domain]/[file-3].md`

These files contain authoritative standards, type invariants, and compliance mandates that MUST govern all actions you perform.

## Operational Mandates
- Explicitly cite the specific section of the loaded knowledge files when giving guidance.
- Refuse code changes or architectural patterns that violate loaded policies.
- Adhere strictly to the project verification pipeline before declaring tasks complete.
```

---

## 6. Authentication & Environment Secrets Setup

### 6.1 PAT Generation Guidelines
1. **Service Account Requirement**: Always create the Personal Access Token under an enterprise service/bot account (e.g., `@snp-ci-bot`), never a personal developer account.
2. **Token Scope**:
   - **Fine-Grained PAT (Recommended)**:
     - Resource owner: Target organization or user
     - Repository access: Only target knowledge repository
     - Permissions: `Repository permissions` -> `Contents: Read-only`
   - **Classic PAT (Fallback)**:
     - Scopes: `repo` (Full control of private repositories)
3. **Expiration**: Align with organizational credential rotation policies (e.g., 90 days with calendar alerts).

### 6.2 Setting Repository Environment Secrets
In every target repository where Copilot Custom Agents operate:
1. Navigate to: `Settings` > `Environments` > `New environment`
2. Environment name: **`copilot`** (strictly lowercase)
3. Environment secrets > `Add secret`:
   - Secret Name: **`COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`**
   - Secret Value: `[PAT Token Value]`

---

## 7. Multi-Repository Automation Script

For multi-repo enterprise setups, automate environment and secret provisioning using the GitHub CLI (`gh`):

```bash
#!/usr/bin/env bash
set -euo pipefail

# Provision COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN across organization repos
ORG="your-org-name"
PAT_TOKEN="${COPILOT_PAT_TOKEN:?Error: Set COPILOT_PAT_TOKEN in environment}"

echo "Fetching repository list for organization: ${ORG}..."
REPOS=$(gh repo list "${ORG}" --limit 300 --json name -q '.[].name')

for REPO in ${REPOS}; do
  echo "Configuring copilot environment for ${ORG}/${REPO}..."
  
  # Ensure copilot environment exists
  gh api --method PUT -H "Accept: application/vnd.github+json" \
    "/repos/${ORG}/${REPO}/environments/copilot" > /dev/null 2>&1 || true
    
  # Set the environment secret
  echo "${PAT_TOKEN}" | gh secret set COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN \
    --repo "${ORG}/${REPO}" \
    --env copilot
    
  echo "[PASS] ${ORG}/${REPO} configured."
done

echo "Enterprise MCP secret provisioning complete."
```

---

## 8. Verification & Diagnostics

### 8.1 Runtime Verification Steps
1. Open GitHub Copilot Chat or assign a GitHub Copilot coding task referencing the agent (e.g., `@ci-cd-expert`).
2. Observe the Copilot Agent execution panel.
3. Verify that logs display MCP calls:
   `Called tool: github.get_file_contents({ owner: "...", repo: "...", path: "knowledge/..." })`
4. Confirm agent output references the retrieved knowledge standards.

### 8.2 Troubleshooting Matrix

| Symptom | Root Cause | Remediation |
| :--- | :--- | :--- |
| **Agent does not fetch files** | Missing or misspelled environment name | Ensure environment is named exactly `copilot` (case-sensitive) |
| **MCP 401 Unauthorized** | Missing or expired secret | Verify `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` value and validity |
| **MCP 404 Not Found** | Incorrect owner, repo, branch, or file path | Validate repository coordinates in the agent's Startup Procedures |
| **Token scope error** | Insufficient PAT permissions | Ensure PAT has `repo` or `Contents: Read-only` permission |
| **Slow agent startup** | Too many large knowledge files fetched | Consolidate files; keep each file under 10,000 characters |

---

## 9. Best Practices for Enterprise Maintenance

1. **Keep Knowledge Files Atomic**: Limit each document to a single cohesive topic under 10,000 characters.
2. **Metadata Headers**: Include `Last updated`, `Reviewed by`, and `Version` frontmatter in every knowledge file.
3. **CODEOWNERS Enforcement**: Enforce mandatory peer reviews from domain leads before merging changes to `knowledge/`.
4. **Zero Emojis Mandate**: Adhere strictly to the workspace zero-emoji policy; use textual status codes (`[PASSED]`, `[FAILED]`, `[WARNING]`).
5. **Continuous Quality Gate**: All changes to knowledge files must pass Prettier formatting and markdown linting before push.
