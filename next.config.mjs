/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Mover el cache de webpack fuera del directorio de output
  // para que Cloudflare Pages no lo incluya en los assets
  webpack: (config, { buildId, dev, isServer }) => {
    if (!dev && !isServer) {
      config.cache = {
        type: "filesystem",
        cacheDirectory: require("path").resolve(".next-cache"),
      };
    }
    return config;
  },
};

export default nextConfig;
