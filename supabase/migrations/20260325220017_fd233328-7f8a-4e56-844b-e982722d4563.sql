
-- Create trigger function to notify pro on new booking
CREATE OR REPLACE FUNCTION public.notify_pro_new_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  client_name TEXT;
  pro_user_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    -- Get client name
    SELECT COALESCE(display_name, full_name) INTO client_name
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
        'new_booking',
        '📅 New booking request from ' || COALESCE(client_name, 'a client'),
        'You have a new appointment request. Tap to review.',
        NEW.id
      );
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Create the trigger
DROP TRIGGER IF EXISTS on_new_booking_notify ON public.bookings;
CREATE TRIGGER on_new_booking_notify
  AFTER INSERT ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_pro_new_booking();

-- Also re-create the open chair notify trigger (it was a function but trigger was missing)
DROP TRIGGER IF EXISTS on_open_chair_notify ON public.professional_profiles;
CREATE TRIGGER on_open_chair_notify
  AFTER UPDATE ON public.professional_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.notify_followers_open_chair();
