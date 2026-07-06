import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // v1 內容網站的舊網址 → 週更體驗新版
    return [
      { source: "/missions", destination: "/", permanent: false },
      { source: "/missions/:slug", destination: "/", permanent: false },
      { source: "/about", destination: "/", permanent: false },
      { source: "/adventures", destination: "/", permanent: false },
      { source: "/adventures/:slug", destination: "/story", permanent: false },
      { source: "/characters", destination: "/friends", permanent: false },
      { source: "/characters/:slug", destination: "/friends", permanent: false },
      { source: "/soup-cards", destination: "/pot", permanent: false },
      { source: "/soup-cards/:slug", destination: "/pot", permanent: false },
      { source: "/stories", destination: "/", permanent: false },
      { source: "/themes/:slug", destination: "/story", permanent: false },
      { source: "/world", destination: "/map", permanent: false },
      { source: "/world/herbal-patch", destination: "/map/herbal-patch", permanent: false },
      { source: "/world/forest-post", destination: "/map/forest-post", permanent: false },
      { source: "/world/:slug", destination: "/map", permanent: false },
    ];
  },
};

export default nextConfig;
