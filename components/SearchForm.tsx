export default function SearchForm({ defaultValue = '' }: { defaultValue?: string }) {
  return (
    <form action="/" method="GET" className="relative">
      <input
        type="text"
        name="q"
        placeholder="搜索文章..."
        defaultValue={defaultValue}
        className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />
      <button type="submit" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </button>
    </form>
  )
}