"use client";

/**
 * 親子實體版（週故事流程）— 場景機 gate → story → gather → cook → done。
 * 版面 1:1 依 design handoff（湯湯屋-親子實體版.dc.html）。
 * 從首頁進來一律停在 gate，不自動播故事。
 */
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type { WeekBundle, WeekIngredient } from "@/lib/weekly";
import {
  addFind,
  finishWeekSoup,
  getAudioPos,
  getCabinetCards,
  getPantry,
  latestPhotoId,
  openCabinet,
  saveAudioPos,
} from "@/lib/client/pantry";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoCapture } from "@/components/app/PhotoCapture";
import { PhotoImg } from "@/components/app/PhotoImg";

type Scene = "gate" | "story" | "gather" | "cook" | "done";

/** dc.html 的局部 keyframes（globals.css 沒有的，前綴 sfw 避免撞名） */
const LOCAL_KEYFRAMES = `
@keyframes sfwSteam { 0%{transform:translateY(0) scaleX(1);opacity:0} 15%{opacity:.55} 100%{transform:translateY(-90px) scaleX(1.5);opacity:0} }
@keyframes sfwMote { 0%{transform:translate(0,0);opacity:0} 20%{opacity:.9} 80%{opacity:.7} 100%{transform:translate(14px,-70px);opacity:0} }
@keyframes sfwFly { 0%,100%{transform:translate(0,0);opacity:.25} 50%{transform:translate(10px,-16px);opacity:1} }
@keyframes sfwBubble { 0%{transform:translateY(6px) scale(.6);opacity:0} 40%{opacity:.9} 100%{transform:translateY(-26px) scale(1);opacity:0} }
@keyframes sfwPageIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
@keyframes sfwPulse { 0%,100%{transform:scale(1);box-shadow:0 10px 30px -10px rgba(200,130,50,.5)} 50%{transform:scale(1.04);box-shadow:0 16px 40px -10px rgba(200,130,50,.7)} }
@keyframes sfwFloatUp { 0%{transform:translateY(0) rotate(0);opacity:0} 20%{opacity:1} 100%{transform:translateY(-40px) rotate(20deg);opacity:0} }
@keyframes sfwDrift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
`;

const STIR_MS = 1500;

