'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Plus, Edit, Trash2 } from 'lucide-react'

export default function AdminGuidesPage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [guides, setGuides] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchGuides = async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .order('created_at', { ascending: false })

      if (!error && data) {
        setGuides(data)
      }
      setLoading(false)
    }

    fetchGuides()
  }, [supabase])

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这篇攻略吗？')) return
    await supabase.from('guides').delete().eq('id', id)
    setGuides(guides.filter((g) => g.id !== id))
  }

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">攻略管理</h1>
        <a
          href="/admin/guides/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>新建攻略</span>
        </a>
      </div>

      {loading ? (
        <p className="text-gray-500">加载中...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  标题
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  创建时间
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {guides.map((guide) => (
                <tr key={guide.id}>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">
                    {guide.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(guide.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <a
                        href={`/admin/guides/${guide.id}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-5 h-5" />
                      </a>
                      <button
                        onClick={() => handleDelete(guide.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {guides.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无攻略</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}