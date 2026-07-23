'use client'

import { useEffect, useState } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import type { User } from '@/types'

/**
 * 获取当前用户角色的自定义 Hook
 * @returns 当前用户角色和加载状态
 */
export function useUserRole() {
  const supabase = useSupabaseClient()
  const authUser = useUser()
  const [role, setRole] = useState<'user' | 'senior' | 'admin' | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUserRole = async () => {
      // 用户未登录，返回 null
      if (!authUser) {
        setRole(null)
        setLoading(false)
        return
      }

      try {
        // 查询用户角色
        const { data, error } = await supabase
          .from('users')
          .select('role')
          .eq('id', authUser.id)
          .single()

        // 如果用户不存在，自动创建用户记录
        if (error || !data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert([{ id: authUser.id, email: authUser.email, role: 'user' }])
          
          if (!insertError) {
            setRole('user')
          }
        } else {
          setRole(data.role as 'user' | 'senior' | 'admin')
        }
      } catch (err) {
        console.error('Error fetching user role:', err)
        setRole(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUserRole()
  }, [authUser, supabase])

  return { role, loading }
}

export function useCurrentUser() {
  const supabase = useSupabaseClient()
  const authUser = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      if (!authUser) {
        setUser(null)
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('id, email, role, created_at')
          .eq('id', authUser.id)
          .single()

        if (error || !data) {
          const { data: inserted, error: insertError } = await supabase
            .from('users')
            .insert([{ id: authUser.id, email: authUser.email, role: 'user' }])
            .select()
          
          if (!insertError && inserted && inserted.length > 0) {
            setUser(inserted[0])
          }
        } else {
          setUser(data)
        }
      } catch (err) {
        console.error('Error fetching user:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [authUser, supabase])

  return { user, loading }
}

export function hasPermission(role: string | null, requiredRoles: ('user' | 'senior' | 'admin')[]) {
  if (!role) return false
  return requiredRoles.includes(role as 'user' | 'senior' | 'admin')
}
