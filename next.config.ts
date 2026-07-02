import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Silencia el warning de workspace root con múltiples package-lock.json
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        // Fotos de perfil de Google (Firebase Auth + Google Sign-In)
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Firebase Storage
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
    ],
  },
};

export default nextConfig;
