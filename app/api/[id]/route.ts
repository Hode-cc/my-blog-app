import { supabase } from "@/lib/supabase/client";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const {title, content, excerpt, tags } = await request.json();
    const {error} = await supabase
    .from("posts")
    .update({ title, content, excerpt, updated_at: new Date().toISOString() })
    .eq("id", (await params).id);

    if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 });

    await supabase.from("post_tags").delete().eq("post_id", (await params).id);

    if (tags && tags.length > 0) {
        for (const tagName  of tags) {
            const { data: tag } = await supabase
            .from("tags")
            .upsert({ name: tagName }, { onConflict: "name" })
            .select("id")
            .single();

            if (tag) {
                await supabase.from("post_tags").insert({ post_id: (await params).id, tag_id: tag.id });
            }
        }
    }

    return NextResponse.json({ message: "文章更新成功" });
}


// 删除文章
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;  
  const { error } = await supabase.from('posts').delete().eq('id', id);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}