import { createClient } from '@supabase/supabase-js'
import { env, isSupabaseConfigured } from './env.js'

let supabase = null

if (isSupabaseConfigured) {
  try {
    supabase = createClient(env.SUPABASE_URL, env.SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
    console.log('[Supabase] Supabase client initialized successfully.')
  } catch (error) {
    console.warn('[Supabase] Failed to initialize Supabase client:', error.message)
  }
} else {
  console.warn(
    '[Supabase] Warning: SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY are not configured.\n' +
    '           Database operations will be unavailable until valid Supabase credentials are provided in server/.env.'
  )
}

export { supabase }
