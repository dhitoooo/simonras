// src/app/auth/signin/page.tsx
'use client';

import { useState } from 'react';
import { signIn, getSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

export default function SignInPage() {
    const [nrp, setNrp] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [debugInfo, setDebugInfo] = useState(''); // Add debug info
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setDebugInfo(''); // Clear debug info

        try {
            console.log('Attempting login for NRP:', nrp); // Debug log

            const result = await signIn('credentials', {
                nrp,
                password,
                redirect: false,
            });

            console.log('SignIn result:', result); // Debug log
            setDebugInfo(`SignIn result: ${JSON.stringify(result, null, 2)}`);

            if (result?.error) {
                console.error('SignIn error:', result.error);
                setError('NRP atau password salah');
                setDebugInfo(`Error: ${result.error}`);
            } else if (result?.ok) {
                // Check user session and redirect accordingly
                const session = await getSession();
                console.log('Session after login:', session); // Debug log
                setDebugInfo(`Session: ${JSON.stringify(session, null, 2)}`);

                if (session) {
                    console.log('Redirecting to dashboard...');
                    router.push('/dashboard');
                } else {
                    setError('Sesi tidak dapat dibuat');
                    setDebugInfo('Session is null after successful login');
                }
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Terjadi kesalahan. Silakan coba lagi.');
            setDebugInfo(`Exception: ${error}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800">
            <div className="max-w-md w-full mx-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-lg mb-4">
                        <span className="text-2xl font-bold text-blue-600">S</span>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">SIMONRAS</h1>
                    <p className="text-blue-100">Sistem Monitoring Unjuk Rasa</p>
                    <p className="text-blue-200 text-sm">Polres Metro Jakarta Utara</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-xl p-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Masuk ke Sistem</h2>
                        <p className="text-gray-600">Gunakan NRP dan password Anda</p>

                        {/* Test credentials helper */}
                        <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                            <strong>Test:</strong> NRP: 12345678, Password: test123
                        </div>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            {error}
                        </div>
                    )}

                    {/* Debug info - only show in development */}
                    {process.env.NODE_ENV === 'development' && debugInfo && (
                        <div className="mb-4 p-3 bg-gray-100 border border-gray-300 rounded-lg">
                            <details>
                                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                                    Debug Info
                                </summary>
                                <pre className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">
                                    {debugInfo}
                                </pre>
                            </details>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-1">
                                NRP
                            </label>
                            <input
                                id="nrp"
                                type="text"
                                value={nrp}
                                onChange={(e) => setNrp(e.target.value)}
                                required
                                className="form-input"
                                placeholder="Contoh: 85111951"
                                disabled={isLoading}
                                autoComplete="username"
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="form-input pr-10"
                                    placeholder="Masukkan password"
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <EyeIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading || !nrp || !password}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                                isLoading || !nrp || !password
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            }`}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner mr-2"></div>
                                    Memproses...
                                </>
                            ) : (
                                'Masuk'
                            )}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Lupa password?{' '}
                            <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                                Hubungi Administrator
                            </a>
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-blue-100 text-sm">
                        © 2025 Polres Metro Jakarta Utara. All rights reserved.
                    </p>
                </div>
            </div>
        </div>
    );
}