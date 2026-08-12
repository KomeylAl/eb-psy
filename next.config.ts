import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  reactCompiler: true,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "api.ebrazclinic.ir" }, { protocol: "http", hostname: "localhost" }],
  },
};

export default nextConfig;
