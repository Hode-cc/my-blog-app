import CommentSection from "@/components/CommentSection";
import { supabase } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

export async function generateStaticParams() {
    const { data: posts } = await supabase.from("posts").select("slug");
    return posts?.map((post: any) => ({ slug: post.slug })) || [];
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { data: post } = await supabase
        .from("posts")
        .select("title,excerpt")
        .eq("slug", resolvedParams.slug)
        .single();


    return {
        title: post?.title || '文章未找到',
        description: post?.excerpt || '',
        openGraph: {
            title: post?.title,
            description: post?.excerpt,
        },
    }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const { data: post } = await supabase
        .from("posts")
        .select("*, post_tags(tag_id, tags(*))")
        .eq("slug", resolvedParams.slug)
        .single();
        

    if (!post) notFound()

    return (
        <article className="max-w-3xl mx-auto py-10">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <div className="flex gap-2 my-4">
                {post.post_tags?.map((pt: any) => (
                    <span key={pt.tag_id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {pt.tags.name}
                    </span>
                ))}
            </div>
            <div className="prose max-w-none mt-6">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[rehypeHighlight]}
                >
                    {post.content}
                </ReactMarkdown>
            </div>

            {/* 编辑/删除按钮 */}
            <div className="mt-8 flex gap-4">
                <a href={`/posts/${post.slug}/edit`} className="text-blue-600">编辑</a>
                <form action={`/api/posts/${post.id}`} method="DELETE">
                    <button className="text-red-600">删除</button>
                </form>
            </div>
            <CommentSection postId={post.id} />
        </article>
    )
}