import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "@/components/studio/ProfileForm";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="p-12">
      <header className="mb-12">
        <h1 className="text-5xl font-serif font-black uppercase italic leading-none">
          Editorial <span className="text-brand-red">Identity</span>
        </h1>
        <p className="text-xs font-black uppercase tracking-widest text-black/40 mt-4 max-w-lg">
          Manage your public author profile and security credentials. Your bio and avatar will be displayed on all articles you publish.
        </p>
      </header>

      <div className="max-w-4xl">
        <ProfileForm profile={profile} />
      </div>
    </div>
  );
}
