-- 1. Add is_pinned to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned boolean DEFAULT false;

-- 2. Create conversations table
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_one uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  participant_two uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  last_message_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(participant_one, participant_two)
);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations" ON public.conversations
  FOR SELECT TO authenticated
  USING (participant_one = get_my_profile_id() OR participant_two = get_my_profile_id());

CREATE POLICY "Users can create conversations" ON public.conversations
  FOR INSERT TO authenticated
  WITH CHECK (participant_one = get_my_profile_id() OR participant_two = get_my_profile_id());

CREATE POLICY "Users can update own conversations" ON public.conversations
  FOR UPDATE TO authenticated
  USING (participant_one = get_my_profile_id() OR participant_two = get_my_profile_id());

-- 3. Create messages table
CREATE TABLE public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
  sender_profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in own conversations" ON public.messages
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = get_my_profile_id() OR c.participant_two = get_my_profile_id())
    )
  );

CREATE POLICY "Users can send messages in own conversations" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (
    sender_profile_id = get_my_profile_id()
    AND EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = get_my_profile_id() OR c.participant_two = get_my_profile_id())
    )
  );

CREATE POLICY "Users can update own messages" ON public.messages
  FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = conversation_id
      AND (c.participant_one = get_my_profile_id() OR c.participant_two = get_my_profile_id())
    )
  );

-- 4. Enable realtime for messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.conversations;

-- 5. Create function to notify followers on open chair
CREATE OR REPLACE FUNCTION public.notify_followers_open_chair()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
DECLARE
  follower_record RECORD;
  pro_name TEXT;
BEGIN
  IF NEW.status = 'open-chair' AND (OLD.status IS NULL OR OLD.status != 'open-chair') THEN
    SELECT COALESCE(p.display_name, p.full_name) INTO pro_name
    FROM profiles p
    JOIN professional_profiles pp ON pp.profile_id = p.id
    WHERE pp.id = NEW.id;

    FOR follower_record IN
      SELECT f.client_profile_id, p.user_id
      FROM follows f
      JOIN profiles p ON p.id = f.client_profile_id
      WHERE f.professional_profile_id = NEW.id
    LOOP
      INSERT INTO notifications (user_id, type, title, body, related_entity_id)
      VALUES (
        follower_record.user_id,
        'open_chair',
        '🪑 ' || COALESCE(pro_name, 'A pro') || ' is available now!',
        'They just opened their chair. Book before it fills up!',
        NEW.id
      );
    END LOOP;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_pro_status_open_chair
  AFTER UPDATE OF status ON public.professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_followers_open_chair();