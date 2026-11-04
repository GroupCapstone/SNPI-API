# Design Topic: Hypermedia (write) (`hypermedia-write`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Hypermedia](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/hypermedia-write](https://apistylebook.com/design/topics/hypermedia-write)

---

## 1. Original Topic Definition

> "How to use hypermedia to write data"

---

## 2. In-Depth Architectural Knowledge Learned

Governs standards for Hypermedia (write) within the domain of Hypermedia. Synthesizes guidance from analyzed guidelines to establish predictable, secure, and developer-friendly REST behavior adhering to How to use hypermedia to write data.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `hypermedia-write` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `hypermedia-write` operations.

### Concrete HTTP Syntax / Representation:
```http
Standard implementation conforming to Hypermedia specifications for Hypermedia (write).
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Hypertext Linking within an Entity"

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Management state with HATEOAS](https://apiguide.readthedocs.io/en/latest/build_and_publish/hateos.html)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Links](https://github.com/cloudfoundry/cc-api-v3-style-guide#links)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Forms](http://restful-api-design.readthedocs.io/en/latest/forms.html)
    > Verbatim Quote: "... without referring to external documentation, an API user does not know what data to provide to operations that take input."

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Follow standard RFC and enterprise guideline conventions for Hypermedia (write); enforce consistency. | Using ad-hoc, proprietary, or non-standard approaches for Hypermedia (write). |
| **Contract Stability** | Version and document `hypermedia-write` formally in `@snp/shared` | Breaking `hypermedia-write` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `hypermedia-write`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Hypermedia (write)` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
