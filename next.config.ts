import type { NextConfig } from 'next';

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=()' },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Development-only local MongoDB (see lib/dev-database.ts); spawns a native binary, so don't bundle it.
  serverExternalPackages: ['mongodb-memory-server'],
  sassOptions: {
    // Bootstrap 5.3 still relies on @import and global Sass functions. Hide the
    // resulting deprecation noise so real warnings in our own styles stand out.
    quietDeps: true,
    silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
  },
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
