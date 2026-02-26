
-- Fix: feedback needs an insert policy for authenticated users
CREATE POLICY "Authenticated users can insert feedback" ON public.feedback
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix: tighten concerns insert to authenticated users
DROP POLICY "Users can insert concerns" ON public.concerns;
CREATE POLICY "Authenticated users can insert concerns" ON public.concerns
  FOR INSERT WITH CHECK (auth.uid() = user_id);
