// src/app/api/test-db/route.ts
import { NextResponse } from 'next/server';
import { testConnection, executeQuery } from '@/lib/database';

export async function GET() {
    try {
        console.log('🔄 Testing database connection...');

        // Test basic connection
        const isConnected = await testConnection();

        if (!isConnected) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Failed to connect to database',
                    details: 'Check your .env.local configuration'
                },
                { status: 500 }
            );
        }

        // Test database exists
        const dbTest = await executeQuery('SELECT DATABASE() as current_db');

        // Test tables exist
        const tablesTest = await executeQuery('SHOW TABLES');

        return NextResponse.json({
            success: true,
            message: 'Database connection successful!',
            data: {
                connected: true,
                currentDatabase: dbTest.success ? dbTest.data : null,
                tablesCount: tablesTest.success ? (tablesTest.data as any[]).length : 0,
                tables: tablesTest.success ? tablesTest.data : []
            }
        });

    } catch (error: any) {
        console.error('Database test error:', error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
                details: 'Check server logs for more information'
            },
            { status: 500 }
        );
    }
}