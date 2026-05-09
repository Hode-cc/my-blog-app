import Link from 'next/link'

export default function Hero() {
  return (
    <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
      <div>
        <h1 className="text-4xl font-bold text-gray-900">我的博客</h1>
        <p className="mt-2 text-gray-600 text-lg">
          分享关于Web开发、设计和技术的见解和教程
        </p>
      </div>
      <Link
        href="/posts/new"
        className="mt-4 md:mt-0 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition shadow-md"
      >
        创建新文章
      </Link>
    </div>
  )
}