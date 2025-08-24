'use client';

import {
    CalendarIcon,
    UsersIcon,
    ExclamationTriangleIcon,
    DocumentTextIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

interface StatCard {
    title: string;
    value: string;
    change: string;
    changeType: 'increase' | 'decrease';
    icon: React.ElementType;
    color: string;
}

export function StatsCards() {
    const stats: StatCard[] = [
        {
            title: 'Active Events',
            value: '3',
            change: '+2 dari kemarin',
            changeType: 'increase',
            icon: CalendarIcon,
            color: 'bg-blue-500'
        },
        {
            title: 'Personel On Duty',
            value: '127',
            change: 'dari 189 total',
            changeType: 'increase',
            icon: UsersIcon,
            color: 'bg-green-500'
        },
        {
            title: 'High Risk Events',
            value: '1',
            change: '-1 dari kemarin',
            changeType: 'decrease',
            icon: ExclamationTriangleIcon,
            color: 'bg-red-500'
        },
        {
            title: 'Live Reports',
            value: '24',
            change: '+8 hari ini',
            changeType: 'increase',
            icon: DocumentTextIcon,
            color: 'bg-yellow-500'
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                            <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-6 w-6 text-white" />
                        </div>
                    </div>
                    <div className="mt-4 flex items-center">
                        {stat.changeType === 'increase' ? (
                            <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                        ) : (
                            <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                        )}
                        <span className={`text-sm ${
                            stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                        }`}>
              {stat.change}
            </span>
                    </div>
                </div>
            ))}
        </div>
    );
}