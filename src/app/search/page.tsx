import { createServerClient } from '@/lib/supabase/server'
import { Heart, Clock, Search } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface SearchPageProps {
  searchParams: { q: string }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const supabase = createServerClient()

  let guides: any[] = []

  if (query.trim()) {
    const { data, error } = await supabase
      .from('guides')
      .select('id, title, content, game_id, category_id, likes, created_at')
      .ilike('title', `%${query}%`)

    if (!error && data) {
      guides = data
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Search className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold text-gray-800">搜索结果</h1>
          <p className="text-gray-500">搜索 "{query}" 的结果</p>
        </div>
      </div>

      {guides.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {guides.map((guide) => (
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
      ) : (
        <div className="text-center py-12">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">没有找到相关攻略</p>
        </div>
      )}
    </div>
  )
}