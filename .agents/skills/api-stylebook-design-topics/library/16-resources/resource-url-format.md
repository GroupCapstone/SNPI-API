# Design Topic: URL format (`resource-url-format`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Resources](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/resource-url-format](https://apistylebook.com/design/topics/resource-url-format)

---

## 1. Original Topic Definition

> "How to design URLs"

---

## 2. Architectural Principles Learned

This design topic governs **URL format** within the domain of **Resources**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `resource-url-format` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `resource-url-format` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `resource-url-format` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 15 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [URI structure](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/uri-structure.html)
  * **Section**: [Changes and Versioning](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/versioning.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "URI Structure"

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Stable URIs](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-StableURIs)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [URL Depth](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#url-depth)
  * **Section**: [Good RESTful URL examples](https://apiguide.readthedocs.io/en/latest/build_and_publish/use_RESTful_urls.html#good-restful-url-examples)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.4 URL Format](https://github.com/CiscoDevNet/api-design-guide#34-url-format)
  * **Section**: [URL Paths](https://github.com/CiscoDevNet/api-design-guide/blob/master/principles.md#url-paths)

### Cloud Foundry - Cloud Controller API v3 Style Guide (Proposal)
* **Guideline URL**: [https://github.com/cloudfoundry/cc-api-v3-style-guide](https://github.com/cloudfoundry/cc-api-v3-style-guide)
* **Citations & References**:
  * **Section**: [URL Structure](https://github.com/cloudfoundry/cc-api-v3-style-guide#url-structure)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Path segments](http://deliveroo.engineering/guidelines/api-design/#path-segments)
  * **Section**: [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints)
  * **Section**: [Collection GET endpoints](http://deliveroo.engineering/guidelines/api-design/#collection-get-endpoints)

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Resource Names](https://cloud.google.com/apis/design/resource_names)
    > Verbatim Quote: "The resource name is organized hierarchically using collection IDs and resource IDs, separated by forward slashes."
  * **Section**: [Resource Name vs URL](https://cloud.google.com/apis/design/resource_names#resource_name_vs_url)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [URI Components](https://github.com/Haufe-Lexware/api-style-guide/blob/master/uri-components/uri-components.md)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Use consistent path formats](https://geemus.gitbooks.io/http-api-design/content/en/requests/use-consistent-path-formats.html)
  * **Section**: [Downcase paths and attributes](https://geemus.gitbooks.io/http-api-design/content/en/requests/downcase-paths-and-attributes.html)
  * **Section**: [Minimize path nesting](https://geemus.gitbooks.io/http-api-design/content/en/requests/minimize-path-nesting.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [URL Structure](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#71-url-structure)
  * **Section**: [URL Length](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#72-url-length)
  * **Section**: [Collection URL patterns](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#93-collection-url-patterns)

### PayPal - API Style Guide
* **Guideline URL**: [https://github.com/paypal/api-standards/blob/master/api-style-guide.md](https://github.com/paypal/api-standards/blob/master/api-style-guide.md)
* **Citations & References**:
  * **Section**: [URL Components](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#uri-components)
  * **Section**: [Update Partial Single Resource](https://github.com/paypal/api-standards/blob/master/api-style-guide.md#update-partial-single-resource)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [URLs](http://restful-api-design.readthedocs.io/en/latest/urls.html)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#restful-urls)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Path segments must be lowercase separate words with hyphens](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-path-segments-must-be-lowercase-separate-words-with-hyphens)
  * **Section**: [Always Pluralize Resource Names](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-always-pluralize-resource-names)
  * **Section**: [First Path segment May be /api](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-first-path-segment-may-be-api)
  * **Section**: [Avoid Trailing Slashes](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-avoid-trailing-slashes)
  * **Section**: [Limit of Sub-Resource Levels](http://zalando.github.io/restful-api-guidelines/resources/Resources.html#should-limit-of-subresource-levels)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `resource-url-format` formally | Changing `resource-url-format` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `resource-url-format`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `URL format` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
