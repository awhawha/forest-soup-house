"use client";

import { useCallback, useRef, useState } from "react";

type Lang = "zh" | "en";

interface MagicStoryHouseClientProps {
  imageSrc: string;
  imageAlt: string;
  audioSrc: string;
  /** Line under the room title, e.g. 聽一聽《…》的魔法故事 */
  subtitleZh: string;
  paragraphsZh: string[];
  paragraphsEn: string[];
  /** 插圖下（預設）或兩欄下方置中大按鈕（主題包頁用） */
  playButtonLayout?: "under-image" | "bottom-bar";
  /** 外層背景，預設 paper */
  shellClassName?: string;
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <path d="M8 7h8M8 11h6" />
    </svg>
  );
}

export function MagicStoryHouseClient({
  imageSrc,
  imageAlt,
  audioSrc,
  subtitleZh,
  paragraphsZh,
  paragraphsEn,
  playButtonLayout = "under-image",
  shellClassName,
}: MagicStoryHouseClientProps) {
  const [lang, setLang] = useState<Lang>("zh");
  const [textOpen, setTextOpen] = useState(true);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const paragraphs = lang === "zh" ? paragraphsZh : paragraphsEn;

  const togglePlay = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
      setPlaying(true);
    } else {
      el.pause();
      setPlaying(false);
    }
  }, []);

  const onAudioEnded = useCallback(() => setPlaying(false), []);
  const onAudioPause = useCallback(() => setPlaying(false), []);

  const playBtnClass =
    playButtonLayout === "bottom-bar"
      ? "inline-flex min-h-[3.25rem] w-full max-w-md items-center justify-center gap-3 rounded-full bg-[var(--world-cta)] px-sp-8 py-sp-4 text-base font-medium text-paper shadow-md transition-[transform,background-color] hover:bg-[var(--world-cta-hover)] active:scale-[0.99] sm:min-w-[min(100%,22rem)]"
      : "mt-sp-5 inline-flex min-h-tap-target items-center justify-center gap-2 rounded-full bg-[var(--world-cta)] px-sp-6 py-sp-3 text-sm font-medium text-paper shadow-sm transition-[transform,background-color] hover:bg-[var(--world-cta-hover)] active:scale-[0.98]";

  const shell =
    shellClassName ??
    (playButtonLayout === "bottom-bar"
      ? "border-b border-border-paper/60 bg-[#faf6ed] pb-sp-10 pt-sp-6 sm:pb-sp-14 sm:pt-sp-8"
      : "border-b border-border-paper/60 bg-paper pb-sp-10 pt-sp-6 sm:pb-sp-14 sm:pt-sp-8");

  const PlayButton = () => (
    <button type="button" onClick={togglePlay} className={playBtnClass}>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-paper/20 sm:h-10 sm:w-10">
        {playing ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden>
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 fill-current" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </span>
      {playing ? "暫停" : "播放故事"}
    </button>
  );

  return (
    <div className={shell}>
      <audio
        ref={audioRef}
        src={audioSrc}
        preload="metadata"
        onEnded={onAudioEnded}
        onPause={onAudioPause}
        onPlay={() => setPlaying(true)}
      />

      {/* Two columns */}
      <div className="mx-auto mt-sp-10 grid max-w-4xl gap-sp-8 px-page-px sm:px-page-px-sm lg:grid-cols-2 lg:items-start lg:gap-sp-10">
        {/* Left: art + play */}
        <div className="flex flex-col items-center lg:items-stretch">
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border-paper/80 bg-paper-card shadow-[var(--shadow-paper)] lg:max-w-none">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={imageAlt}
              className="aspect-square w-full object-cover sm:aspect-[4/5]"
            />
          </div>
          {playButtonLayout === "under-image" ? <PlayButton /> : null}
        </div>

        {/* Right: lang + body */}
        <div className="flex min-w-0 flex-col">
          <div className="flex justify-end gap-sp-4 text-sm">
            <button
              type="button"
              onClick={() => setLang("zh")}
              className={
                lang === "zh"
                  ? "font-medium text-moss"
                  : "text-wood-muted transition-colors hover:text-wood-soft"
              }
            >
              中文
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={
                lang === "en"
                  ? "font-medium text-moss"
                  : "text-wood-muted transition-colors hover:text-wood-soft"
              }
            >
              English
            </button>
          </div>

          {textOpen ? (
            <div className="mt-sp-6 space-y-4 text-base leading-relaxed text-wood">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          ) : null}

          <button
            type="button"
            onClick={() => setTextOpen((v) => !v)}
            className="mt-sp-6 self-start text-sm font-medium text-moss transition-colors hover:text-moss-hover"
          >
            {textOpen ? "收合故事 ▲" : "展開故事 ▼"}
          </button>
        </div>
      </div>

      {playButtonLayout === "bottom-bar" ? (
        <div className="mx-auto mt-sp-10 flex max-w-4xl justify-center px-page-px sm:px-page-px-sm">
          <PlayButton />
        </div>
      ) : null}
    </div>
  );
}
