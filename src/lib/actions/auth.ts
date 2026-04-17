"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAdmin(prevState: any, formData: FormData) {
  const password = formData.get("password");
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (password !== adminPassword) {
    return { error: "INVALID ACCESS KEY" };
  }

  const cookieStore = await cookies();
  cookieStore.set("dc_session", "is_admin", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 3600, // 1 hour
    path: "/",
  });

  redirect("/studio");
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete("dc_session");
  redirect("/");
}
