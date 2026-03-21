
-- Pro waitlist table
CREATE TABLE public.pro_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  business_name text,
  category text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  phone text NOT NULL,
  email text NOT NULL,
  instagram text,
  specialties text,
  accepts_walk_ins boolean DEFAULT false,
  wants_open_chair_alerts boolean DEFAULT false,
  additional_notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Client waitlist table
CREATE TABLE public.client_waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  email text NOT NULL,
  phone text,
  services_interested text,
  wants_realtime_availability boolean DEFAULT false,
  referral_source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Allow anonymous inserts (public waitlist)
ALTER TABLE public.pro_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit pro waitlist" ON public.pro_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view pro waitlist" ON public.pro_waitlist FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can submit client waitlist" ON public.client_waitlist FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Admins can view client waitlist" ON public.client_waitlist FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
