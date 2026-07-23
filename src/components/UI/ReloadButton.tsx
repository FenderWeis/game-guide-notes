'use client'

import { RefreshCw } from 'lucide-react'

export default function ReloadButton() {
  return (
    <button
      onClick={() => window.location.reload()}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
    >
      <RefreshCw className="w-4 h-4" />
      重新加载
    </button>
  )
}