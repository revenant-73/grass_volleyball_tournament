# Launch Checklist — Grass Doubles Tournament Platform

## 1. Environment & Infrastructure
- [ ] Production Supabase project created
- [ ] Vercel environment variables configured (Supabase, Stripe)
- [ ] Custom domain linked and SSL verified
- [ ] Stripe account connected and in "Live Mode"

## 2. Database & Data
- [ ] Final database migrations applied to production
- [ ] Seed data removed or replaced with real event data
- [ ] RLS policies verified for all tables (Public can read, Admin can write)
- [ ] Storage buckets created and permissions set (banners, logos)

## 3. Functionality Verification
- [ ] Create a real event and division
- [ ] Perform a successful registration with a test card (Stripe)
- [ ] Verify waiver is recorded in the database
- [ ] Verify registration confirmation email (if implemented)
- [ ] Test admin check-in flow on a mobile device
- [ ] Test score entry and automatic bracket advancement
- [ ] Verify public standings and bracket update in realtime

## 4. Quality & Performance
- [ ] All E2E tests passing (`npm test`)
- [ ] Linting passing (`npm run lint`)
- [ ] Build successful (`npm run build`)
- [ ] Mobile usability pass on key pages (Home, Event Detail, Registration, Live Pages)

## 5. Security
- [ ] `SUPABASE_SERVICE_ROLE_KEY` is NOT exposed to client
- [ ] Admin routes properly protected by middleware
- [ ] Rate limiting considered for registration/API routes
