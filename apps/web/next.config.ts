import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  // Include content directory in all serverless functions
  outputFileTracingIncludes: {
    "/*": ["./content/**/*.json"],
  },
};

export default nextConfig;
