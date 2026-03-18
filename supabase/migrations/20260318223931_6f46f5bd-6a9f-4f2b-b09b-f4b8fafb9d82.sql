
-- Completed bookings + reviews for multiple pros
-- James Turner reviews Marcus
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000001'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000001', '4f0ca09c-1f22-4396-a3f8-9bd580127afd', '2026-03-15', '14:00', 'completed', 35);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000001'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000001', 5, 'Best fade I''ve ever gotten. Marcus is a true artist. Clean shop, great vibes.', ARRAY['great fade','clean shop','professional']);

-- Destiny Robinson reviews Marcus
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000002'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000001', 'c884792d-45dd-4604-a919-4d0f4d7c235d', '2026-03-10', '11:00', 'completed', 50);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000002'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000001', 5, 'Found him through OpenChair when my usual barber cancelled. Now he is my new regular!', ARRAY['punctual','great communication']);

-- Mike Lewis reviews Marcus
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000003'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-000000000001', '9b2710a9-97e7-4cf8-a0bd-f43cf4b3e892', '2026-03-05', '10:00', 'completed', 40);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000003'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-000000000001', 4, 'Solid cut, fair price. Waited about 10 min but worth it.', ARRAY['great fade']);

-- Tanya reviews Aisha
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000004'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000002', 'dd5da33f-99dc-46a2-b4b2-5427c044513d', '2026-03-12', '09:00', 'completed', 180);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000004'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000002', 5, 'Aisha''s knotless braids are absolutely flawless. Gentle hands and beautiful results.', ARRAY['gentle','beautiful work','professional']);

-- Aliyah reviews Aisha
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000005'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000002', 'b7ef0958-e756-4aac-b28c-701fccd5546c', '2026-03-08', '13:00', 'completed', 80);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000005'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000002', 5, 'My cornrows lasted 3 weeks and looked amazing the whole time. Will be back!', ARRAY['long lasting','neat work']);

-- Chris reviews Tony
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000006'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000003', '650d0a69-2abe-468f-a3e9-33ff441be954', '2026-03-14', '15:00', 'completed', 50);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000006'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000003', 5, 'Tony is incredible with design cuts. Got so many compliments!', ARRAY['creative','great communication']);

-- James reviews Tony
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000007'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000003', '6630701d-21bc-41bb-b192-f7184b418032', '2026-03-01', '10:00', 'completed', 30);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000007'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000003', 4, 'Good classic cut. Clean shop and friendly atmosphere.', ARRAY['clean shop','punctual']);

-- Tanya reviews Jade
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000008'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000004', '6f790f3f-e3a3-47b8-8b59-e863b66574c1', '2026-03-13', '11:00', 'completed', 65);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000008'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000004', 5, 'Jade is an absolute nail artist! My acrylics lasted 4 weeks with zero lifting.', ARRAY['long lasting','artistic','professional']);

-- Aliyah reviews Jade
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000009'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000004', '08266c31-8688-44f9-ab15-7aac05eff7eb', '2026-03-07', '14:00', 'completed', 45);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000009'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000004', 5, 'Best gel manicure in Brooklyn. So clean and detailed!', ARRAY['detailed','clean']);

-- Chris reviews Derek (tattoo)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000a'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000005', 'da6fdf61-f1f4-4cf6-8bda-d34483307b0a', '2026-03-02', '16:00', 'completed', 100);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000a'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000005', 5, 'Derek''s fine line work is unreal. My small tattoo healed beautifully.', ARRAY['clean lines','professional','great healer']);

-- Destiny reviews Brianna (esthetician)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000b'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000006', '5c15fc79-8fab-476a-a7ea-edc5d911cd75', '2026-03-11', '10:00', 'completed', 85);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000b'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000006', 4, 'Great facial! My skin was glowing for days. Very relaxing experience.', ARRAY['relaxing','great results']);

-- Tanya reviews Brianna
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000c'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000006', '5c15fc79-8fab-476a-a7ea-edc5d911cd75', '2026-03-04', '11:00', 'completed', 85);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000c'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-000000000006', 5, 'Bri knows skin! My custom facial was exactly what I needed.', ARRAY['knowledgeable','professional']);

