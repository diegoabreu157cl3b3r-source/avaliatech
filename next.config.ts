import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.1.56:3000"],
  experimental: {
    cpus: 1
  }
};

export default nextConfig;
