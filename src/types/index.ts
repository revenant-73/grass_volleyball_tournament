export type EventStatus = 'draft' | 'open' | 'closed' | 'live' | 'complete'

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
  tiebreak_rules_json: Record<string, unknown> | null
  created_at: string
}
