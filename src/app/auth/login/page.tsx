'use client'

import { useState } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ArrowLeft, LogIn, UserPlus } from 'lucide-react'

export default function LoginPage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [mode, setMode] = useState<'login' | 'register'>('login')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          setError(error.message || '登录失败，请检查邮箱和密码')
        }
      } else {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) {
          setError(error.message || '注册失败，请检查邮箱和密码')
        }
      }
    } catch (err: any) {
      if (err.message?.includes('fetch failed')) {
        setError('网络连接失败，请检查网络设置或关闭代理/VPN')
      } else {
        setError(err.message || '操作失败，请稍后重试')
      }
    } finally {
      setLoading(false)
    }
  }

  if (user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <p className="text-gray-500 text-center">您已登录，正在跳转...</p>
        {(() => {
          setTimeout(() => {
            window.location.href = '/'
          }, 1000)
          return null
        })()}
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-8"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {mode === 'login' ? (
              <LogIn className="w-8 h-8 text-blue-600" />
            ) : (
              <UserPlus className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-800">
            {mode === 'login' ? '欢迎回来' : '创建账号'}
          </h1>
          <p className="text-gray-500 mt-2">
            {mode === 'login' ? '登录您的账号' : '创建新账号开始使用'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入邮箱"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="请输入密码"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? '加载中...' : (mode === 'login' ? '登录' : '注册')}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            {mode === 'login' ? '还没有账号？去注册' : '已有账号？去登录'}
          </button>
        </div>
      </div>
    </div>
  )
}