'use client'

import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useState } from 'react'
import { Trash2 } from 'lucide-react'

interface DeleteButtonProps {
  gameId: string
  dataId: string
}

export default function DeleteButton({ gameId, dataId }: DeleteButtonProps) {
  const supabase = useSupabaseClient()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleDelete = async () => {
    if (!confirm('确定要删除这条资料吗？')) return

    const { error } = await supabase.from('game_data').delete().eq('id', dataId)

    if (error) {
      setMessage({ type: 'error', text: '删除失败，请重试' })
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'success', text: '删除成功！' })
      setTimeout(() => {
        window.location.href = `/games/${gameId}`
      }, 1500)
    }
  }

  return (
    <>
      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message.text}
        </div>
      )}
      <button
        onClick={handleDelete}
        className="text-gray-400 hover:text-red-600"
        title="删除"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </>
  )
}