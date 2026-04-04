/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Tree-shake heavy packages at compile time
    optimizePackageImports: [
      "@mui/icons-material",
      "@mui/material",
      "recharts",
      "socket.io-client",
    ],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "steamcdn-a.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "steamcommunity-a.akamaihd.net",
      },
      {
        protocol: "https",
        hostname: "community.cloudflare.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.steamstatic.com",
      },
      {
        protocol: "https",
        hostname: "**.akamaihd.net",
      },
    ],
  },
};

module.exports = nextConfig;
