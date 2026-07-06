"use client";

/**
 * 小孩檔案（本機，無帳號）— Onboarding 結尾寫入，之後只從大人的門編輯。
 * key 沿用設計稿：soupHouseProfileV1。
 */
import { emitSoupChanged } from "@/lib/client/weekProgress";

const KEY = "soupHouseProfileV1";

export interface Profile {
  name: string;
  age: string; // "3".."7" | "8+"
  companion: string;
  onboarded: boolean;
  updatedAt: number;
}

export function getProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Profile) : null;
  } catch {
    return null;
  }
}

export function hasOnboarded(): boolean {
  return !!getProfile()?.onboarded;
}

export function saveProfile(p: { name: string; age: string; companion: string }): void {
  if (typeof window === "undefined") return;
  const prev = getProfile();
  const next: Profile = {
    ...prev,
    name: p.name,
    age: p.age,
    companion: p.companion,
    onboarded: true,
    updatedAt: Date.now(),
  };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    /* quota: 靜默 */
  }
  emitSoupChanged();
}
