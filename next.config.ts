import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        // Supabase Storage
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Tienda Nube (por si importan imágenes existentes)
        protocol: "https",
        hostname: "*.mitiendanube.com",
      },
    ],
  },
};

export default nextConfig;
