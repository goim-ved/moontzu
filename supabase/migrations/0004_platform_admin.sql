-- 1. Add platform admin flag to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_platform_admin BOOLEAN DEFAULT false;

-- 2. Allow platform admins to view ALL tenants
DROP POLICY IF EXISTS "Platform admins can view all tenants" ON public.tenants;
CREATE POLICY "Platform admins can view all tenants"
ON public.tenants
FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_platform_admin = true
    )
    OR id IN (SELECT get_user_tenants())
);

-- 3. Allow platform admins to manage ALL tenants
CREATE POLICY "Platform admins can manage all tenants"
ON public.tenants
FOR ALL
USING (
    EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() AND is_platform_admin = true
    )
);
