import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },

  // Ensure Next *keeps* the trailing slash, matching the backend's /docs/
  trailingSlash: true,

  async rewrites() {
    return [
      // General backend proxy for app API calls
      { source: "/backend/:path*", destination: "http://localhost:3001/:path*" },

      // Swagger UI absolute paths — handle both with and without the slash
      { source: "/docs", destination: "http://localhost:3001/docs" },
      { source: "/docs/", destination: "http://localhost:3001/docs/" },
      { source: "/docs/:path*", destination: "http://localhost:3001/docs/:path*" },

      // OpenAPI JSON
      { source: "/openapi.json", destination: "http://localhost:3001/openapi.json" },
    ];
  },
};

export default nextConfig;