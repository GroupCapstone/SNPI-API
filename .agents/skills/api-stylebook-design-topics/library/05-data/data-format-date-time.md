# Design Topic: Date and Time (`data-format-date-time`)

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Category**: [Data](./README.md)
> **Master Library**: [Knowledge Library Index](../README.md)
> **Canonical Source URL**: [https://apistylebook.com/design/topics/data-format-date-time](https://apistylebook.com/design/topics/data-format-date-time)

---

## 1. Original Topic Definition

> "How to deal with date and time data"

---

## 2. Architectural Principles Learned

This design topic governs **Date and Time** within the domain of **Data**.

### Key Considerations for Modern REST APIs:
* **Consistency & Predictability**: APIs must treat `data-format-date-time` predictably across all endpoints, minimizing consumer surprise.
* **Client Decoupling**: Contracts regarding `data-format-date-time` must decouple client implementation details from internal service models.
* **Scalability & Performance**: Proper design of `data-format-date-time` prevents unneeded compute overhead, database contention, and network payloads.

---

## 3. Analyzed Guidelines & Original Quotes

The following 7 organization guidelines explicitly specify standards for this topic:

### adidas - adidas API design guidelines
* **Guideline URL**: [https://adidas-group.gitbooks.io/api-guidelines/content/](https://adidas-group.gitbooks.io/api-guidelines/content/)
* **Citations & References**:
  * **Section**: [Common Data Types](https://adidas-group.gitbooks.io/api-guidelines/content/application/common-data-types.html)
    > Verbatim Quote: "data, time, interval, duration, timestamps"

### Cisco - API Design Guide
* **Guideline URL**: [https://github.com/CiscoDevNet/api-design-guide](https://github.com/CiscoDevNet/api-design-guide)
* **Citations & References**:
  * **Section**: [3.3 Representations](https://github.com/CiscoDevNet/api-design-guide#33-representations)
    > Verbatim Quote: "3.3.8 Date and time fields MUST be represented as strings and formatted according to RFC-3339"

### Google - Google API Design Guide
* **Guideline URL**: [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
* **Citations & References**:
  * **Section**: [Time and Duration](https://cloud.google.com/apis/design/naming_convention#time_and_duration)
  * **Section**: [Date and Time of the Day](https://cloud.google.com/apis/design/naming_convention#date_and_time_of_day)

### Haufe - Haufe API style guide
* **Guideline URL**: [https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md](https://github.com/Haufe-Lexware/api-style-guide/blob/master/readme.md)
* **Citations & References**:
  * **Section**: [Dates and Times](https://github.com/Haufe-Lexware/api-style-guide/blob/master/type-formatting/type-formatting.md#dates-and-times)

### Heroku - HTTP API Design Guide
* **Guideline URL**: [https://geemus.gitbooks.io/http-api-design/content/en/](https://geemus.gitbooks.io/http-api-design/content/en/)
* **Citations & References**:
  * **Section**: [Provide standard timestamps](https://geemus.gitbooks.io/http-api-design/content/en/responses/provide-standard-timestamps.html)
  * **Section**: [Use UTC times formatted in ISO8601](https://geemus.gitbooks.io/http-api-design/content/en/responses/use-utc-times-formatted-in-iso8601.html)

### Microsoft - Microsoft REST API Guidelines
* **Guideline URL**: [https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md)
* **Citations & References**:
  * **Section**: [Guidelines for dates and times](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#112-guidelines-for-dates-and-times)
  * **Section**: [JSON serialization of dates and times](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#113-json-serialization-of-dates-and-times)
  * **Section**: [Durations](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#114-durations)
  * **Section**: [Intervals](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#115-intervals)
  * **Section**: [Repeating intervals](https://github.com/Microsoft/api-guidelines/blob/master/Guidelines.md#116-repeating-intervals)

### Zalando - RESTFul API Guidelines
* **Guideline URL**: [http://zalando.github.io/restful-api-guidelines/](http://zalando.github.io/restful-api-guidelines/)
* **Citations & References**:
  * **Section**: [Date property values should conform to RFC 3399](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#should-date-property-values-should-conform-to-rfc-3399)
  * **Section**: [Time durations and intervals could conform to ISO 8601](http://zalando.github.io/restful-api-guidelines/json-guidelines/JsonGuidelines.html#could-time-durations-and-intervals-could-conform-to-iso-8601)
  * **Section**: [Use Standard Date and Time Formats](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#must-use-standard-date-and-time-formats)
  * **Section**: [HTTP headers](http://zalando.github.io/restful-api-guidelines/data-formats/DataFormats.html#http-headers)
    > Verbatim Quote: "Use the HTTP date format defined in RFC 7231"

---

## 4. Human & Agent Quick Reference Matrix

| Design Aspect | Standard Recommended Pattern | Anti-Pattern to Avoid |
| :--- | :--- | :--- |
| **Syntax / Representation** | Follow industry consensus documented above | Inventing non-standard proprietary solutions |
| **Contract Stability** | Version and document `data-format-date-time` formally | Changing `data-format-date-time` behavior without migration paths |
| **Error Feedback** | Return standard RFC 7807 problem details | Silent failures or generic 500 error envelopes |

---

## 5. Standby Project Checklist (Apply When Commanded)

When explicitly instructed to apply this knowledge to the monorepo, verify:
- [ ] Review `apps/backend/src/modules/` endpoints touching `data-format-date-time`.
- [ ] Verify `@snp/shared` DTOs and Zod validation schemas conform to `Date and Time` standard.
- [ ] Ensure tenant scoping (`schoolId`, `branchId`) is strictly enforced.
- [ ] Run `npm run test:api` and `npm run typecheck` to verify contract integrity.
