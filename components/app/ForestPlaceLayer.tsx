"use client";

/**
 * 森林地點覆蓋層（9 個）— 規格 §3。
 * z-index:15，inset:0 0 86px：蓋住內容、露出底部分頁列，孩子隨時能跳去別分頁。
 * 每個地點各有一個招牌小儀式；能「等一夜／等一天」的地方提供 ⏩ demo 快轉鈕。
 */
import { useEffect, useState } from "react";
import type { WeekBundle, WeekCardInfo } from "@/lib/weekly";
import { foundCount, type WeekProgress } from "@/lib/client/weekProgress";
import { useSoupState } from "@/lib/client/useSoupState";
import { Soup } from "@/lib/client/soupPantry";
import {
  GD_FLOWER, GD_SCENTS, getGardenRack, setGardenRack, type GardenFlower,
  RIVER_ITEMS, loadRiver, setRiver, riverTomorrow, type RiverState,
  SH_SCENTS, getShedJars, setShedJars, type ShedJar,
  PO_CHARS, PO_REPLIES, getLetters, setLetters, type Letter,
  TREE_LINES, LAB_SCENTS, LAB_LINES, GROVE_CHARS,
} from "@/lib/client/places";
import { serifTC, STICKER_OUTLINE } from "@/components/app/PhoneFrame";
import { PhotoCapture } from "@/components/app/PhotoCapture";
import { PhotoImg } from "@/components/app/PhotoImg";
import { PhotoCutoutSheet } from "@/components/app/PhotoCutoutSheet";
import { savePhoto } from "@/lib/client/photoStore";
import { warmupCutout } from "@/lib/client/removeBg";

export type PlaceKey = "house" | "garden" | "station" | "river" | "shed" | "post" | "lab" | "stone" | "grove";

const GREEN = "#3f7a4a";

interface ForestPlaceLayerProps {
  place: PlaceKey;
  week: WeekBundle;
  weekCards: WeekCardInfo[];
  progress: WeekProgress;
  /** 已煮好的週數（石紋牆亮起用） */
  cookedWeeks: number[];
  onClose: () => void;
  onOpenStory: () => void;
  onOpenGather: () => void;
  onGoPot: () => void;
  onGoBook: () => void;
  onToast: (m: string) => void;
}

