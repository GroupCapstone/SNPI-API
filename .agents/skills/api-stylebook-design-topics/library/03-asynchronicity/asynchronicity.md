# Design Topic: Asynchronicity (`asynchronicity`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Asynchronicity](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/asynchronicity](https://apistylebook.com/design/topics/asynchronicity)

---

## 1. Original Topic Definition

> "How to handle long operations"

---

## 2. Architectural Principles Learned

This design topic governs **Asynchronicity** within the domain of **Asynchronicity**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `asynchronicity` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `asynchronicity` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `asynchronicity` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Asynchronous Tasks](https://adidas-group.gitbooks.io/api-guidelines/content/execution/asynchronous-tasks.html)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [Asynchronicity](https://github.com/cloudfoundry/cc-api-v3-style-guide#asynchronicity)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Delete](https://cloud.google.com/apis/design/standard_methods#delete)
    > Verbatim Quote: "If the Delete method initiates a long-running operation, it should return the long-running operation."
  * **Section**: [Common Custom Methods](https://cloud.google.com/apis/design/custom_methods#common_custom_methods)
    > Verbatim Quote: "Cancel an outstanding operation (build, computation etc.)"
  * **Section**: [Long Running Operation](https://cloud.google.com/apis/design/design_patterns#long_running_operations)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker)
  * **Section**: [Non blocking profile](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccanti)
    > Verbatim Quote: "In the following chapter the non-blocking interaction profiles will be shown, in which a user submits a request and this is only taken in charge immediately, while its satisfaction can take place in a deferred manner."
  * **Section**: [Non-blocking RPC PUSH profiles (callback based)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccante-rpc-push-basato-su-callback)
    > Verbatim Quote: "This particular case, called RPC PUSH, can be used if the user in turn has the possibility to expose a service interface for receiving replies."
  * **Section**: [Non-blocking profile RPC PULL (busy waiting)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profilo-non-bloccante-rpc-pull-busy-waiting)
    > Verbatim Quote: "the provider provides a searchable address to verify the processing status of a request"

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Long running API faults](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#55-long-running-api-faults)
  * **Section**: [Long running operations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#13-long-running-operations)
  * **Section**: [Operations resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1324-operations-resource)
  * **Section**: [Operation resource](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1325----operation-resource)
  * **Section**: [Operation tombstones](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1326-operation-tombstones)
  * **Section**: [The typical flow, polling](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1327-the-typical-flow-polling)
  * **Section**: [The typical flow, push notifications](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1328-the-typical-flow-push-notifications)
  * **Section**: [Retry-After](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#1329-retry-after)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Asynchronous Requests](http://restful-api-design.readthedocs.io/en/latest/methods.html#asynchronous-requests)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Events](http://zalando.github.io/restful-api-guidelines/events/events.html)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `asynchronicity` formally | Changing `asynchronicity` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `asynchronicity`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Asynchronicity` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
