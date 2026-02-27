
-- Create a public view excluding email for browsing other profiles
CREATE VIEW public.profiles_public AS
SELECT id, user_id, full_name, age, bio, occupation, hobbies, budget,
       desired_location, move_in_date, accommodation_type, early_riser,
       night_owl, smoker, cleanliness_level, guest_preferences, ideal_flatmate,
       profile_completed, has_pets, wants_pets, created_at, updated_at
FROM public.profiles;

-- Grant access to the view
GRANT SELECT ON public.profiles_public TO authenticated;
