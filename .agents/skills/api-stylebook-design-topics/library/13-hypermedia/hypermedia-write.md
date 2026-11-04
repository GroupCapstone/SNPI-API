# Design Topic: Hypermedia (write) (`hypermedia-write`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Hypermedia](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/hypermedia-write](https://apistylebook.com/design/topics/hypermedia-write)

---

## 1. Original Topic Definition

> "How to use hypermedia to write data"

---

## 2. Architectural Principles Learned

This design topic governs **Hypermedia (write)** within the domain of **Hypermedia**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `hypermedia-write` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `hypermedia-write` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `hypermedia-write` prevents unneeded compute overhead, database contention, and network payloads.

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
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `hypermedia-write` formally | Changing `hypermedia-write` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `hypermedia-write`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Hypermedia (write)` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
