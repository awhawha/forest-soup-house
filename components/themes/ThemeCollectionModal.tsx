"use client";

import { useEffect } from "react";

interface CollectionConfirmBodyProps {
  ingredientName: string;
  finaResponse: string;
  onConfirm: () => void;
  titleId?: string;
}

/** 桌面 modal 與手機確認抽屜共用的內文 */
export function CollectionConfirmBody({
  ingredientName,
  finaResponse,
  onConfirm,
  titleId = "theme-collect-modal-title",
}: CollectionConfirmBodyProps) {
  return (
    <>
      <p className="text-center text-5xl leading-none" aria-hidden>
        ✿
      </p>
      <h2 id={titleId} className="font-heading mt-sp-4 text-center text-xl font-medium text-wood">
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
    </>
  );
}

interface ThemeCollectionModalProps {
  open: boolean;
  ingredientName: string;
  finaResponse: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

/**
 * 主題包採集完成 pop-up（桌面版）：fixed 覆蓋視窗，對話框置於目前可見畫面中央（不需捲動頁面）。
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-wood/45 px-sp-4 py-sp-10 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="theme-collect-modal-title"
    >
      <div className="animate-modal-scale-in w-full max-w-sm rounded-2xl border border-border-paper bg-paper-card px-sp-6 py-sp-8 shadow-[var(--shadow-warm)]">
        <CollectionConfirmBody
          ingredientName={ingredientName}
          finaResponse={finaResponse}
          onConfirm={onConfirm}
        />
      </div>
    </div>
  );
}

interface ThemeCollectionConfirmSheetProps {
  open: boolean;
  ingredientName: string;
  finaResponse: string;
  onConfirm: () => void;
  onDismiss?: () => void;
}

/** 手機版：固定於底部的確認抽屜（與採集抽屜同系統） */
export function ThemeCollectionConfirmSheet({
  open,
  ingredientName,
  finaResponse,
  onConfirm,
  onDismiss,
}: ThemeCollectionConfirmSheetProps) {
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
    <>
      <button
        type="button"
        className="fixed inset-0 z-[60] bg-[rgba(0,0,0,0.3)] md:hidden"
        aria-label="關閉"
        onClick={onDismiss}
      />
      <div
        className="fixed bottom-0 left-0 z-[61] flex max-h-[70vh] w-full translate-y-0 flex-col overflow-y-auto rounded-t-2xl bg-paper-card px-sp-5 pb-sp-6 pt-sp-3 shadow-[var(--shadow-warm)] transition-transform duration-300 ease-out md:hidden"
        style={{ borderRadius: "16px 16px 0 0" }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-collect-sheet-title"
      >
        <div className="flex flex-col items-center">
          <div className="mb-3 h-[3px] w-8 shrink-0 rounded-full bg-wood-muted/35" aria-hidden />
        </div>
        <div className="px-sp-1 pb-sp-2">
          <CollectionConfirmBody
            ingredientName={ingredientName}
            finaResponse={finaResponse}
            onConfirm={onConfirm}
            titleId="theme-collect-sheet-title"
          />
        </div>
      </div>
    </>
  );
}
