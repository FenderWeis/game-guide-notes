'use client'

import { useState } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { User, LogIn, LogOut } from 'lucide-react'

export default function AuthButton() {
  const user = useUser()
  const supabase = useSupabaseClient()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await supabase.auth.signOut()
    setLoading(false)
  }

  if (loading) {
    return <span className="text-gray-400">Loading...</span>
  }

  if (user) {
    return (
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <User className="w-5 h-5" />
        <span>{user.email}</span>
        <LogOut className="w-4 h-4" />
      </button>
    )
  }

  return (
    <button
      onClick={() => (window.location.href = '/auth/login')}
      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <LogIn className="w-5 h-5" />
      <span>登录</span>
    </button>
  )
}