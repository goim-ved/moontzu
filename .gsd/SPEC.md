# SPEC.md — Project Specification

> **Status**: `FINALIZED`

## Vision
A white-labeled, multi-tenant SaaS scheduling and resource-booking system designed to showcase robust SaaS architecture. It enables businesses (like clinics, gyms) to sign up, receive a branded subdomain, manage staff and services, and accept payments.

## Goals
1. Implement a secure multi-tenant architecture using PostgreSQL Row-Level Security (RLS).
2. Establish a sophisticated Auth & Security model featuring Role-Based Access Control (RBAC) and SSO.
3. Build complex monetization capabilities including multi-party payment routing via Stripe Connect.
4. Deliver a robust booking system handling appointments involving staff members and basic resource allocation.

## Non-Goals (Out of Scope)
- Highly complex resource scheduling (e.g., intricate room dependencies, multi-resource conflicts).
- Mobile App versions (iOS/Android native).
- Schema-per-tenant architecture (RLS is chosen for efficiency and showcase purposes).

## Users
1. **Platform Admins**: Manage the overarching SaaS platform, monitor tenant health, and manage global settings.
2. **Tenant Owners (Businesses)**: Configure their branded booking domains, manage staff, services, and view their revenues.
3. **Tenant Staff**: Manage their individual availability and view their upcoming appointments.
4. **End Customers**: Clients of the businesses who book appointments and make payments.

## Constraints
- **Technical constraints**: Must efficiently host on Vercel leveraging Subdomain routing (Next.js Middleware). Must use Next.js for high performance and efficiency.
- **Architectural constraints**: Must prioritize database efficiency and rapid robust development while not compromising enterprise-grade qualities.

## Success Criteria
- [ ] Users can register a tenant account and automatically receive a working subdomain route.
- [ ] Tenant Owners can invite Staff with specific roles (Admin vs. Staff RBAC).
- [ ] End customers can successfully complete a booking flow under a specific tenant's subdomain.
- [ ] RLS policies securely prevent Data Leaks across tenants even under identical API routes.
- [ ] Stripe Connect correctly splits payments between the platform and the tenant.
