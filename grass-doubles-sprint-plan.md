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

---

## Sprint 1 — Data model + admin shell [COMPLETED]
**Goal:** create the foundation that everything else depends on.

### Tickets
- [x] T-010 Create database schema
- [x] T-011 Seed sample data
- [x] T-012 Admin authentication
- [x] T-013 Role-based access control
- [x] T-050 Admin dashboard shell

### Deliverable
- [x] Admin can log in
- [x] Admin can see dashboard shell
- [x] Database is stable enough to build on
- [x] Fake data exists for testing UI

---

## Sprint 2 — Event creation + public event pages [COMPLETED]
**Goal:** make the platform capable of publishing an event.

### Tickets
- [x] T-051 Event create/edit form
- [x] T-052 Division management
- [x] T-020 Public homepage
- [x] T-021 Public event detail page
- [x] T-100 Admin announcements tool
- [x] T-101 Event status banner
- [x] T-102 Advertiser / Sponsor management

### Deliverable
- [x] Admin can create an event
- [x] Admin can add divisions
- [x] Public can view event page
- [x] Announcements show publicly

---

## Sprint 3 — Registration + waiver + payment [COMPLETED]
**Goal:** allow teams to actually sign up and pay.

### Tickets
- [x] T-030 Registration form UI
- [x] T-031 Registration backend logic
- [x] T-032 Waiver capture
- [x] T-040 Stripe integration setup
- [x] T-041 Stripe webhook handler
- [x] T-033 Registration confirmation page
- [x] T-042 Refund/cancel support (Stripe Automated)

### Deliverable
- [x] Team can register
- [x] Waiver is captured
- [x] Payment succeeds
- [x] Team shows up as paid in admin
- [x] Admin can trigger Stripe refunds

---

## Sprint 4 — Team management + check-in + pool logic [COMPLETED]
**Goal:** make event-day prep functional.

### Tickets
- [x] T-053 Registrations management screen
- [x] T-060 Check-in screen
- [x] T-061 Partner edit / emergency fix tool
- [x] T-070 Manual seeding interface
- [x] T-071 Pool assignment builder
- [x] T-072 Round-robin match generator
- [x] T-073 Standings calculator

### Deliverable
- [x] Admin can manage teams
- [x] Check-in works
- [x] Pools can be built
- [x] Matches generate
- [x] Standings calculate

---

## Sprint 5 — Bracket + score entry + public live pages [COMPLETED]
**Goal:** run the actual tournament from first match to final.

### Tickets
- [x] T-080 Bracket seeding from standings
- [x] T-081 Single-elimination bracket generator
- [x] T-082 Bracket display and publish controls
- [x] T-090 Score entry interface
- [x] T-091 Score processing logic
- [x] T-022 Public schedule page
- [x] T-023 Public standings page
- [x] T-024 Public bracket page
- [x] T-092 Realtime or refresh strategy

### Deliverable
- [x] Admin enters scores
- [x] Standings update
- [x] Bracket generates and advances
- [x] Public can follow event live

---

## Sprint 6 — Hardening + launch prep [COMPLETED]
**Goal:** make it stable enough for real use.

### Tickets
- [x] T-110 Validation and error handling
- [x] T-111 Core test suite
- [x] T-112 Mobile usability pass
- [x] T-113 Pilot event simulation

### Deliverable
- [x] Cleaner UX
- [x] Fewer silent failures
- [x] Tested event simulation
- [x] Launch checklist
- [x] E2E Playwright infrastructure
