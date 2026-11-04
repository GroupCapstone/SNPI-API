# GitHub Repositories Threat Model

> **Author**: [Preston Martin](https://github.com/pmartindev)  
> **Published**: May 29, 2024 | **Updated**: October 2, 2026  
> **Source**: [GitHub Well-Architected Framework - Application Security](https://learn.github.com/well-architected/application-security/recommendations/threat-model)

---

## Scenario overview

Source code repositories are a prime target by threat actors to ultimately compromise an application or system. This threat model aims to identify and mitigate the risks associated with GitHub repositories.

The threat model is tightly scoped to the Source Integrity section of Supply Chain Security as illustrated in the left side of the diagram below. The scope informs both the threat actors and the threats themselves. The threat actors may contain threats within themselves which highlights the various ways a threat actor could gain access to a GitHub repository.

Figure attribution: This diagram is derived from the [SLSA Supply Chain Threats model](https://slsa.dev/spec/v1.0/threats), version 1.0, from the [SLSA Framework](https://github.com/slsa-framework/slsa). Licensed under [Community Specification License 1.0](https://github.com/slsa-framework/slsa/blob/main/LICENSE.md).

---

## System analysis

GitHub has the role of a multifaceted platform acting not only as the sole source code repository but as something that encompasses version control, project management, CI, issue and bug tracking, automation, etc.

There are a number of ways both humans and machines authenticate and interact with GitHub:
- GitHub Account
- Okta Session
- Personal Access Tokens and SSH keys
- Enterprise Apps
- 3rd Party Apps
- Non-MFA Service Accounts

There are a number of these authentication mechanisms that reside outside of a company's trust boundary. There is an extension of the trust boundary which is identified by having limited control mechanisms in place. For example, once an access token has been created and granted access, there is no control over the token from the customer's organization.

There are a number of public repositories which require extra controls compared to the private repositories where anyone on the Internet can access them where it's possible to submit a change to the code. There are a number of "types" of repositories:
- Repos that contain code that is shipped to a customer or pushed internally
- Repos that are essential to the supply chain where they're responsible for backporting or maintaining services
- Repos that are not officially supported by the customer but are free for a customer or the community to download and run
- Repos that are not products or offerings - anything else etc.

Beyond authentication there are a number of roles within a GitHub repository, there is the concept of GitHub teams which can be assigned a role, and there are outside contributors.

---

## Methodology

The threat modeling follows the GitHub Threat Modelling Framework where at a high level the following questions are addressed:
1. What are we working on?
2. What can go wrong?
3. What are we going to do about it?
4. Did we do a good enough job?

The process starts with system decomposition where it is broken into components which involves producing a diagram. Then identifying assets, trust boundaries, threat actors, and existing controls that are in place. Threat enumeration is next, analyzing each threat and producing suggested mitigations against those threats.

---

## Threat actors

| ID | Description |
| :--- | :--- |
| **TA-01** | A threat actor with Internet access |
| **TA-02** | A threat actor who has a GitHub Account |
| **TA-03** | A threat actor who is an [outside collaborator](https://docs.github.com/en/organizations/managing-user-access-to-your-organizations-repositories/managing-outside-collaborators) |
| **TA-04** | A threat actor who has gained access to an employee's GitHub credentials |
| **TA-05** | A threat actor who has gained access to an employee's Okta session |
| **TA-06** | A threat actor who has gained access to a GitHub token (inc. SSH keys, PAT, etc.) which is authenticated against a customer org |
| **TA-07** | A threat actor who has compromised a third-party GitHub application |
| **TA-08** | A threat actor who has exploited a misconfigured or vulnerable GitHub Enterprise application |
| **TA-09** | A threat actor who is an insider e.g. a user who makes a mistake, a disgruntled employee, or contractor |

---

## Threats

| ID | Description |
| :--- | :--- |
| **T-01** | A threat actor searches public repositories with the goal of finding valid secrets e.g. password, access token, API key, etc. |
| **T-02** | A private repository is accessed by an unauthorized threat actor |
| **T-03** | A threat actor can change settings in the "Danger Zone", unintentionally or maliciously |
| **T-04** | A threat actor modifies or deletes an important branch's commit history, unintentionally or maliciously |
| **T-05** | A threat actor submits an unauthorized change |
| **T-06** | A threat actor approves and merges their own pull request (PR) to an important branch |
| **T-07** | A threat actor compromises a customer's GitHub repository |
| **T-08** | A threat actor exploits a misconfigured GitHub Workflow or Action |

---

## Threat analysis and recommendations

Access controls restrict who can access the repository and what actions they can perform. This minimizes the attack surface and limits the potential for unauthorized changes.

Branch protection ensures that certain branches, especially critical ones like the main production branch, have strict controls in place. This helps prevent hasty or unauthorized merges.

Authentication measures, especially MFA and strong password policies, protect user accounts and make it more challenging for unauthorized actors to gain access in the first place.

Secret Scanning can help proactively identify exposed secrets in the repository, reducing the risk of unauthorized access.

Enabling automated Secret Scanning Push Protection mechanisms can prevent secrets from being committed to the repository; blocking before they are exposed.

---

### T-01: A threat actor searches public repositories with the goal of finding valid secrets e.g. password, access token, API key, etc.

The goal of the threat actor is usually to gain unauthorized access to systems, exfiltrate data, or misuse credentials for malicious purposes.

#### Analysis
- **Impact**:
  - Threat actors could gain unauthorized access to customer accounts, systems, or resources.
  - Unauthorized access could lead to data breaches, further malicious activity within customer systems, financial losses, and damage to a customer's reputation.
- **Targets**:
  - Secrets like API keys, access tokens, and credentials stored within code.
  - Configuration files, hard-coded values and documentation may inadvertently contain secrets.
- **Attack Vectors**:
  - Automated scanning tools and scripts to search for secrets within code and the commit history.
  - These secrets may be exposed due to oversight from the person committing a change or an inadvertent inclusion in code.

#### Mitigations
- **Education and Awareness**:
  - Educate contributors about the importance of not including secrets in code and how to safely store and share secrets.
  - Ensure teams are aware of the robust secret management systems available to them, e.g. HashiCorp Vault, GitHub Action Secrets.
- **Security Scanning**:
  - Deploy automated scanning tools to proactively search for and detect exposed secrets.
  - If exposed secrets are identified, have a response plan in place where the secrets are immediately rotated.
- **Secret Policy**:
  - Establish and enforce clear security policies and guidelines for secret management and access controls.
  - These guidelines should include an overall secret management lifecycle, from creation to utilization to rotation and revocation.
- **Code Reviews**:
  - Include checks for secrets and sensitive information during code reviews to catch inadvertent commits / exposure.
  - Anything found within a code review should be revoked and rotated.

---

### T-02: A private repository is accessed by an unauthorized threat actor

This change can expose closed source code, and data to a threat actor who could publicly expose it or expose it to a limited number of threat actors e.g. sell it.

#### Analysis
- **Impact**:
  - Could expose sensitive proprietary information, proprietary algorithms, internal tools, and/or confidential data. This could trigger severe financial, legal, and reputational consequences for the customer.
- **Targets**:
  - The customer's GitHub organizations that contain private GitHub repositories.
  - The customer's users' sessions or credentials.
  - Tokens that have access to the customer's GitHub organizations.
  - Access to another system that would lead to gaining access to GitHub e.g. Vault.
- **Attack Vectors**:
  - Social engineering, tools to steal sessions, secret scanning tools run against source code repositories, unintentional leaks through video walkthroughs or documentation, leaked dumps of databases and other systems on the black market and generally exposed secrets.
  - An employee unintentionally making a repository public without understanding the consequences.

#### Mitigations
- **Access Controls and Permissions**:
  - Only authorized personnel should have the ability to modify visibility settings where strong access controls and permissions are set for all repositories.
  - Role-based access controls should be in place following the principle of least privilege. Limit the number of individuals who can modify settings to reduce the likelihood of unauthorized or unintentional changes.
- **MFA & Fine-grained tokens**:
  - Require MFA for all access to repositories.
  - In the case of bots and programmatically adjusting settings, the use of fine-grained access tokens should be favored. For the majority of these cases they should not have access to adjust the visibility settings so if a token was exposed it can be revoked by the customer and the scope of the functionality it can perform is reduced.
- **Monitor and Audit Settings**:
  - Monitor for changes and ensure alerts are in place for any changes to visibility settings.
  - Have regular auditing in place against repository settings to ensure that the visibility of the repository has not changed.
- **Incident Response Plan**:
  - Ensure teams are aware of the ways they can report a security incident.
- **Education and Training**:
  - Ensure employees are educated in the many forms of social engineering.
  - How to manage secrets.
  - Modern attack vectors e.g. [Evilginx](https://help.evilginx.com/docs/intro).

---

### T-03: A threat actor can change settings in the "Danger Zone", unintentionally or maliciously

These actions include:
- Change repository visibility
- Disable branch protection rules
- Transfer ownership
- Archive this repository
- Delete this repository

#### Analysis
- **Impact**:
  - **Change Repository Visibility**: Could expose sensitive proprietary information, proprietary algorithms, internal tools, and/or confidential data. Changing from public to private could limit community collaboration.
  - **Disable Branch Protection Rules**: Could allow unauthorized changes to important branches, compromising data integrity and code quality.
  - **Transfer Ownership**: Could result in the repository being controlled by an unauthorized entity, potentially exposing sensitive proprietary information.
  - **Archive the Repository**: This would make the repository read-only and could disrupt development and usage.
  - **Delete the Repository**: Data loss of code, version history, documentation. Data can be recovered up to [90 days](https://docs.github.com/en/repositories/creating-and-managing-repositories/restoring-a-deleted-repository), but creates severe disruption.
- **Targets**:
  - Users' sessions or credentials.
  - Tokens that have access to the customer's GitHub organizations.
  - Access to another system that would lead to gaining access to GitHub e.g. Vault.
- **Attack Vectors**:
  - Social engineering, session stealing tools, leaked secrets, unintentional changes by employees or machine users.

#### Mitigations
- **Define a Policy**: Have a GitHub Security Best Practice Policy; ensure every repository adheres.
- **Access Controls and Permissions**: Only authorized personnel can modify settings; restrict via least privilege; enforce human confirmation (block automated danger zone modifications).
- **MFA & Fine-grained tokens**: Require MFA; use scoped fine-grained tokens without danger zone permissions.
- **Monitor and Audit Settings**: Real-time alerts for visibility or setting changes; regular automated audits.
- **Incident Response Plan & Training**: Incident reporting paths and security education covering social engineering and Evilginx.

---

### T-04: A threat actor modifies or deletes an important branch's commit history, unintentionally or maliciously

#### Analysis
- **Impact**: Failure of data integrity, disruption of software development, downtime, SLA breaches on production systems.
- **Targets**: Important branches across public and private repositories; release pipelines.
- **Attack Vectors**: Social engineering, session theft, unintentional force pushes (`git push --force`), repository misconfiguration.

#### Mitigations
- **Branch Protection & Rulesets**:
  - Block force pushes (`allow_force_pushes: false`).
  - Block branch deletions (`allow_deletions: false`).
  - Enforce linear history.
- **Access Controls**: Restrict administrative and maintain privileges; require human confirmation.
- **MFA & Auditing**: Mandatory MFA, session auditing, and configuration monitoring.

---

### T-05: A threat actor submits an unauthorized change to an important branch

#### Analysis
- **Impact**: Data integrity failure, unauthorized logic execution, production downtime, regulatory breaches.
- **Targets**: Production branches (`main`, `release/*`), build pipelines, cloud serverless environments.
- **Attack Vectors**: Direct pushes without review, stolen credentials, misconfigured branch protection rules.

#### Mitigations
- **Role-Based Access Control (RBAC)**: Least privilege; only authorized engineers have write access; outside collaborators should never be added.
- **Branch Protection Rules**:
  - Require pull requests before merging (prevent direct push).
  - Require code reviews before merging (minimum 1, ideally 2 reviewers).
  - Dismiss stale pull request approvals when new commits are pushed.
  - Require review from Code Owners (`CODEOWNERS`).
  - Require approval of the most recent reviewable push.
  - Prevent force pushes and deletions.
- **Authentication**: Mandatory MFA; use trust-boundary authentication mechanisms (GitHub Apps rather than non-MFA service accounts).

---

### T-06: A threat actor approves and merges their own pull request (PR) to an important branch

#### Analysis
- **Impact**: Bypasses four-eyes principle, introduces malicious or unreviewed vulnerabilities directly into production.
- **Targets**: Protected production branches.
- **Attack Vectors**: Compromised single account with write permissions, self-approval in repositories without anti-self-merge rules.

#### Mitigations
- **Branch Protection & Ruleset Enforcement**:
  - Prohibit PR author from approving their own PR.
  - Require minimum 1-2 independent peer approvals.
  - Dismiss stale approvals on push.
  - Require Code Owners review.
  - Require cryptographic commit signatures (GPG/SSH).
  - Prevent force pushes and deletions.
- **Service Accounts**: Transition from non-MFA machine accounts to scoped GitHub Apps.

---

### T-07: A threat actor compromises a customer's GitHub repository

#### Analysis
- **Impact**: Exposure of IP, algorithms, customer data; loss of data integrity; supply chain compromise.
- **Targets**: Customer repositories, release workflows, cloud deployment secrets.
- **Attack Vectors**: Credential theft, OAuth app exploitation, repository misconfiguration.

#### Mitigations
- **Enterprise Best Practice Policy**: Standardized baseline security across all repositories.
- **Access Controls & Fine-Grained Tokens**: Least privilege, strict admin scoping, short-lived tokens.
- **MFA & Session Monitoring**: Enforced 2FA across all organization members; audit log streaming.
- **Incident Response**: Immediate reporting runbooks and credential rotation protocols.

---

### T-08: A threat actor exploits a misconfigured GitHub Workflow or Action

#### Analysis
- **Impact**: Script injection, exfiltration of `GITHUB_TOKEN` and release secrets, repo modification via GitHub API, cross-repository compromise.
- **Targets**: Public/private repositories running GitHub Actions workflows, workflow execution contexts.
- **Attack Vectors**: Untrusted user input in inline `run:` scripts, race conditions, malicious third-party actions.

#### Mitigations
- **Prevent Script Injection**: Never interpolate untrusted contexts (`${{ github.event... }}`) directly into inline shell scripts; map inputs to intermediate environment variables.
- **Properly Scope Access**: Set minimal default permissions (`permissions: contents: read`) at workflow level.
- **Secrets Management**: Secure vault or repository secrets; prevent echo/leakage; enforce secret rotation.
- **Control Changes**: Require Code Owners and PR reviews for changes to `.github/workflows/`.
- **Action Pinning & SAST**: Pin actions to immutable 40-character commit SHAs; run SAST tools against workflow definitions.
- **Race Condition Defenses**: Use `pull_request_review` associated with a specific Git SHA when triggering workflows on comments.
