"use client";

import { useEffect } from "react";

interface ThemeCollectionModalProps {
  open: boolean;
  ingredientName: string;
  finaResponse: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

/**
 * 主題包採集完成 pop-up。不使用 fixed：由外層 relative 容器 + absolute inset-0 定位。
 */
export function ThemeCollectionModal({
  open,
  ingredientName,
  finaResponse,
  onConfirm,
  onDismiss,
}: ThemeCollectionModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onDismiss]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-wood/45 px-sp-4 py-sp-10 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-collect-modal-title"
    >
      <div className="animate-modal-scale-in w-full max-w-sm rounded-2xl border border-border-paper bg-paper-card px-sp-6 py-sp-8 shadow-[var(--shadow-warm)]">
        <p className="text-center text-5xl leading-none" aria-hidden>
          ✿
        </p>
        <h2
          id="theme-collect-modal-title"
          className="font-heading mt-sp-4 text-center text-xl font-medium text-wood"
        >
          你找到了！
        </h2>
        <p className="mt-sp-3 text-center text-2xl font-medium text-moss">{ingredientName}</p>
        <p className="mt-sp-4 text-center text-sm leading-relaxed text-wood-muted">{finaResponse}</p>
        <button
          type="button"
          onClick={onConfirm}
          className="btn btn-primary btn-md mt-sp-6 inline-flex w-full min-h-tap-target items-center justify-center"
        >
          收進口袋 ✓
        </button>
      </div>
    </div>
  );
}
