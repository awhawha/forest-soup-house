"use client";

/**
 * 朋友們 — 已認識 N/total 位森林住戶，隨湯譜石（stt_map_cooked）解鎖。
 * 版面 1:1 依 design handoff（湯湯屋-朋友們.dc.html），資料改由 DB（getResidents）供給。
 */
import Link from "next/link";
import type { Resident } from "@/lib/weekly";
import { getCooked } from "@/lib/client/pantry";
import { useSoupState } from "@/lib/client/useSoupState";
import { serifTC } from "@/components/app/PhoneFrame";

const FALLBACK_GRADIENT = "radial-gradient(circle at 40% 35%,#e0cfa8,#b59a5f)";

function metText(r: Resident): string {
  const head =
    r.unlockAtPot === 1 ? "第 1 鍋就認識了" : `第 ${r.unlockAtPot} 鍋認識的`;
  return r.introLine ? `${head} · ${r.introLine}` : head;
}

function teaserText(r: Resident): string {
  const first = r.kind.split("·")[0]?.trim();
  return first || "還沒認識的朋友";
}

export function FriendsClient({ residents }: { residents: Resident[] }) {
  const cooked = useSoupState(getCooked, 0);

  // 照 dc：known = unlockAtPot <= cooked（cooked=0 時 0 位已認識）
  const known = residents.filter((r) => r.unlockAtPot <= cooked);
  const unknown = residents.filter((r) => r.unlockAtPot > cooked);

  return (
    <div style={{ position: "absolute", inset: 0, overflowY: "auto", paddingBottom: 44 }}>
      {/* dc 的 sfIn 與 globals 的 shhIn 相同；sfDrift 為本頁局部 keyframes */}
      <style>{`@keyframes sfDrift { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-5px)} }`}</style>

      {/* 麵包屑：湯湯屋 › 朋友們 */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "18px 18px 6px" }}>
        <Link href="/" style={{ fontSize: 12, fontWeight: 600, color: "var(--shh-green)", textDecoration: "none" }}>
          湯湯屋
        </Link>
        <span style={{ fontSize: 12, color: "var(--shh-muted-2)" }}>›</span>
        <span style={{ fontSize: 12, fontWeight: 600, color: "var(--shh-muted)" }}>朋友們</span>
      </div>

      <div style={{ textAlign: "center", padding: "6px 24px 0" }}>
        <h1 style={{ ...serifTC, fontWeight: 700, fontSize: 26, margin: 0, color: "var(--shh-ink)" }}>
          森林朋友們
        </h1>
        <p style={{ fontSize: 12.5, color: "#7f6c52", margin: "6px 0 0" }}>
          這裡的每一位，都是你在故事裡親自遇到的
        </p>
      </div>

      {/* progress */}
      <div
        style={{
          margin: "14px 20px 0", background: "rgba(255,252,243,.7)",
          border: "1px solid rgba(236,220,184,.9)", borderRadius: 16, padding: "11px 15px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}
      >
        <p style={{ ...serifTC, fontWeight: 700, fontSize: 14, margin: 0, color: "var(--shh-ink)" }}>
          已認識 {known.length}/{residents.length} 位森林住戶
        </p>
        <p style={{ fontSize: 10.5, color: "var(--shh-muted-2)", margin: 0 }}>
          跟著森林地圖的進度一起長大
        </p>
      </div>

      {/* 認識了的朋友 */}
      <div style={{ padding: "20px 20px 0" }}>
        <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 10px" }}>
          認識了的朋友 · {known.length}
        </p>
        {known.length === 0 ? (
          /* 空狀態：還沒煮過湯 */
          <div
            style={{
              background: "var(--shh-card)", border: "1px dashed var(--shh-dashed)",
              borderRadius: 20, padding: "26px 20px", textAlign: "center",
              animation: "shhIn .4s ease-out",
            }}
          >
            <Link
              href="/story"
              style={{ ...serifTC, fontSize: 14, fontWeight: 700, color: "var(--shh-green)", textDecoration: "none", lineHeight: 1.8 }}
            >
              煮好第一鍋湯，就會認識住在湯湯屋的朋友 →
            </Link>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {known.map((r) => (
              <div
                key={r.slug}
                style={{
                  display: "flex", gap: 14, background: "var(--shh-card)",
                  border: "1px solid var(--shh-border)", borderRadius: 20, padding: 15,
                  boxShadow: "0 8px 22px -14px rgba(90,60,30,.45)", animation: "shhIn .4s ease-out",
                }}
              >
                <span
                  style={{
                    width: 64, height: 64, flexShrink: 0, borderRadius: "50%",
                    background: r.gradient ?? FALLBACK_GRADIENT,
                    boxShadow: "0 0 0 3px #fff,0 6px 14px -6px rgba(60,40,20,.5)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    overflow: "hidden", animation: "sfDrift 4.4s ease-in-out infinite",
                  }}
                >
                  {r.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image}
                      alt={r.displayName}
                      style={{
                        width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 22%",
                        transform: "scale(1.35)", transformOrigin: "50% 30%",
                      }}
                    />
                  ) : (
                    <span style={{ ...serifTC, fontWeight: 700, fontSize: 22, color: "rgba(50,25,10,.55)" }}>
                      {r.displayName.charAt(0)}
                    </span>
                  )}
                </span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <p style={{ ...serifTC, fontWeight: 700, fontSize: 17, margin: 0, color: "var(--shh-ink)" }}>
                      {r.displayName}
                    </p>
                    <span style={{ fontSize: 10, color: "var(--shh-muted-2)" }}>{r.kind}</span>
                  </div>
                  <p style={{ fontSize: 12, color: "#5b4a35", margin: "4px 0 0", lineHeight: 1.65 }}>
                    {r.desc}
                  </p>
                  <p style={{ ...serifTC, fontSize: 12.5, color: "#2e5a38", margin: "7px 0 0", fontStyle: "italic" }}>
                    「{r.quote}」
                  </p>
                  <p style={{ fontSize: 10.5, color: "var(--shh-muted-2)", margin: "6px 0 0" }}>
                    {metText(r)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 還沒遇到的朋友 */}
      {unknown.length > 0 && (
        <div style={{ padding: "28px 20px 0" }}>
          <p style={{ fontSize: 11, letterSpacing: ".14em", color: "#a9793f", fontWeight: 700, margin: "0 0 4px" }}>
            還沒遇到的朋友 · {unknown.length}
          </p>
          <p style={{ fontSize: 11.5, color: "var(--shh-muted)", margin: "0 0 12px" }}>
            繼續煮湯，他們就會在故事裡出現
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
            {unknown.map((r) => (
              <div key={r.slug} style={{ textAlign: "center", opacity: 0.7 }}>
                <span
                  style={{
                    display: "flex", width: 56, height: 56, margin: "0 auto", borderRadius: "50%",
                    background: "rgba(140,150,120,.25)", border: "2px dashed #c9bd9d",
                    alignItems: "center", justifyContent: "center", fontSize: 18, color: "#a89e82",
                  }}
                >
                  ?
                </span>
                <p style={{ fontSize: 10, color: "#8a8068", margin: "5px 0 0" }}>{teaserText(r)}</p>
                <p style={{ fontSize: 9, color: "#b0a48c", margin: "2px 0 0" }}>
                  煮到第 {r.unlockAtPot} 鍋就會見面
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <p style={{ textAlign: "center", fontSize: 11, color: "#a89e8c", margin: "30px 24px 0", lineHeight: 1.8 }}>
        {unknown.length > 0 ? (
          <>
            朋友不是名單，是你們一起煮過的湯。
            <br />
            九鍋全煮完，大家會在「角色角」為你辦一場慶祝會。
          </>
        ) : (
          <>
            九鍋湯全煮完了！
            <br />
            朋友們都到齊，慶祝會正在角色角熱鬧上演。
          </>
        )}
      </p>
    </div>
  );
}
