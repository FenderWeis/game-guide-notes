import type { Metadata } from 'next'
import './globals.css'
import Layout from '@/components/Layout/Layout'

export const metadata: Metadata = {
  title: '游戏攻略笔记',
  description: '分享游戏乐趣，记录攻略心得',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  )
}