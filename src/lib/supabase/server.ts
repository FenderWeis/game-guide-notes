import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const createServerClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Will use empty client.')
    return {
      from: () => ({
        select: () => ({
          order: async () => ({ data: [], error: null })
        })
      })
    } as any
  }

  try {
    return createServerComponentClient({ cookies })
  } catch (error) {
    console.error('Failed to create Supabase server client:', error)
    throw error
  }
}
