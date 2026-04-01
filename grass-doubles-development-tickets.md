# Grass Doubles Tournament Platform — Development Tickets

## Epic 0 — Product setup

### T-001 Project repository setup
**Goal:** create the base code repository and initial app scaffold.

**Tasks**
- Create Git repo
- Initialize Next.js app with TypeScript
- Add Tailwind CSS
- Add ESLint/Prettier
- Create `.env.example`
- Set up folder structure for app, components, lib, db, types

**Acceptance criteria**
- App runs locally
- Repo pushes successfully
- Basic homepage renders

**Estimate**
- 2–4 hours

---

### T-002 Deployment setup
**Goal:** connect project to deployment environment.

**Tasks**
- Create Vercel project
- Configure environment variables
- Set preview and production environments
- Verify auto-deploy from Git

**Acceptance criteria**
- Main branch deploys successfully
- Preview deploy works from feature branch

**Estimate**
- 1–2 hours

---

### T-003 Supabase project setup
**Goal:** provision backend services.

**Tasks**
- Create Supabase project
- Save project URL and anon/service keys
- Create Supabase Storage buckets (event-banners, sponsor-logos)
- Connect app to Supabase
- Verify DB and Storage connection from app

**Acceptance criteria**
- App can query Supabase successfully
- App can upload/retrieve images from Storage
- Environment variables work locally and in deployment

**Estimate**
- 1–2 hours

---

## Epic 1 — Database and auth

### T-010 Create database schema
**Goal:** create core tables for MVP.

**Tables**
- users
- events
- divisions
- teams
- waivers
- payments
- check_ins
- pools
- pool_assignments
- matches
- announcements

**Tasks**
- Write SQL migrations
- Add indexes
- Add foreign keys
- Add enums/status fields

**Acceptance criteria**
- All tables exist
- Relationships validate
- Sample event and teams can be inserted

**Estimate**
- 4–8 hours

---

### T-011 Seed sample data
**Goal:** load fake data for faster development/testing.

**Tasks**
- Create 1 sample event
- Create 2 sample divisions
- Create 8–12 sample teams
- Create fake matches and announcements

**Acceptance criteria**
- Local dev instance has usable test data
- UI can render with no manual DB setup each time

**Estimate**
- 2–3 hours

---

### T-012 Admin authentication
**Goal:** protect admin tools.

**Tasks**
- Set up Supabase Auth
- Create login page
- Add session handling
- Add protected admin routes
- Add logout flow

**Acceptance criteria**
- Unauthenticated users cannot access admin pages
- Admin can sign in and out successfully

**Estimate**
- 4–6 hours

---

### T-013 Role-based access control
**Goal:** define who can do what.

**Roles**
- super_admin
- event_admin
- scorekeeper

**Tasks**
- Add role field to users
- Add route checks
- Add UI restrictions by role

**Acceptance criteria**
- Scorekeeper cannot edit event settings
- Event admin can manage one event
- Super admin can access all tools

**Estimate**
- 3–5 hours

---

## Epic 2 — Public event experience

### T-020 Public homepage
**Goal:** show upcoming events.

**Tasks**
- Build homepage layout
- Add upcoming events list
- Add empty state when no events exist

**Acceptance criteria**
- Visitors can see available events
- Clicking event opens event detail page

**Estimate**
- 3–5 hours

---

### T-021 Public event detail page
**Goal:** create the main event hub.

**Tasks**
- Display event title, date, location, price, format
- Show division list
- Show registration status
- Show announcements
- Add CTA buttons for register / schedule / standings / bracket

**Acceptance criteria**
- Event page loads correctly from slug
- Users can reach key actions in one tap

**Estimate**
- 5–8 hours

---

### T-022 Public schedule page
**Goal:** show event schedule and results.

**Tasks**
- Build match list grouped by round or court
- Show upcoming/live/final states
- Show scores when available

**Acceptance criteria**
- Spectators can find current and upcoming matches easily
- Completed matches show final scores

**Estimate**
- 4–6 hours

---

### T-023 Public standings page
**Goal:** show pool standings clearly.

**Tasks**
- Display standings by pool
- Show wins/losses
- Show tiebreak metrics
- Highlight advancing teams

**Acceptance criteria**
- Standings update when scores change
- Tiebreak order displays correctly

**Estimate**
- 4–6 hours

