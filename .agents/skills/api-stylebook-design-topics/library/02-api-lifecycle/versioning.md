# Design Topic: Updates and Versioning (`versioning`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [API Lifecycle](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/versioning](https://apistylebook.com/design/topics/versioning)

---

## 1. Original Topic Definition

> "How to handle API updates and versioning"

---

## 2. Architectural Principles Learned

This design topic governs **Updates and Versioning** within the domain of **API Lifecycle**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `versioning` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `versioning` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `versioning` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 13 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Changes and Versioning](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html)
  * **Section**: [Rules For Extending](https://adidas-group.gitbooks.io/api-guidelines/content/core-principles/rules-for-extending.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Version Control for APIs](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-VersionControlforAPIs)

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Compatibility policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Compatibilitypolicy)
  * **Section**: [Backwards compatibility](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Backwardscompatibility)
  * **Section**: [Structured representations (application/json)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Structuredrepresentations(application/json))
  * **Section**: [API versioning](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-APIversioning)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Versioning](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#versioning)
  * **Section**: [Use versions](https://apiguide.readthedocs.io/en/latest/build_and_publish/versioning.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.13 Versioning](https://github.com/CiscoDevNet/api-design-guide#313-versioning)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Content type negotiation](http://deliveroo.engineering/guidelines/api-design/#content-type-negotiation)
    > Verbatim Quote: "The Accept header may include the v parameter to specify the API version requested; see “Versioning” below."
  * **Section**: [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning)
  * **Section**: [Public-friendly APIs](http://deliveroo.engineering/guidelines/api-design/#public-friendly-apis)
    > Verbatim Quote: "a new (breaking/major) version of a set of public-facing APIS should be an entirely new domain (e.g. v2.my-api.example.com), with entirely segregated infrastructure."

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [List Pagination](https://cloud.google.com/apis/design/design_patterns#list_pagination)
    > Verbatim Quote: "Even though adding pagination support to an existing API is purely additive from API surface perspective, it is a behavior-breaking change"
  * **Section**: [Versioning](https://cloud.google.com/apis/design/versioning)
  * **Section**: [Compatibility](https://cloud.google.com/apis/design/compatibility)
    > Verbatim Quote: "This page provides more detailed explanations for the list of breaking and non-breaking changes given in the Versioning section."
  * **Section**: [Backwards-compatible (non-breaking) changes](https://cloud.google.com/apis/design/compatibility#backwards-compatible_non-breaking_changes)
  * **Section**: [Backwards-incompatible (breaking) changes](https://cloud.google.com/apis/design/compatibility#backwards-incompatible_breaking_changes)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Version](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md#version)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Require Versioning in the Accepts Header](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html)
  * **Section**: [Describe stability](https://geemus.gitbooks.io/http-api-design/content/en/artifacts/describe-stability.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Guidelines for existing services and versioning of services](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#42-guidelines-for-existing-services-and-versioning-of-services)
  * **Section**: [Versioning](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#12-versioning)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [Version](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#version)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)
  * **Section**: [Versions](https://github.com/WhiteHouse/api-standards/blob/master/README.md#versions)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Compatibility](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html)
  * **Section**: [Don’t Break Backward Compatibility](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-dont-break-backward-compatibility)
  * **Section**: [Avoid Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#should-avoid-versioning)
  * **Section**: [Use Media Type Versioning](http://zalando.github.io/restful-api-guidelines/compatibility/Compatibility.html#must-use-media-type-versioning)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `versioning` formally | Changing `versioning` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `versioning`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Updates and Versioning` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
