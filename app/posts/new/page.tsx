'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewPost() {
    const router = useRouter()
    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [excerpt, setExcerpt] = useState('')
    const [tags, setTags] = useState('')

    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Anon Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10) + '...')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, content, excerpt, tags: tags.split(',').map(t => t.trim()) }),
        })
        const data = await res.json()
        if (res.ok)  router.push('/')
    }

    return (
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto flex flex-col gap-4 py-10">
            <input className="border p-2" placeholder="标题" value={title} onChange={e => setTitle(e.target.value)} required />
            <textarea className="border p-2" placeholder="摘要" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
            <textarea className="border p-2 min-h-[300px]" placeholder="Markdown 内容" value={content} onChange={e => setContent(e.target.value)} required />
            <input className="border p-2" placeholder="标签（英文逗号分隔）" value={tags} onChange={e => setTags(e.target.value)} />
            <button type="submit" className="bg-green-600 text-white p-2 rounded">发布</button>
        </form>
    )
}