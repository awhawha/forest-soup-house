"use client";

/**
 * 採集相機（全螢幕覆蓋層，z=40）— 規格 §6。
 * 單一材料：拍照 or 用說的；完成即時寫入 WeekProgress。
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
  index: number;
  progress: WeekProgress;
  onFound: (index: number, capture: Capture) => void;
  onNext: () => void;
  onClose: () => void;
}

export function CaptureOverlay({
  material,
  index,
  progress,
  onFound,
  onNext,
  onClose,
}: CaptureOverlayProps) {
  const [mode, setMode] = useState<"photo" | "answer">("photo");
  const [busy, setBusy] = useState(false);

  const found = progress.found[index];
  const done = !!found;
  const total = foundCount(progress);
  const allDone = firstUnfound(progress) === -1;

  const handleShoot = async (file: File | undefined) => {
    if (!file || done) return;
    setBusy(true);
    try {
      const photoId = await savePhoto(file);
      onFound(index, { kind: "photo", photoId, at: Date.now() });
    } finally {
      setBusy(false);
    }
  };

  const pickOption = (i: number) => {
    if (done) return;
    onFound(index, { kind: "answer", answerIdx: i, at: Date.now() });
  };

  const answeredText =
    found?.kind === "answer" && found.answerIdx != null
      ? material.options[found.answerIdx]
      : "";

  return (
    <div
      key={`cap${index}`}
      style={{
        position: "absolute", inset: 0, zIndex: 40, background: "#221c11",
        animation: "nvFade .25s ease-out", display: "flex", flexDirection: "column",
        boxSizing: "border-box", overflowY: "auto",
      }}
    >
      {/* 頂欄 */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 8px", flexShrink: 0 }}>
        <button
          onClick={onClose}
          aria-label="回去"
          style={{
            width: 40, height: 40, flexShrink: 0, borderRadius: "50%", border: "none",
            background: "rgba(255,251,240,.14)", cursor: "pointer", display: "flex",
            alignItems: "center", justifyContent: "center", fontSize: 20, color: "#f4ead2", padding: "0 0 2px",
          }}
        >
          ‹
        </button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: 10, letterSpacing: ".16em", color: "#c9b98f", fontWeight: 700, margin: 0 }}>
            搜 集 · {total} / 3
          </p>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, color: "#fdf6e4", margin: "1px 0 0" }}>
            {material.name}
          </p>
        </div>
      </div>
      <p style={{ fontSize: 12.5, color: "#d8c9a4", margin: 0, padding: "2px 20px 14px", lineHeight: 1.75, flexShrink: 0 }}>
        {material.guide}
      </p>

      {/* 拍照模式 */}
      {mode === "photo" ? (
        <>
          <div style={{ padding: "0 16px", position: "relative", flexShrink: 0 }}>
            <div
              style={{
                background: "rgba(253,246,228,.94)", borderRadius: 22, height: 392,
                overflow: "hidden", position: "relative", display: "flex",
                alignItems: "center", justifyContent: "center",
              }}
            >
              {done && found?.kind === "photo" ? (
                <PhotoImg
                  photoId={found.photoId}
                  alt={material.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                  fallback={<span style={{ color: "#b3a37f", fontSize: 13 }}>照片</span>}
                />
              ) : (
                <span style={{ fontSize: 13, color: "#a89272" }}>{material.example}</span>
              )}
            </div>
            {done ? (
              <span
                style={{
                  position: "absolute", top: 12, right: 28, width: 40, height: 40, borderRadius: "50%",
                  background: "#3f7a4a", border: "2.5px solid #fdf6e4", display: "flex",
                  alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700,
                  color: "#faf4e6", animation: "nvPop .5s ease-out", boxShadow: "0 8px 18px -6px rgba(0,0,0,.5)",
                }}
              >
                ✓
              </span>
            ) : null}
          </div>
          {!done ? (
            <div style={{ marginTop: "auto", padding: "20px 0 30px", display: "flex", flexDirection: "column", alignItems: "center", gap: 16, flexShrink: 0 }}>
              <label
                aria-label="拍照"
                style={{
                  width: 72, height: 72, borderRadius: "50%", border: "4px solid rgba(255,251,240,.85)",
                  background: "transparent", cursor: busy ? "wait" : "pointer", padding: 0,
                  display: "flex", alignItems: "center", justifyContent: "center", opacity: busy ? 0.6 : 1,
                }}
              >
                <span style={{ width: 54, height: 54, borderRadius: "50%", background: "#fdf6e4", display: "block" }} />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  hidden
                  onChange={(e) => handleShoot(e.target.files?.[0])}
                />
              </label>
              <button
                onClick={() => setMode("answer")}
                style={{
                  border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit",
                  fontSize: 12, color: "#c9b98f", textDecoration: "underline", textUnderlineOffset: 3, padding: "6px 10px",
                }}
              >
                今天不方便拍照？用說的也可以
              </button>
            </div>
          ) : null}
        </>
      ) : (
        /* 用說的模式 */
        <>
          {!done ? (
            <>
              <div
                style={{
                  margin: "4px 16px 0", background: "#fdf6e4", borderRadius: 22, padding: "20px 18px",
                  flexShrink: 0, animation: "nvIn .3s ease-out",
                }}
              >
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, color: "#3a2f22", margin: 0, lineHeight: 1.6 }}>
                  {material.question}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 9, marginTop: 16 }}>
                  {material.options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => pickOption(i)}
                      style={{
                        width: "100%", textAlign: "left", border: "1.5px solid #e0cfa8", background: "#fff",
                        color: "#5b4a35", fontFamily: "inherit", fontSize: 14, fontWeight: 700,
                        padding: "13px 16px", borderRadius: 14, cursor: "pointer",
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ padding: "14px 0 30px", display: "flex", justifyContent: "center", flexShrink: 0 }}>
                <button
                  onClick={() => setMode("photo")}
                  style={{
                    border: "none", background: "transparent", cursor: "pointer", fontFamily: "inherit",
                    fontSize: 12, color: "#c9b98f", textDecoration: "underline", textUnderlineOffset: 3, padding: "6px 10px",
                  }}
                >
                  還是想拍拍看
                </button>
              </div>
            </>
          ) : (
            <div style={{ margin: "4px 16px 0", flexShrink: 0, animation: "nvIn .35s ease-out" }}>
              <div
                style={{
                  height: 392, borderRadius: 22, background: material.gradient, display: "flex",
                  flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16,
                  boxShadow: "inset 0 0 90px rgba(0,0,0,.18)",
                }}
              >
                <span
                  style={{
                    ...serifTC, width: 110, height: 110, borderRadius: "50%", background: "rgba(255,255,255,.9)",
                    display: "flex", alignItems: "center", justifyContent: "center", fontSize: 44,
                    color: material.colorSolid, animation: "nvPop .5s ease-out",
                    boxShadow: "0 14px 30px -10px rgba(0,0,0,.4)", fontWeight: 700,
                  }}
                >
                  {material.glyph}
                </span>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, color: "#fff", margin: 0, textShadow: "0 2px 8px rgba(0,0,0,.35)" }}>
                  {material.name}
                </p>
                {answeredText ? (
                  <p style={{ fontSize: 12.5, color: "rgba(255,255,255,.9)", margin: 0, background: "rgba(0,0,0,.16)", borderRadius: 999, padding: "5px 14px" }}>
                    你說：{answeredText}
                  </p>
                ) : null}
              </div>
            </div>
          )}
        </>
      )}

      {/* 完成後主按鈕 */}
      {done ? (
        <div style={{ marginTop: "auto", padding: "20px 16px 34px", flexShrink: 0, animation: "nvIn .35s ease-out" }}>
          <button
            onClick={onNext}
            style={{
              ...serifTC, width: "100%", border: "none", cursor: "pointer", height: 54, borderRadius: 16,
              background: "#3f7a4a", color: "#faf4e6", fontWeight: 700, fontSize: 16.5,
              boxShadow: "0 12px 30px -10px rgba(45,90,65,.55)",
            }}
          >
            {allDone ? "帶回湯湯屋" : "找下一樣"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
