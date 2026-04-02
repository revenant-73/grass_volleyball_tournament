import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function checkPools828() {
  const slug = 'pilot-simulation-828'
  const { data: event } = await supabase.from('events').select('*').eq('slug', slug).single()
  
  const { data: divisions } = await supabase.from('divisions').select('*').eq('event_id', event.id)
  const divId = divisions[0].id
  
  const { data: pools } = await supabase.from('pools').select('*').eq('division_id', divId)
  console.log('Pools:', pools?.map(p => ({ id: p.id, name: p.name })))
  
  const { data: assignments } = await supabase.from('pool_assignments').select('*').in('pool_id', pools.map(p => p.id))
  console.log('Assignments count:', assignments?.length)
}

checkPools828()
