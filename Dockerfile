# Build stage
FROM golang:1.25-alpine AS build

RUN apk add --no-cache git

WORKDIR /src

COPY go.mod go.sum ./
COPY vendor/ vendor/

COPY . .

RUN CGO_ENABLED=0 go build -ldflags="-s" -o /api ./cmd/api

# Runtime stage
FROM alpine:3.21

RUN apk add --no-cache ca-certificates tzdata

RUN adduser -D -u 1000 appuser

COPY --from=build /api /api
COPY --from=build /src/migrations/ /migrations/

EXPOSE 4000

USER appuser

ENTRYPOINT ["/api"]
