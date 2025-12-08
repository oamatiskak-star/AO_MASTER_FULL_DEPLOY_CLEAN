/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ["lucide-react"],
    turbo: {
      rules: {}
    }
  },
  images: {
    formats: ["image/avif", "image/webp"]
  },
  compiler: {
    removeConsole: true
  }
}

export default nextConfig
