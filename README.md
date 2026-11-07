# SNPI-API

SNPI-API is the backend REST API for the SNPI School Management System, built with Express, TypeScript, and MongoDB. It holds the system's data and business logic — students, academics, attendance, assessment, and finance — and serves them securely to the SNPI web portal and other clients.

## How the AI Agent Works on This Project

```mermaid
flowchart TD
    A[User gives a task] --> B[AI agent reads and understands the request]
    B --> C[Agent studies the API project files]
    C --> D[Agent makes a step-by-step work plan]
    D --> E[Agent does the work on the API code]
    E --> F[Agent runs checks: typecheck, lint, and tests]
    F -->|Problem found| E
    F -->|All checks pass| G[Agent reports the finished result to the user]
```
