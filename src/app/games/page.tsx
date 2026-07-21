import { createServerClient } from '@/lib/supabase/server'
import GameCard from '@/components/Game/GameCard'

export default async function GamesPage() {
  const supabase = createServerClient()

  const { data: games, error } = await supabase
    .from('games')
    .select('id, name, cover, description')
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching games:', error)
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">加载失败，请稍后重试</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">游戏百科</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {!games || games.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">暂无游戏内容</p>
        </div>
      ) : null}
    </div>
  )
}