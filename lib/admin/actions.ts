"use server";

import { Prisma } from "@prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ADMIN_COOKIE, adminToken, requireAdmin } from "@/lib/admin/auth";
import { getAdminEntity, type AdminField } from "@/lib/admin/registry";

// ---------- 登入 / 登出 ----------

export async function login(formData: FormData): Promise<void> {
  const password = String(formData.get("password") ?? "");
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || password !== expected) {
    redirect("/admin/login?error=1");
  }
  const store = await cookies();
  store.set(ADMIN_COOKIE, adminToken(), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 天
  });
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  redirect("/admin/login");
}

// ---------- 通用 CRUD ----------

type Delegate = {
  create: (args: { data: Record<string, unknown> }) => Promise<unknown>;
  update: (args: {
    where: Record<string, unknown>;
    data: Record<string, unknown>;
  }) => Promise<unknown>;
  delete: (args: { where: Record<string, unknown> }) => Promise<unknown>;
};

function delegateFor(model: string): Delegate {
  return (prisma as unknown as Record<string, Delegate>)[model];
}

/** 依欄位型別把表單值轉成 Prisma 寫入值；回傳 undefined 表示略過此欄位 */
function parseFieldValue(
  field: AdminField,
  raw: FormDataEntryValue | null,
): { value?: unknown; error?: string } {
  const text = typeof raw === "string" ? raw : "";
  const trimmed = text.trim();

  switch (field.type) {
    case "number": {
      if (trimmed === "") {
        return { value: field.optional ? null : 0 };
      }
      const n = Number(trimmed);
      if (Number.isNaN(n)) return { error: `「${field.label}」必須是數字` };
      return { value: n };
    }
    case "lines": {
      const items = text
        .split(/\r?\n/)
        .map((s) => s.trim())
        .filter(Boolean);
      if (items.length === 0) {
        if (field.required) return { error: `「${field.label}」至少要填一行` };
        return { value: Prisma.JsonNull };
      }
      return { value: items };
    }
    case "json": {
      if (trimmed === "") {
        if (field.required) return { error: `「${field.label}」不可留空` };
        return { value: Prisma.JsonNull };
      }
      try {
        return { value: JSON.parse(trimmed) };
      } catch {
        return { error: `「${field.label}」不是有效的 JSON 格式` };
      }
    }
    default: {
      if (trimmed === "") {
        if (field.required) return { error: `「${field.label}」不可留空` };
        return { value: null };
      }
      return { value: text };
    }
  }
}

/**
 * 儲存（新增或更新）。
 * @param entitySlug 實體代稱（/admin/[entity]）
 * @param id 編輯中的資料 id；新增時為 null
 */
export async function saveEntity(
  entitySlug: string,
  id: string | null,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const entity = getAdminEntity(entitySlug);
  if (!entity) redirect("/admin");

  const data: Record<string, unknown> = {};
  let error: string | null = null;

  for (const field of entity.fields) {
    // 主鍵欄位：編輯時不可改
    if (id !== null && (field.name === entity.idField || field.readOnlyOnEdit)) {
      continue;
    }
    const parsed = parseFieldValue(field, formData.get(field.name));
    if (parsed.error) {
      error = parsed.error;
      break;
    }
    data[field.name] = parsed.value;
  }

  const backTo =
    id === null
      ? `/admin/${entity.slug}/new`
      : `/admin/${entity.slug}/${encodeURIComponent(id)}`;

  if (error) {
    redirect(`${backTo}?error=${encodeURIComponent(error)}`);
  }

  const delegate = delegateFor(entity.model);
  try {
    if (id === null) {
      if (entity.autoId) delete data[entity.idField];
      await delegate.create({ data });
    } else {
      const idValue = entity.idIsNumber ? Number(id) : id;
      await delegate.update({ where: { [entity.idField]: idValue }, data });
    }
  } catch (e) {
    const message =
      e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002"
        ? "儲存失敗：主鍵（slug / id）重複了，請換一個"
        : "儲存失敗，請檢查欄位內容";
    redirect(`${backTo}?error=${encodeURIComponent(message)}`);
  }

  redirect(`/admin/${entity.slug}?saved=1`);
}

// ---------- 主題包 ↔ 材料庫 關聯 ----------

/** 把材料庫既有材料掛到某主題包（附加在最後）。 */
export async function attachThemeIngredient(
  themeSlug: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const back = `/admin/themes/${encodeURIComponent(themeSlug)}`;
  const ingredientSlug = String(formData.get("ingredientSlug") ?? "").trim();
  if (!ingredientSlug) redirect(back);

  const agg = await prisma.themeIngredient.aggregate({
    where: { themeSlug },
    _max: { sortOrder: true },
  });
  try {
    await prisma.themeIngredient.create({
      data: {
        themeSlug,
        ingredientSlug,
        sortOrder: (agg._max.sortOrder ?? -1) + 1,
      },
    });
  } catch (e) {
    // 已掛過（unique 重複）等 → 忽略，直接回主題頁
    if (!(e instanceof Prisma.PrismaClientKnownRequestError)) throw e;
  }
  redirect(back);
}

/** 把某材料從主題包移除（只解除關聯，不動材料庫本身）。 */
export async function detachThemeIngredient(
  themeSlug: string,
  id: number,
): Promise<void> {
  await requireAdmin();
  await prisma.themeIngredient.delete({ where: { id } }).catch(() => {});
  redirect(`/admin/themes/${encodeURIComponent(themeSlug)}`);
}

export async function deleteEntity(
  entitySlug: string,
  id: string,
): Promise<void> {
  await requireAdmin();
  const entity = getAdminEntity(entitySlug);
  if (!entity) redirect("/admin");

  const idValue = entity.idIsNumber ? Number(id) : id;
  const delegate = delegateFor(entity.model);
  try {
    await delegate.delete({ where: { [entity.idField]: idValue } });
  } catch {
    redirect(
      `/admin/${entity.slug}?error=${encodeURIComponent("刪除失敗，請再試一次")}`,
    );
  }
  redirect(`/admin/${entity.slug}?deleted=1`);
}
