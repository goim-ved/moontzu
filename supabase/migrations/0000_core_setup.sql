-- Core Multi-Tenant Schema Setup

-- 1. Create Tables
CREATE TABLE IF NOT EXISTS public.tenants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    avatar_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.tenant_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID NOT NULL REFERENCES public.tenants(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'staff')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(tenant_id, user_id)
);

-- 2. Enable RLS
ALTER TABLE public.tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tenant_members ENABLE ROW LEVEL SECURITY;

-- 3. Utility Function for RLS
-- This function identifies tenants the user belongs to
CREATE OR REPLACE FUNCTION public.get_user_tenants()
RETURNS TABLE (tenant_id UUID) AS $$
BEGIN
    RETURN QUERY
    SELECT tm.tenant_id
    FROM public.tenant_members tm
    WHERE tm.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. RLS Policies

-- Tenants: Users can see tenants they are members of
CREATE POLICY "Users can view tenants they belong to"
ON public.tenants
FOR SELECT
USING (id IN (SELECT get_user_tenants()));

-- Profiles: Users can view their own profile or profiles of members in the same tenant
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can view profiles of fellow tenant members"
ON public.profiles
FOR SELECT
USING (id IN (
    SELECT tm.user_id
    FROM public.tenant_members tm
    WHERE tm.tenant_id IN (SELECT get_user_tenants())
));

-- Tenant Members: Users can view members of tenants they belong to
CREATE POLICY "Users can view members of their tenants"
ON public.tenant_members
FOR SELECT
USING (tenant_id IN (SELECT get_user_tenants()));

-- 5. Trigger for new User Profile
-- This ensures a profile is created when a user signs up via Supabase Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Commented out trigger creation - manual run required or standard Supabase setup
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
