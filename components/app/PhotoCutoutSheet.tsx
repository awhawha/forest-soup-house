"use client";

/**
 * 拍完／選完照片後的「去背預覽」過場（規格：拍完問一下、給開關）。
 * 一進來就在瀏覽器裡去背，處理時顯示原圖＋「魔法中⋯」。
 * 完成後讓小孩選「去背貼紙」或「留原圖」，按下決定才真的存進去。
 *
 * 去背失敗（沒抓好／不支援）不擋路：直接退回原圖，孩子照樣完成收集。
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { cutoutBlob } from "@/lib/client/removeBg";
import { serifTC } from "@/components/app/PhoneFrame";

type Choice = "cutout" | "original";

interface PhotoCutoutSheetProps {
  file: File;
  label?: string;
  /** 小孩按「就用這張」時回傳最終要存的 blob（去背 PNG 或原圖） */
  onConfirm: (blob: Blob) => void;
  onCancel: () => void;
}

// 透明棋盤底，讓去背後看得出是去背過的
const CHECKER =
  "repeating-conic-gradient(#e7dcc0 0% 25%, #f4ead2 0% 50%) 50% / 22px 22px";

// 去背等待時輪播的湯湯屋小知識（菲娜／波飛小日常＋食物冷知識）。
// ★ 數量固定 8 張，對齊 globals.css 的 nvTip keyframe（每張佔 1/8 時段）；要加減請一起改
const TIPS = [
  "菲娜說：好湯不用急，慢慢熬才會香。",
  "你知道嗎？紅蘿蔔最早其實是紫色的。",
  "番茄雖然拿來煮菜，但它其實是水果喔。",
  "波飛攪湯前，都會先跟鍋子說聲嗨。",
  "蘑菇不是植物也不是動物，是自成一家的菌菇。",
  "切洋蔥會流眼淚，是因為它在保護自己。",
  "玉米有幾根鬚，就藏著幾顆玉米粒。",
  "菲娜說：一鍋湯最重要的，是一起喝的人。",
];
const TIP_SLOT = 4; // 每張顯示秒數；整輪 = TIPS.length × TIP_SLOT

