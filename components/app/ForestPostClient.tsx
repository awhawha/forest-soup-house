"use client";

/**
 * 森林郵局 — 畫卡片拍照投遞 → 信在路上（真實等 2 天）→ 拆回信。
 * 版面 1:1 依 design handoff（湯湯屋-森林郵局.dc.html）。
 * 差異：
 * - dc 的「⏩ 示範：讓信現在就到達」為示範用快轉，正式版拿掉——
 *   回信延遲照 dc 顯示的「還要 2 天到」改為真實等待 2 天（sendLetter 第二參數）。
 * - transit / 回信時間走共用的 lib/client/pantry（stt_post_v1）；
 *   收件人與信箱內容（dc 原本混在同一個 key）另存本頁專用的 stt_post_extra_v1。
 */
import Link from "next/link";
import { useState } from "react";
import {
  emitSoupChanged,
  getPost,
  readReply,
  sendLetter,
} from "@/lib/client/pantry";
import { useNow, useSoupStateTicking } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";
import { PhotoCapture } from "@/components/app/PhotoCapture";
import { PhotoImg } from "@/components/app/PhotoImg";

const DAY_MS = 86_400_000;
/** dc 示範是按鈕即時送達、畫面標示「還要 2 天到」；正式版改為真實等待 2 天 */
const REPLY_DELAY_MS = 2 * DAY_MS;

/** 收件人與回信文案，照 dc 的 RCP */
const RCP = [
  {
    name: "菲娜",
    initial: "菲",
    color: "radial-gradient(circle at 40% 35%,#f3cf92,#e0a860)",
    reply: "收到你的信了！我一個字一個字唸了三遍。等你回來，我們一起把它煮進湯裡。",
  },
  {
    name: "波飛",
    initial: "波",
    color: "radial-gradient(circle at 40% 35%,#f0b45a,#d9733a)",
    reply: "你的字讓爐火都變暖了。火我幫你看著，隨時回來喝湯，別讓它涼了。",
  },
  {
    name: "森林",
    initial: "森",
    color: "radial-gradient(circle at 40% 35%,#8cc47e,#4f8a52)",
    reply: "風把你的信讀給每一棵樹聽。它們搖了搖葉子——那就是森林在說謝謝你。",
  },
] as const;

interface InboxMsg {
  from: string;
  initial: string;
  color: string;
  when: number;
  text: string;
}

interface PostExtra {
  to: string;
  inbox: InboxMsg[];
}

const EXTRA_KEY = "stt_post_extra_v1";

/** 一開始就在信箱裡的信（dc state 的種子信，「3 天前」） */
function seedExtra(): PostExtra {
  return {
    to: "菲娜",
    inbox: [
      {
        from: "菲娜",
        initial: "菲",
        color: "radial-gradient(circle at 40% 35%,#f3cf92,#e0a860)",
        when: Date.now() - 3 * DAY_MS,
        text: "謝謝你上次的卡片！我把它貼在湯湯屋的窗邊，煮湯的時候就會看到。下次換你來，我留最香的一碗。",
      },
    ],
  };
}

function readExtra(): PostExtra {
  if (typeof window === "undefined") return seedExtra();
  try {
    const raw = localStorage.getItem(EXTRA_KEY);
    if (raw) return JSON.parse(raw) as PostExtra;
  } catch {
    /* ignore */
  }
  return seedExtra();
}

