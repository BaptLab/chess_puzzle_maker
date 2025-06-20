import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	basePath: "", // The subdirectory for static assets
	assetPrefix: "", // Correctly point to where static files are hosted
	trailingSlash: true, // Ensures URLs end with a slash for static hosting
};

export default nextConfig;