export function PhotoCutoutSheet({ file, label, onConfirm, onCancel }: PhotoCutoutSheetProps) {
  const [cutoutUrl, setCutoutUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<"working" | "done" | "failed">("working");
  const [choice, setChoice] = useState<Choice>("cutout");
  const cutoutBlobRef = useRef<Blob | null>(null);

  // 原圖 URL 依 file 建立（避免在 effect 內同步 setState）；換 file／卸載時釋放
  const originalUrl = useMemo(() => URL.createObjectURL(file), [file]);
  useEffect(() => () => URL.revokeObjectURL(originalUrl), [originalUrl]);

  useEffect(() => {
    let cancelled = false;
    cutoutBlob(file)
      .then((blob) => {
        if (cancelled) return;
        cutoutBlobRef.current = blob;
        setCutoutUrl(URL.createObjectURL(blob));
        setStatus("done");
        setChoice("cutout");
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("failed");
        setChoice("original");
      });

    return () => {
      cancelled = true;
    };
  }, [file]);

  // cutout 的 object URL 用完釋放
  useEffect(() => {
    return () => {
      if (cutoutUrl) URL.revokeObjectURL(cutoutUrl);
    };
  }, [cutoutUrl]);

  const confirm = () => {
    const blob = choice === "cutout" && cutoutBlobRef.current ? cutoutBlobRef.current : file;
    onConfirm(blob);
  };

  const showCutout = choice === "cutout" && status === "done";
  const shownUrl = showCutout ? cutoutUrl : originalUrl;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
      <div onClick={onCancel} style={{ position: "absolute", inset: 0, background: "rgba(40,30,15,.5)", animation: "nvFade .2s ease-out" }} />
      <div
        style={{
          position: "relative", background: "#fbf5e6", borderRadius: "24px 24px 0 0",
          padding: "16px 18px 28px", animation: "nvSheet .28s ease-out",
          boxShadow: "0 -12px 40px -12px rgba(60,40,20,.4)",
        }}
      >
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#d8c9a4", margin: "0 auto 14px" }} />
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, color: "#3a2f22", textAlign: "center", margin: "0 0 8px" }}>
          {status === "working" ? "正在幫你把背景變不見⋯" : status === "failed" ? "這張留原圖就好" : "要哪一張？"}
        </p>

        {/* 等待時輪播湯湯屋小知識：純 opacity 動畫跑在合成器執行緒，去背卡住主執行緒時字卡照樣會換 */}
        {status === "working" ? (
          <div style={{ margin: "0 0 12px", padding: "12px 14px", borderRadius: 16, background: "#fff6e2", border: "1px solid #eaddba" }}>
            <p style={{ margin: 0, fontSize: 11, letterSpacing: ".12em", color: "#c39a55", fontWeight: 700 }}>🍲 湯湯屋小知識</p>
            <div style={{ position: "relative", marginTop: 4, height: 24 }}>
              {TIPS.map((tip, i) => (
                <p
                  key={i}
                  style={{
                    position: "absolute", inset: 0, margin: 0, opacity: 0,
                    display: "flex", alignItems: "center",
                    fontSize: 13.5, lineHeight: 1.4, color: "#6f5a3c",
                    animation: `nvTip ${TIPS.length * TIP_SLOT}s linear ${i * TIP_SLOT}s infinite`,
                  }}
                >
                  {tip}
                </p>
              ))}
            </div>
          </div>
        ) : null}

        {/* 預覽框 */}
        <div
          style={{
            position: "relative", width: "100%", aspectRatio: "1 / 1", borderRadius: 20, overflow: "hidden",
            background: showCutout ? CHECKER : "#efe6cf", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          {shownUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- object URL 預覽
            <img src={shownUrl} alt={label ?? ""} style={{ width: "100%", height: "100%", objectFit: showCutout ? "contain" : "cover", display: "block" }} />
          ) : null}
          {status === "working" ? (
            <div style={{ position: "absolute", inset: 0, background: "rgba(251,245,230,.55)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <span style={{ fontSize: 30, animation: "nvSpin 1.1s linear infinite" }}>✨</span>
              <span style={{ ...serifTC, fontSize: 14, fontWeight: 700, color: "#8a6a3a" }}>魔法中⋯</span>
            </div>
          ) : null}
        </div>

        {/* 去背／原圖 切換（去背成功才給選） */}
        {status === "done" ? (
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <button onClick={() => setChoice("cutout")} style={toggleStyle(choice === "cutout")}>✨ 去背貼紙</button>
            <button onClick={() => setChoice("original")} style={toggleStyle(choice === "original")}>🖼 原本的照片</button>
          </div>
        ) : null}

        {/* 動作 */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          <button onClick={confirm} disabled={status === "working"} style={{ ...ctaStyle, opacity: status === "working" ? 0.55 : 1, cursor: status === "working" ? "wait" : "pointer" }}>
            {status === "working" ? "請稍等⋯" : "就用這張"}
          </button>
          <button onClick={onCancel} style={cancelStyle}>重拍／換一張</button>
        </div>
      </div>
    </div>
  );
}

function toggleStyle(active: boolean): React.CSSProperties {
  return {
    ...serifTC, flex: 1, height: 48, borderRadius: 14, cursor: "pointer", fontSize: 15, fontWeight: 700,
    border: active ? "2px solid #3f7a4a" : "1.5px solid #d8c9a4",
    background: active ? "#eaf3ea" : "#fff", color: active ? "#2f6238" : "#8a7659",
  };
}

const ctaStyle: React.CSSProperties = {
  ...serifTC, width: "100%", border: "none", height: 56, borderRadius: 18,
  background: "#3f7a4a", color: "#faf4e6", fontWeight: 700, fontSize: 18,
  boxShadow: "0 12px 30px -10px rgba(45,90,65,.55)",
};

const cancelStyle: React.CSSProperties = {
  ...serifTC, width: "100%", boxSizing: "border-box", border: "1.5px solid #cdbb94",
  cursor: "pointer", height: 50, borderRadius: 16, background: "#fdf6e4", color: "#8a7659",
  fontWeight: 700, fontSize: 15.5,
};
