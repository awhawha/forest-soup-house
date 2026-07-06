"use client";

/**
 * 森林地圖 = 去哪找 — 9 個地點的解鎖旅程 + 本週採集任務層（香氣線 + 採集袋）。
 * 版面 1:1 依 design handoff（湯湯屋-森林地圖.dc.html）；DEMO ＋/− 控制依 spec 移除，
 * 進度由真實煮湯事件（stt_map_cooked）驅動。
 */
import Link from "next/link";
import { useRef, useState } from "react";
import type { MapPin, WeekBundle, WeekIngredient } from "@/lib/weekly";
import { addFind, getCooked, getPantry, type Pantry } from "@/lib/client/pantry";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoCapture } from "@/components/app/PhotoCapture";
import { PhotoImg } from "@/components/app/PhotoImg";

type PinStatus = "home" | "glow" | "awake" | "visited" | "dim";

/** 住戶插圖佔位色（依 dc.html LOCS.hostColor；真實美術到位後直接替換） */
const HOST_COLORS: Record<string, string> = {
  "soup-house": "radial-gradient(circle at 40% 35%,#f0a860,#c9793a)",
  "observation-post": "radial-gradient(circle at 40% 35%,#b9a7cf,#7a6a95)",
  "herbal-patch": "radial-gradient(circle at 40% 35%,#d9a86a,#a5713a)",
  "ingredient-woods": "radial-gradient(circle at 40% 35%,#8cc47e,#4f8a52)",
  "brewing-shed": "radial-gradient(circle at 40% 35%,#f0b45a,#d9733a)",
  "soupling-stream": "radial-gradient(circle at 40% 35%,#7fb0c9,#4a7f95)",
  "whisper-shed": "radial-gradient(circle at 40% 35%,#b9a7cf,#7a6a95)",
  "forest-post": "radial-gradient(circle at 40% 35%,#e0a860,#b5763a)",
  "character-grove": "radial-gradient(circle at 40% 35%,#f0a860,#c9793a)",
};

function latestPhotoOf(pantry: Pantry, slug: string): string | null {
  const finds = pantry[slug]?.finds ?? [];
  for (let i = finds.length - 1; i >= 0; i--) {
    if (finds[i].photoId) return finds[i].photoId!;
  }
  return null;
}

function countOf(pantry: Pantry, slug: string): number {
  const e = pantry[slug];
  return e?.finds?.length ?? (e ? 1 : 0);
}

