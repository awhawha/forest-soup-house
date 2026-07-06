"use client";

/**
 * 煮湯儀式（全螢幕覆蓋層，z=45）— 規格 §7。
 * 階段 A 放料（點 token 飛入鍋）→ 階段 B 攪拌手勢（stir 累積到 100）→ merged → 結算。
 * 儀式狀態只存記憶體；中途離開不保存。
 */
import { useEffect, useRef, useState } from "react";
import type { WeekIngredient } from "@/lib/weekly";
import { getPhotoUrl } from "@/lib/client/photoStore";
import { serifTC } from "@/components/app/PhoneFrame";

interface CookRitualProps {
  materials: WeekIngredient[];
  /** 每樣材料孩子拍的照片 id（用說的則為 null） */
  photoIds: (string | null)[];
  soupName: string;
  /** 攪拌完成、結算（寫 cookedAt + 開獎勵）*/
  onCooked: () => void;
  onClose: () => void;
}

const BROTH = ["#e8c98a", "#e2b972", "#d7a457", "#c98a3a"];
// 鍋緣三角分佈（240px 圓內，token 60px）
const RIM = [
  { left: "120px", top: "0px", c: "translate(0px,120px) scale(.14)" },
  { left: "224px", top: "180px", c: "translate(-104px,-60px) scale(.14)" },
  { left: "16px", top: "180px", c: "translate(104px,-60px) scale(.14)" },
];
// 湯面漂浮位（48px）
const RING = [
  { left: "96px", top: "16px", c: "translate(0px,80px) scale(.1)" },
  { left: "163px", top: "133px", c: "translate(-67px,-37px) scale(.1)" },
  { left: "29px", top: "133px", c: "translate(67px,-37px) scale(.1)" },
];

