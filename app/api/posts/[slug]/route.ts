// src/app/api/posts/[slug]/route.ts
import { supabase } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

// GET 文章（供编辑页加载）
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { data: post, error } = await supabase
    .from('posts')
    .select('*, post_tags(tag_id, tags(*))')
    .eq('slug', slug)
    .single()

  if (error || !post) {
    return NextResponse.json({ error: '文章未找到' }, { status: 404 })
  }

  // 整理标签数组
  const tags = post.post_tags?.map((pt: any) => pt.tags) || []
  return NextResponse.json({ ...post, tags })
}

// PUT 更新文章（可独立存在，也可放在这里）
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const { title, content, excerpt, tags } = await request.json()

  // 更新文章主体
  const { error } = await supabase
    .from('posts')
    .update({ title, content, excerpt, updated_at: new Date() })
    .eq('slug', slug)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // 更新标签：先删后插
  await supabase.from('post_tags').delete().eq('post_id', (
    await supabase.from('posts').select('id').eq('slug', slug).single()
  ).data!.id!)

  const { data: postId } = await supabase.from('posts').select('id').eq('slug', slug).single()
  if (tags && tags.length > 0 && postId) {
    for (const tagName of tags) {
      if (!tagName) continue
      const { data: tag } = await supabase
        .from('tags')
        .upsert({ name: tagName }, { onConflict: 'name' })
        .select('id')
        .single()
      if (tag) {
        await supabase.from('post_tags').insert({ post_id: postId.id, tag_id: tag.id })
      }
    }
  }

  return NextResponse.json({ success: true })
}