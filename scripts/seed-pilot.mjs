import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function seedPilot() {
  const eventSlug = 'pilot-simulation-' + Math.floor(Math.random() * 1000)
  const { data: event, error: eventError } = await supabase
    .from('events')
    .insert({
      name: 'Pilot Simulation ' + eventSlug.split('-').pop(),
      slug: eventSlug,
      status: 'open',
      date_start: '2026-06-01',
      date_end: '2026-06-01'
    })
    .select()
    .single()

  if (eventError) throw eventError

  const { data: division, error: divError } = await supabase
    .from('divisions')
    .insert({
      event_id: event.id,
      name: 'Mens Open',
      level: 'Pro/Open',
      format_type: 'Pool to Bracket',
      team_cap: 16,
      price_cents: 8000
    })
    .select()
    .single()

  if (divError) throw divError

  const teams = []
  for (let i = 1; i <= 8; i++) {
    teams.push({
      division_id: division.id,
      team_name: 'Team ' + i,
      captain_name: 'Captain ' + i,
      captain_email: 'captain' + i + '@example.com',
      status: 'paid'
    })
  }

  const { error: teamError } = await supabase.from('teams').insert(teams)
  if (teamError) throw teamError

  console.log(`Created pilot event: ${event.id}, division: ${division.id}`)
}

seedPilot()
