import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Allow access to remote image placeholder.
  images: {
    qualities: [75, 90, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'files-locals.thaipbs.or.th',
        port: '',
        pathname: '/**',
      },
    ],
  },
  output: 'standalone',

};

export default nextConfig;
