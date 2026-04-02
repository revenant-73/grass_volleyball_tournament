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

async function checkTeams() {
  const divisionId = 'b21018a1-12c4-43a0-9f44-967d12d0bc28'
  const { data: teams } = await supabase.from('teams').select('*').eq('division_id', divisionId)
  console.log('Teams in Mens Open:', teams?.length)
  console.log(teams?.map(t => ({ id: t.id, name: t.team_name, status: t.status })))
}

checkTeams()
