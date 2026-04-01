# Grass Doubles Tournament Platform — MVP Spec

## 1. Product goal

**Core promise:**  
A mobile-first platform that lets you create and run a **grass doubles tournament** from signup to final results.

**Who it serves:**
- **Admin:** creates event, builds schedule, manages teams, enters/fixes results
- **Team captain/player:** registers team, signs waiver, checks event details
- **Spectator/public:** views schedule, standings, bracket, and live results

**Not in MVP:**
- player rankings
- recruiting
- memberships
- long-term player profiles
- insurance document workflows
- complex ref/work assignment logic
- multi-sport support
- indoor-specific roster complexity

---

## 2. MVP feature set

### A. Public event experience
- Event landing page
- Division list
- Event details: date, location, cost, format, check-in time, start time
- Registration button
- Public schedule/results page
- Standings page
- Bracket page
- QR code link to event page (downloadable for admin)
- Advertiser / Sponsor logos and links

### B. Team registration
- Team/captain signup
- Partner info
- Payment
- Waiver acceptance
- Confirmation page
- Waitlist if division fills

### C. Admin operations
- Create/edit event (including banner upload)
- Create divisions
- Set max teams and pricing
- View registrations
- Mark teams paid / unpaid / waitlisted
- Check teams in
- Generate pools
- Generate bracket
- Enter scores
- Edit/correct scores
- Publish live results
- Advertiser / Sponsor management

### D. Basic notifications
- Confirmation email or on-screen confirmation
- Optional SMS later
- Admin announcement area on event page

---

## 3. Core user flows

### Flow 1: Admin creates event
1. Admin logs in
2. Creates event
3. Adds division settings
4. Publishes registration
5. Shares event link

### Flow 2: Team registers
1. Captain opens event page
2. Selects division
3. Enters team info
4. Accepts waiver
5. Pays entry fee
6. Receives confirmation
7. Team appears in admin dashboard

### Flow 3: Admin runs event
1. Opens check-in screen
2. Marks teams checked in
3. Handles no-shows / drops
4. Generates pools and schedule
5. Publishes schedule
6. Enters scores during event
7. Publishes bracket
8. Enters bracket results
9. Marks event complete

### Flow 4: Public follows event
1. Opens event page from QR or link
2. Sees today’s schedule
3. Sees standings update
4. Sees bracket update
5. Sees final results

---

## 4. Screens and pages

### Public pages

#### Home page
**Purpose:** explain product or list upcoming events

**Must include:**
- branded header
- upcoming events list
- link to each event
- simple “register/view results” CTA

#### Event page
**Purpose:** main hub for one tournament

**Must include:**
- event title
- banner image
- date/time/location
- format summary
- registration status
- division list
- cost
- waiver/policies link
- registration button
- event announcements
- sponsor logos / links
- tabs or buttons for schedule / standings / bracket

#### Registration page
**Purpose:** capture team registration

**Fields:**
- division
- team name
- captain first/last name
- captain email
- captain phone
- partner first/last name
- partner email
- optional partner phone
- city/club optional
- emergency contact optional
- waiver checkbox / typed signature
- agree to policies checkbox

#### Payment success page
**Purpose:** confirm payment and next steps

**Must include:**
- confirmation status
- team name
- division
- amount paid
- what to do next
- link back to event

#### Public schedule/results page
**Purpose:** real-time event tracking

**Must include:**
- court list
- round/match list
- team names
- scores
- match status: upcoming/live/final

#### Standings page
**Purpose:** simple pool standings

**Must include:**
- pool name
- wins/losses
- point differential or tiebreak metric
- seed/advancement status

#### Bracket page
**Purpose:** show elimination stage

**Must include:**
- bracket diagram or clean round list
- current/upcoming/completed matches
- winners advancing

### Admin pages

#### Admin dashboard
**Purpose:** control center

**Must include:**
- event summary
- number registered
- paid/unpaid counts
- waitlist count
- quick links to teams, check-in, pools, scores

