// src/lib/database.ts
import mysql from 'mysql2/promise';

interface DatabaseConfig {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    waitForConnections: boolean;
    connectionLimit: number;
    queueLimit: number;
    acquireTimeout: number;
    timeout: number;
    reconnect: boolean;
    charset: string;
}

const dbConfig: DatabaseConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Dhito024',
    database: process.env.DB_DATABASE || 'simonras_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    acquireTimeout: 60000,
    timeout: 60000,
    reconnect: true,
    charset: 'utf8mb4'
};

// Create connection pool
export const db = mysql.createPool(dbConfig);

// Test connection function
export async function testConnection() {
    try {
        const connection = await db.getConnection();
        console.log('✅ Database connected successfully');
        console.log('📊 Database info:', {
            host: dbConfig.host,
            port: dbConfig.port,
            database: dbConfig.database,
            user: dbConfig.user
        });

        // Test simple query
        const [rows] = await connection.execute('SELECT 1 as test');
        console.log('🧪 Test query result:', rows);

        connection.release();
        return true;
    } catch (error: any) {
        console.error('❌ Database connection failed:');
        console.error('Error details:', error.message);
        console.error('Error code:', error.code);
        console.error('Error errno:', error.errno);
        return false;
    }
}

// Execute query helper function
export async function executeQuery(query: string, params: any[] = []) {
    try {
        const [rows] = await db.execute(query, params);
        return { success: true, data: rows };
    } catch (error: any) {
        console.error('Query execution error:', error.message);
        return { success: false, error: error.message };
    }
}

// Get single record helper
export async function findOne(query: string, params: any[] = []) {
    const result = await executeQuery(query, params);
    if (result.success && Array.isArray(result.data) && result.data.length > 0) {
        return result.data[0];
    }
    return null;
}

// Get multiple records helper
export async function findMany(query: string, params: any[] = []) {
    const result = await executeQuery(query, params);
    if (result.success) {
        return result.data || [];
    }
    return [];
}