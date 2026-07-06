"use client";

/**
 * 拍照／選照片 → 存進 IndexedDB → 回傳 photoId。
 * 手機會開相機（capture=environment），桌機開檔案選擇。
 */
import { useRef, useState } from "react";
import { savePhoto } from "@/lib/client/photoStore";

interface PhotoCaptureProps {
  onSaved: (photoId: string) => void;
  children: React.ReactNode;
  /** 外層樣式（按鈕外觀由呼叫端決定） */
  style?: React.CSSProperties;
  className?: string;
  disabled?: boolean;
}

export function PhotoCapture({ onSaved, children, style, className, disabled }: PhotoCaptureProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const id = await savePhoto(file);
      onSaved(id);
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      disabled={disabled || busy}
      style={{ ...style, opacity: busy ? 0.6 : undefined }}
      className={className}
    >
      {children}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
    </button>
  );
}
