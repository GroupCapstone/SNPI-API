# Design Topic: Security (`security`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Security](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/security](https://apistylebook.com/design/topics/security)

---

## 1. Original Topic Definition

> "Security concerns"

---

## 2. In-Depth Architectural Knowledge Learned

Enterprise REST API security baseline. HTTPS mandatory (TLS 1.3 preferred), OAuth 2.0 Bearer JWT tokens, least-privilege RBAC scopes, rate limiting (429), and constant-time secret comparison.

### Core Design Rules & Invariants:
* **Consistency**: Every API endpoint handling `security` must adhere to identical semantic contracts.
* **Client Decoupling**: Contracts must decouple client expectations from internal schema migrations.
* **Security & Isolation**: Multi-tenant scoping and authorization checks must guard `security` operations.

### Concrete HTTP Syntax / Representation:
```http
Authorization: Bearer <jwt-token>
X-Tenant-School: SCH-001
```

---

## 3. Analyzed Guidelines & Original Quotes

The following 10 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [TLS](https://adidas-group.gitbooks.io/api-guidelines/content/protocol/tls.html)
  * **Section**: [Security](https://adidas-group.gitbooks.io/api-guidelines/content/execution/security.html)

### Atlassian - Atlassian REST API Design Guidelines version 1
* **Guideline URL**: [https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1)
* **Citations & References**:
  * **Section**: [Security](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1#AtlassianRESTAPIDesignGuidelinesversion1-Security)

### Australian Digital Transformation Office - API Design Guide
* **Guideline URL**: [https://apiguide.readthedocs.io/en/latest/index.html](https://apiguide.readthedocs.io/en/latest/index.html)
* **Citations & References**:
  * **Section**: [Privacy and security](https://apiguide.readthedocs.io/en/latest/principles/security.html)

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.1 Security](https://github.com/CiscoDevNet/api-design-guide#31-security)
  * **Section**: [3.2 Authentication and Representation](https://github.com/CiscoDevNet/api-design-guide#32-authentication-and-authorization)
    > Verbatim Quote: "The REST API MUST use OAuth2 implementation for user authentication and authorization, exclusively"
  * **Section**: [3.6.8 Safe and Non-Safe Methods](https://github.com/CiscoDevNet/api-design-guide#36-http-verbs)

### Deliveroo - API Design
* **Guideline URL**: [http://deliveroo.engineering/guidelines/api-design/](http://deliveroo.engineering/guidelines/api-design/)
* **Citations & References**:
  * **Section**: [None](http://deliveroo.engineering/guidelines/api-design/#security)
  * **Section**: [Caching](http://deliveroo.engineering/guidelines/api-design/#caching)
    > Verbatim Quote: "External APIs must always use TLS so only direct clients or trusted intermediaries who have our certificates (CDNs, typically) will be able to view the content"

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [API clients MUST use an API Key](https://github.com/Haufe-Lexware/api-style-guide/blob/master/general-guidelines/general-guidelines.md#api-clients-must-use-an-api-key)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Require Secure Connections](https://geemus.gitbooks.io/http-api-design/content/en/foundations/require-secure-connections.html)

### Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) - Interoperability model for the Public Administration
* **Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
* **Citations & References**:
  * **Section**: [Security concepts](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_02.html)
    > Verbatim Quote: "the section focuses on the use of security protocols and techniques based on the manipulation of network messages. The section will also refer to how the security requirements can be variable depending on the application scenario and the use case."
  * **Section**: [Security](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04_cap_00.html)
    > Verbatim Quote: "This document describes the security profiles identified by AgID that the providers must use to satisfy the needs expressed through functional and non-functional requirements."
  * **Section**: [Channel security and / or identification of organizations](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/sicurezza-di-canale-eo-autenticazione-delle-organizzazioni.html)
  * **Section**: [User (consumer) access](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/autenticazione-del-soggetto-richiedente.html)
  * **Section**: [Integrity of SOAP message](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idas03-integrita-della-payload-del-messaggio-soap)
    > Verbatim Quote: "This profile extends IDAS01 or IDAS02 , adding to the communication between user and provider at the message level integrity of the message payload."
  * **Section**: [Integrity of REST message](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idar03-integrita-della-payload-messaggio-rest)
    > Verbatim Quote: "This profile extends IDAR01 or IDAR02 , adding to the communication between user and provider at the message level integrity of the message payload."
  * **Section**: [Confidentiality and user (consumer) authentication](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzione-per-confidenzialita-ed-autenticazione-del-soggetto-fruitore)
  * **Section**: [Non repudiation of transactions](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzioni-per-la-non-ripudiabilita-della-trasmissione)
  * **Section**: [REST API safety](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#sicurezza)
    > Verbatim Quote: "JOSE, JWT"
  * **Section**: [SOAP service safety](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#sicurezza)
    > Verbatim Quote: "The Basic Security Profile 1.1, based on the WS-Security extension, suggests the use of SAML 2.0. As mentioned, with respect to authentication and authorization technologies, there are some application domains for which OAuth2 or OpenID are more appropriate."

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Security](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#148-security)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Security](http://zalando.github.io/restful-api-guidelines/security/Security.html)
  * **Section**: [Secure Endpoints with OAuth 2.0](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-secure-endpoints-with-oauth-20)
  * **Section**: [Define and Assign Access Rights (Scopes)](http://zalando.github.io/restful-api-guidelines/security/Security.html#must-define-and-assign-access-rights-scopes)

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Architectural Execution** | Enforce HTTPS; authenticate via Authorization: Bearer <token>; validate scopes and tenant context. | Passing tokens in URL query parameters; trusting client-supplied tenant IDs. |
| **Contract Stability** | Version and document `security` formally in `@snp/shared` | Breaking `security` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `security`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Security` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