---

### T-024 Public bracket page
**Goal:** show elimination bracket.

**Tasks**
- Build bracket display
- Show round labels
- Show winners advancing

**Acceptance criteria**
- Bracket is readable on mobile
- Updates correctly after score entry

**Estimate**
- 5–8 hours

---

## Epic 3 — Registration and waivers

### T-030 Registration form UI
**Goal:** allow team signups.

**Fields**
- division
- team name
- captain name/email/phone
- partner name/email/phone
- optional city/club

**Tasks**
- Build form
- Validate required fields
- Handle division capacity

**Acceptance criteria**
- Valid registrations submit successfully
- Invalid/incomplete forms are blocked

**Estimate**
- 6–10 hours

---

### T-031 Registration backend logic
**Goal:** persist team registrations correctly.

**Tasks**
- Create registration service
- Insert team into DB
- Mark status as pending until payment
- Enforce team cap / waitlist

**Acceptance criteria**
- Team is created correctly in DB
- Full divisions trigger waitlist when enabled

**Estimate**
- 4–6 hours

---

### T-032 Waiver capture
**Goal:** collect waiver acceptance during registration.

**Tasks**
- Add waiver section to registration flow
- Store signed name, timestamp, version
- Require waiver acceptance before payment

**Acceptance criteria**
- Registration cannot complete without waiver
- Waiver record persists correctly

**Estimate**
- 3–5 hours

---

### T-033 Registration confirmation page
**Goal:** confirm successful signup/payment.

**Tasks**
- Build success page
- Show event, team, division, payment summary
- Add next-step instructions

**Acceptance criteria**
- Team sees clear confirmation after checkout
- Page loads from Stripe redirect successfully

**Estimate**
- 2–4 hours

---

## Epic 4 — Payments

### T-040 Stripe integration setup
**Goal:** connect Stripe Checkout.

**Tasks**
- Create Stripe account config
- Build checkout session creator
- Redirect registration flow to Stripe Checkout

**Acceptance criteria**
- Test payment opens Stripe Checkout
- Successful payment returns user to app

**Estimate**
- 4–6 hours

---

### T-041 Stripe webhook handler
**Goal:** track payment status reliably.

**Tasks**
- Create `/api/stripe/webhook`
- Handle checkout completed
- Handle payment success
- Store Stripe IDs and payment status
- Update team registration status

**Acceptance criteria**
- Payment success marks team as paid
- Duplicate webhook delivery does not break state

**Estimate**
- 5–8 hours

---

### T-042 Refund/cancel support
**Goal:** basic admin control for payment reversals.

**Tasks**
- Add payment status display in admin
- Add refund/cancel action placeholder or manual status control
- Ensure refunded team can be withdrawn cleanly

**Acceptance criteria**
- Admin can mark refunded/cancelled state safely
- Team no longer appears as active paid team

**Estimate**
- 3–5 hours

---

## Epic 5 — Admin event management

### T-050 Admin dashboard shell
**Goal:** create central admin workspace.

**Tasks**
- Build admin sidebar/nav
- Add event summary cards
- Add quick links to divisions, teams, scores, bracket

**Acceptance criteria**
- Admin can navigate all core tools easily
- Current event stats display correctly

**Estimate**
- 4–6 hours

---

### T-051 Event create/edit form
**Goal:** allow creation and editing of tournament events.

**Tasks**
- Build multi-step event form
- Add banner image upload to Supabase Storage
- Generate slug from event name
- Implement CRUD logic
- Add QR code generation for the public event URL (downloadable)

**Fields**
- name
- slug
- description
- date
- location
- registration open/close
- check-in time
- start time
- status

**Acceptance criteria**
- Admin can create event
- Admin can edit event
- Slug-based public page resolves correctly

**Estimate**
- 5–8 hours

---

### T-052 Division management
**Goal:** define divisions within an event.

**Fields**
- division name
- level
- format
- team cap
- price
- waitlist enabled
- teams advancing
- tiebreak rules

**Acceptance criteria**
- Admin can add/edit/delete divisions
- Public page reflects current divisions

**Estimate**
- 4–6 hours

---

### T-053 Registrations management screen
**Goal:** manage all team entries in one place.

**Tasks**
- Team table view
- Search/filter
- Edit team details
- Mark paid/unpaid
- Move to waitlist
- Withdraw team

