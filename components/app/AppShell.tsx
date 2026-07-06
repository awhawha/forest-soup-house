"use client";

/**
 * 湯湯屋 v2 native app 外殼 — 四分頁 + 覆蓋層。規格 §3–§8。
 */
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ForestPlace, Resident, WeekBundle, WeekCardInfo } from "@/lib/weekly";
import {
  emptyProgress,
  firstUnfound,
  foundCount,
  getWeekProgress,
  setCooked,
  setCraftDone,
  setFound,
  setPrinted,
  setStoryDone,
  resetWeek as resetWeekProgress,
  cookedWeeksCount,
  type Capture,
} from "@/lib/client/weekProgress";
import { getProfile } from "@/lib/client/profile";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoImg } from "@/components/app/PhotoImg";
import { CaptureOverlay } from "@/components/app/CaptureOverlay";
import { CookRitual } from "@/components/app/CookRitual";

interface AppShellProps {
  week: WeekBundle;
  weekCards: WeekCardInfo[];
  residents: Resident[];
  places: ForestPlace[];
}

type Tab = "today" | "forest" | "pot" | "book";
interface RewardInfo {
  friend: Resident | null;
}

const GREEN = "#3f7a4a";

export function AppShell({ week, weekCards, residents, places }: AppShellProps) {
  const router = useRouter();
  const progress = useSoupState(() => getWeekProgress(week.weekNumber), emptyProgress());
  const profile = useSoupState(getProfile, null);
  const kidName = profile?.name ?? null;

  const [tab, setTab] = useState<Tab>("today");
  const [capture, setCapture] = useState<number | null>(null);
  const [cookOpen, setCookOpen] = useState(false);
  const [grownOpen, setGrownOpen] = useState(false);
  const [gateOpen, setGateOpen] = useState(false);
  const [gateQ, setGateQ] = useState<{ a: number; b: number; opts: number[] } | null>(null);
  const [reward, setReward] = useState<RewardInfo | null>(null);
  const [toast, setToastMsg] = useState("");

  const mat = foundCount(progress);
  const matDone = mat >= 3;
  const cooked = progress.cookedAt != null;
  const craft = progress.craftDone;
  const printed = progress.printedAt != null;

  const showToast = (m: string) => {
    setToastMsg(m);
    window.clearTimeout((showToast as unknown as { _t?: number })._t);
    (showToast as unknown as { _t?: number })._t = window.setTimeout(() => setToastMsg(""), 2200);
  };

  // ── 動作 ──
  const doStory = () => {
    if (!progress.storyDone) {
      setStoryDone(week.weekNumber);
      showToast("故事聽完了。隨時可以再聽一次。");
    } else {
      showToast("這週的故事聽過了，隨時可以再聽一次");
    }
  };
  const openGather = () => setCapture(Math.max(0, firstUnfound(progress)));
  const onFound = (i: number, cap: Capture) => setFound(week.weekNumber, i, cap);
  const capNext = () => {
    const n = firstUnfound(getWeekProgress(week.weekNumber));
    if (n === -1) {
      setCapture(null);
      setTab("today");
    } else {
      setCapture(n);
    }
  };
  const doCook = () => {
    if (!matDone) {
      openGather();
      return;
    }
    if (cooked) {
      setTab("book");
      return;
    }
    setCookOpen(true);
  };
  const onCooked = () => {
    setCooked(week.weekNumber); // 冪等；先寫 cookedAt 再開獎勵
    const c = cookedWeeksCount();
    const friend = residents.find((r) => r.unlockAtPot === c && r.slug !== "fina") ?? null;
    setCookOpen(false);
    setReward({ friend });
  };
  const doCraft = () => {
    if (!matDone) {
      showToast("先把三樣材料找齊，才能開始做手作");
      return;
    }
    if (!craft) {
      setCraftDone(week.weekNumber);
      showToast("手作完成！記得拍一張，收進作品牆");
    } else {
      showToast("這週的手作做完了");
    }
  };
  const doPrint = () => {
    if (!cooked) {
      showToast("煮好湯、拿到湯卡，才能印這週的紀念冊");
      return;
    }
    setPrinted(week.weekNumber);
    router.push("/print");
  };
  const doReset = () => {
    resetWeekProgress(week.weekNumber);
    setCapture(null);
    setCookOpen(false);
    setReward(null);
  };

  const openGrown = () => {
    const a = 2 + Math.floor(Math.random() * 4);
    const b = 3 + Math.floor(Math.random() * 4);
    setGateQ({ a, b, opts: [a + b, a + b + 2, a + b - 1].sort(() => Math.random() - 0.5) });
    setGateOpen(false);
    setGrownOpen(true);
  };
  const closeGrown = () => {
    setGrownOpen(false);
    setGateOpen(false);
    setGateQ(null);
  };

  const friendCount = 1 + cookedWeeksCount();

  // ── 主任務卡三段變身 ──
  const questSlots = week.ingredients.map((m, i) => {
    const f = progress.found[i];
    return { m, i, found: !!f, photoId: f?.kind === "photo" ? f.photoId : undefined };
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {/* ═══ 今天 ═══ */}
      {tab === "today" ? (
        <div key="today" style={tabScroll}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 20px 4px" }}>
            <div>
              <p style={{ fontSize: 10.5, letterSpacing: ".16em", color: "#a08a68", fontWeight: 700, margin: 0 }}>
                第 {week.weekNumber} 週 · 每週一換湯
              </p>
              <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 23, margin: "2px 0 0", color: "#3a2f22" }}>
                {kidName ? `${kidName}，歡迎回來` : "歡迎回到湯湯屋"}
              </h1>
            </div>
            <button onClick={openGrown} aria-label="大人的門" style={grownBtn}>
              ☰
            </button>
          </div>

          {/* hero */}
          <div style={{ margin: "14px 16px 0", borderRadius: 24, background: "#fbf5e6", boxShadow: "0 16px 40px -18px rgba(90,60,30,.5)", overflow: "hidden", animation: "nvIn .4s ease-out" }}>
            <div style={{ position: "relative", height: 150 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={week.image ?? "/images/handoff/fina-cooking.png"} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 26%" }} />
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,transparent 30%,rgba(30,22,10,.78) 100%)" }} />
              <div style={{ position: "absolute", left: "44%", top: 16, width: 12, height: 34, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "nvSteam 4.2s ease-in infinite" }} />
              <div style={{ position: "absolute", left: 18, bottom: 12, right: 18 }}>
                <p style={{ fontSize: 10, letterSpacing: ".18em", color: "#ffe9c0", fontWeight: 700, margin: 0 }}>本週的湯</p>
                <h2 style={{ ...serifTC, fontWeight: 700, fontSize: 23, color: "#fff", margin: "2px 0 0", textShadow: "0 2px 8px rgba(0,0,0,.5)" }}>{week.soupName}</h2>
              </div>
            </div>
            <div style={{ padding: "14px 16px 16px" }}>
              <button onClick={doStory} style={{ ...serifTC, ...primaryBtn }}>
                {progress.storyDone ? "再聽一次這週的故事" : "聽這週的故事"}
              </button>
            </div>
          </div>

          {/* 本週任務 */}
          <div style={{ padding: "22px 20px 8px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
            <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>本 週 任 務</p>
            <button onClick={doReset} style={demoBtn}>demo 重來</button>
          </div>
          <div style={{ padding: "0 20px 8px", display: "flex", flexDirection: "column", gap: 12 }}>
            {/* 主任務卡 */}
            <QuestCard
              matDone={matDone}
              mat={mat}
              cooked={cooked}
              printed={printed}
              soupName={week.soupName}
              slots={questSlots}
              onSlot={(i) => setCapture(i)}
              onAction={
                !matDone ? openGather : !cooked ? doCook : printed ? () => setTab("book") : doPrint
              }
            />
            {/* 手作卡 */}
            <button onClick={doCraft} style={{ ...craftRow(matDone, craft) }}>
              <span style={craftIcon(matDone, craft)}>{craft ? "✓" : "作"}</span>
              <span style={{ flex: 1, minWidth: 0, display: "block" }}>
                <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 14.5, color: matDone || craft ? "#3a2f22" : "#8a8068" }}>
                  做這週的手作
                </span>
                <span style={{ display: "block", fontSize: 11, color: "#8a7659", marginTop: 1 }}>
                  {craft ? "在作品牆" : matDone ? week.craftTitle : "先找齊材料再開始"}
                </span>
              </span>
              <span style={{ fontSize: 15, color: "#c2a97e" }}>›</span>
            </button>
          </div>
          <div style={{ height: 30 }} />
        </div>
      ) : null}

      {/* ═══ 森林 ═══ */}
      {tab === "forest" ? (
        <div key="forest" style={{ ...tabScroll, background: "linear-gradient(180deg,#e7edd8 0%,#f4ead2 60%)" }}>
          <div style={{ padding: "24px 20px 4px" }}>
            <p style={{ fontSize: 10.5, letterSpacing: ".16em", color: "#7f8f5f", fontWeight: 700, margin: 0 }}>魔法森林 · 隨時歡迎</p>
            <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 23, margin: "2px 0 0", color: "#3a2f22" }}>今天想去哪裡玩？</h1>
          </div>
          <div style={{ padding: "16px 16px 30px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {places.map((pl) => (
              <button
                key={pl.slug}
                onClick={() => (pl.isThisWeek ? openGather() : showToast(`到${pl.name}走走看看`))}
                style={{ border: "1px solid #e0dcbc", cursor: "pointer", background: "#fffcf3", borderRadius: 20, padding: 0, overflow: "hidden", textAlign: "left", fontFamily: "inherit", boxShadow: "0 10px 24px -18px rgba(60,80,40,.6)", animation: "nvIn .4s ease-out", position: "relative" }}
              >
                <span style={{ display: "block", height: 96, background: "#dde3ca", position: "relative" }}>
                  {pl.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pl.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ ...serifTC, position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 26, color: "#fff", background: "#c9995f" }}>{pl.glyph}</span>
                  )}
                  {pl.isThisWeek && !matDone ? (
                    <span style={{ position: "absolute", top: 8, right: 8, fontSize: 9.5, fontWeight: 700, color: "#fff", background: "#c47a3a", borderRadius: 999, padding: "2px 8px" }}>本週要找</span>
                  ) : null}
                  {pl.friendImage ? (
                    <span style={{ position: "absolute", left: 8, bottom: -12, width: 30, height: 30, borderRadius: "50%", overflow: "hidden", border: "2px solid #fffcf3", boxShadow: "0 3px 8px -3px rgba(60,40,20,.6)" }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={pl.friendImage} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </span>
                  ) : null}
                </span>
                <span style={{ display: "block", padding: "14px 13px 13px" }}>
                  <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 15, color: "#3a2f22" }}>{pl.name}</span>
                  <span style={{ display: "block", fontSize: 10.5, color: "#8a7659", marginTop: 2 }}>{pl.sub}</span>
                  <span style={{ display: "inline-block", marginTop: 8, fontSize: 10, fontWeight: 700, color: "#5b7a3f", background: "#eef2df", borderRadius: 999, padding: "3px 9px" }}>
                    {pl.isThisWeek ? "本週採集" : "來走走"}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      {/* ═══ 湯鍋 ═══ */}
      {tab === "pot" ? (
        <div key="pot" style={tabScroll}>
          <div style={{ padding: "24px 20px 4px" }}>
            <p style={{ fontSize: 10.5, letterSpacing: ".16em", color: "#a08a68", fontWeight: 700, margin: 0 }}>動手做</p>
            <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 23, margin: "2px 0 0", color: "#3a2f22" }}>湯鍋</h1>
          </div>
          <div style={{ margin: "14px 16px 0", borderRadius: 22, background: "#fbf5e6", border: "1px solid #e6d8b4", boxShadow: "0 12px 30px -18px rgba(90,60,30,.5)", padding: "18px 18px 20px", animation: "nvIn .4s ease-out" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
              <span style={{ width: 64, height: 64, flexShrink: 0, borderRadius: 16, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/handoff/soup-pot.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <div>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "#3a2f22" }}>{week.soupName}</p>
                <p style={{ fontSize: 11.5, color: "#8a7659", margin: "2px 0 0" }}>
                  {matDone ? (cooked ? "這週煮好了" : "材料齊了，可以開火") : "先出門找齊 3 樣材料"}
                </p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {questSlots.map(({ m, i, found, photoId }) => (
                <button key={i} onClick={() => setCapture(i)} style={potSlot(found)}>
                  {found ? (
                    <span style={{ width: 34, height: 34, flexShrink: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px #fffbf0", display: "flex", alignItems: "center", justifyContent: "center", background: m.gradient }}>
                      <PhotoImg
                        photoId={photoId}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                        fallback={<span style={{ ...serifTC, fontWeight: 700, fontSize: 14, color: "#fff" }}>{m.glyph}</span>}
                      />
                    </span>
                  ) : (
                    <span style={{ ...serifTC, fontWeight: 700, fontSize: 18, color: "#b3a37f" }}>{m.glyph}</span>
                  )}
                  <span style={{ fontSize: 10, fontWeight: 700, color: found ? "#5b7a3f" : "#b3a37f" }}>{found ? "找到了" : "去找"}</span>
                </button>
              ))}
            </div>
            <button
              onClick={doCook}
              style={{ ...serifTC, width: "100%", border: "none", cursor: "pointer", height: 54, borderRadius: 16, background: matDone && !cooked ? GREEN : cooked ? "#8a9a72" : "#b3a888", color: "#faf4e6", fontWeight: 700, fontSize: 16.5, boxShadow: "0 10px 26px -10px rgba(45,90,65,.5)" }}
            >
              {cooked ? "煮好了 · 看湯卡" : matDone ? "開始煮湯" : "材料還沒齊 · 先出門搜集"}
            </button>
          </div>
          <div style={{ padding: "24px 20px 30px" }}>
            <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 10px" }}>本週手作</p>
            <button onClick={doCraft} style={rowBtn}>
              <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/handoff/card-soup-making.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <span style={{ flex: 1, display: "block" }}>
                <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 14.5, color: "#3a2f22" }}>{craft ? "這週的手作完成了" : week.craftTitle}</span>
                <span style={{ display: "block", fontSize: 11.5, color: "#8a7659", marginTop: 2 }}>{craft ? "拍下來的作品在作品牆" : matDone ? week.craftDescription.slice(0, 22) : "先找齊材料再開始"}</span>
              </span>
              <span style={{ fontSize: 15, color: "#c2a97e" }}>›</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* ═══ 紀念冊 ═══ */}
      {tab === "book" ? (
        <div key="book" style={tabScroll}>
          <div style={{ padding: "24px 20px 4px" }}>
            <p style={{ fontSize: 10.5, letterSpacing: ".16em", color: "#a08a68", fontWeight: 700, margin: 0 }}>我們的收藏</p>
            <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 23, margin: "2px 0 0", color: "#3a2f22" }}>
              {kidName ? `${kidName}的湯譜紀念冊` : "我們的湯譜紀念冊"}
            </h1>
          </div>
          <div style={{ padding: "16px 20px 0" }}>
            <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 10px" }}>湯 卡 · 一週一張</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {weekCards.slice(0, 4).map((card) => {
                const isThis = card.weekNumber === week.weekNumber;
                const owned = isThis ? cooked : false;
                return (
                  <button
                    key={card.themeSlug}
                    onClick={() => (owned ? showToast("這張湯卡是你的了") : showToast(isThis ? "煮好這鍋湯，湯卡就是你的" : "每週一揭曉"))}
                    style={{ border: `1px solid ${owned ? "#ecdcb8" : "#e8ddbe"}`, cursor: "pointer", background: owned ? "#fff" : "#faf6ea", borderRadius: 18, padding: 0, overflow: "hidden", textAlign: "left", fontFamily: "inherit", animation: "nvIn .4s ease-out" }}
                  >
                    <span style={{ display: "block", height: 86, background: "#f0e8d2", position: "relative" }}>
                      {owned && card.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={card.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: "#c2b18c" }}>?</span>
                      )}
                    </span>
                    <span style={{ display: "block", padding: "10px 12px 12px" }}>
                      <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 13.5, color: owned ? "#3a2f22" : "#a0906c" }}>
                        {isThis || owned ? card.soupName : `第 ${card.weekNumber} 週的湯`}
                      </span>
                      <span style={{ display: "block", fontSize: 10.5, color: "#a08a68", marginTop: 2 }}>
                        {owned ? `已煮好 · ★ ${card.badgeName}` : isThis ? `第 ${card.weekNumber} 週 · 煮好湯就有` : "每週一揭曉"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          <div style={{ padding: "22px 20px 30px", display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={doPrint} style={rowBtn}>
              <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, background: "#b5763a", display: "flex", alignItems: "center", justifyContent: "center", ...serifTC, fontWeight: 700, fontSize: 16, color: "#fff" }}>印</span>
              <span style={{ flex: 1, display: "block" }}>
                <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 14.5, color: "#3a2f22" }}>列印湯譜紀念冊</span>
                <span style={{ display: "block", fontSize: 11.5, color: "#8a7659", marginTop: 2 }}>{cooked ? "把這一週印成一頁，貼在家裡" : "煮好湯之後就能印"}</span>
              </span>
              <span style={{ fontSize: 15, color: "#c2a97e" }}>›</span>
            </button>
            <button onClick={() => showToast("作品牆：手作照片、採集到的世界（接下來會做）")} style={rowBtn}>
              <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/handoff/card-soup-collection.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <span style={{ flex: 1, display: "block" }}>
                <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 14.5, color: "#3a2f22" }}>作品牆</span>
                <span style={{ display: "block", fontSize: 11.5, color: "#8a7659", marginTop: 2 }}>手作照片、採集到的世界，都在這裡</span>
              </span>
              <span style={{ fontSize: 15, color: "#c2a97e" }}>›</span>
            </button>
            <button onClick={() => showToast(`朋友圖鑑：認識了 ${friendCount} 位`)} style={rowBtn}>
              <span style={{ width: 42, height: 42, flexShrink: 0, borderRadius: 12, overflow: "hidden" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/handoff/fina-bust.png" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <span style={{ flex: 1, display: "block" }}>
                <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 14.5, color: "#3a2f22" }}>朋友圖鑑 · 認識了 {friendCount} 位</span>
                <span style={{ display: "block", fontSize: 11.5, color: "#8a7659", marginTop: 2 }}>每完成一週任務，就認識一位新朋友</span>
              </span>
              <span style={{ fontSize: 15, color: "#c2a97e" }}>›</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* ═══ Tab bar ═══ */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 86, background: "rgba(251,245,230,.96)", backdropFilter: "blur(10px)", borderTop: "1px solid #e6d8b4", display: "grid", gridTemplateColumns: "repeat(4,1fr)", padding: "8px 8px 20px", boxSizing: "border-box", zIndex: 20 }}>
        {([
          { id: "today", glyph: "今", label: "今天", dot: false },
          { id: "forest", glyph: "森", label: "森林", dot: false },
          { id: "pot", glyph: "鍋", label: "湯鍋", dot: matDone && !cooked },
          { id: "book", glyph: "冊", label: "紀念冊", dot: cooked && !printed },
        ] as const).map((tb) => {
          const active = tab === tb.id;
          return (
            <button key={tb.id} onClick={() => { setTab(tb.id); closeGrown(); }} style={{ border: "none", background: "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 3, fontFamily: "inherit", padding: 0, position: "relative" }}>
              {tb.dot ? <span style={{ position: "absolute", top: 2, right: "26%", width: 8, height: 8, borderRadius: "50%", background: "#c47a3a" }} /> : null}
              <span style={{ ...serifTC, width: 44, height: 30, borderRadius: 999, background: active ? "#e4d6ae" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: active ? "#3a2f22" : "#a0906c", transition: "background .2s" }}>{tb.glyph}</span>
              <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#3a2f22" : "#a0906c" }}>{tb.label}</span>
            </button>
          );
        })}
      </div>

      {/* ═══ 覆蓋層 ═══ */}
      {capture !== null ? (
        <CaptureOverlay
          key={capture}
          material={week.ingredients[capture]}
          materials={week.ingredients}
          index={capture}
          progress={progress}
          onFound={onFound}
          onNext={capNext}
          onClose={() => setCapture(null)}
        />
      ) : null}

      {cookOpen ? (
        <CookRitual
          materials={week.ingredients}
          photoIds={progress.found.map((f) => (f?.kind === "photo" ? (f.photoId ?? null) : null))}
          soupName={week.soupName}
          onCooked={onCooked}
          onClose={() => setCookOpen(false)}
        />
      ) : null}

      {reward ? (
        <RewardModal soupName={week.soupName} badgeName={week.badgeName} friend={reward.friend} onClose={() => setReward(null)} />
      ) : null}

      {grownOpen ? (
        <GrownGate
          gateOpen={gateOpen}
          gateQ={gateQ}
          kidName={kidName}
          onPass={() => setGateOpen(true)}
          onWrong={() => showToast("再試一次")}
          onClose={closeGrown}
          onRow={(m) => showToast(m)}
          onPrint={doPrint}
        />
      ) : null}

      {toast ? (
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 104, zIndex: 70, background: "rgba(58,47,34,.94)", color: "#f4ead2", borderRadius: 14, padding: "12px 16px", fontSize: 12.5, textAlign: "center", animation: "nvIn .25s ease-out", pointerEvents: "none" }}>
          {toast}
        </div>
      ) : null}
    </div>
  );
}

