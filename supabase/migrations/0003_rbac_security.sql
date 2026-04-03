-- Role-Based Access Control Migration for Booking Engine

-- 1. Helper function to check if a user is an owner or admin of a tenant
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

-- 2. Secure the `services` table using the new function
DROP POLICY IF EXISTS "Tenant members can manage services" ON public.services;

CREATE POLICY "Tenant admins can manage services"
ON public.services
FOR ALL
USING (is_tenant_admin(tenant_id))
WITH CHECK (is_tenant_admin(tenant_id));

-- 3. Secure the `appointments` table
-- Staff should only see their own appointments or all appointments if they are an admin
DROP POLICY IF EXISTS "Staff can view their appointments" ON public.appointments;

CREATE POLICY "Users can view appointments safely"
ON public.appointments
FOR SELECT
USING (
    -- Any tenant admin can view all appointments
    is_tenant_admin(tenant_id) OR
    -- Regular staff can only view appointments assigned to them
    staff_id = auth.uid() OR
    -- To allow unassigned appointments to be visible to all staff (optional based on your design):
    (staff_id IS NULL AND tenant_id IN (SELECT get_user_tenants()))
);

-- Note: "Public can create appointments" remains active for INSERT.
-- "Tenant members can manage appointments" (UPDATE, DELETE) should be restricted:
DROP POLICY IF EXISTS "Tenant members can manage appointments" ON public.appointments;

CREATE POLICY "Tenant admins can manage all appointments"
ON public.appointments
FOR ALL
USING (is_tenant_admin(tenant_id))
WITH CHECK (is_tenant_admin(tenant_id));

CREATE POLICY "Staff can update their own appointments"
ON public.appointments
FOR UPDATE
USING (staff_id = auth.uid())
WITH CHECK (staff_id = auth.uid());
