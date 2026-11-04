# Category: HTTP Status Redirection

> **Parent**: [Knowledge Library Index](../README.md)
> **Category Description**: 3xx status code usage: 301, 302, 303, 304 Not Modified, 307, and 308 permanent redirect.
> **Total Topics in Category**: 7

---

## Topics in this Category

| Topic ID | Topic Name | Description | Guidelines Citations | Direct Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-300` | **300 Multiple Choices** | The 300 (Multiple Choices) status code indicates that the target resource has more than one representation, each with its own more specific identifier, and information about the alternatives is being provided so that the user (or user agent) can select a preferred representation by redirecting its request to one or more of those identifiers. In other words, the server desires that the user agent engage in reactive negotiation to select the most appropriate representation(s) for its needs.
 | 1 companies (1 citations) | [http-status-300.md](./http-status-300.md) |
| `http-status-301` | **301 Moved Permanently** | This and all future requests should be directed to the given URI. | 3 companies (3 citations) | [http-status-301.md](./http-status-301.md) |
| `http-status-302` | **302 Found** | Common way of performing URL redirection. An HTTP response with this status code will additionally provide a URL in the location header field. The user agent (e.g. a web browser) is invited by a response with this code to make a second, otherwise identical, request to the new URL specified in the location field. 
 | 3 companies (3 citations) | [http-status-302.md](./http-status-302.md) |
| `http-status-303` | **303 See Other** | The response to the request can be found under another URI using a GET method. When received in response to a POST (or PUT/DELETE), the client should presume that the server has received the data and should issue a redirect with a separate GET message.
 | 3 companies (3 citations) | [http-status-303.md](./http-status-303.md) |
| `http-status-304` | **304 Not Modified** | Indicates that the resource has not been modified since the version specified by the request headers If-Modified-Since or If-None-Match. In such case, there is no need to retransmit the resource since the client still has a previously-downloaded copy.
 | 4 companies (4 citations) | [http-status-304.md](./http-status-304.md) |
| `http-status-307` | **307 Temporary Redirect** | The 307 (Temporary Redirect) status code indicates that the target resource resides temporarily under a different URI and the user agent MUST NOT change the request method if it performs an automatic redirection to that URI. Since the redirection can change over time, the client ought to continue using the original effective request URI for future requests.
 | 1 companies (1 citations) | [http-status-307.md](./http-status-307.md) |
| `http-status-308` | **308 Permanent Redirect** | The 308 (Permanent Redirect) status code indicates that the target resource has been assigned a new permanent URI and any future references to this resource ought to use one of the enclosed URIs. 
 | 1 companies (1 citations) | [http-status-308.md](./http-status-308.md) |