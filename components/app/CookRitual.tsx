"use client";

/**
 * 煮湯儀式（全螢幕覆蓋層，z=45）— 規格 §7。
 * 階段 A 放料（把鍋下方的材料「拖」進鍋）→ 階段 B 攪拌手勢（stir 累積到 100）→ merged → 結算。
 * 儀式狀態只存記憶體；中途離開不保存。
 */
import { useEffect, useRef, useState } from "react";
import type { WeekIngredient } from "@/lib/weekly";
import { getPhotoUrl } from "@/lib/client/photoStore";
import { serifTC, STICKER_OUTLINE } from "@/components/app/PhoneFrame";

const BROTH = ["#e8c98a", "#e2b972", "#d7a457", "#c98a3a"];
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
  const [drag, setDrag] = useState<{ i: number; cx: number; cy: number } | null>(null);
  const lastAngle = useRef(0);
  const firedRef = useRef(false);
  const potRef = useRef<HTMLDivElement>(null);

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

  const dropIn = (i: number) => {
    if (done[i]) return;
    setDone((d) => d.map((v, j) => (j === i ? true : v)));
    setRippleN((n) => n + 1);
  };

  // 落點是否在鍋內（放寬一點，好對準）
  const isOverPot = (cx: number, cy: number) => {
    const el = potRef.current;
    if (!el) return false;
    const r = el.getBoundingClientRect();
    const dx = cx - (r.left + r.width / 2);
    const dy = cy - (r.top + r.height / 2);
    const rad = r.width / 2 + 44;
    return dx * dx + dy * dy <= rad * rad;
  };
  // 拖到鍋上時給高光提示；在事件裡算好存 state，render 只讀 state（不在 render 期讀 ref）
  const [overPot, setOverPot] = useState(false);

  // 拖材料入鍋（pointer 拖曳）
  const onTokenDown = (i: number) => (e: React.PointerEvent) => {
    if (done[i]) return;
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setDrag({ i, cx: e.clientX, cy: e.clientY });
    setOverPot(isOverPot(e.clientX, e.clientY));
  };
  const onTokenMove = (e: React.PointerEvent) => {
    setDrag((d) => (d ? { ...d, cx: e.clientX, cy: e.clientY } : d));
    setOverPot(isOverPot(e.clientX, e.clientY));
  };
  const onTokenUp = (e: React.PointerEvent) => {
    if (drag && isOverPot(e.clientX, e.clientY)) dropIn(drag.i);
    setDrag(null);
    setOverPot(false);
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

  // 材料呈現：有照片 → 去背貼紙（白邊）；用說的 → 字圓
  const tokenInner = (i: number, size: number) => {
    const url = urls[i];
    const m = materials[i];
    if (url) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt=""
          style={{
            width: size, height: size, objectFit: "contain", display: "block",
            filter: STICKER_OUTLINE, pointerEvents: "none",
          }}
        />
      );
    }
    return (
      <span
        style={{
          ...serifTC, display: "flex", width: size, height: size, borderRadius: "50%",
          background: m.gradient, alignItems: "center", justifyContent: "center",
          fontWeight: 700, fontSize: Math.round(size * 0.36), color: "#fff",
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
          ? "把下面的材料拖進鍋子裡"
          : all
            ? merged
              ? "都化進湯裡了"
              : "壓住湯面，畫圈攪一攪"
            : `再拖 ${3 - count} 樣進鍋`}
      </p>

      {/* 鍋 */}
      <div style={{ position: "relative", width: 300, height: 300, margin: "26px auto 0", flexShrink: 0 }}>
        {count > 0 ? (
          <>
            <div style={{ position: "absolute", left: 120, top: 6, width: 10, height: 40, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 3.8s ease-in infinite", zIndex: 5 }} />
            <div style={{ position: "absolute", left: 172, top: 2, width: 10, height: 44, background: "radial-gradient(circle,rgba(230,180,90,.8),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 4.4s ease-in .7s infinite", zIndex: 5 }} />
          </>
        ) : null}

        {/* 湯面（pointer 目標）*/}
        <div
          ref={potRef}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          style={{
            position: "absolute", left: 30, top: 30, width: 240, height: 240, borderRadius: "50%",
            border: "11px solid #b98a4a", background: BROTH[stage],
            boxShadow: overPot
              ? "inset 0 8px 26px rgba(70,40,10,.4),0 0 0 8px rgba(80,150,90,.35)"
              : "inset 0 8px 26px rgba(70,40,10,.4)",
            transition: "background .6s ease,box-shadow .2s ease",
            cursor: all && !merged ? "grab" : "default", touchAction: "none", userSelect: "none",
            transform: overPot ? "scale(1.03)" : "none",
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
      </div>

      {/* 鍋下方材料盤：拖進鍋 */}
      {!all && !merged ? (
        <div style={{ display: "flex", justifyContent: "center", gap: 14, padding: "30px 20px 0", flexShrink: 0 }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: 96 }}>
              {done[i] ? (
                <span style={{ width: 78, height: 78, borderRadius: 20, border: "2px dashed #cdb789", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: "#bfa878" }}>✓</span>
              ) : (
                <button
                  onPointerDown={onTokenDown(i)}
                  onPointerMove={onTokenMove}
                  onPointerUp={onTokenUp}
                  onPointerCancel={onTokenUp}
                  style={{
                    width: 78, height: 78, padding: 0, border: "none", background: "transparent",
                    cursor: "grab", touchAction: "none", opacity: drag?.i === i ? 0.3 : 1,
                    animation: drag ? "none" : `nvFloat 2.6s ease-in-out ${i * 0.3}s infinite`,
                  }}
                >
                  {tokenInner(i, 78)}
                </button>
              )}
              <span style={{ ...serifTC, fontSize: 13, fontWeight: 700, color: "#7a6547", textAlign: "center", lineHeight: 1.2 }}>
                {materials[i].name}
              </span>
            </div>
          ))}
        </div>
      ) : null}

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

      {/* 拖曳中：跟著手指的浮動貼紙。position:fixed + 視窗座標（PhoneFrame 無 transform，
          fixed 就是相對視窗，不用讀 root 的 rect）*/}
      {drag ? (
        <div style={{ position: "fixed", left: drag.cx, top: drag.cy, transform: "translate(-50%,-50%) scale(1.12)", zIndex: 80, pointerEvents: "none" }}>
          {tokenInner(drag.i, 78)}
        </div>
      ) : null}
    </div>
  );
}

interface CookRitualProps {
  materials: WeekIngredient[];
  /** 每樣材料孩子拍的照片 id（用說的則為 null） */
  photoIds: (string | null)[];
  soupName: string;
  /** 攪拌完成、結算（寫 cookedAt + 開獎勵）*/
  onCooked: () => void;
  onClose: () => void;
}
