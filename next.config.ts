import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
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
