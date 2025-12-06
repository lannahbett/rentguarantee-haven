-- Create messages table for chat functionality
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  match_id UUID NOT NULL REFERENCES public.matches(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  read_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users can view messages in their matches
CREATE POLICY "Users can view messages in their matches"
ON public.messages
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Users can insert messages in their matches
CREATE POLICY "Users can insert messages in their matches"
ON public.messages
FOR INSERT
WITH CHECK (
  auth.uid() = sender_id AND
  EXISTS (
    SELECT 1 FROM public.matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
);

-- Users can update read_at for messages sent to them
CREATE POLICY "Users can mark messages as read"
ON public.messages
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.matches
    WHERE matches.id = messages.match_id
    AND (matches.user1_id = auth.uid() OR matches.user2_id = auth.uid())
  )
  AND sender_id != auth.uid()
);

-- Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Add index for faster queries
CREATE INDEX idx_messages_match_id ON public.messages(match_id);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);