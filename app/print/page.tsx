/**
 * 手作列印頁 — A4 直式，瀏覽器列印即可。
 * 版面 1:1 依 design handoff（湯湯屋-手作列印頁.dc.html），內容由 getWeekBundle()（DB）供給。
 * 不放 (soup) group：無 390×844 手機框。
 */
import { notFound } from "next/navigation";
import { getWeekBundle } from "@/lib/weekly";
import { PrintToolbar } from "@/components/app/PrintToolbar";

export const dynamic = "force-dynamic";

const sectionLabel: React.CSSProperties = {
  fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif",
  fontSize: "10.5pt", letterSpacing: ".14em", color: "#a9793f",
  fontWeight: 700, margin: "22pt 0 8pt",
};

const serif: React.CSSProperties = {
  fontFamily: "var(--font-noto-serif), 'Noto Serif TC', serif",
};

export default async function PrintPage() {
  const week = await getWeekBundle();
  if (!week) notFound();

  const ingredientNames = week.ingredients.map((i) => i.name).join(" · ");

  return (
    <div
      className="shh-print-wrap"
      style={{
        fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif",
        color: "#493d31", background: "#e8dfc8", minHeight: "100vh", padding: "24px 0",
        lineHeight: 1.6,
      }}
    >
      <style>{`
        @page { size: A4 portrait; margin: 0.6in; }
        @media print {
          .shh-no-print { display: none !important; }
          html, body { background: #fff !important; }
          .shh-print-wrap { background: #fff !important; padding: 0 !important; min-height: 0 !important; }
          .shh-a4 { width: auto !important; min-height: 0 !important; margin: 0 !important; padding: 0 !important; box-shadow: none !important; border-radius: 0 !important; }
        }
      `}</style>

      <PrintToolbar />

      {/* A4 直式紙面 */}
      <div
        className="shh-a4"
        style={{
          width: "210mm", minHeight: "297mm", margin: "0 auto", background: "#fff",
          padding: "0.6in", boxSizing: "border-box", borderRadius: 4,
          boxShadow: "0 24px 60px -24px rgba(60,40,20,.45)",
        }}
      >
        {/* header */}
        <div
          style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            borderBottom: "2px solid #c9a86a", paddingBottom: 10,
          }}
        >
          <div>
            <p
              style={{
                fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif",
                fontSize: "10pt", letterSpacing: ".3em", color: "#a9793f", fontWeight: 700, margin: 0,
              }}
            >
              FOREST SOUP HOUSE · 手作紙
            </p>
            <h1 style={{ ...serif, fontWeight: 700, fontSize: "22pt", margin: "4px 0 0", color: "#3a2f22" }}>
              {week.soupName}
            </h1>
          </div>
          <p style={{ fontSize: "10pt", color: "#8a7659", margin: 0 }}>日期：＿＿＿年＿＿月＿＿日</p>
        </div>

        {/* １ · 湯譜卡 */}
        <p style={sectionLabel}>１ · 湯譜卡（沿虛線剪下，收進你的紀念冊）</p>
        <div
          style={{
            border: "2px dashed #c9a86a", borderRadius: "14pt", padding: "14pt",
            display: "flex", gap: "14pt", alignItems: "center",
          }}
        >
          <div
            style={{
              flexShrink: 0, width: "110pt", height: "110pt", borderRadius: "50%",
              overflow: "hidden", background: "#fdf6e8", border: "3px solid #e3cf9e",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={week.image ?? "/images/handoff/soup-pot.png"}
              alt={week.soupName}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%" }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ ...serif, fontWeight: 700, fontSize: "15pt", margin: 0, color: "#3a2f22" }}>
              {week.soupName}
            </p>
            <p style={{ fontSize: "10pt", color: "#8a7659", margin: "4pt 0 8pt" }}>
              煮湯的人：＿＿＿＿＿＿＿＿
            </p>
            <p style={{ fontSize: "10.5pt", color: "#5b4a35", margin: 0, lineHeight: 1.9 }}>
              材料：{ingredientNames}
              <br />
              祕密材料（自己寫）：＿＿＿＿＿＿＿＿＿＿＿＿
            </p>
            <p style={{ fontSize: "9.5pt", color: "#a9793f", margin: "8pt 0 0", fontWeight: 700 }}>
              煮好這鍋可以得到「{week.badgeName}」徽章
            </p>
          </div>
        </div>

        {/* ２ · 著色手作區 */}
        <p style={sectionLabel}>２ · 著色手作區（{week.craftTitle}）</p>
        <div style={{ border: "1.5pt dashed #b8a170", borderRadius: "10pt", padding: "12pt" }}>
          <p style={{ fontSize: "10pt", color: "#5b4a35", margin: "0 0 10pt", lineHeight: 1.9 }}>
            {week.craftDescription}
          </p>
          <div
            style={{
              height: "150pt", borderRadius: "8pt", background: "#f7f1e0",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "9pt", color: "#a08a68",
            }}
          >
            把作品畫在這裡，或把做好的東西貼上來
          </div>
        </div>

        {/* ３ · 本週小冒險 */}
        <p style={sectionLabel}>３ · 本週小冒險（{week.adventureTitle}）</p>
        <div
          style={{
            border: "1.5pt solid #d5c9a4", borderRadius: "10pt", padding: "14pt",
            background: "#fbf7ea",
          }}
        >
          <p style={{ ...serif, fontSize: "12pt", color: "#3a2f22", margin: "0 0 10pt", lineHeight: 1.9 }}>
            {week.adventureDescription}
          </p>
          <p style={{ margin: 0, lineHeight: 2.6, color: "#c9b88f", fontSize: "11pt" }}>
            ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
            <br />
            ＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿
          </p>
        </div>

        <p style={{ fontSize: "9pt", color: "#a08a68", margin: "20pt 0 0", textAlign: "center" }}>
          做好之後，可以貼在冰箱上，或收進一個小盒子——那就是你們家的湯譜紀念冊。
        </p>
      </div>
    </div>
  );
}
