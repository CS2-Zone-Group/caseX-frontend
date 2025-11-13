/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['steamcdn-a.akamaihd.net', 'community.cloudflare.steamstatic.com'],
  },
}

module.exports = nextConfig
