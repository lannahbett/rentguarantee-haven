
-- Disable the trigger temporarily to insert test likes
ALTER TABLE public.likes DISABLE TRIGGER check_match_on_like;

-- Insert reciprocal likes from test profiles toward real users
INSERT INTO public.likes (liker_id, liked_id) VALUES
  ('a1111111-1111-1111-1111-111111111111', '477d544b-f740-4747-931a-f825b046f9c6'),
  ('a2222222-2222-2222-2222-222222222222', '477d544b-f740-4747-931a-f825b046f9c6'),
  ('a3333333-3333-3333-3333-333333333333', '477d544b-f740-4747-931a-f825b046f9c6'),
  ('a4444444-4444-4444-4444-444444444444', '477d544b-f740-4747-931a-f825b046f9c6'),
  ('a5555555-5555-5555-5555-555555555555', '477d544b-f740-4747-931a-f825b046f9c6'),
  ('a1111111-1111-1111-1111-111111111111', '829d0fd3-3777-488f-87db-8c2930b45d10'),
  ('a2222222-2222-2222-2222-222222222222', '829d0fd3-3777-488f-87db-8c2930b45d10'),
  ('a3333333-3333-3333-3333-333333333333', '829d0fd3-3777-488f-87db-8c2930b45d10'),
  ('a1111111-1111-1111-1111-111111111111', '3447a823-1a7f-4053-bc58-ba1568630cdd'),
  ('a2222222-2222-2222-2222-222222222222', '3447a823-1a7f-4053-bc58-ba1568630cdd')
ON CONFLICT DO NOTHING;

-- Re-enable the trigger
ALTER TABLE public.likes ENABLE TRIGGER check_match_on_like;

-- Insert test matches directly
INSERT INTO public.matches (user1_id, user2_id) VALUES
  ('477d544b-f740-4747-931a-f825b046f9c6', 'a1111111-1111-1111-1111-111111111111'),
  ('477d544b-f740-4747-931a-f825b046f9c6', 'a2222222-2222-2222-2222-222222222222'),
  ('477d544b-f740-4747-931a-f825b046f9c6', 'a3333333-3333-3333-3333-333333333333')
ON CONFLICT DO NOTHING;

-- Add DELETE policy on matches so users can unmatch
CREATE POLICY "Users can delete their matches"
ON public.matches FOR DELETE
TO authenticated
USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Add INSERT policy on matches (needed for the trigger to work properly)
CREATE POLICY "System can insert matches"
ON public.matches FOR INSERT
TO authenticated
WITH CHECK (true);
