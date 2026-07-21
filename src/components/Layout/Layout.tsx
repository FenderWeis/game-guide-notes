'use client'

import Header from './Header'
import Footer from './Footer'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { createClient } from '@/lib/supabase/client'

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const supabaseClient = createClient()
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