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
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
    };
    return config;
  },
};

export default nextConfig;
