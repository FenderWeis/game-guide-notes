'use client'

import { Plus } from 'lucide-react'
import { useUserRole, hasPermission } from '@/hooks/useUserRole'

interface GameDetailActionsProps {
  gameId: string
}

export default function GameDetailActions({ gameId }: GameDetailActionsProps) {
  const { role, loading } = useUserRole()

  if (loading) {
    return <span className="text-gray-400 text-sm">加载中...</span>
  }

  const canEdit = hasPermission(role, ['senior', 'admin'])

  return (
    <>
      {canEdit ? (
        <a
          href={`/admin/games/${gameId}/data/new`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm flex-shrink-0 ml-4"
        >
          <Plus className="w-4 h-4" />
          编辑资料
        </a>
      ) : role ? (
        <span className="text-gray-400 text-sm flex-shrink-0 ml-4">
          需要资深用户权限
        </span>
      ) : null}
    </>
  )
}