export function CookRitual({ materials, photoIds, soupName, onCooked, onClose }: CookRitualProps) {
  const [done, setDone] = useState<boolean[]>([false, false, false]);
  const [stir, setStir] = useState(0);
  const [angle, setAngle] = useState(0);
  const [stirring, setStirring] = useState(false);
  const [merged, setMerged] = useState(false);
  const [rippleN, setRippleN] = useState(0);
  const [urls, setUrls] = useState<(string | null)[]>([null, null, null]);
  const lastAngle = useRef(0);
  const firedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all(photoIds.map((id) => (id ? getPhotoUrl(id) : Promise.resolve(null)))).then((r) => {
      if (!cancelled) setUrls(r);
    });
    return () => {
      cancelled = true;
    };
  }, [photoIds]);

  const count = done.filter(Boolean).length;
  const all = count === 3;
  const stage = merged ? 3 : Math.min(2, count);

  const tap = (i: number) => {
    if (done[i]) return;
    setDone((d) => d.map((v, j) => (j === i ? true : v)));
    setRippleN((n) => n + 1);
  };

  const angleOf = (e: React.PointerEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    return (
      (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) /
      Math.PI
    );
  };

  const onDown = (e: React.PointerEvent) => {
    if (merged || !all) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    lastAngle.current = angleOf(e);
    setStirring(true);
  };

  const onMove = (e: React.PointerEvent) => {
    if (!stirring || merged) return;
    const a = angleOf(e);
    let delta = a - lastAngle.current;
    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;
    lastAngle.current = a;
    setAngle((prev) => prev + delta);
    setStir((prev) => {
      const v = Math.min(100, prev + Math.abs(delta) / 10);
      if (v >= 100 && !firedRef.current) {
        firedRef.current = true;
        setMerged(true);
        setStirring(false);
        // 1s 結算：先寫 cookedAt 再開獎勵（onCooked 內處理）
        setTimeout(() => onCooked(), 1000);
      }
      return v;
    });
  };

  const onUp = () => setStirring(false);

  const tokenInner = (i: number, size: number) => {
    const url = urls[i];
    const m = materials[i];
    if (url) {
      return (
        <span
          style={{
            display: "block", width: size, height: size, borderRadius: "50%", overflow: "hidden",
            boxShadow: "0 0 0 3px #fffbf0,0 8px 16px -5px rgba(60,40,15,.6)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </span>
      );
    }
    return (
      <span
        style={{
          ...serifTC, display: "flex", width: size, height: size, borderRadius: "50%",
          background: m.gradient, alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: size === 60 ? 22 : 17, color: "#fff",
          boxShadow: "0 0 0 3px #fffbf0,0 8px 16px -5px rgba(60,40,15,.6)",
        }}
      >
        {m.glyph}
      </span>
    );
  };

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 45,
        background: "radial-gradient(120% 60% at 50% 8%,#f6ecd4,#e7d6b2)",
        animation: "nvFade .25s ease-out", display: "flex", flexDirection: "column", boxSizing: "border-box",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 0", flexShrink: 0 }}>
        {!merged ? (
          <button
            onClick={onClose}
            aria-label="回去"
            style={{
              width: 40, height: 40, flexShrink: 0, borderRadius: "50%", border: "none",
              background: "rgba(90,60,30,.1)", cursor: "pointer", display: "flex",
              alignItems: "center", justifyContent: "center", fontSize: 20, color: "#5b4a35", padding: "0 0 2px",
            }}
          >
            ‹
          </button>
        ) : (
          <span style={{ width: 40, height: 40, flexShrink: 0 }} />
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: ".16em", color: "#a9793f", fontWeight: 700, margin: 0 }}>{soupName}</p>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, color: "#3a2f22", margin: "1px 0 0" }}>
            {all ? "攪一攪這鍋湯" : "把材料放進鍋"}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "#8a7659", margin: 0, padding: "4px 20px 0", flexShrink: 0 }}>
        {count === 0
          ? "點一樣材料，讓它沉進湯裡"
          : all
            ? merged
              ? "都化進湯裡了"
              : "壓住湯面，畫圈攪一攪"
            : `還差 ${3 - count} 樣`}
      </p>

      {/* 鍋 */}
      <div style={{ position: "relative", width: 300, height: 300, margin: "34px auto 0", flexShrink: 0 }}>
        {count > 0 ? (
          <>
            <div style={{ position: "absolute", left: 120, top: 6, width: 10, height: 40, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 3.8s ease-in infinite", zIndex: 5 }} />
            <div style={{ position: "absolute", left: 172, top: 2, width: 10, height: 44, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 4.4s ease-in .7s infinite", zIndex: 5 }} />
          </>
        ) : null}

        {/* 湯面（pointer 目標）*/}
        <div
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: "absolute", left: 30, top: 30, width: 240, height: 240, borderRadius: "50%",
            border: "11px solid #b98a4a", background: BROTH[stage],
            boxShadow: "inset 0 8px 26px rgba(70,40,10,.4)", transition: "background .6s ease",
            cursor: all && !merged ? "grab" : "default", touchAction: "none", userSelect: "none",
            animation: all && !merged ? "nvGlowRing 1.8s ease-in-out infinite" : "none",
          }}
        />
        {rippleN > 0 ? (
          <span
            key={`r${rippleN}`}
            style={{
              position: "absolute", left: 150, top: 150, width: 70, height: 70, borderRadius: "50%",
              border: "3px solid rgba(255,246,225,.9)", transform: "translate(-50%,-50%)",
              animation: "nvRipple .8s ease-out forwards", zIndex: 4, pointerEvents: "none",
            }}
          />
        ) : null}

        {/* 湯面漂浮材料（跟著 angle 公轉）*/}
        <div style={{ position: "absolute", left: 30, top: 30, width: 240, height: 240, pointerEvents: "none", zIndex: 5, transform: `rotate(${Math.round(angle * 10) / 10}deg)` }}>
          {[0, 1, 2].map((i) =>
            done[i] ? (
              <span
                key={`f${i}${merged ? "-in" : ""}`}
                style={{
                  position: "absolute", left: RING[i].left, top: RING[i].top, width: 48, height: 48,
                  transform: merged ? RING[i].c : "none", opacity: merged ? 0 : 1,
                  transition: "transform .7s ease,opacity .7s ease", animation: "nvPop .5s ease-out",
                }}
              >
                {tokenInner(i, 48)}
              </span>
            ) : null,
          )}
        </div>

        {/* 鍋緣可點的 token */}
        {[0, 1, 2].map((i) => (
          <button
            key={i}
            onClick={() => tap(i)}
            style={{
              position: "absolute", left: RIM[i].left, top: RIM[i].top, width: 60, height: 60, padding: 0,
              border: "none", background: "transparent", cursor: done[i] ? "default" : "pointer",
              transform: done[i] ? RIM[i].c : "none", opacity: done[i] ? 0 : 1,
              transition: "transform .65s cubic-bezier(.5,-.2,.3,1.4),opacity .65s ease", zIndex: 6,
              pointerEvents: done[i] ? "none" : "auto",
            }}
          >
            {tokenInner(i, 60)}
          </button>
        ))}
      </div>

      {/* 進度：階段 A 三點 / 階段 B 進度條 */}
      <div style={{ marginTop: "auto", padding: "0 34px 46px", flexShrink: 0 }}>
        {all ? (
          <div style={{ height: 12, borderRadius: 999, background: "rgba(120,90,50,.16)", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${Math.round(stir)}%`, background: "linear-gradient(90deg,#e0a94e,#c47a3a)", borderRadius: 999, transition: "width .12s linear" }} />
          </div>
        ) : (
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[0, 1, 2].map((i) => (
              <span key={i} style={{ width: 11, height: 11, borderRadius: "50%", background: i < count ? "#3f7a4a" : "rgba(120,90,50,.22)" }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
