import { createServerClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'
import BackButton from '@/components/UI/BackButton'
import GameDetailActions from '@/components/Game/GameDetailActions'
import GameDataItemActions from '@/components/Game/GameDataItemActions'

export const dynamic = 'force-dynamic'

interface GameDetailProps {
  params: { id: string }
}

export default async function GameDetailPage({ params }: GameDetailProps) {
  const supabase = createServerClient()

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('*')
    .eq('id', params.id)
    .single()

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const { data: gameData, error: dataError } = await supabase
    .from('game_data')
    .select('id, category_id, title, image, content')
    .eq('game_id', params.id)

  if (gameError) {
    console.error('Error fetching game:', gameError)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">游戏不存在</p>
      </div>
    )
  }

  const getCategoryName = (categoryId: string) => {
    return categories?.find(c => c.id === categoryId)?.name || '未知'
  }

  const getCategoryItemsCount = (categoryId: string) => {
    return gameData?.filter((item: any) => item.category_id === categoryId).length || 0
  }

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <div className="flex items-center gap-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
        ))}
        {halfStar && <Star key="half" className="w-4 h-4 text-yellow-400 fill-yellow-400" style={{ clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)' }} />}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />
        ))}
        <span className="text-sm text-gray-600 ml-2">{rating}</span>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />

      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider mb-4 text-center">游戏介绍</h2>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gray-100 flex items-center justify-center p-4 md:p-6">
              {game?.cover ? (
                <img
                  src={game.cover}
                  alt={game.name}
                  className="w-full h-auto max-h-[400px] object-contain rounded-lg shadow-sm"
                />
              ) : (
                <div className="text-gray-400 text-center py-12">
                  <svg className="w-24 h-24 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  <p>暂无封面</p>
                </div>
              )}
            </div>

            <div className="md:w-2/3 p-6 md:p-8">
              <div className="flex items-start justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{game?.name}</h1>
                {game?.rating && (
                  <div className="flex-shrink-0 ml-4">
                    {renderRatingStars(game.rating)}
                  </div>
                )}
              </div>

              <div className="prose prose-gray max-w-none">
                <p className="text-gray-600 leading-relaxed text-lg">{game?.description || '暂无简介'}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider text-center flex-1">游戏数据详情</h2>
          <GameDetailActions gameId={params.id} />
        </div>

        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {categories?.map((category) => {
            const count = getCategoryItemsCount(category.id)
            return (
              <a
                key={category.id}
                href={`/games/${params.id}/data?type=${category.id}`}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-500 hover:text-blue-600 transition-colors whitespace-nowrap"
              >
                <span>{category.name}</span>
                <span className="text-sm text-gray-400">({count})</span>
              </a>
            )
          })}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gameData?.map((item: any) => {
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <a href={`/games/${params.id}/data/${item.id}`} target="_blank" rel="noopener noreferrer">
                  {item.image && (
                    <div className="h-32 bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </a>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                      {getCategoryName(item.category_id)}
                    </span>
                    <GameDataItemActions gameId={params.id} dataId={item.id} />
                  </div>
                  <h4 className="font-medium text-gray-800 mb-2">
                    <a href={`/games/${params.id}/data/${item.id}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                      {item.title}
                    </a>
                  </h4>
                  <p className="text-gray-500 text-sm line-clamp-2">
                    {item.content?.replace(/<[^>]*>/g, '')?.slice(0, 80)}...
                  </p>
                </div>
              </div>
            )
          }) || (
              <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-sm">
                <p className="text-gray-500">暂无游戏资料</p>
              </div>
            )}
        </div>
      </section>
    </div>
  )
}