import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	output: "export",
	env: {
		NEXT_PUBLIC_API_URL: "https://www.chesspuzzlemaker.com/back_php/controllers/",
	},
	basePath: "", // The subdirectory for static assets
	assetPrefix: "", // Correctly point to where static files are hosted
	trailingSlash: true, // Ensures URLs end with a slash for static hosting
};

export default nextConfig;
