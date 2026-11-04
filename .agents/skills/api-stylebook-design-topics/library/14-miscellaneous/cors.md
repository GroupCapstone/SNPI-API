# Design Topic: CORS (`cors`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Miscellaneous](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/cors](https://apistylebook.com/design/topics/cors)

---

## 1. Original Topic Definition

> "How to deal with CORS"

---

## 2. Architectural Principles Learned

This design topic governs **CORS** within the domain of **Miscellaneous**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `cors` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `cors` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `cors` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 4 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Support cross-domain mashups with CORS](https://apiguide.readthedocs.io/en/latest/build_and_publish/cors.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [CORS](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#8-cors)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [JSONP](https://github.com/WhiteHouse/api-standards/blob/master/README.md#jsonp)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `cors` formally | Changing `cors` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `cors`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `CORS` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
