'use client'
import { supabase } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

export default function CommentSection({ postId }: { postId: string }) {
  const [comments, setComments] = useState<any[]>([])
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')

  useEffect(() => {
    supabase.from('comments').select('*').eq('post_id', postId).order('created_at', { ascending: true })
      .then(({ data }) => setComments(data || []))
  }, [postId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data } = await supabase.from('comments').insert({ post_id: postId, author, content }).select()
    if (data) setComments([...comments, ...data])
    setAuthor('')
    setContent('')
  }
  

  return (
    <div className="mt-10">
      <h3 className="text-xl font-bold mb-4">评论</h3>
      {comments.map(c => (
        <div key={c.id} className="border-b py-2">
          <strong>{c.author}</strong> <span className="text-sm text-gray-400">{new Date(c.created_at).toLocaleString()}</span>
          <p>{c.content}</p>
        </div>
      ))}
      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-2">
        <input value={author} onChange={e => setAuthor(e.target.value)} placeholder="昵称" className="border p-2" required />
        <textarea value={content} onChange={e => setContent(e.target.value)} placeholder="评论内容" className="border p-2" required />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded">发表评论</button>
      </form>
    </div>
  )
}