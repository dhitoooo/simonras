'use client';

import { useState, useEffect } from 'react';
import { CalendarIcon, MapPinIcon, UsersIcon } from '@heroicons/react/24/outline';

interface Event {
    id: number;
    kode_operasi: string;
    nama_kegiatan: string;
    lokasi: string;
    jumlah_massa_estimasi: number;
    risk_level: string;
    status_event: string;
}

export function ActiveEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch active events
        fetch('/api/events?status=active')
            .then(res => res.json())
            .then(data => {
                setEvents(data.data || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const getRiskColor = (riskLevel: string) => {
        switch (riskLevel) {
            case 'Sangat Tinggi': return 'bg-red-500';
            case 'Tinggi': return 'bg-orange-500';
            case 'Sedang': return 'bg-yellow-500';
            default: return 'bg-green-500';
        }
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                    <div className="h-16 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-4 border-b border-gray-200">
                <h2 className="font-semibold flex items-center">
                    <CalendarIcon className="h-5 w-5 mr-2 text-blue-600" />
                    Event Aktif
                </h2>
            </div>

            <div className="space-y-2 p-4">
                {events.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Tidak ada event aktif</p>
                ) : (
                    events.map((event) => (
                        <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                                <h3 className="font-medium text-sm">{event.nama_kegiatan}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs text-white ${getRiskColor(event.risk_level)}`}>
                  {event.risk_level}
                </span>
                            </div>

                            <div className="space-y-1 text-xs text-gray-600">
                                <div className="flex items-center">
                                    <MapPinIcon className="h-3 w-3 mr-1" />
                                    <span>{event.lokasi}</span>
                                </div>
                                <div className="flex items-center">
                                    <UsersIcon className="h-3 w-3 mr-1" />
                                    <span>Estimasi: {event.jumlah_massa_estimasi} orang</span>
                                </div>
                            </div>

                            <div className="mt-2 text-xs">
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {event.kode_operasi}
                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}