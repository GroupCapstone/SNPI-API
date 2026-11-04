# Editorial Analysis: Deliveroo API Design Styleguide

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Source**: [https://apistylebook.com/blog/deliveroo-api-design-styleguide-added-on-the-api-stylebook](https://apistylebook.com/blog/deliveroo-api-design-styleguide-added-on-the-api-stylebook)
> **Author**: Arnaud Lauret (The API Handyman / API Stylebook)
> **Published**: April 23, 2017
> **Related Guideline**: [`../guidelines/deliveroo-api-design-guidelines.md`](../guidelines/deliveroo-api-design-guidelines.md)

---

## 1. Executive Overview & Rating

Arnaud Lauret categorizes the **Deliveroo API Design Guide** as an absolute **"MUST read for any API designer"**.

> Deliveroo is a British online food delivery company operating high-throughput logistics across restaurants, couriers, and customers. Their guidelines offer pragmatic, production-tested solutions for high-traffic real-time systems.

---

## 2. Core Architectural Pillars Learned

### 2.1. The Three-Word Shortcut
> **"RESTful, Hypermedia, Fine-grained"**

* **RESTful**: Pure resource orientation adhering strictly to HTTP verb semantics.
* **Hypermedia**: Dynamic discovery of actionable state transitions, eliminating hardcoded client URL builders.
* **Fine-grained**: Granular, bounded resources rather than monolithic kitchen-sink payloads.

### 2.2. Duality of Internal vs. External APIs
Deliveroo explicitly separates the engineering trade-offs of internal service-to-service APIs versus external partner/public APIs:

| API Type | Versioning Strategy | Infrastructure Topology | Primary Objective |
| :--- | :--- | :--- | :--- |
| **Internal APIs** | Header parameter (`Accept: application/json; v=2`) | Shared microservice mesh | Rapid iteration, tight coupling between trusted teams |
| **External / Public** | Subdomain segregation (`v2.api.deliveroo.com`) | Completely isolated infrastructure | Zero noisy-neighbor blast radius, immutable contracts |

### 2.3. Domain-Driven Design (DDD) Resource Modeling
* Models resources directly from business aggregate roots, not database tables.
* Establishes clear entity ownership and bounded contexts.
* Prevents leaky internal persistence abstractions from polluting public APIs.

### 2.4. Hypermedia Without the Buzzword Bloat
* Lauret applauds Deliveroo's approach: *"(please, just stop using this ugly HATEOAS acronym!)"*.
* **The Invariant**: Consumers must never concatenate or construct URL paths. Instead, they navigate via links dynamically discovered in API responses.

### 2.5. Human-Centered Error Handling
> *"The results are not just intended to be acted on by machines, but rather presented to users."*

* Standardizes error payloads to provide clear, actionable descriptions ready for direct display in mobile and web UIs.
* Eliminates the need for client apps to maintain massive translation lookup dictionaries for every error code.

### 2.6. Caching Efficiency as a First-Class Architectural Requirement
> *"Caching efficiency is a critical aim of well-designed APIs, as it is influential on service performance; cache consistency is as important."*

* Enforces ETags and strict `Cache-Control` max-age directives on read-heavy routes.
* Balances high-throughput read scalability with strict cache consistency.

### 2.7. The Two Golden Rules of API Documentation
> 1. *"API users are both developers and machines."*  
> 2. *"Discuss APIs before starting any implementation."*

* Mandates design-first discussions before a single line of backend controller code is written.

---

## 3. Editorial Critique & Contradiction Noted

* **PATCH HTTP Status Contradiction**: In their original guideline, Deliveroo stated in one section that `PATCH` *MUST* return `200 OK`, while in another section stating it *MUST NOT* return `200 OK` (requiring `204 No Content`).
* **API Stylebook Feedback**: Arnaud Lauret logged an official GitHub issue on `deliveroo/deliveroo.engineering#135` to resolve the ambiguity in favor of returning `200 OK` with the modified representation.

---

## 4. Standby Monorepo Mapping (Express 5 & TypeScript)

When commanded to apply Deliveroo's architectural lessons to SNP-SMS:
- [ ] Adopt the *"RESTful, Hypermedia, Fine-grained"* philosophy for student and billing routes.
- [ ] Separate internal API middleware contracts from public webhook/syndication endpoints.
- [ ] Embed self-describing action links (`links: { cancel: "...", pay: "..." }`) in status payloads.
- [ ] Ensure error messages in RFC 7807 responses are clear enough for immediate frontend toast/banner display.
- [ ] Enforce ETag validation on read-heavy catalog endpoints (`/classes`, `/curriculums`).