import { createServerClient } from '@/lib/supabase/server'
import { ArrowUpRight, Clock, Heart } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  let guides: { id: string; title: string; content: string; likes: number; created_at: string }[] = []

  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from('guides')
      .select('id, title, content, game_id, category_id, likes, created_at')
      .order('created_at', { ascending: false })
      .limit(6)
    if (!error && data) {
      guides = data
    }
  } catch (e) {
    console.warn('Database connection skipped:', e)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <h1 className="text-3xl font-bold mb-4">欢迎来到游戏攻略笔记</h1>
          <p className="text-blue-100 text-lg mb-6">
            发现最新最全的游戏攻略，分享你的游戏心得
          </p>
          <div className="flex gap-4">
            <a
              href="/guides"
              className="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              浏览攻略
            </a>
            <a
              href="/games"
              className="px-6 py-3 border-2 border-white text-white rounded-lg font-medium hover:bg-white/10 transition-colors"
            >
              游戏百科
            </a>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">最新攻略</h2>
          <a
            href="/guides"
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            查看全部 <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>

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
      </section>
    </div>
  )
}