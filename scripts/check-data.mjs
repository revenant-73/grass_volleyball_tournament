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

async function checkData() {
  const { data: events } = await supabase.from('events').select('id, name, slug')
  console.log('Events:', events)

  if (events && events.length > 0) {
    const { data: divisions } = await supabase.from('divisions').select('id, name, event_id').eq('event_id', events[0].id)
    console.log('Divisions for ' + events[0].name + ':', divisions)
  }
}

checkData()
