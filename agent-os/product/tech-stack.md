# Tech Stack

## Backend

- **Language:** Go 1.25
- **Router:** `httprouter` (github.com/julienschmidt/httprouter)
- **PostgreSQL driver:** `lib/pq`
- **Rate limiting:** `golang.org/x/time/rate` (token bucket)
- **Email:** `go-mail`
- **Migrations:** `golang-migrate`

## Frontend

- **Framework:** React with TypeScript
- **Build tool:** Vite (proxies `/v1` requests to API at `:4000` in dev)
- **Package manager:** pnpm

## Database

- **PostgreSQL** — movies, users, tokens, permissions tables
- Migrations managed with `golang-migrate` (sequential numbered SQL files)

## Deployment

- **Containerization:** Docker
- **Orchestration:** Kubernetes (Kind for local development)
- **GitOps:** ArgoCD
- **CI/CD:** GitHub Actions
- **Registry:** GitHub Container Registry (ghcr.io)
