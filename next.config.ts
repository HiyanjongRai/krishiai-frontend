import type { NextConfig } from "next";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? "http://localhost:8080";

const nextConfig: NextConfig = {
  // Proxy /api/* → Spring Boot backend (avoids browser CORS issues)
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${BACKEND_URL}/api/:path*`,
      },
    ];
  },
  // Allow optimized images from localhost (backend-served avatars, etc.)
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

