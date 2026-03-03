# Product Roadmap

# Phase 1: MVP (Limited Access Only)

Goal: Deliver Limited Access Developer Portal (as per initial scope).

## 1. Identity & Access (Core)

- [x] Implement registration flow `POST /auth/register` (org + first ORG_LEAD user) with blocked-email-domain check. AC: New org + user created; blocked domains rejected with a clear error.
