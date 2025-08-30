/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable transpilation of local packages
  transpilePackages: [],
  
  // Environment variables
  env: {
    APP_VERSION: process.env.npm_package_version || '1.0.0',
    BUILD_TIME: new Date().toISOString(),
  },
  
  // API proxy for development
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8000/api/:path*', // Proxy to FastAPI backend
      },
    ];
  },
  
  // Headers for security and CORS
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Output configuration for deployment
  output: 'standalone',
  
  // Compress responses
  compress: true,
  
  // Generate ETags for better caching
  generateEtags: true,
  
  // Power off Next.js header
  poweredByHeader: false,
  
  // Webpack configuration for custom modules
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle Keycloak JS modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      crypto: require.resolve('crypto-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer'),
    };

    // Provide polyfills for Node.js modules in browser
    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      })
    );

    return config;
  },
  
  // TypeScript configuration
  typescript: {
    ignoreBuildErrors: true,
  },

  // ESLint configuration
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Images configuration for optimization
  images: {
    domains: ['localhost', 'makrx.org'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Experimental features
  experimental: {
    // Enable modern builds
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