// 左上「‹ 回森林」命中區
function BackBtn({ onClose, dark }: { onClose: () => void; dark?: boolean }) {
  return (
    <button
      onClick={onClose}
      aria-label="回森林"
      style={{ width: 44, height: 44, flexShrink: 0, borderRadius: "50%", border: "none", background: dark ? "rgba(30,22,10,.32)" : "rgba(90,60,30,.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: dark ? "#faf4e6" : "#5b4a35", padding: "0 0 2px" }}
    >
      ‹
    </button>
  );
}

const scroll = (bg: string): React.CSSProperties => ({ position: "absolute", inset: "0 0 86px", zIndex: 15, background: bg, animation: "nvFade .25s ease-out", overflowY: "auto", boxSizing: "border-box", paddingBottom: 36 });
const sectionLabel: React.CSSProperties = { fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 };
const cardBox: React.CSSProperties = { background: "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18, boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "nvIn .35s ease-out" };
const footNote: React.CSSProperties = { textAlign: "center", fontSize: 11.5, color: "#a89e8c", margin: "26px 24px 0", lineHeight: 1.8 };

function Header({ accent, name, sub }: { accent: string; name: string; sub: string }) {
  return (
    <div style={{ padding: "2px 22px 0" }}>
      <p style={{ fontSize: 12, letterSpacing: ".16em", color: accent, fontWeight: 700, margin: 0 }}>魔 法 森 林</p>
      <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, margin: "2px 0 0", color: "#3a2f22" }}>{name}</h1>
      <p style={{ fontSize: 14, color: "#8a7659", margin: "4px 0 0" }}>{sub}</p>
    </div>
  );
}

export function ForestPlaceLayer(props: ForestPlaceLayerProps) {
  const { place, week, weekCards, progress, cookedWeeks, onClose, onOpenStory, onOpenGather, onGoPot, onGoBook, onToast } = props;
  const mat = foundCount(progress);
  const matDone = mat >= 3;
  const cooked = progress.cookedAt != null;

  switch (place) {
    case "house":
      return <House storyDone={progress.storyDone} matDone={matDone} cooked={cooked} onClose={onClose} onOpenStory={onOpenStory} onGoPot={onGoPot} />;
    case "garden":
      return <Garden onClose={onClose} />;
    case "station":
      return <Station week={week} progress={progress} mat={mat} matDone={matDone} cooked={cooked} onClose={onClose} onOpenGather={onOpenGather} onGoPot={onGoPot} onGoBook={onGoBook} />;
    case "river":
      return <River onClose={onClose} />;
    case "shed":
      return <Shed onClose={onClose} onToast={onToast} />;
    case "post":
      return <Post onClose={onClose} onToast={onToast} />;
    case "lab":
      return <Lab onClose={onClose} />;
    case "stone":
      return <Stone weekCards={weekCards} cookedWeeks={cookedWeeks} onClose={onClose} onOpenStory={onOpenStory} onToast={onToast} />;
    case "grove":
      return <Grove onClose={onClose} />;
    default:
      return null;
  }
}

// ═══════════ 3.1 湯湯屋主屋 ═══════════
function House({ storyDone, matDone, cooked, onClose, onOpenStory, onGoPot }: { storyDone: boolean; matDone: boolean; cooked: boolean; onClose: () => void; onOpenStory: () => void; onGoPot: () => void }) {
  const finaLine = !storyDone
    ? "鍋子正咕嘟咕嘟的，要不要先聽這鍋湯的故事？"
    : !matDone
      ? "故事聽完了，森林裡還有東西在等你。"
      : !cooked
        ? "材料都齊了！回湯鍋，我們一起開火。"
        : "這週的湯煮好了，隨時歡迎回來坐坐。";
  return (
    <div style={{ position: "absolute", inset: "0 0 86px", zIndex: 15, background: "#f4ead2", animation: "nvFade .25s ease-out", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
      <div style={{ position: "relative", height: 230, flexShrink: 0, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/handoff/fina-cooking.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 26%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(30,22,10,.2) 0%,transparent 40%,rgba(244,234,210,.2) 80%,#f4ead2 100%)" }} />
        <div style={{ position: "absolute", top: 18, left: 16 }}><BackBtn onClose={onClose} dark /></div>
      </div>
      <div style={{ padding: "6px 22px 0", flexShrink: 0 }}>
        <p style={{ fontSize: 12, letterSpacing: ".16em", color: "#a9793f", fontWeight: 700, margin: 0 }}>魔 法 森 林</p>
        <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, margin: "2px 0 0", color: "#3a2f22" }}>湯湯屋主屋</h1>
        <p style={{ fontSize: 14, color: "#8a7659", margin: "4px 0 0" }}>菲娜的家，爐火一直溫著</p>
      </div>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, margin: "20px 20px 0", flexShrink: 0 }}>
        <span style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", overflow: "hidden", border: "2px solid #fffbf0", boxShadow: "0 6px 14px -6px rgba(60,40,20,.5)" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/handoff/fina-bust.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </span>
        <div style={{ flex: 1, background: "#fdf6e4", borderRadius: "4px 18px 18px 18px", padding: "14px 16px", boxShadow: "0 10px 26px -18px rgba(90,60,30,.5)" }}>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 16, color: "#3a2f22", margin: 0, lineHeight: 1.75 }}>{finaLine}</p>
        </div>
      </div>
      <div style={{ marginTop: "auto", padding: "20px 20px 38px", display: "flex", flexDirection: "column", gap: 12, flexShrink: 0 }}>
        <button onClick={onOpenStory} style={{ ...serifTC, width: "100%", border: "none", cursor: "pointer", height: 56, borderRadius: 16, background: GREEN, color: "#faf4e6", fontWeight: 700, fontSize: 17, boxShadow: "0 12px 30px -10px rgba(45,90,65,.55)" }}>{storyDone ? "再聽一次這週的故事" : "聽這週的故事"}</button>
        <button onClick={onGoPot} style={{ width: "100%", border: "1.5px solid #cdbb94", background: "rgba(255,251,240,.7)", cursor: "pointer", height: 52, borderRadius: 16, color: "#6f5d44", fontFamily: "inherit", fontWeight: 700, fontSize: 15 }}>去湯鍋看看</button>
      </div>
    </div>
  );
}

