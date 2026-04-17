"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function togglePostStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ is_published: !currentStatus })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/studio/articles");
  revalidatePath("/");
  return { success: `Article ${!currentStatus ? 'published' : 'hidden'} successfully!` };
}

export async function deletePost(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/studio/articles");
  revalidatePath("/");
  return { success: "Article deleted successfully!" };
}

export async function incrementViewCount(id: string) {
  const supabase = await createClient();
  
  // 1. Increment the atomic counter on the post
  await supabase.rpc('increment_post_views', { post_id: id });

  // 2. Log to analytics_logs for time-series data
  await supabase.from('analytics_logs').insert({ article_id: id });
}