function writeExtra(next: PostExtra): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(EXTRA_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function fmtWhen(ts: number, now: number): string {
  const days = now > 0 ? Math.floor((now - ts) / DAY_MS) : 0;
  return days <= 0 ? "剛剛" : `${days} 天前`;
}

export function ForestPostClient() {
  const [step, setStep] = useState<"idle" | "writing">("idle");
  const [note, setNote] = useState("");
  const [photoId, setPhotoId] = useState<string | undefined>(undefined);

  const post = useSoupStateTicking(getPost, { transit: false, repliesRead: 0 });
  const extra = useSoupStateTicking(readExtra, { to: "菲娜", inbox: [] });

  const now = useNow(); // 0 = 尚未 mount
  const ready = now > 0 && !!post.replyAt && now >= post.replyAt;
  const showIdle = step === "idle" && !post.transit;
  const showWriting = step === "writing";
  const showTransit = step !== "writing" && post.transit && !ready;
  const showReady = step !== "writing" && post.transit && ready;

  const daysLeft = post.replyAt
    ? Math.max(1, Math.ceil((post.replyAt - now) / DAY_MS))
    : 2;

  const pickTo = (name: string) => {
    writeExtra({ ...readExtra(), to: name });
    emitSoupChanged();
  };

  const send = () => {
    sendLetter(photoId, REPLY_DELAY_MS);
    setStep("idle");
    setNote("");
    setPhotoId(undefined);
  };

  /** 拆信：把回信放進信箱，並重置共用的郵局狀態 */
  const openReply = () => {
    const data = readExtra();
    const r = RCP.find((x) => x.name === data.to) ?? RCP[0];
    const msg: InboxMsg = { from: r.name, initial: r.initial, color: r.color, when: Date.now(), text: r.reply };
    writeExtra({ ...data, inbox: [msg, ...data.inbox] });
    readReply();
  };

  return (
    <div
      style={{
        position: "absolute", inset: 0, overflowY: "auto",
        background: "linear-gradient(180deg,#e6ddc6 0%,#f4ead2 40%)",
        color: "#493d31", lineHeight: 1.6, paddingBottom: 44,
      }}
    >
      {/* spFly / spBob 只有這頁用，局部定義（其餘沿用 globals 的 shhIn） */}
      <style>{`
@keyframes spFly { 0%{transform:translate(0,0) rotate(0)} 100%{transform:translate(26px,-14px) rotate(8deg)} }
@keyframes spBob { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
`}</style>

      {/* header：麵包屑三層 */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 6px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 12 }}>
          <Link href="/" style={{ fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>湯湯屋</Link>
          <span style={{ color: "#b8a888" }}>›</span>
          <Link href="/map" style={{ fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>森林地圖</Link>
          <span style={{ color: "#b8a888" }}>›</span>
          <span style={{ fontWeight: 700, color: "#5b4a35" }}>森林郵局</span>
        </div>
        <Link href="/friends" style={{ fontSize: 12, fontWeight: 600, color: "#3f7a4a", textDecoration: "none" }}>
          朋友們 →
        </Link>
      </div>

      {/* hero 地點卡 */}
      <div
        style={{
          margin: "8px 16px 0", borderRadius: 26, overflow: "hidden",
          background: "linear-gradient(160deg,#e7b56a,#c9793a)",
          boxShadow: "0 16px 34px -18px rgba(150,90,30,.7)", position: "relative",
          animation: "shhIn .5s ease-out",
        }}
      >
        <div style={{ height: 132, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
          <span style={{ fontSize: 40, color: "rgba(255,255,255,.85)" }}>✉</span>
          <span
            style={{
              ...serifTC,
              position: "absolute", right: 26, top: 26, width: 46, height: 46, borderRadius: "50%",
              background: "rgba(255,255,255,.9)", display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: 18, color: "#c9793a",
              boxShadow: "0 6px 14px -6px rgba(120,60,10,.6)",
              animation: "spBob 3.4s ease-in-out infinite",
            }}
          >
            郵
          </span>
        </div>
        <div style={{ background: "rgba(255,252,243,.96)", padding: "16px 18px 18px" }}>
          <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 24, margin: 0, color: "#3a2f22" }}>森林郵局</h1>
          <p style={{ fontSize: 12.5, color: "#a9793f", margin: "5px 0 0", fontStyle: "italic" }}>
            投入你的心意，等待森林的回信。
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 9, marginTop: 12, borderTop: "1px dashed #e0cfa8", paddingTop: 11 }}>
            <span
              style={{
                ...serifTC,
                width: 30, height: 30, flexShrink: 0, borderRadius: "50%",
                background: "radial-gradient(circle at 40% 35%,#e0a860,#b5763a)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: 700, fontSize: 12, color: "#fff",
              }}
            >
              鳥
            </span>
            <p style={{ fontSize: 12, color: "#5b4a35", margin: 0 }}>
              送信的小鳥 <b>Pipit</b> 常在這裡起飛。
            </p>
          </div>
        </div>
      </div>

      {/* signature ritual：寫信 */}
      <div style={{ margin: "18px 16px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 10px" }}>
          這裡能做的事
        </p>

        {showIdle ? (
          <div
            style={{
              background: "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18,
              boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "shhIn .35s ease-out",
            }}
          >
            <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "#3a2f22" }}>
              寄一封信給森林裡的朋友
            </p>
            <p style={{ fontSize: 12.5, color: "#5b4a35", margin: "7px 0 0", lineHeight: 1.75 }}>
              在真的紙上畫一張卡片，拍下來投進信箱。
              <br />
              信要走上幾天，朋友才會收到——也才會回信。
            </p>
            <button
              onClick={() => setStep("writing")}
              style={{
                ...serifTC,
                marginTop: 14, width: "100%", height: 46, border: "none", borderRadius: 14,
                background: "#c9793a", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(150,80,20,.7)",
              }}
            >
              寫一封信 ✎
            </button>
          </div>
        ) : null}

        {showWriting ? (
          <div
            style={{
              background: "#fbf5e6", border: "1px solid #ecdcb8", borderRadius: 20, padding: 18,
              boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)", animation: "shhIn .3s ease-out",
            }}
          >
            <p style={{ fontSize: 11, color: "#8a7659", margin: "0 0 8px" }}>要寄給誰？</p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {RCP.map((r) => {
                const on = extra.to === r.name;
                return (
                  <button
                    key={r.name}
                    onClick={() => pickTo(r.name)}
                    style={{
                      border: `1px solid ${on ? "#c9793a" : "#e0cfa8"}`,
                      background: on ? "#c9793a" : "#fff",
                      color: on ? "#fff" : "#8a6a3a",
                      fontFamily: "inherit", fontSize: 12.5, fontWeight: 700,
                      padding: "8px 14px", borderRadius: 999, cursor: "pointer",
                    }}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>

            <p style={{ fontSize: 11, color: "#8a7659", margin: "16px 0 8px" }}>拍下你畫的卡片</p>
            <PhotoCapture
              onSaved={setPhotoId}
              style={{
                width: "100%", height: 150, display: "block", padding: 0, overflow: "hidden",
                borderRadius: 14, cursor: "pointer",
                border: photoId ? "1px solid #ecdcb8" : "1.5px dashed var(--shh-dashed)",
                background: "#faf6ea",
              }}
            >
              <PhotoImg
                photoId={photoId}
                alt="你畫的卡片"
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                fallback={<span style={{ fontSize: 12, color: "#b3a186" }}>拍一張手繪卡片</span>}
              />
            </PhotoCapture>

            <p style={{ fontSize: 11, color: "#8a7659", margin: "16px 0 6px" }}>想說的一句話</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例：菲娜，今天的湯我留了一口給你。"
              style={{
                width: "100%", boxSizing: "border-box", minHeight: 64, resize: "none",
                border: "1px solid #e0cfa8", borderRadius: 12, padding: "11px 12px",
                fontFamily: "inherit", fontSize: 13, color: "#493d31", background: "#fff", lineHeight: 1.7,
              }}
            />

            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <button
                onClick={() => { setStep("idle"); setNote(""); }}
                style={{
                  flex: "0 0 auto", height: 46, padding: "0 18px", border: "1px solid #e0cfa8",
                  borderRadius: 14, background: "#fff", color: "#8a6a3a",
                  fontFamily: "inherit", fontWeight: 700, fontSize: 14, cursor: "pointer",
                }}
              >
                再想想
              </button>
              <button
                onClick={send}
                style={{
                  ...serifTC,
                  flex: 1, height: 46, border: "none", borderRadius: 14, background: "#c9793a",
                  color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                  boxShadow: "0 8px 18px -8px rgba(150,80,20,.7)",
                }}
              >
                投進信箱 · 寄給{extra.to}
              </button>
            </div>
          </div>
        ) : null}

        {showTransit ? (
          <div
            style={{
              background: "linear-gradient(160deg,#f6ecd6,#f0e0be)", border: "1px solid #ecdcb8",
              borderRadius: 20, padding: 18, boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)",
              animation: "shhIn .3s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 44, height: 34, flexShrink: 0, borderRadius: 6, background: "#fff",
                  border: "1px solid #e6d4ab", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, animation: "spFly 1.6s ease-in-out infinite alternate",
                }}
              >
                ✉
              </span>
              <div>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 15, margin: 0, color: "#3a2f22" }}>
                  信正在森林裡旅行⋯
                </p>
                <p style={{ fontSize: 11.5, color: "#8a7659", margin: "2px 0 0" }}>
                  寄給{extra.to} · 還要 {daysLeft} 天到
                </p>
              </div>
            </div>
            <p style={{ fontSize: 11.5, color: "#7f6c52", margin: "12px 0 0", lineHeight: 1.75 }}>
              先去做點別的吧——採花、煮湯，或畫下一張卡片。
              <br />
              過幾天回來，說不定就收到回信了。
            </p>
          </div>
        ) : null}

        {showReady ? (
          <div
            style={{
              background: "linear-gradient(160deg,#fff6e4,#fbeccb)", border: "1px solid #ecdcb8",
              borderRadius: 20, padding: 18, boxShadow: "0 10px 26px -16px rgba(90,60,30,.4)",
              animation: "shhIn .3s ease-out",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <span
                style={{
                  width: 44, height: 34, flexShrink: 0, borderRadius: 6, background: "#fff",
                  border: "1px solid #e6d4ab", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, animation: "spBob 1.6s ease-in-out infinite",
                }}
              >
                ✉
              </span>
              <div>
                <p style={{ ...serifTC, fontWeight: 700, fontSize: 15, margin: 0, color: "#3a2f22" }}>
                  森林的回信到了！
                </p>
                <p style={{ fontSize: 11.5, color: "#8a7659", margin: "2px 0 0" }}>
                  {extra.to}回信給你了 · 拆開來讀讀看
                </p>
              </div>
            </div>
            <button
              onClick={openReply}
              style={{
                ...serifTC,
                marginTop: 13, width: "100%", height: 46, border: "none", borderRadius: 14,
                background: "#c9793a", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer",
                boxShadow: "0 8px 18px -8px rgba(150,80,20,.7)",
              }}
            >
              拆開回信 ✉
            </button>
          </div>
        ) : null}
      </div>

      {/* 信箱 inbox */}
      <div style={{ margin: "24px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: 0 }}>
            你的信箱 · {extra.inbox.length}
          </p>
          <span style={{ fontSize: 10.5, color: "#a08a68" }}>森林寄來的回信</span>
        </div>

        {extra.inbox.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
            {extra.inbox.map((m, i) => (
              <div
                key={`${m.when}-${i}`}
                style={{
                  background: "#fff", border: "1px solid #ecdcb8", borderRadius: 18, padding: "15px 16px",
                  boxShadow: "0 8px 20px -15px rgba(90,60,30,.4)", animation: "shhIn .4s ease-out",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span
                    style={{
                      ...serifTC,
                      width: 36, height: 36, flexShrink: 0, borderRadius: "50%", background: m.color,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontWeight: 700, fontSize: 14, color: "#fff",
                    }}
                  >
                    {m.initial}
                  </span>
                  <div>
                    <p style={{ ...serifTC, fontWeight: 700, fontSize: 14, margin: 0, color: "#3a2f22" }}>
                      來自 {m.from}
                    </p>
                    <p style={{ fontSize: 10, color: "#a08a68", margin: "1px 0 0" }}>{fmtWhen(m.when, now)}</p>
                  </div>
                </div>
                <p style={{ ...serifTC, fontSize: 13, color: "#5b4a35", margin: "11px 0 0", lineHeight: 1.8 }}>
                  {m.text}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ border: "1px dashed #d9c8a2", borderRadius: 18, padding: 22, textAlign: "center", color: "#9c8c70" }}>
            <p style={{ fontSize: 12.5, margin: 0 }}>
              信箱還空空的。
              <br />
              寄出第一封信，森林就會開始回信給你。
            </p>
          </div>
        )}
      </div>

      <p style={{ textAlign: "center", fontSize: 11, color: "#a89e8c", margin: "26px 24px 0", lineHeight: 1.8 }}>
        好的信，需要一點等待。
        <br />
        這裡教的，是慢慢想念一個人。
      </p>
    </div>
  );
}
