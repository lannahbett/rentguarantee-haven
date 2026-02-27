
-- Fix security definer view by setting it to security invoker
ALTER VIEW public.profiles_public SET (security_invoker = on);
