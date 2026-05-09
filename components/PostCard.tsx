import Link from 'next/link'

type PostCardProps = {
  id: string
  slug: string
  title: string
  excerpt?: string
  content?: string
  created_at: string
  author?: string
  post_tags?: {
    tag_id: string
    tags: {
      name: string
    }
  }[]
}

export default function PostCard({ slug, title, excerpt, content, created_at, author, post_tags }: PostCardProps) {
  const summary = excerpt || content?.slice(0, 120) + '...' || ''
  const formattedDate = new Date(created_at).toLocaleDateString('zh-CN')

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col">
      <div className="text-sm text-gray-500 mb-3">
        <time>{formattedDate}</time>
        <span className="mx-2">·</span>
        <span>{author || '未知作者'}</span>
      </div>

      <h3 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">
        <Link href={`/posts/${slug}`} className="hover:text-blue-600 transition">
          {title}
        </Link>
      </h3>

      {post_tags && post_tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {post_tags.map((pt) => (
            <span key={pt.tag_id} className="text-xs bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-full">
              {pt.tags.name}
            </span>
          ))}
        </div>
      )}

      <p className="text-gray-600 flex-1 text-sm leading-relaxed">{summary}</p>

      <Link
        href={`/posts/${slug}`}
        className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition"
      >
        阅读全文
        <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </article>
  )
}