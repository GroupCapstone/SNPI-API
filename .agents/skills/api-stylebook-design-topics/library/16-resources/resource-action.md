# Design Topic: Action resource (`resource-action`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-action](https://apistylebook.com/design/topics/resource-action)

---

## 1. Original Topic Definition

> "How to use action resource (e.g. resources like /cancel or /approve)"

---

## 2. Architectural Principles Learned

This design topic governs **Action resource** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-action` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-action` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-action` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 8 organization guidelines explicitly specify standards for this topic:

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.8 Action Resources](https://github.com/CiscoDevNet/api-design-guide#38-action-resources)
  * **Section**: [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [PUT](https://github.com/cloudfoundry/cc-api-v3-style-guide#put)
  * **Section**: [Actions](https://github.com/cloudfoundry/cc-api-v3-style-guide#actions)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Custom Methods](https://cloud.google.com/apis/design/custom_methods)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Actions](https://geemus.gitbooks.io/http-api-design/content/en/requests/actions.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Operations resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource)
  * **Section**: [Operation resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource)
  * **Section**: [Operation tombstones](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones)
  * **Section**: [The typical flow, polling](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling)
  * **Section**: [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications)
  * **Section**: [Retry-After](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Complex Operation](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#complex-operation)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Actions](http://restful-api-design.readthedocs.io/en/latest/methods.html#actions)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Avoid Actions — Think About Resources](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#must-avoid-actions-—-think-about-resources)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-action` formally | Changing `resource-action` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-action`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Action resource` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
