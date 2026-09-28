import dotenv from 'dotenv'

dotenv.config()

const supabaseKey =
  process.env.SUPABASE_SECRET_KEY ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  ''

export const env = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  SUPABASE_URL: process.env.SUPABASE_URL || '',
  SUPABASE_KEY: supabaseKey,
  SUPABASE_SERVICE_ROLE_KEY: supabaseKey,
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_key_change_in_production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '24h',
}

export const isSupabaseConfigured = Boolean(
  env.SUPABASE_URL &&
  env.SUPABASE_KEY &&
  !env.SUPABASE_URL.includes('your-project.supabase.co') &&
  !env.SUPABASE_KEY.includes('your-supabase-service-role-key')
)

