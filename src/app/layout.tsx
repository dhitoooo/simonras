import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Providers } from './providers';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'SIMONRAS - Sistem Monitoring Unjuk Rasa',
    description: 'Aplikasi PWA untuk monitoring dan manajemen risiko unjuk rasa Polri',
    manifest: '/manifest.json',
    icons: { apple: '/icons/icon-152x152.png' },
    applicationName: 'SIMONRAS',
    themeColor: '#1e40af',            // ✅ gunakan field resmi
    appleWebApp: {                    // ✅ set apple web app meta
        capable: true,
        statusBarStyle: 'default',
        title: 'SIMONRAS',
    },
};

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="id">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}
