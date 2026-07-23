import { createServerClient } from '@/lib/supabase/server'
import { safeQuery, isNetworkError } from '@/lib/supabase/utils'
import GameCard from '@/components/Game/GameCard'
import ReloadButton from '@/components/UI/ReloadButton'
import { WifiOff } from 'lucide-react'
import type { Game } from '@/types'

export default async function GamesPage() {
  const supabase = createServerClient()

  const { data: games, error, isNetworkError: networkError } = await safeQuery<Game[]>(
    () =>
      supabase
        .from('games')
        .select('id, name, cover, description')
        .order('name', { ascending: true })
  )

  if (error || networkError) {
    console.error('Error fetching games:', error)
    const isNetErr = networkError || isNetworkError(error)

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">游戏百科</h1>

        <div className="flex flex-col items-center justify-center py-16">
          {isNetErr ? (
            <>
              <div className="bg-red-100 rounded-full p-6 mb-4">
                <WifiOff className="w-12 h-12 text-red-500" />
              </div>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">网络连接失败</h2>
              <p className="text-gray-500 mb-6 text-center max-w-md">
                无法连接到游戏数据服务器。请检查您的网络连接，或尝试关闭代理/VPN后重试。
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-700 mb-2">加载失败</h2>
              <p className="text-gray-500 mb-6">获取游戏数据时出现错误，请稍后重试</p>
            </>
          )}
          <ReloadButton />
        </div>
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