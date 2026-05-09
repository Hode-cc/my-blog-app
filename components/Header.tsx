import Link from 'next/link'
import SearchForm from './SearchForm'


export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <nav className="flex gap-6 text-gray-700 font-medium">
          <Link href="/" className="hover:text-blue-600 transition">
            首页
          </Link>
          <Link href="/categories" className="hover:text-blue-600 transition">
            分类
          </Link>
          <Link href="/about" className="hover:text-blue-600 transition">
            关于
          </Link>
        </nav>
        <SearchForm />
      </div>
    </header>
  )
}