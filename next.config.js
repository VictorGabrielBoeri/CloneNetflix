/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuração para deploy estático no Netlify
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configurações existentes
  experimental: {
    appDir: true
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_TMDB_API_KEY: process.env.NEXT_PUBLIC_TMDB_API_KEY,
  }
}

module.exports = nextConfig