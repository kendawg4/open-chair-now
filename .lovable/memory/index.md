OpenChair - real-time beauty services discovery & booking marketplace

## Design System
- Fonts: Space Grotesk (display/headings), Inter (body)
- Primary: HSL 160 84% 39% (teal/green)
- Accent: HSL 45 93% 58% (warm gold)
- Status colors: green=available, yellow=appointment/limited, red=busy, gray=offline
- Style: mobile-first, premium, urban, rounded cards, glass effects
- Uses custom `--status-*` CSS vars and `status-*` Tailwind tokens

## Architecture
- Two-sided marketplace: clients + professionals
- Client routes: /home, /discover, /search, /favorites, /profile, /pro/:id, /messages, /messages/:id
- Pro routes: /pro/dashboard, /pro/bookings, /pro/services, /pro/portfolio, /pro/my-profile, /pro/profile-edit
- Shared: /notifications, /settings, /messages
- DB tables: profiles, professional_profiles, services, bookings, reviews, posts, comments, reposts, post_likes, follows, favorites, notifications, conversations, messages, user_roles, admin_actions
- posts table has is_pinned column for featured posts
- conversations/messages tables for DMs with realtime
- DB trigger notify_followers_open_chair auto-creates notifications when pro goes open-chair
- Realtime enabled on: professional_profiles, messages, bookings

## Phase Status
- Phase 1 (UI scaffold): ✅
- Phase 2 (Auth, DB, social features): ✅
- Messaging system: ✅ conversations + messages with realtime
- Open Chairs Map: ✅ Leaflet-based map on home page
- Pinned posts: ✅ pros can pin one post to top of profile
- Activity feed: ✅ prioritizes followed pros + trending by engagement
- Post interactions: ✅ likes/comments/reposts persist to DB with count updates
- Feed shows isLiked/isReposted state per user
- Booking flow: ✅ end-to-end with realtime updates
- All UI uses live Supabase data, no mock data in production code
