
-- 1. Input validation: Add CHECK constraints for text length
ALTER TABLE public.feedback ADD CONSTRAINT feedback_comment_length CHECK (length(comment) <= 1000);
ALTER TABLE public.concerns ADD CONSTRAINT concerns_description_length CHECK (length(description) <= 2000);
ALTER TABLE public.profiles ADD CONSTRAINT profiles_bio_length CHECK (length(bio) <= 500);

-- 2. Fix SECURITY DEFINER function with auth check
CREATE OR REPLACE FUNCTION public.check_and_create_match()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
BEGIN
  -- Verify the trigger caller owns the like
  IF auth.uid() IS NULL OR auth.uid() != NEW.liker_id THEN
    RAISE EXCEPTION 'Unauthorized like creation';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) THEN
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id)
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$function$;

-- 3. Fix profile data exposure: replace open SELECT with restricted policies
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;

-- Own profile: full access
CREATE POLICY "Users can view own full profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);
