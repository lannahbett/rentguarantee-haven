-- Create likes table for storing user likes
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  liker_id UUID NOT NULL,
  liked_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(liker_id, liked_id)
);

-- Create matches table for mutual likes
CREATE TABLE public.matches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user1_id UUID NOT NULL,
  user2_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user1_id, user2_id)
);

-- Create discovery_settings table for user preferences
CREATE TABLE public.discovery_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  max_distance INT DEFAULT 25,
  min_budget NUMERIC DEFAULT 0,
  max_budget NUMERIC DEFAULT 5000,
  sleep_schedule TEXT DEFAULT 'any',
  cleanliness_min INT DEFAULT 1,
  cleanliness_max INT DEFAULT 5,
  smoking_preference TEXT DEFAULT 'any',
  pet_preference TEXT DEFAULT 'any',
  guest_policy TEXT[] DEFAULT ARRAY[]::TEXT[],
  interests TEXT[] DEFAULT ARRAY[]::TEXT[],
  accommodation_types TEXT[] DEFAULT ARRAY['apartment', 'house', 'room']::TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.discovery_settings ENABLE ROW LEVEL SECURITY;

-- Likes policies
CREATE POLICY "Users can view their own likes" ON public.likes FOR SELECT USING (auth.uid() = liker_id);
CREATE POLICY "Users can insert their own likes" ON public.likes FOR INSERT WITH CHECK (auth.uid() = liker_id);
CREATE POLICY "Users can delete their own likes" ON public.likes FOR DELETE USING (auth.uid() = liker_id);

-- Matches policies (both users can see their matches)
CREATE POLICY "Users can view their matches" ON public.matches FOR SELECT USING (auth.uid() = user1_id OR auth.uid() = user2_id);

-- Discovery settings policies
CREATE POLICY "Users can view their own settings" ON public.discovery_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own settings" ON public.discovery_settings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own settings" ON public.discovery_settings FOR UPDATE USING (auth.uid() = user_id);

-- Add pets column to profiles if not exists
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_pets BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wants_pets BOOLEAN DEFAULT false;

-- Trigger for updated_at on discovery_settings
CREATE TRIGGER update_discovery_settings_updated_at
BEFORE UPDATE ON public.discovery_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Function to check and create match when mutual like happens
CREATE OR REPLACE FUNCTION public.check_and_create_match()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Check if the liked user has also liked this user
  IF EXISTS (
    SELECT 1 FROM public.likes 
    WHERE liker_id = NEW.liked_id 
    AND liked_id = NEW.liker_id
  ) THEN
    -- Create a match (always store smaller id first for uniqueness)
    INSERT INTO public.matches (user1_id, user2_id)
    VALUES (
      LEAST(NEW.liker_id, NEW.liked_id),
      GREATEST(NEW.liker_id, NEW.liked_id)
    )
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

-- Trigger to check for matches on new likes
CREATE TRIGGER check_match_on_like
AFTER INSERT ON public.likes
FOR EACH ROW
EXECUTE FUNCTION public.check_and_create_match();