
-- Services for Marcus (barber)
INSERT INTO public.services (professional_profile_id, service_name, price, duration_minutes, instant_book, is_active) VALUES
('a1000001-0000-0000-0000-000000000001', 'Classic Fade', 35, 30, true, true),
('a1000001-0000-0000-0000-000000000001', 'Skin Fade', 40, 35, true, true),
('a1000001-0000-0000-0000-000000000001', 'Beard Trim & Shape', 20, 15, true, true),
('a1000001-0000-0000-0000-000000000001', 'Haircut + Beard', 50, 45, true, true),
('a1000001-0000-0000-0000-000000000001', 'Kids Cut (12 & under)', 25, 25, false, true),
-- Aisha (braider)
('a1000001-0000-0000-0000-000000000002', 'Knotless Braids (Medium)', 180, 180, false, true),
('a1000001-0000-0000-0000-000000000002', 'Box Braids', 150, 150, false, true),
('a1000001-0000-0000-0000-000000000002', 'Cornrows', 80, 90, true, true),
('a1000001-0000-0000-0000-000000000002', 'Loc Retwist', 75, 60, true, true),
-- Tony (barber)
('a1000001-0000-0000-0000-000000000003', 'Classic Cut', 30, 30, true, true),
('a1000001-0000-0000-0000-000000000003', 'Design Cut', 50, 45, false, true),
('a1000001-0000-0000-0000-000000000003', 'Hot Towel Shave', 35, 30, true, true),
-- Jade (nail tech)
('a1000001-0000-0000-0000-000000000004', 'Full Set Acrylics', 65, 75, false, true),
('a1000001-0000-0000-0000-000000000004', 'Gel Manicure', 45, 45, true, true),
('a1000001-0000-0000-0000-000000000004', 'Nail Art Add-on', 20, 15, false, true),
('a1000001-0000-0000-0000-000000000004', 'Pedicure', 50, 60, true, true),
-- Derek (tattoo)
('a1000001-0000-0000-0000-000000000005', 'Small Tattoo (1-2in)', 100, 30, false, true),
('a1000001-0000-0000-0000-000000000005', 'Medium Tattoo (3-5in)', 250, 90, false, true),
('a1000001-0000-0000-0000-000000000005', 'Consultation', 0, 30, true, true),
-- Brianna (esthetician)
('a1000001-0000-0000-0000-000000000006', 'Classic Facial', 85, 60, true, true),
('a1000001-0000-0000-0000-000000000006', 'Chemical Peel', 120, 45, false, true),
('a1000001-0000-0000-0000-000000000006', 'Brow Wax & Shape', 25, 15, true, true),
('a1000001-0000-0000-0000-000000000006', 'Microdermabrasion', 150, 60, false, true),
-- Kevin (barber)
('a1000001-0000-0000-0000-000000000007', 'Classic Fade', 30, 25, true, true),
('a1000001-0000-0000-0000-000000000007', 'Beard Sculpt', 25, 20, true, true),
('a1000001-0000-0000-0000-000000000007', 'Hot Towel Shave', 40, 30, true, true),
('a1000001-0000-0000-0000-000000000007', 'Haircut + Beard', 50, 40, true, true),
-- Lena (lash tech)
('a1000001-0000-0000-0000-000000000008', 'Classic Full Set', 150, 120, false, true),
('a1000001-0000-0000-0000-000000000008', 'Volume Full Set', 200, 150, false, true),
('a1000001-0000-0000-0000-000000000008', 'Lash Lift & Tint', 80, 60, true, true),
('a1000001-0000-0000-0000-000000000008', 'Fill (2 weeks)', 75, 60, true, true),
-- Carlos (loc specialist)
('a1000001-0000-0000-0000-000000000009', 'Starter Locs', 200, 180, false, true),
('a1000001-0000-0000-0000-000000000009', 'Retwist', 85, 90, true, true),
('a1000001-0000-0000-0000-000000000009', 'Loc Styling', 60, 45, true, true),
('a1000001-0000-0000-0000-000000000009', 'Interlocking', 120, 120, false, true),
-- Mia (hairstylist)
('a1000001-0000-0000-0000-00000000000a', 'Balayage', 200, 180, false, true),
('a1000001-0000-0000-0000-00000000000a', 'Silk Press', 85, 90, true, true),
('a1000001-0000-0000-0000-00000000000a', 'Blowout', 55, 45, true, true),
('a1000001-0000-0000-0000-00000000000a', 'Color Correction', 300, 240, false, true),
-- Andre (piercer)
('a1000001-0000-0000-0000-00000000000b', 'Ear Lobe Piercing', 40, 15, true, true),
('a1000001-0000-0000-0000-00000000000b', 'Helix Piercing', 50, 20, true, true),
('a1000001-0000-0000-0000-00000000000b', 'Septum Piercing', 60, 20, false, true),
('a1000001-0000-0000-0000-00000000000b', 'Nose Stud', 45, 15, true, true),
-- Destiny (makeup artist)
('a1000001-0000-0000-0000-00000000000c', 'Bridal Makeup', 250, 90, false, true),
('a1000001-0000-0000-0000-00000000000c', 'Everyday Glam', 85, 45, true, true),
('a1000001-0000-0000-0000-00000000000c', 'Editorial Look', 200, 120, false, true),
('a1000001-0000-0000-0000-00000000000c', 'Bridal Consultation', 0, 30, true, true),
-- Ray (barber)
('a1000001-0000-0000-0000-00000000000d', 'Classic Cut', 25, 30, true, true),
('a1000001-0000-0000-0000-00000000000d', 'Straight Razor Shave', 30, 25, true, true),
('a1000001-0000-0000-0000-00000000000d', 'Afro Shape-Up', 35, 30, true, true),
-- Zara (braider)
('a1000001-0000-0000-0000-00000000000e', 'Knotless Braids', 200, 210, false, true),
('a1000001-0000-0000-0000-00000000000e', 'Goddess Braids', 120, 120, false, true),
('a1000001-0000-0000-0000-00000000000e', 'Feed-in Braids', 100, 90, true, true),
('a1000001-0000-0000-0000-00000000000e', 'Twist Out Style', 60, 45, true, true);

