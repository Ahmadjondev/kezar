import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kezar.soften.uz",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8012",
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8012"}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
