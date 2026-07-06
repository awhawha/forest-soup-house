# 資料庫與後台管理

湯湯屋的內容現在存放在 **Supabase（PostgreSQL）**，透過 **Prisma** 讀寫，並有一個密碼保護的後台 `/admin` 可以管理所有內容。

## 存進資料庫的內容（9 種）

| 資料表 | 內容 | 原本的檔案 |
|---|---|---|
| `Theme` | 主題包（故事、冒險任務、自然手作、徽章、家長筆記） | `data/themes.ts` |
| `ThemeIngredient` | 主題包的採集材料與挑戰（選擇／謎語／悄悄話） | `data/themes.ts` |
| `ThemeBook` | 主題包推薦書單 | `data/themes.ts` |
| `Soup` | 湯譜卡（50 張，六大分類） | `data/soupCards.ts` |
| `Character` | 角色（菲娜、波飛、里洛） | `data/characters.ts` |
| `Location` | 森林地點（10 個） | `data/locations.ts` |
| `Adventure` | 森林小冒險完整頁 | `data/adventures.ts` |
| `TodaysAdventure` | 首頁「今日小冒險」卡片 | `data/todaysAdventures.ts` |
| `AmbientText` | 湯湯屋每日文案（菲娜狀態 20 條、每日提問 20 條、Poffy 插話 6 條、天氣氛圍 8 條） | `data/soup-house.ts` |

沒有搬進資料庫的：導覽列設定（`data/siteHeaderNav.ts`）與首頁入口卡片——這些是版面設定，留在程式碼裡。孩子的採集進度仍存在瀏覽器 localStorage。

`data/*.ts` 檔案保留兩個用途：TypeScript 型別來源＋seed（初始匯入）資料，之後改內容一律走後台，不用再改這些檔案。

## 第一次設定 Supabase（一次就好）

1. 到 <https://supabase.com> 註冊／登入（可用 GitHub 帳號）。
2. 按 **New project**：
   - Name：`forest-soup-house`（隨意）
   - Database Password：設定一組密碼並**記下來**（等下要用）
   - Region：選 `Northeast Asia (Tokyo)` 離台灣最近
3. 專案建立完成後，按上方的 **Connect** 按鈕。
4. 選 **ORM → Prisma**，會看到兩段連線字串：
   - `DATABASE_URL`（Transaction pooler，port **6543**）
   - `DIRECT_URL`（Session pooler，port **5432**）
5. 打開專案根目錄的 `.env`，把兩段字串貼進去，並把其中的 `[YOUR-PASSWORD]` 換成第 2 步設定的資料庫密碼。
6. 順便把 `.env` 裡的 `ADMIN_PASSWORD` 改成你自己的後台密碼。

然後執行：

```bash
npm run db:push   # 依 prisma/schema.prisma 在 Supabase 建立資料表
npm run db:seed   # 把 data/*.ts 的所有內容匯入資料庫
```

## 日常使用

- **後台**：`npm run dev` 之後打開 <http://localhost:3000/admin>，輸入 `ADMIN_PASSWORD` 登入。可以新增、編輯、刪除全部 9 種內容，儲存後前台立即更新。
- **Prisma Studio**（備用的資料庫直接編輯工具）：`npm run db:studio`。
- **重新匯入初始內容**：`npm run db:seed` 可重複執行，會以 `data/*.ts` 為準覆蓋同 slug 的資料。

## 常見問題

- **改了 schema.prisma 怎麼辦？** 再跑一次 `npm run db:push`。
- **部署到 Vercel**：在 Vercel 專案設定加上 `DATABASE_URL`、`DIRECT_URL`、`ADMIN_PASSWORD` 三個環境變數即可。
- **換後台密碼**：改 `.env` 的 `ADMIN_PASSWORD`，所有已登入的瀏覽器會自動失效，需重新登入。
- **主題材料的「採集挑戰」欄位**是 JSON 格式，後台表單下方有三種型式（choice／riddle／secret）的範例可以照抄。

---

# v2 — 週更親子體驗版（design handoff 重寫）

2026-07 依 `design_handoff_soup_house` 設計包全面改版：內容瀏覽網站 → 390×844 手機框的週更親子體驗。

## 新頁面結構
- `/` 首頁（本週的湯、晾曬架、有東西在等你、最新作品、湯譜石）
- `/story` 親子版週故事流程（門 → 故事 → 採集 → 煮湯 → 成就）
- `/map` 森林地圖（9 pin 解鎖 + 採集袋）＋ `/map/herbal-patch` 草藥花園、`/map/forest-post` 森林郵局
- `/pot` 湯鍋（找到的食譜／即興湯，不推主線）
- `/friends` 朋友們（9 位住戶隨湯譜石解鎖）
- `/print` 手作列印頁（A4）
- 湯譜紀念冊＝右下 FAB 全域抽屜（湯譜卡／香味圖鑑／作品牆）
- 舊網址（/themes、/stories、/world⋯）已 redirect 到新頁

## 新增資料表／欄位
- `Theme` 加週欄位（`weekNumber` 第幾週、`letter` 菲娜的信）—— **一個主題包 = 一週 = 一碗湯**
- `Setting`：`currentWeek`＝目前週次（後台「設定」改這個值即換週）
- `PotRecipe`：湯鍋找到的食譜（後台「湯鍋食譜」）
- `Location` 加地圖欄位（glyph／mapX／mapY／unlockAtPot）
- `Character` 加住戶欄位（locationSlug／unlockAtPot／introLine／avatarGradient）
- `ThemeIngredient` 加採集視覺（glyph／tile／gradient／scent）
- 新 seed：`npx tsx prisma/seed-v2.ts`（可重複執行）

### 主題包 / 材料 / 湯鍋食譜的關係
- **主題包 Theme = 一週 = 一碗湯**：週次、湯名（標題）、菲娜的信、故事、徽章、家長筆記都在這；底下掛 3 樣**主題材料**（真父子，刪主題包連材料一起刪）。
- **主題材料 ThemeIngredient**：那碗湯用的材料，也是「香味圖鑑」跨週累積的收藏單位。在後台「主題材料」分頁編輯；主題包編輯頁下方有唯讀清單可快速跳轉。
- **湯鍋食譜 PotRecipe**：日常廚房「湯鍋」的食譜，跟主線無關（煮了不推湯譜石）。用 `ingredientSlugs`（材料 slug 清單，非外鍵）跨主題包混搭；填的 slug 必須對得上某個主題材料的 slug。
- （已移除舊的獨立 `Week` 表與 `Soup` 湯譜卡表，合併進 Theme／改由主題包代表。）

## 孩子的進度存哪裡
全部存在瀏覽器本地（不用帳號）：採集收藏 / 湯譜卡 / 湯譜石 / 晾曬架 / 郵局 = localStorage；照片 = IndexedDB。清瀏覽器資料會歸零。資料層集中在 `lib/client/pantry.ts`，之後要上雲端改這一層即可。

## 換週操作
後台 → 設定 → `currentWeek` 改成新的數字（1–10）。系統會找 `weekNumber` 等於該數字的主題包當本週。前台重新整理即生效：採集袋換新三樣、香氣移到新地點、上週卡片變「錯過的一週」、圖鑑跨週累積、晾曬架不動。

第幾週對應哪個主題包，在該主題包編輯頁的「第幾週」欄位設定（1–10，不可重複；留空＝不排入週主線）。
