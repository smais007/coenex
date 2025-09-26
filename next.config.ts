import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '15mb', // Increase limit for file uploads (with some buffer)
    },
  },
};

export default nextConfig;