export function ForestMapClient({ week, pins }: { week: WeekBundle; pins: MapPin[] }) {
  const cooked = useSoupState(getCooked, 0);
  const pantry = useSoupState(getPantry, {});
  const [sel, setSel] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── 本週材料 ↔ 地點的綁定（換週會自動移動）──
  const ingAt = (locSlug: string): WeekIngredient | null =>
    week.ingredients.find((i) => i.locationSlug === locSlug) ?? null;

  // ── pin 狀態（喚醒態：本週材料所在地點即使在霧裡也被香味暫時喚醒）──
  const statusOf = (pin: MapPin): PinStatus => {
    if (pin.unlockAtPot === 0) return "home";
    const isIngLoc = !!ingAt(pin.slug);
    const unlocked = cooked >= pin.unlockAtPot;
    if (isIngLoc) return unlocked ? "glow" : "awake";
    return unlocked ? "visited" : "dim";
  };

  const scrollToCard = () => {
    setTimeout(() => {
      const container = containerRef.current;
      const el = cardRef.current;
      if (!container || !el) return;
      const top =
        el.getBoundingClientRect().top -
        container.getBoundingClientRect().top +
        container.scrollTop -
        64;
      container.scrollTo({ top, behavior: "smooth" });
    }, 90);
  };

  const tapPin = (slug: string) => {
    const next = sel === slug ? null : slug;
    setSel(next);
    if (next) scrollToCard();
  };

  const tapBag = (locSlug: string) => {
    setSel(locSlug);
    scrollToCard();
  };

  // ── 旅程進度 ──
  const litCount = Math.min(cooked, 9);
  const dots = Array.from({ length: 8 }, (_, i) => {
    const n = i + 1;
    return n <= cooked ? "#c9793a" : n === cooked + 1 ? "#e8a94e" : "rgba(120,140,95,.28)";
  });

  // ── 採集袋 ──
  const bagCount = week.ingredients.filter((i) => !!pantry[i.slug]).length;

  // ── 地點詳細卡 ──
  const selPin = pins.find((p) => p.slug === sel) ?? null;
  const selIng = selPin ? ingAt(selPin.slug) : null;
  const selStatus = selPin ? statusOf(selPin) : null;
  const selLit = selStatus === "home" || selStatus === "visited" || selStatus === "glow";
  const selAwake = selStatus === "awake";
  const selBadge = selStatus
    ? { home: "我們的家", glow: "本週發光", awake: "被香味喚醒", visited: "去過的地方", dim: "還沒去過" }[selStatus]
    : "";
  const selBadgeColor =
    selStatus === "awake" || selStatus === "glow"
      ? "#c47a3a"
      : selStatus === "visited"
        ? "#4f7a52"
        : "#8a9a6a";
  let selTagline = "";
  let selDesc = "";
  if (selPin) {
    if (selLit) {
      selTagline = selPin.tagline;
      selDesc = selPin.description + (selStatus === "glow" ? "　本週的湯，就在這裡等你。" : "");
    } else if (selAwake) {
      selTagline = selPin.tagline;
      selDesc = "霧還沒散，但香味從這裡飄出來——本週的材料就在裡面。";
    } else {
      selTagline = "？？？";
      selDesc = "這個角落還被森林的霧藏著。";
    }
  }
  const selResidentUnlocked =
    !!selPin?.residentLine &&
    (selPin.residentUnlockAtPot == null || cooked >= selPin.residentUnlockAtPot);
  const selCollected = !!(selIng && pantry[selIng.slug]);
  const selFindCount = selIng ? countOf(pantry, selIng.slug) : 0;
  const selPhotoId = selIng ? latestPhotoOf(pantry, selIng.slug) : null;

  const remain = 9 - litCount;
  const footNote =
    remain > 0
      ? `還有 ${remain} 個角落沉睡在霧裡。\n每煮一鍋湯，就會多亮一個。`
      : "整座森林都亮起來了！\n大家在角色角，為你辦了一場慶祝會。";

  return (
    <div ref={containerRef} style={{ position: "absolute", inset: 0, overflowY: "auto" }}>
      {/* 局部 keyframes（globals.css 沒有的才在這裡定義） */}
      <style>{`
        @keyframes shhMapPin { 0%,100%{transform:scale(1)} 50%{transform:scale(1.07)} }
        @keyframes shhMapPop { 0%{transform:scale(.4);opacity:0} 60%{transform:scale(1.18)} 100%{transform:scale(1);opacity:1} }
      `}</style>
      <div
        style={{
          minHeight: "100%",
          background: "linear-gradient(180deg,#dfe9cf 0%,#eef2df 52%,#f4ead2 100%)",
          paddingBottom: 44,
          boxSizing: "border-box",
        }}
      >
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <Link href="/" style={{ fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
              湯湯屋
            </Link>
            <span style={{ color: "#b8a888" }}>›</span>
            <span style={{ fontWeight: 700, color: "#5b4a35" }}>森林地圖</span>
          </div>
          <Link href="/friends" style={{ fontSize: 12, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
            朋友們 →
          </Link>
        </div>

        <div style={{ textAlign: "center", padding: "6px 24px 0" }}>
          <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, margin: 0, color: "var(--shh-ink)" }}>森林地圖</h1>
          <p style={{ fontSize: 12.5, color: "#7f6c52", margin: "6px 0 0" }}>每煮一鍋湯，森林就多亮一個角落</p>
        </div>

        {/* progress */}
        <div
          style={{
            margin: "16px 16px 0",
            background: "rgba(255,252,243,.72)",
            border: "1px solid rgba(236,220,184,.9)",
            borderRadius: 18,
            padding: "13px 15px",
            boxShadow: "0 8px 20px -14px rgba(90,60,30,.4)",
          }}
        >
          <div>
            <p style={{ fontSize: 10, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>你的旅程</p>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 16, margin: "2px 0 0", color: "var(--shh-ink)" }}>
              煮到第 {cooked} 鍋 · 亮了 {litCount} / 9 個角落
            </p>
          </div>
          <div style={{ display: "flex", gap: 5, marginTop: 11 }}>
            {dots.map((bg, i) => (
              <span key={i} style={{ flex: 1, height: 6, borderRadius: 3, background: bg }} />
            ))}
          </div>
        </div>

        {/* MAP */}
        <div
          style={{
            position: "relative",
            margin: "14px 16px 0",
            height: 470,
            borderRadius: 26,
            overflow: "hidden",
            background: "linear-gradient(160deg,#c9dcaf,#b6cf98)",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,.4),0 14px 34px -16px rgba(60,80,40,.5)",
            animation: "shhIn .5s ease-out",
          }}
        >
          <span
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingTop: 9,
              fontFamily: "'Noto Sans Mono',monospace",
              fontSize: 9,
              color: "rgba(70,90,50,.55)",
              letterSpacing: ".1em",
            }}
          >
            插圖：森林地圖底圖（小徑・樹叢・小河）
          </span>
          <div
            style={{
              position: "absolute", left: "18%", top: "32%", width: "60%", height: 2,
              background: "repeating-linear-gradient(90deg,rgba(255,250,235,.6) 0 8px,transparent 8px 16px)",
              transform: "rotate(-9deg)",
            }}
          />
          <div
            style={{
              position: "absolute", left: "34%", top: "56%", width: "44%", height: 2,
              background: "repeating-linear-gradient(90deg,rgba(255,250,235,.6) 0 8px,transparent 8px 16px)",
              transform: "rotate(16deg)",
            }}
          />
          <div
            style={{
              position: "absolute", left: "22%", top: "70%", width: "34%", height: 2,
              background: "repeating-linear-gradient(90deg,rgba(255,250,235,.6) 0 8px,transparent 8px 16px)",
              transform: "rotate(-20deg)",
            }}
          />

          {pins.map((pin) => {
            const st = statusOf(pin);
            const home = st === "home";
            const glow = st === "glow";
            const awake = st === "awake";
            const visited = st === "visited";
            const fog = st === "dim";
            const justLit = pin.unlockAtPot === cooked && cooked > 0;
            const ing = ingAt(pin.slug);
            const scent = !!(ing && !pantry[ing.slug]);
            const anim = justLit
              ? "shhMapPop .55s ease-out"
              : glow
                ? "shhBreathe 3s ease-in-out infinite"
                : awake
                  ? "shhMapPin 3s ease-in-out infinite"
                  : "none";
            return (
              <div
                key={pin.slug}
                style={{
                  position: "absolute",
                  left: `${pin.x}%`,
                  top: `${pin.y}%`,
                  transform: "translate(-50%,-50%)",
                  textAlign: "center",
                  width: 92,
                }}
              >
                <button
                  onClick={() => tapPin(pin.slug)}
                  style={{
                    position: "relative",
                    border: "none",
                    background: "transparent",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 3,
                    width: "100%",
                    opacity: fog ? 0.5 : 1,
                    padding: 0,
                  }}
                >
                  {scent ? (
                    <>
                      <span
                        style={{
                          position: "absolute", left: "44%", top: -13, width: 9, height: 9,
                          borderRadius: "50%", background: "rgba(240,170,90,.8)", filter: "blur(2px)",
                          animation: "shhAroma 2.6s ease-out infinite",
                        }}
                      />
                      <span
                        style={{
                          position: "absolute", left: "58%", top: -7, width: 7, height: 7,
                          borderRadius: "50%", background: "rgba(240,170,90,.6)", filter: "blur(2px)",
                          animation: "shhAroma 2.6s ease-out 1.1s infinite",
                        }}
                      />
                    </>
                  ) : null}
                  <span
                    key={`${st}-${cooked}`}
                    style={{
                      ...serifTC,
                      position: "relative",
                      width: home ? 44 : glow || awake ? 40 : 32,
                      height: home ? 44 : glow || awake ? 40 : 32,
                      borderRadius: home ? 13 : "50%",
                      background: home
                        ? "#c9793a"
                        : glow
                          ? "radial-gradient(circle at 40% 35%,#f2c56a,#d98a3d)"
                          : awake
                            ? "radial-gradient(circle at 40% 35%,#f0d9a8,#d9b47e)"
                            : visited
                              ? "#8cb47e"
                              : "rgba(120,140,95,.4)",
                      border: fog ? "2px dashed rgba(255,255,255,.6)" : "none",
                      boxShadow: glow
                        ? "0 6px 16px -4px rgba(200,130,50,.6),0 0 0 3px #fff"
                        : home
                          ? "0 6px 14px -4px rgba(60,40,20,.5)"
                          : awake
                            ? "0 4px 12px -4px rgba(180,130,60,.5),0 0 0 2px #fff"
                            : visited
                              ? "0 4px 10px -4px rgba(60,80,40,.4),0 0 0 2px #fff"
                              : "none",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 13,
                      fontWeight: 700,
                      color: fog ? "rgba(60,80,45,.55)" : "#fff",
                      boxSizing: "border-box",
                      animation: anim,
                    }}
                  >
                    {fog ? "?" : pin.glyph}
                  </span>
                  <span
                    style={{
                      position: "relative", fontSize: 10, fontWeight: 700,
                      color: fog ? "#5a6a45" : "var(--shh-ink)",
                      background: "rgba(255,252,243,.85)", padding: "1px 6px", borderRadius: 5,
                    }}
                  >
                    {pin.name}
                  </span>
                  <span
                    style={{
                      position: "relative",
                      fontSize: 8.5,
                      fontWeight: 600,
                      color: scent
                        ? "#c47a3a"
                        : glow
                          ? "#a9793f"
                          : awake
                            ? "#c47a3a"
                            : visited
                              ? "#4f7a52"
                              : "#6a7a52",
                    }}
                  >
                    {scent
                      ? "有香味飄出來"
                      : home
                        ? "我們的家"
                        : glow
                          ? "本週發光"
                          : awake
                            ? "被香味喚醒"
                            : visited
                              ? "去過了"
                              : "還沒亮"}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* 採集袋（本週任務層）*/}
        <div
          style={{
            margin: "12px 16px 0",
            background: "rgba(255,252,243,.88)",
            border: "1px solid var(--shh-border)",
            borderRadius: 18,
            padding: "13px 15px",
            boxShadow: "0 8px 20px -14px rgba(90,60,30,.4)",
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
              採 集 袋 · 本週的三樣
            </p>
            <span style={{ fontSize: 10.5, color: "var(--shh-muted)", fontWeight: 600 }}>{bagCount} / 3</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
            {week.ingredients.map((ing) => {
              const collected = !!pantry[ing.slug];
              const count = countOf(pantry, ing.slug);
              return (
                <button
                  key={ing.slug}
                  onClick={() => tapBag(ing.locationSlug)}
                  style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 5,
                    border: collected ? "1.5px solid #cfe0bc" : "1.5px dashed var(--shh-dashed)",
                    borderRadius: 14,
                    background: collected ? "#f0f6e8" : "#faf6ea",
                    padding: "10px 4px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                  }}
                >
                  <span
                    style={{
                      ...serifTC,
                      width: 38,
                      height: 38,
                      borderRadius: "50%",
                      background: collected ? ing.gradient : "#e9e2cd",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: 15,
                      color: collected ? "#fff" : "#b3a186",
                    }}
                  >
                    {ing.glyph}
                  </span>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: collected ? "#3f6a3a" : "var(--shh-muted)" }}>
                    {ing.name}
                  </span>
                  <span style={{ fontSize: 9.5, color: collected ? "#5b7a3f" : "#c47a3a", fontWeight: 600 }}>
                    {collected ? `採到了 ✓ ×${count}` : `在${ing.locationName}`}
                  </span>
                </button>
              );
            })}
          </div>
          <p style={{ fontSize: 10, color: "var(--shh-muted-2)", margin: "9px 0 0", textAlign: "center" }}>
            跟著飄香味的地點去找，找到就拍照收進圖鑑
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "var(--shh-muted)", margin: "12px 0 0" }}>
          點一個地方，看看那裡的故事
        </p>

        {/* selected location card */}
        {selPin ? (
          <div
            id="sel-card"
            ref={cardRef}
            key={`${selPin.slug}-${cooked}`}
            style={{
              margin: "14px 16px 0",
              background: "var(--shh-card)",
              border: "1px solid var(--shh-border)",
              borderRadius: 20,
              padding: 18,
              boxShadow: "0 12px 30px -14px rgba(90,60,30,.4)",
              animation: "shhIn .35s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, margin: 0, color: "var(--shh-ink)" }}>
                {selPin.name}
              </p>
              <span style={{ fontSize: 10.5, color: selBadgeColor, fontWeight: 700 }}>{selBadge}</span>
            </div>
            <p style={{ fontSize: 12, color: "#a9793f", margin: "4px 0 0", fontStyle: "italic" }}>{selTagline}</p>
            <p style={{ fontSize: 13, color: "#5b4a35", margin: "10px 0 0", lineHeight: 1.8 }}>{selDesc}</p>

            {selResidentUnlocked ? (
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, borderTop: "1px dashed var(--shh-border-2)", paddingTop: 11 }}>
                <span
                  style={{
                    width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                    background: HOST_COLORS[selPin.slug] ?? "#ddd",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Noto Sans Mono',monospace", fontSize: 6,
                    color: "rgba(50,25,10,.7)", textAlign: "center", lineHeight: 1.1,
                  }}
                >
                  插圖
                </span>
                <p style={{ fontSize: 12, color: "#5b4a35", margin: 0 }}>{selPin.residentLine}</p>
              </div>
            ) : selPin.residentUnlockAtPot != null ? (
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, borderTop: "1px dashed var(--shh-border-2)", paddingTop: 11 }}>
                <span
                  style={{
                    width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                    background: "rgba(140,150,120,.28)", border: "2px dashed #c9bd9d",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 14, color: "#a89e82", boxSizing: "border-box",
                  }}
                >
                  ?
                </span>
                <p style={{ fontSize: 12, color: "var(--shh-muted)", margin: 0 }}>
                  霧散了才會見到這裡的住戶 · 煮到第 {selPin.residentUnlockAtPot} 鍋解鎖
                </p>
              </div>
            ) : null}

            {selLit && selPin.href ? (
              <Link
                href={selPin.href}
                style={{
                  ...serifTC,
                  display: "block",
                  marginTop: 12,
                  height: 44,
                  lineHeight: "44px",
                  textAlign: "center",
                  borderRadius: 14,
                  background: "var(--shh-amber)",
                  color: "#fff",
                  fontWeight: 700,
                  fontSize: 14,
                  textDecoration: "none",
                  boxShadow: "0 8px 18px -8px rgba(150,80,20,.7)",
                }}
              >
                走進{selPin.name} →
              </Link>
            ) : null}

            {selIng ? (
              <div style={{ marginTop: 12, background: "#fff", border: "1px solid var(--shh-border)", borderRadius: 16, padding: 13 }}>
                <p style={{ fontSize: 13, color: "var(--shh-ink)", fontWeight: 700, margin: 0 }}>
                  本週要找：{selIng.name}
                </p>
                <p style={{ fontSize: 11, color: "var(--shh-muted)", margin: "3px 0 10px" }}>
                  用鼻子在真實世界找到它，拍一張照放進來
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  {selPhotoId ? (
                    <PhotoImg
                      photoId={selPhotoId}
                      alt={`找到的${selIng.name}`}
                      style={{ width: 96, height: 96, flexShrink: 0, borderRadius: 14, objectFit: "cover", display: "block" }}
                    />
                  ) : (
                    <PhotoCapture
                      onSaved={(photoId) => addFind(selIng.slug, { photoId })}
                      style={{
                        width: 96,
                        height: 96,
                        flexShrink: 0,
                        borderRadius: 14,
                        border: "1.5px dashed var(--shh-dashed)",
                        background: "#faf6ea",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 10,
                        color: "#b3a186",
                        textAlign: "center",
                        lineHeight: 1.4,
                        padding: 4,
                        boxSizing: "border-box",
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      拍下找到的它
                    </PhotoCapture>
                  )}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                    {selCollected ? (
                      <>
                        <p style={{ fontSize: 12, color: "#5b7a3f", fontWeight: 700, margin: 0 }}>
                          ✓ 已收進圖鑑 · 找到過 {selFindCount} 次
                        </p>
                        <button
                          onClick={() => addFind(selIng.slug)}
                          style={{
                            height: 38,
                            border: "1.5px solid #b8c9b0",
                            borderRadius: 12,
                            background: "#eef3e2",
                            color: "var(--shh-green)",
                            fontFamily: "inherit",
                            fontWeight: 700,
                            fontSize: 12.5,
                            cursor: "pointer",
                          }}
                        >
                          又找到一次　＋1
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => addFind(selIng.slug)}
                        style={{
                          ...serifTC,
                          height: 44,
                          border: "none",
                          borderRadius: 12,
                          background: "var(--shh-amber)",
                          color: "#fff",
                          fontWeight: 700,
                          fontSize: 14,
                          cursor: "pointer",
                          boxShadow: "0 8px 18px -8px rgba(150,80,20,.7)",
                        }}
                      >
                        找到了！收進圖鑑
                      </button>
                    )}
                    <p style={{ fontSize: 10, color: "var(--shh-muted-2)", margin: 0 }}>
                      照片會出現在紀念冊的香味圖鑑
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        ) : null}

        {/* legend */}
        <div style={{ margin: "20px 20px 0", display: "flex", justifyContent: "center", gap: 16, fontSize: 10.5, color: "#7f6c52" }}>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#e8a94e", boxShadow: "0 0 6px 1px rgba(240,180,90,.7)" }} />
            本週發光
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "#8cb47e" }} />
            去過的地方
          </span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: "rgba(120,140,95,.4)", border: "1px dashed rgba(255,255,255,.8)", boxSizing: "border-box" }} />
            還沒去過
          </span>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#a89e8c", margin: "26px 24px 0", lineHeight: 1.8, whiteSpace: "pre-line" }}>
          {footNote}
        </p>
      </div>
    </div>
  );
}
