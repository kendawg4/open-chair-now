CREATE OR REPLACE FUNCTION public.notify_pro_new_follower()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  follower_name TEXT;
  pro_user_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get follower name
    SELECT COALESCE(display_name, full_name) INTO follower_name
    FROM profiles WHERE id = NEW.client_profile_id;

    -- Get pro's user_id
    SELECT p.user_id INTO pro_user_id
    FROM profiles p
    JOIN professional_profiles pp ON pp.profile_id = p.id
    WHERE pp.id = NEW.professional_profile_id;

    IF pro_user_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, type, title, body, related_entity_id)
      VALUES (
        pro_user_id,
        'new_follower',
        '👤 ' || COALESCE(follower_name, 'Someone') || ' started following you!',
        'You have a new follower. Check out their profile.',
        NEW.client_profile_id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_new_follow
  AFTER INSERT ON public.follows
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pro_new_follower();