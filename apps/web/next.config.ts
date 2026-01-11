import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "public-files.gumroad.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/cronologico",
        destination: "/transtextos",
        permanent: true,
      },
      {
        source: "/playlist",
        destination: "/",
        permanent: true,
      },
      {
        source: "/contacto",
        destination: "/publica",
        permanent: true,
      },
      {
        source: "/autores",
        destination: "/transtextos/autores",
        permanent: true,
      },
      {
        source: "/series",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
