'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
    // useEffect(() => {
    //     // Register service worker
    //     if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    //         navigator.serviceWorker
    //             .register('/sw.js')
    //             .then((registration) => {
    //                 console.log('SW registered: ', registration);
    //             })
    //             .catch((registrationError) => {
    //                 console.log('SW registration failed: ', registrationError);
    //             });
    //     }
    // }, []);

    return (
        <SessionProvider>
            {children}
        </SessionProvider>
    );
}
