'use client';

import {ClockIcon, DocumentTextIcon, MapPinIcon, UserIcon} from '@heroicons/react/24/outline';

interface Report {
    id: number;
    title: string;
    description: string;
    reporter_name: string;
    urgency_level: string;
    created_at: string;
    kondisi_massa?: string;
    jumlah_massa_terkini?: number;
}

interface RecentReportsProps {
    reports: Report[];
}

export function RecentReports({ reports }: RecentReportsProps) {
    const getUrgencyColor = (urgency: string) => {
        switch (urgency) {
            case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
            case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
            case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    const getKondisiColor = (kondisi?: string) => {
        switch (kondisi) {
            case 'Anarchis': return 'text-red-600';
            case 'Ricuh': return 'text-orange-600';
            case 'Tertib': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold">Live Reports</h2>
                <p className="text-sm text-gray-600">Laporan terbaru dari lapangan</p>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
                {reports.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">
                        <DocumentTextIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Belum ada laporan</p>
                    </div>
                ) : (
                    reports.map((report) => (
                        <div key={report.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-medium text-sm">{report.title}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(report.urgency_level)}`}>
                  {report.urgency_level}
                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3">{report.description}</p>

                            {/* Metadata */}
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <div className="flex items-center space-x-3">
                                    <div className="flex items-center space-x-1">
                                        <UserIcon className="h-3 w-3" />
                                        <span>{report.reporter_name}</span>
                                    </div>

                                    <div className="flex items-center space-x-1">
                                        <ClockIcon className="h-3 w-3" />
                                        <span>{new Date(report.created_at).toLocaleTimeString()}</span>
                                    </div>
                                </div>

                                {report.kondisi_massa && (
                                    <span className={`font-medium ${getKondisiColor(report.kondisi_massa)}`}>
                    {report.kondisi_massa}
                                        {report.jumlah_massa_terkini && ` (${report.jumlah_massa_terkini})`}
                  </span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="p-4 border-t border-gray-200 text-center">
                <button className="text-blue-600 text-sm hover:underline">
                    Lihat Semua Reports →
                </button>
            </div>
        </div>
    );
}
