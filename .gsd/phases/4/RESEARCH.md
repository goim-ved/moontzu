# Phase 4 Research: Stripe Connect Monetization

## Context
Integrating Stripe Connect Standard/Express for multi-tenant SaaS.

## Options Analyzed

1. **Stripe Connect Standard Accounts**
   - Tenant brings their own Stripe account.
   - We use OAuth flow (`client_id`).
   - Setup: Easier for SaaS if tenant already has Stripe.

2. **Stripe Connect Express / Custom Accounts**
   - We onboard them using `stripe.accountLinks.create`.
   - Setup: We act as the platform, managing payouts, controlling the flow tighter.

Wait, looking at modern Stripe SaaS patterns, **Connect Standard/Express** using the newer Stripe Connect Onboarding API is preferred. We will use the standard `stripe` npm package.

## Database Additions needed
- `stripe_account_id` (TEXT) in `tenants`.

## Implementation Strategy
1. **Schema**: Add `stripe_account_id` to `public.tenants` via migration `0002_stripe_schema.sql`.
2. **Dashboard Config**: Simple page for tenant owners to generate the Stripe Connect onboarding link.
3. **Checkout Flow**: In the public booking page, user fills form -> click 'Confirm Appointment' -> server creates Stripe Checkout Session (using `stripeAccount: tenant.stripe_account_id` parameter) -> redirects to Stripe Checkout -> on success, returns to our success page and records `appointment`.

## Conclusion
We will proceed with Stripe API using the `stripe` package, generating a Connect Onboarding session, and updating checkout to redirect to Stripe. MVP will use Stripe Checkout with Destination Charges or direct API routing.
