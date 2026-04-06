export type EventStatus = 'draft' | 'open' | 'closed' | 'live' | 'complete'
export type TeamStatus = 'pending' | 'paid' | 'waitlisted' | 'withdrawn'

export interface Event {
  id: string
  name: string
  slug: string
  description: string | null
  banner_url: string | null
  date_start: string
  date_end: string
  location_name: string | null
  location_address: string | null
  check_in_time: string | null
  start_time: string | null
  registration_open_at: string | null
  registration_close_at: string | null
  status: EventStatus
  created_at: string
  updated_at: string
  divisions?: Division[]
}

export interface Division {
  id: string
  event_id: string
  name: string
  level: string | null
  format_type: string | null
  team_cap: number | null
  price_cents: number | null
  waitlist_enabled: boolean
  bracket_type: string | null
  teams_advance_count: number | null
  bracket_published: boolean
  tiebreak_rules_json: Record<string, unknown> | null
  created_at: string
  teams?: { count: number }[]
}

export interface Team {
  id: string
  division_id: string
  team_name: string
  captain_name: string
  captain_email: string
  captain_phone: string | null
  partner_name: string | null
  partner_email: string | null
  partner_phone: string | null
  club_name: string | null
  city: string | null
  status: TeamStatus
  manual_seed: number | null
  pool_id?: string | null
  created_at: string
  updated_at: string
  division?: Division
}

export interface Announcement {
  id: string
  event_id: string
  title: string
  content: string
  is_urgent: boolean
  published_at: string
  created_at: string
}

export interface Sponsor {
  id: string
  event_id: string
  name: string
  logo_url: string | null
  website_url: string | null
  display_order: number
  created_at: string
}

export interface Pool {
  id: string
  division_id: string
  name: string
  display_order: number
  court: string | null
  created_at: string
  assignments?: PoolAssignment[]
}

export interface PoolAssignment {
  id: string
  pool_id: string
  team_id: string
  seed: number
  created_at: string
  team?: Team
}

export type MatchStage = 'pool' | 'bracket'
export type MatchStatus = 'upcoming' | 'live' | 'final'

export interface Match {
  id: string
  division_id: string
  stage_type: MatchStage
  pool_id: string | null
  bracket_round: number | null
  team_1_id: string | null
  team_2_id: string | null
  team_1_score: number
  team_2_score: number
  team_1_score_2: number
  team_2_score_2: number
  team_1_score_3: number
  team_2_score_3: number
  sets_won_1: number
  sets_won_2: number
  court: string | null
  round_number: number | null
  scheduled_time: string | null
  status: MatchStatus
  winner_team_id: string | null
  source_match_1_id: string | null
  source_match_2_id: string | null
  created_at: string
  updated_at: string
  team_1?: Team
  team_2?: Team
  pool?: Pool
}
