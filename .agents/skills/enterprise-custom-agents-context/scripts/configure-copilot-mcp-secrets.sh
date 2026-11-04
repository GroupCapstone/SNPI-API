#!/usr/bin/env bash
# ==============================================================================
# Script: configure-copilot-mcp-secrets.sh
# Purpose: Automate Copilot environment & MCP GitHub PAT secret provisioning
# Reference: .agents/skills/enterprise-custom-agents-context/SKILL.md
# ==============================================================================

set -euo pipefail

ORG="${1:-Tan-Saphea}"
PAT_TOKEN="${COPILOT_PAT_TOKEN:-}"

if [[ -z "${PAT_TOKEN}" ]]; then
  echo "Error: COPILOT_PAT_TOKEN environment variable is required."
  echo "Usage: COPILOT_PAT_TOKEN=<token> ./configure-copilot-mcp-secrets.sh [org-name]"
  exit 1
fi

echo "======================================================"
echo "Enterprise Custom Agents MCP Secret Provisioning"
echo "Target Organization: ${ORG}"
echo "======================================================"

REPOS=$(gh repo list "${ORG}" --limit 300 --json name -q '.[].name')

for REPO in ${REPOS}; do
  echo "Configuring repository: ${ORG}/${REPO}..."
  
  # Ensure copilot environment exists
  gh api --method PUT -H "Accept: application/vnd.github+json" \
    "/repos/${ORG}/${REPO}/environments/copilot" > /dev/null 2>&1 || true
    
  # Set the environment secret
  echo "${PAT_TOKEN}" | gh secret set COPILOT_MCP_GITHUB_PERSONAL_ACCESS_TOKEN \
    --repo "${ORG}/${REPO}" \
    --env copilot
    
  echo "[PASS] ${ORG}/${REPO} copilot environment secret configured."
done

echo "======================================================"
echo "[COMPLETED] All repositories configured for GitHub MCP access."
echo "======================================================"
