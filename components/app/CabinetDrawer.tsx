"use client";

/**
 * 菲娜的湯譜紀念冊 — 全域共用抽屜（右下 FAB，每頁都能開）。
 * 三區：湯譜卡 / 香味圖鑑（孩子拍的照片）/ 作品牆。
 * soup-cabinet-open 事件亦可開啟。
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import type { DexIngredient, WeekCardInfo } from "@/lib/weekly";
import {
  CABINET_OPEN,
  addWork,
  getCabinetCards,
  getPantry,
  getWorks,
  latestPhotoId,
} from "@/lib/client/pantry";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoImg } from "@/components/app/PhotoImg";
import { PhotoCapture } from "@/components/app/PhotoCapture";

/** 一開始就擁有的紀念卡（上一次旅程） */
const STARTER = {
  id: "sunrise-orange",
  name: "蜜柑暖暖湯",
  img: "/images/handoff/orange-card.png",
  imgPos: "50% 30%",
};

interface CabinetDrawerProps {
  weekCards: WeekCardInfo[];
  dex: DexIngredient[];
  currentWeek: number;
}

export function CabinetDrawer({ weekCards, dex, currentWeek }: CabinetDrawerProps) {
  const [open, setOpen] = useState(false);
  const ownedCards = useSoupState(getCabinetCards, [STARTER.id]);
  const pantry = useSoupState(getPantry, {});
  const works = useSoupState(getWorks, []);

  useEffect(() => {
    const openEvt = () => setOpen(true);
    window.addEventListener(CABINET_OPEN, openEvt);
    return () => window.removeEventListener(CABINET_OPEN, openEvt);
  }, []);

  const currentBundleIngs = dex.filter((d) => d.weekNumber === currentWeek);
  const collectedCount = currentBundleIngs.filter((d) => pantry[d.slug]).length;
  const allCollected = collectedCount >= 3;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 90,
        pointerEvents: "none",
        color: "var(--shh-body)",
      }}
    >
      {/* ── FAB ── */}
      {!open ? (
        <button
          onClick={() => setOpen(true)}
          aria-label="打開湯譜紀念冊"
          style={{
            pointerEvents: "auto",
            position: "absolute",
            right: 16,
            bottom: 20,
            width: 58,
            height: 58,
            borderRadius: "50%",
            border: "2px solid #e3cf9e",
            cursor: "pointer",
            background: "linear-gradient(160deg,#fdf6e4,#f0e2c0)",
            boxShadow: "0 10px 26px -8px rgba(120,80,30,.55)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* 筆記本圖示 */}
          <span style={{ position: "relative", width: 30, height: 34, display: "block" }}>
            <span
              style={{
                position: "absolute", left: 2, top: 4, width: 22, height: 28,
                borderRadius: 4, background: "#fff", border: "1.5px solid #d8b98a",
                transform: "rotate(-8deg)",
              }}
            />
            <span
              style={{
                position: "absolute", left: 7, top: 1, width: 22, height: 28,
                borderRadius: 4, background: "#fff9ec", border: "1.5px solid #c47a3a",
                transform: "rotate(6deg)", display: "flex", flexDirection: "column",
                padding: "3px 3px 0",
              }}
            >
              <span style={{ height: 10, borderRadius: 2, background: "#f0c27a", display: "block" }} />
              <span style={{ height: 2.5, marginTop: 3, borderRadius: 2, background: "#e0cfa8", display: "block" }} />
              <span style={{ height: 2.5, marginTop: 2, borderRadius: 2, background: "#e0cfa8", display: "block", width: "70%" }} />
            </span>
          </span>
          <span
            style={{
              position: "absolute", top: -4, right: -4, minWidth: 22, height: 22,
              borderRadius: 999, background: "#c47a3a", color: "#fff",
              fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center",
              justifyContent: "center", boxShadow: "0 3px 8px -2px rgba(120,60,10,.6)",
              padding: "0 5px",
            }}
          >
            {ownedCards.length}
          </span>
        </button>
      ) : null}

      {/* ── DRAWER ── */}
      {open ? (
        <>
          <div
            onClick={() => setOpen(false)}
            style={{
              pointerEvents: "auto", position: "absolute", inset: 0,
              background: "rgba(50,38,22,.45)", animation: "jbFade .25s ease-out",
            }}
          />
          <div
            style={{
              pointerEvents: "auto", position: "absolute", left: 0, right: 0, bottom: 0,
              background: "var(--shh-card)", borderRadius: "26px 26px 0 0",
              padding: "20px 20px 28px",
              boxShadow: "0 -14px 40px -12px rgba(60,40,20,.5)",
              maxHeight: "82%", overflowY: "auto", animation: "jbUp .35s ease-out",
              boxSizing: "border-box",
            }}
          >
            <div style={{ width: 42, height: 5, borderRadius: 999, background: "#e0cfa8", margin: "0 auto 14px" }} />
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 4 }}>
              <h3 style={{ ...serifTC, fontWeight: 700, fontSize: 20, margin: 0, color: "var(--shh-ink)" }}>
                菲娜的湯譜紀念冊
              </h3>
              <button
                onClick={() => setOpen(false)}
                style={{
                  border: "none", background: "transparent", cursor: "pointer",
                  fontFamily: "inherit", fontSize: 13, color: "var(--shh-muted-2)", padding: 4,
                }}
              >
                收起 ▾
              </button>
            </div>
            <p style={{ fontSize: 12, color: "var(--shh-muted)", margin: "0 0 16px" }}>
              每煮好一鍋湯就多一張卡；印出來的手作紙，做好可以貼在家裡的牆上
            </p>

            {/* ── 湯譜卡 ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {/* 起始紀念卡 */}
              <OwnedCard
                name={STARTER.name}
                img={STARTER.img}
                imgPos={STARTER.imgPos}
                sub="上一次的旅程 · 已收藏"
                subColor="#a08a68"
              />
              {weekCards.map((card) => {
                const isOwned = ownedCards.includes(card.themeSlug);
                const isCurrent = card.weekNumber === currentWeek;
                if (isOwned) {
                  return (
                    <OwnedCard
                      key={card.themeSlug}
                      name={card.soupName}
                      img={card.image ?? "/images/handoff/soup-pot.png"}
                      imgPos="50% 40%"
                      sub={`已煮好 · ★ ${card.badgeName}`}
                      subColor="#5b7a3f"
                      pop={isCurrent}
                    />
                  );
                }
                if (isCurrent) {
                  return (
                    <PendingCard
                      key={card.themeSlug}
                      name={card.soupName}
                      tileBg="#f2ecd8"
                      hint={allCollected ? "材料齊了，還沒煮好" : `材料 ${collectedCount} / 3`}
                      cta={{
                        href: allCollected ? "/story" : "/map",
                        label: allCollected ? "回去煮湯　→" : "去採材料　→",
                        bg: "#c47a3a", color: "#fff", border: "none",
                      }}
                    />
                  );
                }
                return (
                  <PendingCard
                    key={card.themeSlug}
                    name={card.soupName}
                    tileBg="linear-gradient(160deg,#e8ecdf,#dde5e8)"
                    hint={card.weekNumber < currentWeek ? "錯過的一週" : `第 ${card.weekNumber} 週見`}
                  />
                );
              })}
            </div>

            {/* ── 香味圖鑑 ── */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "20px 0 10px" }}>
              <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
                香 味 圖 鑑
              </p>
              <span style={{ fontSize: 10, color: "var(--shh-muted-2)" }}>每一格都是孩子自己拍到的</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
              {dex.map((ing) => {
                const entry = pantry[ing.slug];
                const collected = !!entry;
                const count = entry?.finds?.length ?? 0;
                const photoId = collected ? latestPhotoId(ing.slug) : null;
                return (
                  <div
                    key={`${ing.weekNumber}-${ing.slug}`}
                    style={{
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                      padding: "12px 6px", borderRadius: 16,
                      background: collected ? "#fff" : "#f5f0e2",
                      border: `1.5px solid ${collected ? "#ecd9b4" : "#e0d5ba"}`,
                    }}
                  >
                    <PhotoImg
                      photoId={photoId}
                      alt={ing.name}
                      style={{
                        width: 44, height: 44, borderRadius: 12, objectFit: "cover",
                        display: "block", boxShadow: "0 3px 8px -3px rgba(90,60,30,.5)",
                      }}
                      fallback={
                        <span
                          style={{
                            width: 44, height: 44, borderRadius: 12,
                            background: collected ? ing.tile : "#e5ddc8",
                            opacity: collected ? 1 : 0.55,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--font-geist-mono), monospace",
                            fontSize: 7, color: "rgba(80,60,40,.7)",
                            textAlign: "center", lineHeight: 1.2, padding: 2,
                            boxSizing: "border-box",
                          }}
                        >
                          {collected ? `插圖：\n${ing.name.slice(0, 3)}` : "?"}
                        </span>
                      }
                    />
                    <span style={{ fontSize: 11, fontWeight: 500, color: collected ? "#5b4a35" : "#b3a186" }}>
                      {collected ? ing.name : "？？？"}
                    </span>
                    <span style={{ fontSize: 10, color: collected ? "#5b7a3f" : "#c0b498" }}>
                      {collected ? `找到過 ${count} 次` : "還沒採到"}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* ── 作品牆 ── */}
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", margin: "20px 0 10px" }}>
              <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
                作 品 牆
              </p>
              <span style={{ fontSize: 10, color: "var(--shh-muted-2)" }}>在真實世界做出來的</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {works.map((photoId) => (
                <PhotoImg
                  key={photoId}
                  photoId={photoId}
                  alt="手作作品"
                  style={{ width: "100%", height: 120, borderRadius: 14, objectFit: "cover", display: "block" }}
                />
              ))}
              <PhotoCapture
                onSaved={(id) => addWork(id)}
                style={{
                  width: "100%", height: 120, borderRadius: 14,
                  border: "1.5px dashed var(--shh-dashed)", background: "#faf6ea",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center", gap: 6,
                  fontFamily: "inherit", fontSize: 11.5, color: "#8a9a72",
                }}
              >
                <span style={{ fontSize: 22, color: "#c9b88f" }}>＋</span>
                {works.length === 0 ? "這週的手作作品" : "再放一張作品"}
              </PhotoCapture>
            </div>

            <Link
              href="/print"
              style={{
                display: "block", textAlign: "center", marginTop: 18,
                fontSize: 12.5, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none",
              }}
            >
              列印手作紙 · 做成自己的紀念冊　→
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}

function OwnedCard({
  name, img, imgPos, sub, subColor, pop,
}: {
  name: string; img: string; imgPos: string; sub: string; subColor: string; pop?: boolean;
}) {
  return (
    <div
      style={{
        background: "#fff", border: "1.5px solid #ecd9b4", borderRadius: 18, padding: 10,
        boxShadow: "0 6px 16px -10px rgba(120,80,30,.4)",
        animation: pop ? "jbPop .5s ease-out" : "none",
      }}
    >
      <div style={{ height: 120, borderRadius: 12, overflow: "hidden", background: "#fdf3df" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: imgPos }} />
      </div>
      <p style={{ ...serifTC, fontWeight: 600, fontSize: 14.5, margin: "8px 0 0", color: "var(--shh-ink)" }}>{name}</p>
      <p style={{ fontSize: 11, color: subColor, margin: "2px 0 0" }}>{sub}</p>
    </div>
  );
}

function PendingCard({
  name, tileBg, hint, cta,
}: {
  name: string;
  tileBg: string;
  hint: string;
  cta?: { href: string; label: string; bg: string; color: string; border: string };
}) {
  return (
    <div
      style={{
        background: "#faf6ea", border: "1.5px dashed var(--shh-dashed)", borderRadius: 18,
        padding: 10, display: "flex", flexDirection: "column",
      }}
    >
      <div
        style={{
          height: 120, borderRadius: 12, background: tileBg,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
        }}
      >
        <span style={{ ...serifTC, fontSize: 30, color: "#c9b88f" }}>?</span>
        <span style={{ fontSize: 11, color: "#8a9a90" }}>{hint}</span>
      </div>
      <p style={{ ...serifTC, fontWeight: 600, fontSize: 14.5, margin: "8px 0 0", color: "#6b5a44" }}>{name}</p>
      {cta ? (
        <Link
          href={cta.href}
          style={{
            display: "block", textAlign: "center", marginTop: 6,
            border: cta.border, background: cta.bg, fontFamily: "inherit",
            fontWeight: 700, fontSize: 12, color: cta.color, padding: 8,
            borderRadius: 10, textDecoration: "none",
          }}
        >
          {cta.label}
        </Link>
      ) : null}
    </div>
  );
}
