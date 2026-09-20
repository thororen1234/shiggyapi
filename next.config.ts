import type { NextConfig } from "next"

const nextConfig: NextConfig = {
    output: "standalone",
    outputFileTracingIncludes: {
        "/*": [
            "./node_modules/.pnpm/@img+sharp*/**/*",
            "./src/assets/petpet.png",
        ],
    },
}

export default nextConfig
