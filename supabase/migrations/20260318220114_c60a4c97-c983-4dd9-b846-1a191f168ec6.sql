
-- =============================================================
-- OpenChair MVP: Full Database Schema
-- =============================================================

-- 1. ENUMS
CREATE TYPE public.app_role AS ENUM ('client', 'professional', 'shop_owner', 'admin');
CREATE TYPE public.availability_status AS ENUM ('open-chair', 'available-now', 'last-minute', 'appointment-only', 'busy', 'offline');
CREATE TYPE public.booking_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show', 'declined');
CREATE TYPE public.professional_category AS ENUM ('barber', 'hairstylist', 'braider', 'loc-specialist', 'nail-tech', 'esthetician', 'lash-tech', 'makeup-artist', 'tattoo-artist', 'piercer');
CREATE TYPE public.business_type AS ENUM ('independent', 'booth-renter', 'shop-employee', 'shop-owner');
CREATE TYPE public.post_type AS ENUM ('portfolio', 'promotion', 'opening', 'update');
CREATE TYPE public.report_status AS ENUM ('pending', 'reviewed', 'resolved', 'dismissed');

-- 2. UPDATED_AT TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3. PROFILES TABLE
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  display_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  bio TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4. USER_ROLES TABLE
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS app_role
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT role FROM public.user_roles WHERE user_id = _user_id LIMIT 1
$$;

-- 5. PROFESSIONAL_PROFILES TABLE
CREATE TABLE public.professional_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  business_name TEXT,
  category professional_category NOT NULL DEFAULT 'barber',
  business_type business_type NOT NULL DEFAULT 'independent',
  specialties TEXT[] DEFAULT '{}',
  years_experience INTEGER DEFAULT 0,
  shop_name TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  service_radius_miles INTEGER DEFAULT 10,
  instagram_url TEXT,
  tiktok_url TEXT,
  website_url TEXT,
  is_mobile_service BOOLEAN DEFAULT false,
  accepts_walk_ins BOOLEAN DEFAULT true,
  is_verified BOOLEAN DEFAULT false,
  is_suspended BOOLEAN DEFAULT false,
  onboarding_completed BOOLEAN DEFAULT false,
  average_rating NUMERIC(3,2) DEFAULT 0,
  total_reviews INTEGER DEFAULT 0,
  follower_count INTEGER DEFAULT 0,
  status availability_status NOT NULL DEFAULT 'offline',
  status_note TEXT,
  status_promo TEXT,
  status_expires_at TIMESTAMPTZ,
  languages TEXT[] DEFAULT '{English}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.professional_profiles ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_professional_profiles_updated_at BEFORE UPDATE ON public.professional_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_professional_profiles_status ON public.professional_profiles(status);
CREATE INDEX idx_professional_profiles_category ON public.professional_profiles(category);
CREATE INDEX idx_professional_profiles_city ON public.professional_profiles(city);

-- 6. SERVICES TABLE
CREATE TABLE public.services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  service_name TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  category TEXT,
  is_active BOOLEAN DEFAULT true,
  instant_book BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 7. PORTFOLIO_ITEMS TABLE
CREATE TABLE public.portfolio_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  media_type TEXT DEFAULT 'image',
  caption TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;

-- 8. AVAILABILITY_STATUS_HISTORY
CREATE TABLE public.availability_status_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  status availability_status NOT NULL,
  note TEXT,
  promo_text TEXT,
  discount_percent INTEGER,
  starts_at TIMESTAMPTZ DEFAULT now(),
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.availability_status_history ENABLE ROW LEVEL SECURITY;

-- 9. BOOKINGS TABLE
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME,
  notes TEXT,
  total_price_estimate NUMERIC(10,2),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 10. REVIEWS TABLE
CREATE TABLE public.reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID NOT NULL UNIQUE REFERENCES public.bookings(id) ON DELETE CASCADE,
  client_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- 11. FAVORITES TABLE
CREATE TABLE public.favorites (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_profile_id, professional_profile_id)
);
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- 12. FOLLOWS TABLE
CREATE TABLE public.follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(client_profile_id, professional_profile_id)
);
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;

