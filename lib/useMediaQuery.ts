"use client";

import { useSyncExternalStore } from "react";

/** 與 Tailwind `md` 斷點一致。SSR 時假設為窄版（false），避免與客戶端初次讀取不一致。 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
