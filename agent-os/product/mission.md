# Product Mission

## Problem

Building production-ready APIs requires juggling many concerns at once — authentication, authorization, rate limiting, email notifications, graceful shutdown, CORS, and more. Most tutorials either oversimplify or scatter these patterns across large codebases, making it hard to see how they fit together.

## Target Users

Go developers learning idiomatic API design, and developers building a portfolio to showcase production-grade Go skills to employers or collaborators.

## Solution

Greenlight is a reference implementation of a complete, production-grade JSON API built with Go and PostgreSQL. It demonstrates how real patterns — token auth, RBAC, rate limiting, email, graceful shutdown — compose together in a well-structured, small codebase. Paired with a React/TypeScript frontend and a full Kubernetes + ArgoCD deployment pipeline, it serves as an end-to-end example from API design to production deployment.
