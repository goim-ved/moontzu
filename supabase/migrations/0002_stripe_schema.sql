-- Stripe Connect Integration Schema

-- Add stripe_account_id to tenants for mapping connected accounts
ALTER TABLE public.tenants 
ADD COLUMN stripe_account_id TEXT;

-- Update RLS if necessary (already covers tenants for members)
-- No changes needed to policies as they genericly allow tenant members to view tenant data
