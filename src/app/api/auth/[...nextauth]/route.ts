// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, User } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import mysql, { RowDataPacket } from 'mysql2/promise';
import bcrypt from 'bcryptjs';

// Database user interface
interface DatabaseUser extends RowDataPacket {
    id: number;
    nrp: string;
    nama: string;
    email?: string;
    fungsi: string;
    jabatan?: string;
    polsek?: string;
    password_hash: string;
    is_active: number;
}

// Extended NextAuth User interface
interface ExtendedUser extends User {
    role: string;
    nrp: string;
    jabatan?: string;
    polsek?: string;
}

// Extended JWT interface
interface ExtendedJWT extends JWT {
    role?: string;
    nrp?: string;
    jabatan?: string;
    polsek?: string;
}

// Database configuration
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_DATABASE = process.env.DB_DATABASE || 'simonras_db';

console.log('🔧 NextAuth Config - Database:', {
    DB_HOST,
    DB_PORT,
    DB_USER,
    DB_DATABASE,
    hasPassword: !!DB_PASSWORD
});

// Fixed pool configuration - removed invalid options
const pool = mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    connectTimeout: 60000,
    // Removed 'timeout' and 'enableKeepAlive' - invalid options
});

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'NRP & Password',
            credentials: {
                nrp: { label: 'NRP', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials): Promise<ExtendedUser | null> {
                const startTime = Date.now();
                console.log('\n🔐 === AUTHENTICATION ATTEMPT ===');
                console.log('📝 NRP:', credentials?.nrp);
                console.log('⏰ Time:', new Date().toISOString());

                // Validate input
                if (!credentials?.nrp || !credentials?.password) {
                    console.log('❌ Missing credentials');
                    return null;
                }

                try {
                    // Database query with proper typing
                    console.log('🔍 Querying database for user...');
                    const [rows] = await pool.query<DatabaseUser[]>(
                        'SELECT id, nrp, nama, email, fungsi, jabatan, polsek, password_hash, is_active FROM users WHERE nrp = ? LIMIT 1',
                        [credentials.nrp]
                    );

                    const user = rows[0] || null;
                    console.log('📊 Database query result:', {
                        found: !!user,
                        nrp: user?.nrp,
                        nama: user?.nama,
                        fungsi: user?.fungsi,
                        is_active: user?.is_active,
                        has_password_hash: !!user?.password_hash
                    });

                    // Check user exists
                    if (!user) {
                        console.log('❌ User not found in database');
                        return null;
                    }

                    // Check user is active
                    if (!user.is_active) {
                        console.log('❌ User account is inactive');
                        return null;
                    }

                    // Check password hash exists
                    if (!user.password_hash) {
                        console.log('❌ No password hash found for user');
                        return null;
                    }

                    // Verify password
                    console.log('🔐 Verifying password...');
                    const passwordMatch = await bcrypt.compare(credentials.password, user.password_hash);
                    console.log('🔐 Password verification result:', passwordMatch);

                    if (!passwordMatch) {
                        console.log('❌ Password does not match');
                        return null;
                    }

                    // Success
                    const authTime = Date.now() - startTime;
                    console.log('✅ Authentication SUCCESS');
                    console.log('👤 User:', {
                        id: user.id,
                        nrp: user.nrp,
                        nama: user.nama,
                        fungsi: user.fungsi
                    });
                    console.log('⏱️  Auth time:', authTime + 'ms');
                    console.log('🔐 === AUTHENTICATION END ===\n');

                    return {
                        id: String(user.id),
                        name: user.nama,
                        email: user.email ?? `${user.nrp}@simonras.local`,
                        role: user.fungsi,
                        nrp: user.nrp,
                        jabatan: user.jabatan,
                        polsek: user.polsek,
                    } as ExtendedUser;

                } catch (error) {
                    console.error('💥 Database/Auth error:', error);
                    console.log('🔐 === AUTHENTICATION FAILED ===\n');
                    return null;
                }
            },
        }),
    ],
    session: {
        strategy: 'jwt',
        maxAge: 24 * 60 * 60, // 24 hours
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    callbacks: {
        async jwt({ token, user }): Promise<ExtendedJWT> {
            console.log('🎫 JWT Callback - User:', !!user, 'Token keys:', Object.keys(token));
            if (user) {
                const extendedUser = user as ExtendedUser;
                token.role = extendedUser.role;
                token.nrp = extendedUser.nrp;
                token.jabatan = extendedUser.jabatan;
                token.polsek = extendedUser.polsek;
                console.log('🎫 JWT updated with user data');
            }
            return token as ExtendedJWT;
        },
        async session({ session, token }) {
            console.log('🏛️  Session Callback - Token keys:', Object.keys(token));
            if (session.user) {
                const extendedToken = token as ExtendedJWT;
                (session.user as ExtendedUser).role = extendedToken.role || '';
                (session.user as ExtendedUser).nrp = extendedToken.nrp || '';
                (session.user as ExtendedUser).jabatan = extendedToken.jabatan;
                (session.user as ExtendedUser).polsek = extendedToken.polsek;
                console.log('🏛️  Session updated with token data');
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };