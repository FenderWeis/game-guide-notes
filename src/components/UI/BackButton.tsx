'use client'

import { ArrowLeft } from 'lucide-react'

export default function BackButton() {
    const handleClick = () => {
        window.history.back()
    }

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
            <ArrowLeft className="w-5 h-5" />
            <span>返回</span>
        </button>
    )
}