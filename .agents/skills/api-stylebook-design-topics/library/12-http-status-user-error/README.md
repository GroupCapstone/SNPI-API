# Category: HTTP Status User Error

> **Parent**: [Knowledge Library Index](../README.md)
> **Category Description**: 4xx status code semantics: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404, 409, 422, 429.
> **Total Topics in Category**: 16

---

## Topics in this Category

| Topic ID | Topic Name | Description | Guidelines Citations | Direct Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-400` | **400 Bad Request** | The server cannot or will not process the request due to an apparent client error (e.g., malformed request syntax, too large size, invalid request message framing, or deceptive request routing).
 | 7 companies (13 citations) | [http-status-400.md](./http-status-400.md) |
| `http-status-401` | **401 Unauthorized** | Similar to 403 Forbidden, but specifically for use when authentication is required and has failed or has not yet been provided. The response must include a WWW-Authenticate header field containing a challenge applicable to the requested resource. 
 | 6 companies (6 citations) | [http-status-401.md](./http-status-401.md) |
| `http-status-403` | **403 Forbidden** | The request was a valid request, but the server is refusing to respond to it. The user might be logged in but does not have the necessary permissions for the resource. | 5 companies (6 citations) | [http-status-403.md](./http-status-403.md) |
| `http-status-404` | **404 Not Found** | The requested resource could not be found but may be available in the future. Subsequent requests by the client are permissible. | 9 companies (18 citations) | [http-status-404.md](./http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | A request method is not supported for the requested resource; for example, a GET request on a form which requires data to be presented via POST, or a PUT request on a read-only resource.
 | 6 companies (6 citations) | [http-status-405.md](./http-status-405.md) |
| `http-status-406` | **406 Not Acceptable** | The requested resource is capable of generating only content not acceptable according to the Accept headers sent in the request. | 3 companies (3 citations) | [http-status-406.md](./http-status-406.md) |
| `http-status-408` | **408 Request Timeout** | The server timed out waiting for the request. According to HTTP specifications: The client did not produce a request within the time that the server was prepared to wait. The client MAY repeat the request without modifications at any later time.
 | 2 companies (2 citations) | [http-status-408.md](./http-status-408.md) |
| `http-status-409` | **409 Conflict** | Indicates that the request could not be processed because of conflict in the request, such as an edit conflict between multiple simultaneous updates.
 | 4 companies (4 citations) | [http-status-409.md](./http-status-409.md) |
| `http-status-410` | **410 Gone** | Indicates that the resource requested is no longer available and will not be available again. This should be used when a resource has been intentionally removed and the resource should be purged. Upon receiving a 410 status code, the client should not request the resource in the future. Clients such as search engines should remove the resource from their indices. Most use cases do not require clients and search engines to purge the resource, and a *404 Not Found* may be used instead.
 | 2 companies (4 citations) | [http-status-410.md](./http-status-410.md) |
| `http-status-411` | **411 Length Required** | The request did not specify the length of its content, which is required by the requested resource. | 1 companies (1 citations) | [http-status-411.md](./http-status-411.md) |
| `http-status-412` | **412 Precondition Failed** | The server does not meet one of the preconditions that the requester put on the request. | 4 companies (8 citations) | [http-status-412.md](./http-status-412.md) |
| `http-status-415` | **415 Unsupported Media Type** | The request entity has a media type which the server or resource does not support. For example, the client uploads an image as image/svg+xml, but the server requires that images use a different format. | 4 companies (6 citations) | [http-status-415.md](./http-status-415.md) |
| `http-status-422` | **422 Unprocessable Entity** | The request was well-formed but was unable to be followed due to semantic errors. | 5 companies (7 citations) | [http-status-422.md](./http-status-422.md) |
| `http-status-423` | **423 Locked** | The resource that is being accessed is locked. | 1 companies (1 citations) | [http-status-423.md](./http-status-423.md) |
| `http-status-428` | **428 Precondition Required** | The origin server requires the request to be conditional. 
Intended to prevent the *lost update* problem, where a client GETs a resource's state, modifies it, 
and PUTs it back to the server, when meanwhile a third party has modified the state on the server, 
leading to a conflict.
 | 2 companies (2 citations) | [http-status-428.md](./http-status-428.md) |
| `http-status-429` | **429 Too Many Requests** | The user has sent too many requests in a given amount of time. Intended for use with rate-limiting schemes. | 4 companies (5 citations) | [http-status-429.md](./http-status-429.md) |