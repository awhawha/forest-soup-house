"use client";

/**
 * 從 IndexedDB 讀照片顯示（photoId → object URL）。
 * 載入前／找不到時顯示 fallback。
 */
import { useEffect, useState } from "react";
import { getPhotoUrl } from "@/lib/client/photoStore";

interface PhotoImgProps {
  photoId: string | null | undefined;
  alt?: string;
  style?: React.CSSProperties;
  className?: string;
  fallback?: React.ReactNode;
}

export function PhotoImg({ photoId, alt = "", style, className, fallback }: PhotoImgProps) {
  // 以 { id, url } 成對保存，photoId 換了自然失效，不需在 effect 內同步重置
  const [loaded, setLoaded] = useState<{ id: string; url: string | null } | null>(null);

  useEffect(() => {
    if (!photoId) return;
    let cancelled = false;
    getPhotoUrl(photoId).then((url) => {
      if (!cancelled) setLoaded({ id: photoId, url });
    });
    return () => {
      cancelled = true;
    };
  }, [photoId]);

  const url = photoId && loaded?.id === photoId ? loaded.url : null;
  if (!photoId || !url) return <>{fallback ?? null}</>;
  // eslint-disable-next-line @next/next/no-img-element -- IndexedDB object URL
  return <img src={url} alt={alt} style={style} className={className} />;
}
