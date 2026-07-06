import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin/auth";
import { login } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

export const metadata = { title: "湯湯屋後台登入" };

type PageProps = {
  searchParams: Promise<{ error?: string }>;
};

export default async function AdminLoginPage({ searchParams }: PageProps) {
  if (await isAdmin()) {
    redirect("/admin");
  }
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-wood">
      <div className="w-full max-w-sm rounded-3xl border border-border-card bg-paper-card p-8 shadow-[var(--shadow-paper)]">
        <p className="text-center text-3xl" aria-hidden>
          🍲
        </p>
        <h1 className="mt-3 text-center font-heading text-xl font-medium">
          湯湯屋後台
        </h1>
        <p className="mt-1 text-center text-sm text-wood-muted">
          請輸入管理密碼
        </p>

        {error ? (
          <p
            className="mt-4 rounded-xl bg-red-50 px-3 py-2 text-center text-sm text-red-600"
            role="alert"
          >
            密碼不對喔，再試一次
          </p>
        ) : null}

        <form action={login} className="mt-6 space-y-4">
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="管理密碼"
            className="w-full rounded-xl border border-border-card bg-white px-3 py-2.5 text-sm focus:border-moss focus:outline-none focus:ring-1 focus:ring-moss"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-moss px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-moss-hover"
          >
            登入
          </button>
        </form>
      </div>
    </div>
  );
}
