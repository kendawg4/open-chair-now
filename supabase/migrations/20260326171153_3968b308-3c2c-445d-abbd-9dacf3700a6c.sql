
ALTER TABLE public.post_likes ADD CONSTRAINT post_likes_post_profile_unique UNIQUE (post_id, profile_id);
ALTER TABLE public.reposts ADD CONSTRAINT reposts_post_profile_unique UNIQUE (post_id, profile_id);