-- 13. POSTS TABLE
CREATE TABLE public.posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  professional_profile_id UUID NOT NULL REFERENCES public.professional_profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  post_type post_type NOT NULL DEFAULT 'update',
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- 14. POST_LIKES TABLE
CREATE TABLE public.post_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.posts(id) ON DELETE CASCADE,
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(post_id, profile_id)
);
ALTER TABLE public.post_likes ENABLE ROW LEVEL SECURITY;

-- 15. NOTIFICATIONS TABLE
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  is_read BOOLEAN DEFAULT false,
  related_entity_id UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 16. REPORTS TABLE
CREATE TABLE public.reports (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  notes TEXT,
  status report_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 17. ADMIN_ACTIONS TABLE
CREATE TABLE public.admin_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  target_table TEXT,
  target_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_actions ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- RLS POLICIES
-- =============================================================

-- Helper: get profile_id for current user
CREATE OR REPLACE FUNCTION public.get_my_profile_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT id FROM public.profiles WHERE user_id = auth.uid()
$$;

-- Helper: get professional_profile_id for current user
CREATE OR REPLACE FUNCTION public.get_my_pro_profile_id()
RETURNS UUID
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT pp.id FROM public.professional_profiles pp
  JOIN public.profiles p ON p.id = pp.profile_id
  WHERE p.user_id = auth.uid()
$$;

-- PROFILES
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- USER_ROLES
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own role" ON public.user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- PROFESSIONAL_PROFILES
CREATE POLICY "Public pro profiles viewable" ON public.professional_profiles FOR SELECT USING (is_suspended = false);
CREATE POLICY "Admins can view all pro profiles" ON public.professional_profiles FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Pros can insert own pro profile" ON public.professional_profiles FOR INSERT WITH CHECK (profile_id = public.get_my_profile_id());
CREATE POLICY "Pros can update own pro profile" ON public.professional_profiles FOR UPDATE USING (profile_id = public.get_my_profile_id());

-- SERVICES
CREATE POLICY "Public services viewable" ON public.services FOR SELECT USING (is_active = true);
CREATE POLICY "Pros can manage own services INSERT" ON public.services FOR INSERT WITH CHECK (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can manage own services UPDATE" ON public.services FOR UPDATE USING (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can manage own services DELETE" ON public.services FOR DELETE USING (professional_profile_id = public.get_my_pro_profile_id());

-- PORTFOLIO_ITEMS
CREATE POLICY "Public portfolio viewable" ON public.portfolio_items FOR SELECT USING (true);
CREATE POLICY "Pros can insert own portfolio" ON public.portfolio_items FOR INSERT WITH CHECK (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can update own portfolio" ON public.portfolio_items FOR UPDATE USING (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can delete own portfolio" ON public.portfolio_items FOR DELETE USING (professional_profile_id = public.get_my_pro_profile_id());

-- AVAILABILITY_STATUS_HISTORY
CREATE POLICY "Public status history viewable" ON public.availability_status_history FOR SELECT USING (true);
CREATE POLICY "Pros can insert own status" ON public.availability_status_history FOR INSERT WITH CHECK (professional_profile_id = public.get_my_pro_profile_id());

-- BOOKINGS
CREATE POLICY "Clients can view own bookings" ON public.bookings FOR SELECT USING (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Pros can view their bookings" ON public.bookings FOR SELECT USING (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Clients can create bookings" ON public.bookings FOR INSERT WITH CHECK (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Clients can update own bookings" ON public.bookings FOR UPDATE USING (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Pros can update their bookings" ON public.bookings FOR UPDATE USING (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Admins can view all bookings" ON public.bookings FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- REVIEWS
CREATE POLICY "Public reviews viewable" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Clients can create reviews" ON public.reviews FOR INSERT WITH CHECK (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Admins can delete reviews" ON public.reviews FOR DELETE USING (public.has_role(auth.uid(), 'admin'));

-- FAVORITES
CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Users can manage favorites" ON public.favorites FOR INSERT WITH CHECK (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Users can delete favorites" ON public.favorites FOR DELETE USING (client_profile_id = public.get_my_profile_id());

-- FOLLOWS
CREATE POLICY "Users can view own follows" ON public.follows FOR SELECT USING (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Anyone can count follows" ON public.follows FOR SELECT USING (true);
CREATE POLICY "Users can manage follows" ON public.follows FOR INSERT WITH CHECK (client_profile_id = public.get_my_profile_id());
CREATE POLICY "Users can unfollow" ON public.follows FOR DELETE USING (client_profile_id = public.get_my_profile_id());

-- POSTS
CREATE POLICY "Public posts viewable" ON public.posts FOR SELECT USING (true);
CREATE POLICY "Pros can insert own posts" ON public.posts FOR INSERT WITH CHECK (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can update own posts" ON public.posts FOR UPDATE USING (professional_profile_id = public.get_my_pro_profile_id());
CREATE POLICY "Pros can delete own posts" ON public.posts FOR DELETE USING (professional_profile_id = public.get_my_pro_profile_id());

-- POST_LIKES
CREATE POLICY "Public likes viewable" ON public.post_likes FOR SELECT USING (true);
CREATE POLICY "Users can like posts" ON public.post_likes FOR INSERT WITH CHECK (profile_id = public.get_my_profile_id());
CREATE POLICY "Users can unlike" ON public.post_likes FOR DELETE USING (profile_id = public.get_my_profile_id());

-- NOTIFICATIONS
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- REPORTS
CREATE POLICY "Users can create reports" ON public.reports FOR INSERT WITH CHECK (reporter_profile_id = public.get_my_profile_id());
CREATE POLICY "Admins can view reports" ON public.reports FOR SELECT USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update reports" ON public.reports FOR UPDATE USING (public.has_role(auth.uid(), 'admin'));

-- ADMIN_ACTIONS
CREATE POLICY "Admins can manage actions" ON public.admin_actions FOR INSERT WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can view actions" ON public.admin_actions FOR SELECT USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================
-- TRIGGERS: Auto-create profile on signup
-- =============================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================================
-- TRIGGER: Update professional average_rating on new review
-- =============================================================
CREATE OR REPLACE FUNCTION public.update_professional_rating()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  UPDATE public.professional_profiles
  SET average_rating = (
    SELECT COALESCE(AVG(rating), 0) FROM public.reviews WHERE professional_profile_id = NEW.professional_profile_id
  ),
  total_reviews = (
    SELECT COUNT(*) FROM public.reviews WHERE professional_profile_id = NEW.professional_profile_id
  )
  WHERE id = NEW.professional_profile_id;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_review_created
  AFTER INSERT ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.update_professional_rating();

-- =============================================================
-- TRIGGER: Update follower_count on follow/unfollow
-- =============================================================
CREATE OR REPLACE FUNCTION public.update_follower_count()
RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  pro_id UUID;
BEGIN
  IF TG_OP = 'INSERT' THEN
    pro_id := NEW.professional_profile_id;
  ELSE
    pro_id := OLD.professional_profile_id;
  END IF;
  UPDATE public.professional_profiles
  SET follower_count = (SELECT COUNT(*) FROM public.follows WHERE professional_profile_id = pro_id)
  WHERE id = pro_id;
  RETURN NULL;
END;
$$;

CREATE TRIGGER on_follow_change
  AFTER INSERT OR DELETE ON public.follows
  FOR EACH ROW EXECUTE FUNCTION public.update_follower_count();

-- =============================================================
-- STORAGE: Portfolio bucket
-- =============================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

CREATE POLICY "Portfolio images publicly accessible" ON storage.objects FOR SELECT USING (bucket_id IN ('portfolio', 'avatars'));
CREATE POLICY "Authenticated users can upload portfolio" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Users can update own portfolio" ON storage.objects FOR UPDATE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own portfolio" ON storage.objects FOR DELETE USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can update own avatar" ON storage.objects FOR UPDATE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "Users can delete own avatar" ON storage.objects FOR DELETE USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- =============================================================
-- REALTIME: Enable for availability status changes
-- =============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.professional_profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.posts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
