"use client";

/**
 * 採集頁 v3（全螢幕覆蓋層，z=40）— 規格「變更規格-搜集頁 v3」。
 * 去相機化：暖色紙面、點取景框直接叫系統相簿／相機、放上照片即完成、
 * 需按主 CTA 才推進（確認機會）、字級放大。其餘沿用 v2。
 */
import { useState } from "react";
import type { WeekIngredient } from "@/lib/weekly";
import type { Capture, WeekProgress } from "@/lib/client/weekProgress";
import { firstUnfound, foundCount } from "@/lib/client/weekProgress";
import { savePhoto } from "@/lib/client/photoStore";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoImg } from "@/components/app/PhotoImg";

interface CaptureOverlayProps {
  material: WeekIngredient;
  /** 本週三樣材料，用來組「下一樣 · ○○」CTA 文案 */
  materials: WeekIngredient[];
  index: number;
  progress: WeekProgress;
  onFound: (index: number, capture: Capture) => void;
  onNext: () => void;
  onClose: () => void;
}

export function CaptureOverlay({
  material,
  materials,
  index,
  progress,
  onFound,
  onNext,
  onClose,
}: CaptureOverlayProps) {
  const [mode, setMode] = useState<"photo" | "answer">("photo");
  const [editing, setEditing] = useState(false); // 重新作答／重拍時強制顯示未完成 UI
  const [busy, setBusy] = useState(false);

  const captured = progress.found[index];
  const showDone = !!captured && !editing;
  const total = foundCount(progress);

  // 主 CTA：帶入下一個未完成材料名
  const nextIdx = firstUnfound(progress);
  const allDone = nextIdx === -1;
  const ctaLabel = allDone ? "帶回湯湯屋" : `下一樣 · ${materials[nextIdx]?.name ?? ""}`;

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const photoId = await savePhoto(file);
      onFound(index, { kind: "photo", photoId, at: Date.now() });
      setEditing(false);
    } finally {
      setBusy(false);
    }
  };

  const pickOption = (i: number) => {
    onFound(index, { kind: "answer", answerIdx: i, at: Date.now() });
    setEditing(false);
  };

  const answeredText =
    captured?.kind === "answer" && captured.answerIdx != null
      ? material.options[captured.answerIdx]
      : "";

  return (
    <div
      style={{
        position: "absolute", inset: 0, zIndex: 40, background: "#f4ead2",
        animation: "nvFade .25s ease-out", display: "flex", flexDirection: "column",
        boxSizing: "border-box", userSelect: "none",
      }}
    >
      {/* 頂欄 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 8px", flexShrink: 0 }}>
        <button
          onClick={onClose}
          aria-label="回去"
          style={{
            width: 44, height: 44, flexShrink: 0, borderRadius: "50%", border: "none",
            background: "rgba(90,60,30,.1)", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 22, color: "#5b4a35", padding: "0 0 2px",
          }}
        >
          ‹
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 12, letterSpacing: ".16em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
            搜 集 · {total} / 3
          </p>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 24, color: "#3a2f22", margin: "2px 0 0", lineHeight: 1.25 }}>
            {material.name}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 16, color: "#6f5d44", margin: 0, padding: "4px 20px 14px", lineHeight: 1.8, flexShrink: 0 }}>
        {material.guide}
      </p>

      {/* 內容區（flex:1 填滿） */}
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "0 16px 8px" }}>
        {showDone ? (
          captured!.kind === "photo" ? (
            // 完成・照片
            <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
              <div style={{ height: "100%", borderRadius: 24, overflow: "hidden", background: "rgba(253,246,228,.94)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <PhotoImg
                  photoId={captured!.photoId}
                  alt={material.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  fallback={<span style={{ color: "#b3a37f", fontSize: 14 }}>照片</span>}
                />
              </div>
              <span
                style={{
                  position: "absolute", top: 14, right: 14, width: 44, height: 44, borderRadius: "50%",
                  background: "#3f7a4a", border: "3px solid #fdf6e4", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 700,
                  color: "#faf4e6", animation: "nvPop .5s ease-out", boxShadow: "0 8px 18px -6px rgba(0,0,0,.4)",
                }}
              >
                ✓
              </span>
            </div>
          ) : (
            // 完成・用說的
            <div style={{ flex: 1, minHeight: 0, borderRadius: 24, background: material.gradient, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: "inset 0 0 90px rgba(0,0,0,.18)" }}>
              <span style={{ ...serifTC, width: 120, height: 120, borderRadius: "50%", background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 48, color: material.colorSolid, animation: "nvPop .5s ease-out", boxShadow: "0 14px 30px -10px rgba(0,0,0,.4)", fontWeight: 700 }}>
                {material.glyph}
              </span>
              <p style={{ ...serifTC, fontWeight: 700, fontSize: 20, color: "#fff", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>{material.name}</p>
              {answeredText ? (
                <p style={{ fontSize: 14, color: "rgba(255,255,255,.95)", margin: 0, background: "rgba(0,0,0,.16)", borderRadius: 999, padding: "7px 16px" }}>你說：{answeredText}</p>
              ) : null}
            </div>
          )
        ) : mode === "photo" ? (
          // 未完成・拍照：取景框本身就是上傳控制項（點一下叫系統相簿／相機）
          <label
            style={{
              flex: 1, minHeight: 0, borderRadius: 24, background: "rgba(253,246,228,.94)",
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              gap: 12, cursor: busy ? "wait" : "pointer", opacity: busy ? 0.7 : 1,
              border: "2px dashed #d8bc7e", boxSizing: "border-box", padding: 20,
            }}
          >
            <span style={{ fontSize: 34, color: "#c4a86a" }}>＋</span>
            <span style={{ ...serifTC, fontSize: 17, fontWeight: 700, color: "#8a6a3a" }}>{busy ? "上傳中⋯" : "點這裡拍照或選一張"}</span>
            <span style={{ fontSize: 13.5, color: "#a08a68", textAlign: "center", lineHeight: 1.7 }}>{material.example}</span>
            <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
          </label>
        ) : (
          // 未完成・用說的：問題卡
          <div style={{ background: "#fdf6e4", borderRadius: 24, padding: "22px 18px", animation: "nvIn .3s ease-out" }}>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 19, color: "#3a2f22", margin: 0, lineHeight: 1.6 }}>
              {material.question}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
              {material.options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => pickOption(i)}
                  style={{
                    width: "100%", textAlign: "left", border: "1.5px solid #e0cfa8", background: "#fff",
                    color: "#5b4a35", fontFamily: "inherit", fontSize: 16, fontWeight: 700,
                    padding: "15px 18px", borderRadius: 14, cursor: "pointer", minHeight: 44,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 底部動作 */}
      <div style={{ flexShrink: 0, padding: "12px 16px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
        {showDone ? (
          <>
            <button onClick={onNext} style={ctaStyle}>{ctaLabel}</button>
            {captured!.kind === "photo" ? (
              <label style={{ ...secondaryStyle, cursor: busy ? "wait" : "pointer" }}>
                重新拍一張
                <input type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
              </label>
            ) : (
              <button onClick={() => { setEditing(true); setMode("answer"); }} style={secondaryStyle}>
                換一個答案
              </button>
            )}
          </>
        ) : mode === "photo" ? (
          <button onClick={() => setMode("answer")} style={secondaryStyle}>
            不方便出門？用說的也可以
          </button>
        ) : (
          <button onClick={() => setMode("photo")} style={secondaryStyle}>
            還是想拍拍看
          </button>
        )}
      </div>
    </div>
  );
}

const ctaStyle: React.CSSProperties = {
  ...serifTC, width: "100%", border: "none", cursor: "pointer", height: 58, borderRadius: 18,
  background: "#3f7a4a", color: "#faf4e6", fontWeight: 700, fontSize: 18,
  boxShadow: "0 12px 30px -10px rgba(45,90,65,.55)",
};

const secondaryStyle: React.CSSProperties = {
  ...serifTC, width: "100%", boxSizing: "border-box", border: "1.5px solid #cdbb94",
  cursor: "pointer", height: 52, borderRadius: 16, background: "#fdf6e4", color: "#5b4a35",
  fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
};
