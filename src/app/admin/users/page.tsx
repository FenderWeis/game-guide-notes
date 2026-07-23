'use client'

import { useState, useEffect } from 'react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { User, Trash2, RefreshCw, Check, X } from 'lucide-react'
import BackButton from '@/components/UI/BackButton'
import type { User as UserType } from '@/types'

export default function AdminUsersPage() {
  const supabase = useSupabaseClient()
  const authUser = useUser()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<'user' | 'senior' | 'admin'>('user')
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('users')
        .select('id, email, role, created_at')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching users:', error)
        setMessage('获取用户列表失败')
        setMessageType('error')
      } else {
        setUsers(data || [])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setMessage('获取用户列表失败')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleEditRole = (userId: string, role: string) => {
    setEditingId(userId)
    setNewRole(role as 'user' | 'senior' | 'admin')
  }

  const handleSaveRole = async () => {
    if (!editingId) return

    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole })
        .eq('id', editingId)
      
      if (error) {
        console.error('Error updating role:', error)
        setMessage('修改角色失败')
        setMessageType('error')
      } else {
        setMessage('修改角色成功')
        setMessageType('success')
        setEditingId(null)
        fetchUsers()
      }
    } catch (err) {
      console.error('Error updating role:', err)
      setMessage('修改角色失败')
      setMessageType('error')
    }

    setTimeout(() => setMessage(''), 3000)
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('确定要删除这个用户吗？')) return

    try {
      const { error } = await supabase
        .from('users')
        .delete()
        .eq('id', userId)
      
      if (error) {
        console.error('Error deleting user:', error)
        setMessage('删除用户失败')
        setMessageType('error')
      } else {
        setMessage('删除用户成功')
        setMessageType('success')
        fetchUsers()
      }
    } catch (err) {
      console.error('Error deleting user:', err)
      setMessage('删除用户失败')
      setMessageType('error')
    }

    setTimeout(() => setMessage(''), 3000)
  }

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      user: '普通用户',
      senior: '资深用户',
      admin: '管理员'
    }
    return labels[role] || '未知'
  }

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      user: 'bg-gray-100 text-gray-700',
      senior: 'bg-yellow-100 text-yellow-700',
      admin: 'bg-red-100 text-red-700'
    }
    return colors[role] || 'bg-gray-100 text-gray-500'
  }

  if (!authUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">用户管理</h1>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          刷新
        </button>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${messageType === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">邮箱</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">角色</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">注册时间</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    加载中...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                    暂无用户
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-gray-900">{user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === user.id ? (
                        <div className="flex items-center gap-2">
                          <select
                            value={newRole}
                            onChange={(e) => setNewRole(e.target.value as 'user' | 'senior' | 'admin')}
                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm"
                          >
                            <option value="user">普通用户</option>
                            <option value="senior">资深用户</option>
                            <option value="admin">管理员</option>
                          </select>
                          <button
                            onClick={handleSaveRole}
                            className="p-1 text-green-600 hover:bg-green-100 rounded"
                            title="保存"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                            title="取消"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getRoleColor(user.role)}`}>
                          {getRoleLabel(user.role)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingId !== user.id && (
                        <>
                          <button
                            onClick={() => handleEditRole(user.id, user.role)}
                            className="text-blue-600 hover:text-blue-800 mr-3"
                          >
                            修改角色
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-600 hover:text-red-800 flex items-center gap-1 justify-end"
                          >
                            <Trash2 className="w-4 h-4" />
                            删除
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
