import type { NextConfig } from "next";
import { fa } from "zod/v4/locales";

const nextConfig: NextConfig = {
  devIndicators: false,
  reactStrictMode: false,
  // typedRoutes: true,
  // compiler: {
  //   styledComponents: true, // Enable SWC transform for styled-components
  // },
  // experimental: {
  //   optimizePackageImports: ["@mui/material", "@mui/icons-material"],
  // },
  images: {
    // loader: "custom",
    remotePatterns: [
      {
        protocol: "https", // or 'http' if needed
        hostname: "avatars.githubusercontent.com",
        port: "", // leave empty unless using custom port
        pathname: "/**", // match all paths
      },
      {
        protocol: "https", // or 'http' if needed
        hostname: "cloudflare-ipfs.com",
        port: "", // leave empty unless using custom port
        pathname: "/**", // match all paths
      },
      {
        protocol: "http", // or 'http' if needed
        hostname: "127.0.0.1",
        port: "54321", // leave empty unless using custom port
        pathname: "/storage/v1/object/public/**", // match all paths
      },
      {
        protocol: "http", // or 'http' if needed
        hostname: "localhost",
        port: "3000", // leave empty unless using custom port
        pathname: "/storage/v1/object/public/**", // match all paths
      },
      // {
      //   protocol: 'https',
      //   hostname: 'xyzsupabase.co',
      //   pathname: '/storage/v1/object/public/**',
      // },
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
