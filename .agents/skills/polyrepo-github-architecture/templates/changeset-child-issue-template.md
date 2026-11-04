---
name: Component Task for Change Set
about: Child task issue in component repository linked to a parent change set
title: "[CHG-XXXX]: <Component task summary>"
labels: ["changeset-task"]
---

## Parent Change Set Reference

* **Parent Tracking Issue**: org/integration-repo#<issue_number>
* **Change Set ID**: `CHG-XXXX`
* **Assigned Engineer**: @<username>

---

## Required Local Changes

<!-- Detail exact component updates required for this repository -->

---

## Branching & PR Guidelines

* **Branch Name**: `changeset/CHG-XXXX/<short-slug>`
* **PR Title**: `[CHG-XXXX] <type>(<scope>): <description>`
* **PR Body**: Must reference `Closes org/integration-repo#<issue_number>` and state merge dependency order.

---

## Component Definition of Done

- [ ] Unit & domain tests passing locally
- [ ] No regression on existing REST / contract APIs
- [ ] PR passes repo-level reusable CI workflow
- [ ] PR commit SHA submitted to integration manifest for composite validation
