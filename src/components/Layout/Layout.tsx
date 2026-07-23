'use client'

import { useEffect, useState } from 'react'
import Header from './Header'
import Footer from './Footer'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@/lib/supabase/client'
import { isNetworkError } from '@/lib/supabase/utils'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const [supabaseClient] = useState(() => createClient())

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      if (event === 'TOKEN_REFRESHED' && !session) {
        try {
          await supabaseClient.auth.signOut()
        } catch (error) {
          if (!isNetworkError(error)) {
            console.warn('Failed to sign out after token refresh failure:', error)
          }
        }
      }
    }

    const { data } = supabaseClient.auth.onAuthStateChange(handleAuthStateChange)

    return () => {
      data?.subscription?.unsubscribe()
    }
  }, [supabaseClient])

  useEffect(() => {
    const originalError = console.error

    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || ''
      if (
        message.includes('ERR_PROXY_CONNECTION_FAILED') ||
        message.includes('Failed to fetch') ||
        message.includes('token?grant_type=refresh_token')
      ) {
        return
      }
      originalError.apply(console, args)
    }

    return () => {
      console.error = originalError
    }
  }, [])

  return (
    <SessionContextProvider supabaseClient={supabaseClient}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    </SessionContextProvider>
  )
}