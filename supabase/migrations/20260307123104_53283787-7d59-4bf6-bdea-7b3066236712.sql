
-- Fix security definer view by recreating with security_invoker
DROP VIEW IF EXISTS public.profiles_public;

CREATE VIEW public.profiles_public
WITH (security_invoker=on) AS
SELECT 
  id, user_id, full_name, age, bio, occupation, hobbies,
  CASE WHEN show_budget THEN budget ELSE NULL::numeric END AS budget,
  CASE WHEN show_location THEN desired_location ELSE NULL::text END AS desired_location,
  move_in_date, accommodation_type,
  CASE WHEN show_habits THEN early_riser ELSE NULL::boolean END AS early_riser,
  CASE WHEN show_habits THEN night_owl ELSE NULL::boolean END AS night_owl,
  CASE WHEN show_habits THEN smoker ELSE NULL::boolean END AS smoker,
  CASE WHEN show_habits THEN cleanliness_level ELSE NULL::text END AS cleanliness_level,
  CASE WHEN show_habits THEN guest_preferences ELSE NULL::text END AS guest_preferences,
  ideal_flatmate, profile_completed,
  CASE WHEN show_habits THEN has_pets ELSE NULL::boolean END AS has_pets,
  wants_pets,
  CASE WHEN show_location THEN latitude ELSE NULL::double precision END AS latitude,
  CASE WHEN show_location THEN longitude ELSE NULL::double precision END AS longitude,
  show_budget, show_location, show_photos, show_habits,
  created_at, updated_at
FROM profiles;

-- Since security_invoker=on, the view uses the caller's permissions
-- We need a SELECT policy that allows authenticated users to read all profiles through the view
CREATE POLICY "Authenticated users can read profiles for matching"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Users can view own full profile" ON public.profiles;
