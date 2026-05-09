import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pagination from "@/components/Pagination";
import PostList from "@/components/PostList";
import { supabase } from "@/lib/supabase/client";
import Image from "next/image";
import Link from "next/link";

export const revalidate = 60;

type SearchParams = {
  page?: string
  q?: string
}

export default async function Home({ searchParams  }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const page = parseInt(params.page || "1");
  const pageSize = 6;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  const searchQuery = searchParams.q || '';

  //获取文章总数
  const { count } = await supabase.from("posts").select("*", { count: "exact", head: true });

  // 获取当前页文章（含标签）
  const { data: posts } = await supabase
    .from("posts")
    .select('*, post_tags(tag_id, tags(*))')
    .order("created_at", { ascending: false })
    .range(from, to);

  const totalPages = Math.ceil((count || 0) / pageSize);

  return (
    // <main className="container mx-auto m-10">
    //   <div className="flex justify-between items-center mb-8">
    //     <h1 className="text-3xl font-bold">博客文章</h1>
    //     <Link href="/posts/new" className="bg-blue-600 text-white px-4 py-2 rounded">
    //       新建文章
    //     </Link>
    //   </div>

    //   <div className="grid grid-cols-3 gap-6">
    //     {posts?.map((post: any) => (
    //       <article key={post.id} className="border p-4 rounded hover:shadow justify-items-center">
    //         <Link href={`/posts/${post.slug}`} className="w-full">
    //           <h2 className="text-xl font-semibold">{post.title}</h2>
    //           <p className="text-gray-500">{post.excerpt}</p>
    //         </Link>
    //         <div className="flex gap-2 mt-2">
    //           {post.post_tags?.map((pt: any) => (
    //             <span key={pt.tag_id} className="text-xs bg-gray-200 px-2 py-1 rounded">
    //               {pt.tags.name}
    //             </span>
    //           ))}
    //         </div>
    //       </article>
    //     ))}
    //   </div>

    //   {/* 分页器 */}
    //   <div className="flex justify-center gap-4 mt-8">
    //     {page > 1 && <Link href={`/?page=${page - 1}`}>上一页</Link>}
    //     <span>{page} / {totalPages}</span>
    //     {page < totalPages && <Link href={`/?page=${page + 1}`}>下一页</Link>}
    //   </div>
    // </main>
     <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-12">
        <Hero />
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">最新文章</h2>
          <PostList posts={posts || []} />
        </section>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
}
