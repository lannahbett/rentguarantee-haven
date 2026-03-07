
-- Fix the overly permissive INSERT policy on matches
-- Only the trigger (SECURITY DEFINER) should create matches, not arbitrary users
DROP POLICY "System can insert matches" ON public.matches;

-- The check_and_create_match function is SECURITY DEFINER so it bypasses RLS
-- No INSERT policy needed for matches - the trigger handles it
