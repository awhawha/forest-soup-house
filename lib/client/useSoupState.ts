"use client";

/**
 * 訂閱湯湯屋 client 狀態 — soup-changed / storage / focus 時重新讀取。
 * 首次 render 一律回傳 fallback（與 SSR 一致，避免 hydration mismatch），
 * mount 後才讀 localStorage。
 * 用法：const cooked = useSoupState(getCooked, 0);
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { SOUP_CHANGED } from "@/lib/client/weekProgress";

function useSoupStateInternal<T>(
  readFn: () => T,
  fallback: T,
  intervalMs: number | null,
): T {
  const readRef = useRef<() => T>(() => fallback);
  const [value, setValue] = useState<T>(fallback);

  useEffect(() => {
    readRef.current = readFn;
  });

  const refresh = useCallback(() => {
    setValue(readRef.current());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener(SOUP_CHANGED, refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    const timer = intervalMs !== null ? setInterval(refresh, intervalMs) : null;
    return () => {
      window.removeEventListener(SOUP_CHANGED, refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
      if (timer !== null) clearInterval(timer);
    };
  }, [refresh, intervalMs]);

  return value;
}

export function useSoupState<T>(readFn: () => T, fallback: T): T {
  return useSoupStateInternal(readFn, fallback, null);
}

/** 額外每 intervalMs 重讀一次（晾曬架倒數、郵局回信時間到） */
export function useSoupStateTicking<T>(
  readFn: () => T,
  fallback: T,
  intervalMs = 30_000,
): T {
  return useSoupStateInternal(readFn, fallback, intervalMs);
}

/**
 * 目前時間（timestamp）。SSR / 首次 render 回傳 0，mount 後才有真值——
 * 用 0 當「還不知道現在幾點」的哨兵（倒數類 UI 先顯示未完成狀態）。
 */
export function useNow(intervalMs = 30_000): number {
  const [now, setNow] = useState(0);
  useEffect(() => {
    // rAF 延後首次更新，避免 effect 內同步 setState 造成串聯 render
    const raf = requestAnimationFrame(() => setNow(Date.now()));
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(timer);
    };
  }, [intervalMs]);
  return now;
}