**Acceptance criteria**
- Admin can manage registrations without using DB directly
- Withdrawn teams are clearly labeled

**Estimate**
- 5–8 hours

---

## Epic 6 — Check-in and event-day control

### T-060 Check-in screen
**Goal:** support fast team check-in on event day.

**Tasks**
- Build team list with check-in controls
- Add status options: checked in, late, withdrawn
- Add notes field
- Add filter for unchecked teams

**Acceptance criteria**
- Admin can check teams in quickly from phone/tablet
- No-show teams are easy to identify

**Estimate**
- 4–6 hours

---

### T-061 Partner edit / emergency fix tool
**Goal:** allow last-minute team edits.

**Tasks**
- Allow admin to update partner info
- Log change timestamp
- Prevent accidental edits after bracket publish if needed

**Acceptance criteria**
- Admin can repair a team entry in under 1 minute
- Update does not break schedule logic

**Estimate**
- 2–4 hours

---

## Epic 7 — Pool generation and standings

### T-070 Manual seeding interface
**Goal:** give admin seed control before pool generation.

**Tasks**
- Show registered checked-in teams
- Allow manual seed order
- Add randomize option

**Acceptance criteria**
- Admin can reorder teams easily
- Seeds are saved for later generation

**Estimate**
- 4–6 hours

---

### T-071 Pool assignment builder
**Goal:** place teams into pools.

**Tasks**
- Create pools automatically from seed order
- Allow manual drag/drop or reassignment
- Support MVP formats:
  - 4-team pool
  - 2 pools of 4

**Acceptance criteria**
- Pools generate correctly
- Admin can manually edit assignments

**Estimate**
- 5–8 hours

---

### T-072 Round-robin match generator
**Goal:** generate pool play matches.

**Tasks**
- Create round-robin logic for 4-team pools
- Assign round numbers
- Assign courts
- Store matches in DB

**Acceptance criteria**
- Correct number of matches created
- No duplicate pairings
- Matches display in schedule

**Estimate**
- 6–10 hours

---

### T-073 Standings calculator
**Goal:** compute pool standings.

**Tasks**
- Calculate wins/losses
- Apply tiebreak rules
- Save or compute standings for display

**Acceptance criteria**
- Standings update after each completed match
- Tie scenarios resolve according to rules

**Estimate**
- 5–8 hours

---

## Epic 8 — Bracket generation

### T-080 Bracket seeding from standings
**Goal:** convert pool results into elimination seeds.

**Tasks**
- Pull top teams from standings
- Build seed order
- Allow admin override before publish

**Acceptance criteria**
- Qualified teams seed correctly
- Admin can manually change seeds before bracket creation

**Estimate**
- 4–6 hours

---

### T-081 Single-elimination bracket generator
**Goal:** build bracket structure for MVP.

**Tasks**
- Generate 4-team and 8-team single-elim bracket
- Create bracket matches
- Link source matches for advancement

**Acceptance criteria**
- Bracket structure is valid
- Future winners can advance automatically

**Estimate**
- 6–10 hours

---

### T-082 Bracket display and publish controls
**Goal:** make bracket visible and editable.

**Tasks**
- Add publish/unpublish state
- Show bracket in admin and public views
- Lock or warn before changes after publish

**Acceptance criteria**
- Admin can publish bracket cleanly
- Public sees correct bracket after publish

**Estimate**
- 4–6 hours

---

## Epic 9 — Score entry and live updates

### T-090 Score entry interface
**Goal:** enable rapid score submission.

**Tasks**
- Build match picker
- Input team 1 / team 2 scores
- Mark match complete
- Add edit/correction flow

**Acceptance criteria**
- Admin or scorekeeper can enter scores in seconds
- Completed match updates public results

**Estimate**
- 5–8 hours

---

### T-091 Score processing logic
**Goal:** update downstream systems after scores.

**Tasks**
- Save scores
- Set winner
- Update standings
- Advance bracket winner when applicable

**Acceptance criteria**
- Pool standings update automatically
- Bracket winners advance correctly

**Estimate**
- 5–8 hours

---

### T-092 Realtime or refresh strategy
**Goal:** make public pages feel live.

**Tasks**
- Decide between realtime subscriptions or short polling
- Wire schedule/standings/bracket updates
- Handle stale data gracefully

