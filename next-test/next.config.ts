import type {NextConfig} from "next";
import path from "path";

const nextConfig: NextConfig = {
    turbopack: {
        // Sets the absolute path to the directory containing next.config.ts
        root: path.join(__dirname),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'yourdomain.com', // Replace with your production domain
            },
            {
                protocol: 'http',
                hostname: 'localhost', // Allows local development testing
                port: '3000',
            },
        ],
    },
};

export default nextConfig;