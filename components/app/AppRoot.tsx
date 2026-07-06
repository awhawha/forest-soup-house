"use client";

/**
 * 進入閘門：本機沒有小孩檔案 → 強制 Onboarding；有了 → 四分頁 app。
 * mounted 前顯示 splash，避免 SSR 與 localStorage 不一致造成閃爍。
 */
import { useEffect, useState } from "react";
import type { ForestPlace, Resident, WeekBundle, WeekCardInfo } from "@/lib/weekly";
import { hasOnboarded } from "@/lib/client/profile";
import { Onboarding } from "@/components/app/Onboarding";
import { AppShell } from "@/components/app/AppShell";
import { serifTC } from "@/components/app/PhoneFrame";

interface AppRootProps {
  week: WeekBundle;
  weekCards: WeekCardInfo[];
  residents: Resident[];
  places: ForestPlace[];
}

export function AppRoot(props: AppRootProps) {
  const [mounted, setMounted] = useState(false);
  const [onboarded, setOnboarded] = useState(false);

  useEffect(() => {
    // rAF：把 client-only 讀取推遲出同步 effect 階段，避免串聯 render 警告
    const id = requestAnimationFrame(() => {
      setMounted(true);
      setOnboarded(hasOnboarded());
    });
    return () => cancelAnimationFrame(id);
  }, []);

  if (!mounted) {
    return (
      <div style={{ position: "absolute", inset: 0, background: "#f4ead2", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ ...serifTC, fontSize: 22, fontWeight: 700, color: "#3a2f22" }}>湯湯屋</p>
      </div>
    );
  }

  if (!onboarded) {
    return <Onboarding onDone={() => setOnboarded(true)} />;
  }

  return <AppShell {...props} />;
}
