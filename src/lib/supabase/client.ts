import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export const createClient = () => {
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

  if (!supabaseUrl.startsWith('https://')) {
    console.warn('Invalid Supabase URL. Must start with https://')
    return {
      from: () => ({
        select: () => ({
          order: async () => ({ data: [], error: null })
        })
      })
    } as any
  }

  try {
    return createClientComponentClient()
  } catch (error) {
    console.error('Failed to create Supabase client:', error)
    throw error
  }
}
