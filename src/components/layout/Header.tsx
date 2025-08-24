'use client';

import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import {
    BellIcon,
    UserCircleIcon,
    Cog6ToothIcon,
    ChevronDownIcon,
    MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

export function Header() {
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [notifications] = useState([
        { id: 1, title: 'Laporan Baru', message: 'Massa bertambah di Tanjung Priok', time: '2 menit lalu', urgent: true },
        { id: 2, title: 'Update Situasi', message: 'Kondisi Penjaringan kondusif', time: '5 menit lalu', urgent: false },
        { id: 3, title: 'Request Bantuan', message: 'Butuh personel tambahan', time: '10 menit lalu', urgent: true }
    ]);
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="bg-blue-600 text-white shadow-lg">
            <div className="flex items-center justify-between px-6 py-4">
                {/* Logo & Title */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-bold text-sm">S</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">SIMONRAS</h1>
                            <p className="text-xs text-blue-200">Sistem Monitoring Unjuk Rasa</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <input
                            type="text"
                            placeholder="Cari event, lokasi, atau personel..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-blue-500 text-white placeholder-blue-200 border border-blue-400 focus:outline-none focus:ring-2 focus:ring-white"
                        />
                        <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-blue-200" />
                    </div>
                </div>

                {/* Right Side - Notifications & User Menu */}
                <div className="flex items-center space-x-4">
                    {/* Status Indicator */}
                    <div className="hidden lg:flex items-center space-x-2 bg-blue-500 px-3 py-1 rounded-full">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm">Online</span>
                    </div>

                    {/* Notifications */}
                    <div className="relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="p-2 rounded-full hover:bg-blue-500 transition-colors relative"
                        >
                            <BellIcon className="h-6 w-6" />
                            {notifications.some(n => n.urgent) && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50 text-black">
                                <div className="p-3 border-b">
                                    <h3 className="font-semibold">Notifikasi</h3>
                                </div>
                                <div className="max-h-96 overflow-y-auto">
                                    {notifications.map((notif) => (
                                        <div key={notif.id} className={`p-3 border-b hover:bg-gray-50 ${notif.urgent ? 'border-l-4 border-l-red-500' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-medium text-sm">{notif.title}</p>
                                                    <p className="text-gray-600 text-xs">{notif.message}</p>
                                                </div>
                                                <span className="text-xs text-gray-400">{notif.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="p-3 text-center">
                                    <button className="text-blue-600 text-sm hover:underline">Lihat Semua</button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* User Menu */}
                    <div className="relative">
                        <button
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            className="flex items-center space-x-2 p-2 rounded-full hover:bg-blue-500 transition-colors"
                        >
                            <UserCircleIcon className="h-8 w-8" />
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium">{session?.user?.name || 'User'}</p>
                                <p className="text-xs text-blue-200">{session?.user?.email || 'user@polri.go.id'}</p>
                            </div>
                            <ChevronDownIcon className="h-4 w-4" />
                        </button>

                        {/* User Dropdown */}
                        {showUserMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50 text-black">
                                <div className="p-3 border-b">
                                    <p className="font-medium">{session?.user?.name}</p>
                                    <p className="text-sm text-gray-600">{session?.user?.email}</p>
                                </div>
                                <div className="py-2">
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                        <UserCircleIcon className="h-4 w-4" />
                                        <span>Profile</span>
                                    </button>
                                    <button className="w-full text-left px-3 py-2 hover:bg-gray-100 flex items-center space-x-2">
                                        <Cog6ToothIcon className="h-4 w-4" />
                                        <span>Settings</span>
                                    </button>
                                    <hr className="my-2" />
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left px-3 py-2 hover:bg-gray-100 text-red-600"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
