"use client";

/**
 * 草藥花園 — 採一朵今天的花 → 晾曬架（真實等待一天）→ 收進收藏櫃。
 * 版面 1:1 依 design handoff（湯湯屋-草藥花園.dc.html）。
 * 差異：dc 的「⏩ 曬乾」為示範用快轉，正式版拿掉——花真的要曬滿一天（dryAt 到了才能收）。
 */
import Link from "next/link";
import { useState } from "react";
import type { WeekIngredient } from "@/lib/weekly";
import {
  collectFromRack,
  getPantry,
  getRack,
  hangOnRack,
} from "@/lib/client/pantry";
import { useNow, useSoupState, useSoupStateTicking } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoCapture } from "@/components/app/PhotoCapture";
import { PhotoImg } from "@/components/app/PhotoImg";

const DAY_MS = 86_400_000;
const SCENTS = ["曬過太陽的棉被", "雨後的泥土", "甜甜的糖果"];
/** dc 的 FLOWER 外觀（晾曬架上的花） */
const FLOWER_GLYPH = "花";
const FLOWER_COLOR = "radial-gradient(circle at 40% 35%,#f0b8c8,#d97a95)";

export function HerbalGardenClient({ ingredients }: { ingredients: WeekIngredient[] }) {
  /** 本週在草藥花園採得到的材料（可能沒有） */
  const gardenIngredient = ingredients.find((i) => i.locationSlug === "herbal-patch") ?? null;

  const [step, setStep] = useState<"idle" | "picking">("idle");
  const [scent, setScent] = useState(SCENTS[0]);
  const [photoId, setPhotoId] = useState<string | undefined>(undefined);

  const rack = useSoupStateTicking(getRack, []);
  const now = useNow(); // 0 = 尚未 mount
  const pantry = useSoupState(getPantry, {});

  const addToRack = () => {
    hangOnRack({
      scent,
      dryAt: Date.now() + DAY_MS, // 花要曬上一天
      slug: gardenIngredient?.slug,
      name: gardenIngredient?.name ?? "香香花",
    });
    setStep("idle");
    setScent(SCENTS[0]);
    setPhotoId(undefined);
  };

  const rackItems = rack.map((r) => {
    const dry = now > 0 && now >= r.dryAt;
    const daysLeft = Math.max(1, Math.ceil((r.dryAt - now) / DAY_MS));
    return {
      id: r.id,
      name: r.name ?? "香香花",
      dry,
      status: dry ? `曬好了！香味像${r.scent}` : `晾曬中 · 還要 ${daysLeft} 天 · ${r.scent}`,
      statusColor: dry ? "#c47a3a" : "#7f9068",
      cardBg: dry ? "linear-gradient(160deg,#fff6e4,#fbeccb)" : "#fbf5e6",
      iconAnim: dry ? "sgGlow 2.4s ease-in-out infinite" : "none",
    };
  });

  const pantryRows = ingredients.map((i) => {
    const entry = pantry[i.slug];
    const collected = !!entry;
    const count = entry?.finds?.length ?? (entry ? 1 : 0);
    return {
      slug: i.slug,
      name: collected ? i.name : "？？？",
      glyph: collected ? i.glyph : "?",
      tile: i.tile,
      tileOpacity: collected ? 1 : 0.4,
      glyphColor: collected ? "#fff" : "rgba(90,70,50,.5)",
      nameColor: collected ? "#3a2f22" : "#a89880",
      collected,
      sub: collected ? `找到過 ${count} 次` : `在${i.locationName}採得到`,
      subColor: collected ? "#5b7a3f" : "#a89880",
      bg: collected ? "#fff" : "#f6f1e4",
      border: collected ? "#ecdcb8" : "#e4dcc6",
    };
  });
  const pantryCount = pantryRows.filter((p) => p.collected).length;

  return (
    <div
      style={{
        position: "absolute", inset: 0, overflowY: "auto",
        background: "linear-gradient(180deg,#dfe9cf 0%,#f4ead2 42%)",
        color: "#493d31", lineHeight: 1.6, paddingBottom: 44,
      }}
    >
      {/* sgGlow 只有這頁用，局部定義（其餘沿用 globals 的 shhIn/shhSway） */}
      <style>{`@keyframes sgGlow { 0%,100%{box-shadow:0 0 0 0 rgba(240,180,90,0)} 50%{box-shadow:0 0 0 5px rgba(240,180,90,.35)} }`}</style>

      {/* header：麵包屑三層 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <Link href="/" style={{ fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>湯湯屋</Link>
          <span style={{ color: "#b8a888" }}>›</span>
          <Link href="/map" style={{ fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>森林地圖</Link>
          <span style={{ color: "#b8a888" }}>›</span>
          <span style={{ fontWeight: 700, color: "#5b4a35" }}>草藥花園</span>
        </div>
        <Link href="/friends" style={{ fontSize: 12, fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>
          朋友們 →
        </Link>
      </div>

      {/* hero 地點卡 */}
      <div
        style={{
          margin: "8px 16px 0", borderRadius: 26, overflow: "hidden",
          background: "linear-gradient(160deg,#a8cf88,#5f9a52)",
          boxShadow: "0 16px 34px -18px rgba(60,120,40,.7)", position: "relative",
          animation: "shhIn .5s ease-out",
        }}
      >
        <div style={{ height: 132, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/handoff/herbal-patch.png"
            alt="搖曳的草藥花園"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
          <span
            style={{
              ...serifTC,
              position: "absolute", right: 26, top: 26, width: 46, height: 46, borderRadius: "50%",
              background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, color: "#5f9a52",
              boxShadow: "0 6px 14px -6px rgba(30,80,20,.6)",
              animation: "shhSway 3.6s ease-in-out infinite",
            }}
          >
            草
          </span>
        </div>
        <div style={{ background: "rgba(255,252,243,.96)", padding: "16px 18px 18px" }}>
          <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 24, margin: 0, color: "#3a2f22" }}>草藥花園</h1>
          <p style={{ fontSize: 12.5, color: "#a9793f", margin: "5px 0 0", fontStyle: "italic" }}>
            這裡種著「安心的小花」，聞起來像曬過太陽的棉被。
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, borderTop: "1px dashed #e0cfa8", paddingTop: 11 }}>
            <span
              style={{
                ...serifTC,
                width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                background: "radial-gradient(circle at 40% 35%,#d9a86a,#a5713a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 12, color: "#fff",
              }}
            >
              松
            </span>
            <p style={{ fontSize: 12, color: "#5b4a35", margin: 0 }}>
              小松鼠 <b>Milo</b> 常在這裡蒐集香味。
            </p>
          </div>
        </div>
      </div>

      {/* signature ritual：採花 */}
      <div style={{ margin: "18px 16px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 10px" }}>
          這裡能做的事
        </p>

        {step === "idle" ? (
          <div
            style={{
              background: "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18,
              boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "shhIn .35s ease-out",
            }}
          >
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "#3a2f22" }}>採一朵今天的花</p>
            <p style={{ fontSize: 12.5, color: "#5b4a35", margin: "7px 0 0", lineHeight: 1.75 }}>
              到陽台或公園，摘一朵真的花或一片葉子，拍下來放上晾曬架。
              <br />
              花要曬上一天才會變成湯料——明天記得回來收。
            </p>
            <button
              onClick={() => setStep("picking")}
              style={{
                ...serifTC,
                marginTop: 14, width: "100%", height: 46, border: "none", borderRadius: 14,
                background: "#5f9a52", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(40,110,30,.7)",
              }}
            >
              去採花 ✿
            </button>
          </div>
        ) : (
          <div
            style={{
              background: "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18,
              boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "shhIn .3s ease-out",
            }}
          >
            <p style={{ fontSize: 11, color: "#8a7659", margin: "0 0 8px" }}>你採到的花，聞起來像什麼？</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {SCENTS.map((name) => {
                const on = scent === name;
                return (
                  <button
                    key={name}
                    onClick={() => setScent(name)}
                    style={{
                      border: `1px solid ${on ? "#5f9a52" : "#e0cfa8"}`,
                      background: on ? "#5f9a52" : "#fff",
                      color: on ? "#fff" : "#5f7a4a",
                      fontFamily: "inherit", fontSize: 12.5, fontWeight: 700,
                      padding: "8px 13px", borderRadius: 999, cursor: "pointer",
                    }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 11, color: "#8a7659", margin: "16px 0 8px" }}>拍下你採到的花</p>
            <PhotoCapture
              onSaved={setPhotoId}
              style={{
                width: "100%", height: 150, display: "block", padding: 0, overflow: "hidden",
                borderRadius: 14, cursor: "pointer",
                border: photoId ? "1px solid #ecdcb8" : "1.5px dashed var(--shh-dashed)",
                background: "#faf6ea",
              }}
            >
              <PhotoImg
                photoId={photoId}
                alt="你採到的花"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                fallback={<span style={{ fontSize: 12, color: "#b3a186" }}>拍一朵真的花或葉子</span>}
              />
            </PhotoCapture>

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setStep("idle")}
                style={{
                  flex: "0 0 auto", height: 46, padding: "0 18px", border: "1px solid #e0cfa8",
                  borderRadius: 14, background: "#fff", color: "#5f7a4a",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                再看看
              </button>
              <button
                onClick={addToRack}
                style={{
                  ...serifTC,
                  flex: 1, height: 46, border: "none", borderRadius: 14, background: "#5f9a52",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 8px 18px -8px rgba(40,110,30,.7)",
                }}
              >
                放上晾曬架
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 晾曬架 */}
      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
            晾曬架 · {rack.length}
          </p>
          <span style={{ fontSize: 10.5, color: "#a08a68" }}>曬乾了就能收進收藏櫃</span>
        </div>

        {rackItems.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {rackItems.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex", alignItems: "center", gap: 13, background: r.cardBg,
                  border: "1px solid #ecdcb8", borderRadius: 18, padding: "13px 15px",
                  boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)", animation: "shhIn .4s ease-out",
                }}
              >
                <span
                  style={{
                    ...serifTC,
                    width: 42, height: 42, flexShrink: 0, borderRadius: "50%", background: FLOWER_COLOR,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: 15, color: "#fff", animation: r.iconAnim,
                  }}
                >
                  {FLOWER_GLYPH}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "#3a2f22" }}>{r.name}</p>
                  <p style={{ fontSize: 11, color: r.statusColor, margin: "2px 0 0", fontWeight: 600 }}>{r.status}</p>
                </div>
                {r.dry ? (
                  <button
                    onClick={() => collectFromRack(r.id)}
                    style={{
                      flexShrink: 0, height: 34, padding: "0 13px", border: "none", borderRadius: 11,
                      background: "#c9793a", color: "#fff", fontFamily: "inherit",
                      fontSize: 11.5, fontWeight: 700, cursor: "pointer",
                    }}
                  >
                    收進收藏櫃
                  </button>
                ) : null}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px dashed #c3d2a8", borderRadius: 18, padding: 22, textAlign: "center", color: "#7f9068" }}>
            <p style={{ fontSize: 12.5, margin: 0 }}>
              晾曬架空空的。
              <br />
              採一朵花放上來，明天就有香香的湯料了。
            </p>
          </div>
        )}
      </div>

      {/* 香料收藏櫃（全部畫面共用） */}
      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
            香料收藏櫃 · {pantryCount} / {pantryRows.length} 種
          </p>
          <span style={{ fontSize: 10.5, color: "#a08a68" }}>全部畫面共用的收藏</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pantryRows.map((p) => (
            <div
              key={p.slug}
              style={{
                display: "flex", alignItems: "center", gap: 13, background: p.bg,
                border: `1px solid ${p.border}`, borderRadius: 16, padding: "12px 14px",
              }}
            >
              <span
                style={{
                  ...serifTC,
                  width: 40, height: 40, flexShrink: 0, borderRadius: 11, background: p.tile,
                  opacity: p.tileOpacity, display: "flex", alignItems: "center", justifyContent: "center",
                  fontWeight: 700, fontSize: 15, color: p.glyphColor,
                }}
              >
                {p.glyph}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 14, margin: 0, color: p.nameColor }}>{p.name}</p>
                <p style={{ fontSize: 11, color: p.subColor, margin: "2px 0 0", fontWeight: 600 }}>{p.sub}</p>
              </div>
              {p.collected ? (
                <span
                  style={{
                    flexShrink: 0, fontSize: 10, color: "#5b7a3f", fontWeight: 700,
                    background: "#e9f2e6", borderRadius: 999, padding: "3px 9px",
                  }}
                >
                  ✓ 已收藏
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11, color: "#8a7659", margin: "11px 2px 0" }}>
          收藏只增不減；煮湯用的是本週食譜，不會清掉這裡。
        </p>
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#a89e8c", margin: "26px 24px 0", lineHeight: 1.8 }}>
        好的湯料，急不得。
        <br />
        這裡教的，是照顧一朵花，然後等它。
      </p>
    </div>
  );
}
