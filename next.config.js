/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    ELEVENLABS_API_KEY: process.env.ELEVENLABS_API_KEY,
  },
}

module.exports = nextConfig 