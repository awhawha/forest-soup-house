"use client";

/**
 * 手作列印頁頂部工具列（列印時以 .shh-no-print 隱藏）。
 * 樣式 1:1 依 design handoff（湯湯屋-手作列印頁.dc.html）。
 */
import Link from "next/link";

export function PrintToolbar() {
  return (
    <div
      className="shh-no-print"
      style={{
        maxWidth: 520, margin: "0 auto 18px", display: "flex", alignItems: "center",
        justifyContent: "space-between", gap: 12, padding: "0 20px",
      }}
    >
      <Link
        href="/"
        style={{ textDecoration: "none", fontSize: 13, color: "#6b5a44", fontWeight: 500 }}
      >
        ← 回湯湯屋
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          border: "none", cursor: "pointer", background: "#3f7a4a",
          fontFamily: "var(--font-noto-serif), 'Noto Serif TC', serif",
          fontWeight: 600, fontSize: 15, color: "#faf4e6", padding: "12px 24px",
          borderRadius: 14, boxShadow: "0 10px 24px -8px rgba(45,90,65,.5)",
        }}
      >
        列印這一頁
      </button>
    </div>
  );
}
