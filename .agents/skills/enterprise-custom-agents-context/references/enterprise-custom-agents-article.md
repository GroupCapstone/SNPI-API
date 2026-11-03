# Expanding the Context of Enterprise Custom Agents

## Scenario Overview
GitHub Enterprise Custom Agents enable organizations to create specialized coding agents tailored to their development workflows, coding standards, and internal processes. These agents are configured at the enterprise level and defined by markdown files stored in the `.github-private` repository of a configured organization, providing context and instructions to guide the Copilot Coding Agent's behavior.

However, the defining markdown file has a 30,000 character limit, which can be restrictive when providing comprehensive context for complex enterprise environments. When a custom agent is invoked through the GitHub UI, only this singular markdown file is passed as context—all other files in the repository remain inaccessible to the agent during execution.

This limitation becomes particularly challenging for organizations that need to provide extensive guidance on coding patterns, architectural standards, security requirements, and compliance policies. The challenge is further complicated by authentication and access control requirements, especially in GitHub Enterprise Cloud with Managed Users (EMU) and Data Residency environments where secure access to private repositories is essential.

This article provides a prescriptive approach to expanding the available context beyond the single markdown file by leveraging the Model Context Protocol (MCP) and GitHub's built-in MCP server.

---

## Key Design Strategies and Checklist

### Design Strategies
- **Centralized knowledge management**: Store additional context files in a structured knowledge directory within the `.github-private` repository. This keeps all custom agent resources in a single, version-controlled location that administrators can manage through standard Git workflows.
- **Dynamic context loading**: Instruct custom agents to fetch additional context files at runtime using the GitHub MCP server. This approach allows agents to access expanded context without hitting the single-file character limit, and enables updates to knowledge files without modifying the agent definition.
- **Per-repository authentication**: Configure repository-specific access credentials using Copilot environment secrets. This provides fine-grained control over which repositories can access expanded context while maintaining security boundaries.
- **Structured content organization**: Organize knowledge files by domain, topic, or concern (e.g., security policies, Docker patterns, CI/CD best practices). This modular approach makes it easier to maintain and update specific areas of guidance as organizational standards evolve.

### Implementation Checklist
1. Create a knowledge directory in the `.github-private` repository
2. Organize knowledge files using descriptive filenames and subdirectories
3. Update custom agent markdown to include instructions for fetching knowledge files
4. Generate a Personal Access Token (PAT) with repo scope for the `.github-private` repository
5. Configure the `copilot` environment in target repositories
6. Add the `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN` secret to each repository environment
7. Test the agent to verify it successfully fetches and uses expanded context
8. Document the knowledge file structure and maintenance procedures for your team

---

## Assumptions and Preconditions
Before implementing this solution, the following must be in place:
- **GitHub Enterprise Custom Agents enabled**: Your organization has GitHub Enterprise Custom Agents configured and the `.github-private` repository created.
- **Model Context Protocol (MCP) configured**: The Model Context Protocol is enabled in your GitHub Enterprise settings, providing access to the GitHub MCP server.
- **Administrative access**: You have admin access to the `.github-private` repository and permissions to configure environment secrets in target repositories.
- **GitHub Enterprise Cloud**: This solution is designed for GitHub Enterprise Cloud, including EMU and Data Residency environments. It leverages features specific to these platforms.
- **Understanding of custom agents**: Team members responsible for implementing this solution understand how custom agents are defined and invoked.

---

## Recommended Deployment

### Step 1: Create a Knowledge Directory Structure
Create a dedicated knowledge directory in the `.github-private` repository to store additional context files. Organize files by domain or topic to make them easier to maintain and reference.

```text
.github-private/
├── agents/
│   ├── security-reviewer.md
│   ├── architecture-advisor.md
│   └── ci-cd-expert.md
└── knowledge/
    ├── security/
    │   ├── secure-coding-standards.md
    │   ├── authentication-patterns.md
    │   └── vulnerability-remediation.md
    ├── architecture/
    │   ├── microservices-patterns.md
    │   ├── api-design-guidelines.md
    │   └── database-standards.md
    └── ci-cd/
        ├── github-actions-best-practices.md
        ├── deployment-workflows.md
        └── container-security.md
```

Use markdown files (`.md`) for textual content as they are easy to edit, version control, and render in GitHub's UI for team review.

### Step 2: Author Knowledge Files
Create focused knowledge files that contain specific guidance, patterns, or standards. Keep each file focused on a single topic or concern to make them easier to maintain and reuse across multiple custom agents.

Example: `knowledge/ci-cd/github-actions-best-practices.md`

