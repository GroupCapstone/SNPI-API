# API Stylebook: Analyzed Design Guidelines Directory

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Source**: [https://apistylebook.com/design/guidelines/](https://apistylebook.com/design/guidelines/)
> **Coverage**: 16 Corporate & Public Sector Guidelines | 100 Topics | 1,051 Citations

Some companies and government agencies share their API Design Guidelines with the community. Each document has been thoroughly analyzed and cross-referenced with all standardized design topics.

---

## 1. Master Guidelines Inventory

| Organization | Guideline Title | Topics Covered | Philosophy Focus | Local Document | Official Source |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **adidas** | adidas API design guidelines | 41 | Adidas focuses on consumer-facing digital experiences, advocating... | [`adidas-api-design-guidelines.md`](./adidas-api-design-guidelines.md) | [adidas Guide](https://adidas-group.gitbooks.io/api-guidelines/content/) |
| **Atlassian** | Atlassian REST API Design Guidelines version 1 | 28 | Atlassian standardizes enterprise collaboration software REST API... | [`atlassian-rest-api-design-guidelines-version-1.md`](./atlassian-rest-api-design-guidelines-version-1.md) | [Atlassian Guide](https://developer.atlassian.com/docs/atlassian-platform-common-components/rest-api-development/atlassian-rest-api-design-guidelines-version-1) |
| **Atlassian** | Atlassian REST API Policy | 8 | Authoritative policy document detailing Atlassian's backward comp... | [`atlassian-rest-api-policy.md`](./atlassian-rest-api-policy.md) | [Atlassian Guide](https://developer.atlassian.com/display/HOME/Atlassian+REST+API+policy) |
| **Australian Digital Transformation Office** | API Design Guide | 26 | The Australian Digital Transformation Office (AusDTO) provides go... | [`ausdto-api-design-guide.md`](./ausdto-api-design-guide.md) | [Australian Digital Transformation Office Guide](https://apiguide.readthedocs.io/en/latest/index.html) |
| **Cisco** | API Design Guide | 43 | Cisco DevNet's engineering guide for enterprise networking, cloud... | [`cisco-api-design-guide.md`](./cisco-api-design-guide.md) | [Cisco Guide](https://github.com/CiscoDevNet/api-design-guide) |
| **Cloud Foundry** | Cloud Controller API v3 Style Guide (Proposal) | 44 | Cloud Foundry's style guide for the Cloud Controller API v3. Spec... | [`cloud-foundy-cloud-controller-api-style-guide.md`](./cloud-foundy-cloud-controller-api-style-guide.md) | [Cloud Foundry Guide](https://github.com/cloudfoundry/cc-api-v3-style-guide) |
| **Deliveroo** | API Design | 60 | Deliveroo's pragmatic, high-throughput e-commerce and logistics R... | [`deliveroo-api-design-guidelines.md`](./deliveroo-api-design-guidelines.md) | [Deliveroo Guide](http://deliveroo.engineering/guidelines/api-design/) |
| **Google** | Google API Design Guide | 39 | Google Cloud's industry-defining API Design Guide based on AIPs (... | [`google-api-design-guide.md`](./google-api-design-guide.md) | [Google Guide](https://cloud.google.com/apis/design/) |
| **Haufe** | Haufe API style guide | 61 | Haufe Group's exhaustive European enterprise style guide covering... | [`haufe-api-styleguide.md`](./haufe-api-styleguide.md) | [Haufe Guide](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md) |
| **Heroku** | HTTP API Design Guide | 34 | Heroku's iconic 12-factor HTTP API Design Guide. Emphasizes clean... | [`heroku-http-api-design-guide.md`](./heroku-http-api-design-guide.md) | [Heroku Guide](https://geemus.gitbooks.io/http-api-design/content/en/) |
| **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** | Interoperability model for the Public Administration | 37 | AgID's Interoperability Model for Italian Public Administration, ... | [`italian-public-administration.md`](./italian-public-administration.md) | [Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration) Guide](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/) |
| **Microsoft** | Microsoft REST API Guidelines | 43 | Microsoft's comprehensive enterprise REST standards used across A... | [`microsoft-rest-api-guidelines.md`](./microsoft-rest-api-guidelines.md) | [Microsoft Guide](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md) |
| **PayPal** | API Style Guide | 36 | PayPal's financial REST API standards. Focuses on mission-critica... | [`paypal-api-style-guide.md`](./paypal-api-style-guide.md) | [PayPal Guide](https://github.com/paypal/api-standards/blob/master/api-style-guide.md) |
| **Red Hat** | Thoughts on RESTful API Design | 32 | Red Hat's foundational architectural treatise on REST philosophy,... | [`redhat-thoughts-on-restful-api-design.md`](./redhat-thoughts-on-restful-api-design.md) | [Red Hat Guide](http://restful-api-design.readthedocs.io/en/latest/) |
| **White House** | White House Web API Standards | 22 | US Federal Government Open Data API standards (Project Open Data)... | [`white-house-web-api-standards.md`](./white-house-web-api-standards.md) | [White House Guide](https://github.com/WhiteHouse/api-standards) |
| **Zalando** | RESTFul API Guidelines | 74 | Zalando's community-standard microservices REST guidelines (74 to... | [`zalando-restful-api-guidelines.md`](./zalando-restful-api-guidelines.md) | [Zalando Guide](http://zalando.github.io/restful-api-guidelines/) |

---

## 2. Guideline Exploration by Archetype

### Microservices & Modern Web Platforms
* [`zalando-restful-api-guidelines.md`](./zalando-restful-api-guidelines.md) (74 topics): Strict OpenAPI 3.0, bounded contexts (4-8 resources), RFC 7807 error format.
* [`deliveroo-api-design-guidelines.md`](./deliveroo-api-design-guidelines.md) (60 topics): Pragmatic e-commerce REST, fine-grained endpoints, hypermedia.
* [`haufe-api-styleguide.md`](./haufe-api-styleguide.md) (61 topics): Comprehensive domain-driven REST, rich query parameters, pagination.

### Cloud Hyperscalers & Enterprise Platforms
* [`google-api-design-guide.md`](./google-api-design-guide.md) (39 topics): Resource-Oriented Design (AIPs), standard methods, custom methods (`:search`), Operations.
* [`microsoft-rest-api-guidelines.md`](./microsoft-rest-api-guidelines.md) (43 topics): OData filtering (`$filter`), structured JSON error envelopes, batch requests.
* [`cisco-api-design-guide.md`](./cisco-api-design-guide.md) (43 topics): Enterprise networking, infrastructure controllers, robust query filtering.

### Payments & Mission-Critical Systems
* [`paypal-api-style-guide.md`](./paypal-api-style-guide.md) (36 topics): Financial transaction safety, idempotency keys, payment state machines, time selection.

### Cloud Native & PaaS
* [`heroku-http-api-design-guide.md`](./heroku-http-api-design-guide.md) (34 topics): 12-factor HTTP API design, UUID keys, Range-based pagination headers.
* [`cloud-foundy-cloud-controller-api-style-guide.md`](./cloud-foundy-cloud-controller-api-style-guide.md) (44 topics): Multi-tenant controllers, asynchronous tasks (202 Accepted).

### Public Sector & Open Standards
* [`italian-public-administration.md`](./italian-public-administration.md) (37 topics): European Interoperability Framework (EIF), public administration cooperation.
* [`white-house-web-api-standards.md`](./white-house-web-api-standards.md) (22 topics): US Federal Government Open Data standards, record limit boundaries.
* [`ausdto-api-design-guide.md`](./ausdto-api-design-guide.md) (26 topics): Australian Government digital transformation and service delivery standards.

---

## 3. Standby Operating Mode

* **Strict Zero Premature Code Application**: All guideline profiles and rules are cataloged for pre-learned architectural knowledge.
* **Activation on Command**: When instructed to align the monorepo API with a specific company archetype (e.g. *'format errors using Zalando RFC 7807'* or *'design background jobs like Google Operations'*), agents will apply the exact rules cataloged here.