**Acceptance criteria**
- Public page reflects updates quickly
- Manual refresh is not constantly required

**Estimate**
- 4–6 hours

---

## Epic 10 — Announcements and communication

### T-100 Admin announcements tool
**Goal:** post event updates to public page.

**Tasks**
- Create announcement composer
- Mark urgent vs standard
- Publish to event page
- Order latest announcements first

**Acceptance criteria**
- Admin can post weather or timing updates fast
- Public event page displays them clearly

**Estimate**
- 3–5 hours

---

### T-101 Event status banner
**Goal:** display urgent event-wide notices.

**Tasks**
- Add banner component to event page
- Show urgent announcements prominently
- Support statuses like delay / live / complete

**Acceptance criteria**
- Spectators immediately see major changes
- Banner styling is obvious on mobile

**Estimate**
- 2–4 hours

---

### T-102 Advertiser / Sponsor management
**Goal:** manage and display sponsor logos and links.

**Tasks**
- Create sponsor management interface in admin
- Add logo upload to Supabase Storage (sponsor-logos bucket)
- Implement display order control
- Add sponsors section to public event page
- Track basic click counts (optional)

**Acceptance criteria**
- Admin can add/edit/delete sponsors for an event
- Sponsor logos display correctly on the public event hub
- Logos link to specified sponsor websites

**Estimate**
- 4–6 hours

---

## Epic 11 — Quality, testing, and polish

### T-110 Validation and error handling
**Goal:** prevent obvious breakage.

**Tasks**
- Add server/client validation
- Add useful error messages
- Add fallback UI for missing event/division data

**Acceptance criteria**
- Invalid form submissions fail cleanly
- Users understand what went wrong

**Estimate**
- 4–6 hours

---

### T-111 Core test suite
**Goal:** cover critical business logic.

**Test targets**
- registration caps
- waitlist behavior
- standings calculation
- bracket generation
- score correction logic
- webhook idempotency

**Acceptance criteria**
- Critical flows have automated coverage
- Major logic regressions are caught early

**Estimate**
- 6–10 hours

---

### T-112 Mobile usability pass
**Goal:** make the product work in the real world.

**Tasks**
- Test public pages on phone
- Test admin pages on tablet/phone
- Increase button sizes
- Improve contrast/readability for outdoor use

**Acceptance criteria**
- Schedule/results are easy to use on mobile
- Score entry and check-in work without zooming around

**Estimate**
- 4–6 hours

---

### T-113 Pilot event simulation
**Goal:** simulate one full event before going live.

**Tasks**
- Create test event with 8 teams
- Run fake registration/payment/check-in
- Generate pools
- Enter fake scores
- Generate bracket
- Complete event
- Log every failure/friction point

**Acceptance criteria**
- Entire event can be run without spreadsheet dependency
- All blocking issues documented and prioritized

**Estimate**
- 4–8 hours

---

## Nice-to-have tickets after MVP

### N-200 SMS notifications
- Event reminders
- Delay notices
- Court changes

### N-201 QR code event links
- QR on signage
- QR per court later

### N-202 Printable admin sheets
- Check-in sheet
- Court schedule sheet
- Pool summary

### N-203 Event templates
- Reuse previous setup for future tournaments

### N-204 Coupon codes / discounts
- Promo code support in registration

### N-205 Waitlist auto-promotion
- Auto-offer spots when withdrawals happen

### N-206 Sponsor blocks
- Add sponsor graphics/links to event pages

### N-207 Public “find my team” filter
- Search by team/captain name on event pages

---

## Suggested phase order

### Phase 1 — Foundation
- T-001 to T-013

### Phase 2 — Public and registration
- T-020 to T-042

### Phase 3 — Admin event control
- T-050 to T-061

### Phase 4 — Tournament logic
- T-070 to T-082

### Phase 5 — Live event operation
- T-090 to T-101

### Phase 6 — QA and launch prep
- T-110 to T-113

---

## Recommended first sprint

If you want momentum, start here:
- T-001 Project repository setup
- T-002 Deployment setup
- T-003 Supabase project setup
- T-010 Create database schema
- T-012 Admin authentication
- T-051 Event create/edit form
- T-020 Public homepage
- T-021 Public event detail page

That gets you from “idea” to “I can create and publish an event.”
