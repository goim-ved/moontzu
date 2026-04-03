---
phase: 6
plan: 1
wave: 1
---

# Plan 6.1: Global Design System & Landing Page Refinement

## Objective
Establish a clean, sleek, minimal, and modern experience across the platform, standardizing on Shadcn UI components and rigorous grid/spacing metrics.

## Context
- .gsd/SPEC.md
- src/app/globals.css
- src/app/page.tsx

## Tasks

<task type="auto">
  <name>Standardize Global Primitives</name>
  <files>src/app/globals.css</files>
  <action>
    - Refine `--background` to a deep premium black (like `#000000` or `#0a0a0a`) and ensure `--foreground` is highly readable but not blindingly white (e.g. `zinc-200`).
    - Remove overly flashy neon gradients if any.
  </action>
  <verify>npm run lint or npx tsc --noEmit</verify>
  <done>CSS variables reflect a sleek minimalist dark theme</done>
</task>

<task type="auto">
  <name>Redesign Landing Page Hero & Feature Grid</name>
  <files>src/app/page.tsx</files>
  <action>
    - Remove the `bg-blue-500/10 blur-[120px]` and neon styles.
    - Standardize font sizing, replace generic buttons with Shadcn `Button` components.
    - Polish the Feature grid so cards use standard `border-white/10` and unified typography.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Landing page is fully migrated to use minimal UI constraints and Shadcn components</done>
</task>

## Success Criteria
- [ ] Landing page feels visually premium (Vercel-tier minimal).
- [ ] No glaringly bright gradients remain.

---
phase: 6
plan: 2
wave: 2
---

# Plan 6.2: Finalize Core Workflows (Auth & Booking)

## Objective
Migrate the isolated workflows to match the premium aesthetic.

## Context
- src/app/login/page.tsx
- src/app/onboarding/page.tsx
- src/app/[domain]/book/page.tsx

## Tasks

<task type="auto">
  <name>Modernize Auth & Onboarding Flow</name>
  <files>
    - src/app/login/page.tsx
    - src/app/onboarding/page.tsx
  </files>
  <action>
    - Implement Shadcn `Card`, `Input`, `Label` primitives.
    - Ensure inputs have unified padding and sophisticated focus states (e.g., `focus-visible:ring-1 focus-visible:ring-white/30`).
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>Auth pages are rendered inside elegant, centralized card wrappers.</done>
</task>

<task type="auto">
  <name>Polish Tenant Booking Portal</name>
  <files>src/app/[domain]/book/page.tsx</files>
  <action>
    - Radically simplify the checkout/booking form. 
    - Ensure the service selection and Stripe inputs feel frictionless. 
    - Use the Shadcn form pattern.
  </action>
  <verify>npx tsc --noEmit</verify>
  <done>The end-user booking portal is ultra-minimal and high-converting.</done>
</task>

## Success Criteria
- [ ] All remaining forms in the application use strict Shadcn standardized classes.
