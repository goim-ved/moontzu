# CloudBooking | Multi-Tenant SaaS MVP 🚀

A robust, enterprise-ready multi-tenant scheduling and resource-booking platform built with **Next.js 15+**, **Supabase**, and **Stripe Connect**.

## 🏗️ Architecture Highlights

### 1. Multi-Tenancy (Data Isolation)
- **Strategy**: Shared Database Schema with **PostgreSQL Row-Level Security (RLS)**.
- **Security**: Every query is filtered by `tenant_id` at the database level using a custom `get_user_tenants()` function, ensuring peak security and absolute data privacy between clients.

### 2. Dynamic White-Labeling (Subdomain Routing)
- **Routing**: Next.js Middleware intercepts requests to extract subdomains (e.g., `acme.localhost:3000`).
- **Branding**: Requests are dynamically rewritten to `/[domain]` routes, fetching tenant-specific colors, names, and services based on the URL context.

### 3. Monetization (Stripe Connect)
- **Multi-party Payouts**: Integrated **Stripe Connect** to allow tenant owners to onboard their own Stripe accounts.
- **Destination Charges**: Platform fee of 10% is automatically deducted, with the remaining balance routed directly to the merchant's connected account.
- **Secure Checkout**: Dynamic Stripe Checkout sessions generated per booking.

## 🛠️ Technology Stack

- **Framework**: Next.js 15+ (App Router, Turbopack)
- **Database/Auth**: Supabase (PostgreSQL, SSR Auth, RLS)
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Payments**: Stripe SDK (Connect, Checkout)
- **Deployment**: Vercel ready (Middleware rewriting, Server Actions)

## 🚀 Key Features

- ✅ **Secure Onboarding**: Automated tenant creation and owner assignment.
- ✅ **RBAC Dashboard**: Role-based access for staff to manage their services and schedules.
- ✅ **Core Booking Engine**: Flexible service definitions, availability logic, and appointment lifecycle.
- ✅ **Client-Facing Portals**: Performance-optimized, SEO-ready landing pages with seamless booking flows.

## ⚙️ Setup & Local Development

### 1. Initialize Supabase
Ensure you have the Supabase CLI installed. Run migrations to setup the schema and RLS:
```bash
supabase migration up
```

### 2. Environment Variables
Create a `.env.local` file with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

### 3. Install & Run
```bash
npm install
npm run dev
```

---
*Built as a Showcase Project for Advanced SaaS Architecture.*
