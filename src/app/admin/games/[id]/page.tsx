'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ArrowLeft, Upload } from 'lucide-react'

interface EditGamePageProps {
  params: { id: string }
}

export default function EditGamePage({ params }: EditGamePageProps) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [cover, setCover] = useState<string | null>(null)
  const [game, setGame] = useState<any>(null)

  useEffect(() => {
    const fetchGame = async () => {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setGame(data)
        setName(data.name)
        setDescription(data.description || '')
        setCover(data.cover || null)
      }
    }

    fetchGame()
  }, [params.id, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      alert('请填写游戏名称')
      return
    }

    await supabase.from('games').update({
      name,
      description,
      cover,
    }).eq('id', params.id)

    window.location.href = '/admin/games'
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`games/${Date.now()}-${file.name}`, file)

    if (!error && data) {
      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)
      setCover(publicUrl.publicUrl)
    }
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">请先登录</p>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">加载中...</p>
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

      <h1 className="text-3xl font-bold text-gray-800 mb-8">编辑游戏</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏名称
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入游戏名称"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏简介
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入游戏简介"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            游戏封面
          </label>
          <div className="border border-gray-300 rounded-lg p-8 text-center">
            {cover ? (
              <div>
                <img
                  src={cover}
                  alt="游戏封面"
                  className="max-h-48 mx-auto mb-4 rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => setCover(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  更换图片
                </button>
              </div>
            ) : (
              <label className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">点击上传封面图片</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          更新游戏
        </button>
      </form>
    </div>
  )
}