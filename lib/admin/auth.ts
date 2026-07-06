import { createHash } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_COOKIE = "soup-admin";

/** 由 ADMIN_PASSWORD 導出的登入 token（改密碼即讓所有登入失效） */
export function adminToken(): string {
  return createHash("sha256")
    .update(`forest-soup-house:${process.env.ADMIN_PASSWORD ?? ""}`)
    .digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  if (!process.env.ADMIN_PASSWORD) return false;
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === adminToken();
}

/** 未登入時導向登入頁；在後台頁面/Action 開頭呼叫 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) {
    redirect("/admin/login");
  }
}
