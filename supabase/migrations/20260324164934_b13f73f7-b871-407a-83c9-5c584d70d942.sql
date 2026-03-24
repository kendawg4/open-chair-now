
-- Comments table for posts
CREATE TABLE public.comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public comments viewable" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.comments FOR INSERT
  WITH CHECK (profile_id = get_my_profile_id());
CREATE POLICY "Users can delete own comments" ON public.comments FOR DELETE
  USING (profile_id = get_my_profile_id());

-- Reposts table
CREATE TABLE public.reposts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  profile_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, profile_id)
);

ALTER TABLE public.reposts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public reposts viewable" ON public.reposts FOR SELECT USING (true);
CREATE POLICY "Users can repost" ON public.reposts FOR INSERT
  WITH CHECK (profile_id = get_my_profile_id());
CREATE POLICY "Users can unrepost" ON public.reposts FOR DELETE
  USING (profile_id = get_my_profile_id());

-- Add comment_count and repost_count to posts
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS comment_count integer DEFAULT 0;
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS repost_count integer DEFAULT 0;
