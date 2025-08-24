/* eslint-disable @typescript-eslint/no-explicit-any */
import { executeQuery, findOne } from './database';
import bcrypt from 'bcryptjs';

export interface UserRow {
  id: number;
  nrp: string;
  nama: string;
  jabatan: string;
  fungsi: 'Intel' | 'Sabhara' | 'Lantas' | 'Humas' | 'Ops' | 'Admin';
  polsek: string | null;
  phone: string | null;
  email: string | null;
  is_active: number;
  created_at: Date;
  updated_at: Date;
}

export async function listUsers(
  page: number,
  pageSize: number,
  filter?: { q?: string; fungsi?: string; is_active?: boolean }
) {
  const offset = (page - 1) * pageSize;
  const where: string[] = [];
  const params: any[] = [];

  if (filter?.q) {
    const like = `%${filter.q}%`;
    where.push('(nrp LIKE ? OR nama LIKE ? OR email LIKE ? OR phone LIKE ?)');
    params.push(like, like, like, like);
  }
  if (filter?.fungsi) {
    where.push('fungsi = ?');
    params.push(filter.fungsi);
  }
  if (typeof filter?.is_active === 'boolean') {
    where.push('is_active = ?');
    params.push(filter.is_active ? 1 : 0);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';

  const totalRes = await executeQuery(
    `SELECT COUNT(*) AS total FROM users ${whereSql}`,
    params
  );
  const total = Number((totalRes.data as any)[0]?.total ?? 0);

  const rowsRes = await executeQuery(
    `SELECT id,nrp,nama,jabatan,fungsi,polsek,phone,email,is_active,created_at,updated_at
     FROM users ${whereSql}
     ORDER BY id DESC
     LIMIT ? OFFSET ?`,
    [...params, pageSize, offset]
  );
  const rows = (rowsRes.data as UserRow[]).map(r => ({ ...r, is_active: r.is_active ? 1 : 0 }));
  return { rows, total };
}

export async function getUser(id: number) {
  return findOne(`SELECT * FROM users WHERE id = ? LIMIT 1`, [id]);
}

export async function createUser(input: any) {
  const {
    nrp,
    nama,
    jabatan,
    fungsi,
    polsek,
    phone,
    email,
    password,
    is_active = true,
  } = input;

  const password_hash = await bcrypt.hash(password, 10);
  const res = await executeQuery(
    `INSERT INTO users (nrp,nama,jabatan,fungsi,polsek,phone,email,password_hash,is_active)
     VALUES (?,?,?,?,?,?,?,?,?)`,
    [nrp, nama, jabatan, fungsi, polsek ?? null, phone ?? null, email ?? null, password_hash, is_active ? 1 : 0]
  );
  return getUser((res as any).insertId);
}

export async function updateUser(id: number, input: any) {
  const allowed = ['nama', 'jabatan', 'fungsi', 'polsek', 'phone', 'email', 'is_active'];
  const sets: string[] = [];
  const params: any[] = [];

  for (const key of allowed) {
    if (key in input) {
      sets.push(`${key} = ?`);
      params.push(
        key === 'is_active' ? (input[key] ? 1 : 0) : input[key] ?? null
      );
    }
  }
  if (input.password) {
    sets.push('password_hash = ?');
    params.push(await bcrypt.hash(input.password, 10));
  }
  if (!sets.length) return getUser(id);

  await executeQuery(
    `UPDATE users SET ${sets.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [...params, id]
  );
  return getUser(id);
}

export async function deleteUser(id: number) {
  const res = await executeQuery(`DELETE FROM users WHERE id = ?`, [id]);
  return (res as any).affectedRows > 0;
}

export async function toggleUserActive(id: number, is_active: boolean) {
  await executeQuery(
    `UPDATE users SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
    [is_active ? 1 : 0, id]
  );
  return getUser(id);
}