-- Mike reviews Kevin (barber)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000d'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-000000000007', '4f0ca09c-1f22-4396-a3f8-9bd580127afd', '2026-03-16', '09:00', 'completed', 30);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000d'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-000000000007', 5, 'Kev has been cutting hair for years and it shows. Cleanest fade in BK.', ARRAY['experienced','great fade','clean shop']);

-- James reviews Kevin
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, service_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000e'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000007', 'c884792d-45dd-4604-a919-4d0f4d7c235d', '2026-03-09', '14:00', 'completed', 50);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000e'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-000000000007', 5, 'Haircut and beard combo was perfect. Great conversation too!', ARRAY['great beard work','friendly']);

-- Aliyah reviews Lena (lashes)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-00000000000f'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000008', '2026-03-06', '10:00', 'completed', 200);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-00000000000f'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-000000000008', 5, 'Volume lashes look incredible. Lena is so detailed and careful.', ARRAY['detailed','gentle','great results']);

-- Destiny reviews Carlos (locs)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000010'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000009', '2026-03-03', '11:00', 'completed', 85);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000010'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-000000000009', 5, 'Carlos is the loc whisperer. Best retwist I have ever had.', ARRAY['expert','gentle','professional']);

-- Chris reviews Carlos
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000011'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000009', '2026-03-14', '13:00', 'completed', 60);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000011'::uuid, 'a2d984c0-609b-4f17-91dc-b7bbac3c0c26', 'a1000001-0000-0000-0000-000000000009', 5, 'Loc styling was fire! Carlos really understands the culture.', ARRAY['creative','knowledgeable']);

-- Tanya reviews Mia (hairstylist)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000012'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-00000000000a', '2026-03-15', '10:00', 'completed', 85);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000012'::uuid, 'bc27e30e-e3bc-4c5c-a680-685c4b5c8672', 'a1000001-0000-0000-0000-00000000000a', 5, 'Mia did the most gorgeous silk press. Bouncy and shiny for days!', ARRAY['great results','skilled','friendly']);

-- Mike reviews Andre (piercer)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000013'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-00000000000b', '2026-03-17', '16:00', 'completed', 50);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000013'::uuid, '9d40e2ac-5a5b-4609-b5d7-9827105f86dd', 'a1000001-0000-0000-0000-00000000000b', 4, 'Helix piercing healed perfectly. Dre was super professional and quick.', ARRAY['professional','clean','quick']);

-- Aliyah reviews Destiny Harper (makeup)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000014'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-00000000000c', '2026-03-10', '09:00', 'completed', 85);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000014'::uuid, '3e121b42-c300-4428-99db-ca25c1b8c82a', 'a1000001-0000-0000-0000-00000000000c', 5, 'Destiny made me look like a celebrity for my birthday! Flawless glam.', ARRAY['flawless','creative','professional']);

-- James reviews Ray (barber)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000015'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-00000000000d', '2026-02-28', '11:00', 'completed', 30);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000015'::uuid, '3195fabe-abe1-4eb2-a7e6-f3169c333c0b', 'a1000001-0000-0000-0000-00000000000d', 4, 'Ray is old school in the best way. Clean razor shave, no rush.', ARRAY['experienced','traditional','clean shop']);

-- Destiny Robinson reviews Zara (braider)
INSERT INTO public.bookings (id, client_profile_id, professional_profile_id, booking_date, start_time, status, total_price_estimate)
VALUES ('d0000001-0000-0000-0000-000000000016'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-00000000000e', '2026-03-16', '09:00', 'completed', 200);
INSERT INTO public.reviews (booking_id, client_profile_id, professional_profile_id, rating, review_text, tags)
VALUES ('d0000001-0000-0000-0000-000000000016'::uuid, '8661c594-5cb0-4d70-be5f-f31a6c662e92', 'a1000001-0000-0000-0000-00000000000e', 5, 'Zara''s knotless braids are perfection. Light, neat, and lasted 6 weeks!', ARRAY['neat work','long lasting','gentle']);
