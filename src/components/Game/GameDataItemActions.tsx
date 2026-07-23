'use client'

import { Edit3 } from 'lucide-react'
import { useUserRole, hasPermission } from '@/hooks/useUserRole'
import DeleteButton from '@/components/UI/DeleteButton'

interface GameDataItemActionsProps {
  gameId: string
  dataId: string
}

export default function GameDataItemActions({ gameId, dataId }: GameDataItemActionsProps) {
  const { role, loading } = useUserRole()

  if (loading) {
    return <span className="text-gray-400 text-sm">加载中...</span>
  }

  const canEdit = hasPermission(role, ['senior', 'admin'])
  const canDelete = hasPermission(role, ['admin'])

  return (
    <div className="flex items-center gap-2">
      {canEdit && (
        <a
          href={`/admin/games/${gameId}/data/${dataId}/edit`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-blue-600"
          title="编辑"
        >
          <Edit3 className="w-4 h-4" />
        </a>
      )}
      {canDelete && <DeleteButton gameId={gameId} dataId={dataId} />}
    </div>
  )
}