// ═══════════ 3.2 草藥花園 ═══════════
function Garden({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<"idle" | "picking">("idle");
  const [scent, setScent] = useState(GD_SCENTS[0]);
  const [photoId, setPhotoId] = useState<string | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null); // 待去背預覽的採花照
  const [rack, setRack] = useState<GardenFlower[]>(() => getGardenRack());

  // 一進草藥花園就在背景暖機去背模型，等真的採花拍照時已就緒
  useEffect(() => {
    warmupCutout();
  }, []);

  const persist = (next: GardenFlower[]) => {
    setRack(next);
    setGardenRack(next);
  };
  const add = () => {
    persist([...rack, { id: Date.now(), scent, dry: false, photo: photoId ?? undefined }]);
    setStep("idle");
    setPhotoId(null);
  };
  const dry = (id: number) => persist(rack.map((r) => (r.id === id ? { ...r, dry: true } : r)));
  const collect = (id: number) => {
    const it = rack.find((r) => r.id === id);
    if (!it) return;
    Soup.add("flower", { scent: it.scent, photo: it.photo }); // 連去背照一起寫入共用收藏櫃
    persist(rack.filter((r) => r.id !== id));
  };

  // 香料收藏櫃：讀共用 SOUP × 第 1 週三樣材料（soup-changed 時自動重讀）；帶出最近一張去背照
  const pantry = useSoupState(() => {
    const p = Soup.pantry();
    return Soup.WEEKS[1].ingredients.map((i) => {
      const e = p[i.slug];
      const photo = e?.finds ? [...e.finds].reverse().find((f) => f.photo)?.photo : undefined;
      return { ...i, collected: !!e, count: e && e.finds ? e.finds.length : e ? 1 : 0, photo };
    });
  }, Soup.WEEKS[1].ingredients.map((i) => ({ ...i, collected: false, count: 0, photo: undefined as string | undefined })));
  const pantryCount = pantry.filter((i) => i.collected).length;

  return (
    <div style={{ ...scroll("linear-gradient(180deg,#dfe9cf 0%,#f4ead2 42%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>

      {/* hero */}
      <div style={{ margin: "8px 16px 0", borderRadius: 26, overflow: "hidden", background: "linear-gradient(160deg,#a8cf88,#5f9a52)", boxShadow: "0 16px 34px -18px rgba(60,120,40,.7)", position: "relative", animation: "nvIn .5s ease-out" }}>
        <div style={{ height: 132, position: "relative", overflow: "hidden" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/handoff/herbal-patch.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <span style={{ position: "absolute", right: 26, top: 26, width: 46, height: 46, borderRadius: "50%", overflow: "hidden", background: "#fff", boxShadow: "0 6px 14px -6px rgba(30,80,20,.6)", animation: "nvSway 3.6s ease-in-out infinite" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/handoff/milo-squirrel.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 20%" }} />
          </span>
        </div>
        <div style={{ background: "rgba(255,252,243,.96)", padding: "16px 18px 18px" }}>
          <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 24, margin: 0, color: "#3a2f22" }}>草藥花園</h1>
          <p style={{ fontSize: 13, color: "#a9793f", margin: "5px 0 0", fontStyle: "italic" }}>這裡種著「安心的小花」，聞起來像曬過太陽的棉被。</p>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, borderTop: "1px dashed #e0cfa8", paddingTop: 11 }}>
            <span style={{ width: 30, height: 30, flexShrink: 0, borderRadius: "50%", overflow: "hidden", background: "#fff", border: "1px solid #ecdcb8" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/handoff/milo-squirrel.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 20%" }} />
            </span>
            <p style={{ fontSize: 13, color: "#5b4a35", margin: 0 }}>小松鼠 <b>Milo</b> 常在這裡蒐集香味。</p>
          </div>
        </div>
      </div>

      {/* 招牌儀式：採花 */}
      <div style={{ margin: "18px 16px 0" }}>
        <p style={{ ...sectionLabel, margin: "0 0 10px" }}>這裡能做的事</p>
        {step === "idle" ? (
          <div style={cardBox}>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "#3a2f22" }}>採一朵今天的花</p>
            <p style={{ fontSize: 13, color: "#5b4a35", margin: "7px 0 0", lineHeight: 1.75 }}>到陽台或公園，摘一朵真的花或一片葉子，拍下來放上晾曬架。<br />花要曬上一天才會變成湯料——明天記得回來收。</p>
            <button onClick={() => setStep("picking")} style={{ marginTop: 14, width: "100%", height: 46, border: "none", borderRadius: 14, background: "#5f9a52", color: "#fff", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(40,110,30,.7)" }}>去採花 ✿</button>
          </div>
        ) : (
          <div style={{ ...cardBox, animation: "nvIn .3s ease-out" }}>
            <p style={{ fontSize: 12, color: "#8a7659", margin: "0 0 8px" }}>你採到的花，聞起來像什麼？</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {GD_SCENTS.map((s) => {
                const on = scent === s;
                return (
                  <button key={s} onClick={() => setScent(s)} style={{ border: `1px solid ${on ? "#5f9a52" : "#e0cfa8"}`, background: on ? "#5f9a52" : "#fff", color: on ? "#fff" : "#5f7a4a", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 999, cursor: "pointer" }}>{s}</button>
                );
              })}
            </div>
            <p style={{ fontSize: 12, color: "#8a7659", margin: "16px 0 8px" }}>拍下你採到的花</p>
            <PhotoCapture onPicked={setPendingFile} style={{ width: "100%", height: 150, display: "block", border: "1px dashed #c9bd9d", borderRadius: 14, background: "rgba(253,246,228,.7)", cursor: "pointer", padding: 0, overflow: "hidden" }}>
              {photoId ? (
                <PhotoImg photoId={photoId} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", padding: 8, boxSizing: "border-box", filter: STICKER_OUTLINE }} />
              ) : (
                <span style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: 6, color: "#8a7659" }}>
                  <span style={{ fontSize: 24 }}>✿</span>
                  <span style={{ fontSize: 12 }}>拍一朵真的花或葉子</span>
                </span>
              )}
            </PhotoCapture>
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button onClick={() => { setStep("idle"); setPhotoId(null); }} style={{ flex: "0 0 auto", height: 46, padding: "0 18px", border: "1px solid #e0cfa8", borderRadius: 14, background: "#fff", color: "#5f7a4a", fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer" }}>再看看</button>
              <button onClick={add} style={{ flex: 1, height: 46, border: "none", borderRadius: 14, background: "#5f9a52", color: "#fff", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(40,110,30,.7)" }}>放上晾曬架</button>
            </div>
          </div>
        )}
      </div>

      {/* 晾曬架 */}
      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={sectionLabel}>晾曬架 · {rack.length}</p>
          <span style={{ fontSize: 11, color: "#a08a68" }}>曬乾了就能收進收藏櫃</span>
        </div>
        {rack.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {rack.map((r) => (
              <div key={r.id} style={{ display: "flex", alignItems: "center", gap: 13, background: r.dry ? "linear-gradient(160deg,#fff6e4,#fbeccb)" : "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 18, padding: "13px 15px", boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)", animation: "nvIn .4s ease-out" }}>
                {r.photo ? (
                  <span style={{ width: 46, height: 46, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", animation: r.dry ? "nvGlowPulse 2.4s ease-in-out infinite" : "none", borderRadius: "50%" }}>
                    <PhotoImg photoId={r.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", filter: STICKER_OUTLINE }} />
                  </span>
                ) : (
                  <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: "50%", background: GD_FLOWER.color, display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 15, color: "#fff", animation: r.dry ? "nvGlowPulse 2.4s ease-in-out infinite" : "none" }}>{GD_FLOWER.glyph}</span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "#3a2f22" }}>{GD_FLOWER.name}</p>
                  <p style={{ fontSize: 11.5, color: r.dry ? "#c47a3a" : "#7f9068", margin: "2px 0 0", fontWeight: 600 }}>{r.dry ? `曬好了！香味像${r.scent}` : `晾曬中 · 還要 1 天 · ${r.scent}`}</p>
                </div>
                {r.dry ? (
                  <button onClick={() => collect(r.id)} style={{ flexShrink: 0, height: 34, padding: "0 13px", border: "none", borderRadius: 11, background: "#c9793a", color: "#fff", fontFamily: "inherit", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>收進收藏櫃</button>
                ) : (
                  <button onClick={() => dry(r.id)} style={{ flexShrink: 0, height: 34, padding: "0 12px", border: "1px dashed #c9bd9d", borderRadius: 11, background: "rgba(255,255,255,.6)", color: "#8a7659", fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⏩ 曬乾</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px dashed #c3d2a8", borderRadius: 18, padding: 22, textAlign: "center", color: "#7f9068" }}>
            <p style={{ fontSize: 13, margin: 0 }}>晾曬架空空的。<br />採一朵花放上來，明天就有香香的湯料了。</p>
          </div>
        )}
      </div>

      {/* 香料收藏櫃（共用） */}
      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={sectionLabel}>香料收藏櫃 · {pantryCount} / {pantry.length} 種</p>
          <span style={{ fontSize: 11, color: "#a08a68" }}>全部畫面共用的收藏</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {pantry.map((i) => (
            <div key={i.slug} style={{ display: "flex", alignItems: "center", gap: 13, background: i.collected ? "#fff" : "#f6f1e4", border: `1px solid ${i.collected ? "#ecdcb8" : "#e4dcc6"}`, borderRadius: 16, padding: "12px 14px" }}>
              {i.collected && i.photo ? (
                <span style={{ width: 44, height: 44, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PhotoImg photoId={i.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", filter: STICKER_OUTLINE }} />
                </span>
              ) : (
                <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: 11, background: i.tile, opacity: i.collected ? 1 : 0.4, display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 15, color: i.collected ? "#fff" : "rgba(90,70,50,.5)" }}>{i.collected ? i.glyph : "?"}</span>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 14, margin: 0, color: i.collected ? "#3a2f22" : "#a89880" }}>{i.collected ? i.name : "？？？"}</p>
                <p style={{ fontSize: 11.5, color: i.collected ? "#5b7a3f" : "#a89880", margin: "2px 0 0", fontWeight: 600 }}>{i.collected ? `找到過 ${i.count} 次` : `在${i.place}採得到`}</p>
              </div>
              {i.collected ? <span style={{ flexShrink: 0, fontSize: 10, color: "#5b7a3f", fontWeight: 700, background: "#e9f2e6", borderRadius: 999, padding: "3px 9px" }}>✓ 已收藏</span> : null}
            </div>
          ))}
        </div>
        <p style={{ fontSize: 11.5, color: "#8a7659", margin: "11px 2px 0" }}>收藏只增不減；煮湯用的是本週食譜，不會清掉這裡。</p>
      </div>

      <p style={footNote}>好的湯料，急不得。<br />這裡教的，是照顧一朵花，然後等它。</p>

      {/* 去背預覽：採花照拍完先去背、選去背貼紙或原圖，決定後才存 */}
      {pendingFile ? (
        <PhotoCutoutSheet
          file={pendingFile}
          label={GD_FLOWER.name}
          onConfirm={async (blob) => {
            const id = await savePhoto(blob);
            setPhotoId(id);
            setPendingFile(null);
          }}
          onCancel={() => setPendingFile(null)}
        />
      ) : null}
    </div>
  );
}

// ═══════════ 3.3 森林觀察站 ═══════════
function Station({ week, progress, mat, matDone, cooked, onClose, onOpenGather, onGoPot, onGoBook }: { week: WeekBundle; progress: WeekProgress; mat: number; matDone: boolean; cooked: boolean; onClose: () => void; onOpenGather: () => void; onGoPot: () => void; onGoBook: () => void }) {
  const [treeIdx, setTreeIdx] = useState(0);
  const stBtn = !matDone ? (mat === 0 ? "出發去找" : `繼續找 · 還差 ${3 - mat} 樣`) : !cooked ? "材料齊了，去湯鍋" : "這鍋湯煮好了，看紀念冊";
  const stGo = !matDone ? onOpenGather : !cooked ? onGoPot : onGoBook;
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#dbe2cc 0%,#f4ead2 42%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#7f8f5f" name="森林觀察站" sub="每次冒險，從這裡出發" />

      <div style={{ margin: "18px 16px 0", ...cardBox, borderRadius: 22, padding: 18, boxShadow: "0 12px 30px -18px rgba(90,60,30,.5)", animation: "nvIn .4s ease-out" }}>
        <p style={sectionLabel}>森林路徑圖 · 本週的湯</p>
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 19, margin: "6px 0 0", color: "#3a2f22" }}>{week.soupName}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
          {week.ingredients.map((m, i) => {
            const found = !!progress.found[i];
            return (
              <div key={m.slug} style={{ display: "flex", alignItems: "center", gap: 12, background: found ? "#f1f2e3" : "#fffcf3", border: `1px solid ${found ? "#ccd8b8" : "#ecdcb8"}`, borderRadius: 16, padding: "11px 13px" }}>
                <span style={{ width: 40, height: 40, flexShrink: 0, borderRadius: "50%", background: found ? "#8faa77" : m.gradient, display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 15, color: "#fff" }}>{m.glyph}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...serifTC, fontWeight: 700, fontSize: 14, margin: 0, color: found ? "#7a8f5f" : "#3a2f22" }}>{m.name}</p>
                  {!found ? <p style={{ fontSize: 11.5, color: "#8a7659", margin: "2px 0 0", lineHeight: 1.6 }}>{m.guide}</p> : null}
                </div>
                {found ? <span style={{ flexShrink: 0, fontSize: 10, color: "#5b7a3f", fontWeight: 700, background: "#e9f2e6", borderRadius: 999, padding: "3px 9px" }}>✓ 找到了</span> : null}
              </div>
            );
          })}
        </div>
        <button onClick={stGo} style={{ marginTop: 15, width: "100%", height: 48, border: "none", borderRadius: 14, background: GREEN, color: "#faf4e6", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 24px -10px rgba(45,90,65,.55)" }}>{stBtn}</button>
      </div>

      {/* 低語大樹 */}
      <div style={{ margin: "22px 16px 0" }}>
        <p style={{ ...sectionLabel, margin: "0 0 10px" }}>小屋旁的低語大樹</p>
        <button onClick={() => setTreeIdx((i) => (i + 1) % TREE_LINES.length)} style={{ width: "100%", border: "none", background: "transparent", cursor: "pointer", padding: 0, fontFamily: "inherit", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 12 }}>
          <span style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle at 40% 30%,#8fae72,#4f7a44)", display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 20, color: "#eaf2dc", boxShadow: "0 6px 14px -6px rgba(40,80,30,.5)", animation: "nvSway 4.2s ease-in-out infinite" }}>樹</span>
          <span style={{ flex: 1, display: "block", background: "#f3f0e0", borderRadius: "4px 18px 18px 18px", padding: "14px 16px", boxShadow: "0 10px 26px -18px rgba(70,90,40,.5)" }}>
            <span style={{ display: "block", ...serifTC, fontWeight: 600, fontSize: 14.5, color: "#4a5238", lineHeight: 1.8 }}>{TREE_LINES[treeIdx % TREE_LINES.length]}</span>
          </span>
        </button>
      </div>
    </div>
  );
}

// ═══════════ 3.4 湯湯小河 ═══════════
function River({ onClose }: { onClose: () => void }) {
  const [river, setRvState] = useState<RiverState | null>(() => loadRiver());
  const pull = () => {
    if (!river) return;
    const r = { ...river, caught: true };
    setRiver(r);
    setRvState(r);
  };
  const tomorrow = () => setRvState(riverTomorrow(river));
  const item = river ? RIVER_ITEMS[river.idx] : null;
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#d3e2dd 0%,#f4ead2 46%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#4a7f95" name="湯湯小河" sub="水聲嘩啦啦的地方" />

      {river && !river.caught ? (
        <div style={{ margin: "20px 16px 0", background: "linear-gradient(180deg,#bcd8d2,#9fc4bc)", borderRadius: 24, padding: "26px 20px 22px", boxShadow: "0 14px 32px -18px rgba(40,90,80,.6)", textAlign: "center", animation: "nvIn .4s ease-out" }}>
          <span style={{ display: "inline-flex", width: 74, height: 58, borderRadius: 12, background: "#c9995f", boxShadow: "0 10px 22px -10px rgba(60,40,20,.6)", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 13, color: "#fff8ea", animation: "nvSway 3s ease-in-out infinite" }}>？</span>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, color: "#2e4a44", margin: "16px 0 0" }}>河上漂來了一個小盒子</p>
          <button onClick={pull} style={{ marginTop: 14, height: 48, padding: "0 30px", border: "none", borderRadius: 14, background: "#4a7f95", color: "#f0f6f4", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 10px 24px -10px rgba(30,70,90,.6)" }}>拉繩子，撈上來</button>
        </div>
      ) : null}

      {river && river.caught && item ? (
        <div style={{ margin: "20px 16px 0", background: "#fffcf3", border: "1px solid #ecdcb8", borderRadius: 24, padding: "26px 20px 24px", boxShadow: "0 14px 32px -20px rgba(90,60,30,.5)", textAlign: "center", animation: "nvIn .4s ease-out" }}>
          <span style={{ display: "inline-flex", width: 72, height: 72, borderRadius: "50%", background: item.color, alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 26, color: "#fff", boxShadow: "0 10px 24px -10px rgba(60,40,20,.5)" }}>{item.glyph}</span>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 19, color: "#3a2f22", margin: "14px 0 0" }}>{item.name}</p>
          <p style={{ fontSize: 13.5, color: "#8a7659", margin: "8px 0 0", fontStyle: "italic" }}>{item.line}</p>
          <p style={{ fontSize: 12, color: "#a89e8c", margin: "18px 0 0", lineHeight: 1.8 }}>河水靜靜地流。<br />明天，會漂來新的東西。</p>
          <button onClick={tomorrow} style={{ marginTop: 14, height: 34, padding: "0 14px", border: "1px dashed #c9bd9d", borderRadius: 11, background: "rgba(255,255,255,.6)", color: "#8a7659", fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⏩ 明天</button>
        </div>
      ) : null}

      <p style={footNote}>撿到的，都是河流想送你的。</p>
    </div>
  );
}

// ═══════════ 3.5 熟成室 ═══════════
function Shed({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [jars, setJars] = useState<ShedJar[]>(() => getShedJars());
  const persist = (next: ShedJar[]) => { setJars(next); setShedJars(next); };
  const add = () => {
    const sc = SH_SCENTS[jars.length % SH_SCENTS.length];
    persist([...jars, { ...sc, ready: false }]);
  };
  const ripen = (i: number) => persist(jars.map((j, k) => (k === i ? { ...j, ready: true } : j)));
  const collect = (i: number) => { persist(jars.filter((_, k) => k !== i)); onToast("熟成的香味，收進收藏櫃了"); };
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#e3d2b4 0%,#f4ead2 44%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#a9793f" name="熟成室" sub="香味慢慢長大的房間" />

      <div style={{ margin: "18px 16px 0", ...cardBox }}>
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "#3a2f22" }}>裝一罐香味</p>
        <p style={{ fontSize: 13, color: "#5b4a35", margin: "7px 0 0", lineHeight: 1.75 }}>把一種香味裝進玻璃罐，放在架上過一夜，<br />它就會慢慢長大、變得更濃。</p>
        <button onClick={add} style={{ marginTop: 14, width: "100%", height: 46, border: "none", borderRadius: 14, background: "#b5763a", color: "#fff", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(120,70,20,.6)" }}>裝一罐</button>
      </div>

      <div style={{ margin: "24px 16px 0" }}>
        <p style={{ ...sectionLabel, margin: "0 0 10px" }}>熟成架</p>
        {jars.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {jars.map((j, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 13, background: "#fffcf3", border: "1px solid #ecdcb8", borderRadius: 18, padding: "13px 15px", boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)", animation: "nvIn .4s ease-out" }}>
                <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: "12px 12px 16px 16px", background: j.color, display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 15, color: "#fff", boxShadow: "inset 0 3px 0 rgba(255,255,255,.4)" }}>{j.glyph}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "#3a2f22" }}>{j.ready ? `熟成的${j.name}` : j.name}</p>
                  <p style={{ fontSize: 11.5, color: j.ready ? "#5b7a3f" : "#a9793f", margin: "2px 0 0", fontWeight: 600 }}>{j.ready ? "香味長大了！" : "熟成中…罐子裡有小小的咕嘟聲"}</p>
                </div>
                {j.ready ? (
                  <button onClick={() => collect(i)} style={{ flexShrink: 0, height: 34, padding: "0 13px", border: "none", borderRadius: 11, background: "#c9793a", color: "#fff", fontFamily: "inherit", fontSize: 11.5, fontWeight: 700, cursor: "pointer" }}>收下</button>
                ) : (
                  <button onClick={() => ripen(i)} style={{ flexShrink: 0, height: 34, padding: "0 12px", border: "1px dashed #c9bd9d", borderRadius: 11, background: "rgba(255,255,255,.6)", color: "#8a7659", fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⏩ 一夜過去</button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px dashed #d4bd94", borderRadius: 18, padding: 22, textAlign: "center", color: "#a08a68" }}>
            <p style={{ fontSize: 13, margin: 0 }}>架上還空著。<br />裝一罐香味，讓它慢慢長大。</p>
          </div>
        )}
      </div>

      <p style={footNote}>好香味都是等出來的。<br />波飛會替你看著爐火。</p>
    </div>
  );
}

// ═══════════ 3.6 森林郵局 ═══════════
function Post({ onClose, onToast }: { onClose: () => void; onToast: (m: string) => void }) {
  const [letters, setLettersState] = useState<Letter[]>(() => getLetters());
  const [to, setTo] = useState<string | null>(null);
  const [text, setText] = useState("");
  const send = () => {
    if (!to) { onToast("先選一位朋友"); return; }
    const next = [{ to, text: text.trim(), replied: false }, ...letters];
    setLetters(next);
    setLettersState(next);
    setTo(null);
    setText("");
  };
  const arrive = (i: number) => {
    const next = letters.map((l, k) => (k === i ? { ...l, replied: true } : l));
    setLetters(next);
    setLettersState(next);
  };
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#ecdcb8 0%,#f4ead2 44%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#a9793f" name="森林郵局" sub="寄信、說心事，等森林回信" />

      <div style={{ margin: "18px 16px 0", ...cardBox }}>
        <p style={{ fontSize: 12, color: "#8a7659", margin: "0 0 9px" }}>寄給誰？</p>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {PO_CHARS.map((name) => {
            const on = to === name;
            return <button key={name} onClick={() => setTo(name)} style={{ border: `1px solid ${on ? "#c9793a" : "#e0cfa8"}`, background: on ? "#c9793a" : "#fff", color: on ? "#fff" : "#5b4a35", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 999, cursor: "pointer" }}>{name}</button>;
          })}
        </div>
        <p style={{ fontSize: 12, color: "#8a7659", margin: "16px 0 8px" }}>想說的話（畫的卡片也可以之後貼上）</p>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="親愛的朋友……" style={{ width: "100%", boxSizing: "border-box", height: 46, border: "1px solid #e0cfa8", borderRadius: 13, background: "#fff", padding: "0 14px", fontFamily: "inherit", fontSize: 14, color: "#3a2f22", outline: "none" }} />
        <button onClick={send} style={{ marginTop: 13, width: "100%", height: 46, border: "none", borderRadius: 14, background: "#c9793a", color: "#fff", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(140,80,30,.6)" }}>投進信箱</button>
      </div>

      {letters.length > 0 ? (
        <div style={{ margin: "24px 16px 0" }}>
          <p style={{ ...sectionLabel, margin: "0 0 10px" }}>寄出去的信</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {letters.map((l, i) => (
              <div key={i} style={{ background: "#fffcf3", border: "1px solid #ecdcb8", borderRadius: 18, padding: "14px 16px", boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)", animation: "nvIn .4s ease-out" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <p style={{ flex: 1, ...serifTC, fontWeight: 700, fontSize: 14.5, margin: 0, color: "#3a2f22" }}>給 {l.to}</p>
                  {!l.replied ? <button onClick={() => arrive(i)} style={{ flexShrink: 0, height: 32, padding: "0 12px", border: "1px dashed #c9bd9d", borderRadius: 11, background: "rgba(255,255,255,.6)", color: "#8a7659", fontFamily: "inherit", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>⏩ 回信到了</button> : null}
                </div>
                {l.text ? <p style={{ fontSize: 12.5, color: "#8a7659", margin: "6px 0 0" }}>「{l.text}」</p> : null}
                {!l.replied ? <p style={{ fontSize: 11.5, color: "#a9793f", margin: "8px 0 0", fontWeight: 600 }}>信在路上，Pipit 正飛過湯湯小河…</p> : null}
                {l.replied ? (
                  <div style={{ marginTop: 10, background: "#f6ecd6", borderRadius: "4px 14px 14px 14px", padding: "11px 14px" }}>
                    <p style={{ fontSize: 13, color: "#5b4a35", margin: 0, lineHeight: 1.7 }}><b>{l.to}</b>：{PO_REPLIES[l.to] || "森林收到了。"}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

// ═══════════ 3.7 湯料魔法研究所 ═══════════
function Lab({ onClose }: { onClose: () => void }) {
  const [pick, setPick] = useState<number[]>([]);
  const [result, setResult] = useState<{ name: string; line: string; c1: string; c2: string } | null>(null);
  const toggle = (i: number) => {
    if (pick.includes(i)) setPick(pick.filter((k) => k !== i));
    else if (pick.length < 2) setPick([...pick, i]);
  };
  const shake = () => {
    if (pick.length < 2) return;
    const a = LAB_SCENTS[pick[0]];
    const b = LAB_SCENTS[pick[1]];
    setResult({ name: a.adj + b.n + "湯液", line: LAB_LINES[Math.floor(Math.random() * LAB_LINES.length)], c1: a.c, c2: b.c });
  };
  const again = () => { setResult(null); setPick([]); };
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#ddd4e6 0%,#f4ead2 44%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#7a6a95" name="湯料魔法研究所" sub="里洛的實驗室，沒有失敗這回事" />

      {!result ? (
        <div style={{ margin: "18px 16px 0", ...cardBox }}>
          <p style={{ fontSize: 12, color: "#8a7659", margin: "0 0 9px" }}>挑兩種香味</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {LAB_SCENTS.map((s, i) => {
              const on = pick.includes(i);
              return <button key={s.n} onClick={() => toggle(i)} style={{ border: `1.5px solid ${on ? s.c : "#e0cfa8"}`, background: on ? s.c : "#fff", color: on ? "#3a2f22" : "#5b4a35", fontFamily: "inherit", fontSize: 13, fontWeight: 700, padding: "8px 13px", borderRadius: 999, cursor: "pointer" }}>{s.n}</button>;
            })}
          </div>
          <button onClick={shake} disabled={pick.length !== 2} style={{ marginTop: 16, width: "100%", height: 48, border: "none", borderRadius: 14, background: pick.length === 2 ? "#7a6a95" : "#d5cbb2", color: "#fff", ...serifTC, fontWeight: 700, fontSize: 15, cursor: pick.length === 2 ? "pointer" : "default", boxShadow: "0 8px 18px -8px rgba(70,50,110,.5)" }}>搖一搖！</button>
        </div>
      ) : (
        <div style={{ margin: "18px 16px 0", background: "#fffcf3", border: "1px solid #ecdcb8", borderRadius: 24, padding: "26px 20px 24px", boxShadow: "0 14px 32px -20px rgba(90,60,30,.5)", textAlign: "center", animation: "nvIn .4s ease-out" }}>
          <span style={{ display: "inline-block", width: 64, height: 86, borderRadius: "14px 14px 22px 22px", background: `linear-gradient(160deg,${result.c1},${result.c2})`, boxShadow: "inset 0 4px 0 rgba(255,255,255,.5),0 12px 26px -12px rgba(60,40,80,.5)", animation: "nvSway 2.6s ease-in-out infinite" }} />
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 19, color: "#3a2f22", margin: "14px 0 0" }}>{result.name}</p>
          <p style={{ fontSize: 13.5, color: "#8a7659", margin: "8px 0 0", fontStyle: "italic" }}>{result.line}</p>
          <button onClick={again} style={{ marginTop: 16, height: 46, padding: "0 26px", border: "none", borderRadius: 14, background: "#7a6a95", color: "#f4f0fa", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(70,50,110,.6)" }}>再調一罐</button>
        </div>
      )}

      <p style={footNote}>里洛說：每一種味道，<br />都值得被認真地聞一聞。</p>
    </div>
  );
}

// ═══════════ 3.8 魔法湯譜石 ═══════════
function Stone({ weekCards, cookedWeeks, onClose, onOpenStory, onToast }: { weekCards: WeekCardInfo[]; cookedWeeks: number[]; onClose: () => void; onOpenStory: () => void; onToast: (m: string) => void }) {
  const [sel, setSel] = useState<number | null>(null);
  const litSet = new Set(cookedWeeks);
  const selCard = sel != null ? weekCards.find((c) => c.weekNumber === sel) : null;
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#d8d2dd 0%,#f4ead2 46%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#7a6a95" name="魔法湯譜石" sub="每煮好一鍋湯，石頭就亮起一塊紋樣" />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, margin: "20px 16px 0" }}>
        {weekCards.map((w) => {
          const lit = litSet.has(w.weekNumber);
          return (
            <button key={w.weekNumber} onClick={() => (lit ? setSel(w.weekNumber) : onToast("這塊石紋還在沉睡"))} style={{ border: "none", cursor: "pointer", background: lit ? "radial-gradient(circle at 40% 30%,#b9a7cf,#7a6a95)" : "#8d8578", opacity: lit ? 1 : 0.45, borderRadius: 18, aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, fontFamily: "inherit", padding: 8, boxShadow: "0 10px 24px -16px rgba(60,50,80,.6)", animation: "nvIn .4s ease-out" }}>
              <span style={{ ...serifTC, fontWeight: 700, fontSize: 24, color: "rgba(255,255,255,.95)" }}>{lit ? "湯" : "？"}</span>
              <span style={{ fontSize: 9.5, fontWeight: 700, color: "rgba(255,255,255,.85)", textAlign: "center", lineHeight: 1.4 }}>{lit ? w.soupName : `第 ${w.weekNumber} 週`}</span>
            </button>
          );
        })}
      </div>

      {selCard ? (
        <div style={{ margin: "22px 16px 0", background: "#fffcf3", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18, boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "nvIn .3s ease-out" }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#7a6a95", fontWeight: 700, margin: 0 }}>亮起的紋樣</p>
          <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, margin: "6px 0 0", color: "#3a2f22" }}>{selCard.soupName}</p>
          <p style={{ fontSize: 12.5, color: "#a9793f", margin: "4px 0 0", fontWeight: 600 }}>★ {selCard.badgeName}</p>
          <button onClick={onOpenStory} style={{ marginTop: 14, width: "100%", height: 46, border: "none", borderRadius: 14, background: "#7a6a95", color: "#f4f0fa", ...serifTC, fontWeight: 700, fontSize: 15, cursor: "pointer", boxShadow: "0 8px 18px -8px rgba(70,50,110,.6)" }}>再聽一次這段故事</button>
        </div>
      ) : null}

      <p style={footNote}>石頭記得每一鍋湯。<br />九塊紋樣都亮起來的那天，大家會在角色角等你。</p>
    </div>
  );
}

// ═══════════ 3.9 角色角 ═══════════
function Grove({ onClose }: { onClose: () => void }) {
  return (
    <div style={{ ...scroll("linear-gradient(180deg,#f0dfc8 0%,#f4ead2 40%)") }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "18px 16px 4px" }}>
        <BackBtn onClose={onClose} />
      </div>
      <Header accent="#a9793f" name="角色角" sub="大家的照片都貼在這面牆上" />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 14px", margin: "22px 20px 0" }}>
        {GROVE_CHARS.map((ch) => (
          <div key={ch.name} style={{ background: "#fffdf6", border: "1px solid #e8ddc2", borderRadius: 6, padding: "8px 8px 10px", boxShadow: "0 12px 26px -16px rgba(60,40,20,.55)", transform: `rotate(${ch.tilt})`, animation: "nvIn .4s ease-out" }}>
            <span style={{ display: "block", height: 128, borderRadius: 3, background: ch.avBg, position: "relative", overflow: "hidden" }}>
              {ch.isFina ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/handoff/fina-bust.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              ) : ch.isMilo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src="/images/handoff/milo-squirrel.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "62% 16%" }} />
              ) : (
                <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 32, color: "rgba(255,255,255,.95)" }}>{ch.glyph}</span>
              )}
            </span>
            <span style={{ display: "block", textAlign: "center", marginTop: 8, ...serifTC, fontWeight: 700, fontSize: 13.5, color: "#3a2f22" }}>{ch.name}</span>
            <span style={{ display: "block", textAlign: "center", fontSize: 10, color: "#a9793f", fontWeight: 600, marginTop: 1 }}>{ch.home}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