export function StoryFlowClient({ week }: { week: WeekBundle }) {
  const [scene, setScene] = useState<Scene>("gate");
  const [storyPage, setStoryPage] = useState(0);

  const pantry = useSoupState(getPantry, {});
  const ownedCards = useSoupState(getCabinetCards, []);
  const weekDone = ownedCards.includes(week.themeSlug);

  // ── 旁白音檔 ──
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  const [audioT, setAudioT] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const [audioEnded, setAudioEnded] = useState(false);
  const lastSaveRef = useRef(0);
  const barDraggingRef = useRef(false);

  const pauseAudio = () => {
    try {
      audioRef.current?.pause();
    } catch {
      /* noop */
    }
  };

  useEffect(() => {
    const a = audioRef.current;
    return () => {
      // 離開頁面時存播放位置
      if (a && a.currentTime > 0) saveAudioPos(week.themeSlug, a.currentTime);
    };
  }, [week.themeSlug]);

  const onLoadedMetadata = () => {
    const a = audioRef.current;
    if (!a) return;
    setAudioDur(a.duration || 0);
    // 恢復上次播放位置
    const pos = getAudioPos(week.themeSlug);
    if (pos > 0 && a.duration > 0 && pos < a.duration - 1) {
      try {
        a.currentTime = pos;
        setAudioT(pos);
      } catch {
        /* noop */
      }
    }
  };

  const onTimeUpdate = () => {
    const a = audioRef.current;
    if (!a) return;
    setAudioT(a.currentTime);
    // 節流寫入播放位置（約 2 秒一次）
    const now = Date.now();
    if (now - lastSaveRef.current > 2000) {
      lastSaveRef.current = now;
      saveAudioPos(week.themeSlug, a.currentTime);
    }
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (audioEnded) {
      a.currentTime = 0;
      setAudioEnded(false);
      void a.play();
      return;
    }
    if (a.paused) void a.play();
    else a.pause();
  };

  const toggleMute = () => {
    const a = audioRef.current;
    const next = !audioMuted;
    setAudioMuted(next);
    if (a) a.muted = next;
  };

  const seekToClientX = (clientX: number, el: HTMLElement) => {
    const a = audioRef.current;
    if (!a || !(a.duration > 0)) return;
    const r = el.getBoundingClientRect();
    const frac = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const t = frac * a.duration;
    try {
      a.currentTime = t;
    } catch {
      /* noop */
    }
    setAudioT(t);
    setAudioEnded(false);
    saveAudioPos(week.themeSlug, t);
  };

  // ── 採集 ──
  const collectedCount = week.ingredients.filter((i) => pantry[i.slug]).length;
  const allCollected = collectedCount >= week.ingredients.length;

  // ── 煮湯 ──
  const [added, setAdded] = useState<Record<string, boolean>>({});
  const [stirPct, setStirPct] = useState(0);
  const [cooked, setCooked] = useState(false);
  const stirRafRef = useRef<number | null>(null);

  const addedCount = week.ingredients.filter((i) => added[i.slug]).length;
  const allAdded = addedCount >= week.ingredients.length;

  const stirDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!allAdded || cooked) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    const t0 = performance.now();
    const tick = (now: number) => {
      const pct = Math.min(100, ((now - t0) / STIR_MS) * 100);
      setStirPct(pct);
      if (pct >= 100) {
        stirRafRef.current = null;
        setCooked(true);
        return;
      }
      stirRafRef.current = requestAnimationFrame(tick);
    };
    stirRafRef.current = requestAnimationFrame(tick);
  };

  const stirUp = () => {
    if (stirRafRef.current != null) {
      cancelAnimationFrame(stirRafRef.current);
      stirRafRef.current = null;
      setStirPct(0); // 提早放開歸零
    }
  };

  useEffect(() => {
    return () => {
      if (stirRafRef.current != null) cancelAnimationFrame(stirRafRef.current);
    };
  }, []);

  const finish = () => {
    // 只在第一次完成時呼叫（湯譜石 +1、卡片入冊）
    if (!getCabinetCards().includes(week.themeSlug)) {
      finishWeekSoup(week.themeSlug);
    }
    setScene("done");
  };

  // ── 場景切換 ──
  const enterStory = () => {
    setStoryPage(0);
    setScene("story");
  };
  const gotoGather = () => {
    pauseAudio();
    setScene("gather");
  };
  const gotoCook = () => {
    setAdded({});
    setStirPct(0);
    setCooked(false);
    setScene("cook");
  };
  const goBack = () => {
    if (scene === "story") {
      pauseAudio();
      setScene("gate");
    } else if (scene === "gather") setScene("story");
    else if (scene === "cook") setScene("gather");
  };

  // ── 湯色（依放進鍋的材料數變濃）──
  const soupColors = ["#d8c79a", "#e8c069", "#e6a94e", "#e59a3c"];
  const soupBase = soupColors[Math.min(addedCount, 3)];
  const soupStyle = `radial-gradient(circle at 40% 34%, ${cooked ? "#f2c56a" : "#f0d089"} 0%, ${soupBase} 70%)`;
  const soupBubbles =
    addedCount > 0
      ? [
          { left: "30%", size: 10, dur: "2.4s", delay: "0s" },
          { left: "54%", size: 8, dur: "2.9s", delay: ".6s" },
          { left: "68%", size: 12, dur: "2.2s", delay: "1.1s" },
          { left: "44%", size: 7, dur: "3.1s", delay: ".3s" },
        ]
      : [];
  const soupFlowers = cooked
    ? [
        { left: "26%", top: "30%", dur: "2.6s" },
        { left: "60%", top: "44%", dur: "3.1s" },
        { left: "46%", top: "58%", dur: "2.9s" },
      ]
    : [];

  const cookTitle = allAdded ? (cooked ? "香香的，湯好了！" : "攪一攪，讓香氣出來") : "把材料放進鍋裡";
  const cookHint = allAdded
    ? cooked
      ? "菲娜把湯分給大家一起喝"
      : "按住下面的按鈕，慢慢攪一攪"
    : `已經放進 ${addedCount} / ${week.ingredients.length} 樣`;

  const findCountOf = (slug: string) => pantry[slug]?.finds?.length ?? (pantry[slug] ? 1 : 0);
  const hasRealFind = (ing: WeekIngredient) => !!pantry[ing.slug]?.finds?.some((f) => f.photoId);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        background: "var(--shh-bg)",
        color: "var(--shh-body)",
        lineHeight: 1.6,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
    >
      <style>{LOCAL_KEYFRAMES}</style>

      {/* 旁白音檔（常駐，控制列只在 story 顯示） */}
      {week.audioSrc ? (
        <audio
          ref={audioRef}
          src={week.audioSrc}
          preload="metadata"
          onLoadedMetadata={onLoadedMetadata}
          onTimeUpdate={onTimeUpdate}
          onPlay={() => setAudioPlaying(true)}
          onPause={() => {
            setAudioPlaying(false);
            const a = audioRef.current;
            if (a) saveAudioPos(week.themeSlug, a.currentTime);
          }}
          onEnded={() => {
            setAudioPlaying(false);
            setAudioEnded(true);
            saveAudioPos(week.themeSlug, 0);
          }}
        />
      ) : null}

      {/* ============ TOP BAR ============ */}
      <div
        style={{
          position: "absolute", top: 0, left: 0, right: 0, zIndex: 40,
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "14px 16px", pointerEvents: "none",
        }}
      >
        {scene === "gate" || scene === "done" ? (
          <Link
            href="/"
            style={{
              ...serifTC,
              pointerEvents: "auto", flexShrink: 0, display: "inline-flex", alignItems: "center",
              gap: 6, height: 34, padding: "0 14px 0 11px", borderRadius: 999,
              background: "rgba(247,240,224,.82)", backdropFilter: "blur(6px)",
              boxShadow: "0 4px 14px -6px rgba(90,60,30,.4)",
              fontWeight: 600, color: "#6b5a44", fontSize: 13, textDecoration: "none",
            }}
          >
            ← 回湯湯屋
          </Link>
        ) : (
          <button
            onClick={goBack}
            style={{
              pointerEvents: "auto", flexShrink: 0, width: 34, height: 34, marginRight: 8,
              border: "none", cursor: "pointer", borderRadius: 999,
              background: "rgba(247,240,224,.82)", backdropFilter: "blur(6px)",
              boxShadow: "0 4px 14px -6px rgba(90,60,30,.4)",
              fontFamily: "inherit", color: "#6b5a44", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center", padding: 0,
            }}
          >
            ←
          </button>
        )}
        <div style={{ flex: 1 }} />
      </div>

      {/* ============ SCENE: GATE ============ */}
      {scene === "gate" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, animation: "sfwPageIn .7s ease-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/handoff/forest-entrance.png"
            alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%" }}
          />
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(180deg,rgba(40,60,35,.30) 0%,rgba(40,55,30,0) 34%,rgba(60,45,20,.15) 62%,rgba(244,234,210,.94) 100%)",
            }}
          />
          <div style={{ position: "absolute", top: 96, left: 52, width: 6, height: 6, borderRadius: 999, background: "#ffe9a3", boxShadow: "0 0 8px 3px rgba(255,225,140,.8)", animation: "sfwFly 4.5s ease-in-out infinite" }} />
          <div style={{ position: "absolute", top: 150, right: 60, width: 5, height: 5, borderRadius: 999, background: "#ffe9a3", boxShadow: "0 0 8px 3px rgba(255,225,140,.8)", animation: "sfwFly 5.5s ease-in-out .8s infinite" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 20, padding: "0 26px 40px", textAlign: "center" }}>
            <p style={{ fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif", fontSize: 12, letterSpacing: ".42em", color: "#7a6a4a", margin: "0 0 10px", fontWeight: 500 }}>
              FOREST SOUP HOUSE
            </p>
            <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 42, lineHeight: 1.15, margin: 0, color: "#3a2f22", textShadow: "0 2px 14px rgba(255,240,200,.6)" }}>
              {week.soupName}
            </h1>

            {/* 菲娜的信 */}
            <div
              style={{
                marginTop: 18, textAlign: "left", background: "rgba(255,251,240,.94)",
                border: "1.5px solid #e3cf9e", borderRadius: "6px 18px 18px 18px",
                padding: "18px 18px 14px", boxShadow: "0 12px 30px -12px rgba(90,60,30,.45)", position: "relative",
              }}
            >
              <span
                style={{
                  position: "absolute", top: -11, left: 16, background: "#f0dfb4",
                  border: "1.5px solid #d8bc7e", borderRadius: 999, padding: "2px 12px",
                  fontSize: 10.5, fontWeight: 700, letterSpacing: ".14em", color: "#8a6a2f",
                }}
              >
                門縫下塞著一封信
              </span>
              <p style={{ ...serifTC, fontSize: 15, lineHeight: 1.95, color: "#4a3d2e", margin: "6px 0 0", whiteSpace: "pre-line" }}>
                {week.letter}
              </p>
              <p style={{ ...serifTC, fontSize: 13, color: "#8a7659", margin: "10px 0 0", textAlign: "right" }}>
                —— 小狐狸 菲娜
              </p>
            </div>

            {weekDone ? (
              <>
                <button
                  onClick={() => setScene("done")}
                  style={{
                    ...serifTC,
                    marginTop: 18, width: "100%", border: "none", cursor: "pointer",
                    fontWeight: 600, fontSize: 17, color: "#faf4e6", background: "#c47a3a",
                    padding: 16, borderRadius: 18, boxShadow: "0 12px 30px -8px rgba(196,122,58,.5)",
                  }}
                >
                  這週的湯已經煮好了 · 直接看成果　→
                </button>
                <button
                  onClick={enterStory}
                  style={{
                    ...serifTC,
                    marginTop: 12, width: "100%", border: "1.5px solid rgba(140,110,70,.35)", cursor: "pointer",
                    background: "rgba(255,251,240,.72)", fontWeight: 600, fontSize: 14,
                    color: "#6b5a44", padding: 13, borderRadius: 16,
                  }}
                >
                  想再聽一次故事　→
                </button>
              </>
            ) : (
              <button
                onClick={enterStory}
                style={{
                  ...serifTC,
                  marginTop: 18, width: "100%", border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: 18, color: "#faf4e6", background: "#3f7a4a",
                  padding: 17, borderRadius: 20, boxShadow: "0 12px 30px -8px rgba(45,90,65,.55)",
                  animation: "sfwPulse 3.4s ease-in-out infinite",
                }}
              >
                推開木門，去找菲娜　→
              </button>
            )}
            <button
              onClick={openCabinet}
              style={{
                ...serifTC,
                marginTop: 12, marginBottom: 8, width: "100%", border: "1.5px solid rgba(140,110,70,.35)",
                cursor: "pointer", background: "rgba(255,251,240,.72)", fontWeight: 600, fontSize: 14,
                color: "#6b5a44", padding: 13, borderRadius: 16,
              }}
            >
              翻開上次的湯譜紀念冊（{ownedCards.length} 張卡）
            </button>
          </div>
        </div>
      ) : null}

      {/* ============ SCENE: STORY ============ */}
      {scene === "story" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 10 }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 454, overflow: "hidden" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={week.image ?? "/images/handoff/fina-cooking.png"}
              alt=""
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(60,45,20,.25) 0%,transparent 40%,rgba(244,234,210,.15) 82%,#f4ead2 100%)" }} />
            <div style={{ position: "absolute", left: "44%", top: 120, width: 16, height: 60, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 4.5s ease-in infinite" }} />
            <div style={{ position: "absolute", left: "56%", top: 110, width: 16, height: 70, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 5.2s ease-in .9s infinite" }} />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 20, padding: "0 26px 34px", animation: "sfwPageIn .6s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{ fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif", fontSize: 11, letterSpacing: ".24em", color: "#a9793f", fontWeight: 700 }}>
                今日故事
              </span>
              <span style={{ flex: 1, height: 1, background: "rgba(169,121,63,.3)" }} />
              <span style={{ fontSize: 11, color: "#a08a68", fontWeight: 500 }}>
                {storyPage + 1} / {week.paragraphs.length}
              </span>
            </div>
            <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 25, margin: "0 0 4px", color: "#3a2f22" }}>{week.soupName}</h2>
            <p style={{ fontSize: 12.5, color: "#8a7659", margin: "0 0 16px", fontStyle: "italic" }}>
              {week.magicSubtitleZh ?? week.tagline}
            </p>
            <p
              key={`p${storyPage}`}
              style={{ ...serifTC, fontSize: 16.5, lineHeight: 1.95, color: "#4a3d2e", margin: 0, minHeight: 118, animation: "jbFade .8s ease-out" }}
            >
              {week.paragraphs[storyPage]}
            </p>

            {/* 旁白音檔列 */}
            {week.audioSrc ? (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 14 }}>
                <button
                  onClick={togglePlay}
                  style={{
                    flexShrink: 0, width: 40, height: 40, borderRadius: "50%", border: "1.5px solid #d8bc7e",
                    cursor: "pointer", background: "#fff9ec", boxShadow: "0 6px 16px -8px rgba(120,80,30,.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, color: "#a9622a", padding: 0,
                  }}
                >
                  {audioEnded ? "↺" : audioPlaying ? "❚❚" : "▶"}
                </button>
                <button
                  onClick={toggleMute}
                  style={{
                    position: "relative", flexShrink: 0, width: 40, height: 40, borderRadius: "50%",
                    border: "1.5px solid #e0cfa8", cursor: "pointer", background: "#fff9ec",
                    boxShadow: "0 6px 16px -8px rgba(120,80,30,.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, color: audioMuted ? "#b3a186" : "#a9622a", padding: 0,
                  }}
                >
                  ♪
                  {audioMuted ? (
                    <span style={{ position: "absolute", width: 20, height: 2, background: "#a08a68", transform: "rotate(-45deg)", borderRadius: 2 }} />
                  ) : null}
                </button>
                <div
                  onPointerDown={(e) => {
                    barDraggingRef.current = true;
                    try {
                      e.currentTarget.setPointerCapture(e.pointerId);
                    } catch {
                      /* noop */
                    }
                    seekToClientX(e.clientX, e.currentTarget);
                  }}
                  onPointerMove={(e) => {
                    if (barDraggingRef.current) seekToClientX(e.clientX, e.currentTarget);
                  }}
                  onPointerUp={() => {
                    barDraggingRef.current = false;
                  }}
                  onPointerLeave={() => {
                    barDraggingRef.current = false;
                  }}
                  style={{ flex: 1, padding: "8px 0", cursor: "pointer", touchAction: "none" }}
                >
                  <div style={{ position: "relative", height: 6, borderRadius: 999, background: "rgba(160,130,90,.25)" }}>
                    <div
                      style={{
                        height: "100%",
                        width: `${audioDur > 0 ? Math.min(100, (audioT / audioDur) * 100) : 0}%`,
                        background: "linear-gradient(90deg,#e0b25a,#c47a3a)", borderRadius: 999,
                      }}
                    />
                    <span
                      style={{
                        position: "absolute", top: "50%",
                        left: `${audioDur > 0 ? Math.min(100, (audioT / audioDur) * 100) : 0}%`,
                        transform: "translate(-50%,-50%)", width: 14, height: 14, borderRadius: "50%",
                        background: "#fff", border: "2px solid #c47a3a", boxShadow: "0 2px 6px -1px rgba(120,60,10,.5)",
                      }}
                    />
                  </div>
                </div>
                <span style={{ fontSize: 11, color: "#a08a68", flexShrink: 0 }}>
                  {audioEnded ? "聽完了 ★" : audioPlaying ? "播放中" : "暫停"}
                </span>
              </div>
            ) : null}

            {/* 分頁：上一頁 / 下一頁；最後一頁 → 去採材料 */}
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => setStoryPage((p) => Math.max(0, p - 1))}
                disabled={storyPage === 0}
                style={{
                  ...serifTC,
                  flex: 1, border: "1.5px solid rgba(140,110,70,.35)", cursor: storyPage === 0 ? "default" : "pointer",
                  background: "rgba(255,251,240,.72)", fontWeight: 600, fontSize: 15,
                  color: storyPage === 0 ? "#c0b498" : "#6b5a44", padding: 13, borderRadius: 16,
                  opacity: storyPage === 0 ? 0.6 : 1,
                }}
              >
                ← 上一頁
              </button>
              {storyPage < week.paragraphs.length - 1 ? (
                <button
                  onClick={() => setStoryPage((p) => Math.min(week.paragraphs.length - 1, p + 1))}
                  style={{
                    ...serifTC,
                    flex: 1, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 15,
                    color: "#faf4e6", background: "#3f7a4a", padding: 13, borderRadius: 16,
                    boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)",
                  }}
                >
                  下一頁 →
                </button>
              ) : (
                <button
                  onClick={gotoGather}
                  style={{
                    ...serifTC,
                    flex: 1, border: "none", cursor: "pointer", fontWeight: 600, fontSize: 16,
                    color: "#faf4e6", background: "#3f7a4a", padding: 13, borderRadius: 16,
                    boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)", animation: "jbPop .5s ease-out",
                  }}
                >
                  去採材料　→
                </button>
              )}
            </div>
            {storyPage < week.paragraphs.length - 1 ? (
              <button
                onClick={gotoGather}
                style={{
                  display: "block", margin: "12px auto 0", border: "none", cursor: "pointer",
                  padding: "8px 16px", borderRadius: 999, background: "transparent",
                  fontFamily: "inherit", fontSize: 12.5, color: "#a08a68",
                  textDecoration: "underline", textDecorationColor: "rgba(160,138,104,.4)", textUnderlineOffset: 3,
                }}
              >
                跳過故事，直接去採材料 →
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ============ SCENE: GATHER ============ */}
      {scene === "gather" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "linear-gradient(180deg,#eef2df 0%,#f4ead2 46%)" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 150, overflow: "hidden", opacity: 0.5 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/handoff/herbal-patch.png"
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 40%" }}
            />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,#f0efdd 100%)" }} />
          </div>
          <div style={{ position: "absolute", top: 22, left: 64, width: 5, height: 5, borderRadius: 999, background: "#fff0bf", boxShadow: "0 0 6px 2px rgba(255,225,140,.6)", animation: "sfwMote 7s linear infinite" }} />
          <div style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "96px 24px 40px" }}>
            <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 24, margin: 0, color: "#3a2f22", textAlign: "center" }}>採三樣材料</h2>
            <p style={{ textAlign: "center", fontSize: 13, color: "#7f6c52", margin: "8px 0 22px" }}>
              每一樣都可以用螢幕採，或是去真的世界找
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {week.ingredients.map((ing) => {
                const got = !!pantry[ing.slug];
                const count = findCountOf(ing.slug);
                return (
                  <div
                    key={ing.slug}
                    style={{
                      border: `1.5px solid ${got ? "#bcd6ba" : "#ecdcb8"}`,
                      background: got ? "#eef5ec" : "#fbf5e6",
                      padding: 14, borderRadius: 20,
                      boxShadow: "0 6px 18px -10px rgba(90,60,30,.4)",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 14, textAlign: "left" }}>
                      <span
                        style={{
                          ...serifTC,
                          position: "relative", flexShrink: 0, width: 62, height: 62, borderRadius: 16,
                          background: ing.gradient, display: "flex", alignItems: "center", justifyContent: "center",
                          overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.4)",
                          fontWeight: 700, fontSize: 22, color: "#fff", textShadow: "0 1px 6px rgba(60,40,20,.4)",
                        }}
                      >
                        {ing.glyph}
                        {got ? (
                          <span
                            style={{
                              position: "absolute", inset: 0, background: "rgba(63,122,74,.86)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 26, animation: "jbPop .4s ease-out",
                            }}
                          >
                            ✓
                          </span>
                        ) : null}
                      </span>
                      <span style={{ flex: 1, minWidth: 0 }}>
                        <span style={{ ...serifTC, display: "block", fontWeight: 600, fontSize: 17, color: "#3a2f22" }}>
                          {ing.name}
                        </span>
                        <span style={{ display: "block", fontSize: 12, color: "#8a7659", marginTop: 3 }}>{ing.scent}</span>
                        <span style={{ display: "block", fontSize: 12, color: got ? "#3f7a4a" : "#8a7659", marginTop: 3, fontWeight: got ? 700 : 400 }}>
                          在{ing.locationName}　·　{got ? `採到了 ✓×${count}` : "還沒採到"}
                        </span>
                      </span>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button
                        onClick={() => addFind(ing.slug)}
                        style={{
                          flex: 1, border: "1.5px solid #e0cfa8", cursor: "pointer",
                          background: "#fff9ec", fontFamily: "inherit", fontWeight: 700, fontSize: 12.5,
                          color: "#6b5a44", padding: "10px 8px", borderRadius: 12,
                        }}
                      >
                        用眼睛採（螢幕採）
                      </button>
                      <PhotoCapture
                        onSaved={(photoId) => addFind(ing.slug, { photoId })}
                        style={{
                          flex: 1, border: "none", cursor: "pointer",
                          background: "#3f7a4a", fontFamily: "inherit", fontWeight: 700, fontSize: 12.5,
                          color: "#faf4e6", padding: "10px 8px", borderRadius: 12,
                          boxShadow: "0 8px 18px -8px rgba(45,90,65,.5)",
                        }}
                      >
                        真實世界拍照採
                      </PhotoCapture>
                    </div>
                  </div>
                );
              })}
            </div>
            {allCollected ? (
              <button
                onClick={gotoCook}
                style={{
                  ...serifTC,
                  marginTop: 24, width: "100%", border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: 17, color: "#faf4e6", background: "#c47a3a",
                  padding: 16, borderRadius: 18, boxShadow: "0 12px 28px -8px rgba(196,122,58,.5)",
                  animation: "sfwPageIn .5s ease-out",
                }}
              >
                材料都齊了，回湯湯屋煮湯　→
              </button>
            ) : (
              <p style={{ textAlign: "center", fontSize: 12.5, color: "#a08a68", margin: "22px 0 0" }}>
                還差 {week.ingredients.length - collectedCount} 樣（也可以先用螢幕採）
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* ============ SCENE: COOK ============ */}
      {scene === "cook" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "radial-gradient(120% 80% at 50% 30%,#f6ecd4 0%,#ecdcb8 100%)" }}>
          <div style={{ position: "absolute", inset: 0, overflowY: "auto", padding: "92px 24px 32px", textAlign: "center" }}>
            <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 23, margin: 0, color: "#3a2f22" }}>{cookTitle}</h2>
            <p style={{ fontSize: 13, color: "#7f6c52", margin: "8px 0 0" }}>{cookHint}</p>
            <div style={{ position: "relative", width: 236, height: 236, margin: "22px auto 0" }}>
              <div
                style={{
                  position: "absolute", left: "50%", top: "52%", transform: "translate(-50%,-50%)",
                  width: 210, height: 210, borderRadius: "50%", background: "#3a2c22",
                  boxShadow: "0 20px 40px -12px rgba(60,40,20,.6),inset 0 -10px 24px rgba(0,0,0,.5)",
                }}
              />
              <div
                style={{
                  position: "absolute", left: "50%", top: "52%", transform: "translate(-50%,-50%)",
                  width: 176, height: 176, borderRadius: "50%", background: soupStyle,
                  boxShadow: "inset 0 6px 20px rgba(255,255,255,.35),inset 0 -14px 28px rgba(120,70,20,.4)",
                  overflow: "hidden", transition: "background .6s",
                }}
              >
                {soupBubbles.map((b, i) => (
                  <span
                    key={i}
                    style={{
                      position: "absolute", left: b.left, bottom: 14, width: b.size, height: b.size,
                      borderRadius: "50%", background: "rgba(255,246,214,.85)",
                      animation: `sfwBubble ${b.dur} ease-in ${b.delay} infinite`,
                    }}
                  />
                ))}
                {soupFlowers.map((f, i) => (
                  <span
                    key={i}
                    style={{ position: "absolute", left: f.left, top: f.top, fontSize: 16, animation: `sfwDrift ${f.dur} ease-in-out infinite` }}
                  >
                    ✿
                  </span>
                ))}
              </div>
              {cooked ? (
                <>
                  <div style={{ position: "absolute", left: "40%", top: 6, width: 14, height: 56, background: "radial-gradient(circle,rgba(255,246,214,.9),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 4s ease-in infinite" }} />
                  <div style={{ position: "absolute", left: "56%", top: 0, width: 14, height: 64, background: "radial-gradient(circle,rgba(255,246,214,.9),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 4.6s ease-in .7s infinite" }} />
                </>
              ) : null}
            </div>

            {/* 按住攪湯（dc 沒有此細節，依同風格補：按住 1.5 秒進度條攪滿） */}
            {allAdded && !cooked ? (
              <div style={{ margin: "20px auto 0", maxWidth: 260, animation: "sfwPageIn .4s" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#8a7659", marginBottom: 6 }}>
                  <span>按住不放，把香氣攪出來</span>
                  <span style={{ fontWeight: 700, color: "#c47a3a" }}>香氣 {Math.round(stirPct)}%</span>
                </div>
                <div style={{ height: 10, borderRadius: 999, background: "rgba(160,130,90,.25)", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stirPct}%`, background: "linear-gradient(90deg,#e0b25a,#c47a3a)", borderRadius: 999, transition: "width .1s" }} />
                </div>
                <button
                  onPointerDown={stirDown}
                  onPointerUp={stirUp}
                  onPointerLeave={stirUp}
                  onPointerCancel={stirUp}
                  style={{
                    ...serifTC,
                    marginTop: 14, width: "100%", border: "none", cursor: "grab",
                    fontWeight: 600, fontSize: 17, color: "#faf4e6", background: "#3f7a4a",
                    padding: 16, borderRadius: 18, boxShadow: "0 12px 28px -8px rgba(45,90,65,.5)",
                    touchAction: "none",
                    animation: stirPct > 0 ? "none" : "sfwPulse 3.4s ease-in-out infinite",
                    transform: stirPct > 0 ? "scale(.97)" : undefined,
                  }}
                >
                  按住攪湯
                </button>
              </div>
            ) : null}

            {/* 籃子 */}
            {!allAdded ? (
              <div style={{ marginTop: 24 }}>
                <p style={{ fontSize: 12, color: "#8a7659", margin: "0 0 10px" }}>籃子裡的材料 — 一樣一樣放進鍋裡</p>
                <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
                  {week.ingredients.map((ing) => {
                    const isAdded = !!added[ing.slug];
                    const photoId = latestPhotoId(ing.slug);
                    return (
                      <button
                        key={ing.slug}
                        onClick={isAdded ? undefined : () => setAdded((a) => ({ ...a, [ing.slug]: true }))}
                        style={{
                          display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                          border: `1.5px solid ${isAdded ? "#d8cdb0" : "#e0b27a"}`,
                          cursor: isAdded ? "default" : "pointer",
                          background: isAdded ? "#f0ead9" : "#fff6e6",
                          padding: "10px 8px", borderRadius: 16, fontFamily: "inherit", width: 88,
                          opacity: isAdded ? 0.4 : 1, transition: "all .2s",
                        }}
                      >
                        <PhotoImg
                          photoId={photoId}
                          alt={ing.name}
                          style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover", display: "block" }}
                          fallback={
                            <span
                              style={{
                                ...serifTC,
                                width: 44, height: 44, borderRadius: 12, background: ing.gradient,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontWeight: 700, fontSize: 16, color: "#fff", textShadow: "0 1px 4px rgba(60,40,20,.4)",
                              }}
                            >
                              {ing.glyph}
                            </span>
                          }
                        />
                        <span style={{ fontSize: 11, color: "#5b4a35", fontWeight: 500 }}>
                          {ing.name.length > 5 ? ing.name.slice(0, 5) : ing.name}
                        </span>
                        {hasRealFind(ing) ? (
                          <span style={{ fontSize: 9, color: "#3f7a4a", fontWeight: 700, background: "#e9f2e6", borderRadius: 999, padding: "1px 7px" }}>
                            真的找到的
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {cooked ? (
              <button
                onClick={finish}
                style={{
                  ...serifTC,
                  marginTop: 26, width: "100%", maxWidth: 300, border: "none", cursor: "pointer",
                  fontWeight: 600, fontSize: 18, color: "#faf4e6", background: "#3f7a4a",
                  padding: 16, borderRadius: 18, boxShadow: "0 12px 28px -8px rgba(45,90,65,.5)",
                  animation: "jbPop .5s ease-out",
                }}
              >
                湯好了　→
              </button>
            ) : null}
          </div>
        </div>
      ) : null}

      {/* ============ SCENE: DONE ============ */}
      {scene === "done" ? (
        <div style={{ position: "absolute", inset: 0, zIndex: 10, background: "radial-gradient(120% 70% at 50% 22%,#fbf3dd 0%,#efe0bd 100%)", overflowY: "auto" }}>
          <div style={{ padding: "92px 24px 40px", textAlign: "center" }}>
            <span style={{ animation: "sfwFloatUp 3s ease-in-out infinite", position: "absolute", left: "38%", top: 80, fontSize: 14, color: "#c99" }}>✿</span>
            <p style={{ fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif", fontSize: 11, letterSpacing: ".24em", color: "#a9793f", fontWeight: 700 }}>
              湯 · 煮 · 好 · 了
            </p>
            <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 27, margin: "10px 0 0", color: "#3a2f22" }}>{week.soupName}</h2>
            <div style={{ position: "relative", width: 150, height: 150, margin: "20px auto 0" }}>
              <div style={{ position: "absolute", left: 38, top: 2, width: 12, height: 44, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 4s ease-in infinite" }} />
              <div style={{ position: "absolute", left: 88, top: 0, width: 12, height: 50, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "sfwSteam 4.5s ease-in .6s infinite" }} />
              <div
                style={{
                  position: "absolute", left: "50%", top: "56%", transform: "translate(-50%,-50%)",
                  width: 130, height: 130, borderRadius: "50%", overflow: "hidden",
                  background: "#fdf6e8", boxShadow: "0 14px 30px -8px rgba(200,130,50,.6)",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={week.image ?? "/images/handoff/soup-pot.png"}
                  alt={`一碗${week.soupName}`}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 42%", transform: "scale(1.12)" }}
                />
              </div>
            </div>

            {/* 徽章 */}
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 18,
                padding: "8px 18px", borderRadius: 999, background: "#3f7a4a",
                boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)", animation: "jbPop .6s ease-out",
              }}
            >
              <span style={{ fontSize: 14 }}>🏅</span>
              <span style={{ ...serifTC, fontWeight: 700, fontSize: 15, color: "#faf4e6" }}>
                「{week.badgeName}」徽章 get！
              </span>
            </div>
            <br />
            <button
              onClick={openCabinet}
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, marginTop: 12,
                padding: "8px 16px", borderRadius: 999, background: "#fff6e2",
                border: "1.5px solid #e3b877", boxShadow: "0 6px 16px -8px rgba(180,120,50,.5)",
                cursor: "pointer", fontFamily: "inherit",
              }}
            >
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "#e3b877", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#fff" }}>
                ★
              </span>
              <span style={{ ...serifTC, fontWeight: 600, fontSize: 14, color: "#8a5a20" }}>
                湯譜卡已收進紀念冊 · 打開看看
              </span>
            </button>

            {/* PRINT CARD */}
            <Link
              href="/print"
              style={{
                display: "block", textDecoration: "none", textAlign: "left", marginTop: 26,
                background: "#fff", border: "1.5px solid #d8b98a", borderRadius: 18,
                padding: 18, boxShadow: "0 8px 22px -12px rgba(140,90,40,.5)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                <span
                  style={{
                    flexShrink: 0, width: 52, height: 64, borderRadius: 6, background: "#fdf6e4",
                    border: "1.5px dashed #c9a86a", display: "flex", flexDirection: "column",
                    alignItems: "center", justifyContent: "center", gap: 4,
                  }}
                >
                  <span style={{ width: 30, height: 22, borderRadius: 4, background: "#f0c27a", display: "block" }} />
                  <span style={{ width: 30, height: 3, borderRadius: 2, background: "#e0cfa8", display: "block" }} />
                  <span style={{ width: 20, height: 3, borderRadius: 2, background: "#e0cfa8", display: "block" }} />
                </span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif", fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, marginBottom: 4 }}>
                    列印 · 今天的手作紙
                  </span>
                  <span style={{ ...serifTC, display: "block", fontWeight: 600, fontSize: 16, color: "#3a2f22" }}>
                    湯譜卡＋香味收藏夾
                  </span>
                  <span style={{ display: "block", fontSize: 12.5, color: "#8a7659", marginTop: 3 }}>
                    印出來剪一剪、貼上真的花瓣葉子，做成自己的紀念冊
                  </span>
                </span>
                <span style={{ fontSize: 18, color: "#b89a6a" }}>→</span>
              </div>
            </Link>

            <div style={{ textAlign: "left", marginTop: 14, display: "flex", flexDirection: "column", gap: 14 }}>
              <div style={{ background: "#eef3e2", border: "1px solid #d5e0c0", borderRadius: 18, padding: 18 }}>
                <p style={{ fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif", fontSize: 11, letterSpacing: ".14em", color: "#5b7a3f", fontWeight: 700, margin: "0 0 6px" }}>
                  帶回家做 · 今天的小冒險
                </p>
                <p style={{ ...serifTC, fontWeight: 600, fontSize: 16, color: "#3a2f22", margin: "0 0 6px" }}>{week.adventureTitle}</p>
                <p style={{ fontSize: 13.5, color: "#4a5638", margin: 0, lineHeight: 1.8 }}>{week.adventureDescription}</p>
              </div>
              <div style={{ background: "#fff", border: "1px dashed #d8b98a", borderRadius: 18, padding: 18, textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#a9793f", fontWeight: 700, margin: "0 0 8px" }}>菲娜想問你</p>
                <p style={{ ...serifTC, fontSize: 15, color: "#4a3d2e", margin: 0, lineHeight: 1.8 }}>{week.parentTalkingPoint}</p>
                <p style={{ fontSize: 11.5, color: "#a08a68", margin: "10px 0 0" }}>跟身邊的人說說你的答案</p>
              </div>
            </div>

            <Link
              href="/"
              style={{
                ...serifTC,
                display: "block", marginTop: 24, textDecoration: "none", border: "none",
                background: "#3f7a4a", fontWeight: 600, fontSize: 15, color: "#faf4e6",
                padding: 14, borderRadius: 16, boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)",
              }}
            >
              回湯湯屋　→
            </Link>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 18 }}>
              <Link href="/map" style={{ fontSize: 12.5, fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>
                看森林多亮了一角 →
              </Link>
              <Link href="/friends" style={{ fontSize: 12.5, fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>
                看看朋友們 →
              </Link>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
