import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    ppr: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: "avatar.vercel.sh",
      },
      {
        protocol: "https",
        hostname: process.env.IMAGE_HOST as string,
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
