# Product Roadmap

## Phase 1: MVP

Core features (mostly complete):

- [x] Movies CRUD API (create, read, update, delete, list with filtering/pagination)
- [x] User registration with email activation
- [x] Token-based authentication (Bearer tokens)
- [x] Role-based permissions (movies:read, movies:write)
- [x] Password reset via email token
- [x] Per-IP rate limiting with token bucket algorithm
- [x] CORS support for trusted origins
- [x] React/TypeScript frontend (login, register, activate, movies list)
- [x] Kubernetes deployment with ArgoCD GitOps pipeline
- [x] Need to have alternate clean (without middleware) routes that will enable the app to be used from an external API Gateway tool
- [x] GitHub Action workflow to build both backend and ui containers and push to registry

## Phase 2: Post-Launch

To be determined.
