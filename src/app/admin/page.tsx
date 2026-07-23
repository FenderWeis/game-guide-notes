'use client'

import { Gamepad2, FileText, Plus, Tags, Users } from 'lucide-react'
import { useUserRole, hasPermission } from '@/hooks/useUserRole'

export default function AdminPage() {
  const { role, loading } = useUserRole()

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">加载中...</p>
      </div>
    )
  }

  if (!role) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  const canAccessAdmin = hasPermission(role, ['senior', 'admin'])
  const canManageUsers = hasPermission(role, ['admin'])

  if (!canAccessAdmin) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">您没有权限访问管理后台</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">管理后台</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">攻略管理</h3>
              <p className="text-gray-500 text-sm">管理所有攻略内容</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/guides"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              查看攻略
            </a>
            <a
              href="/admin/guides/new"
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              新建攻略
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">游戏管理</h3>
              <p className="text-gray-500 text-sm">管理游戏百科内容</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/games"
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
            >
              查看游戏
            </a>
            <a
              href="/admin/games/new"
              className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4" />
              添加游戏
            </a>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Tags className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">资料类型管理</h3>
              <p className="text-gray-500 text-sm">管理游戏资料分类</p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href="/admin/categories"
              className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm text-center"
            >
              管理类型
            </a>
          </div>
        </div>

        {canManageUsers && (
          <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800">用户管理</h3>
                <p className="text-gray-500 text-sm">管理网站用户和权限</p>
              </div>
            </div>
            <div className="flex gap-3">
              <a
                href="/admin/users"
                className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm text-center"
              >
                管理用户
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}