// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
const nextConfig = {
  // Configuración de imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "openweathermap.org",
      },
    ],
  },
};

export default nextConfig;
