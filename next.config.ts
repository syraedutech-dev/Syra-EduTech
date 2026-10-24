import type { NextConfig } from "next";
import { resolve } from "node:path";
const cloudflare = process.env.SYRA_RUNTIME === "cloudflare";
const nextConfig: NextConfig = {
  trailingSlash: false,
  ...(!cloudflare ? {
    turbopack: { root: process.cwd(), resolveAlias: { "@/lib/platform": "./lib/platform-netlify.ts" } },
    outputFileTracingRoot: process.cwd(),
    webpack(config) {
      config.resolve.alias["@/lib/platform"] = resolve(process.cwd(), "lib/platform-netlify.ts");
      return config;
    },
  } satisfies Partial<NextConfig> : {}),
};
export default nextConfig;
