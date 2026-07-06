"use client";

/**
 * 湯鍋（日常廚房）— 找到的食譜 / 即興湯。
 * 版面 1:1 依 design handoff（湯湯屋-湯鍋.dc.html）。
 * 煮好只記錄到 stt_cooked_soups（recordPotSoup），不推進湯譜石。
 */
import { useState } from "react";
import Link from "next/link";
import type { DexIngredient, PotRecipeInfo } from "@/lib/weekly";
import { getPantry, recordPotSoup } from "@/lib/client/pantry";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";

interface CookedView {
  name: string;
  kind: "found" | "free";
  image: string | null;
}

export function SoupPotClient({
  recipes,
  dex,
}: {
  recipes: PotRecipeInfo[];
  dex: DexIngredient[];
}) {
  const pantry = useSoupState(getPantry, {});
  const [tab, setTab] = useState<"found" | "free">("found");
  const [pick, setPick] = useState<Record<string, boolean>>({});
  const [cooked, setCooked] = useState<CookedView | null>(null);

  const bySlug = new Map(dex.map((d) => [d.slug, d]));
  const nameOf = (slug: string) => bySlug.get(slug)?.name ?? slug;
  const has = (slug: string) => !!pantry[slug];
  const countOf = (slug: string) => pantry[slug]?.finds?.length ?? (pantry[slug] ? 1 : 0);

  /** 圖鑑 ∩ 收藏：已採到的材料（跨週、依週序） */
  const collected = dex.filter((d) => has(d.slug));
  const picks = Object.keys(pick).filter((k) => pick[k]);

  const togglePick = (slug: string) =>
    setPick((p) => {
      const next = { ...p };
      if (next[slug]) delete next[slug];
      else next[slug] = true;
      return next;
    });

  const finishCook = (soup: CookedView, ingredientSlugs: string[]) => {
    recordPotSoup({ name: soup.name, kind: soup.kind, ingredientSlugs });
    setCooked(soup);
  };

  const cookRecipe = (r: PotRecipeInfo) => {
    if (!r.ingredientSlugs.every(has)) return;
    finishCook({ name: r.name, kind: "found", image: r.image }, r.ingredientSlugs);
  };

  const cookFree = () => {
    if (picks.length < 2) return;
    const name = `${picks.slice(0, 2).map(nameOf).join("×")}湯`;
    finishCook({ name, kind: "free", image: null }, picks);
  };

  const cookAgain = () => {
    setCooked(null);
    setPick({});
  };

  const badge =
    cooked?.kind === "found"
      ? { label: "找到的食譜", bg: "#eef5ec", border: "#cfe0bc", color: "var(--shh-green)" }
      : { label: "即興湯 · 只留紀念", bg: "#efe7f2", border: "#cdbcdf", color: "#7a5f95" };
  const cookedLine =
    cooked?.kind === "free" ? "你挑的味道，我幫你煮成了這一鍋。" : "菲娜把湯分給大家，一起喝了。";

  return (
    <>
      <style>{`@keyframes spSteam { 0%{transform:translateY(0);opacity:0} 20%{opacity:.6} 100%{transform:translateY(-46px);opacity:0} }`}</style>

      <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 44 }}>
        {/* header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 6px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
            <Link href="/" style={{ fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
              湯湯屋
            </Link>
            <span style={{ color: "#b8a888" }}>›</span>
            <span style={{ fontWeight: 700, color: "#5b4a35" }}>湯鍋</span>
          </div>
          <Link href="/map" style={{ fontSize: 12, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
            森林地圖 →
          </Link>
        </div>

        <div style={{ textAlign: "center", padding: "4px 24px 0" }}>
          <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, margin: 0, color: "var(--shh-ink)" }}>湯鍋</h1>
          <p style={{ fontSize: 12.5, color: "#7f6c52", margin: "5px 0 0" }}>用收藏櫃裡的材料，煮一鍋湯</p>
        </div>

        {/* pantry strip */}
        <div
          style={{
            margin: "16px 16px 0", background: "rgba(255,252,243,.8)",
            border: "1px solid var(--shh-border)", borderRadius: 16, padding: "13px 15px",
          }}
        >
          <p style={{ fontSize: 10.5, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 9px" }}>
            你的收藏櫃 · {collected.length} 種
          </p>
          {collected.length > 0 ? (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {collected.map((c) => (
                <span
                  key={c.slug}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 7, background: "#fff",
                    border: "1px solid var(--shh-border)", borderRadius: 999, padding: "6px 12px 6px 7px",
                  }}
                >
                  <span
                    style={{
                      ...serifTC,
                      width: 22, height: 22, borderRadius: "50%", background: c.tile,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 11, color: "#fff",
                    }}
                  >
                    {c.glyph}
                  </span>
                  <span style={{ fontSize: 12, color: "#5b4a35" }}>
                    {c.name} ×{countOf(c.slug)}
                  </span>
                </span>
              ))}
            </div>
          ) : (
            <p style={{ fontSize: 12, color: "var(--shh-muted)", margin: 0 }}>
              收藏櫃還空空的——先去採一些材料，再回來煮。
            </p>
          )}
        </div>

        {/* tabs */}
        <div style={{ margin: "16px 16px 0", display: "flex", gap: 0, background: "#eee5cd", borderRadius: 14, padding: 4 }}>
          {([
            { key: "found", label: "找到的食譜" },
            { key: "free", label: "即興湯" },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                flex: 1, border: "none", cursor: "pointer", fontFamily: "inherit",
                fontWeight: 700, fontSize: 12.5, padding: "10px 4px", borderRadius: 11,
                background: tab === t.key ? "#fff" : "transparent",
                color: tab === t.key ? "var(--shh-ink)" : "var(--shh-muted-2)",
                boxShadow: tab === t.key ? "0 2px 8px -2px rgba(90,60,30,.3)" : "none",
                transition: "all .2s",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════ TAB: 找到的食譜 ══════ */}
        {tab === "found" ? (
          <div style={{ margin: "16px 16px 0", display: "flex", flexDirection: "column", gap: 12 }}>
            {recipes.map((r) => {
              const missing = r.ingredientSlugs.filter((s) => !has(s)).map(nameOf);
              const canCook = missing.length === 0;
              return (
                <div
                  key={r.slug}
                  style={{
                    background: "var(--shh-card)", border: "1px solid var(--shh-border)",
                    borderRadius: 20, padding: 18,
                    boxShadow: "0 8px 22px -16px rgba(90,60,30,.4)", animation: "shhIn .35s ease-out",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, margin: 0, color: "var(--shh-ink)" }}>
                      {r.name}
                    </p>
                    <span
                      style={{
                        fontSize: 10.5, color: "var(--shh-green)", fontWeight: 700,
                        background: "#eef5ec", borderRadius: 999, padding: "2px 10px",
                      }}
                    >
                      找到的食譜
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
                    {r.ingredientSlugs.map((slug) => {
                      const owned = has(slug);
                      return (
                        <span
                          key={slug}
                          style={{
                            display: "inline-flex", alignItems: "center", gap: 6,
                            background: owned ? "#eef5ec" : "#f6f1e4",
                            border: `1px solid ${owned ? "#cfe0bc" : "#e4d6c0"}`,
                            borderRadius: 999, padding: "5px 11px 5px 6px",
                          }}
                        >
                          <span
                            style={{
                              width: 20, height: 20, borderRadius: "50%",
                              background: owned ? "#4a8a52" : "#e5ddc8",
                              color: owned ? "#fff" : "#a89880",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11,
                            }}
                          >
                            {owned ? "✓" : "?"}
                          </span>
                          <span style={{ fontSize: 11.5, color: owned ? "#3d4a2e" : "#9c8c70", fontWeight: 500 }}>
                            {nameOf(slug)}
                          </span>
                        </span>
                      );
                    })}
                  </div>
                  {canCook ? (
                    <button
                      onClick={() => cookRecipe(r)}
                      style={{
                        ...serifTC,
                        marginTop: 14, width: "100%", height: 44, border: "none", borderRadius: 13,
                        background: "var(--shh-green)", color: "#fff",
                        fontWeight: 700, fontSize: 15, cursor: "pointer",
                      }}
                    >
                      材料齊了，煮！
                    </button>
                  ) : (
                    <p style={{ fontSize: 11.5, color: "var(--shh-muted)", margin: "12px 0 0" }}>
                      還差 {missing.join("、")}
                      {r.flavorText ?? ""}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* ══════ TAB: 即興湯 ══════ */}
        {tab === "free" ? (
          <div style={{ margin: "16px 16px 0" }}>
            <div style={{ background: "#f6f1ea", border: "1px solid #e4d6c0", borderRadius: 20, padding: 18, animation: "shhIn .35s ease-out" }}>
              <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "var(--shh-ink)" }}>
                隨手煮一鍋
              </p>
              <p style={{ fontSize: 12, color: "var(--shh-muted)", margin: "6px 0 0" }}>
                從收藏裡挑 2 樣以上，菲娜幫你的湯取個名字。（即興湯只留下紀念卡，不推進世界解鎖）
              </p>

              {collected.length > 0 ? (
                <>
                  <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 14 }}>
                    {collected.map((f) => {
                      const on = !!pick[f.slug];
                      return (
                        <button
                          key={f.slug}
                          onClick={() => togglePick(f.slug)}
                          style={{
                            display: "flex", alignItems: "center", gap: 11, textAlign: "left",
                            border: `1.5px solid ${on ? "#b9a7cf" : "#e4d6c0"}`,
                            background: on ? "#efe7f2" : "#fff",
                            borderRadius: 14, padding: "11px 13px", cursor: "pointer", fontFamily: "inherit",
                          }}
                        >
                          <span
                            style={{
                              ...serifTC,
                              width: 34, height: 34, flexShrink: 0, borderRadius: 9, background: f.gradient,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontWeight: 700, fontSize: 14, color: "#fff",
                            }}
                          >
                            {f.glyph}
                          </span>
                          <span style={{ flex: 1, fontSize: 13.5, color: "var(--shh-ink)", fontWeight: 500 }}>
                            {f.name}
                          </span>
                          <span style={{ fontSize: 11, color: "var(--shh-muted-2)" }}>×{countOf(f.slug)}</span>
                          <span
                            style={{
                              width: 24, height: 24, flexShrink: 0, borderRadius: "50%",
                              background: on ? "#8a6aa5" : "#e0d5c2", color: "#fff",
                              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
                            }}
                          >
                            {on ? "✓" : ""}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <button
                    onClick={cookFree}
                    style={{
                      ...serifTC,
                      marginTop: 16, width: "100%", height: 48, border: "none", borderRadius: 14,
                      background: picks.length >= 2 ? "#8a6aa5" : "#c9bdd4", color: "#fff",
                      fontWeight: 700, fontSize: 16,
                      cursor: picks.length >= 2 ? "pointer" : "default",
                      boxShadow: "0 10px 22px -8px rgba(138,106,165,.5)",
                    }}
                  >
                    {picks.length >= 2 ? `就用這些煮煮看！（${picks.length} 樣）` : "至少挑 2 樣"}
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: 12.5, color: "var(--shh-muted)", margin: "14px 0 0" }}>
                    先去地圖採一點材料，回來就能亂煮了。
                  </p>
                  <Link
                    href="/map"
                    style={{
                      display: "inline-block", marginTop: 10, fontSize: 12.5,
                      fontWeight: 600, color: "var(--shh-green)", textDecoration: "none",
                    }}
                  >
                    去森林地圖 →
                  </Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* ══════ 煮好了：底部彈窗（絕對定位於手機框內）══════ */}
      {cooked ? (
        <div
          style={{
            position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "flex-end",
            background: "rgba(50,38,22,.5)", animation: "jbFade .25s ease-out",
          }}
        >
          <div
            style={{
              width: "100%",
              background: "radial-gradient(120% 70% at 50% 0%,#fbf3dd,#efe0bd)",
              borderRadius: "26px 26px 0 0", padding: "26px 24px 34px",
              boxShadow: "0 -14px 40px -12px rgba(60,40,20,.5)",
              textAlign: "center", boxSizing: "border-box", animation: "jbUp .3s ease-out",
            }}
          >
            <p style={{ fontSize: 11, letterSpacing: ".22em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
              湯 · 煮 · 好 · 了
            </p>
            <div style={{ position: "relative", width: 140, height: 140, margin: "16px auto 0" }}>
              <div
                style={{
                  position: "absolute", left: 40, top: 2, width: 12, height: 42,
                  background: "radial-gradient(circle,rgba(230,180,90,.85),transparent 70%)",
                  filter: "blur(3px)", animation: "spSteam 4s ease-in infinite",
                }}
              />
              <div
                style={{
                  position: "absolute", left: 84, top: 0, width: 12, height: 48,
                  background: "radial-gradient(circle,rgba(230,180,90,.85),transparent 70%)",
                  filter: "blur(3px)", animation: "spSteam 4.5s ease-in .6s infinite",
                }}
              />
              <div
                style={{
                  position: "absolute", left: "50%", top: "56%", transform: "translate(-50%,-50%)",
                  width: 122, height: 122, borderRadius: "50%", overflow: "hidden", background: "#fdf6e8",
                  boxShadow: "0 14px 30px -8px rgba(200,130,50,.6)", animation: "jbPop .5s ease-out",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cooked.image ?? "/images/handoff/soup-pot.png"}
                  alt="一碗湯"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", transform: "scale(1.12)" }}
                />
              </div>
            </div>
            <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 24, margin: "16px 0 0", color: "var(--shh-ink)" }}>
              {cooked.name}
            </h2>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 7, marginTop: 10,
                padding: "6px 14px", borderRadius: 999,
                background: badge.bg, border: `1px solid ${badge.border}`,
              }}
            >
              <span style={{ fontSize: 12, color: badge.color, fontWeight: 700 }}>{badge.label}</span>
            </div>
            <p style={{ fontSize: 13, color: "#5b4a35", margin: "16px 0 0", lineHeight: 1.8 }}>{cookedLine}</p>
            <div style={{ display: "flex", gap: 12, marginTop: 22 }}>
              <button
                onClick={cookAgain}
                style={{
                  ...serifTC,
                  flex: 1, border: "1.5px solid #cdb98a", cursor: "pointer", background: "transparent",
                  fontWeight: 600, fontSize: 15, color: "#6b5a44", padding: 14, borderRadius: 15,
                }}
              >
                再煮一鍋
              </button>
              <Link
                href="/"
                style={{
                  ...serifTC,
                  flex: 1, border: "none", cursor: "pointer", background: "var(--shh-green)",
                  fontWeight: 600, fontSize: 15, color: "#faf4e6", padding: 14, borderRadius: 15,
                  textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                回湯湯屋
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
