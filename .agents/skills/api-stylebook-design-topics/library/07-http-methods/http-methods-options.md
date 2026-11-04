# Design Topic: OPTIONS (`http-methods-options`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Methods](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-methods-options](https://apistylebook.com/design/topics/http-methods-options)

---

## 1. Original Topic Definition

> "The OPTIONS method returns the HTTP methods that the server supports for the specified URL. This can be used to check the functionality of a web server by requesting '*' instead of a specific resource.
"

---

## 2. Architectural Principles Learned

This design topic governs **OPTIONS** within the domain of **HTTP Methods**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-methods-options` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-methods-options` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-methods-options` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.6.7 OPTIONS](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Supported Methods](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#74-supported-methods)
  * **Section**: [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Methods](http://restful-api-design.readthedocs.io/en/latest/methods.html)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [OPTIONS](http://zalando.github.io/restful-api-guidelines/http/Http.html#options)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-methods-options` formally | Changing `http-methods-options` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-methods-options`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `OPTIONS` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
