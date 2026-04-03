# MoonTzu | Multi-Tenant Scheduling Platform 🚀

A robust, enterprise-ready multi-tenant scheduling and resource-booking platform built with **Next.js 16+**, **Supabase**, and **Stripe Connect**.

## 🏗️ Architecture Highlights

### 1. Multi-Tenancy (Data Isolation)
- **Strategy**: Shared Database Schema with **PostgreSQL Row-Level Security (RLS)**.
- **Security**: Every query is filtered by `tenant_id` at the database level using a custom `get_user_tenants()` function, ensuring peak security and absolute data privacy between clients.

### 2. Dynamic White-Labeling (Subdomain Routing)
- **Routing**: Next.js **Proxy** (`src/proxy.ts`) intercepts requests to extract subdomains (e.g., `acme.localhost:3000`).
- **Branding**: Requests are dynamically rewritten to `/[domain]` routes, fetching tenant-specific colors, names, and services based on the URL context.

### 3. Monetization (Stripe Connect)
- **Multi-party Payouts**: Integrated **Stripe Connect** to allow tenant owners to onboard their own Stripe accounts.
- **Destination Charges**: Platform fee of 10% is automatically deducted, with the remaining balance routed directly to the merchant's connected account.
- **Secure Checkout**: Dynamic Stripe Checkout sessions generated per booking.

## 🛠️ Technology Stack

- **Framework**: Next.js 16+ (App Router, Turbopack, Proxy)
- **Database/Auth**: Supabase (PostgreSQL, SSR Auth, RLS)
- **Styling**: Tailwind CSS v4, Shadcn UI
- **Payments**: Stripe SDK (Connect, Checkout)
- **Deployment**: Vercel ready (Proxy rewriting, Server Actions)

## 🚀 Key Features

- ✅ **Secure Onboarding**: Automated tenant creation and owner assignment.
- ✅ **RBAC Dashboard**: Role-based access for staff to manage their services and schedules.
- ✅ **Core Booking Engine**: Flexible service definitions, availability logic, and appointment lifecycle.
- ✅ **Client-Facing Portals**: Performance-optimized, SEO-ready landing pages with seamless booking flows.

## ⚙️ Setup & Local Development

### 1. Initialize Supabase
You can initialize the database using the manual SQL method or the Supabase CLI:

**Manual Method:**
1. Create a new project in the [Supabase Dashboard](https://supabase.com/dashboard).
2. Content of the `supabase/migrations/` files should be pasted and run in the **SQL Editor**.

**CLI Method:**
```bash
supabase login
supabase link --project-ref your-project-id
supabase db push
```

### 2. Environment Variables
Create a `.env.local` file with the following keys:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

### 3. Install & Run
```bash
npm install
npm run dev
```

---
*Built as a Showcase Project for Advanced SaaS Architecture.*
