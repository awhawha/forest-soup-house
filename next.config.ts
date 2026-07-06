import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // v2 是單頁四分頁 app；所有舊網址導回首頁（/print 保留）
    return [
      { source: "/missions", destination: "/", permanent: false },
      { source: "/missions/:slug", destination: "/", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      { source: "/adventures", destination: "/", permanent: false },
      { source: "/adventures/:slug", destination: "/", permanent: false },
      { source: "/characters", destination: "/", permanent: false },
      { source: "/characters/:slug", destination: "/", permanent: false },
      { source: "/soup-cards", destination: "/", permanent: false },
      { source: "/soup-cards/:slug", destination: "/", permanent: false },
      { source: "/stories", destination: "/", permanent: false },
      { source: "/themes/:slug", destination: "/", permanent: false },
      { source: "/story", destination: "/", permanent: false },
      { source: "/pot", destination: "/", permanent: false },
      { source: "/friends", destination: "/", permanent: false },
      { source: "/world", destination: "/", permanent: false },
      { source: "/world/:slug*", destination: "/", permanent: false },
      { source: "/map", destination: "/", permanent: false },
      { source: "/map/:slug*", destination: "/", permanent: false },
    ];
  },
};

export default nextConfig;
