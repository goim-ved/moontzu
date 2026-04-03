# ROADMAP.md

> **Current Phase**: ✅ Complete
> **Milestone**: v1.0 (delivered)

## Must-Haves (from SPEC)
- [x] Multi-tenant isolation using Postgres RLS.
- [x] Subdomain routing on Vercel via Middleware.
- [x] RBAC for Tenant Owners and Staff.
- [x] Stripe Connect integration for payments.
- [x] Core Booking Engine (Staff + Service).

## Phases

### Phase 1: Foundation & Auth
**Status**: ✅ Complete
**Objective**: Setup Next.js, database schema (Supabase/Postgres), RLS multi-tenancy, and overarching Auth (including SSO).
**Requirements**: REQ-01, REQ-02

### Phase 2: Tenant Routing & Branding
**Status**: ✅ Complete
**Objective**: Implement Vercel subdomain middleware, tenant settings, and branded public-facing landing pages.
**Requirements**: REQ-03

### Phase 3: Core Booking Engine & RBAC
**Status**: ✅ Complete
**Objective**: Build the staff management (RBAC), service definition, availability logic, and the customer booking workflow.
**Requirements**: REQ-04, REQ-05

### Phase 4: Monetization (Stripe Connect)
**Status**: ✅ Complete
**Objective**: Integrate Stripe Connect for multi-party payouts and implement the checkout flow.
**Requirements**: REQ-06

### Phase 5: Polish & Launch
**Status**: ✅ Complete
**Objective**: Finalize UI details, run overarching E2E testing, ensure Vercel deployment stability, and write the final documentation.
