# Memory: index.md
Updated: now

OpenChair - real-time beauty services discovery & booking marketplace

## Design System
- Fonts: Space Grotesk (display/headings), Inter (body)
- Primary: HSL 160 84% 39% (teal/green)
- Accent: HSL 45 93% 58% (warm gold)
- Status colors: green=available, yellow=appointment/limited, red=busy, gray=offline
- Style: mobile-first, premium, urban, rounded cards, glass effects
- Uses custom `--status-*` CSS vars and `status-*` Tailwind tokens

## Architecture
- Dual-role system: users can be client AND professional simultaneously
- Auth context exposes: role (primary), roles[] (all), isPro, isClient flags
- Clients can upgrade to pro via /upgrade-to-pro (preserves client data)
- Professionals who sign up also get client role automatically
- Client routes accessible to both client and professional roles
- Pro routes restricted to professional/shop_owner roles
- RoleBadge component shows P (pro) or C (client) with clickable explanation
- Route: /upgrade-to-pro — full pro onboarding for existing clients

## Key Files
- src/lib/auth-context.tsx — dual-role auth with roles[], isPro, isClient
- src/components/ProtectedRoute.tsx — checks roles[] array for access
- src/pages/onboarding/ProUpgrade.tsx — client→pro upgrade flow
- src/components/BottomNav.tsx — uses isPro for nav detection
