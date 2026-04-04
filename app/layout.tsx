import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Lora } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
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

export const metadata: Metadata = {
  title: "Forest Soup House",
  description: "A gentle story world where soup is magic. For children and families.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/*
        suppressHydrationWarning: browser extensions (e.g. Grammarly) inject
        attributes like data-gr-ext-installed into <body> at runtime, causing
        a server/client HTML mismatch. This prop silences that false positive.
        It only suppresses warnings one level deep — child components are unaffected.
      */}
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} antialiased min-h-screen flex flex-col`}
      >
        <SiteHeader />
        <main className="box-border min-h-0 flex-1 bg-paper pt-[var(--site-header-offset)]">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
