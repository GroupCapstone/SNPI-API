# Guideline: Interoperability model for the Public Administration

> **Status**: `[STANDBY_KNOWLEDGE]` - Recorded for reference; do not apply to project code until explicitly commanded.
> **Organization**: **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)**
> **Canonical Guideline URL**: [https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/)
> **Parent Directory**: [Design Guidelines Index](./README.md)
> **Topics Covered**: 37 topics across 15 categories

---

## 1. Executive Summary & Architectural Philosophy

**Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)** published the *Interoperability model for the Public Administration* as an authoritative engineering standard.

> AgID's Interoperability Model for Italian Public Administration, aligned with the European Interoperability Framework (EIF). Defines standards for REST vs SOAP cooperation, distributed data exchange, security, and public sector integration.

---

## 2. Analyzed Design Topics by Category

This guideline covers **37 standardized API design topics** categorized below:

### Category: API Design

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `global-design` | **Global design** | [Introduction to service interfaces](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html) | "A service therefore consists of an activity, or a series of activities, of a more or less intangible nature, which take place in an exchange between a supplier and a customer, in which the object of the transaction is an intangible asset." | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Paradigms of cooperation](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#paradigmi-di-cooperazione) | "Data sharing, Inter public administration notification, inter public administration composition" | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [SOAP](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#soap) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Comparative considerations (REST vs SOAP vs Message broket)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_06.html#considerazioni-comparative) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Other approches (Distributed data stores, open data)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_07.html#altri-approcci-e-tecnologie-di-integrazione) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Paradigms for the design of service interfaces (RPC-like vs resource oriented)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#paradigmi-per-la-progettazione-delle-interfacce-di-servizio) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Perimeter of service interfaces](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_03_cap_01.html#perimetro-delle-interfacce-di-servizio) | "So each application server offers service interfaces, however it is still significant to distinguish whether the service interface is offered to interoperate within the domain..., towards other administrations or other subjects with whom a relationship of trust is established ... or externally...." | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Technical recommendations for REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-rest) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [Technical recommendations for SOAP](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#raccomandazioni-tecniche-per-soap) | Standard rule | [`global-design.md`](../library/01-api-design/global-design.md) |
| `global-design` | **Global design** | [The european context](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_02.html#il-contesto-europeo) | "The European Interoperability Framework (EIF) provides guidance to European public administrations on how to operate initiatives related to the issue of interoperability;" | [`global-design.md`](../library/01-api-design/global-design.md) |

### Category: API Lifecycle

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `governance` | **Governance** | [Catalog of API/Services](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#catalogo-delle-api-servizi) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |
| `governance` | **Governance** | [Model governance](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_01_cap_05.html#governance-del-modello) | Standard rule | [`governance.md`](../library/02-api-lifecycle/governance.md) |

### Category: Asynchronicity

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `asynchronicity` | **Asynchronicity** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | Standard rule | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Non blocking profile](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccanti) | "In the following chapter the non-blocking interaction profiles will be shown, in which a user submits a request and this is only taken in charge immediately, while its satisfaction can take place in a deferred manner." | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Non-blocking RPC PUSH profiles (callback based)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profili-non-bloccante-rpc-push-basato-su-callback) | "This particular case, called RPC PUSH, can be used if the user in turn has the possibility to expose a service interface for receiving replies." | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |
| `asynchronicity` | **Asynchronicity** | [Non-blocking profile RPC PULL (busy waiting)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/profili-non-bloccanti.html#profilo-non-bloccante-rpc-pull-busy-waiting) | "the provider provides a searchable address to verify the processing status of a request" | [`asynchronicity.md`](../library/03-asynchronicity/asynchronicity.md) |

### Category: Collection Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `collection` | **Collection** | [Resource collections can use plural names](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) | Standard rule | [`collection.md`](../library/04-collection-resources/collection.md) |
| `collection` | **Collection** | [Code structured data with JSON objects](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#codificare-dati-strutturati-con-oggetti-json) | "the payload of a response containing more than one entry returns an object containing a list and not directly a list." | [`collection.md`](../library/04-collection-resources/collection.md) |

### Category: Data

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `data-format` | **Data format** | [Data uniformity](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#uniformita-dei-dati) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-format` | **Data format** | [Data format (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#formato-dei-dati) | Standard rule | [`data-format.md`](../library/05-data/data-format.md) |
| `data-standards` | **Standards data** | [Use the properties according to standard nomenclatures](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#utilizzare-le-properties-secondo-nomenclature-standard) | Standard rule | [`data-standards.md`](../library/05-data/data-standards.md) |

### Category: Error handling

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `errors` | **Errors** | [Use the Problem JSON scheme for error responses](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) | Standard rule | [`errors.md`](../library/06-error-handling/errors.md) |

### Category: HTTP Methods

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-methods-delete` | **DELETE** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | "the DELETE method is used for deleting topics / subscriptions and queues and in some cases to signal the fact that a message has been consumed." | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-delete` | **DELETE** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-methods-delete.md`](../library/07-http-methods/http-methods-delete.md) |
| `http-methods-get` | **GET** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | "the GET method is used to consume messages from queues and topics / subscriptions;" | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-get` | **GET** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-methods-get.md`](../library/07-http-methods/http-methods-get.md) |
| `http-methods-head` | **HEAD** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods-head.md`](../library/07-http-methods/http-methods-head.md) |
| `http-methods` | **HTTP methods** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods` | **HTTP methods** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | "Although, depending on the implementations, the different REST service interfaces for accessing message brokers differ in functionality offered and ways of modeling queues, topics / subscriptions, the following behaviors of HTTP methods can be abstracted" | [`http-methods.md`](../library/07-http-methods/http-methods.md) |
| `http-methods-patch` | **PATCH** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-methods-patch.md`](../library/07-http-methods/http-methods-patch.md) |
| `http-methods-post` | **POST** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | "the POST method is used for sending messages and creating topics / subscriptions and queues;" | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-post` | **POST** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-methods-post.md`](../library/07-http-methods/http-methods-post.md) |
| `http-methods-put` | **PUT** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "The REST service interface must use the HTTP verb most suitable for the operation as indicated in RFC 7231" | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [Message broker](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_05.html#message-broker) | "The PUT method is usually used to modify the properties of topic / subscriptions and queues." | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |
| `http-methods-put` | **PUT** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-methods-put.md`](../library/07-http-methods/http-methods-put.md) |

### Category: HTTP Protocol

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-caching` | **Caching** | [Directions for use (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#indicazioni-di-utilizzo) | "Where necessary, especially for caching and concurrent access to resources, ETag (of unique version identifiers of resources) should be leveraged" | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-caching` | **Caching** | [By default, http caching must be disabled](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#di-default-il-caching-http-deve-essere-disabilitato) | Standard rule | [`http-caching.md`](../library/08-http-protocol/http-caching.md) |
| `http-content-negotiation` | **Content negociation and media types** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-content-negotiation` | **Content negociation and media types** | [Avoid custom Content-Types](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#evitare-content-type-personalizzati) | Standard rule | [`http-content-negotiation.md`](../library/08-http-protocol/http-content-negotiation.md) |
| `http-status` | **HTTP Statuses** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status.md`](../library/08-http-protocol/http-status.md) |

### Category: HTTP Status Success

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-200` | **200 OK** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-200.md`](../library/11-http-status-success/http-status-200.md) |
| `http-status-201` | **201 Created** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-201.md`](../library/11-http-status-success/http-status-201.md) |
| `http-status-204` | **204 No Content** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-204.md`](../library/11-http-status-success/http-status-204.md) |

### Category: HTTP Status User Error

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `http-status-404` | **404 Not Found** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-404.md`](../library/12-http-status-user-error/http-status-404.md) |
| `http-status-405` | **405 Method Not Allowed** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-405.md`](../library/12-http-status-user-error/http-status-405.md) |
| `http-status-409` | **409 Conflict** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-409.md`](../library/12-http-status-user-error/http-status-409.md) |
| `http-status-415` | **415 Unsupported Media Type** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`http-status-415.md`](../library/12-http-status-user-error/http-status-415.md) |
| `http-status-422` | **422 Unprocessable Entity** | [Use the Problem JSON scheme for error responses](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-lo-schema-problem-json-per-le-risposte-di-errore) | "HTTP status 422 if the representation of the request is syntactically correct but semantically non-processable." | [`http-status-422.md`](../library/12-http-status-user-error/http-status-422.md) |

### Category: Hypermedia

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `hypermedia` | **Hypermedia** | [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) | "According to this approach, by accessing a resource, the server's response contains hyperlinks to other actions that can be performed on the resource" | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |
| `hypermedia` | **Hypermedia** | [Use absolute URIs in the results](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#usare-uri-assoluti-nei-risultati) | Standard rule | [`hypermedia.md`](../library/13-hypermedia/hypermedia.md) |

### Category: Miscellaneous

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `documentation` | **Documentation** | [REST](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#rest) | "For these reasons the ModI imposes the use of OpenAPI v3. An OpenAPI file allows you to describe the entire interface (available endpoints and operations on each endpoint, input and output parameters for each operation, authentication methods, contact information, license, terms of use, etc.)." | [`documentation.md`](../library/14-miscellaneous/documentation.md) |
| `performance` | **Performance and bandwidth** | [Optimize bandwidth usage and improve responsiveness](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) | Standard rule | [`performance.md`](../library/14-miscellaneous/performance.md) |

### Category: Naming

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `naming-case` | **Case** | [The properties of JSON objects must have a consistent naming](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-proprieta-degli-oggetti-json-devono-avere-un-naming-consistente) | "snake_case camelCase" | [`naming-case.md`](../library/15-naming/naming-case.md) |
| `naming` | **Naming** | [Uniformity and naming (REST)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#uniformita-e-naming) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Uniformity and naming (SOAP)](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#uniformita-e-naming) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |
| `naming` | **Naming** | [Resource collections can use plural names](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#le-collezioni-di-risorse-possono-usare-nomi-al-plurale) | Standard rule | [`naming.md`](../library/15-naming/naming.md) |

### Category: Resources

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `resource-creation` | **Create resource** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`resource-creation.md`](../library/16-resources/resource-creation.md) |
| `resource-deletion` | **Delete resource** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`resource-deletion.md`](../library/16-resources/resource-deletion.md) |
| `resource` | **Resource** | [The concept of service](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_01.html#il-concetto-di-servizio) | "We can identify the types of properties, functional property, which expresses "what" we get from service; quality of the service, referring to characteristics (for example, delivery time) that specify benefits or perceived utility associated with the service; non-functional properties, expressing "how" the service is delivered to us." | [`resource.md`](../library/16-resources/resource.md) |
| `resource` | **Resource** | [CRUD Access to Resources](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#accesso-crud-a-risorse) | Standard rule | [`resource.md`](../library/16-resources/resource.md) |
| `resource-retrieve` | **Retrieve resource** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`resource-retrieve.md`](../library/16-resources/resource-retrieve.md) |
| `resource-retrieve-partial` | **Retrieve resource partially** | [Optimize bandwidth usage and improve responsiveness](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/regole-comuni-rest-soap.html#ottimizzare-l-uso-della-banda-e-migliorare-la-responsivita) | "GET /resources/123?fields=(name,partner(name))" | [`resource-retrieve-partial.md`](../library/16-resources/resource-retrieve-partial.md) |
| `resource-update` | **Update resource** | [REST interface processing rules](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/profili-di-interazione/accesso-crud-a-risorse.html#regole-di-processamento) | Standard rule | [`resource-update.md`](../library/16-resources/resource-update.md) |

### Category: Security

| Topic ID | Topic Name | Guideline Section | Verbatim Quote / Rule | Knowledge Link |
| :--- | :--- | :--- | :--- | :--- |
| `security` | **Security** | [Security concepts](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_02.html) | "the section focuses on the use of security protocols and techniques based on the manipulation of network messages. The section will also refer to how the security requirements can be variable depending on the application scenario and the use case." | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Security](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04_cap_00.html) | "This document describes the security profiles identified by AgID that the providers must use to satisfy the needs expressed through functional and non-functional requirements." | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Channel security and / or identification of organizations](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/sicurezza-di-canale-eo-autenticazione-delle-organizzazioni.html) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [User (consumer) access](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/autenticazione-del-soggetto-richiedente.html) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Integrity of SOAP message](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idas03-integrita-della-payload-del-messaggio-soap) | "This profile extends IDAS01 or IDAS02 , adding to the communication between user and provider at the message level integrity of the message payload." | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Integrity of REST message](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/integrita.html#idar03-integrita-della-payload-messaggio-rest) | "This profile extends IDAR01 or IDAR02 , adding to the communication between user and provider at the message level integrity of the message payload." | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Confidentiality and user (consumer) authentication](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzione-per-confidenzialita-ed-autenticazione-del-soggetto-fruitore) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [Non repudiation of transactions](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_04/soluzioni-di-sicurezza.html#soluzioni-per-la-non-ripudiabilita-della-trasmissione) | Standard rule | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [REST API safety](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_04.html#sicurezza) | "JOSE, JWT" | [`security.md`](../library/17-security/security.md) |
| `security` | **Security** | [SOAP service safety](https://docs.italia.it/italia/piano-triennale-ict/lg-modellointeroperabilita-docs/it/bozza/doc/doc_02_cap_03.html#sicurezza) | "The Basic Security Profile 1.1, based on the WS-Security extension, suggests the use of SAML 2.0. As mentioned, with respect to authentication and authorization technologies, there are some application domains for which OAuth2 or OpenID are more appropriate." | [`security.md`](../library/17-security/security.md) |

---

## 3. Key Architectural Rules for AI Agents & Developers

When consulting **Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)**'s design guidelines:
* **Core Strengths**: High alignment with `API Design, API Lifecycle, Asynchronicity, Collection Resources, Data`.
* **Contract Invariant**: Enforce strict adherence to Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)'s documented conventions when this guideline is chosen as the architectural archetype.
* **Multi-Tenant Monorepo Application**: When commanded to apply Agenzia per l'Italia Digital & Team per la trasformazione digital (Italian administration)'s conventions to the SNP-SMS backend, ensure compliance with Express 5 7-layer patterns and `@snp/shared` DTOs.

---

## 4. Standby Verification Checklist

- [ ] Consult corresponding topic knowledge files in `../library/` before modifying code.
- [ ] Ensure zero breaking changes to existing REST endpoints.
- [ ] Maintain multi-tenant isolation (`schoolId`, `branchId`) across all queries.