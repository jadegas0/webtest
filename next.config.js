/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [],
  },
  // Three.js uses 'exports' field — this ensures modules resolve properly
  transpilePackages: ['three'],
}

module.exports = nextConfig
