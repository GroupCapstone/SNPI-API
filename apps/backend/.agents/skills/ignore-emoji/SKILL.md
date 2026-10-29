---
name: ignore-emoji
description: >-
  Enforces a clean, professional, and emoji-free style across all responses,
  documentation, code comments, commit messages, and summaries.
  Activate this skill to suppress and ignore all emojis in output.
---

# Ignore Emoji Guidelines

This skill enforces strict omission of emojis in all forms of communication and code generation.

---

## Core Rules

1. **No Emojis in Text Responses**:
   - Do not include emojis in headings, bullet points, greetings, callouts, or summaries.
   - Use standard plain-text formatting, clear headers (e.g. `### Section Name`), bolding, or standard ASCII symbols (such as `[x]`, `[-]`, `->`, `*`) where necessary.

2. **No Emojis in Code & Comments**:
   - Do not include emojis in source code, inline comments, docstrings, or log statements.
   - Ensure clean, professional code formatting throughout the repository.

3. **No Emojis in Commit Messages & PR Descriptions**:
   - Follow standard Conventional Commits formatting (e.g. `feat:`, `fix:`, `refactor:`, `test:`, `chore:`) without gitmoji or decorative icons.

4. **Formatting Replacements**:
   - Instead of checkmark emojis, use `[PASSED]`, `[COMPLETED]`, or `[x]`.
   - Instead of cross/warning emojis, use `[FAILED]`, `[WARNING]`, or `[!]`.
   - Instead of tool/rocket/gear icons, use clean textual prefixes such as `### Status:`, `### Summary:`, `### Analysis:`.
