import PostCard from './PostCard'

type Post = {
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

export default function PostList({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return <p className="text-center text-gray-500 py-20">暂无文章，快来写第一篇吧！</p>
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} {...post} />
      ))}
    </div>
  )
}