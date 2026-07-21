'use client'

import { useState, useEffect } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Heart, Bookmark, Clock, ArrowLeft } from 'lucide-react'

interface GuideDetailProps {
  params: { id: string }
}

export default function GuideDetailPage({ params }: GuideDetailProps) {
  const supabase = useSupabaseClient()
  const user = useUser()
  const [guide, setGuide] = useState<any>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [likes, setLikes] = useState(0)

  useEffect(() => {
    const fetchGuide = async () => {
      const { data, error } = await supabase
        .from('guides')
        .select('*')
        .eq('id', params.id)
        .single()

      if (!error && data) {
        setGuide(data)
        setLikes(data.likes)
      }
    }

    const checkLike = async () => {
      if (!user) return
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('user_id', user.id)
        .eq('guide_id', params.id)
      setIsLiked(!!data && data.length > 0)
    }

    const checkFavorite = async () => {
      if (!user) return
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('guide_id', params.id)
      setIsFavorited(!!data && data.length > 0)
    }

    fetchGuide()
    checkLike()
    checkFavorite()
  }, [params.id, user, supabase])

  const handleLike = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (isLiked) {
      await supabase
        .from('likes')
        .delete()
        .eq('user_id', user.id)
        .eq('guide_id', params.id)
      setLikes(likes - 1)
    } else {
      await supabase.from('likes').insert({
        user_id: user.id,
        guide_id: params.id,
      })
      setLikes(likes + 1)
    }
    setIsLiked(!isLiked)
  }

  const handleFavorite = async () => {
    if (!user) {
      alert('请先登录')
      return
    }

    if (isFavorited) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('guide_id', params.id)
    } else {
      await supabase.from('favorites').insert({
        user_id: user.id,
        guide_id: params.id,
      })
    }
    setIsFavorited(!isFavorited)
  }

  if (!guide) {
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

      <article>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">{guide.title}</h1>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-6">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{new Date(guide.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            <span>{likes}</span>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={handleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span>点赞</span>
          </button>
          <button
            onClick={handleFavorite}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isFavorited
              ? 'bg-yellow-100 text-yellow-600'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Bookmark className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
            <span>收藏</span>
          </button>
        </div>

        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: guide.content }}
        />
      </article>
    </div>
  )
}