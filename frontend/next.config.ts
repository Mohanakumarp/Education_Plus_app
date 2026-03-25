import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* React Compiler */
  reactCompiler: true,

  /* Image optimization */
  images: {
    formats: ["image/webp", "image/avif"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  /* Build optimization */
  productionBrowserSourceMaps: false, // Disable source maps in production to reduce bundle size
  compress: true,

  /* Experimental features for better performance */
  experimental: {
    // Enable caching for faster component rendering
    cacheComponents: true,
  },

  /* Webpack optimization */
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization = {
        ...config.optimization,
        // Enable code splitting
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendors",
              priority: 10,
              reuseExistingChunk: true,
            },
            // Separate recharts (heavy library)
            recharts: {
              test: /[\\/]node_modules[\\/]recharts[\\/]/,
              name: "recharts",
              priority: 20,
              reuseExistingChunk: true,
            },
            // Separate framer-motion
            motion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: "framer-motion",
              priority: 20,
              reuseExistingChunk: true,
            },
            // Common chunks used across pages
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
