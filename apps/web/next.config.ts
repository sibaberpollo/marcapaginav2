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
  // Include content directory in serverless functions for runtime file access
  outputFileTracingIncludes: {
    "/articulo/[slug]": ["./content/**/*"],
    "/categoria/[slug]": ["./content/**/*"],
    "/api/articles": ["./content/**/*"],
  },
};

export default nextConfig;
