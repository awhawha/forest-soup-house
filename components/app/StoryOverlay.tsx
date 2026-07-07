"use client";

/**
 * 聽故事（全螢幕繪本）— 規格 §2。
 * 上半 454px 菲娜煮湯插圖＋蒸氣；下半故事文字＋播放條。
 * 內容資料驅動：文字用該週 paragraphs、旁白用該週 audioSrc；
 * 沒有音檔時仍可點畫面手動翻頁，有音檔時旁白主導頁碼。
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { serifTC } from "@/components/app/PhoneFrame";

const GREEN = "#3f7a4a";
const HERO = "/images/handoff/fina-cooking.png";

interface StoryOverlayProps {
  soupName: string;
  subtitle: string | null;
  paragraphs: string[];
  audioSrc: string | null;
  /** 第一次聽完（旁白播完或手動翻到最後一頁）時呼叫一次，用來寫 storyDone */
  onComplete: () => void;
  onClose: () => void;
}

export function StoryOverlay({ soupName, subtitle, paragraphs, audioSrc, onComplete, onClose }: StoryOverlayProps) {
  const pages = paragraphs.length > 0 ? paragraphs : ["（這週的故事還在路上……）"];
  const total = pages.length;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const seeking = useRef(false);

  const [page, setPage] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [audioT, setAudioT] = useState(0);
  const [audioDur, setAudioDur] = useState(0);
  const [ended, setEnded] = useState(false);

  // onComplete 每次 render 都是新函式；用 ref 保存，避免進 effect deps 造成音檔重建
  const completeRef = useRef(onComplete);
  useEffect(() => {
    completeRef.current = onComplete;
  });
  const fireComplete = useCallback(() => completeRef.current(), []);

  // 懶載入音檔；掛在畫面關閉時暫停
  useEffect(() => {
    if (!audioSrc) return;
    const a = new Audio(audioSrc);
    audioRef.current = a;
    const onMeta = () => setAudioDur(a.duration || 0);
    const onTime = () => {
      const dur = a.duration || 0;
      setAudioT(a.currentTime);
      if (dur > 0) {
        // 把音檔均分成 total 段，旁白播到哪、文字翻到哪
        const seg = Math.min(total - 1, Math.floor((a.currentTime / dur) * total));
        setPage(seg);
      }
    };
    const onEnded = () => {
      setPlaying(false);
      setEnded(true);
      setPage(total - 1);
      fireComplete();
    };
    const onPause = () => setPlaying(false);
    const onPlay = () => setPlaying(true);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnded);
    a.addEventListener("pause", onPause);
    a.addEventListener("play", onPlay);
    return () => {
      a.pause();
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("play", onPlay);
    };
    // 僅在 audioSrc / total 改變時重建
  }, [audioSrc, total, fireComplete]);

  const close = () => {
    audioRef.current?.pause();
    onClose();
  };

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (ended) {
      a.currentTime = 0;
      setEnded(false);
      setPage(0);
      a.play();
      return;
    }
    if (a.paused) a.play();
    else a.pause();
  };

  const seekTo = (clientX: number) => {
    const a = audioRef.current;
    const el = barRef.current;
    if (!a || !el || !a.duration) return;
    const r = el.getBoundingClientRect();
    const pct = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    a.currentTime = pct * a.duration;
    setAudioT(a.currentTime);
  };
  const onBarDown = (e: React.PointerEvent) => {
    seeking.current = true;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    seekTo(e.clientX);
  };
  const onBarMove = (e: React.PointerEvent) => {
    if (seeking.current) seekTo(e.clientX);
  };
  const onBarUp = () => {
    seeking.current = false;
  };

  // 沒音檔（或還沒載）時：點畫面手動翻頁
  const tapStory = () => {
    if (page < total - 1) setPage((p) => p + 1);
    else {
      setEnded(true);
      fireComplete();
    }
  };

  const audioPct = audioDur > 0 ? (audioT / audioDur) * 100 : 0;
  const playIcon = ended ? "↺" : playing ? "❚❚" : "▶";
  const audioStatus = ended ? "聽完了 ★" : playing ? "播放中" : "暫停";

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 42, background: "#f4ead2", animation: "nvFade .25s ease-out" }}>
      {/* 上半：插圖 + 蒸氣 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 454, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={HERO} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(60,45,20,.25) 0%,transparent 40%,rgba(244,234,210,.15) 82%,#f4ead2 100%)" }} />
        <div style={{ position: "absolute", left: "44%", top: 120, width: 16, height: 60, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 4.5s ease-in infinite" }} />
        <div style={{ position: "absolute", left: "56%", top: 110, width: 16, height: 70, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 5.2s ease-in .9s infinite" }} />
      </div>

      {/* 下半：文字 + 播放條 */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "0 26px 34px" }}>
        <div onClick={tapStory} style={{ cursor: "pointer" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <span style={{ fontSize: 11, letterSpacing: ".24em", color: "#a9793f", fontWeight: 700 }}>今 日 故 事</span>
            <span style={{ flex: 1, height: 1, background: "rgba(169,121,63,.3)" }} />
            <span style={{ fontSize: 12, color: "#a08a68", fontWeight: 500 }}>{page + 1} / {total}</span>
          </div>
          <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 25, margin: "0 0 4px", color: "#3a2f22" }}>{soupName}</h2>
          {subtitle ? <p style={{ fontSize: 12.5, color: "#8a7659", margin: "0 0 16px", fontStyle: "italic" }}>{subtitle}</p> : <div style={{ height: 16 }} />}
          <p key={`sp${page}`} style={{ ...serifTC, fontSize: 17, lineHeight: 1.95, color: "#4a3d2e", margin: 0, minHeight: 120, animation: "nvIn .5s ease-out" }}>{pages[page]}</p>
        </div>

        {/* 播放條 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14 }}>
          <button onClick={togglePlay} aria-label="播放" disabled={!audioSrc} style={{ flexShrink: 0, width: 44, height: 44, borderRadius: "50%", border: "1.5px solid #d8bc7e", cursor: audioSrc ? "pointer" : "default", background: "#fff9ec", boxShadow: "0 6px 16px -8px rgba(120,80,30,.5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#a9622a", padding: 0, opacity: audioSrc ? 1 : 0.5 }}>{playIcon}</button>
          <div ref={barRef} onPointerDown={onBarDown} onPointerMove={onBarMove} onPointerUp={onBarUp} onPointerCancel={onBarUp} style={{ flex: 1, padding: "10px 0", cursor: "pointer", touchAction: "none", userSelect: "none" }}>
            <div style={{ position: "relative", height: 6, borderRadius: 999, background: "rgba(160,130,90,.25)" }}>
              <div style={{ height: "100%", width: `${audioPct}%`, background: "linear-gradient(90deg,#e0b25a,#c47a3a)", borderRadius: 999 }} />
              <span style={{ position: "absolute", top: "50%", left: `${audioPct}%`, transform: "translate(-50%,-50%)", width: 16, height: 16, borderRadius: "50%", background: "#fff", border: "2px solid #c47a3a", boxShadow: "0 2px 6px -1px rgba(120,60,10,.5)" }} />
            </div>
          </div>
          <span style={{ fontSize: 12, color: "#a08a68", flexShrink: 0 }}>{audioStatus}</span>
        </div>

        {ended ? (
          <button onClick={close} style={{ ...serifTC, marginTop: 14, width: "100%", border: "none", cursor: "pointer", fontWeight: 700, fontSize: 16, color: "#faf4e6", background: GREEN, padding: 16, borderRadius: 16, boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)", animation: "nvPop .5s ease-out" }}>聽完了 · 出門找材料 →</button>
        ) : (
          <button onClick={close} style={{ display: "block", margin: "14px auto 0", border: "none", cursor: "pointer", padding: "8px 16px", borderRadius: 999, background: "transparent", fontFamily: "inherit", fontSize: 13, color: "#a08a68", textDecoration: "underline", textUnderlineOffset: 3 }}>跳過故事，直接去採材料 →</button>
        )}
      </div>

      <button onClick={close} aria-label="關閉" style={{ position: "absolute", top: 18, right: 16, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(30,22,10,.32)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#faf4e6", padding: "0 0 2px", zIndex: 5 }}>✕</button>
    </div>
  );
}