```markdown
# GitHub Actions Best Practices

## Workflow Security
- Always pin actions to full commit SHAs rather than tags or branches
- Use OIDC for authentication instead of storing long-lived credentials
- Apply least-privilege permissions using the `permissions` key
- Enable required workflows for critical security and compliance checks

## Performance Optimization
- Use caching for dependencies (npm, pip, Maven, etc.)
- Run jobs in parallel when possible using the `needs` strategy
- Use self-hosted runners for builds that require specific infrastructure
- Implement conditional job execution with `if` statements

## Maintainability
- Extract reusable logic into composite actions
- Document all workflow inputs and outputs
- Use workflow templates for common patterns
- Version workflow files alongside application code
```

### Step 3: Update Custom Agent Instructions
Modify the custom agent markdown file to include explicit instructions for fetching knowledge files using the GitHub MCP server. The GitHub MCP server is automatically available when Enterprise Custom Agents are enabled and handles authentication using the configured credentials.

Example: `agents/ci-cd-expert.md`

```markdown
# CI/CD Expert Agent

You are a specialized agent that provides guidance on GitHub Actions workflows, deployment strategies, and continuous integration best practices for this organization.

## Critical Startup Procedures

Before providing any recommendations or assistance, you MUST fetch all required knowledge resources from the organization's knowledge base.

### Required Knowledge Resources

Use the GitHub MCP server to fetch the following files from the `.github-private` repository:

**Repository Configuration:**
- Owner: `your-org-name`
- Repository: `.github-private`
- Branch: `main`

**Required Files (fetch all before proceeding):**
1. `knowledge/ci-cd/github-actions-best-practices.md`
2. `knowledge/ci-cd/deployment-workflows.md`
3. `knowledge/ci-cd/container-security.md`
4. `knowledge/security/authentication-patterns.md`

These files contain the organization's approved patterns, standards, and policies that must inform all recommendations you provide.

## Your Role

After loading the knowledge resources, provide specific, actionable guidance on:
- Designing secure and efficient GitHub Actions workflows
- Implementing CI/CD pipelines that follow organizational standards
- Troubleshooting workflow failures and performance issues
- Recommending deployment strategies for different application types

Always reference the specific organizational standards from the knowledge files when making recommendations.
```

> [!NOTE]
> The agent will use the GitHub MCP server's `get_file_contents` tool to fetch these files at runtime. You can verify successful fetching by monitoring the agent panel during execution.

### Step 4: Configure MCP Authentication
The GitHub MCP server requires authentication to access private repositories. By default, it has limited read-only permissions for security. To enable access to the `.github-private` repository, configure a Personal Access Token as an environment secret.

**Generate a Personal Access Token:**
1. Navigate to Settings > Developer settings > Personal access tokens > Tokens (classic)
2. Click Generate new token > Generate new token (classic)
3. Provide a descriptive note (e.g., "Custom agents MCP access")
4. Select the `repo` scope (full control of private repositories)
5. Set an appropriate expiration date based on your organization's security policies
6. Click Generate token and save the token securely

> [!WARNING]
> Use a service account or bot account rather than a personal user account for generating the PAT. This ensures continuity when team members change roles and simplifies audit trails.

