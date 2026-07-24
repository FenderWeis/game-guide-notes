import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  if (!supabaseUrl.startsWith('https://')) {
    throw new Error('Invalid Supabase URL. Must start with https://')
  }

  try {
    return createClientComponentClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}