// ═══════════ 子元件 ═══════════

const tabScroll: React.CSSProperties = { position: "absolute", inset: "0 0 86px", overflowY: "auto", animation: "nvFade .25s ease-out" };
const grownBtn: React.CSSProperties = { width: 44, height: 44, borderRadius: "50%", border: "1.5px dashed #cdbb94", background: "rgba(255,251,240,.7)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, color: "#8a7659", padding: 0 };
const primaryBtn: React.CSSProperties = { width: "100%", border: "none", cursor: "pointer", height: 54, borderRadius: 16, background: GREEN, color: "#faf4e6", fontWeight: 700, fontSize: 16.5, boxShadow: "0 12px 30px -10px rgba(45,90,65,.55)" };
const demoBtn: React.CSSProperties = { border: "1px dashed #cdbb94", background: "transparent", cursor: "pointer", fontFamily: "inherit", fontSize: 10, color: "#8a7659", borderRadius: 999, padding: "3px 10px" };
const rowBtn: React.CSSProperties = { display: "flex", alignItems: "center", gap: 13, width: "100%", textAlign: "left", border: "1px solid #ecdcb8", cursor: "pointer", background: "#fff", borderRadius: 16, padding: "13px 15px", fontFamily: "inherit" };

function potSlot(found: boolean): React.CSSProperties {
  return { border: `2px dashed ${found ? "#8faa77" : "#ddcfa8"}`, borderRadius: 14, background: found ? "#eef2df" : "#faf6ea", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4, height: 76, cursor: "pointer", fontFamily: "inherit", padding: 0 };
}
function craftRow(matDone: boolean, craft: boolean): React.CSSProperties {
  return { display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", border: `1.5px solid ${craft ? "#ccd8b8" : matDone ? "#e3cf9e" : "#e8ddbe"}`, cursor: "pointer", background: craft ? "#f1f2e3" : matDone ? "#fffcf3" : "#f6f0dd", borderRadius: 16, padding: "12px 14px", fontFamily: "inherit", opacity: matDone || craft ? 1 : 0.62, minHeight: 60 };
}
function craftIcon(matDone: boolean, craft: boolean): React.CSSProperties {
  return { ...serifTC, width: 38, height: 38, flexShrink: 0, borderRadius: "50%", background: craft ? GREEN : matDone ? "#fff" : "#eee6d0", border: `2px solid ${craft ? GREEN : matDone ? GREEN : "#d5c9a6"}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15, color: craft ? "#faf4e6" : matDone ? GREEN : "#b3a37f" };
}

function QuestCard({
  matDone, mat, cooked, printed, soupName, slots, onSlot, onAction,
}: {
  matDone: boolean; mat: number; cooked: boolean; printed: boolean; soupName: string;
  slots: { m: WeekBundle["ingredients"][number]; i: number; found: boolean; photoId?: string }[];
  onSlot: (i: number) => void; onAction: () => void;
}) {
  const stage = !matDone ? "mat" : !cooked ? "cook" : "done";
  const title = stage === "mat" ? "出門搜集材料" : stage === "cook" ? "一起煮這鍋湯" : "這鍋湯煮好了！";
  const sub = stage === "mat" ? "這鍋湯需要三樣東西" : stage === "cook" ? "材料齊了" : printed ? "紀念冊印好了" : "";
  const icon = stage === "done" ? "✓" : stage === "cook" ? "煮" : "採";
  const btn = stage === "mat" ? (mat === 0 ? "出門去！" : `繼續找 · 還差 ${3 - mat} 樣`) : stage === "cook" ? "開始煮湯" : printed ? "看紀念冊" : "列印湯譜紀念冊";
  const btnPrimary = !(stage === "done" && printed);

  return (
    <div key={`q-${stage}`} style={{ border: `1.5px solid ${cooked ? "#ccd8b8" : "#e3cf9e"}`, background: cooked ? "#f1f2e3" : "#fffcf3", borderRadius: 20, padding: 16, animation: "nvIn .35s ease-out", boxShadow: "0 12px 28px -18px rgba(90,60,30,.5)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ ...serifTC, width: 44, height: 44, flexShrink: 0, borderRadius: "50%", background: cooked ? GREEN : "#fff", border: `2px solid ${GREEN}`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 17, color: cooked ? "#faf4e6" : GREEN }}>{icon}</span>
        <span style={{ flex: 1, minWidth: 0, display: "block" }}>
          <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 16, color: "#3a2f22" }}>{title}</span>
          <span style={{ display: "block", fontSize: 11.5, color: "#8a7659", marginTop: 1 }}>{sub}</span>
        </span>
        {stage === "mat" ? <span style={{ flexShrink: 0, fontSize: 13, fontWeight: 700, color: "#5b7a3f" }}>{mat} / 3</span> : null}
      </div>

      {stage !== "done" ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 14 }}>
          {slots.map(({ m, i, found, photoId }) => (
            <button key={i} onClick={() => onSlot(i)} style={{ border: `2px dashed ${found ? "#8faa77" : "#ddcfa8"}`, borderRadius: 12, background: found ? "#eef2df" : "#faf6ea", display: "flex", alignItems: "center", justifyContent: "center", gap: 5, height: 44, cursor: "pointer", fontFamily: "inherit", padding: 0 }}>
              {found ? (
                <span style={{ width: 24, height: 24, flexShrink: 0, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 2px #fffbf0", display: "flex", alignItems: "center", justifyContent: "center", background: m.gradient }}>
                  <PhotoImg photoId={photoId} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} fallback={<span style={{ ...serifTC, fontWeight: 700, fontSize: 12, color: "#fff" }}>{m.glyph}</span>} />
                </span>
              ) : (
                <span style={{ ...serifTC, fontWeight: 700, fontSize: 14, color: "#b3a37f" }}>{m.glyph}</span>
              )}
              <span style={{ fontSize: 10, fontWeight: 700, color: found ? "#5b7a3f" : "#b3a37f" }}>{found ? "找到了" : "去找"}</span>
            </button>
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 14, background: "#fffbf0", border: "1.5px solid #e3cf9e", borderRadius: 14, padding: "10px 12px", animation: "nvPop .5s ease-out" }}>
          <span style={{ width: 44, height: 44, flexShrink: 0, borderRadius: 10, overflow: "hidden", boxShadow: "0 4px 10px -4px rgba(120,80,30,.5)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/handoff/orange-card.png" alt="湯卡" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </span>
          <span style={{ flex: 1, display: "block" }}>
            <span style={{ display: "block", fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: "#a9793f" }}>獲得湯卡</span>
            <span style={{ ...serifTC, display: "block", fontWeight: 700, fontSize: 13.5, color: "#3a2f22" }}>{soupName}</span>
          </span>
        </div>
      )}

      <button onClick={onAction} style={{ ...serifTC, marginTop: 14, width: "100%", border: "none", cursor: "pointer", height: 50, borderRadius: 14, background: btnPrimary ? GREEN : "#e4d6ae", color: btnPrimary ? "#faf4e6" : "#5b4a35", fontWeight: 700, fontSize: 15.5, boxShadow: btnPrimary ? "0 10px 24px -10px rgba(45,90,65,.5)" : "none" }}>{btn}</button>
    </div>
  );
}

function RewardModal({ soupName, badgeName, friend, onClose }: { soupName: string; badgeName: string; friend: Resident | null; onClose: () => void }) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 60, display: "flex", alignItems: "center", justifyContent: "center", padding: 28 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(35,26,12,.6)", animation: "nvFade .3s ease-out" }} />
      <div style={{ position: "relative", width: "100%", background: "#fdf6e4", borderRadius: 26, padding: "26px 22px 22px", textAlign: "center", animation: "nvPop .5s ease-out", boxShadow: "0 30px 70px -20px rgba(30,20,5,.7)" }}>
        <p style={{ fontSize: 10.5, letterSpacing: ".24em", color: "#a9793f", fontWeight: 700, margin: 0 }}>這 鍋 湯 煮 好 了</p>
        <div style={{ width: 120, height: 120, borderRadius: 20, overflow: "hidden", margin: "16px auto 0", boxShadow: "0 0 0 5px #f0dfb4,0 16px 36px -12px rgba(120,80,30,.55)", animation: "nvPop .6s ease-out" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/handoff/orange-card.png" alt="湯卡" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 19, color: "#3a2f22", margin: "14px 0 0" }}>{soupName}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 9, margin: "14px auto 0", width: "fit-content", background: GREEN, borderRadius: 999, padding: "9px 18px 9px 11px", boxShadow: "0 10px 24px -10px rgba(45,90,65,.55)", animation: "nvPop .7s ease-out" }}>
          <span style={{ width: 26, height: 26, flexShrink: 0, borderRadius: "50%", background: "radial-gradient(circle at 35% 30%,#f6d98a,#d9a33c)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#7a5313", boxShadow: "inset 0 0 0 2px rgba(255,248,220,.7)" }}>★</span>
          <span style={{ ...serifTC, fontWeight: 700, fontSize: 15, color: "#faf4e6" }}>獲得「{badgeName}」徽章</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 7, margin: "10px auto 0", width: "fit-content", border: "1.5px solid #e0c98e", borderRadius: 999, padding: "6px 15px", background: "#fffbf0" }}>
          <span style={{ fontSize: 11, color: "#b5763a" }}>◈</span>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#8a6a3a" }}>湯譜卡已收進紀念冊</span>
        </div>
        {friend ? (
          <>
            <div style={{ height: 1, background: "#e8d9b2", margin: "18px 8px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: 13, textAlign: "left", background: "#fffbf0", border: "1.5px solid #e3cf9e", borderRadius: 16, padding: "13px 14px" }}>
              <span style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", overflow: "hidden", border: "2px solid #e3cf9e", background: friend.gradient ?? "#e8d9b2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {friend.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={friend.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ ...serifTC, fontWeight: 700, fontSize: 20, color: "#fff" }}>{friend.displayName.slice(0, 1)}</span>
                )}
              </span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".12em", color: "#a9793f", margin: 0 }}>有人想認識你</p>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 14.5, color: "#3a2f22", margin: "2px 0 0" }}>{friend.displayName}</p>
                <p style={{ fontSize: 11, color: "#8a7659", margin: "2px 0 0" }}>聞到湯香就出現了{friend.introLine ? ` · ${friend.introLine}` : ""}。</p>
              </div>
            </div>
          </>
        ) : null}
        <button onClick={onClose} style={{ ...serifTC, marginTop: 18, width: "100%", border: "none", cursor: "pointer", height: 52, borderRadius: 16, background: GREEN, color: "#faf4e6", fontWeight: 700, fontSize: 16, boxShadow: "0 10px 26px -10px rgba(45,90,65,.5)" }}>收進紀念冊</button>
      </div>
    </div>
  );
}

function GrownGate({
  gateOpen, gateQ, kidName, onPass, onWrong, onClose, onRow, onPrint,
}: {
  gateOpen: boolean; gateQ: { a: number; b: number; opts: number[] } | null; kidName: string | null;
  onPass: () => void; onWrong: () => void; onClose: () => void; onRow: (m: string) => void; onPrint: () => void;
}) {
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 50 }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(40,30,15,.45)", animation: "nvFade .25s ease-out" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, background: "#fbf5e6", borderRadius: "26px 26px 0 0", padding: "14px 20px 34px", animation: "nvSheet .3s ease-out", boxShadow: "0 -12px 40px -12px rgba(60,40,20,.4)" }}>
        <div style={{ width: 40, height: 5, borderRadius: 3, background: "#d8c9a4", margin: "0 auto 16px" }} />
        {!gateOpen ? (
          <>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, margin: 0, color: "#3a2f22", textAlign: "center" }}>大人的門</p>
            <p style={{ fontSize: 12.5, color: "#8a7659", textAlign: "center", margin: "6px 0 18px" }}>請大人來開門：{gateQ ? `${gateQ.a} + ${gateQ.b} = ?` : ""}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              {gateQ?.opts.map((o, i) => (
                <button key={i} onClick={() => (o === gateQ.a + gateQ.b ? onPass() : onWrong())} style={{ ...serifTC, width: 72, height: 56, border: "1.5px solid #d8bc7e", borderRadius: 14, background: "#fff", cursor: "pointer", fontWeight: 700, fontSize: 20, color: "#6b5a44" }}>{o}</button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 18, margin: "0 0 4px", color: "#3a2f22" }}>給爸媽</p>
            <p style={{ fontSize: 12, color: "#8a7659", margin: "0 0 16px" }}>這裡的東西孩子不會看到。每週只換一鍋湯，不用每天追進度。</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              {[
                { glyph: "週", iconBg: GREEN, title: "本週導覽", sub: "這鍋湯的故事、出門要找什麼、怎麼一起煮", act: () => onRow("本週導覽（家長內容，之後補上）") },
                { glyph: "印", iconBg: "#b5763a", title: "列印中心", sub: "湯譜紀念冊、手作紙都在這裡印", act: onPrint },
                { glyph: "鈴", iconBg: "#8a7659", title: "提醒設定", sub: "換週時輕輕提醒一次", act: () => onRow("提醒設定（之後補上）") },
                { glyph: "娃", iconBg: "#7a6a95", title: "小孩檔案", sub: `${kidName ? kidName + " · " : ""}改名字、之後可加第二個小孩`, act: () => onRow("小孩檔案（之後補上）") },
              ].map((gr, i) => (
                <button key={i} onClick={gr.act} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", border: "1px solid #ecdcb8", cursor: "pointer", background: "#fff", borderRadius: 14, padding: "12px 14px", fontFamily: "inherit", minHeight: 52 }}>
                  <span style={{ ...serifTC, width: 34, height: 34, flexShrink: 0, borderRadius: 10, background: gr.iconBg, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, color: "#fff" }}>{gr.glyph}</span>
                  <span style={{ flex: 1, display: "block" }}>
                    <span style={{ display: "block", fontWeight: 700, fontSize: 13.5, color: "#3a2f22" }}>{gr.title}</span>
                    <span style={{ display: "block", fontSize: 11, color: "#8a7659" }}>{gr.sub}</span>
                  </span>
                  <span style={{ fontSize: 14, color: "#c2a97e" }}>›</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
