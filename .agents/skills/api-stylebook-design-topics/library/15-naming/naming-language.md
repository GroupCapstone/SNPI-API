# Design Topic: Language (`naming-language`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Naming](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/naming-language](https://apistylebook.com/design/topics/naming-language)

---

## 1. Original Topic Definition

> "Which language(s) use when designing an API"

---

## 2. Architectural Principles Learned

This design topic governs **Language** within the domain of **Naming**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `naming-language` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `naming-language` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `naming-language` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 2 organization guidelines explicitly specify standards for this topic:

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Collection ID](https://cloud.google.com/apis/design/resource_names#collection_id)
    > Verbatim Quote: "Must use clear and concise English terms."
  * **Section**: [Naming Conventions](https://cloud.google.com/apis/design/naming_convention)
    > Verbatim Quote: "Names used in APIs should be in correct American English."

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Write APIs in U.S. English](http://zalando.github.io/restful-api-guidelines/general-guidelines/GeneralGuidelines.html#must-write-apis-in-us-english)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `naming-language` formally | Changing `naming-language` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `naming-language`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Language` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
