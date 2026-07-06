import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora, Noto_Sans_TC, Noto_Serif_TC } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const notoSerifTC = Noto_Serif_TC({
  variable: "--font-noto-serif",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const notoSansTC = Noto_Sans_TC({
  variable: "--font-noto-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

export const metadata: Metadata = {
  title: "湯湯屋 Forest Soup House",
  description: "親子沉浸式週更故事體驗。每週一鍋故事湯，螢幕是起點，體驗在真實世界。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant">
      {/*
        suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
        attributes into <body> at runtime, causing a false-positive mismatch.
      */}
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${notoSerifTC.variable} ${notoSansTC.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