#### Create/edit event page
**Fields:**
- event name
- slug
- date
- location name
- address
- description
- registration open/close dates
- check-in time
- first serve time
- event status: draft/open/closed/live/complete

#### Division settings page
**Fields:**
- division name
- gender/coed option
- skill level label
- team cap
- price
- waitlist enabled
- format type
- number of pools
- teams advance to bracket
- tiebreak order

#### Registrations page
**Purpose:** manage all teams

**Actions:**
- search/filter teams
- mark paid/unpaid
- move to waitlist
- refund/cancel
- edit team info
- export list

#### Check-in page
**Purpose:** event morning control

**Actions:**
- checked in / not checked in
- late / withdrawn
- notes
- partner swap edit if needed

#### Pools page
**Purpose:** assign and generate matches

**Actions:**
- seed teams manually
- randomize
- drag into pools
- generate round-robin matches
- assign courts and rounds
- manually edit match order

#### Bracket page
**Purpose:** create elimination phase

**Actions:**
- seed bracket from standings
- manual reseed override
- create single-elimination bracket
- optional third-place match toggle later
- publish bracket

#### Score entry page
**Purpose:** fast event-day updates

**Actions:**
- select match
- enter score
- mark complete
- correct score
- flag dispute
- auto-update standings/bracket

#### Announcements page
**Purpose:** post important updates

**Actions:**
- post message
- pin urgent message
- mark weather delay
- publish to public event page

---

## 5. Database MVP

### Tables

#### users
- id
- name
- email
- role

#### events
- id
- name
- slug
- description
- banner_url
- date_start
- date_end
- location_name
- location_address
- check_in_time
- start_time
- registration_open_at
- registration_close_at
- status

#### sponsors
- id
- event_id
- name
- logo_url
- website_url
- display_order

#### divisions
- id
- event_id
- name
- level
- format_type
- team_cap
- price_cents
- waitlist_enabled
- bracket_type
- teams_advance_count
- tiebreak_rules_json

#### teams
- id
- division_id
- team_name
- captain_name
- captain_email
- captain_phone
- partner_name
- partner_email
- partner_phone
- club_name optional
- city optional
- status

#### waivers
- id
- event_id
- team_id
- captain_signed_name
- captain_signed_at
- waiver_version
- ip_address optional

#### payments
- id
- team_id
- division_id
- stripe_checkout_session_id
- stripe_payment_intent_id
- amount_cents
- currency
- payment_status
- paid_at

#### check_ins
- id
- team_id
- event_id
- checked_in_at
- checked_in_by
- status
- notes

#### pools
- id
- division_id
- name
- display_order

#### pool_assignments
- id
- pool_id
- team_id
- seed

#### matches
- id
- division_id
- stage_type
- pool_id nullable
- bracket_round nullable
- team_1_id
- team_2_id
- team_1_score
- team_2_score
- court
- round_number
- scheduled_time nullable
- status
- winner_team_id nullable
- source_match_1_id nullable
- source_match_2_id nullable

#### announcements
- id
- event_id
- message
- is_urgent
- published_at
- published_by

---

## 6. Business rules

### Registration rules
- registration closes automatically at deadline or when division is full
- teams beyond cap go to waitlist if enabled
- registration is not complete until payment succeeds
- waiver must be accepted before registration finalization

### Check-in rules
- only checked-in teams can be seeded into final schedule
- withdrawn teams cannot appear in generated matches
- admin can replace or edit a partner before schedule lock

### Pool rules
- admin can seed manually
- admin can randomize
- each pool generates round-robin matches
- standings sort by:
  1. match wins
  2. head-to-head if valid
  3. point differential
  4. points scored
  5. admin override

### Bracket rules
- bracket generated from published pool standings
- admin can override seeds before publishing
- single elimination only for MVP

### Score rules
- only admin/scorekeeper role can submit scores
- completed score auto-updates standings
- score correction re-runs standings/bracket logic

