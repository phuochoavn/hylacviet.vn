const checkEnvVariables = require("./check-env-variables")

checkEnvVariables()

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Enable standalone output for Docker
  output: 'standalone',

  // Optimize images
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "api.hylacviet.vn",
      },
      {
        protocol: "https",
        hostname: "medusa-public-images.s3.eu-west-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "medusa-server-testing.s3.us-east-1.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "cdn.hylacviet.vn",
      },
      {
        protocol: "https",
        hostname: "minio.hylacviet.vn",
      },
      {
        protocol: "https",
        hostname: "api.hylacviet.vn",
      },
    ],
  },

  // Skip type checking during build
  typescript: {
    ignoreBuildErrors: true,
  },

  // Skip linting during build
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
