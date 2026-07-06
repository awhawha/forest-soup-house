"use client";

/**
 * Onboarding 1b「湯屋裡的對話」— 規格 §5。
 * 菲娜一句一句聊，收 name / age / companion，結尾寫入 Profile。
 */
import { useEffect, useRef, useState } from "react";
import { saveProfile } from "@/lib/client/profile";
import { serifTC } from "@/components/app/PhoneFrame";

const AGES = ["3", "4", "5", "6", "7", "8+"];
const COMPS = ["媽媽", "爸爸", "阿公", "阿嬤", "哥哥姊姊", "其他家人"];
const ageLabel = (x: string) => (x === "8+" ? "8 歲以上" : `${x} 歲`);

type Phase = 0 | 1 | 2 | 3; // name / age / companion / done

interface Msg {
  fina: boolean;
  text: string;
}

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>(0);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [comp, setComp] = useState("");
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);

  const msgs: Msg[] = [
    { fina: true, text: "有腳步聲……是你來了！我是小狐狸菲娜。在推開木門之前，可以告訴我你的名字嗎？" },
  ];
  if (name) {
    msgs.push({ fina: false, text: name });
    msgs.push({ fina: true, text: `${name}！我要把這個名字，好好記在湯譜的第一頁。${name} 今年幾歲了呀？` });
  }
  if (age) {
    msgs.push({ fina: false, text: `我 ${age}` });
    msgs.push({ fina: true, text: `${age}，正是鼻子最靈的年紀！那今天，是誰陪你一起來的呢？` });
  }
  if (comp) {
    const c = comp === "其他家人" ? "家人" : comp;
    msgs.push({ fina: false, text: comp === "其他家人" ? "我的家人" : comp });
    msgs.push({ fina: true, text: `太好了。和${c}一起煮的湯，一定特別香。走吧——湯已經在鍋子裡等你了。` });
  }

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [phase]);

  const submitName = () => {
    const n = input.trim();
    if (!n) return;
    setName(n);
    setInput("");
    setPhase(1);
  };
  const finish = () => {
    saveProfile({ name, age, companion: comp });
    onDone();
  };

  return (
    <div style={{ position: "absolute", inset: 0, background: "#f4ead2", overflow: "hidden", userSelect: "none" }}>
      {/* 上半：菲娜煮湯場景 */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 300, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/handoff/fina-cooking.png" alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,rgba(60,45,20,.25) 0%,transparent 40%,rgba(244,234,210,.4) 82%,#f4ead2 100%)" }} />
        <div style={{ position: "absolute", left: "44%", top: 80, width: 14, height: 50, background: "radial-gradient(circle,rgba(255,240,200,.9),transparent 70%)", filter: "blur(3px)", animation: "obSteam 4.5s ease-in infinite" }} />
      </div>
      <div style={{ position: "absolute", top: 16, left: 0, right: 0, textAlign: "center" }}>
        <p style={{ fontSize: 10.5, letterSpacing: ".42em", color: "rgba(255,248,230,.95)", margin: 0, fontWeight: 500, textShadow: "0 1px 8px rgba(50,35,15,.6)" }}>FOREST SOUP HOUSE</p>
      </div>

      {/* 對話串 */}
      <div ref={chatRef} style={{ position: "absolute", top: 252, bottom: 118, left: 0, right: 0, overflowY: "auto", padding: "16px 18px", display: "flex", flexDirection: "column", gap: 12 }}>
        {msgs.map((m, i) =>
          m.fina ? (
            <div key={i} style={{ display: "flex", alignItems: "flex-end", gap: 8, maxWidth: "88%", animation: "obIn .4s ease-out" }}>
              <span style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", overflow: "hidden", boxShadow: "0 3px 8px -3px rgba(90,60,30,.5)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/images/handoff/fina-bust.png" alt="菲娜" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </span>
              <div style={{ background: "#fffbf0", border: "1.5px solid #e3cf9e", borderRadius: "4px 16px 16px 16px", padding: "12px 14px", boxShadow: "0 6px 16px -10px rgba(90,60,30,.4)" }}>
                <p style={{ ...serifTC, fontSize: 14.5, lineHeight: 1.85, color: "#4a3d2e", margin: 0 }}>{m.text}</p>
              </div>
            </div>
          ) : (
            <div key={i} style={{ alignSelf: "flex-end", maxWidth: "78%", background: "#3f7a4a", borderRadius: "16px 4px 16px 16px", padding: "11px 15px", boxShadow: "0 6px 16px -10px rgba(45,90,65,.5)", animation: "obIn .35s ease-out" }}>
              <p style={{ ...serifTC, fontWeight: 600, fontSize: 14.5, lineHeight: 1.7, color: "#faf4e6", margin: 0 }}>{m.text}</p>
            </div>
          ),
        )}
      </div>

      {/* 底部輸入區 */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "14px 16px 22px", background: "linear-gradient(180deg,rgba(244,234,210,0),#f4ead2 26%)" }}>
        {phase === 0 ? (
          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitName()}
              placeholder="我的名字是⋯⋯"
              style={{ ...serifTC, flex: 1, boxSizing: "border-box", border: "1.5px solid #e0cfa8", borderRadius: 999, background: "#fffbf0", fontWeight: 600, fontSize: 16, color: "#3a2f22", padding: "13px 18px", outline: "none", minWidth: 0 }}
            />
            <button onClick={submitName} style={{ flexShrink: 0, width: 50, height: 50, borderRadius: "50%", border: "none", cursor: "pointer", background: input.trim() ? "#3f7a4a" : "#bcc4b0", color: "#faf4e6", fontSize: 19, boxShadow: "0 8px 20px -8px rgba(45,90,65,.55)", display: "flex", alignItems: "center", justifyContent: "center", padding: 0 }}>→</button>
          </div>
        ) : phase === 1 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center" }}>
            {AGES.map((x) => (
              <button key={x} onClick={() => { setAge(ageLabel(x)); setPhase(2); }} style={pill}>{ageLabel(x)}</button>
            ))}
          </div>
        ) : phase === 2 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 9, justifyContent: "center" }}>
            {COMPS.map((x) => (
              <button key={x} onClick={() => { setComp(x); setPhase(3); }} style={pill}>{x}</button>
            ))}
          </div>
        ) : (
          <button onClick={finish} style={{ ...serifTC, display: "block", width: "100%", textAlign: "center", border: "none", cursor: "pointer", fontWeight: 600, fontSize: 17, color: "#faf4e6", background: "#3f7a4a", padding: 16, borderRadius: 18, boxShadow: "0 12px 30px -8px rgba(45,90,65,.55)", animation: "obPop .5s ease-out" }}>
            推開木門，進湯湯屋　→
          </button>
        )}
      </div>
    </div>
  );
}

const pill: React.CSSProperties = {
  ...serifTC, border: "1.5px solid #d8bc7e", cursor: "pointer", background: "#fff9ec",
  fontWeight: 600, fontSize: 15, color: "#6b5a44", padding: "12px 17px", borderRadius: 999,
  minHeight: 46, boxShadow: "0 5px 14px -8px rgba(120,80,30,.45)",
};
