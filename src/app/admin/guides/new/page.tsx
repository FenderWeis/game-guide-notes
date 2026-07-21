'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { ArrowLeft, Image as ImageIcon, Link2, Bold, Italic, List, ListOrdered, Heading1, Heading2 } from 'lucide-react'

export default function NewGuidePage() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [title, setTitle] = useState('')
  const [gameId, setGameId] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [games, setGames] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder: '开始编写攻略...',
      }),
    ],
    content: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      const { data: gamesData } = await supabase.from('games').select('id, name')
      const { data: categoriesData } = await supabase.from('categories').select('id, name')

      if (gamesData) setGames(gamesData)
      if (categoriesData) setCategories(categoriesData)
    }

    fetchData()
  }, [supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title || !gameId || !categoryId || !editor?.getHTML()) {
      alert('请填写完整信息')
      return
    }

    await supabase.from('guides').insert({
      title,
      content: editor.getHTML(),
      game_id: gameId,
      category_id: categoryId,
      author_id: user?.id,
      likes: 0,
    })

    window.location.href = '/admin/guides'
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const { data, error } = await supabase.storage
      .from('images')
      .upload(`guides/${Date.now()}-${file.name}`, file)

    if (!error && data) {
      const { data: publicUrl } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)

      editor?.chain().focus().setImage({ src: publicUrl.publicUrl }).run()
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

      <h1 className="text-3xl font-bold text-gray-800 mb-8">新建攻略</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="输入攻略标题"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              游戏
            </label>
            <select
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">选择游戏</option>
              {games.map((game) => (
                <option key={game.id} value={game.id}>
                  {game.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              攻略类型
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">选择类型</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            内容
          </label>
          {editor && (
            <div className="border border-gray-300 rounded-lg overflow-hidden">
              <div className="flex items-center gap-1 p-2 bg-gray-50 border-b border-gray-300">
                <button
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Bold className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Italic className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Heading1 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Heading2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleBulletList().run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <List className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().toggleOrderedList().run()}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <ListOrdered className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    const previousUrl = editor.getAttributes('link').href
                    const url = window.prompt('Enter URL:', previousUrl || '')
                    if (url === null) return
                    if (url === '') {
                      editor.chain().focus().extendMarkRange('link').unsetLink().run()
                      return
                    }
                    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
                  }}
                  className="p-2 hover:bg-gray-200 rounded"
                >
                  <Link2 className="w-4 h-4" />
                </button>
                <label className="p-2 hover:bg-gray-200 rounded cursor-pointer">
                  <ImageIcon className="w-4 h-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <EditorContent editor={editor} className="p-4 min-h-[400px]" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          发布攻略
        </button>
      </form>
    </div>
  )
}