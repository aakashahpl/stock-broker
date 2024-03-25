/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'zerodha.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'static2.finnhub.io',
        pathname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '**',
      },
    ],
  },
};


export default nextConfig;
