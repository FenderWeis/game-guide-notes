'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ArrowLeft, Plus, Edit3, Trash2, Save, X } from 'lucide-react'

interface Category {
  id: string
  name: string
}

export default function CategoryManagementPage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [categories, setCategories] = useState<Category[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingName, setEditingName] = useState('')
  const [newName, setNewName] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name')
    setCategories(data || [])
  }

  const handleAdd = async () => {
    if (!newName.trim()) {
      setMessage({ type: 'error', text: '请输入类型名称' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const { error } = await supabase.from('categories').insert({ name: newName.trim() })

    if (error) {
      setMessage({ type: 'error', text: '添加失败，请重试' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '添加成功！' })
      setTimeout(() => setMessage(null), 3000)
      setNewName('')
      fetchCategories()
    }
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditingName(category.name)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) {
      setMessage({ type: 'error', text: '请输入类型名称' })
      setTimeout(() => setMessage(null), 3000)
      return
    }

    const { error } = await supabase.from('categories').update({ name: editingName.trim() }).eq('id', editingId)

    if (error) {
      setMessage({ type: 'error', text: '修改失败，请重试' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '修改成功！' })
      setTimeout(() => setMessage(null), 3000)
      setEditingId(null)
      setEditingName('')
      fetchCategories()
    }
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setEditingName('')
  }

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`确定要删除类型「${name}」吗？删除后该类型下的所有资料也将被删除。`)) return

    const { error } = await supabase.from('categories').delete().eq('id', id)

    if (error) {
      setMessage({ type: 'error', text: '删除失败，请重试' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '删除成功！' })
      setTimeout(() => setMessage(null), 3000)
      fetchCategories()
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>返回</span>
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-8">资料类型管理</h1>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">新增资料类型</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入类型名称（如：技能、任务、道具）"
          />
          <button
            onClick={handleAdd}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-700">现有类型</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {categories.map((category) => (
            <div key={category.id} className="px-6 py-4 flex items-center justify-between">
              {editingId === category.id ? (
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                    className="px-3 py-1 border border-blue-500 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    autoFocus
                  />
                  <button
                    onClick={handleSaveEdit}
                    className="text-green-600 hover:text-green-700"
                    title="保存"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    className="text-gray-500 hover:text-gray-700"
                    title="取消"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-800">{category.name}</span>
              )}
              {editingId !== category.id && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-gray-400 hover:text-blue-600"
                    title="编辑"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id, category.name)}
                    className="text-gray-400 hover:text-red-600"
                    title="删除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        {categories.length === 0 && (
          <div className="px-6 py-8 text-center text-gray-500">
            暂无资料类型
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>提示：</p>
        <ul className="list-disc list-inside mt-2 space-y-1">
          <li>资料类型用于分类游戏数据（如角色、装备、地图等）</li>
          <li>删除类型后，该类型下的所有资料也将被删除</li>
          <li>建议先创建所有需要的类型，再添加资料</li>
        </ul>
      </div>
    </div>
  )
}