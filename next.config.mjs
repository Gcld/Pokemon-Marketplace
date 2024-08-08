/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    async rewrites() {
      return [
        {
          source: '/pokemon/:name',
          destination: '/pokemon/[name]',
        },
      ];
    },
  };
  
  export default nextConfig;