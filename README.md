# resilient-integration-lab

A reliability and integration patterns playground. This repo is a hands-on lab for exploring production-grade patterns such as rate limiting, batching, exponential back-off / retry, idempotency, and dead-letter queues in a realistic (but simplified) integration scenario.

## Architecture

| Service | Tech | Purpose |
|---------|------|---------|
| `api` | .NET 8 Minimal API | Control plane – view runs, items, and failures |
| `worker` | Node.js + TypeScript | Integration worker – polls, processes, retries |
| `mock-api` | Node.js + TypeScript | Stub third-party API for local testing |
| `postgres` | PostgreSQL 16 | Persistent state store |

## Quick Start

```bash
# 1. Copy env config
cp .env.example .env

# 2. Build and start all services
docker compose up --build

# 3. Check health
curl http://localhost:8080/health   # .NET control API
curl http://localhost:8090/health   # mock third-party API
```

## Project Layout

```
resilient-integration-lab/
  docker-compose.yml       # Orchestrates all services
  .env.example             # Environment variable template
  api/                     # .NET 8 Minimal API (control plane)
  worker/                  # Node.js + TypeScript worker
  mock-api/                # Stub third-party API server
  docs/                    # Design docs and notes
```

## Planned Reliability Patterns

The following patterns will be implemented incrementally. None are active yet — the current state is **scaffolding only**.

- **Rate Limiting** — Respect upstream API rate limits; track request windows.
- **Batching** — Process items in configurable batches to reduce API call overhead.
- **Exponential Back-off / Retry** — Automatically retry transient failures with jitter.
- **Idempotency** — Ensure re-processing the same item never produces duplicate side effects.
- **Dead-Letter Queue** — Quarantine items that exhaust retries for manual inspection.

## Environment Variables

See [`.env.example`](.env.example) for the full list. Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Postgres connection string |
| `MOCK_API_URL` | Base URL for the stub third-party API |
| `WORKER_CONCURRENCY` | Number of parallel worker tasks |
| `WORKER_BATCH_SIZE` | Items fetched per polling cycle |
| `WORKER_RETRY_MAX` | Maximum retry attempts per item |

## Development Notes

- Migrations are applied automatically at startup in the `api` service (dev mode).
- The worker polls on a fixed interval (configurable via `WORKER_POLL_INTERVAL_MS`).
- All services connect to the same Postgres instance via Docker Compose networking.
