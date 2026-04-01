# Grass Doubles Tournament Platform — Sprint Plan

Assumption: **1 builder**, part-time to steady pace, with AI help.  
Sprint length: **2 weeks**.  
Target: **usable MVP by end of Sprint 5**, buffer/polish in Sprint 6.

---

## Sprint 0 — Setup and decisions [COMPLETED]
**Goal:** remove ambiguity before real build starts.

### Tickets
- [x] T-001 Project repository setup
- [x] T-002 Deployment setup
- [x] T-003 Supabase project setup

### Added planning tasks
- [x] Lock MVP scope
- [x] Confirm supported formats:
  - 4-team pool
  - 2 pools of 4
  - 4-team and 8-team single elim
- [x] Define status enums
- [x] Use Supabase Realtime for instant public standings/bracket updates

### Deliverable
- [x] Running app
- [x] Connected database
- [x] Clean repo structure
- [x] No more product ambiguity

### Risk
- Starting UI before data model is settled

---

## Sprint 1 — Data model + admin shell [COMPLETED]
**Goal:** create the foundation that everything else depends on.

### Tickets
- [x] T-010 Create database schema
- [x] T-011 Seed sample data
- [x] T-012 Admin authentication
- [x] T-013 Role-based access control
- [x] T-050 Admin dashboard shell

### Stretch
- [ ] T-051 Event create/edit form

### Deliverable
- [x] Admin can log in
- [x] Admin can see dashboard shell
- [x] Database is stable enough to build on
- [x] Fake data exists for testing UI

### Must test
- [x] Auth works
- [x] Protected routes work
- [x] Sample event data renders correctly
- [x] Role restrictions work

### Exit criteria
- [x] You can log in and see an admin dashboard tied to real DB data

---

## Sprint 2 — Event creation + public event pages
**Goal:** make the platform capable of publishing an event.

### Tickets
- T-051 Event create/edit form
- T-052 Division management
- T-020 Public homepage
- T-021 Public event detail page
- T-100 Admin announcements tool
- T-101 Event status banner
- T-102 Advertiser / Sponsor management

### Deliverable
- Admin can create an event
- Admin can add divisions
- Public can view event page
- Announcements show publicly

### Must test
- Create/edit event
- Slug routing works
- Division info displays correctly
- Public page handles no divisions gracefully

### Exit criteria
- You can create a real-looking event and share the public link

---

## Sprint 3 — Registration + waiver + payment
**Goal:** allow teams to actually sign up and pay.

### Tickets
- T-030 Registration form UI
- T-031 Registration backend logic
- T-032 Waiver capture
- T-040 Stripe integration setup
- T-041 Stripe webhook handler
- T-033 Registration confirmation page

### Stretch
- T-042 Refund/cancel support

### Deliverable
- Team can register
- Waiver is captured
- Payment succeeds
- Team shows up as paid in admin

### Must test
- Successful registration
- Full division → waitlist
- Failed payment
- Duplicate webhook
- Registration blocked without waiver

### Exit criteria
- A real team could sign up and pay without your help

### Risk
- Stripe/webhook state bugs
- Cap/waitlist bugs

---

## Sprint 4 — Team management + check-in + pool logic
**Goal:** make event-day prep functional.

### Tickets
- T-053 Registrations management screen
- T-060 Check-in screen
- T-061 Partner edit / emergency fix tool
- T-070 Manual seeding interface
- T-071 Pool assignment builder
- T-072 Round-robin match generator
- T-073 Standings calculator

### Deliverable
- Admin can manage teams
- Check-in works
- Pools can be built
- Matches generate
- Standings calculate

### Must test
- No-show handling
- Team withdrawal before publish
- Seed edits
- 4-team pool generation
- 2 pools of 4 generation
- Tiebreak logic

### Exit criteria
- You can run pool play for an 8-team tournament in the app

### Risk
- This sprint is heavier than it looks
- Standings logic can quietly break trust fast

---

## Sprint 5 — Bracket + score entry + public live pages
**Goal:** run the actual tournament from first match to final.

### Tickets
- T-080 Bracket seeding from standings
- T-081 Single-elimination bracket generator
- T-082 Bracket display and publish controls
- T-090 Score entry interface
- T-091 Score processing logic
- T-022 Public schedule page
- T-023 Public standings page
- T-024 Public bracket page
- T-092 Realtime or refresh strategy

### Deliverable
- Admin enters scores
- Standings update
- Bracket generates and advances
- Public can follow event live

### Must test
- Pool score entry
- Score correction
- Bracket advancement
- Public page refresh/update
- 8-team full event simulation

### Exit criteria
- You can run one full event without depending on a spreadsheet

### Risk
- Score correction edge cases
- Bracket advancement bugs
- Public page confusion on mobile

---

## Sprint 6 — Hardening + launch prep
**Goal:** make it stable enough for real use.

### Tickets
- T-110 Validation and error handling
- T-111 Core test suite
- T-112 Mobile usability pass
- T-113 Pilot event simulation
- T-042 Refund/cancel support if not done

### Deliverable
- Cleaner UX
- Fewer silent failures
- Tested event simulation
- Launch checklist

### Must test
- Full fake tournament
- Payment edge cases
- Wrong score correction
- Late team change
- One weather-delay announcement
- Mobile usability outdoors

### Exit criteria
- You trust it enough to use at a small live event

---

## Dependencies

### Hard dependencies
- T-010 before almost everything
- T-012 before admin tools
- T-051 before public event page is meaningful
- T-031 before T-040/T-041 matter
- T-070 before T-071
- T-071 before T-072
- T-072 before T-073
- T-073 before T-080
- T-080 before T-081
- T-090 before T-091
- T-091 before public live pages feel complete

### Soft dependencies
- T-100/T-101 can be built earlier or later
- T-042 can wait until hardening
- T-092 can start as simple refresh, then improve later

---

## Priority labels

### P0 — cannot launch without
- T-010, T-012, T-051, T-052
- T-030, T-031, T-032, T-040, T-041
- T-053, T-060
- T-070, T-071, T-072, T-073
- T-080, T-081
- T-090, T-091
- T-022, T-023, T-024
- T-110, T-113

### P1 — should have for sane operation
- T-013
- T-050
- T-061
- T-082
- T-100
- T-101
- T-102
- T-112

### P2 — nice but can slip
- T-011
- T-042
- T-092 if basic refresh works
- T-111 if manual testing is strong at first

---

## Leaner version if you want faster launch

If you want to get to live use faster, cut this for first launch:
- role complexity beyond basic admin
- refunds inside app
- realtime updates
- fancy bracket visualization
- rich announcement tools

Then your first release becomes:
- event creation
- registration/payment/waiver
- team management
- check-in
- pool generation
- standings
- bracket generation
- score entry
- simple public pages

That gets you there faster.

---

## Best sprint review question each cycle

At the end of each sprint, ask:

**“Could this run one more part of a real tournament without a spreadsheet?”**

If the answer is no, the sprint may have produced code but not progress.

---

## Suggested first two weeks, day by day

### Week 1
- Day 1: repo + deploy + Supabase
- Day 2: schema draft
- Day 3: schema finalize + seed data
- Day 4: auth
- Day 5: admin shell

### Week 2
- Day 6: event form
- Day 7: division management
- Day 8: public homepage
- Day 9: event page
- Day 10: cleanup + test + fix

---

## Launch milestone

You are ready for a **small real pilot** when you can:
- create the event
- take payment
- build pools
- enter scores
- publish standings/bracket
- recover from one no-show and one bad score

That is the bar.
