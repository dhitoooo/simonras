// src/types/index.ts
export interface User {
    id: number;
    nrp: string;
    nama: string;
    jabatan: string;
    fungsi: 'Intel' | 'Sabhara' | 'Lantas' | 'Humas' | 'Ops' | 'Admin';
    polsek?: string;
    phone?: string;
    email?: string;
    is_active: boolean;
    created_at: Date;
}

export interface UnrasEvent {
    id: number;
    kode_operasi: string;
    nama_kegiatan: string;
    lokasi: string;
    latitude?: number;
    longitude?: number;
    tanggal_mulai: Date;
    tanggal_selesai?: Date;
    jumlah_massa_estimasi: number;
    organisasi_penyelenggara?: string;
    tujuan_aksi?: string;
    status_event: 'Planned' | 'Ongoing' | 'Completed' | 'Cancelled';
    risk_level: 'Rendah' | 'Sedang' | 'Tinggi' | 'Sangat Tinggi';
    created_by: number;
    created_at: Date;
}

export interface LiveReport {
    id: number;
    event_id: number;
    reporter_id: number;
    report_type: 'Situasi' | 'Insiden' | 'Pergerakan Massa' | 'Request Bantuan' | 'Dokumentasi';
    title: string;
    description: string;
    latitude?: number;
    longitude?: number;
    urgency_level: 'Info' | 'Low' | 'Medium' | 'High' | 'Critical';
    jumlah_massa_terkini?: number;
    kondisi_massa?: 'Tertib' | 'Ricuh' | 'Anarchis';
    media_files?: string[];
    is_verified: boolean;
    verified_by?: number;
    created_at: Date;
    reporter?: User;
}