"use client";

/**
 * 首頁 = 今天 — 本週的湯大卡、有東西在等你、晾曬架、最新作品、湯譜石。
 * 版面 1:1 依 design handoff（湯湯屋-新首頁.dc.html）。
 */
import Link from "next/link";
import type { WeekBundle } from "@/lib/weekly";
import {
  getCabinetCards,
  getCooked,
  getPantry,
  getPost,
  getRack,
  getWorks,
  openCabinet,
} from "@/lib/client/pantry";
import { useNow, useSoupState, useSoupStateTicking } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoImg } from "@/components/app/PhotoImg";

export function HomeClient({ week }: { week: WeekBundle }) {
  const pantry = useSoupState(getPantry, {});
  const ownedCards = useSoupState(getCabinetCards, []);
  const cooked = useSoupState(getCooked, 0);
  const rack = useSoupStateTicking(getRack, []);
  const post = useSoupStateTicking(getPost, { transit: false, repliesRead: 0 });
  const works = useSoupState(getWorks, []);
  const now = useNow(); // 0 = 尚未 mount（倒數類 UI 先顯示未完成狀態）

  // ── CTA 四態 ──
  const collectedCount = week.ingredients.filter((i) => pantry[i.slug]).length;
  const weekDone = ownedCards.includes(week.themeSlug);
  let storyCta = "聽這週的故事";
  if (weekDone) storyCta = "這週煮好了 · 看成果 →";
  else if (collectedCount >= 3) storyCta = "材料齊了 · 回家煮這鍋 →";
  else if (collectedCount > 0) storyCta = `繼續 · 還差 ${3 - collectedCount} 樣`;

  // ── 有東西在等你（郵局回信等鉤子）──
  const hooks: { glyph: string; iconBg: string; bg: string; border: string; title: string; sub: string; href: string }[] = [];
  if (post.transit) {
    const ready = now > 0 && !!post.replyAt && now >= post.replyAt;
    hooks.push({
      glyph: "郵",
      iconBg: "#c9793a",
      bg: "#fbeedd",
      border: "#e6c79e",
      title: ready ? "森林的回信到了！" : "你寄的信還在路上",
      sub: ready ? "去森林郵局拆開看看" : "去森林郵局看看回信到了嗎",
      href: "/map/forest-post",
    });
  }

  // ── 晾曬架 ──
  const rackItems = rack.map((r, i) => {
    const dry = now > 0 && now >= r.dryAt;
    const daysLeft = Math.max(1, Math.ceil((r.dryAt - now) / 86_400_000));
    return {
      id: r.id,
      dry,
      color: dry
        ? "radial-gradient(circle at 40% 35%,#f0c27a,#d98a3d)"
        : "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)",
      status: dry ? "乾了！收下來" : `還要 ${daysLeft} 天`,
      stColor: dry ? "#c47a3a" : "#7f9068",
      delay: `${i * 0.7}s`,
    };
  });

  // ── 湯譜石 ──
  const cappedCooked = Math.min(9, cooked);
  const stones = Array.from({ length: 9 }, (_, i) => i < cappedCooked);

  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 40 }}>
      {/* header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 20px 10px" }}>
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 20, margin: 0, color: "var(--shh-ink)" }}>
          湯湯屋{" "}
          <span style={{ fontFamily: "var(--font-noto-sans)", fontSize: 10, color: "var(--shh-muted-2)", fontWeight: 500, letterSpacing: ".14em" }}>
            FOREST SOUP HOUSE
          </span>
        </p>
        <Link href="/friends" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
          朋友們
        </Link>
      </div>

      {/* ══════ 本週的湯（主線・大）══════ */}
      <div
        style={{
          margin: "4px 16px 0", borderRadius: 24, background: "var(--shh-card)",
          boxShadow: "0 16px 40px -18px rgba(90,60,30,.5)", overflow: "hidden",
          animation: "shhIn .5s ease-out",
        }}
      >
        <div style={{ position: "relative", height: 184 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={week.image ?? "/images/handoff/fina-cooking.png"}
            alt=""
            style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 26%" }}
          />
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,rgba(30,22,10,.78) 100%)" }} />
          <div
            style={{
              position: "absolute", left: "44%", top: 22, width: 12, height: 40,
              background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)",
              filter: "blur(3px)", animation: "shhSteam 4.2s ease-in infinite",
            }}
          />
          <div style={{ position: "absolute", left: 18, bottom: 14, right: 18 }}>
            <p style={{ fontSize: 10, letterSpacing: ".18em", color: "#ffe9c0", fontWeight: 700, margin: 0 }}>
              本週的湯 · 每週一換 · 第 {week.weekNumber} 週
            </p>
            <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, color: "#fff", margin: "3px 0 0", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>
              {week.soupName}
            </h1>
          </div>
        </div>
        <div style={{ padding: "18px 16px 18px" }}>
          {/* 門縫下的信 */}
          <div style={{ position: "relative", background: "#fff", border: "1px solid var(--shh-border)", borderRadius: 14, padding: "15px 16px 13px", marginBottom: 14 }}>
            <span
              style={{
                position: "absolute", top: -10, left: 14, background: "#f0dfb4",
                border: "1px solid #d8bc7e", borderRadius: 999, padding: "2px 10px",
                fontSize: 10, fontWeight: 700, letterSpacing: ".1em", color: "#8a6a2f",
              }}
            >
              門縫下的信
            </span>
            <p style={{ ...serifTC, fontSize: 13.5, lineHeight: 1.9, color: "#4a3d2e", margin: "6px 0 0", whiteSpace: "pre-line" }}>
              {week.letter}
            </p>
            <p style={{ fontSize: 11.5, color: "var(--shh-muted)", margin: "8px 0 0", textAlign: "right" }}>
              —— 小狐狸 菲娜
            </p>
          </div>
          <Link
            href="/story"
            style={{
              ...serifTC,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              textDecoration: "none", height: 54, borderRadius: 16,
              background: "var(--shh-green)", color: "#faf4e6",
              fontWeight: 700, fontSize: 17, animation: "shhPulse 3.4s ease-in-out infinite",
            }}
          >
            {storyCta}
          </Link>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>
            <Link href="/map" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
              逛森林地圖
            </Link>
            <Link href="/pot" style={{ fontSize: 12.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
              進湯鍋煮湯
            </Link>
          </div>
        </div>
      </div>

      {/* ══════ 有東西在等你 ══════ */}
      {hooks.length > 0 ? (
        <div style={{ padding: "26px 20px 0" }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 12px" }}>
            有東西在等你
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {hooks.map((h) => (
              <Link
                key={h.title}
                href={h.href}
                style={{
                  display: "flex", alignItems: "center", gap: 13, textDecoration: "none",
                  background: h.bg, border: `1px solid ${h.border}`, borderRadius: 16,
                  padding: "13px 15px",
                }}
              >
                <span
                  style={{
                    ...serifTC,
                    width: 40, height: 40, flexShrink: 0, borderRadius: 11, background: h.iconBg,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 16, color: "#fff",
                  }}
                >
                  {h.glyph}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "var(--shh-ink)" }}>{h.title}</p>
                  <p style={{ fontSize: 11.5, color: "var(--shh-muted)", margin: "2px 0 0" }}>{h.sub}</p>
                </div>
                <span style={{ fontSize: 16, color: "#b89a6a" }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* ══════ 晾曬架 ══════ */}
      <div style={{ padding: "28px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 19, margin: 0, color: "var(--shh-ink)" }}>晾曬架</h2>
          <Link href="/map/herbal-patch" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
            去花園採花 →
          </Link>
        </div>
        <div
          style={{
            background: "#f8f2e2", border: "1px solid #e6d8b4", borderRadius: 18,
            padding: "14px 16px 14px", boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)",
          }}
        >
          <div style={{ height: 7, borderRadius: 4, background: "linear-gradient(180deg,#b98d5a,#8f6a3e)", boxShadow: "0 2px 4px rgba(90,60,30,.3)" }} />
          {rackItems.length > 0 ? (
            <div style={{ display: "flex", gap: 12, padding: "0 8px", flexWrap: "wrap" }}>
              {rackItems.map((r) => (
                <Link
                  key={r.id}
                  href="/map/herbal-patch"
                  style={{
                    display: "flex", flexDirection: "column", alignItems: "center",
                    textDecoration: "none", width: 72, transformOrigin: "50% 0",
                    animation: "shhSway 4.2s ease-in-out infinite", animationDelay: r.delay,
                  }}
                >
                  <span style={{ width: 2, height: 13, background: "#a8834f", display: "block" }} />
                  <span
                    style={{
                      ...serifTC,
                      width: 46, height: 46, borderRadius: "50% 50% 46% 46%", background: r.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 16, color: "#fff",
                      boxShadow: "0 6px 14px -6px rgba(120,80,30,.5)",
                    }}
                  >
                    花
                  </span>
                  <span style={{ fontSize: 10, fontWeight: 700, color: r.stColor, marginTop: 5, textAlign: "center", lineHeight: 1.4 }}>
                    {r.status}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <p style={{ textAlign: "center", fontSize: 11.5, color: "#8a9a72", margin: "14px 0 2px" }}>
              架上空空的。採一朵花掛上來，明天就有香香的湯料。
            </p>
          )}
        </div>
      </div>

      {/* ══════ 最新作品 ══════ */}
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 13, background: "#fff", border: "1px solid var(--shh-border)", borderRadius: 18, padding: "13px 15px" }}>
          <PhotoImg
            photoId={works[0]}
            alt="最新的作品"
            style={{ width: 74, height: 74, flexShrink: 0, borderRadius: 12, objectFit: "cover", display: "block" }}
            fallback={
              <span
                style={{
                  width: 74, height: 74, flexShrink: 0, borderRadius: 12,
                  border: "1.5px dashed var(--shh-dashed)", background: "#faf6ea",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, color: "#b3a186", textAlign: "center", lineHeight: 1.4,
                  padding: 4, boxSizing: "border-box",
                }}
              >
                這週的
                <br />
                手作
              </span>
            }
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "var(--shh-ink)" }}>最新的作品</p>
            <p style={{ fontSize: 11, color: "var(--shh-muted)", margin: "2px 0 0" }}>
              做完手作拍一張放這裡；全部都在紀念冊的作品牆
            </p>
          </div>
          <button
            onClick={openCabinet}
            style={{
              flexShrink: 0, border: "1.5px solid #e3cf9e", borderRadius: 12,
              background: "#fdf6e4", color: "#8a5a20", fontFamily: "inherit",
              fontWeight: 700, fontSize: 11.5, padding: "9px 12px", cursor: "pointer",
            }}
          >
            作品牆 →
          </button>
        </div>
      </div>

      {/* ══════ 湯譜石進度 ══════ */}
      <div
        style={{
          margin: "26px 20px 0", display: "flex", alignItems: "center", gap: 13,
          background: "#f3ecda", border: "1px solid #e0d2ad", borderRadius: 18, padding: "15px 16px",
        }}
      >
        <span
          style={{
            ...serifTC,
            width: 44, height: 44, flexShrink: 0, borderRadius: 13,
            background: "radial-gradient(circle at 40% 35%,#b9a7cf,#7a6a95)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 16px 2px rgba(150,120,190,.5)", animation: "shhGlow 3s ease-in-out infinite",
            color: "#fff", fontSize: 17,
          }}
        >
          石
        </span>
        <div style={{ flex: 1 }}>
          <p style={{ ...serifTC, fontWeight: 600, fontSize: 14, color: "var(--shh-ink)", margin: 0 }}>
            魔法湯譜石 · 點亮 {cappedCooked} / 9 鍋
          </p>
          <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
            {stones.map((lit, i) => (
              <span
                key={i}
                style={{
                  width: 14, height: 14, borderRadius: "50%",
                  background: lit ? "var(--shh-stone)" : "rgba(120,106,149,.22)",
                  boxShadow: lit ? "0 0 8px 1px rgba(150,120,190,.6)" : "none",
                }}
              />
            ))}
          </div>
        </div>
        <Link href="/map" style={{ fontSize: 11.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none", flexShrink: 0 }}>
          看地圖 →
        </Link>
      </div>

      {/* ══════ 給爸媽 ══════ */}
      <div style={{ margin: "24px 20px 0", background: "#fff", border: "1px dashed #d8b98a", borderRadius: 18, padding: "16px 18px" }}>
        <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 8px" }}>
          給爸媽的一句話
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 12.5, color: "#5b4a35", lineHeight: 1.7 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--shh-green)" }}>·</span>每週只換一鍋湯，不用每天追進度
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--shh-green)" }}>·</span>螢幕是起點：聽完故事就出門，回來只拍照收藏
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <span style={{ color: "var(--shh-green)" }}>·</span>收藏櫃裡沒有內建插圖——都是孩子自己拍到的世界
          </div>
        </div>
      </div>

      {/* footer */}
      <div style={{ textAlign: "center", marginTop: 28 }}>
        <p style={{ fontSize: 11, color: "var(--shh-muted)", margin: 0 }}>
          下雨天？聽故事＋把卡牌印出來，在桌上玩就好
        </p>
        <Link
          href="/print"
          style={{ display: "inline-block", marginTop: 8, fontSize: 11.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}
        >
          列印本週手作紙 →
        </Link>
        <p style={{ fontSize: 10.5, color: "#a89e8c", margin: "12px 0 0" }}>
          Forest Soup House · 為孩子與大自然做的小地方
        </p>
      </div>
    </div>
  );
}
