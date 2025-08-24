// scripts/update-user-password.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function updateUserPassword() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_DATABASE || 'simonras_db',
    };

    console.log('🔐 Update Password untuk User Existing');
    console.log('='.repeat(50));

    let connection;
    try {
        connection = await mysql.createConnection(config);
        console.log('✅ Connected to database');

        // Password updates untuk user existing berdasarkan hasil test database
        const passwordUpdates = [
            {
                nrp: '85111951',  // DEDE CHANDRA GUNAWAN
                nama: 'DEDE CHANDRA GUNAWAN',
                newPassword: 'dede123'
            },
            {
                nrp: '12345678',  // Budi Santoso
                nama: 'Budi Santoso',
                newPassword: 'budi123'
            },
            {
                nrp: '87654321',  // Sari Dewi
                nama: 'Sari Dewi',
                newPassword: 'sari123'
            },
            {
                nrp: '99000001',  // Administrator
                nama: 'Administrator',
                newPassword: 'admin123'
            }
        ];

        console.log('\n🔄 Updating passwords for existing users...');
        console.log('New credentials akan jadi:');
        console.table(passwordUpdates.map(u => ({
            NRP: u.nrp,
            Nama: u.nama,
            Password_Baru: u.newPassword
        })));

        for (const update of passwordUpdates) {
            try {
                // Hash password baru
                const hashedPassword = await bcrypt.hash(update.newPassword, 12);

                // Update user
                const [result] = await connection.query(
                    'UPDATE users SET password_hash = ? WHERE nrp = ?',
                    [hashedPassword, update.nrp]
                );

                if (result.affectedRows > 0) {
                    console.log(`✅ Updated password for ${update.nama} (NRP: ${update.nrp})`);
                } else {
                    console.log(`⚠️  User ${update.nrp} not found`);
                }
            } catch (error) {
                console.error(`❌ Error updating ${update.nama}:`, error.message);
            }
        }

        // Verify update
        console.log('\n🔍 Verification - Updated users:');
        const [updatedUsers] = await connection.query(`
            SELECT nrp, nama, fungsi, is_active,
                   CASE WHEN password_hash IS NOT NULL AND password_hash != '' 
                        THEN 'READY' ELSE 'NO HASH' END as password_status
            FROM users
            WHERE nrp IN ('85111951', '12345678', '87654321', '99000001')
            ORDER BY nrp
        `);
        console.table(updatedUsers);

        console.log('\n🎉 Password update completed!');
        console.log('\n🚀 You can now login with:');
        passwordUpdates.forEach(u => {
            console.log(`   NRP: ${u.nrp}, Password: ${u.newPassword} (${u.nama})`);
        });

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

updateUserPassword().catch(console.error);