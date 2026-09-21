import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "standalone",
    outputFileTracingIncludes: {
        "/*": [
            "./node_modules/.pnpm/@img+sharp*/**/*.node",
            "./node_modules/.pnpm/@img+sharp*/**/*.so*",
            "./node_modules/.pnpm/@img+sharp*/**/*.dylib",
            "./node_modules/.pnpm/@img+sharp*/**/*.dll",
            "./node_modules/.pnpm/@img+sharp*/**/*.cjs",
            "./node_modules/.pnpm/@img+sharp*/**/*.js",
            "./node_modules/.pnpm/@img+sharp*/**/*.json",
            "./src/assets/petpet.png",
        ],
    },
}

export default nextConfig
