import { createServerClient } from '@/lib/supabase/server'
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react'
import BackButton from '@/components/UI/BackButton'
import DeleteButton from '@/components/UI/DeleteButton'

export const dynamic = 'force-dynamic'

interface GameDataDetailProps {
  params: { id: string; dataId: string }
}

export default async function GameDataDetailPage({ params }: GameDataDetailProps) {
  const supabase = createServerClient()

  const { data: game, error: gameError } = await supabase
    .from('games')
    .select('name')
    .eq('id', params.id)
    .single()

  const { data: gameData, error: dataError } = await supabase
    .from('game_data')
    .select('title, category_id')
    .eq('id', params.dataId)
    .single()

  const { data: category, error: catError } = await supabase
    .from('categories')
    .select('name')
    .eq('id', gameData?.category_id)
    .single()

  const { data: modules, error: moduleError } = await supabase
    .from('game_data_modules')
    .select('id, title, sort_order')
    .eq('game_data_id', params.dataId)
    .order('sort_order')

  const { data: blocks, error: blockError } = await supabase
    .from('game_data_content_blocks')
    .select('id, module_id, title, content, image, content_type, sort_order')
    .eq('game_data_id', params.dataId)
    .order('sort_order')

  if (gameError || dataError) {
    console.error('Error fetching data:', gameError, dataError)
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-500">资料不存在</p>
      </div>
    )
  }

  const getBlocksForModule = (moduleId: string) => {
    return blocks?.filter((b: any) => b.module_id === moduleId) || []
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <BackButton />

      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-gray-500">
          <a href={`/games/${params.id}`} className="hover:text-blue-600">
            {game?.name}
          </a>
          <span className="text-gray-300">/</span>
          <span>{category?.name}</span>
          <span className="text-gray-300">/</span>
          <span className="text-gray-800">{gameData?.title}</span>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href={`/admin/games/${params.id}/data/${params.dataId}/edit`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit3 className="w-4 h-4" />
            编辑资料
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full mb-3">
            {category?.name}
          </span>
          <h1 className="text-2xl font-bold text-gray-800">{gameData?.title}</h1>
        </div>

        <div className="p-6">
          {modules && modules.length > 0 ? (
            modules.map((module: any, moduleIndex: number) => {
              const moduleBlocks = getBlocksForModule(module.id)
              return (
                <div key={module.id} className="mb-8 last:mb-0">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 flex items-center justify-center bg-blue-600 text-white rounded-lg text-sm font-medium">
                      {moduleIndex + 1}
                    </span>
                    <h2 className="text-xl font-semibold text-gray-800">{module.title}</h2>
                  </div>

                  <div className="ml-11 space-y-4">
                    {moduleBlocks.map((block: any) => (
                      <div key={block.id} className="bg-gray-50 rounded-lg p-4">
                        {block.title && (
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">{block.title}</h3>
                        )}
                        {block.content_type === 'text' && (
                          <div className="prose prose-gray max-w-none">
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{block.content}</p>
                          </div>
                        )}

                        {block.content_type === 'table' && block.content && (
                          <div className="overflow-x-auto">
                            <div dangerouslySetInnerHTML={{ __html: block.content }} />
                          </div>
                        )}

                        {block.image && (
                          <div className="my-4">
                            <img
                              src={block.image}
                              alt="内容图片"
                              className="max-w-full rounded-lg shadow-sm"
                            />
                          </div>
                        )}

                        {block.content_type === 'image' && !block.content && !block.image && (
                          <p className="text-gray-500 italic">暂无图片</p>
                        )}
                      </div>
                    ))}

                    {moduleBlocks.length === 0 && (
                      <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
                        <p>暂无内容</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无模块内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}