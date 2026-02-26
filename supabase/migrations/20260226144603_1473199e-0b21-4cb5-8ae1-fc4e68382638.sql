
CREATE TABLE public.concerns (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  category TEXT NOT NULL DEFAULT 'general',
  description TEXT NOT NULL,
  page_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.concerns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can insert concerns" ON public.concerns
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own concerns" ON public.concerns
  FOR SELECT USING (auth.uid() = user_id);
