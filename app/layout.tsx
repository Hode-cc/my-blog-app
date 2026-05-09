import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'   // 👈 导入全局 Header

export const metadata: Metadata = {
  title: '我的博客',
  description: '分享关于Web开发、设计和技术的见解和教程',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className="bg-gray-50">
        <Header />          {/* 👈 全局头部，所有页面都会显示 */}
        {children}
      </body>
    </html>
  )
}