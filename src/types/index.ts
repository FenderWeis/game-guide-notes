/**
 * 游戏数据模型
 */
export interface Game {
  id: string
  name: string
  cover: string | null
  description: string | null
  created_at: string
  updated_at: string
}

/**
 * 资料类型分类模型
 */
export interface Category {
  id: string
  name: string
}

/**
 * 攻略文章模型
 */
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

/**
 * 游戏资料条目模型
 */
export interface GameData {
  id: string
  game_id: string
  type: 'character' | 'equipment' | 'map' | 'other'
  title: string
  content: string
  image: string | null
  created_at: string
}

/**
 * 用户模型
 * @param role - 用户角色: user(普通用户), senior(高级用户), admin(管理员)
 */
export interface User {
  id: string
  email: string
  role: 'user' | 'senior' | 'admin'
  created_at: string
}

/**
 * 攻略点赞模型
 */
export interface Like {
  id: string
  user_id: string
  guide_id: string
  created_at: string
}

/**
 * 攻略收藏模型
 */
export interface Favorite {
  id: string
  user_id: string
  guide_id: string
  created_at: string
}