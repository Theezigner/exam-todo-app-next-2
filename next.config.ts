import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress the workspace root warning by explicitly setting the root
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
