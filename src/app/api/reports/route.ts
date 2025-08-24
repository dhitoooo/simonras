// src/app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { db } from '@/lib/database';

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession();
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const {
            event_id,
            report_type,
            title,
            description,
            latitude,
            longitude,
            urgency_level,
            jumlah_massa_terkini,
            kondisi_massa
        } = body;

        const [result] = await db.execute(`
      INSERT INTO live_reports (
        event_id, reporter_id, report_type, title, description,
        latitude, longitude, urgency_level, jumlah_massa_terkini, kondisi_massa
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
            event_id, 1, report_type, title, description, // TODO: Get reporter_id from session
            latitude, longitude, urgency_level, jumlah_massa_terkini, kondisi_massa
        ]);

        // TODO: Implement WebSocket broadcast for real-time updates

        return NextResponse.json({
            message: 'Report created successfully',
            data: { id: (result as any).insertId }
        });
    } catch (error) {
        console.error('Create report error:', error);
        return NextResponse.json({ error: 'Failed to create report' }, { status: 500 });
    }
}