-- Add privacy toggle columns and lat/lng to profiles table
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS show_budget boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_location boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_photos boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS show_habits boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS latitude double precision DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS longitude double precision DEFAULT NULL;

-- Recreate profiles_public view to include new columns but respect privacy
DROP VIEW IF EXISTS public.profiles_public;
CREATE VIEW public.profiles_public AS
SELECT
  id,
  user_id,
  full_name,
  age,
  bio,
  occupation,
  hobbies,
  CASE WHEN show_budget THEN budget ELSE NULL END AS budget,
  CASE WHEN show_location THEN desired_location ELSE NULL END AS desired_location,
  move_in_date,
  accommodation_type,
  CASE WHEN show_habits THEN early_riser ELSE NULL END AS early_riser,
  CASE WHEN show_habits THEN night_owl ELSE NULL END AS night_owl,
  CASE WHEN show_habits THEN smoker ELSE NULL END AS smoker,
  CASE WHEN show_habits THEN cleanliness_level ELSE NULL END AS cleanliness_level,
  CASE WHEN show_habits THEN guest_preferences ELSE NULL END AS guest_preferences,
  ideal_flatmate,
  profile_completed,
  CASE WHEN show_habits THEN has_pets ELSE NULL END AS has_pets,
  wants_pets,
  CASE WHEN show_location THEN latitude ELSE NULL END AS latitude,
  CASE WHEN show_location THEN longitude ELSE NULL END AS longitude,
  show_budget,
  show_location,
  show_photos,
  show_habits,
  created_at,
  updated_at
FROM public.profiles;