**Configure the Repository Environment:**
For each repository where you want custom agents to access expanded context:
1. Navigate to the repository Settings > Environments
2. Create a new environment named `copilot` (if it doesn't exist)
3. Click Add secret under environment secrets
4. Name the secret: `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`
5. Paste the PAT value generated in the previous step
6. Click Add secret

> [!NOTE]
> This configuration must be repeated for each repository where you want to use custom agents with expanded context. Consider automating this setup using GitHub's REST API or CLI for organizations with many repositories.

### Step 5: Verify the Configuration
Test that your custom agent can successfully access the expanded context:
1. Navigate to a repository where you configured the `copilot` environment secret
2. Assign a task to your custom agent using the GitHub Copilot interface
3. Monitor the agent's activity in the agent panel
4. Look for log messages indicating "Get file contents from GitHub" or similar
5. Verify the agent's responses reflect the guidance from your knowledge files

**Troubleshooting Checklist:**
- Verify the environment name is exactly `copilot` (case-sensitive)
- Confirm the secret name is exactly `COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN`
- Check that the PAT has the `repo` scope and hasn't expired
- Ensure the repository owner and name in the agent markdown match your `.github-private` repository

---

## Additional Solution Detail and Trade-Offs to Consider

### Why This Approach Is Recommended
- **Overcomes character limits**: The primary benefit is bypassing the 30,000 character limitation of the agent definition file. Organizations can provide comprehensive guidance across dozens or hundreds of separate knowledge files, each focused on specific domains.
- **Enables dynamic updates**: Knowledge files can be updated independently of agent definitions. When you update a security policy or coding standard in the knowledge base, all agents that reference it immediately use the updated guidance—no need to modify agent markdown files.
- **Maintains version control**: Storing knowledge files in the `.github-private` repository provides full Git version control. Teams can review changes through pull requests, track evolution over time, and revert if needed.
- **Centralizes organizational knowledge**: A single knowledge directory becomes the source of truth for organizational standards, patterns, and policies. Multiple custom agents can reference the same knowledge files, ensuring consistency across different agent specializations.

### Trade-Offs and Considerations
- **Authentication complexity**: Each repository requires individual configuration of the environment secret. For organizations with hundreds or thousands of repositories, this can be a significant administrative burden. Automate using:

```bash
# Example: Automate secret configuration across repositories
for repo in $(gh repo list your-org --json name -q '.[].name'); do
  gh secret set COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN \
    --repo your-org/$repo \
    --env copilot \
    --body "$PAT_VALUE"
done
```

- **Token management overhead**: Personal Access Tokens require rotation based on your security policies. Using short-lived tokens improves security but increases administrative overhead. Plan for token rotation and monitor expiration.
- **Runtime performance**: Fetching knowledge files at the start of each agent invocation adds latency. Mitigate by:
  - Keeping knowledge files focused and reasonably sized (under 10,000 characters per file)
  - Only requiring agents to fetch files directly relevant to their specialization
  - Consolidating very frequently used guidance into the agent's main markdown file
- **Security considerations**: The PAT provides access to private repositories based on the scope granted. Mitigate by:
  - Using fine-grained Personal Access Tokens (PATs) scoped to only the `.github-private` repository with read-only contents permission
  - Falling back to classic PATs with repo scope only if fine-grained tokens are not available in your environment
  - Implementing IP allowlists for your organization
  - Monitoring audit logs for unusual access patterns
  - Using short-lived tokens with automated rotation

---

## Alternative Approaches

### 1. Inline All Guidance in Agent Markdown
For smaller organizations or simpler use cases, keeping all guidance within the 30,000 character limit may be sufficient.
- **Pros**: No additional configuration required; faster agent startup; simpler to maintain.
- **Cons**: Limited to 30,000 characters total; must edit agent file to update any guidance; difficult to share guidance across multiple agents.

### 2. Use External Documentation Systems
Store organizational standards in external wikis, Confluence, or documentation platforms and have agents reference URLs.
- **Pros**: Leverages existing documentation infrastructure; supports rich media and diagrams; maintained by technical writers.
- **Cons**: Agents cannot directly access content from URLs without custom scraping; external systems may be unreachable during agent execution; lacks atomic Git version control.

### 3. Public Documentation in Separate Repository
For non-sensitive guidance, create a public or internal repository with knowledge files.
- **Pros**: No authentication configuration needed for public repos; easy to share across organizations.
- **Cons**: Only suitable for non-sensitive guidance; requires managing another repository; still requires agent instruction updates.

---

## When Not to Use This Approach
- **Small, simple use cases**: If organizational guidance fits comfortably within the 30,000 character limit and changes rarely.
- **Highly dynamic guidance**: If guidance changes multiple times per day (e.g. rotating IP allowlists or dynamic keys), use an API service instead of static markdown files.
- **Cross-organization sharing**: If custom agents must be shared across multiple independent GitHub organizations without shared token trust.

---

## Best Practices for Knowledge Management

### Maintain Clear Ownership
Assign teams or individuals as owners for specific knowledge domains in a central `CODEOWNERS` file:

```text
# Knowledge base owners
knowledge/security/      @your-org/security-team
knowledge/architecture/  @your-org/architecture-review-board
knowledge/ci-cd/         @your-org/devops-team
```

### Use Structured Formats
Within knowledge files, use consistent formatting to make it easier for agents to parse and reference:
- Clear section headings
- Bulleted lists for requirements or checkpoints
- Code blocks for examples
- Tables for comparing options

### Include Metadata in Knowledge Files
Add frontmatter or metadata headers to track freshness:

```markdown
---
Last updated: 2026-01-15
Reviewed by: Architecture Review Board
Next review: 2026-04-15
Version: 2.1
---
```

### Implement Review Workflows
Require pull request reviews and approvals for changes to knowledge files, enforcing branch protection rules.

### Test Agent Behavior After Updates
Test custom agents in a sandbox or test repository after updating knowledge files to ensure they correctly interpret new guidance.

### Monitor Agent Performance
Track how long agents take to fetch files and complete tasks, consolidating overly fragmented files if latency increases.

### Document the Knowledge Structure
Maintain a `README.md` in the knowledge directory explaining the taxonomy, file naming conventions, and contribution flow.
