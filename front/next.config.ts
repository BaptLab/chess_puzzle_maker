import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/chess_puzzle_maker", // Update this to your subdirectory
  assetPrefix: "/chess_puzzle_maker", // Ensures assets are correctly loaded
  trailingSlash: true, // Ensures URLs end with a slash for static hosting
  /* other config options here */
};

export default nextConfig;
