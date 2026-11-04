# Design Topic: HTTP Headers (`http-headers`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [HTTP Protocol](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/http-headers](https://apistylebook.com/design/topics/http-headers)

---

## 1. Original Topic Definition

> "How to use standard or custom HTTP headers"

---

## 2. Architectural Principles Learned

This design topic governs **HTTP Headers** within the domain of **HTTP Protocol**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `http-headers` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `http-headers` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `http-headers` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 11 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Naming Conventions](https://adidas-group.gitbooks.io/api-guidelines/content/evolution/naming-conventions.html)
    > Verbatim Quote: "Every HTTP Header should use Hyphenated-Pascal-Case. A custom HTTP Header SHOULD NOT start with X- (RFC6648)."

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [REST Resources](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-RESTResources)
    > Verbatim Quote: "Entities SHOULD be served with an ETag header."
  * **Section**: [Caching](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Caching)
    > Verbatim Quote: "ETag, If-None-Match"

### Atlassian - Atlassian REST API Policy
* **Guideline URL**: [https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy)
* **Citations & References**:
  * **Section**: [Detectability (Deprecation Policy)](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy#AtlassianRESTAPIpolicy-Detectability)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.5 HTTP Headers](https://github.com/CiscoDevNet/api-design-guide#351-standard-headers)
  * **Section**: [3.6.1 POST](https://github.com/CiscoDevNet/api-design-guide#361-post)
    > Verbatim Quote: "Location header"

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [Resource lifecycle](http://deliveroo.engineering/guidelines/api-design/#resource-lifecycle)
    > Verbatim Quote: "either If-Unmodified-Since or If-Match"
  * **Section**: [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning)
    > Verbatim Quote: "Clients may specify a desired version as the v parameter of the Accept header"
  * **Section**: [Versioning](http://deliveroo.engineering/guidelines/api-design/#versioning)
    > Verbatim Quote: "If the version was unspecified, the server should use the latest available version, and specify the Vary header"
  * **Section**: [Internationalisation (i18n)](http://deliveroo.engineering/guidelines/api-design/#internationalisation-i18n)
    > Verbatim Quote: "Localisation is inherently a representation concern, and HTTP mandates such concerns to be addressed using protocol headers."
  * **Section**: [Single-entity GET endpoints](http://deliveroo.engineering/guidelines/api-design/#single-entity-get-endpoints)
    > Verbatim Quote: "Responses should include a Last-Modified or ETag header, and may include both"
  * **Section**: [Compression](http://deliveroo.engineering/guidelines/api-design/#compression)
    > Verbatim Quote: "Servers may support the Accept-Encoding header for compression purposes, but this is not mandatory."

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Expires HTTP Header](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#expires-http-header)
  * **Section**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#cache-control-header)
  * **Section**: [ETag](https://github.com/Haufe-Lexware/api-style-guide/blob/master/caching/caching.md#etag)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Require Versioning in the Accepts Header](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-versioning-in-the-accepts-header.html)
  * **Section**: [Support ETags for Caching](https://geemus.gitbooks.io/http-api-design/content/en/foundations/support-etags-for-caching.html)
  * **Section**: [Provide Request-Ids for Introspection](https://geemus.gitbooks.io/http-api-design/content/en/foundations/provide-request-ids-for-introspection.html)
  * **Section**: [Divide Large Responses Across Requests with Ranges](https://geemus.gitbooks.io/http-api-design/content/en/)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [POST](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#741-post)
    > Verbatim Quote: "POST operations SHOULD support the Location response header"
  * **Section**: [Options and link headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#744-options-and-link-headers)
  * **Section**: [Standard request headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#75-standard-request-headers)
  * **Section**: [Standard response headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#76-standard-response-headers)
  * **Section**: [Custom Headers](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#77-custom-headers)
  * **Section**: [Specifying headers as query parameters](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#78-specifying-headers-as-query-parameters)

### Red Hat - Thoughts on RESTful API Design
* **Guideline URL**: [http://restful-api-design.readthedocs.io/en/latest/](http://restful-api-design.readthedocs.io/en/latest/)
* **Citations & References**:
  * **Section**: [Link Headers](http://restful-api-design.readthedocs.io/en/latest/methods.html#link-headers)

### White House - White House Web API Standards
* **Guideline URL**: [https://github.com/WhiteHouse/api-standards](https://github.com/WhiteHouse/api-standards)
* **Citations & References**:
  * **Section**: [General guidelines for RESTful URLs](https://github.com/WhiteHouse/api-standards/blob/master/README.md#general-guidelines-for-restful-urls)
    > Verbatim Quote: "URL v. header"

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [You Must Hyphenate HTTP Headers](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#must-you-must-hyphenate-http-headers)
  * **Section**: [Prefer Hyphenated-Pascal-Case for HTTP header Fields](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#should-prefer-hyphenatedpascalcase-for-http-header-fields)
  * **Section**: [Use Standardized Headers](http://zalando.github.io/restful-api-guidelines/naming/Naming.html#could-use-standardized-headers)
  * **Section**: [Use 429 with Headers for Rate Limits](http://zalando.github.io/restful-api-guidelines/http/Http.html#must-use-429-with-headers-for-rate-limits)
  * **Section**: [Do Not Use Link Headers with JSON entities](http://zalando.github.io/restful-api-guidelines/hyper-media/Hypermedia.html#must-do-not-use-link-headers-with-json-entities)
  * **Section**: [HTTP headers](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers)
    > Verbatim Quote: "Use the HTTP date format defined in RFC 7231"
  * **Section**: [Common Headers](http://zalando.github.io/restful-api-guidelines/headers/CommonHeaders.html)
  * **Section**: [Proprietary Headers](http://zalando.github.io/restful-api-guidelines/headers/ProprietaryHeaders.html)
  * **Section**: [Add a Warning Header to Responses](http://zalando.github.io/restful-api-guidelines/deprecation/Deprecation.html#should-add-a-warning-header-to-responses)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `http-headers` formally | Changing `http-headers` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `http-headers`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `HTTP Headers` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
