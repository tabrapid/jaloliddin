import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    // The root layout lives under app/[lang], so unmatched URLs outside the
    // locale tree need a standalone 404 document.
    globalNotFound: true,
  },
};

export default nextConfig;
