# References

## Backend Dockerfile (`Dockerfile`)

Multi-stage build using `golang:1.25-alpine` → `alpine:3.21`.
- Uses vendored dependencies (`vendor/` directory)
- Copies migrations into image at `/migrations/`
- Runs as non-root user `appuser` (uid 1000)
- Exposes port 4000

```dockerfile
FROM golang:1.25-alpine AS build
RUN apk add --no-cache git
WORKDIR /src
COPY go.mod go.sum ./
COPY vendor/ vendor/
COPY . .
RUN CGO_ENABLED=0 go build -ldflags="-s" -o /api ./cmd/api

FROM alpine:3.21
RUN apk add --no-cache ca-certificates tzdata
RUN adduser -D -u 1000 appuser
COPY --from=build /api /api
COPY --from=build /src/migrations/ /migrations/
EXPOSE 4000
USER appuser
ENTRYPOINT ["/api"]
```

## UI Dockerfile (`ui/Dockerfile`)

Multi-stage build using `node:22-alpine` → `nginx:1.27-alpine`.
- Uses pnpm (via corepack)
- Build context must be `ui/` directory

```dockerfile
FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:1.27-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/greenlight-ui.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Makefile Image Names

```makefile
DOCKER_REGISTRY = ghcr.io
DOCKER_REPO = $(GITHUB_USER)/greenlight
DOCKER_IMAGE = $(DOCKER_REGISTRY)/$(DOCKER_REPO)
```

Concrete names:
- Backend: `ghcr.io/vitor-caetano/greenlight`
- UI: `ghcr.io/vitor-caetano/greenlight-ui`

## Go Module

- Module: `greenlight.alexedwards.net`
- Go version: `1.25`
- Dependencies vendored in `vendor/`

## Existing Manual Steps (to automate)

```bash
# Backend
docker build -t ghcr.io/vitor-caetano/greenlight .
docker push ghcr.io/vitor-caetano/greenlight:latest

# UI
docker build -t ghcr.io/vitor-caetano/greenlight-ui:latest -f ui/Dockerfile ui/
docker push ghcr.io/vitor-caetano/greenlight-ui:latest
```
