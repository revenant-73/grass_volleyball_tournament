import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function checkEvent828() {
  const slug = 'pilot-simulation-828'
  const { data: event } = await supabase.from('events').select('*').eq('slug', slug).single()
  
  if (!event) {
    console.log('Event not found')
    return
  }
  
  console.log('Event 828 ID:', event.id)
  
  const { data: divisions } = await supabase.from('divisions').select('*').eq('event_id', event.id)
  console.log('Divisions:', divisions?.length)
  
  for (const div of divisions || []) {
    const { count: teamCount } = await supabase.from('teams').select('*', { count: 'exact', head: true }).eq('division_id', div.id)
    const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true }).eq('division_id', div.id)
    console.log(`- Division: ${div.name}, Teams: ${teamCount}, Matches: ${matchCount}`)
  }
}

checkEvent828()
