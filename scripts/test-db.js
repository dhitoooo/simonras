// scripts/test-db.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function testDatabaseConnection() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'simonras_db',
    };

    console.log('🧪 Testing SIMONRAS Database Connection');
    console.log('📋 Config:', {
        ...config,
        password: config.password ? '***' : 'EMPTY'
    });
    console.log('='.repeat(60));

    let connection;
    try {
        // Test connection
        connection = await mysql.createConnection(config);
        console.log('✅ Database connection BERHASIL!');

        // Test users table exists
        try {
            const [tables] = await connection.query(`
                SELECT TABLE_NAME 
                FROM INFORMATION_SCHEMA.TABLES 
                WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users'
            `, [config.database]);

            if (tables.length === 0) {
                console.log('❌ Table "users" tidak ditemukan!');
                return;
            }
            console.log('✅ Table "users" ditemukan');
        } catch (err) {
            console.log('❌ Error checking table:', err.message);
            return;
        }

        // Check users count
        const [countResult] = await connection.query('SELECT COUNT(*) as count FROM users');
        const userCount = countResult[0].count;
        console.log(`📊 Total users: ${userCount}`);

        if (userCount === 0) {
            console.log('⚠️  Tidak ada data users! Jalankan script/hash-passwords.js untuk membuat test user');
            return;
        }

        // Show table structure
        console.log('\n📋 Struktur table users:');
        const [columns] = await connection.query('DESCRIBE users');
        console.table(columns.map(col => ({
            Field: col.Field,
            Type: col.Type,
            Null: col.Null,
            Key: col.Key,
            Default: col.Default
        })));

        // Show sample users (hide sensitive data)
        console.log('\n👥 Sample users:');
        const [sampleUsers] = await connection.query(`
            SELECT 
                id, nrp, nama, email, fungsi, is_active,
                CASE 
                    WHEN password_hash IS NOT NULL AND password_hash != '' 
                    THEN 'TERSEDIA' 
                    ELSE 'KOSONG' 
                END as password_status
            FROM users 
            LIMIT 10
        `);
        console.table(sampleUsers);

        // Check for users without password_hash
        const [usersWithoutPassword] = await connection.query(`
            SELECT nrp, nama 
            FROM users 
            WHERE password_hash IS NULL OR password_hash = ''
        `);

        if (usersWithoutPassword.length > 0) {
            console.log('\n⚠️  Users tanpa password hash:');
            console.table(usersWithoutPassword);
            console.log('💡 Jalankan: node scripts/hash-passwords.js');
        } else {
            console.log('\n✅ Semua users sudah memiliki password hash');
        }

        // Check active users
        const [activeUsers] = await connection.query('SELECT COUNT(*) as count FROM users WHERE is_active = 1');
        console.log(`\n✅ Active users: ${activeUsers[0].count}`);

        console.log('\n🎉 Database test SELESAI!');

    } catch (error) {
        console.error('\n❌ Database connection GAGAL!');
        console.error('Error:', error.message);

        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('\n💡 Solusi:');
            console.log('1. Periksa username/password di .env.local');
            console.log('2. Pastikan MySQL server berjalan');
            console.log('3. Pastikan database "simonras_db" sudah dibuat');
        }

        if (error.code === 'ECONNREFUSED') {
            console.log('\n💡 Solusi:');
            console.log('1. Pastikan MySQL server berjalan');
            console.log('2. Periksa DB_HOST dan DB_PORT di .env.local');
        }
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

// Jalankan test
testDatabaseConnection().catch(console.error);