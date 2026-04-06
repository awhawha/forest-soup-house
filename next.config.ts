import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/missions", destination: "/adventures", permanent: true },
      { source: "/missions/:slug", destination: "/adventures/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
