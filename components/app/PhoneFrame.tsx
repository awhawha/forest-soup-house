/**
 * 390×844 手機框 — 桌機置中顯示、手機吃滿版。
 * 內部由各頁自己捲動（position:absolute inset:0 overflow-y:auto）。
 */
export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex min-h-[100dvh] items-center justify-center"
      style={{ background: "#e8dcc2" }}
    >
      <div
        className="relative overflow-hidden max-sm:h-[100dvh] max-sm:w-full sm:h-[844px] sm:max-h-[calc(100dvh-24px)] sm:w-[390px] sm:rounded-[28px] sm:shadow-[0_30px_80px_-20px_rgba(60,40,20,.55)]"
        style={{
          background: "var(--shh-bg)",
          fontFamily: "var(--font-noto-sans), 'Noto Sans TC', sans-serif",
          color: "var(--shh-body)",
          lineHeight: 1.6,
        }}
      >
        {children}
      </div>
    </div>
  );
}

/** 標題字型（Noto Serif TC）inline style 共用 */
export const serifTC = {
  fontFamily: "var(--font-noto-serif), 'Noto Serif TC', serif",
} as const;

/**
 * 去背貼紙白邊：沿主體輪廓描一圈白，外加淡淡落影。
 * 給 objectFit:contain 的去背 PNG 用（煮湯 token、收藏櫃貼紙共用）。
 */
export const STICKER_OUTLINE =
  "drop-shadow(2px 0 0 #fffbf0) drop-shadow(-2px 0 0 #fffbf0) drop-shadow(0 2px 0 #fffbf0) drop-shadow(0 -2px 0 #fffbf0) drop-shadow(1.4px 1.4px 0 #fffbf0) drop-shadow(-1.4px 1.4px 0 #fffbf0) drop-shadow(1.4px -1.4px 0 #fffbf0) drop-shadow(-1.4px -1.4px 0 #fffbf0) drop-shadow(0 5px 9px rgba(60,40,15,.42))";
