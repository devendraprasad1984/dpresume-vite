import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
    turbopack: {
        // Sets the absolute path to the directory containing next.config.ts
        root: path.join(__dirname),
    },
};

export default nextConfig;