-- Portfolio items
INSERT INTO public.portfolio_items (professional_profile_id, media_url, caption) VALUES
('a1000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop', 'Clean skin fade'),
('a1000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop', 'Mid taper with texture'),
('a1000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop', 'Beard sculpt'),
('a1000001-0000-0000-0000-000000000001', 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&h=400&fit=crop', 'Kids fade'),
('a1000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', 'Knotless braids medium'),
('a1000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e6b?w=400&h=400&fit=crop', 'Box braids waist length'),
('a1000001-0000-0000-0000-000000000002', 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&h=400&fit=crop', 'Cornrow design'),
('a1000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop', 'Design cut with part'),
('a1000001-0000-0000-0000-000000000003', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop', 'Classic taper'),
('a1000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&h=400&fit=crop', 'Chrome french tips'),
('a1000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&h=400&fit=crop', 'Nail art set'),
('a1000001-0000-0000-0000-000000000004', 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&h=400&fit=crop', 'Gel manicure'),
('a1000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28?w=400&h=400&fit=crop', 'Fine line rose'),
('a1000001-0000-0000-0000-000000000005', 'https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?w=400&h=400&fit=crop', 'Geometric sleeve detail'),
('a1000001-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&h=400&fit=crop', 'Hydrating facial'),
('a1000001-0000-0000-0000-000000000006', 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=400&h=400&fit=crop', 'Glow treatment'),
('a1000001-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&h=400&fit=crop', 'Sharp fade'),
('a1000001-0000-0000-0000-000000000007', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&h=400&fit=crop', 'Beard work'),
('a1000001-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1583001931096-959e9a1a6223?w=400&h=400&fit=crop', 'Volume lash set'),
('a1000001-0000-0000-0000-000000000008', 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop', 'Classic lash set'),
('a1000001-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1529068755536-a5ade0dcb4e8?w=400&h=400&fit=crop', 'Fresh retwist'),
('a1000001-0000-0000-0000-000000000009', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop', 'Loc styling'),
('a1000001-0000-0000-0000-00000000000a', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=400&h=400&fit=crop', 'Balayage transformation'),
('a1000001-0000-0000-0000-00000000000a', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', 'Silk press finish'),
('a1000001-0000-0000-0000-00000000000b', 'https://images.unsplash.com/photo-1617207271503-41fd1427e3b9?w=400&h=400&fit=crop', 'Helix piercing'),
('a1000001-0000-0000-0000-00000000000c', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=400&fit=crop', 'Bridal glam'),
('a1000001-0000-0000-0000-00000000000c', 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop', 'Editorial look'),
('a1000001-0000-0000-0000-00000000000d', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&h=400&fit=crop', 'Classic cut'),
('a1000001-0000-0000-0000-00000000000e', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop', 'Knotless braids'),
('a1000001-0000-0000-0000-00000000000e', 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e6b?w=400&h=400&fit=crop', 'Goddess braids');

-- Posts
INSERT INTO public.posts (professional_profile_id, content, image_url, post_type) VALUES
('a1000001-0000-0000-0000-000000000001', '🪑 Chair just opened up! Walk-ins welcome for the next 2 hours. Beard trim included with any fade.', 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=600&fit=crop', 'opening'),
('a1000001-0000-0000-0000-000000000002', 'Cancellation opened up a 2:15 PM slot! Knotless braids — 10% off for same-day booking 🔥', 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&h=600&fit=crop', 'promotion'),
('a1000001-0000-0000-0000-000000000003', 'Fresh design cut from this morning. DM for appointments or walk in — available now! ✂️', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=600&fit=crop', 'portfolio'),
('a1000001-0000-0000-0000-000000000004', 'Chrome french tips for the spring 💅 Book your set — link in bio!', 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&h=600&fit=crop', 'portfolio'),
('a1000001-0000-0000-0000-000000000007', '🪑 Two chairs open! Walk-ins welcome. $5 off fades until 5 PM.', 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&h=600&fit=crop', 'opening'),
('a1000001-0000-0000-0000-000000000009', 'Retwist opening at 3:30 PM — grab it before it is gone! 🔥', NULL, 'opening'),
('a1000001-0000-0000-0000-00000000000a', 'New balayage transformation 🎨 Swipe to see the before!', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=600&fit=crop', 'portfolio'),
('a1000001-0000-0000-0000-00000000000c', 'Bridal consults are free today! Book yours now 💍', 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=600&h=600&fit=crop', 'promotion'),
('a1000001-0000-0000-0000-00000000000e', 'Walk-in slots available now! First-time clients get 15% off 🔥', 'https://images.unsplash.com/photo-1595959183082-7b570b7e1e6b?w=600&h=600&fit=crop', 'opening');
