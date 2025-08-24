// types/next-pwa.d.ts
declare module 'next-pwa' {
    import type { NextConfig } from 'next';

    interface PWAOptions {
        dest: string;
        register?: boolean;
        skipWaiting?: boolean;
        disable?: boolean;
        runtimeCaching?: any;
        buildExcludes?: RegExp[];
        // tambahkan opsi lain kalau dibutuhkan
        [key: string]: any;
    }

    export default function withPWA(
        pwaOptions: PWAOptions
    ): (nextConfig: NextConfig) => NextConfig;
}

declare module 'next-pwa/cache' {
    const runtimeCaching: any;
    export default runtimeCaching;
}
