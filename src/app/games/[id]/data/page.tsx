import { createServerClient } from '@/lib/supabase/server'
import BackButton from '@/components/UI/BackButton'
import GameDetailActions from '@/components/Game/GameDetailActions'
import GameDataItemActions from '@/components/Game/GameDataItemActions'

export const dynamic = 'force-dynamic'

interface GameDataListProps {
  params: { id: string }
  searchParams: { type?: string }
}

export default async function GameDataListPage({ params, searchParams }: GameDataListProps) {
  const supabase = createServerClient()

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('name')
    .eq('id', params.id)
    .single()

  const { data: categories, error: catError } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  const selectedCategoryId = searchParams.type

  const { data: gameData, error: dataError } = await supabase
    .from('game_data')
    .select('id, category_id, title, image, content')
    .eq('game_id', params.id)
    .eq('category_id', selectedCategoryId || '')

  const { data: selectedCategory, error: selCatError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', selectedCategoryId)
    .single()

  if (gameError) {
    console.error('Error fetching game:', gameError)
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">游戏不存在</p>
      </div>
    )
  }

  const getCategoryName = (categoryId: string) => {
    return categories?.find((c: { id: string; name: string }) => c.id === categoryId)?.name || '未知'
  }

  const getCategoryItemsCount = (categoryId: string) => {
    return gameData?.filter((item: any) => item.category_id === categoryId).length || 0
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />

      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-gray-500">
          <a href={`/games/${params.id}`} className="hover:text-blue-600">
            {game?.name}
          </a>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800">{selectedCategory?.name || '全部数据'}</span>
        </nav>
        <GameDetailActions gameId={params.id} />
      </div>

      <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
        {categories?.map((category) => {
          const count = getCategoryItemsCount(category.id)
          const isSelected = category.id === selectedCategoryId
          return (
            <a
              key={category.id}
              href={`/games/${params.id}/data?type=${category.id}`}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${isSelected
                ? 'bg-blue-600 text-white'
                : 'bg-white border border-gray-200 hover:border-blue-500 hover:text-blue-600'
                }`}
            >
              <span>{category.name}</span>
              <span className="text-sm opacity-75">({count})</span>
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
                      className="w-full h-full object-contain"
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
              <p className="text-gray-500">暂无{selectedCategory?.name}资料</p>
            </div>
          )}
      </div>
    </div>
  )
}