---

## 7. Tournament formats supported in MVP

### Version 1 formats
- 4-team pool, round robin
- 2 pools of 4 into bracket
- 3 pools of 4 into bracket later only if needed
- straight 8-team single elimination bracket

### Skip for now
- double elimination
- true AVP-style exotic formats
- multiple divisions sharing one complex crossover engine
- work-team assignments
- consolation labyrinths

---

## 8. Admin controls that matter most

These are the make-or-break controls:
- edit team names fast
- mark a no-show instantly
- withdraw a team without breaking everything
- reseed manually
- move a match to another court
- correct a bad score
- post one urgent event-wide message

If those are clunky, the platform will feel bad no matter how pretty it looks.

---

## 9. MVP API / logic modules

### Needed logic modules
- registration service
- payment webhook handler
- waiver recorder
- pool generator
- standings calculator
- bracket generator
- score processor
- announcement publisher

### Route groups/pages
Suggested route shape:
- `/`
- `/events`
- `/events/[slug]`
- `/events/[slug]/register`
- `/events/[slug]/schedule`
- `/events/[slug]/standings`
- `/events/[slug]/bracket`
- `/admin`
- `/admin/events/[id]`
- `/admin/events/[id]/divisions`
- `/admin/events/[id]/teams`
- `/admin/events/[id]/check-in`
- `/admin/events/[id]/pools`
- `/admin/events/[id]/bracket`
- `/admin/events/[id]/scores`
- `/api/stripe/webhook`

---

## 10. MVP design requirements

### Public side
- mobile-first
- readable outdoors
- large buttons
- fast load
- no login required
- one-tap access to schedule/results

### Admin side
- no buried controls
- bulk actions where useful
- score entry optimized for phone
- check-in optimized for tablet

### Visual tone
- modern
- calm
- athletic
- not corporate sludge
- not cluttered

---

## 11. Testing plan for MVP

### Registration testing
- valid registration succeeds
- division cap enforced
- waitlist works
- duplicate team attempts handled
- unpaid team not marked complete

### Payment testing
- successful Stripe payment
- cancelled checkout
- failed payment
- duplicate webhook
- refund updates status correctly

### Waiver testing
- waiver saved with timestamp/version
- cannot finalize registration without waiver

### Pool testing
- 4-team round robin generates correctly
- 2 pools of 4 generate correctly
- team withdrawal before publish works
- standings sort correctly under ties

### Bracket testing
- seeds import from standings
- manual reseed works
- winners advance correctly

### Score testing
- score entry updates standings
- score correction reverts/recalculates correctly
- public pages refresh correctly

### Event-day simulation
Run fake tournaments with:
- 8 teams
- one no-show
- one late team
- one corrected score
- one weather-delay announcement

If the admin can’t fix each problem in under two minutes, the flow still needs work.

---

## 12. Definition of “MVP done”

The MVP is done when you can run **one real grass doubles event** on it without needing a spreadsheet as the primary tool.

That means:
- teams can register and pay
- waivers are captured
- you can check teams in
- you can generate pools and bracket
- you can enter scores live
- the public can follow results on mobile
- you can survive one or two inevitable event-day problems without panic

---

## 13. Post-MVP priorities

### Priority 1
- SMS alerts
- QR code court score entry
- CSV export
- printable check-in sheet
- reusable event templates

### Priority 2
- sponsor blocks on event page
- coupon codes
- waitlist auto-promotion
- photo gallery
- staff roles per event

### Priority 3
- more format flexibility
- multiple simultaneous divisions
- self-service captain edits before deadline

---

## 14. Recommended build sequence

1. Database schema  
2. Auth/admin shell  
3. Event creation  
4. Registration form  
5. Stripe integration  
6. Waiver capture  
7. Team management  
8. Check-in flow  
9. Pool generator  
10. Standings logic  
11. Bracket generator  
12. Score entry  
13. Public event pages  
14. Announcements  
15. Polish

Do it in that order.
