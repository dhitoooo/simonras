// src/app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/database';

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const [rows] = await db.execute(`
      SELECT e.*, u.nama as created_by_name 
      FROM unras_events e 
      LEFT JOIN users u ON e.created_by = u.id 
      ORDER BY e.tanggal_mulai DESC
    `);

        return NextResponse.json({ data: rows });
    } catch (error) {
        console.error('Events API error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            kode_operasi,
            nama_kegiatan,
            lokasi,
            latitude,
            longitude,
            tanggal_mulai,
            jumlah_massa_estimasi,
            organisasi_penyelenggara,
            tujuan_aksi,
            risk_level
        } = body;

        const [result] = await db.execute(`
      INSERT INTO unras_events (
        kode_operasi, nama_kegiatan, lokasi, latitude, longitude,
        tanggal_mulai, jumlah_massa_estimasi, organisasi_penyelenggara,
        tujuan_aksi, risk_level, created_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            kode_operasi, nama_kegiatan, lokasi, latitude, longitude,
            tanggal_mulai, jumlah_massa_estimasi, organisasi_penyelenggara,
            tujuan_aksi, risk_level, 1 // TODO: Get from session
        ]);

        return NextResponse.json({
            message: 'Event created successfully',
            data: { id: (result as any).insertId }
        });
    } catch (error) {
        console.error('Create event error:', error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}