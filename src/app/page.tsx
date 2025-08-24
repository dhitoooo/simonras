// src/app/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    MapIcon,
    DevicePhoneMobileIcon,
    ChartBarIcon,
    ShieldCheckIcon,
    ArrowRightIcon,
} from '@heroicons/react/24/outline';

export default function HomePage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard');
        }
    }, [status, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-600">
                <div className="text-center">
                    <div className="spinner-lg mx-auto mb-4" />
                    <p className="text-white">Memuat...</p>
                </div>
            </div>
        );
    }

    const features = [
        {
            icon: MapIcon,
            title: 'Real-time Monitoring',
            description: 'Pantau situasi unjuk rasa secara langsung dengan peta interaktif',
            color: 'bg-blue-500',
        },
        {
            icon: DevicePhoneMobileIcon,
            title: 'Mobile PWA',
            description: 'Input laporan cepat dari lapangan dengan GPS otomatis',
            color: 'bg-green-500',
        },
        {
            icon: ChartBarIcon,
            title: 'Risk Analytics',
            description: 'Analisis risiko berdasarkan data historis dan situasi terkini',
            color: 'bg-orange-500',
        },
        {
            icon: ShieldCheckIcon,
            title: 'Secure & Reliable',
            description: 'Sistem keamanan tingkat tinggi untuk data operasional',
            color: 'bg-red-500',
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700">
            {/* Header */}
            <nav className="bg-white/10 backdrop-blur-md border-b border-white/20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between py-4">
                        <div className="flex items-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <span className="text-sm font-bold text-blue-600">S</span>
                            </div>
                            <div>
                                <h1 className="font-bold text-white">SIMONRAS</h1>
                                <p className="text-xs text-blue-100">Polres Metro Jakarta Utara</p>
                            </div>
                        </div>
                        <Link
                            href="/auth/signin"
                            className="rounded-lg bg-white px-4 py-2 font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50"
                        >
                            Masuk Sistem
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Hero */}
            <div className="mx-auto max-w-7xl px-4 pb-16 pt-20 sm:px-6 lg:px-8">
                <div className="text-center">
                    <h1 className="mb-6 text-4xl font-bold text-white md:text-6xl">
                        Sistem Monitoring
                        <span className="block text-blue-200">Unjuk Rasa</span>
                    </h1>
                    <p className="mx-auto mb-8 max-w-3xl text-xl text-blue-100">
                        Platform PWA terintegrasi untuk monitoring real-time, manajemen risiko, dan
                        koordinasi lintas fungsi dalam pengamanan unjuk rasa yang humanis.
                    </p>

                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Link href="/auth/signin" className="btn-primary group flex items-center justify-center px-8 py-3 text-lg">
                            Mulai Monitoring
                            <ArrowRightIcon className="ml-2 h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/mobile"
                            className="rounded-lg border border-white/20 bg-white/20 px-8 py-3 font-medium text-white backdrop-blur-md transition-colors duration-200 hover:bg-white/30"
                        >
                            Mode Mobile
                        </Link>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-white">Fitur Utama</h2>
                    <p className="text-lg text-blue-100">Dirancang sesuai kebutuhan operasional Polres Metro Jakarta Utara</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {features.map((feature, idx) => (
                        <div
                            key={idx}
                            className="rounded-lg border border-white/20 bg-white/10 p-6 backdrop-blur-md transition-colors duration-300 hover:bg-white/20"
                        >
                            <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.color}`}>
                                <feature.icon className="h-6 w-6 text-white" />
                            </div>
                            <h3 className="mb-2 text-xl font-semibold text-white">{feature.title}</h3>
                            <p className="text-blue-100">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats */}
            <div className="border-y border-white/20 bg-white/10 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
                        {[
                            ['189', 'Total Personel'],
                            ['6', 'Polsek Wilayah'],
                            ['150+', 'Event/Tahun'],
                            ['24/7', 'Monitoring'],
                        ].map(([value, label]) => (
                            <div key={label} className="text-center">
                                <div className="mb-2 text-3xl font-bold text-white">{value}</div>
                                <div className="text-blue-100">{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Developer Quickstart (gabungan konten Next starter) */}
            <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
                <div className="rounded-2xl border border-white/20 bg-white/10 p-8 text-center text-white backdrop-blur-md">
                    <div className="mb-8 flex items-center justify-center">
                        <Image className="dark:invert" src="/next.svg" alt="Next.js logo" width={180} height={38} priority />
                    </div>

                    <ol className="mx-auto mb-6 list-inside list-decimal text-sm/6 font-mono text-blue-100 sm:text-left md:max-w-2xl">
                        <li className="mb-2 tracking-[-.01em]">
                            Get started by editing{' '}
                            <code className="rounded bg-black/20 px-1 py-0.5 font-mono font-semibold dark:bg-white/10">src/app/page.tsx</code>.
                        </li>
                        <li className="tracking-[-.01em]">Save and see your changes instantly.</li>
                    </ol>

                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                        <a
                            className="flex h-12 items-center justify-center gap-2 rounded-full bg-foreground px-5 font-medium text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
                            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image className="dark:invert" src="/vercel.svg" alt="Vercel logomark" width={20} height={20} />
                            Deploy now
                        </a>
                        <a
                            className="h-12 w-full rounded-full border border-black/10 px-5 font-medium transition-colors hover:bg-white/20 sm:w-auto md:w-[158px] dark:border-white/20"
                            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Read our docs
                        </a>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-blue-200">
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                            href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image aria-hidden src="/file.svg" alt="File icon" width={16} height={16} />
                            Learn
                        </a>
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                            href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image aria-hidden src="/window.svg" alt="Window icon" width={16} height={16} />
                            Examples
                        </a>
                        <a
                            className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                            href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
                            Go to nextjs.org →
                        </a>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
                <h2 className="mb-4 text-3xl font-bold text-white">Siap untuk Implementasi?</h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg text-blue-100">
                    Bergabunglah dengan sistem monitoring terdepan untuk meningkatkan efektivitas pengamanan dan kepercayaan
                    masyarakat.
                </p>
                <Link href="/auth/signin" className="btn-primary inline-flex items-center px-8 py-3 text-lg">
                    Akses Sistem Sekarang
                    <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
            </div>

            {/* Footer */}
            <footer className="border-t border-white/20 bg-blue-900/50">
                <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="mb-4 flex items-center justify-center space-x-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                                <span className="text-sm font-bold text-blue-600">S</span>
                            </div>
                            <span className="font-semibold text-white">SIMONRAS</span>
                        </div>
                        <p className="mb-4 text-blue-100">Sistem Monitoring Unjuk Rasa - Polres Metro Jakarta Utara</p>
                        <div className="flex justify-center space-x-6 text-sm text-blue-200">
                            <span>© 2025 Polri. All rights reserved.</span>
                            <span>•</span>
                            <a href="#" className="hover:text-white">
                                Privacy Policy
                            </a>
                            <span>•</span>
                            <a href="#" className="hover:text-white">
                                Terms of Service
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
