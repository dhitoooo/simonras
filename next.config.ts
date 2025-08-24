// next.config.ts
import type { NextConfig } from 'next';
import withPWA from 'next-pwa';
import runtimeCaching from 'next-pwa/cache';

const withPWANext = withPWA({
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'localhost', port: '3000', pathname: '/**' },
        ],
        // atau cukup: domains: ['localhost'],
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                ],
            },
        ];
    },

    // optional:
    // experimental: { reactCompiler: true },
};

export default withPWANext(nextConfig);
