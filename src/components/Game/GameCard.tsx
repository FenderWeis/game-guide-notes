'use client'

import { Gamepad2, ArrowUpRight } from 'lucide-react'

interface Game {
    id: string
    name: string
    cover: string | null
    description: string | null
}

interface GameCardProps {
    game: Game
}

export default function GameCard({ game }: GameCardProps) {
    const handleClick = () => {
        window.location.href = `/games/${game.id}`
    }

    return (
        <article
            className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={handleClick}
        >
            <div className="aspect-video bg-gray-100 flex items-center justify-center overflow-hidden">
                {game.cover ? (
                    <img
                        src={game.cover}
                        alt={game.name}
                        className="w-full h-full object-contain"
                    />
                ) : (
                    <Gamepad2 className="w-16 h-16 text-gray-400" />
                )}
            </div>
            <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{game.name}</h3>
                    <ArrowUpRight className="w-4 h-4 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm line-clamp-2">
                    {game.description || '暂无简介'}
                </p>
            </div>
        </article>
    )
}