import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    root: path.resolve(__dirname, "..", ".."),
  },
  allowedDevOrigins: [
    "*.replit.dev",
    "*.repl.co",
    "*.kirk.replit.dev",
  ],
};

export default nextConfig;
