"use client";

import Link from "next/link";

/** 手作列印頁頂部工具列（列印時隱藏）。 */
export function PrintToolbar() {
  return (
    <div
      className="shh-no-print"
      style={{
        maxWidth: "210mm",
        margin: "0 auto 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 8px",
      }}
    >
      <Link href="/" style={{ fontSize: 13, color: "#5b4a35", textDecoration: "none" }}>
        ← 回湯湯屋
      </Link>
      <button
        type="button"
        onClick={() => window.print()}
        style={{
          border: "none",
          cursor: "pointer",
          background: "#3f7a4a",
          color: "#faf4e6",
          fontFamily: "inherit",
          fontWeight: 700,
          fontSize: 13.5,
          padding: "9px 20px",
          borderRadius: 12,
        }}
      >
        列印這一頁
      </button>
    </div>
  );
}
