-- Booking Engine Schema Setup

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    duration_minutes INTEGER NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.staff_availability (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, user_id, day_of_week)
);

CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    staff_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable RLS
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies

-- Services: 
-- Anyone can view services for a tenant (public booking)
CREATE POLICY "Public can view services"
ON public.services
FOR SELECT
USING (true);

-- Internal members can manage services
CREATE POLICY "Tenant members can manage services"
ON public.services
FOR ALL
USING (tenant_id IN (SELECT get_user_tenants()))
WITH CHECK (tenant_id IN (SELECT get_user_tenants()));

-- Staff Availability:
-- Public can view availability to book
CREATE POLICY "Public can view staff availability"
ON public.staff_availability
FOR SELECT
USING (true);

-- Internal members can manage their own availability
CREATE POLICY "Staff can manage their own availability"
ON public.staff_availability
FOR ALL
USING (user_id = auth.uid() AND tenant_id IN (SELECT get_user_tenants()))
WITH CHECK (user_id = auth.uid() AND tenant_id IN (SELECT get_user_tenants()));

-- Appointments:
-- Public can create appointments
CREATE POLICY "Public can create appointments"
ON public.appointments
FOR INSERT
WITH CHECK (true);

-- Users can view appointments they are a staff of OR they are tenant admin/owner
CREATE POLICY "Staff can view their appointments"
ON public.appointments
FOR SELECT
USING (
    staff_id = auth.uid() OR 
    tenant_id IN (SELECT get_user_tenants())
);

-- Tenant admins/owners can manage appointments
CREATE POLICY "Tenant members can manage appointments"
ON public.appointments
FOR ALL
USING (tenant_id IN (SELECT get_user_tenants()))
WITH CHECK (tenant_id IN (SELECT get_user_tenants()));
