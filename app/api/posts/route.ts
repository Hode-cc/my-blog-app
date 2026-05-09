// src/app/api/posts/route.ts
import { supabase } from '@/lib/supabase/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {

  console.log('=== 环境变量检查 ===')
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('KEY 前20个字符:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 20))
  try {
    const { title, content, excerpt, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json(
        { error: '标题和内容不能为空' },
        { status: 400 }
      )
    }

    const slug = title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')

    const { data: post, error } = await supabase
      .from('posts')
      .insert({ title, content, excerpt, slug })
      .select('id, slug')
      .single()

    if (error || !post) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: error?.message || '文章创建失败' },
        { status: 500 }
      )
    }

    // 标签处理
    if (tags && Array.isArray(tags) && tags.length > 0) {
      for (const tagName of tags) {
        if (!tagName) continue
        // 先确保标签存在（upsert 基于名称）
        const { data: tag, error: tagError } = await supabase
          .from('tags')
          .upsert({ name: tagName }, { onConflict: 'name' })
          .select('id')
          .single()

        if (tagError) {
          console.error('Tag upsert error:', tagError)
          continue
        }
        if (tag) {
          await supabase
            .from('post_tags')
            .insert({ post_id: post.id, tag_id: tag.id })
        }
      }
    }

    return NextResponse.json({ slug: post.slug })
  } catch (err) {
    console.error('API route error:', err)
    return NextResponse.json(
      { error: '服务器内部错误' },
      { status: 500 }
    )
  }
}