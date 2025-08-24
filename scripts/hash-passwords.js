// scripts/hash-passwords.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function hashPasswords() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'simonras_db',
    };

    console.log('🔐 SIMONRAS Password Hash Script');
    console.log('='.repeat(50));

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');

        // 1. Hash existing plain text passwords (jika ada kolom 'password')
        console.log('\n📝 Checking for existing plain text passwords...');
        try {
            const [usersWithPlainPassword] = await connection.query(`
                SELECT id, nrp, nama, password 
                FROM users 
                WHERE password IS NOT NULL 
                AND password != ''
                AND (password_hash IS NULL OR password_hash = '')
            `);

            if (usersWithPlainPassword.length > 0) {
                console.log(`Found ${usersWithPlainPassword.length} users with plain text passwords`);

                for (const user of usersWithPlainPassword) {
                    const hashedPassword = await bcrypt.hash(user.password, 12);

                    await connection.query(
                        'UPDATE users SET password_hash = ? WHERE id = ?',
                        [hashedPassword, user.id]
                    );

                    console.log(`✅ Hashed password for ${user.nama} (NRP: ${user.nrp})`);
                }
            } else {
                console.log('No plain text passwords found');
            }
        } catch (error) {
            console.log('⚠️  Column "password" tidak ada, skip plain text password migration');
        }

        // 2. Create test users untuk development
        console.log('\n👤 Creating test users...');

        const testUsers = [
            {
                nrp: '12345678',
                nama: 'Admin Test',
                email: 'admin@simonras.local',
                fungsi: 'Admin',
                jabatan: 'KOMPOL',
                polsek: 'Polres Metro Jakarta Utara',
                phone: '08123456789',
                password: 'admin123'
            },
            {
                nrp: '87654321',
                nama: 'Operator Test',
                email: 'operator@simonras.local',
                fungsi: 'Ops',
                jabatan: 'AIPTU',
                polsek: 'Polres Metro Jakarta Utara',
                phone: '08987654321',
                password: 'user123'
            },
            {
                nrp: '11111111',
                nama: 'Kapolsek Test',
                email: 'kapolsek@simonras.local',
                fungsi: 'Kapolsek',
                jabatan: 'KOMPOL',
                polsek: 'Polsek Penjagaan',
                phone: '08111111111',
                password: 'kapolsek123'
            }
        ];

        console.log('Test user credentials:');
        console.table(testUsers.map(u => ({
            NRP: u.nrp,
            Nama: u.nama,
            Fungsi: u.fungsi,
            Password: u.password
        })));

        for (const testUser of testUsers) {
            const hashedPassword = await bcrypt.hash(testUser.password, 12);

            try {
                await connection.query(`
                    INSERT INTO users (nrp, nama, email, fungsi, jabatan, polsek, phone, password_hash, is_active) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)
                    ON DUPLICATE KEY UPDATE 
                    password_hash = VALUES(password_hash),
                    nama = VALUES(nama),
                    email = VALUES(email),
                    fungsi = VALUES(fungsi),
                    jabatan = VALUES(jabatan),
                    polsek = VALUES(polsek),
                    phone = VALUES(phone),
                    is_active = VALUES(is_active)
                `, [
                    testUser.nrp,
                    testUser.nama,
                    testUser.email,
                    testUser.fungsi,
                    testUser.jabatan,
                    testUser.polsek,
                    testUser.phone,
                    hashedPassword
                ]);

                console.log(`✅ Created/Updated: ${testUser.nama}`);

            } catch (error) {
                console.log(`⚠️  Error creating ${testUser.nama}:`, error.message);
            }
        }

        // 3. Verify hasil
        console.log('\n🔍 Verification:');
        const [allUsers] = await connection.query(`
            SELECT nrp, nama, fungsi, 
                   CASE WHEN password_hash IS NOT NULL AND password_hash != '' 
                        THEN 'READY' ELSE 'NO HASH' END as status
            FROM users 
            ORDER BY nrp
        `);

        console.table(allUsers);

        const [stats] = await connection.query(`
            SELECT 
                COUNT(*) as total_users,
                SUM(CASE WHEN password_hash IS NOT NULL AND password_hash != '' THEN 1 ELSE 0 END) as with_hash,
                SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active_users
            FROM users
        `);

        console.log('\n📊 Statistics:');
        console.table(stats);

        console.log('\n🎉 Password hashing completed!');
        console.log('\n🚀 You can now login with:');
        console.log('   NRP: 12345678, Password: admin123 (Admin)');
        console.log('   NRP: 87654321, Password: user123 (Operator)');
        console.log('   NRP: 11111111, Password: kapolsek123 (Kapolsek)');

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

hashPasswords().catch(console.error);