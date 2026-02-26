
-- Clean up duplicate policies from the previous migration
DROP POLICY IF EXISTS "Authenticated users can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Anon users can insert feedback" ON public.feedback;
DROP POLICY IF EXISTS "Only admins can read feedback" ON public.feedback;
DROP POLICY IF EXISTS "Users can insert own likes" ON public.likes;
DROP POLICY IF EXISTS "Users can read own likes" ON public.likes;
DROP POLICY IF EXISTS "Users can read own matches" ON public.matches;
DROP POLICY IF EXISTS "Users can read messages in own matches" ON public.messages;
DROP POLICY IF EXISTS "Users can insert messages in own matches" ON public.messages;
DROP POLICY IF EXISTS "Users can read completed profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
