# Grass Doubles Tournament Platform — Development Tickets

## Epic 0 — Product setup

### T-001 Project repository setup [COMPLETED]
- [x] Git repo setup
- [x] Next.js initialization
- [x] Tailwind CSS & ESLint

### T-002 Deployment setup [COMPLETED]
- [x] Vercel project configuration
- [x] Environment variables setup

### T-003 Supabase project setup [COMPLETED]
- [x] DB connection
- [x] Storage buckets (banners, logos)

---

## Epic 1 — Database and auth

### T-010 Create database schema [COMPLETED]
- [x] Core tables (events, teams, divisions, matches, etc.)
- [x] Migrations and RLS policies

### T-011 Seed sample data [COMPLETED]
- [x] Pilot data for UI testing

### T-012 Admin authentication [COMPLETED]
- [x] Supabase Auth integration
- [x] Protected /admin routes

### T-013 Role-based access control [COMPLETED]
- [x] Super Admin vs Scorekeeper roles

---

## Epic 2 — Public event experience

### T-020 Public homepage [COMPLETED]
- [x] List upcoming events

### T-021 Public event detail page [COMPLETED]
- [x] Event hub with registration and info

### T-022 Public schedule page [COMPLETED]
- [x] Live pool and bracket match lists

### T-023 Public standings page [COMPLETED]
- [x] Live pool standings with tiebreakers

### T-024 Public bracket page [COMPLETED]
- [x] Live elimination bracket display

---

## Epic 3 — Registration and waivers

### T-030 Registration form UI [COMPLETED]
- [x] Dynamic team signup form

### T-031 Registration backend logic [COMPLETED]
- [x] DB persistence and validation

### T-032 Waiver capture [COMPLETED]
- [x] Digital waiver acceptance tracking

### T-033 Registration confirmation page [COMPLETED]
- [x] Success state after checkout

---

## Epic 4 — Payments

### T-040 Stripe integration setup [COMPLETED]
- [x] Stripe Checkout session creation

### T-041 Stripe webhook handler [COMPLETED]
- [x] Success listener to mark teams as "Paid"

### T-042 Refund/cancel support [COMPLETED]
- [x] Automated Stripe refund trigger in admin dashboard

---

## Epic 5 — Admin event management

### T-050 Admin dashboard shell [COMPLETED]
- [x] Global sidebar and navigation

### T-051 Event create/edit form [COMPLETED]
- [x] Multi-step event management form

### T-052 Division management [COMPLETED]
- [x] CRUD for tournament divisions

### T-053 Registrations management screen [COMPLETED]
- [x] Team lists and manual status edits

---

## Epic 6 — Check-in and event-day control

### T-060 Check-in screen [COMPLETED]
- [x] Rapid check-in interface for morning-of operations

### T-061 Partner edit / emergency fix tool [COMPLETED]
- [x] Last-minute team data repairs

---

## Epic 7 — Pool generation and standings

### T-070 Manual seeding interface [COMPLETED]
- [x] Drag-and-drop or manual seed entry

### T-071 Pool assignment builder [COMPLETED]
- [x] Automated tournament formatting (3-32 teams)
- [x] Snake draft distribution logic

### T-072 Round-robin match generator [COMPLETED]
- [x] Automated pool match generation

### T-073 Standings calculator [COMPLETED]
- [x] Automatic tiebreaker processing (Wins > Diff > For)

---

## Epic 8 — Bracket generation

### T-080 Bracket seeding from standings [COMPLETED]
- [x] Automated advancement from pool results

### T-081 Single-elimination bracket generator [COMPLETED]
- [x] QF/SF/Finals generation based on team count

### T-082 Bracket display and publish controls [COMPLETED]
- [x] Visibility toggle for elimination rounds

---

## Epic 9 — Score entry and live updates

### T-090 Score entry interface [COMPLETED]
- [x] Fast mobile score input for admins

### T-091 Score processing logic [COMPLETED]
- [x] Automated bracket advancement on score entry

### T-092 Realtime or refresh strategy [COMPLETED]
- [x] Revalidation and realtime DB updates

---

## Epic 10 — Announcements and communication

### T-100 Admin announcements tool [COMPLETED]
- [x] Event update composer

### T-101 Event status banner [COMPLETED]
- [x] Prominent urgent notices on public pages

### T-102 Advertiser / Sponsor management [COMPLETED]
- [x] Logo management and display ordering

---

## Epic 11 — Quality, testing, and polish

### T-110 Validation and error handling [COMPLETED]
- [x] Refine edge case error messages
- [x] Added server-side registration validation (duplicates/format)

### T-111 Core test suite [COMPLETED]
- [x] Setup Playwright E2E infrastructure
- [x] Added homepage and registration flow tests

### T-112 Mobile usability pass [COMPLETED]
- [x] Verified responsiveness for check-in and scores

### T-113 Pilot event simulation [COMPLETED]
- [x] Run full 8-team simulation script
- [x] Verified pool generation, standings, and bracket advancement
