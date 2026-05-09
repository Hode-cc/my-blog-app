import Link from 'next/link'

type PaginationProps = {
  currentPage: number
  totalPages: number
  searchQuery?: string
}

export default function Pagination({ currentPage, totalPages, searchQuery }: PaginationProps) {
  if (totalPages <= 1) return null

  const buildHref = (page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', page.toString())
    if (searchQuery) params.set('q', searchQuery)
    const qs = params.toString()
    return `/${qs ? '?' + qs : ''}`
  }

  return (
    <div className="flex justify-center items-center gap-4 mt-12">
      {currentPage > 1 && (
        <Link
          href={buildHref(currentPage - 1)}
          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition"
        >
          上一页
        </Link>
      )}
      <span className="text-gray-600">
        第 {currentPage} / {totalPages} 页
      </span>
      {currentPage < totalPages && (
        <Link
          href={buildHref(currentPage + 1)}
          className="px-4 py-2 bg-white border rounded-lg hover:bg-gray-100 transition"
        >
          下一页
        </Link>
      )}
    </div>
  )
}