-- 為所有表開啟 Row Level Security（RLS）
-- 目的：關閉 Supabase 公開 Data API（PostgREST）對這些表的匿名讀寫。
-- 影響：本 app 用 Prisma 直連（DATABASE_URL / DIRECT_URL，特權 DB 角色），會繞過 RLS，照常運作。
--       開了 RLS 又不加任何 policy，anon/authenticated 角色即一律拒絕。
-- 用法：Supabase → SQL Editor 貼上執行（或 psql "$DIRECT_URL" -f prisma/enable-rls.sql）。
-- 提醒：日後新增表、或把「研究所」等地點的 slug/表名正式改名時，記得同步維護此清單。

alter table "Adventure"        enable row level security;
alter table "AmbientText"      enable row level security;
alter table "Character"        enable row level security;
alter table "Ingredient"       enable row level security;
alter table "Location"         enable row level security;
alter table "PotRecipe"        enable row level security;
alter table "Setting"          enable row level security;
alter table "Theme"            enable row level security;
alter table "ThemeBook"        enable row level security;
alter table "ThemeIngredient"  enable row level security;
alter table "TodaysAdventure"  enable row level security;
