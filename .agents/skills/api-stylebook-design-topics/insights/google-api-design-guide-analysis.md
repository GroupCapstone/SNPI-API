# Editorial Analysis: Google Cloud API Design Guide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Source**: [https://apistylebook.com/blog/google-api-design-guide-added-on-the-api-stylebook](https://apistylebook.com/blog/google-api-design-guide-added-on-the-api-stylebook)
> **Author**: Arnaud Lauret (The API Handyman / API Stylebook)
> **Published**: March 5, 2017
> **Related Guideline**: [`../guidelines/google-api-design-guide.md`](../guidelines/google-api-design-guide.md)

---

## 1. Executive Overview & Scope

Google's API Design Guide establishes principles used across Google Cloud and internal infrastructure since 2014, codified into public API Improvement Proposals (AIPs).

> This guide deals with both REST and RPC API design, with specific focus on gRPC and Protocol Buffers v3 (proto3). It shows how to map protocol buffers cleanly to standard HTTP/REST endpoints.

---

## 2. Core Architectural Lessons Learned

### 2.1. Resource-Oriented Design (ROD) Independent of Protocol
* Emphasizes entities and state models over actions and functions.
* Proves that REST principles apply universally, whether exposed via HTTP JSON, gRPC, or message queues.

### 2.2. Standard Methods vs. Custom Methods
* Standard Methods: `List`, `Get`, `Create`, `Update`, `Delete` (CRUD invariants).
* Custom Methods: Used strictly when actions cannot conform to standard CRUD semantics, modeled with colon syntax: `POST /v1/books/123:cancel` or `POST /v1/publishers/456:search`.

### 2.3. The Documentation Golden Rule
> *"In most cases, there’s more to say than just restating the obvious."*

* Prohibits tautological docstrings (e.g., `// The studentId: The ID of the student`).
* Requires documenting lifecycle state transitions, boundary limits, concurrency behavior, and error triggers.

### 2.4. Rigorous Breaking vs. Non-Breaking Taxonomy
Google provides the industry standard classification for backward compatibility:
* **Non-breaking (Additive)**: Adding a new resource, adding an optional field to request, adding any field to response.
* **Breaking (Incompatible)**: Renaming a field, removing a field, changing field types, changing HTTP status codes, adding required request fields.