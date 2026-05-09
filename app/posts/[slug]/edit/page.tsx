// src/app/posts/[slug]/edit/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { use } from 'react' // 用于客户端 params 解包

export default function EditPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [tags, setTags] = useState('')
  const [loading, setLoading] = useState(true)

  // 获取原文章内容
  useEffect(() => {
    fetch(`/api/posts/${slug}`) // 下方会创建这个 API
      .then(res => res.json())
      .then(data => {
        setTitle(data.title)
        setContent(data.content)
        setExcerpt(data.excerpt || '')
        setTags(data.tags?.map((t: any) => t.name).join(', ') || '')
        setLoading(false)
      })
  }, [slug])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch(`/api/posts/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, excerpt, tags: tags.split(',').map(t => t.trim()) }),
    })
    if (res.ok) {
      router.push(`/posts/${slug}`) // 编辑完回详情页
    } else {
      const err = await res.json()
      alert(err.error)
    }
  }

  if (loading) return <div>加载中...</div>

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4 py-10">
      <input className="border p-2" value={title} onChange={e => setTitle(e.target.value)} required />
      <input className="border p-2" value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder="摘要" />
      <textarea className="border p-2 min-h-[300px]" value={content} onChange={e => setContent(e.target.value)} required />
      <input className="border p-2" value={tags} onChange={e => setTags(e.target.value)} placeholder="标签，用逗号分隔" />
      <button type="submit" className="bg-blue-600 text-white p-2 rounded">保存修改</button>
    </form>
  )
}