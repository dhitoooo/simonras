'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    HomeIcon,
    MapIcon,
    DocumentTextIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    ChartBarIcon,
    CogIcon,
    DevicePhoneMobileIcon,
    EyeIcon,
    CalendarIcon,
    ShieldCheckIcon,
    BellAlertIcon,
    ChevronLeftIcon,
    ChevronRightIcon
} from '@heroicons/react/24/outline';

const navigation = [
    {
        name: 'Dashboard',
        href: '/dashboard',
        icon: HomeIcon,
        description: 'Overview & statistik'
    },
    {
        name: 'Peta Real-time',
        href: '/dashboard/map',
        icon: MapIcon,
        description: 'Monitoring lokasi'
    },
    {
        name: 'Event Management',
        href: '/dashboard/events',
        icon: CalendarIcon,
        description: 'Kelola unjuk rasa',
        children: [
            { name: 'Daftar Event', href: '/dashboard/events' },
            { name: 'Buat Event Baru', href: '/dashboard/events/create' },
            { name: 'Risk Assessment', href: '/dashboard/events/risk' }
        ]
    },
    {
        name: 'Live Reports',
        href: '/dashboard/reports',
        icon: DocumentTextIcon,
        description: 'Laporan lapangan',
        badge: '12'
    },
    {
        name: 'Personel Management',
        href: '/dashboard/personnel',
        icon: UsersIcon,
        description: 'Manajemen SDM',
        children: [
            { name: 'Daftar Personel', href: '/dashboard/personnel' },
            { name: 'Assignment', href: '/dashboard/personnel/assignment' },
            { name: 'Performance', href: '/dashboard/personnel/performance' }
        ]
    },
    {
        name: 'Risk Management',
        href: '/dashboard/risk',
        icon: ExclamationTriangleIcon,
        description: 'Analisis risiko'
    },
    {
        name: 'Analytics',
        href: '/dashboard/analytics',
        icon: ChartBarIcon,
        description: 'Laporan & analisis'
    },
    {
        name: 'Monitoring',
        href: '/dashboard/monitoring',
        icon: EyeIcon,
        description: 'CCTV & surveillance'
    },
    {
        name: 'Alerts & Notifications',
        href: '/dashboard/alerts',
        icon: BellAlertIcon,
        description: 'Sistem peringatan'
    },
    {
        name: 'Mobile Interface',
        href: '/mobile',
        icon: DevicePhoneMobileIcon,
        description: 'Interface mobile'
    }
];

const adminNavigation = [
    {
        name: 'System Settings',
        href: '/dashboard/settings',
        icon: CogIcon,
        description: 'Konfigurasi sistem'
    },
    {
        name: 'User Management',
        href: '/dashboard/users',
        icon: ShieldCheckIcon,
        description: 'Kelola pengguna'
    }
];

export function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const toggleExpand = (itemName: string) => {
        setExpandedItems(prev =>
            prev.includes(itemName)
                ? prev.filter(item => item !== itemName)
                : [...prev, itemName]
        );
    };

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    return (
        <div className={`bg-white shadow-lg transition-all duration-300 ${
            collapsed ? 'w-16' : 'w-64'
        } flex flex-col`}>
            {/* Collapse Toggle */}
            <button
                onClick={() => setCollapsed(!collapsed)}
                className="absolute -right-3 top-20 bg-blue-600 text-white p-1 rounded-full shadow-lg hover:bg-blue-700 z-10"
            >
                {collapsed ? (
                    <ChevronRightIcon className="h-4 w-4" />
                ) : (
                    <ChevronLeftIcon className="h-4 w-4" />
                )}
            </button>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                {/* Main Navigation */}
                <div className="space-y-1">
                    {navigation.map((item) => (
                        <div key={item.name}>
                            <div className="group relative">
                                {item.children ? (
                                    // Expandable Item
                                    <button
                                        onClick={() => toggleExpand(item.name)}
                                        className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                            expandedItems.includes(item.name)
                                                ? 'bg-blue-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                                        {!collapsed && (
                                            <>
                                                <span className="flex-1 text-left">{item.name}</span>
                                                <ChevronRightIcon className={`h-4 w-4 transform transition-transform ${
                                                    expandedItems.includes(item.name) ? 'rotate-90' : ''
                                                }`} />
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    // Regular Link
                                    <Link
                                        href={item.href}
                                        className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors relative ${
                                            isActive(item.href)
                                                ? 'bg-blue-600 text-white'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                                        {!collapsed && (
                                            <>
                                                <span>{item.name}</span>
                                                {item.badge && (
                                                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                            {item.badge}
                          </span>
                                                )}
                                            </>
                                        )}
                                    </Link>
                                )}

                                {/* Tooltip for collapsed state */}
                                {collapsed && (
                                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                        <div className="font-medium">{item.name}</div>
                                        <div className="text-xs text-gray-300">{item.description}</div>
                                    </div>
                                )}
                            </div>

                            {/* Submenu */}
                            {item.children && expandedItems.includes(item.name) && !collapsed && (
                                <div className="ml-8 mt-1 space-y-1">
                                    {item.children.map((child) => (
                                        <Link
                                            key={child.href}
                                            href={child.href}
                                            className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                                                isActive(child.href)
                                                    ? 'bg-blue-100 text-blue-600'
                                                    : 'text-gray-600 hover:bg-gray-100'
                                            }`}
                                        >
                                            {child.name}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Divider */}
                {!collapsed && <hr className="my-4" />}

                {/* Admin Section */}
                <div className="space-y-1">
                    {!collapsed && (
                        <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Administration
                        </h3>
                    )}
                    {adminNavigation.map((item) => (
                        <div key={item.name} className="group relative">
                            <Link
                                href={item.href}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                    isActive(item.href)
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-700 hover:bg-gray-100'
                                }`}
                            >
                                <item.icon className={`${collapsed ? 'mx-auto' : 'mr-3'} h-5 w-5 flex-shrink-0`} />
                                {!collapsed && <span>{item.name}</span>}
                            </Link>

                            {/* Tooltip for collapsed state */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                                    <div className="font-medium">{item.name}</div>
                                    <div className="text-xs text-gray-300">{item.description}</div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </nav>

            {/* Footer */}
            {!collapsed && (
                <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span>System Status: Online</span>
                    </div>
                    <div className="mt-1 text-xs text-gray-400">
                        Last sync: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            )}
        </div>
    );
}