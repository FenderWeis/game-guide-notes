import { createServerClient } from '@/lib/supabase/server'
import { Heart, Clock } from 'lucide-react'

export default async function GuidesPage() {
  const supabase = createServerClient()

  const { data: guides, error } = await supabase
    .from('guides')
    .select('id, title, content, game_id, category_id, likes, created_at')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching guides:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">加载失败，请稍后重试</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">攻略列表</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {guides?.map((guide) => (
          <article
            key={guide.id}
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => (window.location.href = `/guides/${guide.id}`)}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
              {guide.title}
            </h3>
            <p className="text-gray-500 text-sm mb-4 line-clamp-2">
              {guide.content.replace(/<[^>]*>/g, '').slice(0, 100)}...
            </p>
            <div className="flex items-center justify-between text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{new Date(guide.created_at).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{guide.likes}</span>
              </div>
            </div>
          </article>
        ))}
      </div>

      {!guides || guides.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无攻略内容</p>
        </div>
      ) : null}
    </div>
  )
}