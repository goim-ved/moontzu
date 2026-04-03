-- UNIFIED SAAS SECURITY & ONBOARDING MIGRATION (v4 - Public Visibility)
-- This script ensures all RLS functions, columns, and policies are present and correct.
-- Safe to run multiple times (Idempotent).

-- 0. Schema Maintenance
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN DEFAULT false;
ALTER TABLE public.tenants ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES auth.users(id);

-- 1. Helper Functions (SECURITY DEFINER to avoid RLS Recursion)

-- Check if current user is platform admin (RLS-bypass internal check)
CREATE OR REPLACE FUNCTION public.is_platform_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_platform_admin = true
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get all tenant IDs the current user belongs to
CREATE OR REPLACE FUNCTION public.get_user_tenants()
RETURNS TABLE (tenant_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT tm.tenant_id
    FROM public.tenant_members tm
    WHERE tm.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Check if current user is owner/admin of a specific tenant
CREATE OR REPLACE FUNCTION public.is_tenant_admin(check_tenant_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM public.tenant_members
        WHERE tenant_id = check_tenant_id
        AND user_id = auth.uid()
        AND role IN ('owner', 'admin')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Security Policies for `tenants`
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Platform admins can manage all tenants" ON public.tenants;
CREATE POLICY "Platform admins can manage all tenants"
ON public.tenants
FOR ALL
TO authenticated
USING (is_platform_admin());

DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;
CREATE POLICY "Authenticated users can create tenants"
ON public.tenants
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = created_by OR is_platform_admin());

-- ALL users (including guests) can view tenants
DROP POLICY IF EXISTS "Anyone can view tenants" ON public.tenants;
CREATE POLICY "Anyone can view tenants"
ON public.tenants
FOR SELECT
USING (true);

-- 3. Security Policies for `tenant_members`
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can join tenants as owner" ON public.tenant_members;
CREATE POLICY "Users can join tenants as owner"
ON public.tenant_members
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can view their memberships" ON public.tenant_members;
CREATE POLICY "Users can view their memberships"
ON public.tenant_members
FOR SELECT
TO authenticated
USING (
    user_id = auth.uid() 
    OR is_tenant_admin(tenant_id)
    OR is_platform_admin()
);

-- 4. Security Policies for `profiles`
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Platform admins can view all profiles" ON public.profiles;
CREATE POLICY "Platform admins can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (is_platform_admin());

DROP POLICY IF EXISTS "Users can view profiles of fellow tenant members" ON public.profiles;
CREATE POLICY "Users can view profiles of fellow tenant members"
ON public.profiles
FOR SELECT
TO authenticated
USING (id IN (
    SELECT tm.user_id
    FROM public.tenant_members tm
    WHERE tm.tenant_id IN (SELECT get_user_tenants())
));

-- 5. Security Policies for `services`
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'services') THEN
        ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
        
        DROP POLICY IF EXISTS "Tenant admins can manage services" ON public.services;
        CREATE POLICY "Tenant admins can manage services"
        ON public.services
        FOR ALL
        TO authenticated
        USING (is_tenant_admin(tenant_id))
        WITH CHECK (is_tenant_admin(tenant_id));
        
        DROP POLICY IF EXISTS "Public can view services" ON public.services;
        CREATE POLICY "Public can view services"
        ON public.services
        FOR SELECT
        USING (true); -- Services must be publicly viewable for the booking portal to work
    END IF;
END $$;
