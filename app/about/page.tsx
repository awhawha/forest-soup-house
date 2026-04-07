import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = {
  title: "關於湯湯屋",
  description:
    "湯湯屋是親子一起玩的地方：故事、採集、煮湯與延伸閱讀，在日常裡找到一點點魔法。",
};

const sections = [
  {
    title: "湯湯屋是什麼",
    body: (
      <>
        <p>湯湯屋是一個親子一起玩的地方。</p>
        <p className="mt-sp-4">
          不需要準備什麼，不需要學規則。只需要一點點時間，和一個想一起玩的大人。
        </p>
      </>
    ),
  },
  {
    title: "日常就是魔法",
    body: (
      <>
        <p>
          菲娜是一隻住在森林裡的小狐狸，她相信最好的湯料就藏在日常裡。一朵路邊的花、雨後的泥土味、早餐的麵包香。
        </p>
        <p className="mt-sp-4">湯湯屋想做的事很簡單：給親子一個開始的理由。</p>
      </>
    ),
  },
  {
    title: "怎麼玩",
    body: (
      <>
        <ol className="list-decimal space-y-sp-2 pl-sp-6 marker:font-medium marker:text-moss">
          <li>讀一個故事</li>
          <li>跟著故事去找材料</li>
          <li>把材料放進鍋裡煮湯</li>
          <li>做一個小冒險或自然手作</li>
          <li>用一本書繼續這個主題</li>
        </ol>
        <p className="mt-sp-4 text-sm text-wood-muted">
          每次大概 15 到 30 分鐘。可以一次做完，也可以分幾天慢慢來。
        </p>
      </>
    ),
  },
  {
    title: "為什麼這樣做",
    body: (
      <>
        <p>
          感官探索是 3 到 7 歲孩子發展很重要的一部分。但不是每個大人都知道怎麼開始。
        </p>
        <p className="mt-sp-4">
          湯湯屋把這件事包在故事裡。不是課程，不是任務，就是一起去找一個聞起來像森林的味道。
        </p>
        <p className="mt-sp-4">孩子在玩，大人也在玩。</p>
      </>
    ),
  },
  {
    title: "關於菲娜和森林",
    body: (
      <>
        <p>
          菲娜住在森林裡的湯湯屋，她的朋友有波飛、里洛，還有偶爾跑來搗蛋的卷卷臭襪怪。
        </p>
        <p className="mt-sp-4">
          這個森林有地圖、有故事、有每天不一樣的湯。慢慢探索，你們會找到自己喜歡的角落。
        </p>
        <div className="mt-sp-8">
          <Link
            href="/world"
            className="btn btn-primary btn-md inline-flex min-h-tap-target items-center justify-center"
          >
            走進森林 →
          </Link>
        </div>
      </>
    ),
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-paper text-wood">
      <PageHero
        title="About the Soup House"
        titleZh="關於湯湯屋"
        subtitle="A gentle place for grown-ups and little ones to play together."
        subtitleZh="給親子一起慢下來、一起玩的小小角落。"
      />

      <div className="mx-auto max-w-2xl px-page-px pb-sp-16 sm:px-page-px-sm sm:pb-sp-20">
        <div className="space-y-sp-12">
          {sections.map((section, i) => (
            <article
              key={section.title}
              className={`border-t border-border-paper pt-sp-10 ${i === 0 ? "border-t-0 pt-0" : ""}`}
            >
              <h2 className="font-heading text-lg font-medium text-moss sm:text-xl">{section.title}</h2>
              <div className="mt-sp-4 text-base leading-relaxed text-wood">{section.body}</div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
