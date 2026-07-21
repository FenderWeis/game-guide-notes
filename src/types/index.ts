export interface Game {
  id: string
  name: string
  cover: string | null
  description: string | null
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
}

export interface Guide {
  id: string
  title: string
  content: string
  game_id: string
  category_id: string
  author_id: string
  likes: number
  created_at: string
  updated_at: string
  game?: Game
  category?: Category
}

export interface GameData {
  id: string
  game_id: string
  type: 'character' | 'equipment' | 'map' | 'other'
  title: string
  content: string
  image: string | null
  created_at: string
}

export interface User {
  id: string
  email: string
  role: 'user' | 'admin'
  created_at: string
}

export interface Like {
  id: string
  user_id: string
  guide_id: string
  created_at: string
}

export interface Favorite {
  id: string
  user_id: string
  guide_id: string
  created_at: string
}