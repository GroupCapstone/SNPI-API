# SNP-SMS Observability Stack

This directory contains configuration for Prometheus metrics, Grafana visualization, and Loki log aggregation.

---

## 1. Quickstart

To launch the observability suite locally:

```bash
docker compose -f infrastructure/observability/docker-compose.observability.yml up -d
```

- **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
- **Grafana Dashboard**: [http://localhost:3001](http://localhost:3001) (Credentials: `admin` / `admin`)
- **Loki Log Ingestion**: `http://localhost:3100`

---

## 2. Monitored Endpoints

- **API Health**: `GET http://localhost:4000/api/v1/health`
- **Frontend Health**: `GET http://localhost:3000/api/health`
- **MongoDB Telemetry**: Replica set status, election states, connection pool saturation.

---

## 3. Log Architecture

The backend API outputs JSON structured logs using Pino:

- Request correlation IDs (`req.id`)
- Client IP, User-Agent, HTTP Method, and Status Code
- Performance latency tracking (`responseTime` in ms)
- Stack traces with sanitized authorization headers and credentials
