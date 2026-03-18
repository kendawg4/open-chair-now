
-- Create seed auth users
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, instance_id, aud, role)
VALUES
('b0000001-0000-0000-0000-000000000001', 'marcus@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000002', 'aisha@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000003', 'tony@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000004', 'jade@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000005', 'derek@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000006', 'brianna@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000007', 'kevin@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000008', 'lena@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-000000000009', 'carlos@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-00000000000a', 'mia@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-00000000000b', 'andre@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-00000000000c', 'destiny@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-00000000000d', 'ray@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000001-0000-0000-0000-00000000000e', 'zara@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000001', 'james.t@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000002', 'destiny.r@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000003', 'mike.l@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000004', 'tanya@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000005', 'chris@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated'),
('b0000002-0000-0000-0000-000000000006', 'aliyah@demo.openchair.app', crypt('demo1234', gen_salt('bf')), now(), now(), now(), '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated')
ON CONFLICT (id) DO NOTHING;

-- Create identities
INSERT INTO auth.identities (id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
SELECT id, id, id::text, json_build_object('sub', id::text, 'email', email), 'email', now(), now(), now()
FROM auth.users WHERE id IN (
  'b0000001-0000-0000-0000-000000000001','b0000001-0000-0000-0000-000000000002','b0000001-0000-0000-0000-000000000003',
  'b0000001-0000-0000-0000-000000000004','b0000001-0000-0000-0000-000000000005','b0000001-0000-0000-0000-000000000006',
  'b0000001-0000-0000-0000-000000000007','b0000001-0000-0000-0000-000000000008','b0000001-0000-0000-0000-000000000009',
  'b0000001-0000-0000-0000-00000000000a','b0000001-0000-0000-0000-00000000000b','b0000001-0000-0000-0000-00000000000c',
  'b0000001-0000-0000-0000-00000000000d','b0000001-0000-0000-0000-00000000000e',
  'b0000002-0000-0000-0000-000000000001','b0000002-0000-0000-0000-000000000002','b0000002-0000-0000-0000-000000000003',
  'b0000002-0000-0000-0000-000000000004','b0000002-0000-0000-0000-000000000005','b0000002-0000-0000-0000-000000000006'
)
ON CONFLICT DO NOTHING;

-- Update profiles created by handle_new_user trigger
UPDATE public.profiles SET full_name='Marcus Johnson', display_name='Marcus', avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face', bio='Master barber specializing in precision fades and modern cuts. Walk-ins welcome when the chair is open.', city='Brooklyn', state='NY', zip_code='11201' WHERE user_id='b0000001-0000-0000-0000-000000000001';
UPDATE public.profiles SET full_name='Aisha Williams', display_name='Aisha', avatar_url='https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&h=200&fit=crop&crop=face', bio='Protective style specialist. 12 years creating beautiful braids and locs for all hair textures.', city='Brooklyn', state='NY', zip_code='11216' WHERE user_id='b0000001-0000-0000-0000-000000000002';
UPDATE public.profiles SET full_name='Tony Reeves', display_name='Tony', avatar_url='https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face', bio='Creative barber with a passion for design cuts and clean lines.', city='Brooklyn', state='NY', zip_code='11205' WHERE user_id='b0000001-0000-0000-0000-000000000003';
UPDATE public.profiles SET full_name='Jade Kim', display_name='Jade', avatar_url='https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face', bio='Nail artist creating wearable art. Known for intricate designs and long-lasting sets.', city='Brooklyn', state='NY', zip_code='11215' WHERE user_id='b0000001-0000-0000-0000-000000000004';
UPDATE public.profiles SET full_name='Derek Santos', display_name='Derek', avatar_url='https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face', bio='Fine line and minimalist tattoo artist. Consultation required for custom pieces.', city='Brooklyn', state='NY', zip_code='11211' WHERE user_id='b0000001-0000-0000-0000-000000000005';
UPDATE public.profiles SET full_name='Brianna Cole', display_name='Bri', avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face', bio='Licensed esthetician specializing in facials, chemical peels, and glow-ups.', city='Brooklyn', state='NY', zip_code='11217' WHERE user_id='b0000001-0000-0000-0000-000000000006';
UPDATE public.profiles SET full_name='Kevin Wright', display_name='Kev', avatar_url='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face', bio='Barber and mens grooming specialist. 15 years in the game.', city='Brooklyn', state='NY', zip_code='11238' WHERE user_id='b0000001-0000-0000-0000-000000000007';
UPDATE public.profiles SET full_name='Lena Okafor', display_name='Lena', avatar_url='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face', bio='Lash artist creating dramatic and natural lash extensions.', city='Brooklyn', state='NY', zip_code='11226' WHERE user_id='b0000001-0000-0000-0000-000000000008';
UPDATE public.profiles SET full_name='Carlos Rivera', display_name='Carlos', avatar_url='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=face', bio='Loc specialist and natural hair care expert. Building crowns, one loc at a time.', city='Brooklyn', state='NY', zip_code='11233' WHERE user_id='b0000001-0000-0000-0000-000000000009';
UPDATE public.profiles SET full_name='Mia Chen', display_name='Mia', avatar_url='https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face', bio='Hairstylist specializing in color, balayage, and transformations.', city='Brooklyn', state='NY', zip_code='11222' WHERE user_id='b0000001-0000-0000-0000-00000000000a';
UPDATE public.profiles SET full_name='Andre Mitchell', display_name='Dre', avatar_url='https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop&crop=face', bio='Professional piercer with 6 years experience. Safe, sterile, stylish.', city='Brooklyn', state='NY', zip_code='11249' WHERE user_id='b0000001-0000-0000-0000-00000000000b';
UPDATE public.profiles SET full_name='Destiny Harper', display_name='Destiny', avatar_url='https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face', bio='Makeup artist for weddings, editorials, and everyday glam.', city='Brooklyn', state='NY', zip_code='11206' WHERE user_id='b0000001-0000-0000-0000-00000000000c';
UPDATE public.profiles SET full_name='Ray Thompson', display_name='Ray', avatar_url='https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&h=200&fit=crop&crop=face', bio='Old-school barber with modern technique. Straight razor specialist.', city='Brooklyn', state='NY', zip_code='11213' WHERE user_id='b0000001-0000-0000-0000-00000000000d';
UPDATE public.profiles SET full_name='Zara Osei', display_name='Zara', avatar_url='https://images.unsplash.com/photo-1523824921871-d6f1a15151f1?w=200&h=200&fit=crop&crop=face', bio='Knotless braids queen. Protective styles for all textures.', city='Brooklyn', state='NY', zip_code='11221' WHERE user_id='b0000001-0000-0000-0000-00000000000e';
UPDATE public.profiles SET full_name='James Turner', avatar_url='https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000001';
UPDATE public.profiles SET full_name='Destiny Robinson', avatar_url='https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000002';
UPDATE public.profiles SET full_name='Mike Lewis', avatar_url='https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000003';
UPDATE public.profiles SET full_name='Tanya Brooks', avatar_url='https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000004';
UPDATE public.profiles SET full_name='Chris Park', avatar_url='https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000005';
UPDATE public.profiles SET full_name='Aliyah Grant', avatar_url='https://images.unsplash.com/photo-1517841905240-472988babdf9?w=80&h=80&fit=crop&crop=face', city='Brooklyn', state='NY' WHERE user_id='b0000002-0000-0000-0000-000000000006';

-- Assign roles
INSERT INTO public.user_roles (user_id, role) VALUES
('b0000001-0000-0000-0000-000000000001', 'professional'),
('b0000001-0000-0000-0000-000000000002', 'professional'),
('b0000001-0000-0000-0000-000000000003', 'professional'),
('b0000001-0000-0000-0000-000000000004', 'professional'),
('b0000001-0000-0000-0000-000000000005', 'professional'),
('b0000001-0000-0000-0000-000000000006', 'professional'),
('b0000001-0000-0000-0000-000000000007', 'professional'),
('b0000001-0000-0000-0000-000000000008', 'professional'),
('b0000001-0000-0000-0000-000000000009', 'professional'),
('b0000001-0000-0000-0000-00000000000a', 'professional'),
('b0000001-0000-0000-0000-00000000000b', 'professional'),
('b0000001-0000-0000-0000-00000000000c', 'professional'),
('b0000001-0000-0000-0000-00000000000d', 'professional'),
('b0000001-0000-0000-0000-00000000000e', 'professional'),
('b0000002-0000-0000-0000-000000000001', 'client'),
('b0000002-0000-0000-0000-000000000002', 'client'),
('b0000002-0000-0000-0000-000000000003', 'client'),
('b0000002-0000-0000-0000-000000000004', 'client'),
('b0000002-0000-0000-0000-000000000005', 'client'),
('b0000002-0000-0000-0000-000000000006', 'client')
ON CONFLICT DO NOTHING;

-- Professional profiles
INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_note, status_promo, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, instagram_url, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000001'::uuid, p.id, 'Marcus Cuts Studio', 'barber', ARRAY['fades','tapers','beard grooming','kids cuts'], 8, 'Marcus Cuts Studio', '456 Elm St', 'Brooklyn', 'NY', '11201', 40.6782, -73.9442, 'open-chair', 'Open until 4:00 PM', 'Beard trim included with any fade today!', true, true, 4.9, 0, 1820, 'independent', '@marcuscuts', true, ARRAY['English','Spanish']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000001' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_note, status_promo, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000002'::uuid, p.id, 'Crown & Glory Suite', 'braider', ARRAY['knotless braids','box braids','cornrows','natural hair'], 12, 'Crown & Glory Suite', '789 MLK Blvd', 'Brooklyn', 'NY', '11216', 40.6811, -73.9495, 'last-minute', 'Cancellation at 2:15 PM', 'Same-day braid slot — 10% off!', true, true, 4.8, 0, 3200, 'booth-renter', false, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000002' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000003'::uuid, p.id, 'Elite Barbershop', 'barber', ARRAY['fades','designs','mens grooming','straight razor'], 5, 'Elite Barbershop', '123 Main St', 'Brooklyn', 'NY', '11205', 40.6892, -73.9502, 'available-now', true, true, 4.7, 0, 890, 'shop-employee', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000003' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, instagram_url, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000004'::uuid, p.id, 'Jade Nails Studio', 'nail-tech', ARRAY['acrylics','gel nails','nail art','manicure'], 10, 'Jade Nails Studio', '321 5th Ave', 'Brooklyn', 'NY', '11215', 40.6725, -73.9815, 'appointment-only', true, true, 4.9, 0, 5400, 'independent', '@jadenailsnyc', false, ARRAY['English','Korean']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000004' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000005'::uuid, p.id, 'Ink District', 'tattoo-artist', ARRAY['fine line','black and gray','minimalist','geometric'], 7, 'Ink District', '555 Arts Blvd', 'Brooklyn', 'NY', '11211', 40.7128, -73.9537, 'busy', false, true, 4.8, 0, 7200, 'booth-renter', false, ARRAY['English','Portuguese']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000005' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_note, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000006'::uuid, p.id, 'Glow Bar BK', 'esthetician', ARRAY['facials','chemical peels','microdermabrasion','waxing'], 6, 'Glow Bar BK', '200 Atlantic Ave', 'Brooklyn', 'NY', '11217', 40.6862, -73.9778, 'available-now', 'Walk-ins welcome today', true, true, 4.6, 0, 1500, 'independent', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000006' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_promo, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000007'::uuid, p.id, 'Kev The Barber', 'barber', ARRAY['fades','beard sculpting','hot towel shave','mens grooming'], 15, 'Classic Cuts BK', '88 Fulton St', 'Brooklyn', 'NY', '11238', 40.6834, -73.9662, 'open-chair', 'Walk-in special: $5 off fades until 5 PM', true, true, 4.8, 0, 2400, 'shop-employee', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000007' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000008'::uuid, p.id, 'Lena Lashes', 'lash-tech', ARRAY['classic lashes','volume lashes','mega volume','lash lift'], 4, 'Beauty Suite 12', '150 Flatbush Ave', 'Brooklyn', 'NY', '11226', 40.6571, -73.9612, 'appointment-only', true, true, 4.7, 0, 2100, 'booth-renter', false, ARRAY['English','Igbo']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000008' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_note, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-000000000009'::uuid, p.id, 'Crown Locs', 'loc-specialist', ARRAY['starter locs','retwist','loc styling','interlocking'], 9, 'Crown Locs Studio', '310 Nostrand Ave', 'Brooklyn', 'NY', '11233', 40.6815, -73.9502, 'last-minute', 'Retwist opening at 3:30 PM', true, true, 4.9, 0, 1800, 'independent', true, ARRAY['English','Spanish']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-000000000009' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, instagram_url, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-00000000000a'::uuid, p.id, 'Mia Color Studio', 'hairstylist', ARRAY['balayage','color correction','blowout','silk press','highlights'], 8, 'Mia Color Studio', '45 Bedford Ave', 'Brooklyn', 'NY', '11222', 40.7178, -73.9575, 'available-now', true, true, 4.8, 0, 3800, 'independent', '@miacolorstudio', false, ARRAY['English','Mandarin']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-00000000000a' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-00000000000b'::uuid, p.id, 'Dre Piercings', 'piercer', ARRAY['ear piercings','nose piercings','septum','helix','industrial'], 6, 'Ink & Steel Studio', '77 Graham Ave', 'Brooklyn', 'NY', '11249', 40.7152, -73.9445, 'available-now', true, true, 4.6, 0, 950, 'booth-renter', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-00000000000b' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_promo, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, instagram_url, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-00000000000c'::uuid, p.id, 'Destiny Glam', 'makeup-artist', ARRAY['bridal makeup','editorial','everyday glam','special occasion'], 7, NULL, '220 DeKalb Ave', 'Brooklyn', 'NY', '11206', 40.6909, -73.9632, 'open-chair', 'Bridal consult free today!', true, true, 4.9, 0, 4200, 'independent', '@destinyglam', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-00000000000c' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-00000000000d'::uuid, p.id, 'Ray Classic Cuts', 'barber', ARRAY['straight razor','classic cuts','hot towel shave','afro shaping'], 20, 'Ray Classic Cuts', '55 Ralph Ave', 'Brooklyn', 'NY', '11213', 40.6791, -73.9225, 'offline', true, true, 4.5, 0, 670, 'shop-owner', true, ARRAY['English']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-00000000000d' ON CONFLICT DO NOTHING;

INSERT INTO public.professional_profiles (id, profile_id, business_name, category, specialties, years_experience, shop_name, address, city, state, zip_code, latitude, longitude, status, status_note, status_promo, is_verified, onboarding_completed, average_rating, total_reviews, follower_count, business_type, accepts_walk_ins, languages)
SELECT 'a1000001-0000-0000-0000-00000000000e'::uuid, p.id, 'Zara Braids', 'braider', ARRAY['knotless braids','goddess braids','feed-in braids','twist outs'], 6, 'Natural Crown Studio', '400 Lewis Ave', 'Brooklyn', 'NY', '11221', 40.6847, -73.9365, 'available-now', 'Taking walk-ins now!', 'First-time client discount 15% off', true, true, 4.7, 0, 2900, 'booth-renter', true, ARRAY['English','French']
FROM public.profiles p WHERE p.user_id='b0000001-0000-0000-0000-00000000000e' ON CONFLICT DO NOTHING;
