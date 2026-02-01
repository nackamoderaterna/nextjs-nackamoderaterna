import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/omrade", destination: "/politik/omrade", permanent: true },
      { source: "/omrade/:slug", destination: "/politik/omrade/:slug", permanent: true },
      {
        source: "/politik/((?!^(?:kategori|omrade|sakfragor)$)[^/]+)",
        destination: "/politik/kategori/$1",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
